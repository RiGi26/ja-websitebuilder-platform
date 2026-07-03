# Roadmap Tema Bespoke — Setiap Industri & Sub-Kategori

Arah produk WB = **bespoke** (pilar #1: template bagus + industry-fit). Target: tiap
sub-kategori dari tiap industri punya renderer bespoke premium sendiri (bar = Atelier),
menggantikan fallback lux composable / renderer legacy yang generik.

Keputusan owner (2026-06-14): **cakupan per-sub-kategori penuh** + **engine digeneralisasi
dulu** sebelum bangun tema. Dokumen ini = SSOT roadmap; resume kerja: `lanjut <subkat>`
(mis. `lanjut kecantikan`).

## Status

**Bespoke live (15):** WAVE 1 TOKO TUNTAS (8/8) — `toko/fashion`→`toko-atelier` ·
`toko/kuliner`→`toko-kuliner` · `toko/kerajinan`→`toko-kerajinan` · `toko/kecantikan`→`toko-kecantikan`
("Embun") · `toko/gadget`→`toko-gadget` ("Onyx") · `toko/rumah`→`toko-rumah` ("Selaras") ·
`toko/kesehatan`→`toko-kesehatan` ("Jamu") · `toko/anak`→`toko-anak` ("Ceria") ·
`restaurant/finedining`→`restaurant-lux` · **WAVE 2: `klinik/umum`→`klinik-umum` ("Klinik Bersih") ·
`klinik/estetik`→`klinik-estetik` ("Lumen") · `klinik/wellness`→`klinik-wellness` ("Sanara") —
KLINIK TUNTAS 3/3 · `restaurant/warung`→`restaurant-warung` ("Hangat") ·
`restaurant/cafe`→`restaurant-cafe` ("Seduh") — RESTAURANT TUNTAS 3/3 (warung·cafe·finedining)** ·
**WAVE 3: `sekolah/reguler`→`sekolah-reguler` ("Almamater")** ·
**WAVE 4: `corporate/agency`→`corporate-agency` ("Poster") — tema PERTAMA pipeline compiler
HTML-first (`scripts/html-theme/`, sumber `theme-sources/corporate-agency/`)**.

**Celah (7 sub-kategori):** sekolah (islami·kursus) · corporate (startup·korporat) · personal ·
travel · blog · jastip (personal/travel/blog/jastip masing-masing 3).

**Pipeline baru (pilar E, sejak Wave 4):** tema bisa di-author sebagai HTML beranotasi →
compiler meng-emit renderer + slots + contrast test + sample (`scripts/html-theme/README.md`).
Tema hasil compiler TIDAK perlu migrasi zero-hardcode (slot manifest ikut ter-emit).

## Engine (S0 — SELESAI, PR `feat/bespoke-engine-universal`)

Mesin bespoke digeneralisasi dari toko-only ke **lintas industri**, additive & nol regresi:

- **`toko-bespoke/registry.ts` → `BESPOKE_RENDERERS`** — registry universal `theme key →
  { Renderer, source, hasCart, showcaseTitle }`. `source` ∈ `products|menu|services|blog`
  menentukan etalase yang di-fetch SiteRenderer. `restaurant-lux` kini terdaftar di sini juga.
- **`toko-bespoke/types.ts` → `BespokeProps`** — kontrak props superset (commerce +
  `slug`/`capabilities`); alias `BespokeTokoProps` dipertahankan.
- **`SiteRenderer.tsx`** — satu cabang bespoke (lookup `BESPOKE_RENDERERS[theme]`, fetch by
  `source`), menggantikan cabang `restaurant-lux` + loop toko yang terpisah.
- **`generateContent.ts`** — lookup `BESPOKE_VARIANTS[variant]` kini lintas industri (guard
  `toko_online` dibuang); jalur `isLux` (Fine Dining) tetap.
- **`toko-bespoke/variants.ts` → `BESPOKE_VARIANTS`** — peta varian build-time. `restaurant-lux`
  **sengaja TIDAK** di sini (menjaga `BESPOKE_THEMES` portal-tabs tetap toko-only).

**Cara nambah industri baru:** daftarkan renderer di `BESPOKE_RENDERERS` (+`source`) + variant
di `BESPOKE_VARIANTS` → intercept & render otomatis. Tak ada cabang `if` baru.

**Kontrak portal "Susunan Halaman" (berlaku otomatis untuk tema baru):** customer bisa
menyembunyikan blok pengayaan (stats/faq/statement/gallery) dan me-reorder item etalase
langsung dari portal. Reorder universal — fetch publik (`lib/supabase/addons.ts`) selalu
`ORDER BY urutan`, tak perlu kerja per-tema. Untuk hide, **setiap renderer WAJIB merender
blok opsional di belakang guard kehadiran** (`{content.stats?.length && …}` /
`{content.statement && …}`) — JANGAN unconditional/fallback. Adapter me-null-kan blok yang
disembunyikan; renderer ber-guard otomatis menghilangkannya. Dikunci test
`toko-bespoke/hide-contract.test.tsx` (parametrik atas `BESPOKE_RENDERERS` → tema baru
auto-teruji). SSOT key: `lib/portal/section-visibility.ts`.

## Roadmap tema (5 wave, 1 tema = 1 PR, urut bisa di-reorder owner)

Theme-key registry = `<tipe>-<subcat>` (stabil). Seed direction = palet/mood dari stub
`taxonomy.ts`; **font / pola hero / motif / signature difinalkan per-sprint saat DEFINE +
cek anti-duplikat `DESIGN_LEDGER.md`.** Default 1 palet/tema (owner boleh minta varian ke-2).

| Wave | Sub-kategori | Source etalase |
|---|---|---|
| 1 — Toko | ~~kecantikan ("Embun")~~ · ~~gadget ("Onyx")~~ · ~~rumah ("Selaras")~~ · ~~kesehatan ("Jamu")~~ · ~~anak ("Ceria")~~ — **TUNTAS 8/8** | products |
| 2 — Jasa & makan | ~~klinik/umum ("Klinik Bersih")~~ · ~~klinik/estetik ("Lumen")~~ · ~~klinik/wellness ("Sanara")~~ — **KLINIK TUNTAS 3/3** · ~~restaurant/warung ("Hangat")~~ · ~~restaurant/cafe ("Seduh")~~ — **RESTAURANT TUNTAS 3/3** | services / menu |
| 3 — Edukasi & bisnis | sekolah (~~reguler "Almamater"~~ · islami · kursus) · corporate (startup · ~~agency "Poster"~~ · korporat) | services |
| 4 — Travel & personal | travel (kendaraan/wisata/akomodasi) · personal (kreator/profesional/coach) | services |
| 5 — Konten & jastip | blog (jurnal/media/niche) · jastip (luar/lokal/preorder) | blog / products |

## Resep per tema (tiap PR — gerbang lengkap di `THEME_VISUAL_PIPELINE.md` §7)

1. **DEFINE** — riset arah; cek `DESIGN_LEDGER.md` (font/hero/motif/signature belum dipakai);
   palet+pairing dari ui-ux-pro-max DB; kontrak `design-rules/<mood>.md`.
2. **BUILD** — renderer `src/app/components/themes/<tipe>-<subcat>/...Renderer.tsx` pakai
   primitive `lux-script.ts`. Wajib: **mode sparse** (pelajaran #132) + **state tersembunyi-awal
   lewat primitive LUX_JS / CSS murni base-TAMPIL**, bukan React hook (pelajaran #138) +
   **blok opsional (stats/faq/statement/gallery) di belakang guard kehadiran** supaya hide
   portal "Susunan Halaman" jalan (dikunci `hide-contract.test.tsx`).
3. **Wiring** — `BESPOKE_RENDERERS` (+`source`) · `BESPOKE_VARIANTS` · repoint
   `THEMES[tipe][subcat]` + flip `ready:true` di `INDUSTRY_SUBKATEGORI` · `sample-content.ts`
   alias imagery · baris `DESIGN_LEDGER.md`.
4. **Gerbang kode** — `/ui-design` + `/make-interfaces-feel-better` + `/website-review`.
5. **Gerbang pixel** — `npm run shoot:chrome -- <id>` → scorecard §3.2 (CRITICAL/HIGH hijau), iterate ≤2×.
6. **Review** — HTML sample (`npm run samples`, user-run) ke owner → PR → CI + Vercel Ready → merge.

## Catatan

- **Sumber data per industri** harus benar di `source` registry (services/menu/blog/products) —
  kalau salah, etalase render kosong. Uji tiap industri saat tema pertamanya.
- **Saturasi ledger:** 28 tema = 28 font/hero/motif/signature unik global makin sulit. Saat mulai
  bentrok, putuskan relaksasi aturan jadi "unik per-industri" — angkat ke owner.
- Perubahan renderer hanya berdampak ke **build baru**; situs klien lama tak auto-rebuild.
