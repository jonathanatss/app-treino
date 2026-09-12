begin;

alter table public.user_audit_logs
  drop constraint if exists user_audit_logs_event_name_check;

alter table public.user_audit_logs
  add constraint user_audit_logs_event_name_check check (event_name in (
    'login', 'workout_started', 'workout_completed', 'set_completed',
    'workout_set_completed', 'body_measurement_updated', 'exercise_variant_changed'
  ));

create or replace function public.ingest_telemetry(batch jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  s jsonb := batch -> 'session';
  e jsonb;
  safe_payload jsonb;
  accepted integer := 0;
  sid uuid;
  occurred timestamptz;
begin
  if uid is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if jsonb_typeof(batch) <> 'object' or jsonb_typeof(coalesce(batch -> 'events', '[]'::jsonb)) <> 'array' then raise exception 'invalid batch'; end if;
  if jsonb_array_length(coalesce(batch -> 'events', '[]'::jsonb)) > 100 then raise exception 'batch too large'; end if;

  if s is not null and jsonb_typeof(s) = 'object' then
    sid := (s ->> 'id')::uuid;
    insert into public.user_app_sessions
      (id, user_id, started_at, last_active_at, ended_at, active_seconds, app_version, platform)
    values (
      sid, uid, (s ->> 'started_at')::timestamptz, (s ->> 'last_active_at')::timestamptz,
      nullif(s ->> 'ended_at', '')::timestamptz,
      least(greatest(coalesce((s ->> 'active_seconds')::integer, 0), 0), 86400),
      left(s ->> 'app_version', 40), left(s ->> 'platform', 40)
    )
    on conflict (id) do update set
      last_active_at = greatest(public.user_app_sessions.last_active_at, excluded.last_active_at),
      ended_at = coalesce(excluded.ended_at, public.user_app_sessions.ended_at),
      active_seconds = greatest(public.user_app_sessions.active_seconds, excluded.active_seconds)
    where public.user_app_sessions.user_id = uid;
  end if;

  for e in select value from jsonb_array_elements(coalesce(batch -> 'events', '[]'::jsonb)) loop
    if (e ->> 'event_name') not in ('login','workout_started','workout_completed','set_completed','workout_set_completed','body_measurement_updated','exercise_variant_changed') then
      continue;
    end if;
    occurred := (e ->> 'occurred_at')::timestamptz;
    if occurred < now() - interval '90 days' or occurred > now() + interval '5 minutes' then continue; end if;
    select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) into safe_payload
    from jsonb_each(coalesce(e -> 'payload', '{}'::jsonb))
    where key = any (array['profile_key','workout_key','workout_title','exercise_key','exercise_name',
      'variant_key','previous_variant_key','set_number','load_kg','reps','target_rir','actual_rir',
      'total_sets','exercise_count','volume_kg','duration_seconds','fields']);
    insert into public.user_audit_logs (id, user_id, app_session_id, event_name, occurred_at, payload)
    values ((e ->> 'id')::uuid, uid,
      case when exists (select 1 from public.user_app_sessions us where us.id = nullif(e ->> 'app_session_id', '')::uuid and us.user_id = uid)
        then nullif(e ->> 'app_session_id', '')::uuid else null end,
      e ->> 'event_name', occurred, safe_payload)
    on conflict (id) do nothing;
    accepted := accepted + 1;
  end loop;
  return jsonb_build_object('accepted', accepted);
end;
$$;

revoke all on function public.ingest_telemetry(jsonb) from public, anon;
grant execute on function public.ingest_telemetry(jsonb) to authenticated;

-- Qualify profile columns to avoid collisions with the output-column variables
-- created by RETURNS TABLE in PL/pgSQL.
create or replace function public.admin_user_engagement(inactive_after_days integer default 7)
returns table (
  user_id uuid, display_name text, role text, last_login_at timestamptz,
  last_active_at timestamptz, last_session_active_seconds integer,
  sessions_30d bigint, active_seconds_30d bigint, inactive_days integer
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = (select auth.uid())
      and admin_profile.active
      and admin_profile.role = 'admin'
  ) then
    raise exception 'admin required' using errcode = '42501';
  end if;
  return query
  select p.id, p.display_name, p.role, login.last_login_at, activity.last_active_at,
    activity.last_session_active_seconds, activity.sessions_30d, activity.active_seconds_30d,
    case when activity.last_active_at is null then null else floor(extract(epoch from (now() - activity.last_active_at)) / 86400)::integer end
  from public.profiles p
  left join lateral (
    select max(l.occurred_at) as last_login_at from public.user_audit_logs l
    where l.user_id = p.id and l.event_name = 'login'
  ) login on true
  left join lateral (
    select max(s.last_active_at) as last_active_at,
      (array_agg(s.active_seconds order by s.last_active_at desc))[1] as last_session_active_seconds,
      count(*) filter (where s.started_at >= now() - interval '30 days') as sessions_30d,
      coalesce(sum(s.active_seconds) filter (where s.started_at >= now() - interval '30 days'), 0)::bigint as active_seconds_30d
    from public.user_app_sessions s where s.user_id = p.id
  ) activity on true
  where p.active and p.role = 'athlete'
    and (activity.last_active_at is null or activity.last_active_at < now() - make_interval(days => greatest(inactive_after_days, 0)))
  order by activity.last_active_at asc nulls first;
end;
$$;

revoke all on function public.admin_user_engagement(integer) from public, anon;
grant execute on function public.admin_user_engagement(integer) to authenticated;

commit;
