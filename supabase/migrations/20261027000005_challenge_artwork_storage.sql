-- Storage policy for curated example artwork.
--
-- The `challenge-artwork` bucket is created as PRIVATE (not Supabase's
-- "public bucket" toggle). A public bucket serves any object via a signed
-- or public URL with NO row-level security check at all, which would risk
-- exposing unpublished artwork the moment an object key leaked or was
-- guessed. Instead, every read goes through storage.objects RLS below, so
-- anonymous visitors can only ever read artwork that belongs to a
-- currently PUBLISHED challenge — unpublishing a challenge immediately
-- revokes public read access to its images, with no code changes needed.
--
-- Object path convention (enforced by convention + admin upload code, not
-- by a database constraint): `{challenge_id}/{artwork_id}-{filename}`.
-- `challenge_artworks.storage_path` (previous migration) stores this same
-- path, and storage.foldername(name) is used below to recover the
-- challenge id from the object key.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'challenge-artwork',
  'challenge-artwork',
  false,
  10485760, -- 10 MiB per file
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "public_read_published_challenge_artwork"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id = 'challenge-artwork'
    and (
      public.is_admin()
      or exists (
        select 1 from public.challenges c
        where c.id::text = (storage.foldername(name))[1]
          and c.status = 'published'
      )
    )
  );

create policy "admin_upload_challenge_artwork"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'challenge-artwork' and public.is_admin());

create policy "admin_update_challenge_artwork"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'challenge-artwork' and public.is_admin())
  with check (bucket_id = 'challenge-artwork' and public.is_admin());

create policy "admin_delete_challenge_artwork"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'challenge-artwork' and public.is_admin());
