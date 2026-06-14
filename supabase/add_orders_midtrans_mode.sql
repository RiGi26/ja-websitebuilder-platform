-- Ikat tiap order ke environment Midtrans saat transaksinya dibuat (sandbox|production).
-- Webhook & poll status memverifikasi/menanyai pakai mode INI, bukan toggle current —
-- mencegah notifikasi sandbox menyelesaikan order produksi (cross-env), dan menjaga
-- transaksi in-flight tetap benar saat mode di-switch dari /admin.
-- Nullable: order lama (pra-fitur) bernilai null → diperlakukan sebagai mode legacy
-- (NEXT_PUBLIC_MIDTRANS_ENV).
alter table public.orders
  add column if not exists midtrans_mode text
  check (midtrans_mode is null or midtrans_mode in ('sandbox','production'));

comment on column public.orders.midtrans_mode is
  'Environment Midtrans saat transaksi order ini dibuat (sandbox|production). Dipakai webhook & confirm untuk verifikasi/poll terhadap key yang benar. Null = order legacy pra-toggle.';
