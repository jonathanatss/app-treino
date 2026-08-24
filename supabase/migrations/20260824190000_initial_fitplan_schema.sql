begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  avatar_url text,
  bio text check (bio is null or char_length(bio) <= 500),
  role text not null default 'athlete' check (role in ('athlete', 'coach', 'admin')),
  active boolean not null default true,
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coach_assignments (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  athlete_id uuid not null references public.profiles(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (coach_id, athlete_id),
  check (coach_id <> athlete_id)
);

create table public.questionnaire_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text,
  whatsapp text,
  answers jsonb not null default '{}'::jsonb,
  consent_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'approved', 'rejected', 'archived')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (email is not null or whatsapp is not null)
);

create table public.training_plans (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.profiles(id) on delete cascade,
  coach_id uuid references public.profiles(id) on delete set null,
  title text not null check (char_length(title) between 2 and 120),
  goal text,
  methodology text,
  science_rationale text,
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'archived')),
  version integer not null default 1 check (version > 0),
  starts_on date,
  ends_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create table public.workout_days (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.training_plans(id) on delete cascade,
  day_key text not null check (char_length(day_key) between 1 and 50),
  title text not null check (char_length(title) between 1 and 120),
  weekday smallint check (weekday between 0 and 6),
  position smallint not null default 0 check (position >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_id, day_key),
  unique (plan_id, position)
);

create table public.exercise_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 140),
  target_muscles text[] not null default '{}',
  equipment text,
  media_url text,
  instructions jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plan_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_day_id uuid not null references public.workout_days(id) on delete cascade,
  exercise_id uuid not null references public.exercise_catalog(id) on delete restrict,
  position smallint not null default 0 check (position >= 0),
  sets smallint not null check (sets between 1 and 20),
  reps_min smallint check (reps_min between 1 and 200),
  reps_max smallint check (reps_max between 1 and 200),
  rir_min numeric(3,1) check (rir_min between 0 and 10),
  rir_max numeric(3,1) check (rir_max between 0 and 10),
  rest_seconds smallint not null default 90 check (rest_seconds between 0 and 900),
  track_load boolean not null default true,
  coach_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workout_day_id, position),
  check (reps_max is null or reps_min is null or reps_max >= reps_min),
  check (rir_max is null or rir_min is null or rir_max >= rir_min)
);

create table public.plan_exercise_alternatives (
  id uuid primary key default gen_random_uuid(),
  plan_exercise_id uuid not null references public.plan_exercises(id) on delete cascade,
  exercise_id uuid not null references public.exercise_catalog(id) on delete restrict,
  label text,
  position smallint not null default 0 check (position >= 0),
  reps_min smallint check (reps_min between 1 and 200),
  reps_max smallint check (reps_max between 1 and 200),
  note text,
  created_at timestamptz not null default now(),
  unique (plan_exercise_id, exercise_id),
  unique (plan_exercise_id, position),
  check (reps_max is null or reps_min is null or reps_max >= reps_min)
);

create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workout_day_id uuid references public.workout_days(id) on delete set null,
  status text not null default 'in_progress' check (status in ('planned', 'in_progress', 'completed', 'cancelled')),
  session_date date not null default current_date,
  started_at timestamptz,
  completed_at timestamptz,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  total_volume numeric(14,2) not null default 0 check (total_volume >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workout_exercise_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  plan_exercise_id uuid references public.plan_exercises(id) on delete set null,
  exercise_id uuid not null references public.exercise_catalog(id) on delete restrict,
  position smallint not null default 0 check (position >= 0),
  rest_seconds smallint check (rest_seconds between 0 and 900),
  personal_note text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (session_id, position)
);

create table public.workout_set_logs (
  id uuid primary key default gen_random_uuid(),
  exercise_log_id uuid not null references public.workout_exercise_logs(id) on delete cascade,
  set_number smallint not null check (set_number between 1 and 50),
  load_kg numeric(8,2) check (load_kg is null or load_kg >= 0),
  reps smallint check (reps is null or reps between 0 and 500),
  rir numeric(3,1) check (rir is null or rir between 0 and 10),
  completed_at timestamptz not null default now(),
  unique (exercise_log_id, set_number)
);

create table public.workout_checkins (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.workout_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  workout_title text not null check (char_length(workout_title) between 1 and 120),
  exercise_count smallint not null default 0 check (exercise_count >= 0),
  duration_minutes smallint check (duration_minutes is null or duration_minutes >= 0),
  checked_in_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  measured_on date not null,
  weight_kg numeric(6,2) check (weight_kg is null or weight_kg > 0),
  body_fat_percent numeric(5,2) check (body_fat_percent is null or body_fat_percent between 0 and 100),
  arms_cm numeric(6,2) check (arms_cm is null or arms_cm > 0),
  chest_cm numeric(6,2) check (chest_cm is null or chest_cm > 0),
  waist_cm numeric(6,2) check (waist_cm is null or waist_cm > 0),
  thighs_cm numeric(6,2) check (thighs_cm is null or thighs_cm > 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, measured_on)
);

create table public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null unique,
  captured_on date not null,
  category text check (category is null or category in ('front', 'side', 'back', 'other')),
  notes text,
  created_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'direct' check (kind in ('direct', 'group')),
  title text check (title is null or char_length(title) between 1 and 120),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  member_role text not null default 'member' check (member_role in ('member', 'admin')),
  joined_at timestamptz not null default now(),
  last_read_at timestamptz,
  primary key (conversation_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  type text not null check (char_length(type) between 2 and 50),
  title text not null check (char_length(title) between 1 and 160),
  body text,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index coach_assignments_athlete_idx on public.coach_assignments (athlete_id) where active;
create index questionnaire_status_created_idx on public.questionnaire_submissions (status, created_at desc);
create index training_plans_athlete_status_idx on public.training_plans (athlete_id, status);
create index workout_days_plan_position_idx on public.workout_days (plan_id, position);
create index plan_exercises_day_position_idx on public.plan_exercises (workout_day_id, position);
create index exercise_catalog_name_idx on public.exercise_catalog (lower(name));
create index workout_sessions_user_date_idx on public.workout_sessions (user_id, session_date desc);
create index workout_sessions_completed_idx on public.workout_sessions (completed_at desc) where status = 'completed';
create index workout_exercise_logs_session_idx on public.workout_exercise_logs (session_id, position);
create index workout_set_logs_exercise_idx on public.workout_set_logs (exercise_log_id, set_number);
create index workout_checkins_feed_idx on public.workout_checkins (checked_in_at desc);
create index body_measurements_user_date_idx on public.body_measurements (user_id, measured_on desc);
create index progress_photos_user_date_idx on public.progress_photos (user_id, captured_on desc);
create index conversation_members_user_idx on public.conversation_members (user_id, conversation_id);
create index messages_conversation_created_idx on public.messages (conversation_id, created_at desc);
create index notifications_user_unread_idx on public.notifications (user_id, created_at desc) where read_at is null;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(coalesce(new.email, 'Usuário'), '@', 1)),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create or replace function private.is_admin_or_coach()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.active and p.role in ('admin', 'coach')
  );
$$;

create or replace function private.can_manage_athlete(athlete uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select athlete = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.active and p.role = 'admin'
    )
    or exists (
      select 1 from public.coach_assignments ca
      where ca.coach_id = (select auth.uid()) and ca.athlete_id = athlete and ca.active
    );
$$;

create or replace function private.can_access_plan(target_plan uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.training_plans tp
    where tp.id = target_plan
      and (tp.athlete_id = (select auth.uid()) or tp.coach_id = (select auth.uid()) or private.can_manage_athlete(tp.athlete_id))
  );
$$;

create or replace function private.can_read_session(target_session uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.workout_sessions ws
    where ws.id = target_session
      and (ws.user_id = (select auth.uid()) or private.can_manage_athlete(ws.user_id))
  );
$$;

create or replace function private.owns_session(target_session uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.workout_sessions ws
    where ws.id = target_session and ws.user_id = (select auth.uid())
  );
$$;

create or replace function private.is_conversation_member(target_conversation uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = target_conversation and cm.user_id = (select auth.uid())
  );
$$;

create or replace function private.can_manage_conversation(target_conversation uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.conversations c
    where c.id = target_conversation and c.created_by = (select auth.uid())
  ) or exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = target_conversation
      and cm.user_id = (select auth.uid())
      and cm.member_role = 'admin'
  );
$$;

revoke execute on all functions in schema private from public, anon, authenticated;
grant execute on function private.is_admin_or_coach() to authenticated;
grant execute on function private.can_manage_athlete(uuid) to authenticated;
grant execute on function private.can_access_plan(uuid) to authenticated;
grant execute on function private.can_read_session(uuid) to authenticated;
grant execute on function private.owns_session(uuid) to authenticated;
grant execute on function private.is_conversation_member(uuid) to authenticated;
grant execute on function private.can_manage_conversation(uuid) to authenticated;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger questionnaires_set_updated_at before update on public.questionnaire_submissions for each row execute function private.set_updated_at();
create trigger plans_set_updated_at before update on public.training_plans for each row execute function private.set_updated_at();
create trigger workout_days_set_updated_at before update on public.workout_days for each row execute function private.set_updated_at();
create trigger exercise_catalog_set_updated_at before update on public.exercise_catalog for each row execute function private.set_updated_at();
create trigger plan_exercises_set_updated_at before update on public.plan_exercises for each row execute function private.set_updated_at();
create trigger workout_sessions_set_updated_at before update on public.workout_sessions for each row execute function private.set_updated_at();
create trigger body_measurements_set_updated_at before update on public.body_measurements for each row execute function private.set_updated_at();
create trigger conversations_set_updated_at before update on public.conversations for each row execute function private.set_updated_at();

alter table public.profiles enable row level security;
alter table public.coach_assignments enable row level security;
alter table public.questionnaire_submissions enable row level security;
alter table public.training_plans enable row level security;
alter table public.workout_days enable row level security;
alter table public.exercise_catalog enable row level security;
alter table public.plan_exercises enable row level security;
alter table public.plan_exercise_alternatives enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_exercise_logs enable row level security;
alter table public.workout_set_logs enable row level security;
alter table public.workout_checkins enable row level security;
alter table public.body_measurements enable row level security;
alter table public.progress_photos enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select, insert on public.profiles to authenticated;
grant update (display_name, avatar_url, bio, notifications_enabled, updated_at) on public.profiles to authenticated;
grant select, insert, update, delete on public.coach_assignments to authenticated;
grant select, insert, update on public.questionnaire_submissions to authenticated;
grant select, insert, update, delete on public.training_plans, public.workout_days, public.exercise_catalog, public.plan_exercises, public.plan_exercise_alternatives to authenticated;
grant select, insert, update, delete on public.workout_sessions, public.workout_exercise_logs, public.workout_set_logs, public.workout_checkins to authenticated;
grant select, insert, update, delete on public.body_measurements, public.progress_photos to authenticated;
grant select, insert, update, delete on public.conversations, public.conversation_members, public.messages to authenticated;
grant select, update on public.notifications to authenticated;

create policy profiles_select_authenticated on public.profiles for select to authenticated using (active or id = (select auth.uid()));
create policy profiles_insert_self on public.profiles for insert to authenticated with check (id = (select auth.uid()) and role = 'athlete');
create policy profiles_update_self on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy assignments_select_related on public.coach_assignments for select to authenticated using (coach_id = (select auth.uid()) or athlete_id = (select auth.uid()) or private.is_admin_or_coach());
create policy assignments_insert_admin on public.coach_assignments for insert to authenticated with check (private.is_admin_or_coach());
create policy assignments_update_admin on public.coach_assignments for update to authenticated using (private.is_admin_or_coach()) with check (private.is_admin_or_coach());
create policy assignments_delete_admin on public.coach_assignments for delete to authenticated using (private.is_admin_or_coach());

create policy questionnaires_select_related on public.questionnaire_submissions for select to authenticated using (user_id = (select auth.uid()) or private.is_admin_or_coach());
create policy questionnaires_insert_self on public.questionnaire_submissions for insert to authenticated with check (user_id = (select auth.uid()));
create policy questionnaires_update_coach on public.questionnaire_submissions for update to authenticated using (private.is_admin_or_coach()) with check (private.is_admin_or_coach());

create policy plans_select_related on public.training_plans for select to authenticated using (athlete_id = (select auth.uid()) or coach_id = (select auth.uid()) or private.can_manage_athlete(athlete_id));
create policy plans_insert_coach on public.training_plans for insert to authenticated with check (private.is_admin_or_coach() and private.can_manage_athlete(athlete_id));
create policy plans_update_coach on public.training_plans for update to authenticated using (private.is_admin_or_coach() and private.can_manage_athlete(athlete_id)) with check (private.is_admin_or_coach() and private.can_manage_athlete(athlete_id));
create policy plans_delete_coach on public.training_plans for delete to authenticated using (private.is_admin_or_coach() and private.can_manage_athlete(athlete_id));

create policy workout_days_select_plan on public.workout_days for select to authenticated using (private.can_access_plan(plan_id));
create policy workout_days_insert_coach on public.workout_days for insert to authenticated with check (private.is_admin_or_coach() and private.can_access_plan(plan_id));
create policy workout_days_update_coach on public.workout_days for update to authenticated using (private.is_admin_or_coach() and private.can_access_plan(plan_id)) with check (private.is_admin_or_coach() and private.can_access_plan(plan_id));
create policy workout_days_delete_coach on public.workout_days for delete to authenticated using (private.is_admin_or_coach() and private.can_access_plan(plan_id));

create policy catalog_select_authenticated on public.exercise_catalog for select to authenticated using (active or private.is_admin_or_coach());
create policy catalog_insert_coach on public.exercise_catalog for insert to authenticated with check (private.is_admin_or_coach());
create policy catalog_update_coach on public.exercise_catalog for update to authenticated using (private.is_admin_or_coach()) with check (private.is_admin_or_coach());
create policy catalog_delete_admin on public.exercise_catalog for delete to authenticated using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy plan_exercises_select_plan on public.plan_exercises for select to authenticated using (exists (select 1 from public.workout_days wd where wd.id = workout_day_id and private.can_access_plan(wd.plan_id)));
create policy plan_exercises_insert_coach on public.plan_exercises for insert to authenticated with check (private.is_admin_or_coach() and exists (select 1 from public.workout_days wd where wd.id = workout_day_id and private.can_access_plan(wd.plan_id)));
create policy plan_exercises_update_coach on public.plan_exercises for update to authenticated using (private.is_admin_or_coach() and exists (select 1 from public.workout_days wd where wd.id = workout_day_id and private.can_access_plan(wd.plan_id))) with check (private.is_admin_or_coach() and exists (select 1 from public.workout_days wd where wd.id = workout_day_id and private.can_access_plan(wd.plan_id)));
create policy plan_exercises_delete_coach on public.plan_exercises for delete to authenticated using (private.is_admin_or_coach() and exists (select 1 from public.workout_days wd where wd.id = workout_day_id and private.can_access_plan(wd.plan_id)));

create policy alternatives_select_plan on public.plan_exercise_alternatives for select to authenticated using (exists (select 1 from public.plan_exercises pe join public.workout_days wd on wd.id = pe.workout_day_id where pe.id = plan_exercise_id and private.can_access_plan(wd.plan_id)));
create policy alternatives_insert_coach on public.plan_exercise_alternatives for insert to authenticated with check (private.is_admin_or_coach() and exists (select 1 from public.plan_exercises pe join public.workout_days wd on wd.id = pe.workout_day_id where pe.id = plan_exercise_id and private.can_access_plan(wd.plan_id)));
create policy alternatives_update_coach on public.plan_exercise_alternatives for update to authenticated using (private.is_admin_or_coach() and exists (select 1 from public.plan_exercises pe join public.workout_days wd on wd.id = pe.workout_day_id where pe.id = plan_exercise_id and private.can_access_plan(wd.plan_id))) with check (private.is_admin_or_coach() and exists (select 1 from public.plan_exercises pe join public.workout_days wd on wd.id = pe.workout_day_id where pe.id = plan_exercise_id and private.can_access_plan(wd.plan_id)));
create policy alternatives_delete_coach on public.plan_exercise_alternatives for delete to authenticated using (private.is_admin_or_coach() and exists (select 1 from public.plan_exercises pe join public.workout_days wd on wd.id = pe.workout_day_id where pe.id = plan_exercise_id and private.can_access_plan(wd.plan_id)));

create policy sessions_select_related on public.workout_sessions for select to authenticated using (user_id = (select auth.uid()) or private.can_manage_athlete(user_id));
create policy sessions_insert_self on public.workout_sessions for insert to authenticated with check (user_id = (select auth.uid()));
create policy sessions_update_self on public.workout_sessions for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy sessions_delete_self on public.workout_sessions for delete to authenticated using (user_id = (select auth.uid()));

create policy exercise_logs_select_session on public.workout_exercise_logs for select to authenticated using (private.can_read_session(session_id));
create policy exercise_logs_insert_session on public.workout_exercise_logs for insert to authenticated with check (private.owns_session(session_id));
create policy exercise_logs_update_session on public.workout_exercise_logs for update to authenticated using (private.owns_session(session_id)) with check (private.owns_session(session_id));
create policy exercise_logs_delete_session on public.workout_exercise_logs for delete to authenticated using (private.owns_session(session_id));

create policy set_logs_select_session on public.workout_set_logs for select to authenticated using (exists (select 1 from public.workout_exercise_logs wel where wel.id = exercise_log_id and private.can_read_session(wel.session_id)));
create policy set_logs_insert_session on public.workout_set_logs for insert to authenticated with check (exists (select 1 from public.workout_exercise_logs wel where wel.id = exercise_log_id and private.owns_session(wel.session_id)));
create policy set_logs_update_session on public.workout_set_logs for update to authenticated using (exists (select 1 from public.workout_exercise_logs wel where wel.id = exercise_log_id and private.owns_session(wel.session_id))) with check (exists (select 1 from public.workout_exercise_logs wel where wel.id = exercise_log_id and private.owns_session(wel.session_id)));
create policy set_logs_delete_session on public.workout_set_logs for delete to authenticated using (exists (select 1 from public.workout_exercise_logs wel where wel.id = exercise_log_id and private.owns_session(wel.session_id)));

create policy checkins_select_authenticated on public.workout_checkins for select to authenticated using (true);
create policy checkins_insert_self on public.workout_checkins for insert to authenticated with check (user_id = (select auth.uid()) and private.owns_session(session_id));
create policy checkins_update_self on public.workout_checkins for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and private.owns_session(session_id));
create policy checkins_delete_self on public.workout_checkins for delete to authenticated using (user_id = (select auth.uid()));

create policy measurements_select_related on public.body_measurements for select to authenticated using (user_id = (select auth.uid()) or private.can_manage_athlete(user_id));
create policy measurements_insert_self on public.body_measurements for insert to authenticated with check (user_id = (select auth.uid()));
create policy measurements_update_self on public.body_measurements for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy measurements_delete_self on public.body_measurements for delete to authenticated using (user_id = (select auth.uid()));

create policy photos_select_related on public.progress_photos for select to authenticated using (user_id = (select auth.uid()) or private.can_manage_athlete(user_id));
create policy photos_insert_self on public.progress_photos for insert to authenticated with check (user_id = (select auth.uid()));
create policy photos_update_self on public.progress_photos for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy photos_delete_self on public.progress_photos for delete to authenticated using (user_id = (select auth.uid()));

create policy conversations_select_member on public.conversations for select to authenticated using (created_by = (select auth.uid()) or private.is_conversation_member(id));
create policy conversations_insert_self on public.conversations for insert to authenticated with check (created_by = (select auth.uid()));
create policy conversations_update_manager on public.conversations for update to authenticated using (private.can_manage_conversation(id)) with check (private.can_manage_conversation(id));
create policy conversations_delete_manager on public.conversations for delete to authenticated using (private.can_manage_conversation(id));

create policy members_select_conversation on public.conversation_members for select to authenticated using (user_id = (select auth.uid()) or private.is_conversation_member(conversation_id));
create policy members_insert_manager on public.conversation_members for insert to authenticated with check (private.can_manage_conversation(conversation_id));
create policy members_update_self_or_manager on public.conversation_members for update to authenticated using (user_id = (select auth.uid()) or private.can_manage_conversation(conversation_id)) with check (user_id = (select auth.uid()) or private.can_manage_conversation(conversation_id));
create policy members_delete_self_or_manager on public.conversation_members for delete to authenticated using (user_id = (select auth.uid()) or private.can_manage_conversation(conversation_id));

create policy messages_select_member on public.messages for select to authenticated using (private.is_conversation_member(conversation_id));
create policy messages_insert_member on public.messages for insert to authenticated with check (sender_id = (select auth.uid()) and private.is_conversation_member(conversation_id));
create policy messages_update_sender on public.messages for update to authenticated using (sender_id = (select auth.uid()) and private.is_conversation_member(conversation_id)) with check (sender_id = (select auth.uid()) and private.is_conversation_member(conversation_id));
create policy messages_delete_sender on public.messages for delete to authenticated using (sender_id = (select auth.uid()) and private.is_conversation_member(conversation_id));

create policy notifications_select_self on public.notifications for select to authenticated using (user_id = (select auth.uid()));
create policy notifications_update_self on public.notifications for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create view public.daily_checkin_feed
with (security_invoker = true)
as
select
  wc.id,
  wc.user_id,
  p.display_name,
  p.avatar_url,
  wc.workout_title,
  wc.exercise_count,
  wc.duration_minutes,
  wc.checked_in_at
from public.workout_checkins wc
join public.profiles p on p.id = wc.user_id
where p.active;

revoke all on public.daily_checkin_feed from anon, authenticated;
grant select on public.daily_checkin_feed to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('progress-photos', 'progress-photos', false, 12582912, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy storage_avatars_read_authenticated on storage.objects for select to authenticated using (bucket_id = 'avatars');
create policy storage_avatars_insert_own on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy storage_avatars_update_own on storage.objects for update to authenticated using (bucket_id = 'avatars' and owner_id = (select auth.uid())::text) with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy storage_avatars_delete_own on storage.objects for delete to authenticated using (bucket_id = 'avatars' and owner_id = (select auth.uid())::text);
create policy storage_progress_read_own on storage.objects for select to authenticated using (bucket_id = 'progress-photos' and owner_id = (select auth.uid())::text);
create policy storage_progress_insert_own on storage.objects for insert to authenticated with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy storage_progress_update_own on storage.objects for update to authenticated using (bucket_id = 'progress-photos' and owner_id = (select auth.uid())::text) with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy storage_progress_delete_own on storage.objects for delete to authenticated using (bucket_id = 'progress-photos' and owner_id = (select auth.uid())::text);

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'workout_checkins') then
    alter publication supabase_realtime add table public.workout_checkins;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'notifications') then
    alter publication supabase_realtime add table public.notifications;
  end if;
end;
$$;

commit;
