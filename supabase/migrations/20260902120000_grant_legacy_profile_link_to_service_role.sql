begin;

-- The admin Netlify function (service_role) needs to read and update profiles
-- when linking a new account to a legacy profile key on approval.
-- Without these privileges the PATCH request against /rest/v1/profiles returns
-- an empty result set and the UI shows a misleading "already linked" error.
--
-- Grant is intentionally column-scoped: the backend never needs to write
-- role, created_at, notifications_enabled, avatar_url, or bio through this path.
grant select on table public.profiles to service_role;
grant update (display_name, active, legacy_profile_key, updated_at) on table public.profiles to service_role;

commit;
