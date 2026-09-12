-- Enable live order inserts for the admin kitchen alert (Supabase Realtime).
-- Safe if already added: ignore duplicate_object.

do $$
begin
  alter publication supabase_realtime add table public.orders;
exception
  when duplicate_object then null;
  when undefined_object then
    raise notice 'supabase_realtime publication missing — enable Realtime in the dashboard';
end $$;
