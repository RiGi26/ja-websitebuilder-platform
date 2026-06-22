# Portal Integration Playbook — menghubungkan website (WB) ke Portal Operasi eksternal

> Peta acuan untuk **membangun / meng-onboard website yang order, stok, dan pembayarannya
> dikelola di Portal Operasi eksternal** (mis. `ja-stock-platform`), bukan di tabel WB.
> Pola ini disebut **"portal cutover"**. Pilot pertama: **Bakso Tini** (`/bakso-tini`).
>
> Dokumen ini = peta tingkat-tinggi + checklist + daftar jebakan. **Kontrak byte-level
> (request/response, HMAC, RPC, status) = SSOT di `BAKSO_PORTAL_CONTRACT.md`** — selalu
> rujuk itu untuk detail wire; jangan duplikat di sini supaya tak drift.

---

## 1. Kapan pakai pola ini

Pakai **portal cutover** bila tenant memenuhi salah satu:

- Punya **sistem operasi/inventory back-office sendiri** (Portal) yang jadi sumber kebenaran stok & pesanan (manufaktur + BOM, batch produksi, FEFO, opname) — bukan toko sederhana.
- Pembayaran **manual + COD** (bukan gateway otomatis di website). Bakso: transfer JP/ID · PayPay · 代引き COD penuh · 着払い ongkir-di-kurir.
- Ingin **satu back-office** mengelola pesanan lintas channel (website + manual + lainnya).

Bila tidak (toko biasa, checkout Midtrans di website, order disimpan di WB) → **JANGAN** pakai pola ini; gunakan jalur WB-native (`hasCart` + `/api/preorder/create` / Midtrans tenant). Lihat `PLAN_ECOMMERCE.md`.

---

## 2. Dua sistem, satu kontrak (prinsip arsitektur)

| | **Website (WB)** | **Portal Operasi (eksternal)** |
|---|---|---|
| Repo | `ja-websitebuilder-platform` | mis. `ja-stock-platform` (`stock.japanarena.id`) |
| Tanggung jawab | tampilan situs + edit konten (Konten/Tampilan/Profil) + **storefront pemesanan** | **System-of-Record** stok, pesanan, produksi, pembayaran, fulfillment |
| Data katalog | cermin **read-only** `catalog_mirror` (¥/JPY) | `product` + `product_pack` + lot (otoritatif) |
| Data order | proyeksi `order_projection` (mirror) | `order` + `order_item` (otoritatif) |

**Aturan emas:** integrasi **SATU ARAH**. Website **create** order ke Portal + **baca** status/katalog via mirror. Website **tidak pernah** jadi otoritas stok/order/bayar untuk tenant ini. Hindari sync 2-arah.

---

## 3. Peta aliran data

```
                 push delta (HMAC, signed)            cron reconcile (HMAC, full)
   PORTAL  ──────────────────────────────────►  WB  ◄──────────────────────────────  PORTAL
 (product/                POST /api/sync/catalog          GET /api/cron/reconcile-catalog
  pack/lot)                       │                                 │
                                  ▼                                 ▼
                          catalog_mirror (WB, ¥, read-only, service-role; no anon)
                                  │
                                  ▼ fetchCatalogMirror(slug)
                       storefront /[slug]  (SiteRenderer cutover block)
                                  │  add-to-cart (usePortalCart)
                                  ▼
                          POST /api/orders  ──(reprice mirror, signed)──►  PORTAL create order
                                  │                                           (FEFO reserve, 409 stock_conflict)
                                  ▼ bootstrap (only 201)
                          order_projection (WB)  +  WA admin/struk
                                  ▲
            POST /api/sync/order-status (Portal→WB, status update)
                                  │
                          /lacak/[token]  (tracking, exact-token, no anon)
```

Pembayaran = **manual + COD** (instruksi_bayar dihitung Portal per-metode, §7 kontrak). **Tidak ada Midtrans** untuk tenant cutover.

---

## 4. Titik integrasi (file map)

| Fungsi | File |
|---|---|
| Flag tenant cutover | `landing_pages.konfigurasi.source_of_truth = 'portal'` (tipe di `src/types/websitebuilder.ts`) |
| Dispatch render cutover | `src/app/components/SiteRenderer.tsx` — blok `source_of_truth==='portal' && bespoke.source==='menu'` |
| Baca katalog cermin | `src/lib/portal/mirror.ts` (`fetchCatalogMirror`) |
| Tipe kontrak + metode bayar | `src/lib/portal/types.ts` |
| Tanda tangan HMAC | `src/lib/portal/sign.ts` |
| Apply snapshot katalog | `src/lib/portal/catalog-mirror.ts` (`applyCatalogSnapshot`) |
| Keranjang + checkout drawer | `src/app/components/order/PortalCartProvider.tsx` (`usePortalCart`, 5 metode, idempotency, 409, prop `variant` utk skin) |
| Etalase menu default | `src/app/components/order/PortalMenuSection.tsx` |
| Skin order-first "Ceria" (GoFood-like) | `src/app/components/order/CeriaOrderRenderer.tsx` (aktif saat `branding.variant='ceria'`) |
| Intake order (WB→Portal) | `src/app/api/orders/route.ts` (reprice → signed call → bootstrap `order_projection` → WA, **hanya saat 201**) |
| Ingest katalog (Portal→WB) | `src/app/api/sync/catalog/route.ts` |
| Ingest status order (Portal→WB) | `src/app/api/sync/order-status/route.ts` |
| Reconcile katalog (WB pull) | `src/app/api/cron/reconcile-catalog/route.ts` (`vercel.json` cron daily) |
| Tracking pesanan | `/lacak/[token]` (exact-token, rate-limit, no anon) |
| Dashboard pelanggan + gating cutover | `src/app/portal/page.tsx` (`portalManaged`) + `src/app/portal/PortalDashboard.tsx` (banner) |
| Tabel WB | `catalog_mirror`, `order_projection`, `used_nonce` (RLS deny-all, service-role only) |
| Env wajib | `PORTAL_API_URL`, `PORTAL_API_SECRET`, `WB_INGEST_SECRET`, `CRON_SECRET` |

---

## 5. Checklist: bangun website baru yang nyambung ke Portal

**A. Sisi Portal (lakukan dulu / paralel)**
1. Daftarkan tenant + produk/pack/lot di Portal. Tetapkan `tenant_slug` yang sama dengan slug WB.
2. Pastikan Portal bisa **push katalog** ke `POST {WB}/api/sync/catalog` (signed) dan melayani `GET {PORTAL}/api/catalog` untuk reconcile.
3. Set secret bersama: `PORTAL_API_SECRET` (WB→Portal) & `WB_INGEST_SECRET` (Portal→WB) — sama di kedua sisi.

**B. Sisi WB — DB & konfigurasi** (cek schema via MCP `supabase-websitebuilder` dulu)
4. `landing_pages.konfigurasi.source_of_truth = 'portal'`.
5. `branding`: pilih renderer **menu-source** (mis. `theme='restaurant-warung'`) + `variant` + `primary`. Untuk tampilan order-first GoFood: `variant='ceria'` (+ `primary='#FF6B35'`).
6. Seed awal `catalog_mirror` — **JANGAN seed manual asal**: minta Portal kirim full snapshot (`mode:'full'`) atau generate dari `catalog_snapshot` Portal, supaya `pack_id`/nama/harga **identik** dengan Portal (lihat Jebakan #1).
7. Opsional konten cutover di `data_konten`: `order_meta.halal=true`, `andalan=[pack_id,…]` (kurasi "Menu Andalan"), `portal_admin_url` (link banner; default `stock.japanarena.id`).

**C. Sisi WB — env (Vercel, scope Production) + redeploy**
8. `PORTAL_API_URL` (origin Portal + `/api`), `PORTAL_API_SECRET`, `WB_INGEST_SECRET`, `CRON_SECRET`. Tanpa ini checkout fail-closed 503.

**D. Aktivasi + verifikasi**
9. Renderer + gating **otomatis** ikut `source_of_truth='portal'` begitu kode live — tak perlu subah kode per tenant.
10. UAT produksi (lihat §8). Halaman `/[slug]` = `force-dynamic`, jadi perubahan DB langsung tampil (no cache).

---

## 6. ATURAN KERAS — dashboard pelanggan WB (`/portal`) untuk tenant cutover

Portal pelanggan WB punya tab commerce bawaan (Pesanan, Pesanan PO, Laporan, Setelan PO, Produk, Menu, Pembayaran) yang membaca/menulis **tabel WB-native**. Untuk tenant cutover, **itu data yang salah** (order/stok/bayar hidup di Portal). Karena itu:

> **Untuk `source_of_truth='portal'`, tab commerce WB-native WAJIB disembunyikan; owner dialihkan ke Portal Operasi.**

Implementasi (sudah ada, gate **aditif** — tenant WB biasa nol regresi):
- `src/app/portal/page.tsx`: bila `portalManaged`, paksa `hasShop`/`hasPreorder`/`showProduk`/`showMenu`/payment-tab = **false** (tab + fetch-nya hilang).
- `src/app/portal/PortalDashboard.tsx`: sembunyikan tab Pembayaran + render **banner pengalih** ke `portal_admin_url`.
- Hasil: tenant cutover hanya melihat **Konten · Tampilan · Profil** + banner.

Kalau menambah tab commerce baru di `/portal`, **gate dengan `!portalManaged`**.

---

## 7. Jebakan / anti-pattern (collision checklist)

1. **`catalog_mirror` di-seed sendiri (drift `pack_id`).** Order GAGAL diam-diam: WB lolos (id ada di mirror) tapi Portal tolak pack (404). **Selalu** isi mirror dari snapshot Portal, dan pastikan push initial-full berjalan. (Bug pemblokir cutover Bakso, 2026-06-21.)
2. **Menampilkan data WB-native untuk tenant cutover** = order/omzet HANTU. Jangan tampilkan `shop_orders`/`menu_items`/`products`/Midtrans untuk `source_of_truth='portal'` (lihat §6). Edit menu di WB akan **ditimpa** sync; mata uang pun bisa beda (Rp vs ¥).
3. **Sync katalog tak ter-trigger.** Edit produk/harga/stok di Portal harus push ke WB; sediakan **push-on-edit** (real-time) + **cron reconcile** (jaring pengaman). Tanpa keduanya, situs basi.
4. **Vercel Hobby cap cron 1×/hari** — cron `hourly` GAGAL deploy walau CI hijau (CI tak validasi cron-vs-plan). Pakai `daily` atau upgrade Pro.
5. **`PORTAL_API_URL` ber-trailing-newline** — aman di runtime (`.trim()` / WHATWG URL strip LF) tapi jebakan saat tes manual.
6. **Storefront `/[slug]` hanya jalan via alias** `…-nfoa.vercel.app` (apex `.vercel.app` = 404). Cart simpan `pack_id` mirror ke `localStorage ja_portal_cart:<slug>` — clear saat re-test pasca rebuild mirror.

---

## 8. Verifikasi / UAT (gerbang "selesai")

- `npx tsc --noEmit` 0 → CI "Typecheck & Render Tests" hijau → Vercel production **Ready**.
- UAT browser **di produksi** (Playwright MCP / skill `/uat-flow`):
  - Storefront render (desktop+mobile); add-to-cart → bottom bar/keranjang → checkout drawer (5 metode).
  - Happy-path order → **201** + `order_code` + instruksi_bayar + `/lacak/[token]`; cek `order_projection` (WB) + order di Portal (SoR, `channel=website`); FEFO reserve atomik.
  - **409 stock_conflict** (minta qty > tersedia) → zero-mutation.
  - **Bersihkan order uji** (reversal manual) setelah UAT.
  - `/portal` login sebagai tenant → tab commerce **hilang** + banner **muncul** (§6).
- Kejujuran-jualan: **tanpa** rating bintang / "X terjual" karangan; badge = `avail_status` nyata; "Menu Andalan" = kurasi manual (`data_konten.andalan`).

---

## 9. Rujukan

- **Kontrak wire-level (SSOT):** `BAKSO_PORTAL_CONTRACT.md` (§1 sync · §4 request/response · §7 pembayaran · §8 HMAC · §10 stok/FEFO · §11 cutover).
- E-commerce WB-native (non-cutover): `PLAN_ECOMMERCE.md`.
- Tema/renderer: `ROADMAP_BESPOKE.md`, `THEME_VISUAL_PIPELINE.md`.
