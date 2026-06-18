# Bakso Tini — Kontrak Integrasi Website ⇄ Portal Operasi (SSOT, Fase 0)

> **Status:** Fase 0 — KONTRAK (blocking). Versi `v1.1` (2026-06-18).
> **Sifat:** Single Source of Truth. Dua sesi/dua repo (Website **WB** = `ja-websitebuilder-platform`, **Portal** = repo+Supabase baru, ref `oyyfcmlquqfrdoffkgsd`) WAJIB build mengikuti dokumen ini.
> **Aturan pakai:** Perubahan apa pun pada model data, kontrak API, token, atau model bayar HARUS lewat dokumen ini dulu (naikkan versi), baru kode. Saat Portal di-scaffold (Fase 2), **copy file ini ke repo Portal** sebagai langkah pertama agar kedua repo memegang kontrak identik.
> **Referensi:** plan teknis `~/.claude/plans/jadi-ada-client-yang-cheerful-pearl.md` · decision note `notes/decisions/2026-06-18-bakso-tini-website-portal-stok-build.md`. Dokumen ini **menggantikan** keduanya sebagai sumber teknis bila ada selisih.
> **v1.1:** mengintegrasikan review adversarial 5-lensa (data-model · API · payment · reuse · security). Lihat changelog.

---

## 0. Ringkasan & arah yang dikunci owner (2026-06-18)

Bakso Tini Japan (bakso frozen, produksi & kirim dari Jepang) butuh **website pesan** (pelanggan) + **portal operasi** (admin: stok-opname, pesanan, produksi, expired, keuangan, gaji, role). Portal dibangun sebagai **produk GENERIC** (gudang/retail/manufaktur); bakso = tenant #1.

**7 keputusan dari brainstorm (plan):**
1. Build NYATA, bertahap (bukan demo).
2. Portal = produk generic baru. Apotek TIDAK digeneralisasi; **angkat POLA**-nya (RLS multi-tenant, batch+expired+pg_cron, `stock_movements`, opname, alert WA, POS offline Dexie) + tambah bahan baku/BOM, batch produksi, multi-pack, pre-order, API stok publik.
3. Paralel 2 sesi/2 repo, kontrak Fase 0 dulu.
4. Website pure-order (struktur `japan-website.html`) + kartu menu kaya + add-on + floating cart + checkout. Bukan marketing.
5. Bayar **MANUAL + COD** (DROP Midtrans). 5 metode (§7). 代引き/着払い = fitur **kurir**, bukan gateway.
6. Portal modular: INTI (Inventory/Stok-Opname + Tim&Akses) + MODUL opt-in (Pesanan/Fulfillment · Keuangan/Report · SDM/Gaji).
7. **Order System-of-Record = PORTAL.** Integrasi SATU ARAH (website create→portal; website baca status/stok). Tidak ada sync dua-arah.

**2 keputusan owner tambahan (sesi ini, mengikat kontrak):**
- **D-A · Portal-first.** Portal (API + DB + Supabase baru) adalah target integrasi sejak hari-1. **Bukan** "lokal dulu lalu migrasi". Paralelisme: sesi Website build lawan kontrak ini + **stub** Portal; sesi Portal build yang asli; ketemu di titik integrasi.
- **D-B · Mirror 1-arah portal→WB untuk katalog & stok.** Website baca **mirror lokal** di DB WB (tahan-banting, cepat). Portal **push** katalog+stok ke WB (signed) + reconcile berkala. **Konsekuensi terkunci:** stok mirror bisa **basi** → otoritas stok ada di Portal saat `POST /api/orders` (reserve) → Portal balas **409 stock-conflict** bila stok asli tak cukup → Website tangani "maaf, baru habis".

**Keputusan teknis turunan (dikunci di sini — bukan pertanyaan owner; detail §8/§9):**
1. Mutasi stok **atomik via RPC** Postgres (`FOR UPDATE`), satu transaksi all-or-nothing untuk seluruh order.
2. `quantity` per-lot **otoritatif**; ledger `stock_movement` = audit + rekonsiliasi (Σ on-hand **mengecualikan** RESERVE/RELEASE).
3. Satu namespace helper RLS (`public.*`); saat copy apotek `004`, rewrite referensi `auth.*` → `public.*`.
4. Near-expiry pg_cron + alert WA via **scheduler eksternal** (Bearer `CRON_SECRET`).
5. Pre-order = reserve→consume; PREORDER murni (stok 0) = backorder tanpa `stock_movement` sampai lot diproduksi.
6. **Jalur write = service-role (RLS di-bypass by design)** → RPC sendiri yang resolve `tenant_slug→tenant_id` & assert kepemilikan tenant atas tiap pack/lot/addon. RLS **bukan** pelindung jalur write.
7. **Anti-replay order-create = unique-constraint `(tenant_id, idempotency_key)`** (DB-backed, replay-safe). Nonce-cache HMAC butuh **shared store** (Redis/DB), bukan Map per-instance.
8. `order_projection` **tanpa akses anon**; halaman lacak = server route service-role + whitelist + **exact-token** + rate-limit.

---

## 1. Arsitektur & arah data

```
WEBSITE (WB · Supabase WB)                         PORTAL OPERASI (repo+Supabase BARU · generic)
────────────────────────────────────              ──────────────────────────────────────────────
storefront pure-order (tenant bakso-tini)          ┌─ INTI: Inventory/Stok-Opname
 ├─ kartu menu kaya + add-on + floating cart       │    product · product_pack · raw_material
 ├─ checkout payment-agnostic (manual+COD)         │    bom/bom_items · production_run
 ├─ halaman lacak (server route, by token)         │    production_batch (lot) · stock_movement
 │                                                 │    stock_opname_session · alert WA · POS offline
 ├─ BACA: catalog_mirror (lokal)  ◀── push ───────┤─ INTI: Tim & Akses (tenant/role/RLS)
 ├─ BACA: order_projection (lokal) ◀── push ───────┤─ MODUL: Pesanan/Fulfillment  ◀── (SoR order)
 │                                                 │    order · order_item · order_addon · addon
 └─ WRITE: POST /api/orders ───── live ───────────▶├─ MODUL: Keuangan/Report (omzet = order − HPP)
                                                   └─ MODUL: SDM/Gaji (slip · bonus · potongan)

ARAH DATA (satu arah, portal authoritative):
 • WRITE (live, website→portal):   POST {PORTAL}/api/orders            ……… satu-satunya panggilan write
 • READ  (mirror, portal→website): POST {WB}/api/sync/catalog          ……… push katalog+stok (delta/full)
 • READ  (mirror, portal→website): POST {WB}/api/sync/order-status     ……… push status order
 • RECONCILE (pull, website→portal): GET {PORTAL}/api/catalog?since=   ……… cron WB self-heal webhook hilang
Website TIDAK PERNAH mengubah order/stok/katalog di PORTAL setelah order dibuat. Mirror = proyeksi lokal WB
(WB hanya menulis tabel mirror-nya sendiri: bootstrap order_projection, §4.3 — bukan menulis ke Portal).
```

**Kenapa begini:** Portal pegang kebenaran finansial & stok di balik auth/RLS back-office; Website cuma intake + tampilan (mirror lokal = cepat & tahan portal-down). Order create harus live (write tak bisa di-mirror); semua yang dibaca pelanggan dilayani dari proyeksi lokal WB.

---

## 2. Model data kanonik — PORTAL (Supabase baru, SoR)

DDL acuan (Postgres). Diangkat dari pola apotek `ja-pharmacy-platform/supabase/migrations/001_initial_schema.sql` + `002` (RLS loop) + `004` (JWT hook) — **di-copy, bukan di-import** (project Supabase terpisah).

> **⚠️ Blok DDL di bawah disusun TOPIKAL, bukan urutan apply.** Lihat **§2.7** untuk urutan CREATE yang benar (spine dulu) — beberapa FK menunjuk tabel yang didefinisikan belakangan (mis. `production_run.produced_by → user_profile`, `production_batch.supplier_id → supplier`). Apply mengikuti §2.7, atau migration akan gagal di CREATE TABLE.

### 2.1 Enum

```sql
create type product_kind      as enum ('raw','wip','finished');        -- bahan baku · setengah jadi · jadi
create type lot_source        as enum ('purchase','production');        -- lot dibeli vs lot diproduksi
create type lot_status        as enum ('SELLABLE','NEAR_EXPIRY','EXPIRED','DISPOSED','RETURNED','EMPTY');
create type movement_type     as enum ('IN','OUT','ADJUST','PRODUCE','CONSUME','RESERVE','RELEASE','DISPOSE','RETURN','INITIAL');
create type metode_bayar      as enum ('transfer_jp','transfer_id','paypay','cod_full','cod_ongkir');
create type status_bayar      as enum ('belum_bayar','menunggu_verifikasi','lunas','cod','gagal','refund');
create type status_fulfillment as enum ('menunggu','dikonfirmasi','diproduksi','dikemas','dikirim','selesai','batal');
create type fulfillment_mode  as enum ('IMMEDIATE','PREORDER');         -- ada stok jadi vs diproduksi nanti
create type order_channel     as enum ('website','pos','manual');
```

> **Konvensi `stock_movement.quantity`:** `+ masuk, − keluar` untuk tipe yang **mengubah on-hand** (IN/OUT/ADJUST/PRODUCE/CONSUME/DISPOSE/RETURN/INITIAL). **RESERVE/RELEASE = penanda reservasi (zero-sum), DIKECUALIKAN dari Σ on-hand** rekonsiliasi (§9.2) — keduanya hanya mengubah `reserved_qty`, bukan `quantity`.
> **Pemetaan ke pola apotek:** `medicines`→`product` (+`kind`,`uom`); `medicine_batches`→`production_batch` (lot; `buy_price`→`cost`; status apotek `LAYAK_JUAL/WARNING/DILARANG_JUAL`→`SELLABLE/NEAR_EXPIRY/EXPIRED`); `stock_movements`→`stock_movement` (di-reuse + tambah `PRODUCE/CONSUME/RESERVE/RELEASE`); opname virtual apotek→**tabel sesi nyata** `stock_opname_session` (§9.6).

### 2.2 Katalog: product + pack

```sql
create table product (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenant(id) on delete cascade,
  kind         product_kind not null default 'finished',
  nama         text not null,
  kategori     text,
  deskripsi    text,
  foto_url     text,                       -- diunggah owner via portal (impression-lift terbesar)
  uom          text not null default 'pcs',-- satuan dasar stok (kg utk raw daging/tepung, pcs utk bakso)
  is_active    boolean not null default true,
  deleted_at   timestamptz,                -- soft-delete (pola apotek)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index idx_product_tenant on product(tenant_id) where deleted_at is null;

-- Multi-pack: varian jual (isi/ukuran). Stok SELALU disimpan di base-uom; pack = pengali saat jual.
create table product_pack (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenant(id) on delete cascade,
  product_id   uuid not null references product(id) on delete cascade,
  pack_nama    text not null,              -- 'isi 10' · '1 lusin' · 'pack 500g'
  base_qty     numeric not null default 1, -- berapa base-uom per pack (utk decrement stok)
  berat_gram   integer,                    -- berat kirim (frozen dijual per berat)
  harga        numeric not null,           -- harga jual per pack (¥ JPY utk bakso)
  barcode      text,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (product_id, pack_nama)           -- cegah pack duplikat (→ mirror duplikat)
);
create index idx_pack_product on product_pack(product_id);
create unique index uq_pack_barcode on product_pack(tenant_id, barcode) where barcode is not null; -- POS scan (pola apotek idx_medicines_barcode)
```

### 2.3 Bahan baku, resep/BOM, produksi

```sql
-- raw_material = product dgn kind='raw'. Tabel produksi:
create table bom (                          -- resep utk 1 product finished
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references tenant(id) on delete cascade,
  product_id  uuid not null references product(id) on delete cascade,  -- finished yg dihasilkan
  yield_qty   numeric not null,             -- hasil per batch (mis. 100 pcs)
  yield_uom   text not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
create table bom_item (                     -- komponen resep
  id                   uuid primary key default gen_random_uuid(),
  tenant_id            uuid not null references tenant(id) on delete cascade,
  bom_id               uuid not null references bom(id) on delete cascade,
  component_product_id uuid not null references product(id),            -- raw/wip
  qty_per_yield        numeric not null,
  uom                  text not null
);

create table production_run (               -- 1 kali produksi (header, auditable)
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenant(id) on delete cascade,
  product_id    uuid not null references product(id),
  bom_id        uuid references bom(id),
  produced_qty  numeric not null,
  output_lot_id uuid,                        -- lot hasil; FK ditambah via ALTER setelah production_batch ada (§2.7) — circular run↔batch
  status        text not null default 'planned', -- planned·berjalan·selesai·batal
  produced_by   uuid references user_profile(id),
  started_at    timestamptz,
  finished_at   timestamptz,
  created_at    timestamptz not null default now()
);
-- NOTE: output_lot_id sengaja TANPA inline FK untuk memutus siklus FK (run→batch & batch→run).
--       FK ditambah deferred di §2.7: alter table production_run add constraint fk_run_output_lot ...
```

### 2.4 Lot / batch (stok hidup di sini) + ledger

```sql
-- STOK ADA DI LOT, bukan di product (pola apotek: medicines tak punya quantity).
create table production_batch (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references tenant(id) on delete cascade,
  product_id     uuid not null references product(id) on delete cascade,
  source         lot_source not null,            -- purchase | production
  supplier_id    uuid references supplier(id),    -- diisi jika purchase
  production_run_id uuid references production_run(id), -- diisi jika production
  batch_no       text not null,
  tgl_produksi   date,
  tgl_expired    date,                            -- best-before (frozen) — null jika tak relevan
  qty_awal       numeric not null default 0,      -- qty saat lot dibuat (apotek: qty_produksi)
  quantity       numeric not null default 0,      -- ON-HAND OTORITATIF (mutable; bukan sum ledger)
  reserved_qty   numeric not null default 0,      -- ter-reserve order belum fulfilled
  cost           numeric not null default 0,      -- HPP per base-uom (purchase=harga beli; production=rollup BOM)
  status         lot_status not null default 'SELLABLE',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  check (quantity >= 0),
  check (reserved_qty >= 0 and reserved_qty <= quantity)   -- backstop anti over-reserve (defense-in-depth atas RPC)
);
create index idx_lot_tenant   on production_batch(tenant_id);
create index idx_lot_product  on production_batch(product_id);
create index idx_lot_expiry   on production_batch(tgl_expired)
  where status not in ('DISPOSED','RETURNED','EMPTY');
-- qty_terjual per lot = qty_awal - quantity - reserved_qty (derivable).
-- EMPTY di-set HANYA oleh RPC consume saat quantity→0 (BUKAN oleh cron). Cron aging (§9.4) WAJIB
-- mempertahankan WHERE status NOT IN ('DISPOSED','RETURNED','EMPTY') seperti pola apotek.

-- Ledger append-only (pola apotek stock_movements, sudah domain-neutral).
create table stock_movement (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references tenant(id) on delete cascade,
  product_id  uuid not null references product(id),
  batch_id    uuid not null references production_batch(id),  -- setiap movement ber-lot (NOT NULL)
  type        movement_type not null,
  quantity    numeric not null,               -- konvensi §2.1 (RESERVE/RELEASE zero-sum, excl Σ on-hand)
  ref_type    text,                            -- 'order' · 'opname' · 'production_run' · 'purchase'
  ref_id      uuid,
  note        text,
  created_by  uuid references user_profile(id),
  created_at  timestamptz not null default now()
);
create index idx_mov_tenant  on stock_movement(tenant_id);
create index idx_mov_ref      on stock_movement(ref_type, ref_id);
-- INSERT-only (RLS: no update/delete). on-hand = production_batch.quantity; ledger utk audit & rekonsiliasi.
-- Backorder PREORDER (stok 0) TIDAK menulis stock_movement (tak ada lot) — ditandai di order saja (§10).
```

### 2.5 Add-on, order, order_item, order_addon

```sql
create table addon (                          -- pelengkap (KONSEP BARU; WB belum punya add-on per-produk)
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references tenant(id) on delete cascade,
  nama        text not null,                  -- tetelan · sambal · bawang · mie · ice pack
  harga       numeric not null default 0,     -- harga add-on (TBD per tenant; 0 = gratis mis. ice pack)
  consumes_product_id uuid references product(id), -- opsional: add-on yg potong stok (mis. tetelan)
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table "order" (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references tenant(id) on delete cascade,
  order_code       text not null,             -- human-readable; UNIQUE per tenant (mis. BT-2606-0042)
  channel          order_channel not null default 'website',
  idempotency_key  text,                       -- WAJIB utk channel='website' (§4.1); UNIQUE per tenant
  -- pembeli
  pembeli_nama     text not null,
  pembeli_telp     text not null,              -- +81 (Jepang) — normalisasi phone_cc tenant
  pembeli_email    text,
  pembeli_ig       text,                       -- Instagram handle (kanal diaspora)
  kode_pos         text,                       -- 〒 → autofill alamat
  alamat           text,
  catatan          text,
  -- bayar
  metode_bayar     metode_bayar not null,
  status_bayar     status_bayar not null default 'belum_bayar',
  -- fulfillment
  fulfillment_mode fulfillment_mode not null default 'IMMEDIATE',
  status_fulfillment status_fulfillment not null default 'menunggu',
  tgl_kirim        date,
  resi             text,                       -- nomor resi kurir (Yamato/Sagawa/Japan Post)
  -- uang (lihat §7 utk rumus per metode)
  subtotal         numeric not null default 0, -- barang (item + addon)
  ongkir           numeric not null default 0,
  total_online     numeric not null default 0, -- yang ditagih online (dihitung per metode_bayar)
  total_courier    numeric not null default 0, -- yang ditagih kurir (代引き/着払い), incl biaya_kurir
  total_gross      numeric not null default 0, -- subtotal + ongkir (nilai merchant; EXCL biaya_kurir)
  biaya_kurir      numeric not null default 0, -- 代引き手数料 (daibiki tesuryo) — ditagih kurir, bukan revenue merchant
  -- token
  tracking_token   text not null default encode(gen_random_bytes(16),'hex'),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (tenant_id, order_code),
  unique (tenant_id, idempotency_key)         -- anti-replay order-create (multi NULL diizinkan utk pos/manual)
);
create unique index uq_order_token on "order"(tracking_token);

create table order_item (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenant(id) on delete cascade,
  order_id      uuid not null references "order"(id) on delete cascade,
  product_pack_id uuid not null references product_pack(id),
  nama_snapshot text not null,                 -- nama produk+pack saat order (tahan perubahan katalog)
  qty           numeric not null check (qty > 0),
  harga         numeric not null,              -- harga pack saat order (snapshot)
  hpp           numeric not null default 0,    -- HPP saat order (utk profit; JANGAN dari browser)
  subtotal      numeric not null
);
create table order_addon (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenant(id) on delete cascade,
  order_id      uuid not null references "order"(id) on delete cascade,
  order_item_id uuid references order_item(id) on delete cascade, -- null = add-on level order
  addon_id      uuid not null references addon(id),
  nama_snapshot text not null,
  qty           numeric not null default 1 check (qty > 0),
  harga         numeric not null,
  hpp           numeric not null default 0     -- HPP add-on yg potong stok (consumes_product_id); 0 jika non-stok
);
```

### 2.6 Spine multi-tenant (lift 1:1 dari apotek)

```sql
create table tenant (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, nama text not null,
  phone_cc text not null default '62', currency text not null default 'IDR',
  -- modul aktif (portal modular): jsonb { inventory:true, pesanan:true, keuangan:false, gaji:false }
  modules jsonb not null default '{"inventory":true}'::jsonb,
  created_at timestamptz not null default now()
);
create table user_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,                       -- auth.users
  tenant_id uuid not null references tenant(id) on delete cascade,
  role text not null default 'staff',          -- superadmin·admin·produksi·staff (rename dari apotek)
  is_active boolean not null default true
);
create table tenant_config (
  tenant_id uuid primary key references tenant(id) on delete cascade,
  wa_number text, wa_token text,
  near_expiry_days int[] not null default '{180,90,30}', -- alert milestone (DESAIN BARU; apotek hardcode + 2 boolean, BUKAN lift langsung)
  -- jsonb setelan toko (PO window, jam, kurir default, low_stock_threshold per produk, dll)
  settings jsonb not null default '{}'::jsonb
);
create table supplier (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenant(id) on delete cascade,
  nama text not null, kontak text
);
-- (+ stock_opname_session/_item — §9.6; finance & payroll — Fase 3, di luar kontrak Fase 0)
```

**Bakso = tenant #1:** `tenant.slug='bakso-tini'`, `phone_cc='81'`, `currency='JPY'`, `modules={"inventory":true,"pesanan":true}`. Seed 14 produk + pack + addon + 22 order demo (migrasi, §11).

### 2.7 Urutan apply migration (WAJIB — anti forward-FK)

Apply CREATE mengikuti dependensi (pola terbukti apotek `001` urut tenants→configs→profiles→suppliers→…):

```
1. enum (semua type, §2.1)
2. tenant → user_profile → tenant_config → supplier          (spine, §2.6)
3. product → product_pack                                     (§2.2)
4. bom → bom_item                                             (§2.3)
5. production_run        (output_lot_id TANPA FK dulu)        (§2.3)
6. production_batch      (refs product/supplier/production_run sudah ada)   (§2.4)
7. ALTER TABLE production_run ADD CONSTRAINT fk_run_output_lot
     FOREIGN KEY (output_lot_id) REFERENCES production_batch(id);          (tutup siklus)
8. stock_movement        (refs product/batch/user_profile sudah ada)       (§2.4)
9. addon → "order" → order_item → order_addon                 (§2.5)
10. stock_opname_session → stock_opname_item                  (§9.6)
11. fungsi helper public.get_tenant_id/get_user_role/is_superadmin → RLS loop → JWT hook → pg_cron  (§8/§9)
```

---

## 3. Model data sisi WB — mirror / proyeksi

Tabel di **Supabase WB** yang diisi oleh push Portal (D-B). Storefront & halaman lacak baca dari sini (lokal). **Tanpa akses anon** (§8); dibaca hanya via server route. Bukan ditulis pelanggan.

```sql
-- Mirror katalog+stok (diisi POST /api/sync/catalog). 1 baris per pack.
create table catalog_mirror (
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
  -- ketersediaan (bucket, BUKAN angka stok mentah — hindari bocor data ops):
  avail_status  text not null default 'tersedia', -- tersedia · menipis · habis · preorder
  is_active     boolean not null default true,    -- full-sync menonaktifkan pack yg tak hadir (§4.2)
  synced_at     timestamptz not null default now(),
  primary key (tenant_slug, pack_id)
);
-- Storefront WAJIB filter is_active=true saat render (full-sync hanya menonaktifkan, tak menghapus baris).

-- Proyeksi status order. Halaman lacak baca by token (via server route).
create table order_projection (
  order_code         text primary key,
  tenant_slug        text not null,
  tracking_token     text not null unique,
  pembeli_nama       text,                       -- HANYA nama (tanpa email/telp/alamat penuh — anti PII)
  status_bayar       text not null,
  status_fulfillment text not null,
  metode_bayar       text,
  total_online       numeric,
  total_courier      numeric,
  total_gross        numeric,
  biaya_kurir        numeric,
  ringkasan_items    jsonb,            -- [{nama,qty,harga}] utk tampil di lacak/struk
  resi               text,
  tgl_kirim          date,
  created_at         timestamptz,
  source_updated_at  timestamptz not null,  -- updated_at otoritatif dari Portal — GUARD monotonic upsert (§4.3)
  synced_at          timestamptz not null default now()  -- waktu tulis lokal WB
);
create index idx_proj_token on order_projection(tracking_token);
```

> **Migrasi WB:** `shop_orders` (22 seed demo bakso) tetap utuh untuk tenant cart/toko non-bakso. Bakso pindah SoR ke Portal; `order_projection` = jendela lokal bakso. Lihat §11.

---

## 4. Kontrak API

Base URL: `{PORTAL}` = `https://…portal…` (ref `oyyfcmlquqfrdoffkgsd`), `{WB}` = origin Website. Semua body JSON. Semua panggilan service-to-service **WAJIB signed** (§8). Tabel auth per-endpoint di §8.

### 4.1 WRITE — `POST {PORTAL}/api/orders` (live, website→portal)

Satu-satunya jalur write. Membuat order + reserve stok otoritatif, **dalam SATU RPC transaksional** (§9.1).

**Headers:** `Content-Type: application/json` · `X-JA-Timestamp` · `X-JA-Nonce` · `X-JA-Signature` (HMAC) · `Idempotency-Key` (UUID dari website — **WAJIB** utk channel website).

**Urutan eksekusi RPC (wajib):**
1. **Cek `(tenant_id, idempotency_key)` DULU** — jika ada → **replay**: balas body 201 **asli yang tersimpan** (HTTP **200**), TANPA menyentuh stok. `duplicate` mendahului `stock_conflict`.
2. Resolve `tenant_slug→tenant_id`; assert tiap `product_pack_id`/addon/lot milik tenant itu (§9.7).
3. Baca ulang harga/HPP/stok dari DB Portal (jangan percaya browser; pola `preorder/create`).
4. Hitung `ongkir` otoritatif dari `kode_pos→region` (Portal = sumber; §4.1 catatan ongkir).
5. Reserve **seluruh** items+addons FEFO dalam satu transaksi (all-or-nothing; §9.1/§10). Tak cukup → rollback total → **409 `stock_conflict`** (nol mutasi).
6. Insert order + simpan response payload (untuk replay idempoten).

**Request:**
```jsonc
{
  "tenant_slug": "bakso-tini",
  "pembeli": { "nama": "...", "telp": "+8190...", "email": "...", "ig": "@...",
               "kode_pos": "160-0023", "alamat": "...", "catatan": "..." },
  "metode_bayar": "transfer_jp",          // enum §7
  "fulfillment_mode": "IMMEDIATE",         // atau PREORDER
  "tgl_kirim": "2026-06-27",               // opsional (PO window)
  "items": [
    { "product_pack_id": "uuid", "qty": 2,
      "addons": [ { "addon_id": "uuid", "qty": 1 } ] }
  ],
  "order_addons": [ { "addon_id": "uuid", "qty": 1 } ],  // add-on level order (mis. ice pack)
  "ongkir": 980                            // ESTIMASI website (kode_pos→region); Portal recompute otoritatif
}
```

**Response 201 (sukses) / 200 (replay idempoten — body identik aslinya):**
```jsonc
{ "ok": true, "order_code": "BT-2606-0042", "tracking_token": "a1b2...",
  "status_bayar": "menunggu_verifikasi", "status_fulfillment": "menunggu",
  "metode_bayar": "transfer_jp",
  "total_online": 4960, "total_courier": 0, "total_gross": 4960, "biaya_kurir": 0,
  "instruksi_bayar": { "metode": "transfer_jp", "nominal": 4960, "rekening": "..." } }
```
**Aturan:** `instruksi_bayar.nominal === total_online`. Website **WAJIB** menampilkan `total_*` dari response 201 (BUKAN estimasi sendiri) — jika estimasi ongkir berbeda, 201 = kebenaran.

**Shape response per metode** (thank-you page):
| metode | status_bayar | total_online | total_courier | instruksi_bayar |
|---|---|---|---|---|
| transfer_jp / transfer_id / paypay | `menunggu_verifikasi` | subtotal+ongkir | 0 | rekening/akun + nominal=total_online |
| `cod_full` (代引き) | `cod` | **0** | subtotal+ongkir(+biaya_kurir) | "bayar ke kurir saat barang datang" (tanpa rekening) |
| `cod_ongkir` (着払い) | `menunggu_verifikasi` | subtotal | ongkir | rekening utk barang (nominal=subtotal) + catatan ongkir di kurir |

**Error (jangan buat order; nol mutasi):**
| HTTP | `error` code | Arti | Aksi website |
|---|---|---|---|
| 400 | `invalid_payload` | field wajib kosong/format salah / `Idempotency-Key` absen (website) | tampilkan validasi |
| 401 | `bad_signature` | signature/timestamp/nonce invalid | bug integrasi; log |
| 404 | `unknown_tenant` / `unknown_pack` | slug/pack tak ada | refresh katalog |
| **409** | **`stock_conflict`** | **stok asli < diminta (mirror basi)** | **"maaf, {nama} baru habis" + sarankan PO/refresh** |
| 422 | `closed` | PO window tutup / produk non-aktif | tampilkan pesan |
| 429 | `rate_limited` | rate limit (best-effort, §8) | retry-after |

`409 stock_conflict` body — entri generik (pack ATAU addon), menyertakan `nama` (UX string tak perlu round-trip mirror):
```jsonc
{ "ok": false, "error": "stock_conflict",
  "conflicts": [ { "kind": "pack", "ref_id": "uuid", "nama": "Bakso Urat isi 10", "tersedia": 1, "diminta": 2 },
                 { "kind": "addon", "ref_id": "uuid", "nama": "Tetelan", "tersedia": 0, "diminta": 1 } ] }
```

### 4.2 SYNC PUSH katalog — `POST {WB}/api/sync/catalog` (portal→website)

Portal panggil saat katalog/stok berubah + full snapshot terjadwal. **Setiap reserve/consume/release WAJIB memicu delta-push `avail_status` untuk SEMUA pack dari produk terdampak** (kontensi lintas-pack berbagi lot — §10), bukan hanya saat lewat ambang.

**Request:**
```jsonc
{ "tenant_slug": "bakso-tini", "generated_at": "2026-06-18T09:00:00Z",
  "mode": "full",                         // "full" = ganti semua; "delta" = upsert sebagian
  "products": [
    { "product_id": "uuid", "nama": "Bakso Urat", "kategori": "Bakso", "deskripsi": "...",
      "foto_url": "https://...", "is_active": true,
      "packs": [ { "pack_id": "uuid", "pack_nama": "isi 10", "berat_gram": 500,
                   "harga": 2480, "avail_status": "tersedia" } ] }
  ] }
```
WB upsert ke `catalog_mirror`. `mode:"full"` → tandai pack yang tak hadir `is_active=false` (tak dihapus; storefront filter `is_active=true`). `mode:"delta"` → upsert saja, **JANGAN** menonaktifkan yang absen. Balas `{ "ok": true, "upserted": N }`.

**Error:** `401 bad_signature` · `404 unknown_tenant` · `400 invalid_payload`. Portal retry non-2xx (backoff); reconcile §4.4 = jaring pengaman.

### 4.3 SYNC PUSH status order — `POST {WB}/api/sync/order-status` (portal→website)

Portal panggil tiap status_bayar/status_fulfillment/resi berubah.
```jsonc
{ "tenant_slug": "bakso-tini", "order_code": "BT-2606-0042", "tracking_token": "a1b2...",
  "status_bayar": "lunas", "status_fulfillment": "dikirim",
  "resi": "1234-5678-9012", "tgl_kirim": "2026-06-27", "updated_at": "2026-06-27T02:10:00Z" }
```
WB **upsert dengan GUARD monotonic**: tulis HANYA jika `incoming.updated_at >= order_projection.source_updated_at` (else abaikan = balas `{ ok:true, skipped:true }`). Jika baris belum ada → create-on-upsert. Balas `{ "ok": true }`.
**Error:** `401 bad_signature` · `404 unknown_tenant` · `400 invalid_payload`.

> **Bootstrap proyeksi (single-writer logis via guard monotonic):** saat `POST /api/orders` sukses, **website (server)** menulis baris awal `order_projection` dari response 201 (`source_updated_at = order.created_at`, ringkasan_items dari cart lokal). Push status berikutnya dari Portal selalu ber-`updated_at` ≥ create → guard monotonic menjamin push lebih baru **tak pernah** ter-clobber oleh bootstrap yang telat (lost-update tertutup). Penulisan ini ke tabel mirror WB sendiri — tidak melanggar one-way (WB tak menyentuh Portal).

### 4.4 RECONCILE PULL — `GET {PORTAL}/api/catalog?tenant=bakso-tini&since=<iso>` (website→portal, signed)

Cron WB (mis. tiap jam) menarik snapshot untuk self-heal webhook hilang. **Signing:** karena body kosong, tanda-tangan HMAC meliputi **canonical path+query** (`/api/catalog?since=…&tenant=…` urut kunci) menggantikan `raw_body` (§8) — param `tenant`/`since` ikut ditandatangani.
**Response (envelope eksplisit):**
```jsonc
{ "tenant_slug": "bakso-tini", "mode": "full",   // "full" jika since absen; "delta" jika since ada
  "generated_at": "...", "products": [ /* sama §4.2 */ ] }
```
WB terapkan sesuai `mode` (sama aturan §4.2): **delta TIDAK menonaktifkan pack absen.** Idempotent; bukan jalur baca utama (itu mirror lokal).

### 4.5 Endpoint internal Portal (di luar detail Fase 0)

`/api/admin/*` (auth+role): opname, terima-barang, produksi, verifikasi-bayar, advance-fulfillment, label, finance. Didetailkan Fase 2–3; tak menyentuh kontrak integrasi.

---

## 5. Model tracking-token & halaman lacak

- **Token = kapabilitas 1 order** (rahasia 128-bit, non-enumerable): `encode(gen_random_bytes(16),'hex')` (32 hex) — pola `orders.tracking_token` WB.
- **Hidup di:** `order.tracking_token` (Portal, SoR) **dan** `order_projection.tracking_token` (WB, proyeksi).
- **Lookup (server route, BUKAN anon):** halaman lacak `GET {WB}/track?token=` → **server route pakai service-role admin client** → `.eq('tracking_token', token).maybeSingle()` pada `order_projection`. **EXACT-match saja** — JANGAN port cabang prefix/range 8-char `/api/track` (`route.ts:52-62`); itu membuat token enumerable. Rate-limit (60/min/IP, pola `/api/track`).
- **Whitelist field aman** (yang dikembalikan route): `order_code, status_bayar, status_fulfillment, metode_bayar, ringkasan_items, total_online, total_courier, total_gross, biaya_kurir, resi, tgl_kirim, created_at`. **Jangan** email/telp/HPP/alamat penuh.
- **Tanpa akses anon** ke `order_projection` (no anon SELECT grant) — cegah dump PII (lubang yang ditutup hardening `/api/track`).
- **Catatan supersesi plan:** endpoint lacak sengaja **dipindah** dari `GET {PORTAL}/api/orders/track` (plan) → WB-lokal `order_projection` per D-B (tahan portal-down).

---

## 6. (digabung ke §7)

## 7. Model metode bayar — MANUAL + COD (Midtrans DROP)

5 metode. 代引き/着払い = fitur **kurir** (Yamato/Sagawa/Japan Post, クール便 frozen), **bukan** gateway. Gateway online JP (Komoju/Stripe/PAY.JP) = fase lanjutan, **bukan Midtrans** — verifikasi fee saat commit. (Konfirmasi recon: jalur PO Bakso sudah nol-Midtrans; cutover §11 mengarahkan ke `/api/orders`.)

| `metode_bayar` | Label UI | 区分 | Dibayar online | Ongkir |
|---|---|---|---|---|
| `transfer_jp` | Transfer 銀行振込 (Japan Post Bank) | full ke toko | barang + ongkir | 元払い (online) |
| `transfer_id` | Transfer Bank Indonesia | full ke toko | barang + ongkir | online |
| `paypay` | PayPay (manual / for Business) | full ke toko | barang + ongkir | online |
| `cod_full` | 代引き (daibiki) — bayar ke kurir | COD penuh | **0** | kurir tagih barang+ongkir |
| `cod_ongkir` | 着払い (chakubarai) — ongkir di kurir | ongkir COD | barang | 着払い (kurir) |

**Rumus total (per metode):** `subtotal` = Σ(item harga×qty) + Σ(addon harga×qty). `total_gross = subtotal + ongkir` (nilai merchant; **tidak** termasuk `biaya_kurir`).

```
① full ke toko (transfer_jp | transfer_id | paypay):
     total_online  = subtotal + ongkir ;  total_courier = 0
② 代引き (cod_full):
     total_online  = 0 ;                   total_courier = subtotal + ongkir + biaya_kurir
③ 着払い (cod_ongkir):
     total_online  = subtotal ;            total_courier = ongkir
```
- **`biaya_kurir`** = 代引き手数料 (daibiki tesuryo): ditagih kurir, **bukan** revenue merchant, **di luar** `total_gross`. Fase 0: diisi manual (default 0); auto-calc ditunda (§12).
- **`transfer_id` (Bank Indonesia) & mata uang:** tenant `currency='JPY'`; `total_online` ¥ dikonversi ke IDR pada rate yang dikonfigurasi tenant (`tenant_config.settings`) saat `instruksi_bayar` di-render. (Metode lain tetap ¥.)

**Lifecycle `status_bayar`:**
```
① & ③ (ada porsi online): belum_bayar → menunggu_verifikasi (pelanggan klaim/upload bukti) → lunas (admin verifikasi) | gagal
② (cod_full, online=0):    cod (tetap) → lunas (saat kurir remit dana, opsional finance) | batal
refund: cabang manual dari 'lunas' ATAU dari 'cod' (cod_full pasca-collection yg tak sempat dipromosikan ke lunas)
```
**Lifecycle `status_fulfillment`:** `menunggu` (stok ter-reserve) → `dikonfirmasi` (admin verifikasi bayar/PO) → `diproduksi` (jika PREORDER/stok kurang → trigger production_run) → `dikemas` → `dikirim` (serah kurir + `resi`) → `selesai` | `batal` (release reservation, §10).

---

## 8. Keamanan & auth

**Inventori secret & skema auth per-endpoint:**

| Endpoint | Arah | Skema auth | Secret |
|---|---|---|---|
| `POST {PORTAL}/api/orders` | website→portal | HMAC `X-JA-Signature` + `Idempotency-Key` | `PORTAL_API_SECRET` (di WB) |
| `GET {PORTAL}/api/catalog` (reconcile) | website→portal | HMAC (atas path+query, body kosong) | `PORTAL_API_SECRET` (di WB) |
| `POST {WB}/api/sync/catalog` | portal→website | HMAC `X-JA-Signature` | `WB_INGEST_SECRET` (di Portal) |
| `POST {WB}/api/sync/order-status` | portal→website | HMAC `X-JA-Signature` | `WB_INGEST_SECRET` (di Portal) |
| trigger cron near-expiry / reconcile | internal | **Bearer** `CRON_SECRET` (pg_cron/GH Action tak bisa hitung HMAC) | `CRON_SECRET` (per app) |

- **HMAC-SHA256** atas `timestamp + "\n" + nonce + "\n" + (raw_body ATAU canonical-path+query bila body kosong)`. `X-JA-Timestamp` skew > 5 menit → tolak.
- **Replay-cache nonce WAJIB shared+atomic** (Redis `SETNX` TTL=skew, atau Postgres `used_nonce(nonce pk, expires_at)` INSERT-on-conflict-reject). **JANGAN** andalkan Map per-instance WB (`rate-limit.ts` eksplisit per-instance, bocor lintas-lambda).
- **Anti-replay order-create yang otoritatif = unique `(tenant_id, idempotency_key)`** (DB-backed, replay-safe lintas instance). Nonce-cache jadi lapis utk endpoint `sync/*` & reconcile (yang tak punya idempotency key).
- **Secret hanya server-side env** (Vercel masing-masing repo). service_role Portal hanya runtime server Portal; jangan client/git. anon aman publik.
- **Rate limit = best-effort** (limiter WB in-memory per-instance; lihat `rate-limit.ts`). Untuk anti-abuse nyata, pindah ke shared store (Upstash). Terapkan di `/api/orders`, `/api/sync/*`, `/track`.
- **RLS multi-tenant (Portal):** `tenant_id` di SEMUA tabel + policy `FOR ALL USING (is_superadmin() OR tenant_id = get_tenant_id())` (loop tabel, pola apotek `002`). Append-only (`stock_movement`) policy `FOR INSERT WITH CHECK` saja. JWT hook `custom_access_token_hook` inject `tenant_id`+`role` ke `app_metadata` (pola apotek `004`) — daftarkan manual di Dashboard→Auth→Hooks.
- **⚠️ Jalur write (`/api/orders`, RPC) jalan sebagai SERVICE-ROLE → RLS DI-BYPASS.** RLS **bukan** pelindung jalur ini. Keamanan tenant dijamin **RPC** (§9.7): resolve `tenant_slug→tenant_id`, assert tiap pack/lot/addon milik tenant, set `tenant_id` di semua insert. (Hindari "RLS Silent Failure" apotek: S2S tak punya JWT → `get_tenant_id()` NULL.)
- **Mirror tanpa PII:** `catalog_mirror` nol data pelanggan. `order_projection` simpan `pembeli_nama` saja; **tanpa akses anon** (§5).
- **Public stock = bucket, bukan angka** (`avail_status`) — jangan bocorkan data operasi (kebalikan pola apotek `medicines-cache` authed+no-store).

---

## 9. Keputusan teknis terkunci (turunan — bukan pertanyaan owner)

Diangkat dari gotcha recon pola apotek. **Wajib** diikuti sesi Portal:

1. **Mutasi stok ATOMIK, SATU RPC per order.** Apotek mutasi `quantity` lalu insert movement sebagai 2 panggilan client tanpa transaction → race "stok dobel/tidak berkurang". Portal: SATU fungsi Postgres mengambil `items[]`+`order_addons[]` PENUH, buka transaksi, `SELECT … FOR UPDATE` SEMUA lot terkait, validasi+reserve **all-or-nothing**, insert order+items+movements; gagal mana pun → rollback total (nol phantom-reservation). Berlaku juga: fulfill-consume, opname-adjust, produksi.
2. **`quantity` per-lot = OTORITATIF**; ledger = audit + rekonsiliasi. Job rekonsiliasi membandingkan `quantity` vs Σ ledger **hanya tipe pengubah on-hand** (IN/OUT/ADJUST/PRODUCE/CONSUME/DISPOSE/RETURN/INITIAL) — **RESERVE/RELEASE dikecualikan** (zero-sum reservasi; kalau diikutkan, tiap reservasi terbuka jadi false-positive drift).
3. **Satu namespace helper RLS = `public.*`.** Saat copy apotek `004`, **rewrite** body policy-nya (`auth.is_superadmin/auth.tenant_id` → `public.is_superadmin/public.get_tenant_id`) supaya tak ada referensi ke `auth.*` yang tak didefinisikan (apotek `002` vs `004` drift).
4. **Status lot di-age oleh pg_cron** (`SELLABLE/NEAR_EXPIRY/EXPIRED` dari `tgl_expired`, ambang 30/90 hari — pola apotek `001`). Cron WAJIB `WHERE status NOT IN ('DISPOSED','RETURNED','EMPTY')`. **`EMPTY` di-set HANYA oleh RPC consume** saat `quantity→0`, BUKAN oleh cron. Di SQL/RPC mentah, set status eksplisit (jangan andalkan trik `undefined` supabase-js → NULL melanggar CHECK).
5. **Alert near-expiry/low-stock via WA** (edge function pola `notify-expiry`) **+ scheduler eksternal WAJIB di-wire** (apotek `notify-expiry` TAK self-schedule → diam-diam tak jalan). pg_cron `net.http_post` / GitHub Action + Bearer `CRON_SECRET`. Per-tenant milestone via `tenant_config.near_expiry_days`. pg_cron memicu lewat **Bearer**, bukan HMAC (tak bisa hitung signature dinamis).
6. **Opname = tabel sesi NYATA** (bukan "string hack" apotek): `stock_opname_session(id, tenant_id, started_by, started_at, finished_at, status)` + `stock_opname_item(session_id, batch_id, sistem_qty, fisik_qty, diff)`; `stock_movement` `ref_type='opname', ref_id=session_id`.
7. **Tenant-assert di RPC write.** Karena service-role bypass RLS (§8), RPC `/api/orders` WAJIB: (a) resolve `tenant_id` dari `tenant_slug`; (b) assert SETIAP `product_pack_id`/`addon_id`/lot ber-`tenant_id` sama (tolak payload lintas-tenant); (c) set `tenant_id` di semua baris insert. CHECK tambahan: `qty>0` (sudah di DDL) + cap kuantitas per-order wajar (anti denial-of-inventory).
8. **POS offline (Dexie)** lib `src/lib/offline/db.ts`+`sync.ts` apotek reusable apa-adanya utk counter retail Portal (Fase lanjut). Bukan blocking Fase 0.

---

## 10. Semantik stok & reservasi (FEFO)

- **Ketersediaan publik (mirror):** `avail_status` per pack diturunkan dari `floor(Σ(quantity − reserved_qty) lot SELLABLE non-expired produk ÷ pack.base_qty)`. Ambang: `> low_stock_threshold` → `tersedia`; `> 0` → `menipis`; `= 0` & ada PO window → `preorder`; else `habis`. **`low_stock_threshold`** = `tenant_config.settings.low_stock_threshold` (per produk, fallback default tenant) — WAJIB terdefinisi agar badge "menipis" deterministik antar implementer.
- **Kontensi lintas-pack:** beberapa pack berbagi satu pool lot base-uom; reserve pack besar memengaruhi `avail_status` pack kecil. Karena itu **tiap reserve/consume/release me-recompute & delta-push `avail_status` SEMUA pack produk terdampak** (§4.2), bukan hanya saat lewat ambang.
- **Reserve (saat `POST /api/orders`, SATU RPC atomik all-or-nothing):** butuh base-uom = `qty × pack.base_qty`. FEFO: pilih lot `SELLABLE` urut `tgl_expired` asc, naikkan `reserved_qty` + insert `RESERVE` sampai terpenuhi, untuk SEMUA item+addon dalam satu transaksi. Salah satu tak cukup → rollback total → **409 `stock_conflict`** (nol mutasi). Mode `PREORDER` (stok 0, jual PO) → **tak reserve, tak menulis `stock_movement`** (tak ada lot), catat backorder di order; fulfill setelah produksi yield lot.
- **Consume (saat `dikemas/dikirim`):** turunkan `reserved_qty` & `quantity` lot sama, insert `CONSUME` (−). `quantity→0` → set lot `EMPTY` (RPC). Update report `qty_terjual`.
- **Release (saat `batal`):** turunkan `reserved_qty`, insert `RELEASE` (zero-sum, **bukan** menambah `quantity`; dikecualikan Σ rekonsiliasi §9.2).
- **Stok 0 → PO otomatis:** available pack = 0 & PO window buka → `avail_status='preorder'` → storefront tampilkan tombol PO (bukan sekadar "habis").
- **Add-on potong stok:** `addon.consumes_product_id` non-null (mis. tetelan) → ikut reserve/consume FEFO seperti item; konflik-nya muncul di `stock_conflict.conflicts[]` `kind:'addon'`.

---

## 11. Migrasi / cutover

- **22 order demo bakso** (`shop_orders`, tenant `9b1021d9-…`, `order_kind='preorder'`, `payment_status='not_required'`, dashboard omzet ¥55.1k/profit ¥33.8k) = **SEED DEMO**, bukan sampah. **Migrasi** ke Portal `"order"` saat Fase 2 — JANGAN hapus dari WB sebelum dikonfirmasi pindah.
- **`shop_orders` WB tetap ada** untuk tenant cart/toko non-bakso (path Midtrans). Bakso: SoR pindah ke Portal; WB simpan `order_projection` saja.
- **14 menu_items bakso** → seed `product` + `product_pack` di Portal (1 pack default per item dulu; multi-pack ditambah manual). `menu_items` WB jadi sumber awal `catalog_mirror` sampai push Portal aktif.
- **Cutover storefront:** flag per-tenant `source_of_truth = 'portal'` → SiteRenderer baca `catalog_mirror` (filter `is_active=true`) + checkout POST ke `/api/orders` (bukan `/api/preorder/create`). Tenant FnB lain tetap di jalur lama.
- **Halaman lacak baru** (server route, by token, baca `order_projection`) = bikin baru (recon: belum ada untuk pre-order).

---

## 12. Yang ditunda (di luar kontrak Fase 0)

Gateway online JP (Komoju/Stripe/PAY.JP) · label kirim PDF/QR · tracking ekspedisi terintegrasi (Yamato/Sagawa/Japan Post API) · **代引き手数料 auto-calc** (Fase 0 manual via `biaya_kurir`) · FX rate ¥↔IDR otomatis utk `transfer_id` · MODUL Keuangan detail (Fase 3) · MODUL SDM/Gaji (Fase 3) · POS offline Portal. Kontrak ini cukup untuk Fase 1 (website storefront) + Fase 2 (portal INTI + MODUL Pesanan).

---

## 13. Gerbang verifikasi per fase (evidence-gate)

- **Fase 0 (ini):** kontrak di-review kedua sesi; doc tersimpan di WB + plans folder; di-copy ke repo Portal saat scaffold. ✔ saat owner setujui. (v1.1: lolos review adversarial 5-lensa.)
- **Fase 1 (Website):** order test end-to-end — pilih menu+addon → floating cart → checkout manual+COD → `POST /api/orders` (stub/portal) sukses → `order_projection` terisi → halaman lacak by token jalan; 409 stock_conflict + replay idempoten tertangani. `tsc` + `npm test` (user run lokal, sandbox winmm crash). UAT Playwright preview/prod.
- **Fase 2 (Portal):** sesi opname jalan (tabel sesi nyata); batch expired ter-flag pg_cron; alert WA terkirim (scheduler wired); push katalog→`catalog_mirror` benar (full vs delta); reserve/consume FEFO atomik all-or-nothing (uji race, nol phantom-reservation); nonce shared-store tolak replay; stok 0→PO muncul di storefront.
- **Fase 3:** omzet = order − HPP (incl HPP add-on) cocok; slip gaji benar; label PDF/QR ter-generate; role gating menutup akses.

---

## 14. Peta reuse (terverifikasi recon) & lift

**WB — VERIFIED-EXISTS (extend, bukan bikin ulang):**
- `src/app/[slug]/po/POClient.tsx` (qty stepper, fulfillment, form pembeli, sticky total) → basis storefront pure-order; tambah add-on + floating cart + pilih metode bayar.
- `src/app/api/preorder/create/route.ts` (payment-agnostic, insert lokal, baca harga/HPP server-side, decrement stok, WA admin) → **pola** checkout; di-cutover jadi `POST /api/orders` ke Portal. (Catatan: apotek/preorder dedup balas **200** + id — selaras dengan replay-200 §4.1, bukan 409.)
- `src/app/components/themes/toko-bespoke/WarungRenderer.tsx` + `registry.ts:43` + `SiteRenderer.tsx:83-96` (PO-aware, content-driven, sold-out badge) → **TAPI tak mount cart & tak emit checkout UI** (ordering di halaman `/po` terpisah via `poUrl`); **floating cart + checkout in-page = KERJA BARU**, bukan reuse.
- `src/lib/fonnte.ts` `notifyPreorder` (`preorder_admin` wired; `preorder_receipt` **ada tapi belum di-wire** → kirim struk pembeli = 1 baris).
- `tracking_token` pola + `/api/track` `SELECT_FIELDS` whitelist + rate-limit → halaman lacak baru (**exact-match saja**, JANGAN port cabang prefix/range, §5).

**WB — MISSING (kerja baru):** halaman lacak shop-order by token (server route) · panggilan keluar ke Portal API · floating cart + checkout in-page utk path PO (POClient pakai React state, bukan `CartProvider`).

**Pharmacy — POLA (copy, project Supabase terpisah):** `001_initial_schema.sql` (medicine_batches→production_batch; stock_movements; pg_cron status-age) · `002` (RLS table-loop) · `004` (JWT hook — **rewrite `auth.*`→`public.*` saat copy**, §9.3) · `(dashboard)/stock-opname/*` (UI opname → promote ke tabel sesi §9.6) · `functions/notify-expiry` (+ **wire scheduler**, §9.5) · `lib/offline/db.ts`+`sync.ts` (POS offline) · `api/pos/medicines-cache` (pola read API — **dibalik** jadi anon+bucket utk public stock).
**Catatan gotcha (recon):** mutasi stok apotek **non-atomik** (race) · ledger bukan SoR · opname "string-hack" · `notify-expiry` tak self-schedule · dua namespace RLS · rate-limit per-instance. Semua sudah dimitigasi di §8/§9.

---

## 15. Glosarium (istilah Jepang)

| Istilah | Baca | Arti |
|---|---|---|
| 銀行振込 | ginkō furikomi | transfer bank |
| 代引き | daibiki | COD penuh — kurir tagih barang+ongkir |
| 代引き手数料 | daibiki tesūryō | biaya layanan COD (kolom `biaya_kurir`) |
| 着払い | chakubarai | ongkir dibayar penerima saat antar |
| 元払い | motobarai | ongkir dibayar pengirim (prabayar/online) |
| クール便 | kūru-bin | layanan kurir berpendingin (frozen cold-chain) |
| 〒 / 郵便番号 | yūbin bangō | kode pos (autofill alamat) |

---

*Akhir kontrak v1.1.*

## Changelog
- `v1.1` (2026-06-18) — Integrasi review adversarial 5-lensa (548k token). Fix utama: **§2.7 urutan apply migration** (anti forward-FK) · output_lot_id FK deferred (siklus run↔batch) · `order_addon.hpp` + `order.biaya_kurir` · CHECK qty>0 & quantity/reserved_qty · **idempotency dicek SEBELUM reserve, replay 200 full-body** · **reserve all-or-nothing 1 RPC** · **tenant-assert di RPC service-role** (RLS bukan pelindung write) · **nonce shared-store** + idempotency-unique = anti-replay · `order_projection` no-anon + **exact-token** server route · projection **monotonic-guard** (`source_updated_at`) · reconcile **sign path+query** + semantik full/delta · sync error-table · `avail_status` ambang terdefinisi + recompute lintas-pack · CRON_SECRET + tabel auth per-endpoint · RESERVE/RELEASE dikecualikan Σ rekonsiliasi · relabel `near_expiry_days` (desain baru) · koreksi WarungRenderer (cart=kerja baru) · catatan FX `transfer_id` + refund branch cod.
- `v1.0` (2026-06-18) — Kontrak awal Fase 0. Mengunci D-A (portal-first) + D-B (mirror 1-arah) + 7 keputusan plan. Disusun dari recon 3-agen (kode WB · pola apotek · mockup).
