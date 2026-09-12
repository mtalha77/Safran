-- Persist delivery_address (incl. optional locationUrl) on cash checkout.

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
    delivery_address,
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
    case
      when p_order ? 'delivery_address'
        and jsonb_typeof(p_order -> 'delivery_address') = 'object'
      then p_order -> 'delivery_address'
      else null
    end,
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
