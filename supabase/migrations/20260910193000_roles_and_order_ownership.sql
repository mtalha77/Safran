-- Purpose
--   Prepares the database for the three planned clients (restaurant/admin web,
--   customer app, rider app) without changing how the current site behaves.
--
--   1. Adds the future role values to `public.app_role`.
--   2. Teaches `public.is_admin()` about the new administrator roles.
--   3. Adds `public.can_manage_orders()` and order policies for kitchen staff.
--   4. Lets `public.create_cash_order` store the ordering customer's user id.
--
-- Impact
--   Purely additive. No column, policy, function or enum value is dropped and
--   no row is modified. Existing `admin` profiles keep every permission they
--   have today because `is_admin()` still accepts the legacy `admin` value.
--   Until a profile is explicitly given one of the new roles, nothing changes.
--
-- Rollback
--   Enum values cannot be removed in PostgreSQL. Reverting means restoring the
--   previous `is_admin()` body, dropping the three staff policies added below,
--   and restoring the previous `create_cash_order` definition.

-- 1. New role values. `admin` is kept so existing profiles stay valid; the
--    application treats it as `restaurant_admin`.
alter type public.app_role add value if not exists 'restaurant_staff';
alter type public.app_role add value if not exists 'restaurant_admin';
alter type public.app_role add value if not exists 'rider';
alter type public.app_role add value if not exists 'platform_admin';

-- 2. Full administrative access. Compared as text so this migration does not
--    have to read the enum values it just added.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role::text in ('admin', 'restaurant_admin', 'platform_admin')
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 3. Order handling for kitchen staff: they work the order queue but must not
--    touch the menu, settings or profiles. Which individual status transitions
--    a role may perform is enforced by the application's order lifecycle.
create or replace function public.can_manage_orders()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role::text in (
        'admin',
        'restaurant_admin',
        'platform_admin',
        'restaurant_staff'
      )
  );
$$;

revoke all on function public.can_manage_orders() from public;
grant execute on function public.can_manage_orders() to authenticated;

drop policy if exists "Order staff read orders" on public.orders;
create policy "Order staff read orders"
  on public.orders for select
  to authenticated
  using (public.can_manage_orders());

drop policy if exists "Order staff advance orders" on public.orders;
create policy "Order staff advance orders"
  on public.orders for update
  to authenticated
  using (public.can_manage_orders())
  with check (public.can_manage_orders());

drop policy if exists "Order staff read order items" on public.order_items;
create policy "Order staff read order items"
  on public.order_items for select
  to authenticated
  using (public.can_manage_orders());

drop policy if exists "Order staff read status history" on public.order_status_events;
create policy "Order staff read status history"
  on public.order_status_events for select
  to authenticated
  using (public.can_manage_orders());

drop policy if exists "Order staff record status changes" on public.order_status_events;
create policy "Order staff record status changes"
  on public.order_status_events for insert
  to authenticated
  with check (public.can_manage_orders());

-- 4. Link an order to its customer when one is signed in. `user_id` is optional
--    and stays null for guest checkout, so the existing anonymous flow is
--    unaffected. The customer app needs this to list "my orders" under the
--    existing `orders.user_id = auth.uid()` policy.
create or replace function public.create_cash_order(p_order jsonb, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  created public.orders;
begin
  insert into public.orders (
    order_number,
    confirmation_token,
    idempotency_key,
    user_id,
    status,
    fulfillment_type,
    payment_status,
    payment_method,
    accepted_no_cancellation,
    customer_name,
    customer_email,
    customer_phone,
    address_line1,
    address_line2,
    postal_code,
    city,
    customer_notes,
    subtotal,
    delivery_fee,
    total,
    currency
  )
  values (
    p_order ->> 'order_number',
    (p_order ->> 'confirmation_token')::uuid,
    p_order ->> 'idempotency_key',
    nullif(p_order ->> 'user_id', '')::uuid,
    (p_order ->> 'status')::public.order_status,
    (p_order ->> 'fulfillment_type')::public.fulfillment_type,
    (p_order ->> 'payment_status')::public.payment_status,
    p_order ->> 'payment_method',
    coalesce((p_order ->> 'accepted_no_cancellation')::boolean, false),
    p_order ->> 'customer_name',
    p_order ->> 'customer_email',
    p_order ->> 'customer_phone',
    p_order ->> 'address_line1',
    p_order ->> 'address_line2',
    p_order ->> 'postal_code',
    p_order ->> 'city',
    p_order ->> 'customer_notes',
    (p_order ->> 'subtotal')::numeric,
    (p_order ->> 'delivery_fee')::numeric,
    (p_order ->> 'total')::numeric,
    coalesce(p_order ->> 'currency', 'CHF')
  )
  returning * into created;

  insert into public.order_items (
    order_id,
    menu_item_id,
    name,
    quantity,
    unit_price,
    line_total,
    notes
  )
  select
    created.id,
    (item ->> 'menu_item_id')::bigint,
    item ->> 'name',
    (item ->> 'quantity')::integer,
    (item ->> 'unit_price')::numeric,
    (item ->> 'line_total')::numeric,
    item ->> 'notes'
  from jsonb_array_elements(p_items) as item;

  insert into public.order_status_events (order_id, from_status, to_status, note)
  values (created.id, null, created.status, 'Bestellung eingegangen');

  return jsonb_build_object(
    'id', created.id,
    'order_number', created.order_number,
    'confirmation_token', created.confirmation_token,
    'status', created.status,
    'total', created.total
  );
exception
  when unique_violation then
    select * into created
    from public.orders
    where idempotency_key = p_order ->> 'idempotency_key';

    if found then
      return jsonb_build_object(
        'id', created.id,
        'order_number', created.order_number,
        'confirmation_token', created.confirmation_token,
        'status', created.status,
        'total', created.total
      );
    end if;
    raise;
end;
$$;

revoke all on function public.create_cash_order(jsonb, jsonb) from public;
grant execute on function public.create_cash_order(jsonb, jsonb) to service_role;
