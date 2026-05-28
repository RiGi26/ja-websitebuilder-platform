-- Tambah kolom payment ke tabel orders
alter table public.orders
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists dp_amount integer,
  add column if not exists midtrans_order_id text;

-- Index untuk lookup webhook via midtrans_order_id
create index if not exists orders_midtrans_order_id_idx on public.orders (midtrans_order_id);
