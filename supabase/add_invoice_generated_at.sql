-- Invoice generator (tenant → pelanggan). Tambah cache-flag di order_projection.
-- APPLIED to WB Supabase via MCP migration `add_invoice_generated_at_to_order_projection`.
-- NULL = PDF faktur belum dirender; di-set saat lib/invoice/generate menyimpan PDF ke
-- Storage (invoices/<tenant_slug>/<tracking_token>.pdf). Dipakai route /invoice/[token]
-- sebagai penanda cache (skip render ulang) + lacak page (tampilkan tombol unduh).

alter table public.order_projection
  add column if not exists invoice_generated_at timestamptz;

comment on column public.order_projection.invoice_generated_at is
  'Set when a PDF invoice has been rendered+cached to Storage (invoices/<tenant_slug>/<tracking_token>.pdf). NULL = not yet generated; used as cache flag by /invoice/[token].';
