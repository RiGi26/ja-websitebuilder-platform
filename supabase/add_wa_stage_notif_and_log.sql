-- WA notif tahap-lanjut (payment_confirmed + order_shipped) + observabilitas keandalan.
-- APPLIED to WB Supabase via MCP migration `add_wa_stage_notif_and_log`.
-- Konteks: lengkapi loop notifikasi WA per metode bayar (struk → pembayaran terkonfirmasi →
-- dikirim+resi) + rekam tiap kirim WA agar kegagalan tak hening (gejala "transfer tak dapat WA").

-- 1. order_projection: simpan nomor pembeli (utk WA tahap-lanjut) + penanda dedupe per-tahap.
alter table public.order_projection
  add column if not exists pembeli_telp       text,
  add column if not exists wa_paid_sent_at    timestamptz,
  add column if not exists wa_shipped_sent_at timestamptz;

comment on column public.order_projection.pembeli_telp is
  'Nomor WA pembeli (dipersist saat order create) — dipakai mengirim WA tahap-lanjut (pembayaran terkonfirmasi, dikirim). Order pra-fitur: NULL → WA tahap-lanjut dilewati.';
comment on column public.order_projection.wa_paid_sent_at is
  'Set saat WA payment_confirmed terkirim — dedupe agar tak dobel saat push status berulang/reconcile.';
comment on column public.order_projection.wa_shipped_sent_at is
  'Set saat WA order_shipped (resi) terkirim — dedupe agar tak dobel.';

-- 2. wa_log: rekam tiap percobaan kirim WA (observabilitas keandalan). Service-role only.
create table if not exists public.wa_log (
  id            uuid primary key default gen_random_uuid(),
  order_code    text,
  tenant_slug   text,
  event         text not null,        -- order_receipt · order_admin · payment_confirmed · order_shipped
  target_masked text,                 -- nomor tersamar (mis. 6281****5678)
  ok            boolean not null,
  error         text,
  created_at    timestamptz not null default now()
);
create index if not exists idx_walog_order   on public.wa_log(order_code);
create index if not exists idx_walog_created  on public.wa_log(created_at desc);

alter table public.wa_log enable row level security;
revoke all on table public.wa_log from anon, authenticated;
