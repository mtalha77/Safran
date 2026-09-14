-- Per-dish percentage discount.
-- `price` stays the regular price so the storefront can strike it through; the
-- reduced price is derived from `discount_percent` on the server, which is what
-- order totals, receipts and printed bills charge. 0 means no discount.

begin;

alter table public.menu_items
  add column if not exists discount_percent numeric(5, 2) not null default 0;

alter table public.menu_items
  drop constraint if exists menu_items_discount_percent_check;

alter table public.menu_items
  add constraint menu_items_discount_percent_check
  check (discount_percent >= 0 and discount_percent <= 99);

commit;
