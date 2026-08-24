begin;

select plan(8);

select ok(to_regclass('public.profiles') is not null, 'profiles table exists');
select ok((select relrowsecurity from pg_class where oid = 'public.profiles'::regclass), 'profiles RLS is active');
select ok(
  (select array_agg(policyname::text order by policyname) from pg_policies where schemaname = 'public' and tablename = 'profiles')
    = array['profiles_insert_self', 'profiles_select_related', 'profiles_update_self'],
  'profiles exposes only the expected policies'
);
select ok(
  (select roles::text[] from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_select_related')
    = array['authenticated'],
  'profile reads require authentication'
);
select ok(
  (select cmd = 'SELECT' from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_select_related'),
  'related-profile policy applies only to SELECT'
);
select ok(
  (select qual = 'private.can_manage_athlete(id)' from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_select_related'),
  'profile visibility delegates to the relationship function'
);
select ok(
  has_function_privilege('authenticated', 'private.can_manage_athlete(uuid)', 'EXECUTE'),
  'authenticated users can evaluate profile relationships'
);
select ok(
  (select p.prosecdef from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'private' and p.proname = 'can_manage_athlete'),
  'relationship helper remains SECURITY DEFINER'
);

select * from finish();
rollback;
