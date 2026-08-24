begin;

drop policy if exists profiles_select_authenticated on public.profiles;

create policy profiles_select_related
on public.profiles
for select
to authenticated
using (private.can_manage_athlete(id));

comment on policy profiles_select_related on public.profiles is
  'Athletes read only themselves; coaches read assigned athletes; admins read all profiles.';

commit;
