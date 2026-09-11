-- Order alert sound: public storage bucket + site_settings keys.
-- Admin uploads audio; kitchen devices poll and auto-play on new orders.

begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'order-alerts',
  'order-alerts',
  true,
  3145728,
  array[
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/ogg',
    'audio/webm',
    'audio/mp4',
    'audio/x-m4a'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Order alert sounds are publicly readable" on storage.objects;
create policy "Order alert sounds are publicly readable"
  on storage.objects for select
  to public
  using (bucket_id = 'order-alerts');

drop policy if exists "Admins upload order alert sounds" on storage.objects;
create policy "Admins upload order alert sounds"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'order-alerts' and public.is_admin());

drop policy if exists "Admins update order alert sounds" on storage.objects;
create policy "Admins update order alert sounds"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'order-alerts' and public.is_admin())
  with check (bucket_id = 'order-alerts' and public.is_admin());

drop policy if exists "Admins delete order alert sounds" on storage.objects;
create policy "Admins delete order alert sounds"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'order-alerts' and public.is_admin());

insert into public.site_settings (key, value, is_public)
values
  ('order_alert_enabled', 'true'::jsonb, true),
  ('order_alert_sound_path', 'null'::jsonb, true)
on conflict (key) do nothing;

commit;
