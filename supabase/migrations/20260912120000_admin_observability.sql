begin;

create table public.user_app_sessions (
  id uuid primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null,
  last_active_at timestamptz not null,
  ended_at timestamptz,
  active_seconds integer not null default 0 check (active_seconds between 0 and 86400),
  app_version text check (app_version is null or char_length(app_version) <= 40),
  platform text check (platform is null or char_length(platform) <= 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (last_active_at >= started_at),
  check (ended_at is null or ended_at >= started_at)
);

create table public.user_audit_logs (
  id uuid primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  app_session_id uuid references public.user_app_sessions(id) on delete set null,
  event_name text not null check (event_name in (
    'login', 'workout_started', 'workout_completed', 'set_completed',
    'body_measurement_updated', 'exercise_variant_changed'
  )),
  occurred_at timestamptz not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (jsonb_typeof(payload) = 'object'),
  check (pg_column_size(payload) <= 8192)
);

create index user_app_sessions_last_active_idx on public.user_app_sessions (last_active_at desc);
create index user_app_sessions_user_last_active_idx on public.user_app_sessions (user_id, last_active_at desc);
create index user_audit_logs_occurred_idx on public.user_audit_logs (occurred_at desc);
create index user_audit_logs_user_occurred_idx on public.user_audit_logs (user_id, occurred_at desc);
create index user_audit_logs_event_occurred_idx on public.user_audit_logs (event_name, occurred_at desc);

create trigger user_app_sessions_set_updated_at before update on public.user_app_sessions
for each row execute function private.set_updated_at();

alter table public.user_app_sessions enable row level security;
alter table public.user_audit_logs enable row level security;
revoke all on public.user_app_sessions, public.user_audit_logs from anon, authenticated;
grant select on public.user_app_sessions, public.user_audit_logs to authenticated;

create policy user_app_sessions_admin_read on public.user_app_sessions for select to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.active and p.role = 'admin'));
create policy user_audit_logs_admin_read on public.user_audit_logs for select to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.active and p.role = 'admin'));

-- One authenticated RPC is used for both heartbeats and offline event batches.
-- user_id is always derived from auth.uid(); clients cannot submit for another user.
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
    if (e ->> 'event_name') not in ('login','workout_started','workout_completed','set_completed','body_measurement_updated','exercise_variant_changed') then
      continue;
    end if;
    occurred := (e ->> 'occurred_at')::timestamptz;
    if occurred < now() - interval '90 days' or occurred > now() + interval '5 minutes' then continue; end if;
    select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) into safe_payload
    from jsonb_each(coalesce(e -> 'payload', '{}'::jsonb))
    where key = any (array['profile_key','workout_key','workout_title','exercise_key','exercise_name',
      'variant_key','previous_variant_key','set_number','load_kg','reps','total_sets',
      'exercise_count','volume_kg','duration_seconds','fields']);
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

create or replace function public.admin_user_engagement(inactive_after_days integer default 7)
returns table (
  user_id uuid, display_name text, role text, last_login_at timestamptz,
  last_active_at timestamptz, last_session_active_seconds integer,
  sessions_30d bigint, active_seconds_30d bigint, inactive_days integer
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not exists (select 1 from public.profiles where id = (select auth.uid()) and active and role = 'admin') then
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
