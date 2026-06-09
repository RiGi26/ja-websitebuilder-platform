# ADDON ARCHITECTURE PLAN — "Add-on → Struktur Nyata" + Audit Katalog

> **Sumber kebenaran durable** untuk pembenahan sistem add-on JA Website Builder. Survive restart/terminal mati. Disusun 2026-06-08, investigasi berbasis **kode + schema DB** (bukan asumsi). Pendamping `THEME_SYSTEM_PLAN.md` (visual tema) dan `UPGRADE_PLAN.md` (hardening platform).
>
> Konteks pemicu: testing E2E order build website dengan tema `restaurant-lux` (order Pempek, page `daed48f8-cdf5-4a74-b793-e90961a6f642`). Pertanyaan user: *"kalau pilih add-on, apakah kerangkanya real terbentuk?"* → jawaban: **tidak** (lihat Audit). Lalu: *"review add-on, ada yang sia-sia / bertabrakan / tak relevan?"* → audit penuh di §B.

---

## 0. STATUS (baca dulu)

- **Investigasi:** ✅ SELESAI & terbukti (kode + DB via MCP supabase-websitebuilder, 2026-06-08).
- **Eksekusi:** 🟢 BERJALAN. Lihat §F (Roadmap) + §G (Log progres).
- **Temuan inti:** masalah bukan "1-2 add-on sia-sia" — tapi **(A) 11/24 SKU dibayar tanpa code path (revenue tanpa deliverable), (B) 4 katalog add-on divergen → funnel bocor + harga ganda + makna korup, (C) nol gating industri/dependency, (D) tabrakan/redundansi flag.**

---

## A. Pipeline saat ini (terverifikasi)

```
order.selected_addons (['midtrans','wa','shop','admin','seo'])
  → addonsToFeatures()              src/lib/websitebuilder-mapping.ts:67
  → konfigurasi.features {hasCart, hasPayment, ...}   ← boolean flags
  → persist.ts simpan ke landing_pages.konfigurasi.features
  → SiteRenderer baca flag PER-TEMA (tak seragam)
```

Section halaman **TIDAK** berasal dari add-on. Section murni dari `runTemplate(briefing)` (`src/lib/build/templates.ts`) — fixed per-industri, buta add-on. Tiap industri base sudah punya showcase-nya (resto=`pricing_table` menu, toko=`product_list`, jasa=`service_list`). Jadi add-on "struktural" untuk industri aslinya = **redundan** dengan base; nilai sejatinya = **kapabilitas** (cart/QR/booking), bukan section.

---

## B. AUDIT — 4 Temuan (berbasis bukti)

### Temuan A — Sensus flag: 15 dari 24 flag MATI (0 pembaca)

Pembaca flag nyata (grep `.hasX` seluruh codebase):

| Flag | Dibaca di | Status |
|---|---|---|
| `hasCart` | `/[slug]/checkout`, `/api/shop/checkout`, `CartProvider` (composable+batik), portal tab | 🟢 hidup |
| `hasBooking` | `/[slug]/booking`, `/api/booking/create`, portal tab, RentalRenderer | 🟢 hidup |
| `hasLiveChat` | tawk widget (SiteRenderer) — butuh `addons.tawk_property_id` | 🟡 kondisional |
| `hasMenu` / `hasBlog` / `hasGallery` | **portal tab saja** (`portal/page.tsx`) | 🟡 no public render |
| `hasPayment` / `hasWhatsApp` / `hasTracking` | **RentalRenderer saja** | 🟡 rental-only |
| `hasShipping` · `hasDelivery` · `hasMembership` · `hasLMS` · `hasMultiLang` · `hasAnalytics` · `hasNewsletter` · `hasCareer` · `hasEmail` · `hasClientPortal` · `hasContactForm` · `hasMap` · `hasAdmin` · `hasSEO` | **(tak ada)** | 🔴 **0 pembaca** |

→ **11 add-on memetakan HANYA ke flag mati = dibayar, nol perubahan** di situs & portal: `delivery, membership, lms, cert-auto, email-biz, lang-multi, ads-tracking, protection, career, newsletter, client-portal`.

> Catatan: `hasSEO`/`hasAdmin` "mati sebagai flag" tetapi fungsinya mungkin ditangani jalur lain (metadata `[slug]` / auth CMS). Perlu konfirmasi terpisah; jangan diasumsikan hidup hanya karena flag ada.

### Temuan B — 4 katalog add-on divergen (id & harga bentrok)

| Sumber | Jumlah | Namespace id | Harga |
|---|---|---|---|
| `ja-corp-landing/constants/services.ts` `ADDON_GROUPS` (marketing/kalkulator) | **~41** | `admin-dash`,`cart`,`wa-auto`,`cbt`,`jlpt`,`voucher`,… | set A |
| `ja-websitebuilder/src/app/order/page.tsx` `ADDONS` (form order asli) | **24** | `admin`,`shop`,`wa`,… | set B |
| `ja-websitebuilder/src/app/components/AddonMarketplace.tsx` `ADDONS` (upgrade) | **14** | `member`,`portal`,`quiz`,`gsheets`,`invoice` | **harga beda** (shop 299k vs 450k) |
| `ja-websitebuilder/src/lib/websitebuilder-mapping.ts` `ADDON_FLAG_MAP` | ~29 keys | set B + rental | — |

Konsekuensi terukur:
1. **Funnel bocor.** `CORP_TO_ORDER_ID` (order/page.tsx:143) hanya map 14 id; sisanya disaring senyap di `order/page.tsx:167` (`.filter(ADDONS.some…)`). Diiklankan tapi tak bisa di-order, hilang tanpa warning: `cbt, bank-soal, flashcard, jlpt, voucher, affiliate, wishlist, review, e-ticket, driver-sched, seat, med-record, queue, doc-sched, clinic-res, ppdb, portal-siswa, crm, api`.
2. **Mapping korup makna (bait-and-switch tak sengaja):** `blog → newsletter`, `track-pack → ads-tracking` (resi ≠ pixel iklan), `g-sheets → admin`, `email-auto → newsletter`, `zoom → lms`.
3. **Marketplace upgrade** pakai `quiz/gsheets/invoice` yang **tak ada di `ADDON_FLAG_MAP`** → flag pun tak ke-set; plus harga beda → klien lihat 2 harga utk add-on sama.

### Temuan C — Mismatch industri (langsung kena tes lux)

Order test `Website Restaurant` = `["midtrans","wa","shop","admin","seo"]`. Nasib di `restaurant-lux`:

| Add-on | Harusnya | Realita di lux |
|---|---|---|
| `shop`→`hasCart` | toko/cart | 🔴 cabang `restaurant-lux` (SiteRenderer:58-67) tak mount `CartProvider`; resto jual `menu_items` bukan `products` → cart kosong/salah tabel |
| `midtrans`→`hasPayment` | tombol bayar | 🔴 cuma RentalRenderer baca → mati di lux |
| `wa`→`hasWhatsApp` | float WA | 🟡 muncul via CTA section (template), bukan dari flag |
| `admin`,`seo` | CMS/meta | 🟡 backend/meta, theme-agnostic, bukan flag |

→ **Untuk tes lux, add-on terpilih praktis nol efek visual.** DB juga buktikan **nol gating industri**: `Website Perusahaan` beli `shop`+`ongkir`, `Restaurant` beli `shop` — kombinasi tak masuk akal, sistem tak cegah.

### Temuan D — Tabrakan & redundansi

- `shop` ⊃ `{katalog-pro, variant, ongkir}` → semua collapse ke `hasCart` yang sama (4 SKU = 1 kapabilitas). `ongkir` juga set `hasShipping` (mati).
- `booking` ≈ `telemedicine` ≈ `live-session` (corp `zoom`) → semua "jadwal Zoom/Meet"; `telemedicine` tambah `hasBooking` (duplikat).
- `membership` ↔ `client-portal` ↔ corp `portal-siswa` → konsep "area login" tumpang tindih, dua-duanya flag mati.
- **Redundan dgn base:** `qr-menu`/`shop` tak menambah section utk industri aslinya (sudah ada di templates.ts).

---

## C. Verdict per add-on (24 SKU form order)

| Add-on | Status | Aksi |
|---|---|---|
| `shop` | 🟢 partial (mati di lux/bespoke) | Keep, jadikan induk; wire ke lux |
| `booking` | 🟢 route hidup | Keep, jadikan induk |
| `chat` | 🟡 hidup bila `tawk_id` diisi | Keep |
| `qr-menu` | 🟡 portal-only, menu sudah base | Rework label → "QR Code" |
| `admin`, `seo` | 🟡 backend/meta (bukan flag) | Keep, lepas dari sistem flag |
| `midtrans`, `wa` | 🟡 rental-only / via CTA | Wire ke composable+lux |
| `katalog-pro`, `variant`, `ongkir` | ♻️ redundan `hasCart` | Lebur jadi child `shop` |
| `telemedicine`, `live-session` | ♻️ duplikat `booking` | Merge → "Integrasi Video Meeting" |
| `delivery` | 🔴 `hasDelivery` mati | Wire (tombol link) atau drop |
| `membership`, `lms`, `cert-auto` | 🔴 mati total | Bangun atau tarik |
| `ads-tracking`, `newsletter`, `career` | 🔴 mati | Wire (script/section) atau drop |
| `lang-multi` | 🚫 tak ada i18n engine | Jangan jual / "custom manual" |
| `protection` | 🚫 anti-copy mudah dilewati | Drop / reposisi "best-effort" |
| `email-biz` | 🚫 bukan artefak situs | Pindah "Layanan Operasional" |
| `client-portal` | 🚫 konsep studio-side | Pindah / hapus dari katalog website |

---

## D. ARSITEKTUR TARGET — Add-on Blueprint Registry

Naikkan `ADDON_FLAG_MAP` (flat, flag-only) → **blueprint berstruktur**, sumber tunggal lintas surface.

```ts
// src/lib/addons/catalog.ts (BARU — single source of truth)
type AddonClass = 'structural' | 'capability' | 'enhancer' | 'operational'
type AddonStatus = 'live' | 'backend' | 'planned' | 'deprecated'

interface AddonDef {
  id: string
  name: string
  desc: string
  price: number
  yearlyMaint: number
  klass: AddonClass
  status: AddonStatus              // KEJUJURAN: 'planned' = belum ada code path
  industries?: TipeIndustri[]      // undefined = semua; utk gating relevansi
  requires?: string[]              // dependency (mis. variant requires shop)
  features: (keyof FeatureFlags)[] // = perilaku lama (kompatibel)
  capability?: string[]            // dibaca renderer (cart/booking/delivery/…)
  sections?: SectionBlueprint[]    // Kelas structural — section utk di-inject
  aliases?: string[]               // id corp-landing/marketplace yang map ke sini
}
```

Turunan (derive, bukan duplikat) dari katalog ini:
- `addonsToFeatures()` → dari `.features` (+ fallback substring dipertahankan).
- `order/page.tsx ADDONS` → dari katalog (filter `status !== 'deprecated'`).
- `AddonMarketplace ADDONS` → dari katalog (hapus harga ganda).
- `CORP_TO_ORDER_ID` → dari `.aliases`.

### Seam injeksi section (Kelas structural)

```ts
// generateContent.ts — setelah runTemplate
const out = runTemplate(b)
const addon = resolveAddons(order.selected_addons)            // BARU
const sections = mergeAddonSections(out.sections, addon.sections) // dedupe + anchor
const features = { ...addonsToFeatures(order.selected_addons), ...addon.features }
// capabilities → simpan ke konfigurasi.capabilities (jsonb, sejajar features)
```

- `SectionBlueprint.tipe` WAJIB ∈ CHECK `page_sections.tipe_komponen` (18 nilai sah).
- `persist.ts` sudah nulis apa pun di `plan.sections` → **nol perubahan write-path**.
- Renderer (lux + composable) baca `konfigurasi.capabilities` → tombol cart/booking/delivery muncul kondisional. **Tanpa langkah ini, section/flag tetap tak kelihatan (jebakan §13 THEME_SYSTEM_PLAN: PRODUKSI ≠ PREVIEW).**

---

## E. REKOMENDASI (prioritas)

**P0 — integritas revenue:**
1. **Satu sumber kebenaran add-on** (`src/lib/addons/catalog.ts`) → di-import semua surface. Hapus 4 namespace + `CORP_TO_ORDER_ID` + harga ganda.
2. **Stop jual yang mati.** 11 SKU dead: pilih **wire** (delivery/newsletter/career/ads-tracking murah) atau **tarik** (lms/membership/cert-auto/lang-multi/protection/email-biz/client-portal) sampai ada mesinnya.

**P1 — relevansi & validitas:**
3. **Gating industri + dependency** di form order: `{midtrans,ongkir,variant,katalog-pro}` butuh `shop`; `cert-auto/live-session` butuh `lms`; sembunyikan add-on tak relevan per industri.
4. **Merge duplikat:** telemedicine+live-session → 1; katalog-pro/variant/ongkir → child shop.

**P2 — sambung ke arsitektur:**
5. **Blueprint Registry** konsumsi katalog tunggal: tiap add-on → capability sendiri yang dibaca lux + composable, bukan collapse ke `hasCart`.

---

## F. ROADMAP EKSEKUSI (additive, nol regresi — pola UPGRADE_PLAN)

| Sprint | Isi | Risiko | Shippable |
|---|---|---|---|
| **A0** | `catalog.ts` (SSOT: id/nama/harga/maint/klass/status/industries/requires/features/capability/aliases) + refactor `addonsToFeatures` derive dari katalog (behavior-preserving) + unit test parity | rendah (additive) | ✅ nol efek UI |
| **A1** | `order/page.tsx` + `AddonMarketplace` konsumsi katalog. **Konflik harga marketplace → keputusan user** (jangan ubah harga diam-diam) | sedang (UI+harga) | ✅ 1 katalog |
| **A2** | Gating industri + dependency di form order (UI disable/hide) | rendah | ✅ blok kombinasi invalid |
| **A3** | Keputusan wire-vs-drop per 11 SKU dead (matriks) → tandai `status` + sembunyikan `planned` | rendah | ✅ stop jual hampa |
| **B0** | `resolveAddons` + `mergeAddonSections` + `konfigurasi.capabilities` (dormant) + unit test | rendah | ✅ nol efek |
| **B1** | Wire Kelas structural (qr-menu/shop/booking) + seed | sedang | ✅ section muncul |
| **B2** | Renderer (lux + composable) baca `capabilities` → tombol cart/booking/delivery | sedang | ✅ kapabilitas hidup |
| **B3** | E2E harness: matriks add-on × industri (Playwright) | rendah | ✅ regресi-guard |

Aturan: 1 sprint = 1 branch = 1 PR, additive dulu, verify SSR + Vercel Ready sebelum merge, nol regresi page published.

### Risiko utama
- **Section type di luar CHECK** → insert gagal. Mitigasi: blueprint hanya 18 tipe sah + test guard.
- **Section ke-inject tapi renderer tak kenal** → tak kelihatan. Mitigasi: B2 wajib sebelum klaim "selesai".
- **Lintas-repo SSOT:** corp-landing = app/deploy terpisah (static export) → tak bisa import runtime dari websitebuilder. Mitigasi: katalog di paket bersama (bila monorepo siap) atau sumber tunggal di websitebuilder + generator/sync ke corp-landing. Putuskan di A1.
- **Harga konflik marketplace** = keputusan bisnis, BUKAN diubah unilateral oleh build. Surface ke user di A1.
- **Idempoten persist** timpa edit customer saat rebuild — sama spt sekarang, aman utk build awal.

---

## G. LOG PROGRES (diisi sambil jalan)

| Tanggal | Sprint | Status | Catatan |
|---|---|---|---|
| 2026-06-08 | — | Plan + Audit disusun | Investigasi kode+DB selesai. 4 temuan terbukti. Rekomendasi P0–P2. |
| 2026-06-09 | **A0** | ✅ PR #105 (CI + Vercel hijau) | SSOT `src/lib/addons/catalog.ts` (24 SKU + metadata audit) + `FLAG_ALIASES`; `addonsToFeatures` derive dari katalog via `explicitFeatures` (behavior-preserving). 40 test parity+integritas. 377 test total, tsc bersih. |
| 2026-06-09 | **A1 + A3** | ✅ PR #105 (merged) | Keputusan user: **dua-tier harga EKSPLISIT** (nol perubahan ke customer) + **triage per SKU**. `order/page.tsx` + `AddonMarketplace` konsumsi katalog (`orderAddons`/`upgradeAddons`); `CORP_TO_ORDER_ID` → `aliasToId()` (fix mapping korup blog→newsletter, track-pack→ads-tracking, g-sheets→admin). SKU `blog` (hilang) ditambah → hasBlog. Triage: drop snake-oil (protection/email-biz/client-portal) + hide heavy-unbuilt (lms/membership/cert-auto/lang-multi); 4 "wire" (delivery/newsletter/career/ads-tracking) tetap. Form order 24→18 SKU. 385 test, tsc + next build bersih. |
| 2026-06-09 | **B-cap** | ✅ PR (capabilities → lux) | Pipa capability: `catalog.capabilitiesForAddons()` → `BuildPlan.capabilities` (generateContent) → `konfigurasi.capabilities` (persist) → SiteRenderer pass → **RestaurantLuxRenderer baca**. UI kondisional lux: `booking`→reservasi diarahkan ke `/{slug}/booking` nyata · `delivery-buttons`→tombol "Pesan Antar" · `qr-menu`→catatan QR menu. Additive, nol regresi (capabilities kosong = persis seperti dulu). 396 test (+11), tsc + next build bersih. Demo: order restaurant dgn booking/delivery/qr → UI muncul (sebelumnya nol). Belum: B-section (injeksi structural cross-industri), B-composable (ComposableRenderer baca caps), A2 gating, merge video-meeting. |
