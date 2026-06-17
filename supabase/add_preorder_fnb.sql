-- ============================================================
-- F&B Pre-Order (PO) capability — additive, aman untuk tenant live.
-- Applied via Supabase MCP (apply_migration: add_preorder_fnb).
--
-- menu_items: hpp (profit) + stok/sold-out per ronde
-- shop_orders: field PO (order_kind/fulfillment/tracking_token) + payment_status 'not_required'
-- shop_order_items: menu_item_id + hpp_satuan (snapshot profit)
-- realtime: shop_orders ke publication supabase_realtime
--
-- Catatan keamanan: hardening anon-SELECT (revoke hpp/stok dari anon) ada di
-- migrasi TERPISAH `add_preorder_fnb_anon_hardening.sql` yang dijalankan SETELAH
-- kode kolom-eksplisit (fetchMenuItemsByPage) deploy — supaya tidak mematahkan
-- situs resto live yang masih melakukan select('*') via anon.
-- ============================================================

-- 1. menu_items
alter table public.menu_items
  add column if not exists hpp numeric not null default 0,
  add column if not exists stok_harian integer,
  add column if not exists is_sold_out boolean not null default false;

-- 2. shop_orders: field pre-order (semua nullable/defaulted)
alter table public.shop_orders
  add column if not exists order_kind text not null default 'shop',
  add column if not exists fulfillment_type text,
  add column if not exists fulfillment_date date,
  add column if not exists fulfillment_time text,
  add column if not exists tracking_token text;

update public.shop_orders
  set tracking_token = encode(extensions.gen_random_bytes(16), 'hex')
  where tracking_token is null;
alter table public.shop_orders
  alter column tracking_token set default encode(extensions.gen_random_bytes(16), 'hex');
create unique index if not exists shop_orders_tracking_token_key
  on public.shop_orders(tracking_token);

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'shop_orders_order_kind_check') then
    alter table public.shop_orders
      add constraint shop_orders_order_kind_check check (order_kind in ('shop','preorder'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'shop_orders_fulfillment_type_check') then
    alter table public.shop_orders
      add constraint shop_orders_fulfillment_type_check
      check (fulfillment_type is null or fulfillment_type in ('pickup','delivery'));
  end if;
end $$;

-- payment_status: tambah 'not_required' (PO tanpa bayar online, selaras bookings)
alter table public.shop_orders drop constraint if exists shop_orders_payment_status_check;
alter table public.shop_orders add constraint shop_orders_payment_status_check
  check (payment_status = any (array['unpaid','awaiting_payment','paid','failed','expired','not_required']));

-- 3. shop_order_items: line dari menu + snapshot hpp utk profit
alter table public.shop_order_items
  add column if not exists menu_item_id uuid references public.menu_items(id) on delete set null,
  add column if not exists hpp_satuan numeric not null default 0;

-- 4. realtime: shop_orders (idempoten)
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'shop_orders'
  ) then
    alter publication supabase_realtime add table public.shop_orders;
  end if;
end $$;
