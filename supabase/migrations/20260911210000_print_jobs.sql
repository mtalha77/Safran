-- Purpose
--   Queue for kitchen/counter bill printing. Every order gets a print_jobs row
--   before the printer is contacted so failures can be retried and staff can
--   reprint from the dashboard.
--
-- Impact
--   Additive: new enum, table, indexes and RLS. No existing tables change.
--
-- Rollback
--   drop table public.print_jobs;
--   drop type public.print_job_status;

do $$ begin
  create type public.print_job_status as enum (
    'pending',
    'printing',
    'printed',
    'failed',
    'cancelled'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.print_jobs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status public.print_job_status not null default 'pending',
  trigger_source text not null default 'order_created'
    check (trigger_source in ('order_created', 'manual_reprint', 'retry')),
  attempts integer not null default 0 check (attempts >= 0),
  max_attempts integer not null default 5 check (max_attempts > 0),
  next_attempt_at timestamptz not null default now(),
  last_error text,
  printed_at timestamptz,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists print_jobs_order_id_idx
  on public.print_jobs (order_id, created_at desc);

create index if not exists print_jobs_queue_idx
  on public.print_jobs (status, next_attempt_at)
  where status in ('pending', 'failed');

create or replace function public.set_print_jobs_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists print_jobs_set_updated_at on public.print_jobs;
create trigger print_jobs_set_updated_at
  before update on public.print_jobs
  for each row
  execute function public.set_print_jobs_updated_at();

alter table public.print_jobs enable row level security;

drop policy if exists "Admins manage print jobs" on public.print_jobs;
create policy "Admins manage print jobs"
  on public.print_jobs
  for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Order staff read print jobs" on public.print_jobs;
create policy "Order staff read print jobs"
  on public.print_jobs
  for select
  using (public.can_manage_orders());

drop policy if exists "Order staff insert print jobs" on public.print_jobs;
create policy "Order staff insert print jobs"
  on public.print_jobs
  for insert
  with check (public.can_manage_orders());

drop policy if exists "Order staff update print jobs" on public.print_jobs;
create policy "Order staff update print jobs"
  on public.print_jobs
  for update
  using (public.can_manage_orders())
  with check (public.can_manage_orders());
