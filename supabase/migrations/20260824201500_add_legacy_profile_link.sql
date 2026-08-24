begin;

alter table public.profiles
  add column legacy_profile_key text unique
  check (legacy_profile_key is null or legacy_profile_key ~ '^[a-z0-9][a-z0-9_-]{1,49}$');

comment on column public.profiles.legacy_profile_key is
  'Temporary bridge to a profile embedded in the legacy static frontend. Managed only by an administrator.';

commit;
