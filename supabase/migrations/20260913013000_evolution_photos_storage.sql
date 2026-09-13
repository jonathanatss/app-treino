begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('evolution_photos', 'evolution_photos', false, 5242880, array['image/jpeg', 'image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table public.user_evolution_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  measured_on date not null,
  weight_kg numeric(6,2) check (weight_kg is null or weight_kg > 0),
  category text not null default 'other' check (category in ('front', 'side', 'back', 'other')),
  storage_path text not null unique check (storage_path ~ '^[0-9a-f-]{36}/[0-9]{4}-[0-9]{2}-[0-9]{2}/[0-9a-f]{64}\.(webp|jpg)$'),
  file_hash text not null check (file_hash ~ '^[0-9a-f]{64}$'),
  mime_type text not null check (mime_type in ('image/webp', 'image/jpeg')),
  byte_size integer not null check (byte_size between 1 and 5242880),
  width_px integer not null check (width_px between 1 and 1440),
  height_px integer not null check (height_px between 1 and 1440),
  local_photo_id text check (local_photo_id is null or char_length(local_photo_id) <= 160),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, file_hash),
  check ((storage_path like user_id::text || '/%'))
);

create index user_evolution_photos_user_date_idx on public.user_evolution_photos (user_id, measured_on desc);
create trigger user_evolution_photos_set_updated_at before update on public.user_evolution_photos
for each row execute function private.set_updated_at();

alter table public.user_evolution_photos enable row level security;
revoke all on public.user_evolution_photos from anon, authenticated;
grant select, insert, update, delete on public.user_evolution_photos to authenticated;

create policy evolution_metadata_read_related on public.user_evolution_photos for select to authenticated
using (user_id = (select auth.uid()) or private.can_manage_athlete(user_id));
create policy evolution_metadata_insert_athlete on public.user_evolution_photos for insert to authenticated
with check (
  user_id = (select auth.uid())
  and storage_path like (select auth.uid())::text || '/%'
  and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.active and p.role = 'athlete')
);
create policy evolution_metadata_update_self on public.user_evolution_photos for update to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and storage_path like (select auth.uid())::text || '/%');
create policy evolution_metadata_delete_self on public.user_evolution_photos for delete to authenticated
using (user_id = (select auth.uid()));

create policy storage_evolution_read_related on storage.objects for select to authenticated
using (
  bucket_id = 'evolution_photos'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or private.can_manage_athlete(((storage.foldername(name))[1])::uuid)
  )
);
create policy storage_evolution_insert_athlete on storage.objects for insert to authenticated
with check (
  bucket_id = 'evolution_photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.active and p.role = 'athlete')
);
create policy storage_evolution_update_self on storage.objects for update to authenticated
using (bucket_id = 'evolution_photos' and owner_id = (select auth.uid())::text)
with check (bucket_id = 'evolution_photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy storage_evolution_delete_self on storage.objects for delete to authenticated
using (bucket_id = 'evolution_photos' and owner_id = (select auth.uid())::text);

commit;
