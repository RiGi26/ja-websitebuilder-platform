-- Environment Midtrans transaksi PELUNASAN, terpisah dari DP (midtrans_mode).
-- DP dan pelunasan adalah dua transaksi berbeda yang bisa dibuat di environment
-- berbeda bila admin men-switch mode di antaranya — satu kolom tak cukup. Webhook
-- -LUNAS memverifikasi terhadap kolom ini; webhook DP terhadap midtrans_mode.
alter table public.orders
  add column if not exists pelunasan_midtrans_mode text
  check (pelunasan_midtrans_mode is null or pelunasan_midtrans_mode in ('sandbox','production'));

comment on column public.orders.pelunasan_midtrans_mode is
  'Environment Midtrans saat transaksi pelunasan dibuat (sandbox|production). Dipisah dari midtrans_mode (DP) supaya flip mode di antara DP & pelunasan tak merusak verifikasi webhook keduanya.';
