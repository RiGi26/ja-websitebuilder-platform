-- Bakso Tini Fase 1 (Website storefront) — WB-side mirror/projection + Fase-1 Portal stub store.
-- APPLIED to WB Supabase (chjgijlwhozeevrvhejt) via MCP migration `bakso_f1_mirror_projection_stub`.
-- SSOT: BAKSO_PORTAL_CONTRACT.md v1.1 §3 (mirror/projection) + §11 (cutover).
-- All tables: RLS enabled, NO policy (deny-all anon/authenticated), service-role bypasses;
-- anon/authenticated privileges explicitly revoked. Storefront + lacak read these via
-- server-side service-role only (contract §3/§8 "Tanpa akses anon").

-- ── 1. catalog_mirror (contract §3): WB-local mirror of Portal catalog+stok ──
create table public.catalog_mirror (
  tenant_slug   text not null,
  product_id    uuid not null,
  product_nama  text not null,
  kategori      text,
  deskripsi     text,
  foto_url      text,
  pack_id       uuid not null,
  pack_nama     text not null,
  berat_gram    int,
  harga         numeric not null,
  avail_status  text not null default 'tersedia',  -- tersedia · menipis · habis · preorder
  is_active     boolean not null default true,
  synced_at     timestamptz not null default now(),
  primary key (tenant_slug, pack_id)
);
create index idx_catmirror_slug_active on public.catalog_mirror(tenant_slug) where is_active;

-- ── 2. order_projection (contract §3): proyeksi status order utk halaman lacak ──
create table public.order_projection (
  order_code         text primary key,
  tenant_slug        text not null,
  tracking_token     text not null unique,
  pembeli_nama       text,                          -- HANYA nama (anti-PII)
  status_bayar       text not null,
  status_fulfillment text not null,
  metode_bayar       text,
  total_online       numeric,
  total_courier      numeric,
  total_gross        numeric,
  biaya_kurir        numeric,
  ringkasan_items    jsonb,                         -- [{nama,qty,harga}]
  resi               text,
  tgl_kirim          date,
  jam_kirim          text,                          -- slot jam kirim same-day (cth '18:00〜20:00')
  created_at         timestamptz,
  source_updated_at  timestamptz not null,          -- GUARD monotonic (§4.3, sync Fase 2)
  synced_at          timestamptz not null default now()
);
create index idx_proj_token on public.order_projection(tracking_token);

-- ── 3. portal_stub_orders (FASE 1 ONLY — hapus saat Portal nyata live di Fase 2) ──
create table public.portal_stub_orders (
  tenant_slug     text not null,
  idempotency_key text not null,
  order_code      text not null,
  response        jsonb not null,
  created_at      timestamptz not null default now(),
  primary key (tenant_slug, idempotency_key)
);

-- ── 4. RLS deny-all + revoke anon/authenticated (service-role only) ──
alter table public.catalog_mirror     enable row level security;
alter table public.order_projection   enable row level security;
alter table public.portal_stub_orders enable row level security;
revoke all on table public.catalog_mirror     from anon, authenticated;
revoke all on table public.order_projection   from anon, authenticated;
revoke all on table public.portal_stub_orders from anon, authenticated;

-- ── 5. Seed catalog_mirror dari 14 menu_items bakso-tini (§11). 1 pack/item;
--      product_id = pack_id = menu_items.id. avail_status dari is_sold_out + stok_harian. ──
insert into public.catalog_mirror
  (tenant_slug, product_id, product_nama, kategori, deskripsi, foto_url,
   pack_id, pack_nama, berat_gram, harga, avail_status, is_active, synced_at)
select
  'bakso-tini', mi.id, mi.nama, mi.kategori, mi.deskripsi, mi.gambar_url,
  mi.id, '1 porsi', null, mi.harga,
  case
    when mi.is_sold_out then 'habis'
    when mi.stok_harian is not null and mi.stok_harian = 0 then 'habis'
    when mi.stok_harian is not null and mi.stok_harian <= 5 then 'menipis'
    else 'tersedia'
  end,
  mi.is_active, now()
from public.menu_items mi
where mi.page_id = '2cf2a1e8-41f9-43e7-9dda-6773cdacd98e';

-- ── 6. Cutover flag (§11): bakso-tini → source_of_truth='portal'. ──
update public.landing_pages
set konfigurasi = jsonb_set(konfigurasi, '{source_of_truth}', '"portal"', true)
where slug = 'bakso-tini';

-- Helper (re-seed mirror dari menu_items bila menu berubah sebelum Portal push aktif):
--   delete from public.catalog_mirror where tenant_slug='bakso-tini';
--   <ulang INSERT step 5>
