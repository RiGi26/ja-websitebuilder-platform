# THEME SYSTEM PLAN — Ekspansi Tema Otentik per Sub-Kategori

> **Sumber kebenaran durable** untuk program ekspansi tema JA Website Builder. Survive restart/terminal mati. Berbeda dari `UPGRADE_PLAN.md` (hardening platform 7→10, hampir tuntas) — file ini adalah **program berkelanjutan**: menambah tema otentik terus-menerus. Disusun 2026-06-05.

---

## 0. CURRENT STATUS (baca dulu)
- **⚠️ TEMUAN TERBUKA (2026-06-08):** keluhan user *"layout belum variatif menggambarkan industri"* sudah diinvestigasi & terbukti — variasi ada di **kulit** (token), bukan **rangka** (layout). Akar 3 lapis (generasi konten tipis → adapter buang sinyal industri → showcase 90% card-grid + urutan hardcode). Rencana fix = **Sprint 10**. **Lihat §13** sebelum garap "perdalam blok/varian". Belum dieksekusi.
- **Fase aktif:** 🎉 **SEMUA INDUSTRI TUNTAS (Sprint 9) — 9 INDUSTRI, 96 TEMA.** Sprint 9 menambah **Travel/Rental** (kendaraan/wisata/akomodasi), **Blog/Media** (jurnal/media/niche), **Jastip** (luar/lokal/preorder) — 27 tema, AKTIF. Total **96 tema** otentik di **9 industri** (semua `TipeIndustri` kecuali `custom`). Composable showcase kini per-industri benar (products/menu/services/blog_posts). 253/253 test (+1 skip), tsc + build bersih, S9 flagship verified pixel (scorecard PASS).
- **Sebelumnya:** COMPANY (S8b, 9) · PERSONAL (S8a, 9) · FU#1/FU#2 · SEKOLAH (S7, 9) · KLINIK (S6, 9)+galeri S5b · RESTAURANT (S4, 9)+S5 · TOKO ONLINE (S1-3, 24).
- **Polish #4 (next/font) ✅ SELESAI (2026-06-07):** 4 font asli (Jakarta/Fraunces/Space Grotesk/Nunito) dimuat di `src/app/[slug]/layout.tsx` (subtree situs published saja). `_fonts.ts` pakai `var(--font-x, <fallback sistem>)` → produksi dapat font asli, UAT/test/admin jatuh ke sistem (nol regresi). Build compile next/font bersih.
- **Yang LIVE:** mini-step "Tipe Toko" menampilkan **8 sub-kategori** ter-filter, masing-masing 3 gaya distinct; pilih **Lainnya** → variant lama. Renderer composable + resolusi build aktif.
- **6 sub-kategori baru (gaya):** Kerajinan (pusaka gelap kawung / tenun hangat anyaman / galeri terang minimal) · Kecantikan (blush pastel / glow champagne / noir plum gelap) · Gadget (onyx cyan gelap / studio Apple-clean / neon magenta) · Rumah (natural kayu / japandi greige / walnut gelap) · Herbal (daun hijau / jamu amber / botani emerald gelap) · Anak (pastel lembut / ceria seimbang / pop lantang). VARIASI dijaga: tiap sub-kat rentang gelap↔terang + mood beda (dijaga test).
- **Perpustakaan balok bertambah:** **MOTIF/TEKSTUR** (`MotifOverlay` + tile kawung/tenun, panen `BatikTokoRenderer`) — overlay hero + strip footer, ditint primary, parametrik. Dipakai Kerajinan; siap untuk tema heritage berikutnya. Plus font ROUNDED (playful/lembut).
- **Step berikutnya:** industri LAIN (restaurant/klinik/sekolah dll) via pola yang sama; atau perdalam blok (testimoni varian, hero baru). **WAJIB jaga variasi** (prinsip #6).
- **Lapis baru (2026-06-07): `design-rules/<mood>.md`** — 5 file constraint ala TypeUI
  `skill.md` (must/should anchored ke data nyata 96 tema), satu per mood (clean/luxury/
  warm/bold/minimal), di `src/lib/theme-system/design-rules/`. Dipakai mulai **sprint
  berikutnya setelah S9** (S10+, atau kapan pun "perdalam blok"/industri `custom` digarap)
  — di-cross-check saat DEFINE & jadi checklist konkret saat POLISH/VERIFY. Lihat §5/§5.a
  & `THEME_VISUAL_PIPELINE.md` §1/§2/§3.2 utk cara pakai.
- **Standar:** ikon lucide (bukan emoji, dijaga test); gerbang 3 skill tiap tema (§5.a, diterapkan sbg design-review pada 18 gaya baru); variasi wajib (#6, dijaga test).

### Latar masalah (kenapa ini ada)
Order pempek (Toko Online, variant `batik`) ter-render `BatikTokoRenderer` → estetika **batik tekstil** (motif kawung, "Luxury Heritage"), mismatch untuk **makanan**. Akar: variant `toko_online` cuma 2 (`batik`, `modern`), keduanya generik & tak nyambung ke jenis toko. Customer tak bisa memilih nuansa yang pas.

### Keputusan kunci yang sudah disepakati (2026-06-05)
1. **Effort besar OK, tidak buru-buru** — launch saat matang & banyak pilihan. Tujuan: memanjakan customer dengan pilihan nuansa otentik.
2. **3 gaya per sub-kategori.**
3. **Arsitektur = Composable Theme System** (hibrida), bukan bespoke murni (tak skala) maupun token-pack murni (tak otentik). Lihat §4.
4. **Penempatan input sub-kategori = brief form, mini-step sebelum Branding** (customer-facing, self-service). Lihat §6.
5. **Pilot = Kuliner** (langsung jawab pempek + paling sering muncul).
6. **Pola dapat diulang** — sekali pilot tuntas, sub-kategori/industri lain = research & jalankan playbook (§5).

---

## 1. Tujuan & prinsip
- **Tujuan:** Saat pilih industri (mis. Toko Online), customer juga memilih **sub-kategori** (jenis toko), lalu mendapat **3 gaya tema otentik** yang dikurasi khusus untuk jenis tokonya — dipilih sendiri di brief form.
- **Prinsip yang tak boleh dilanggar:**
  1. **Customer self-service.** Pemilihan nuansa di tangan customer (bukan admin). Itu inti kepuasan.
  2. **Otentik + skala.** Tema terasa dibuat-tangan, tapi produksinya tetap skala (manifest, bukan renderer per tema).
  3. **Nol regresi.** Tema & renderer lama tetap jalan selama migrasi. Tak ada page published yang rusak.
  4. **No-rush, matang dulu.** Rilis sub-kategori hanya setelah 3 gayanya lengkap & terverifikasi.
  5. **Konten briefing tetap menang** atas seed/contoh (konsisten dgn pipeline F3 di UPGRADE_PLAN).
  6. **VARIASI WAJIB — favorit pribadi BUKAN acuan.** Tiap sub-kategori harus merentang gaya yang benar-benar beragam (terang↔gelap, ramai↔minimal, hangat↔elegan). Selera pribadi siapa pun (mis. user suka heritage) TIDAK boleh dijadikan cetakan yang dikloning ke semua tema — itu membunuh tujuan "banyak pilihan". Tiap gaya berdiri sebagai opsi distinct.

---

## 2. Taksonomi 3 lapis
```
Industri          ──►   Sub-Kategori          ──►   Tema (3 gaya otentik)
(Toko Online)           (Kuliner / Fashion …)       (Rustic / Modern / Heritage …)
   ↑ ada sekarang          ↑ LAPIS BARU                ↑ di-filter by sub-kategori
   (orders.industri)       (briefing_data.branding     (briefing_data.branding.variant)
                            .sub_kategori)
```
- **Industri** sudah ada (10 tipe). **Sub-kategori** = lapis baru. **Tema** = perluasan variant yang sudah ada.

---

## 3. Peta sub-kategori Toko Online (pilot industri)
Flagship dulu, sisanya menyusul via playbook:

| Sub-kategori | Contoh toko | Nuansa tema | Prioritas |
|---|---|---|---|
| **Kuliner / Makanan** | pempek, kue, frozen, kopi, snack | Hangat, menggugah selera | 🥇 PILOT |
| **Fashion / Pakaian** | baju, hijab, sepatu, tas | Editorial, lookbook | flagship |
| **Kerajinan / Heritage** | batik, tenun, ukiran | Motif & tekstur (panen dari batik lama) | flagship |
| **Kecantikan / Skincare** | kosmetik, parfum, perawatan | Lembut, elegan, pastel | berikut |
| **Elektronik / Gadget** | aksesoris HP, gadget | Modern, gelap, tech | berikut |
| **Rumah & Dekor / Furniture** | mebel, dekor, tanaman | Natural, lapang | berikut |
| **Kesehatan & Herbal** | madu, jamu, suplemen | Natural, hijau, trust | berikut |
| **Bayi & Anak / Mainan** | perlengkapan bayi, mainan | Playful, ramah | berikut |

### 3 gaya untuk Kuliner (pilot)
| Gaya | id variant | Karakter | Hero | Produk |
|---|---|---|---|---|
| **Rustic Hangat** | `kuliner-rustic` | warung homemade (pempek!) | PhotoFullbleed | MenuList hangat |
| **Modern Appetite** | `kuliner-modern` | brand F&D kekinian | SplitEditorial cerah | CardGrid |
| **Heritage Kuliner** | `kuliner-heritage` | kuliner premium/tradisional | Centered elegan | Signature dishes |

---

## 4. Arsitektur — Composable Theme System (3 lapis teknis)
> Kenapa composable (bukan bespoke/token-pack murni): 8 sub-kat × 3 gaya = 24 tema utk Toko Online saja; ×industri lain → 100+. Bespoke murni = 100 renderer ~700 baris (mati di pemeliharaan). Token-pack murni = re-skin, tak otentik. Composable = kualitas bespoke + skala token-pack.

```
┌─ LAPIS 1: DESIGN TOKENS (kulit) ──────────────────────────────┐
│  palet, tipografi, spacing, radius, shadow, motif/tekstur      │
│  → fondasi: packs.ts (sudah ada)                               │
├─ LAPIS 2: SECTION-VARIANT LIBRARY (balok) ────────────────────┤
│  Hero:     [PhotoFullbleed, SplitEditorial, MenuGrid, Centered]│
│  Produk:   [MenuList, CardGrid, Lookbook, SpecGrid]            │
│  + Features, Testimoni, CTA, Footer — tiap section punya       │
│    beberapa VARIAN, semua konsumsi token, dibuat-tangan SEKALI │
│  → perluas SectionRenderer + components/sections/ (sudah ada)  │
├─ LAPIS 3: THEME MANIFEST (resep) ─────────────────────────────┤
│  1 tema = 1 file kecil deklaratif:                             │
│  { id, tokens, hero:'photo-fullbleed', produk:'menu-warm',     │
│    motif:'none', sections:[...] }                              │
│  → perluas website-variants.ts                                 │
└────────────────────────────────────────────────────────────────┘
```
- **Bikin tema baru = tulis 1 manifest** (pilih varian section + token) + sesekali 1 balok baru kalau niche butuh. Itu unit produksi yang skalanya enak.
- **Keotentikan** datang dari: token kaya (termasuk tekstur/motif) + perpustakaan balok yang tumbuh + konten-seed terkurasi.
- **3 gaya/sub-kategori = 3 manifest**, bukan 3 renderer → murah.

### Reuse aset yang sudah ada (bukan greenfield)
- `packs.ts` → Lapis 1.
- F4 layout archetypes (`layout: hero/features/pad/align` di TokenDrivenRenderer) → modal Lapis 2.
- `SectionRenderer` + `components/sections/` → seam Lapis 2.
- `website-variants.ts` → Lapis 3.
- `BriefingForm` Step Branding (`getVariants`) → titik pemilihan tema.

---

## 5. Playbook produksi tema (unit yang DIULANG per sub-kategori)
Setelah Kuliner tuntas, tiap sub-kategori/industri baru = ulangi 7 langkah ini:
```
1. RESEARCH  → kumpulkan referensi visual niche (mood, palet, konvensi layout 3 gaya)
2. DEFINE    → 3 manifest (token + pilihan varian section) per gaya
               + cross-check token/layout terhadap design-rules/<mood>.md §2-3
               (rule "must" non-negotiable, rule "should" memandu pilihan)
3. BUILD     → varian section BARU yang belum ada di perpustakaan (kalau perlu)
4. SEED      → konten contoh per sub-kategori (preview langsung "hidup")
5. POLISH    → GERBANG KUALITAS 3 SKILL (wajib, lihat §5.a)
               + grade thd checklist konkret design-rules/<mood>.md §4 (states) & §5 (a11y)
6. WIRE      → daftarkan sub-kategori + 3 tema ke taksonomi + filter brief form
7. VERIFY    → e2e render tiap gaya (SSR), no-regression, checklist performa UI
               + scorecard pixel (THEME_VISUAL_PIPELINE.md §3.2) — tiap bar kini
               menelusuri balik ke rule "must" bernomor di design-rules/<mood>.md
```
Makin banyak sub-kategori dibuat, makin penuh perpustakaan balok → makin cepat berikutnya.

> **`design-rules/<mood>.md`** (5 file, `src/lib/theme-system/design-rules/`, ditulis
> 2026-06-07, format ala TypeUI `skill.md` — must/should anchored ke data 96 tema
> produksi nyata, bukan dikira-kira) menutup celah "tiap tema re-derive dari memori
> apa itu warm/luxury/bold" — sumber kebenaran tunggal yang dipakai DEFINE (front,
> cross-check) **dan** POLISH/VERIFY (back, checklist+scorecard). Generator skeleton:
> `gen-design-rules.test.ts` (`GEN_DESIGN_RULES=1`, skip-if-exists — tak menimpa hasil
> authored). Berlaku mulai sprint setelah S9 (S10+).

### 5.a Gerbang kualitas 3 skill (WAJIB tiap tema — keputusan 2026-06-05)
Tiap tema harus dimaksimalkan dari **tiga sisi**; tiap sisi punya skill penjaga:
| Skill | Aspek dijamin |
|---|---|
| **/ui-design** | Tampilan — struktur, hierarki, kepatuhan sistem desain, arah visual |
| **/make-interfaces-feel-better** | Rasa — mikro-interaksi, motion, polish taktil |
| **/website-review** | Pesan — copy, persuasi, konversi (Ogilvy/CRO) |
Jalankan ketiganya pada tiap gaya sebelum WIRE/aktivasi. Tema tak dianggap "matang"
sampai lolos ketiga lensa ini. (Lihat [[feedback-theme-system-skills]].)

**Sejak 2026-06-07, gerbang ini punya checklist tertulis konkret untuk dinilai** —
bukan lagi "prinsip diterapkan saat membangun" yang abstrak. `design-rules/<mood>.md`
§4 (States: default/hover/focus-visible/active/disabled/loading/empty, must/should)
dan §5 (Accessibility checklist + catatan spesifik-mood) memberi /ui-design dan
/make-interfaces-feel-better target bernomor untuk dicocokkan per mood.

**Lensa ke-4 (pixel) — "terbukti":** ketiga skill di atas menilai *kode*. Untuk menutup
celah "kurang menarik", tambah lensa ke-4 yang menilai *hasil render*: `ui-ux-pro-max`
(palet/font dari DB di Step DEFINE + scorecard di Step VERIFY) + **Playwright** (screenshot
3 viewport). Pipeline lengkap + budget token + setup di **`THEME_VISUAL_PIPELINE.md`**.
Ini bukan sprint baru — alat yang dipakai *di dalam* playbook §5, mulai Sprint 7.
**Prasyarat:** ✅ DONE (2026-06-07) — Playwright+chromium installed, `ui-ux-pro-max` aktif,
`scripts/shoot-themes.mjs` jalan (smoke test umum-bluecare OK). Sisa: generator HTML tema baru (garap saat S7).

---

## 6. Penempatan input sub-kategori (KEPUTUSAN FINAL)
**Customer-facing, di brief form, mini-step ANTARA Konten dan Branding.**

```
Step 1 Konten → Step 1.5 "Toko kamu jualan apa?" → Step 2 Branding (3 gaya TER-FILTER)
                  [Kuliner][Fashion][Kerajinan]…       ↑ hanya tema cocok + live preview
```
- **Kenapa di sini (bukan /order, bukan admin):** customer puas memilih sendiri (self-service); kontekstual tepat sebelum pilih tema; seam selector+preview sudah ada di Step Branding.
- **Teknis:** `getVariants(tipe)` → `getThemes(tipe, subKategori)`.
- **Penyimpanan data:**
  ```
  briefing_data.branding.sub_kategori = 'kuliner'         ← BARU (enum terkontrol)
  briefing_data.branding.variant      = 'kuliner-rustic'  ← tema terpilih
  ```
  Dibaca `normalizeBriefing` → menentukan manifest/renderer saat Bangun Draft.

### Jangan ketuker dengan field yang sudah ada
| Field | Fungsi | Bentuk |
|---|---|---|
| `kategori_produk` (ADA) | tag produk untuk **konten** | teks bebas ("Batik, Aksesoris…") |
| `sub_kategori` (BARU) | routing **tema** | enum terkontrol (Kuliner/Fashion/…) |

---

## 7. Strategi panen renderer lama → perpustakaan balok
Renderer bespoke lama **bukan dibuang** — tambang balok:
- `BatikTokoRenderer`, `RestaurantRenderer`, `KlinikRenderer`, `SekolahRenderer`, `CompanyRenderer` berisi section buatan-tangan berkualitas.
- Ekstrak section-nya jadi **varian di Lapis 2** (Hero/Produk/Testimoni/dll), parametrik via token.
- Membangun Kuliner ×3 sekaligus **mengisi perpustakaan** yang dipakai semua tema berikutnya.
- Renderer lama tetap aktif sampai variant-nya dipetakan ulang ke manifest (migrasi bertahap, nol regresi).

---

## 8. Urutan eksekusi
- **Sprint 0 — Infrastruktur (sekali, dipakai semua):**
  - Skema taksonomi: tipe `SubKategori` + registry `THEMES[tipe][subKategori] = Theme[]`.
  - Mesin composable: tipe `ThemeManifest`, `ComposableRenderer` yang membaca manifest → merakit balok Lapis 2 + token Lapis 1.
  - Perpustakaan balok awal: panen 1–2 varian Hero + Produk dari renderer lama sebagai benih.
  - Brief form: mini-step "Tipe Toko" + `getThemes(tipe, subKategori)` + preview ter-filter.
  - Data: tulis/baca `branding.sub_kategori`; `normalizeBriefing` paham field baru.
- **Sprint 1 — Pilot Kuliner ×3 (cetakan end-to-end):** jalankan playbook §5 penuh utk Kuliner. Tes pempek = Rustic/Heritage.
- **Sprint 2+ — Replikasi:** Fashion, Kerajinan (panen batik), lalu sisanya. Tiap sub-kategori = 1 putaran playbook.
- **Industri lain:** setelah Toko Online matang, pola sama ke restaurant/klinik/dll (research & jalankan).

Aturan produksi (selaras UPGRADE_PLAN): 1 langkah = 1 branch = 1 PR; additive dulu; verify (Vercel Ready + SSR render) sebelum merge; tiap langkah shippable + rollback; nol regresi page published.

---

## 9. Definisi "selesai"
- **Per tema (gaya):** manifest + balok lengkap; render SSR benar; responsif & lolos checklist performa UI; preview di brief form akurat.
- **Per sub-kategori:** 3 gaya lengkap & terverifikasi; muncul di brief form ter-filter; seed konten ada; nol regresi.
- **Sprint 0:** mesin composable + taksonomi + mini-step brief form jalan; minimal 1 tema composable render live tanpa merusak yang lama.
- **Program:** customer pilih industri → sub-kategori → 3 gaya otentik per sub-kategori, self-service, lintas sub-kategori Toko Online; pola terbukti dapat diulang.

---

## 10. Risiko & mitigasi
- **Investasi awal besar sebelum buah terasa** → urutan: infra dulu (Sprint 0), pilot 1 sub-kategori, baru replikasi. Tiap sprint shippable.
- **Perpustakaan balok membengkak tak konsisten** → governance: varian section harus parametrik via token, bukan hardcode warna; review tiap balok baru.
- **Regresi page published** → renderer lama tetap aktif; migrasi variant→manifest bertahap; verify SSR per langkah.
- **Customer bingung sub-kategori vs kategori_produk** → label & microcopy jelas di mini-step ("ini untuk pilih gaya tampilan", terpisah dari tag produk).
- **Skala manifest tetap meledak di industri ×sub-kat ×gaya** → tetap terkendali karena unit = file resep kecil + balok berbagi; bukan renderer.

---

## 11. Log progres (diisi sambil jalan)
| Tanggal | Sprint/Tema | Status | Catatan |
|---|---|---|---|
| 2026-06-05 | — | Plan disusun | Arsitektur composable + penempatan brief form disepakati. |
| 2026-06-05 | S0-1 | ✅ merged (PR #63) | Taksonomi `taxonomy.ts` (8 sub-kat toko_online + Kuliner ×3 stub) + standar ikon lucide. |
| 2026-06-05 | S0-2 | ✅ merged (PR #64) | Mesin `ComposableRenderer` + `ThemeManifest` (Kuliner ×3 benih) + balok (`blocks.tsx`). |
| 2026-06-05 | S0-3 | ✅ merged (PR #65) | Mini-step "Tipe Toko" + `ThemePicker`/`SubKategoriPicker` di brief form (dormant). |
| 2026-06-05 | S0-4 | ✅ merged (PR #66) | `normalizeBriefing` baca sub_kategori; `content-adapter`; SiteRenderer route composable. |
| 2026-06-05 | **Sprint 0** | 🟢 **LENGKAP** | Infrastruktur dormant, nol regresi, 48/48 test hijau. Siap Sprint 1 (Kuliner otentik + flip ready). |
| 2026-06-05 | S1-1 | ✅ merged (PR #67) | Token-pack otentik 3 gaya Kuliner (`theme-packs.ts`): rustic cream-terracotta / modern putih-oranye / heritage maroon-gold. 51/51 test. |
| 2026-06-05 | Review user | 📝 catatan | User preview 3 gaya pada konten pempek (via DB swap variant, draft). User pribadi suka HERITAGE — **TAPI bukan acuan**: variasi WAJIB, jangan kloning heritage ke semua tema. Minta: foto hero + lebih cerah → S1-2. Standar baru: gerbang 3 skill (§5.a). |
| 2026-06-05 | S1-2 | ✅ merged (PR #68) | Balok food-grade: dukungan foto hero (scrim) + section keunggulan "Mengapa Kami" (grid/rows per gaya). |
| 2026-06-05 | S1-3 | ✅ merged (PR #69) | Gerbang 3 skill: hero gradient-mesh, ritme section, tabular-nums, stagger, glow tombol, CTA bergradien, floating WhatsApp; copy keunggulan diperbaiki. |
| 2026-06-05 | S1-4 | ✅ merged (PR #70) | UX picker aman: opsi "Lainnya (gaya umum)" → toko non-kuliner jatuh ke variant lama. |
| 2026-06-05 | S1-5 | ✅ merged (PR #71) | **AKTIVASI** Kuliner ready:true. Mini-step LIVE di Toko Online. |
| 2026-06-05 | **Sprint 1** | 🎉 **LENGKAP & LIVE** | Kuliner ×3 otentik aktif di produksi, 53/53 test. Berikutnya: replikasi Fashion/Kerajinan via playbook. |
| 2026-06-05 | S2-1 | ✅ merged (PR #72) | Token-pack Fashion ×3 (`theme-packs.ts`) + manifest + registry: editorial (charcoal mono gelap), minimalis (greige Scandinavian terang), vibrant (indigo elektrik). Dormant. Ikon Camera/Wind/Zap. |
| 2026-06-05 | S2-2 | ✅ merged (PR #73) | Balok **Lookbook** (`ShowcaseLookbook`): spread featured + grid portrait 3/4, image zoom CSS-only, index editorial, harga tabular. `ShowcaseVariant`+'lookbook'; editorial pakai lookbook. |
| 2026-06-05 | Verify | 📝 SSR screenshot | Render 3 gaya + lookbook via headless Chrome → 3 gaya distinct, lookbook editorial premium. Lolos gerbang 3 skill. |
| 2026-06-05 | S2-3 | ✅ merged (PR #74) | **AKTIVASI** Fashion ready:true. Microcopy picker dipertajam (buang jargon, pola self-select). Mini-step Fashion LIVE. |
| 2026-06-05 | **Sprint 2** | 🎉 **LENGKAP & LIVE** | Fashion ×3 otentik aktif di produksi, 63/63 test. Perpustakaan balok +lookbook. Berikutnya: Kerajinan (panen batik) via playbook. |
| 2026-06-05 | S3-infra | ✅ | **MOTIF engine** (panen batik): `MotifVariant` (kawung/tenun), `MotifOverlay` + strip footer ditint primary (parametrik), threaded via ComposableRenderer. Font ROUNDED + 16 ikon lucide baru. Nol regresi (motif default 'none'). |
| 2026-06-05 | S3 ×6 sub-kat | ✅ | **18 tema baru** sekaligus: Kerajinan/Kecantikan/Gadget/Rumah/Kesehatan/Anak ×3. Token-pack + manifest + taxonomy (ready:true) + sample-content (konten benefit-led + foto Unsplash verified 200). Tiap sub-kat lolos VARIASI (gelap↔terang, mood beda — dijaga test). |
| 2026-06-05 | **Sprint 3** | 🎉 **LENGKAP & LIVE** | Toko Online TUNTAS: 8 sub-kat ×3 = **24 tema**. 99/99 test, typecheck + next build bersih. Gerbang 3 skill diterapkan sbg design-review. Berikutnya: industri lain. |
| 2026-06-06 | Sprint 3 deploy | ✅ **PROD** (PR #76 merged) | Squash-merge ke master, CI (Typecheck & Render Tests) + Vercel hijau, deploy production Ready. Verified: root 200, `/admin/theme-preview` 307 (route live). Roadmap berikutnya → §12. |
| 2026-06-06 | **Sprint 5** | 🎉 **LENGKAP** | Perpustakaan balok diperluas: **Testimoni** (cards/spotlight/marquee), **Stats**, **FAQ accordion** (CSS-only `<details>`), **Info/Lokasi** (jam buka + peta embed Google Maps tanpa API key + reservasi). Semua parametrik via token, default off (nol regresi), reduced-motion guard. Types `ComposableContent`+`ThemeManifest.blocks` diperluas; ComposableRenderer di-wire; content-adapter isi `info` dari profil bisnis (jam/alamat/wa). |
| 2026-06-06 | **Sprint 4** | 🎉 **LENGKAP & LIVE** | Industri **Restaurant** ×3 sub-kat (Warung/Cafe/Fine Dining) ×3 gaya = **9 tema** AKTIF (ready:true). Token-pack VARIASI gelap↔terang tiap sub-kat (warung: rakyat·sambal·angkringan / cafe: latte·roastery·bloom / finedining: aurum·hearth·nordic); manifest pakai balok S5; sample-content 3 sub-kat (copy F&B spesifik + testimoni atribut + foto Unsplash verified 200). Admin preview di-generalisasi lintas industri. Arsitektur generik → routing otomatis via `getManifest`. |
| 2026-06-06 | Gerbang 3 skill + verify | 📝 SSR screenshot | /ui-design + /make-interfaces-feel-better + /website-review diinvokasi; prinsip diterapkan saat build. 3 flagship (warung-rakyat/cafe-latte/finedining-aurum) di-render headless Chrome → distinct, premium, light↔dark span terbukti. 127/127 test, typecheck + next build bersih. |
| 2026-06-07 | Sprint 4+5 deploy | ✅ **PROD** (PR #77 merged) | Squash-merge ke master, CI Typecheck&Render + Vercel hijau. Restaurant + balok S5 live. |
| 2026-06-07 | **Sprint 5b** | 🎉 **LENGKAP** | Balok **Galeri**: `masonry` (foto fasilitas, CSS columns + caption overlay) + `before-after` (pasangan Sebelum/Sesudah, label, lift hover). `GalleryVariant` + `ThemeManifest.blocks.gallery` + `ComposableContent.gallery{images,pairs}`. Parametrik, default off, nol regresi. |
| 2026-06-07 | **Sprint 6** | 🎉 **LENGKAP & LIVE** | Industri **Klinik** ×3 sub-kat (Umum/Estetik/Wellness) ×3 gaya = **9 tema** AKTIF. Umum(bluecare biru/freshteal teal/trustnavy navy-gelap) · Estetik(rosegold/derma/noir-gelap, pakai before-after) · Wellness(sage/terra/forest-gelap, masonry). VARIASI gelap↔terang tiap sub-kat. theme-packs 9 + manifest 9 (booking via info CTA "Buat Janji") + sample-content 3 sub-kat (copy medis spesifik + foto Unsplash verified 200). ThemeIcon +6 ikon medis. |
| 2026-06-07 | Gerbang 3 skill + verify | 📝 SSR screenshot | Prinsip 3 skill diterapkan saat build. Flagship (umum-bluecare/estetik-rosegold/wellness-forest/umum-trustnavy) di-render headless Chrome → distinct, profesional, light↔dark + before-after/masonry terbukti. 155/155 test, typecheck + next build bersih. HTML contoh 9 gaya di `theme-samples/` (lokal, tak di-commit). |
| 2026-06-07 | Sprint 6 deploy | ✅ **PROD** (PR #78 merged) | Squash-merge ke master, CI + Vercel hijau. Klinik + galeri S5b live. |
| 2026-06-07 | Pipeline seam | ✅ | Generator HTML tema baru: `src/lib/theme-system/gen-samples.test.tsx` (env-gated `GEN_SAMPLES`, SSR ComposableRenderer → `theme-samples/<id>.html`+index). `.gitignore` += `theme-samples/` penuh. Wire seam §3.1 THEME_VISUAL_PIPELINE.md. |
| 2026-06-07 | **Sprint 7** | 🎉 **LENGKAP & LIVE** | Industri **Sekolah** ×3 sub-kat (Reguler/Islami/Kursus) ×3 gaya = **9 tema** AKTIF. Reguler(cerdas biru/ceria amber/prestasi navy-emas-gelap) · Islami(hijau emerald/emas krem/malam emerald-gelap) · Kursus(fokus indigo/energi coral/malam violet-gelap). VARIASI gelap↔terang tiap sub-kat. **Palet+font dari ui-ux-pro-max DB** (bukan invent). showcase=program, stats=akreditasi, info=PPDB CTA, gallery masonry=kegiatan. ThemeIcon +8 ikon. sample-content 3 sub-kat (copy edukasi spesifik + foto Unsplash verified 200). |
| 2026-06-07 | **Pipeline visual** (front+back) | 📝 scorecard PASS | **Pertama kali pipeline penuh.** Front: ui-ux-pro-max DB → palet/pairing per sub-kat (kontras ≥4.5:1). Back: `scripts/shoot-themes.mjs` shoot 6 gaya ×3 viewport (375/768/1440) → scorecard ui-ux-pro-max pada pixel → semua CRITICAL/HIGH hijau, no iterate. 181/181 test, tsc + build bersih. HTML 51 tema di `theme-samples/index.html` (lokal). |

---

## 12. Roadmap sprint berikutnya (RENCANA — BELUM DIJALANKAN)
> Disusun 2026-06-06 atas permintaan user: **rencanakan, jangan eksekusi**. Toko Online sudah TUNTAS (8 sub-kat ×3 = 24 tema). Dua arah ekspansi: **(A) lebar** — bawa sub-kategori+tema ke industri lain; **(B) dalam** — perkaya perpustakaan balok agar tema makin hidup & beragam. Saran urutan: Sprint 4 → 7 di bawah. Tiap sprint tetap patuh aturan produksi (1 langkah=1 PR, additive, nol regresi, VARIASI wajib #6, gerbang 3 skill §5.a) dan playbook §5.

### Sprint 4 — Industri RESTAURANT ×3 sub-kategori — ✅ SELESAI (2026-06-06)
- **Hasil:** 9 tema AKTIF. Sub-kat **Warung/Kedai** (rakyat·sambal·angkringan) · **Cafe/Coffee Shop** (latte·roastery·bloom) · **Fine Dining/Resto Keluarga** (aurum·hearth·nordic). Tiap sub-kat taat VARIASI gelap↔terang.
- **Dikerjakan:** taksonomi `INDUSTRY_SUBKATEGORI.restaurant` + `THEMES.restaurant` · 9 token-pack + 9 manifest · sample-content 3 sub-kat · admin preview lintas industri · `ready:true`.
- **Terbukti:** arsitektur generik per-industri → brief form & SiteRenderer otomatis ikut via `getManifest`. Tak perlu kode khusus restaurant di jalur render.
- **Belum (opsi lanjut):** balok showcase **menu bergambar/board** & **galeri masonry** belum dipanen dari `RestaurantRenderer`; briefing belum punya field testimoni/stats/faq (jadi di produksi hanya balok **info** yang terisi otomatis dari profil — sisanya muncul saat konten tersedia).

### Sprint 5 — Perkaya PERPUSTAKAAN BALOK — ✅ SELESAI (2026-06-06/07)
- **Selesai S5:** **Testimoni** [cards / spotlight / marquee] · **Stats/angka** · **FAQ accordion** (CSS-only `<details>`) · **Map/Lokasi + jam** (embed Google Maps tanpa API key + reservasi CTA).
- **Selesai S5b (2026-06-07):** **Galeri** [masonry / before-after]. Semua parametrik via token, default off, reduced-motion guard, + test render.

### Sprint 6 — Industri KLINIK ×3 sub-kategori — ✅ SELESAI (2026-06-07)
- **Hasil:** 9 tema AKTIF. **Umum/Gigi** (bluecare·freshteal·trustnavy) · **Estetik/Skincare** (rosegold·derma·noir, pakai before-after) · **Fisio/Wellness** (sage·terra·forest, pakai masonry). VARIASI gelap↔terang tiap sub-kat.
- **Dikerjakan:** taksonomi `klinik` + 9 token-pack + 9 manifest + sample-content 3 sub-kat + 6 ikon medis. Booking = balok `info` "Buat Janji"/"Konsultasi"/"Jadwalkan". Routing otomatis via `getManifest` (komposable dicek sebelum cabang bespoke `theme==='klinik'` → coexist, nol regresi).
- **Belum (opsi lanjut, PENTING):** composable route di SiteRenderer hanya fetch **products** → klinik produksi nyata pakai **services** (fetchServicesByPage), jadi showcase kosong sampai adapter/route klinik memetakan services→showcase. Preview pakai sample-content (lengkap). Hero/features/testimoni/info/galeri tetap jalan. **Follow-up:** extend composable branch SiteRenderer fetch services utk industri jasa (klinik/sekolah/company).

### Sprint 7 — Industri SEKOLAH ×3 sub-kategori — ✅ SELESAI (2026-06-07)
- **Hasil:** 9 tema AKTIF. **Reguler (SD/SMP/SMA)** (cerdas·ceria·prestasi) · **Islami/Pesantren** (hijau·emas·malam) · **Kursus/Bimbel** (fokus·energi·malam). VARIASI gelap↔terang tiap sub-kat. Struktur = sub-kategori (bukan 3-gaya-langsung) — keputusan user.
- **Dikerjakan:** taksonomi `sekolah` + 9 token-pack (palet/font dari **ui-ux-pro-max DB**) + 9 manifest + sample-content 3 sub-kat + 8 ikon (GraduationCap/Backpack/Trophy/BookOpen/Star/Target/Rocket/PencilRuler). info=PPDB/daftar CTA. **Pipeline visual penuh dipakai** (front DB + back Playwright scorecard).
- **PERTAMA:** generator HTML tema baru di-wire (`gen-samples.test.tsx`) → bisa shoot tema apa pun.
- **Belum (sama spt Klinik):** showcase produksi butuh services→mapping (composable route fetch products saja). Preview lengkap via sample-content.

### Sprint 8a — Industri PERSONAL / PORTFOLIO — ✅ SELESAI (2026-06-07)
- **Hasil:** 9 tema AKTIF. **Kreator** (spotlight dark/pop light/clean light) · **Profesional** (korporat light/mono dark/warm) · **Coach** (energi light/tenang light/prestige dark). VARIASI gelap↔terang. Pipeline visual penuh (DB front + scorecard back, PASS).
- **Dikerjakan:** `theme-packs/personal.ts` + 9 manifest + sample-content 3 sub-kat + 8 ikon (Video/Briefcase/Compass/Mic/Heart/Aperture/PenTool/Award). SiteRenderer: `personal`→services, judul "Layanan Saya".

### Sprint 8b — Industri COMPANY / CORPORATE — ✅ SELESAI (2026-06-07)
- **Hasil:** 9 tema AKTIF (tipe `corporate`). **Startup** (aurora light/midnight dark/mint light) · **Agency** (bold light/noir dark/prisma light) · **Korporat** (biru light/slate dark/netral warm). VARIASI gelap↔terang. Pipeline visual penuh (scorecard PASS).
- **Dikerjakan:** `theme-packs/company.ts` + 9 manifest + sample-content 3 sub-kat + 7 ikon (Megaphone/Building2/Building/Gauge/Boxes/Layers/Landmark). corporate sudah di SERVICE_INDUSTRI → showcase=services otomatis.

### Sprint 9 — Industri tersisa (Travel/Blog/Jastip) — ✅ SELESAI (2026-06-07)
- **Hasil:** 27 tema AKTIF. **Travel** (kendaraan asphalt-dark/bersih/kuning · wisata tropis/rimba-dark/senja · akomodasi resort/kayu/malam-dark) · **Blog** (jurnal hangat/mono/senja-dark · media merah/biru/malam-dark · niche hijau/pop/gelap-dark) · **Jastip** (luar global/premium-dark/pop · lokal hangat/segar/gelap-dark · preorder fokus/energi/malam-dark).
- **Dikerjakan:** theme-packs/{travel,blog,jastip}.ts + 27 manifest + sample-content 9 sub-kat + 21 ikon. **blog→blog_posts** mapping di SiteRenderer (judul→nama, ringkasan→deskripsi, cover→gambar, "Artikel Terbaru"); travel→"Pilihan Kami"; jastip→"Katalog Titipan".
- **SEMUA `TipeIndustri` (kecuali `custom`) kini punya tema composable.** Coverage industri tuntas.

### Polish lintas-sprint
- ~~**#4 next/font asli**~~ — ✅ SELESAI (2026-06-07). Jakarta/Fraunces/Space Grotesk/Nunito via `[slug]/layout.tsx`, `_fonts.ts` var()+fallback. Ganti font per-keluarga di sini bila mau variasi tipografi lebih jauh.
- **Opsi lanjut:** perdalam balok (hero/showcase varian baru), pecah `theme-packs.ts` lebih granular bila perlu, atau industri `custom` (saat ini fallback variant lama).
- **Lapis baru siap pakai (2026-06-07):** `design-rules/<mood>.md` (§5/§5.a di atas) —
  konsultasikan di DEFINE **sebelum** sprint berikutnya dimulai (S10+, atau "perdalam
  blok"/`custom`), apa pun arah yang dipilih user. Juga berguna retroaktif: bisa dipakai
  meng-grade ulang salah satu dari 96 tema yang sudah live bila ada keluhan "kurang pas
  dengan mood"-nya.

### Hal lintas-sprint yang perlu diputuskan user (sebelum eksekusi)
1. ~~**Urutan industri**~~ — DIPUTUSKAN: Restaurant (S4) → Klinik (S6) → berikutnya Jasa/Personal/Sekolah (S7).
2. **Sub-kategori vs langsung-3-gaya** per industri — untuk S7 (personal/company/sekolah varian tipis) pertimbangkan 3-gaya-tanpa-sub-kat.
3. ~~**Gerbang 3 skill**~~ — DIPUTUSKAN: invokasi skill literal pada gaya flagship (dipakai S4 & S6).
4. **next/font asli** — masih stack sistem (SANS/SERIF/GROTESK/ROUNDED). Upgrade ke `next/font` per gaya = polish lintas-sprint (BELUM).
5. ~~**Konsolidasi `theme-packs.ts`**~~ — ✅ DONE (2026-06-07, FU#2). Dipecah jadi `theme-packs/{toko,restaurant,klinik,sekolah}.ts` + `_fonts.ts` + `index.ts` (gabung THEME_PACKS). Tambah industri = +1 file + daftar di index.
6. ~~**Services→showcase utk industri jasa**~~ — ✅ DONE (2026-06-07, FU#1). Composable route SiteRenderer fetch source per `tipe_industri`: toko_online→products, restaurant→menu_items, jasa(klinik/sekolah/corporate/travel)→services. content-adapter map generik + judul kontekstual ("Produk/Menu/Layanan/Program Kami").
7. ~~**Visual pipeline (lensa pixel)**~~ — ✅ HIDUP sejak S7. ui-ux-pro-max DB (front) + Playwright shoot + scorecard (back) + generator HTML (`gen-samples.test.tsx`). Dipakai di playbook §5 tiap sprint berikutnya.

> **Status: S4–S9 + FU#1/FU#2 + Polish next/font SELESAI & LIVE — 96 tema, 9 industri (coverage TipeIndustri tuntas kecuali `custom`), font asli aktif.** Program tema dasar TUNTAS. Opsional: perdalam balok/varian, font alternatif, industri custom.

---

## 13. DIAGNOSIS — "Layout belum variatif menggambarkan industri" (2026-06-08)

> Ditulis 2026-06-08 atas keluhan user: *"layout yang dihasilkan masih belum variatif menggambarkan industrinya."* Investigasi 3 lapis (manifest → adapter → generasi konten + schema DB). **Belum dieksekusi — ini temuan + rencana.** Tujuan §ini: capture durable supaya tak perlu re-investigasi saat fix ini digarap.

### 13.1 Temuan inti
Keluhan **benar dan terukur**. 96 tema = 96 variasi **kulit** (palet/font/token), bukan variasi **rangka** (struktur + urutan section). Sistem berhasil bikin keragaman token, **gagal** bikin keragaman anatomi halaman. Industri tak terbedakan oleh layout — hanya oleh warna.

### 13.2 Bukti keras (96 manifest, `src/lib/theme-system/manifest.ts`)
- **Showcase — section paling "menggambarkan industri" — 90% identik:** `card-grid` 86/96 · `menu-list` 7 · `lookbook` 3. Toko=produk, resto=menu, klinik=layanan, sekolah=program, travel=armada/kamar, blog=artikel, jastip=katalog — **semua jadi kartu 4:3 + judul + harga rupiah yang sama** (`blocks.tsx:405 ShowcaseCardGrid`).
- **Kosakata bentuk lain tipis:** features `grid` 65 / `rows` 30 / `zigzag` 1 (praktis 2 bentuk) · hero `centered` 33 / `fullbleed` 32 / `split` 31 (3 bentuk generik, cuma posisi). Blok konversi/trust nyaris tak dipakai: `process` 4× · `pricing` 5× · `about`-varian 2× · `cta`-varian 1× · `partners` 2× · `team` 2×.
- **Urutan section DI-HARDCODE** (`ComposableRenderer.tsx:45-159`): Nav→Hero→Features→Showcase→Process→Stats→Partners→Team→Testimoni→Gallery→Info→About→Pricing→FAQ→CTA→Social→Footer. Manifest **tak bisa** atur ulang ritme. Anatomi vertikal 96 tema identik.

### 13.3 Root-cause stack (3 lapis — semua wajib disentuh, urut)
```
Lapis 1 GENERASI  (src/lib/build/templates.ts)
  auto-build isi dataKonten TIPIS: {nama_usaha, tagline, deskripsi, keunggulan,
  kontak, syarat_sewa} + sections + showcase source. Return literal
  { dataKonten, sections, services } — TANPA testimoni/stats/faq/team/pricing/
  process/partners/social/gallery. (lihat templates.ts:114-134 dst, tiap industri.)
  → Adapter parse field itu dari data_konten → undefined → balok TAK dirender.
  → Situs auto-build fresh hanya render: Hero → Features → Showcase(card-grid)
    → CTA → (Info bila profil ada jam/alamat). ~4-5 section, identik lintas industri.
  → "96 tema kaya 10+ blok" = ILUSI sample-content (preview admin). Klien nyata
    dapat kerangka kerdil. PRODUKSI ≠ PREVIEW.

Lapis 2 ADAPTER  (src/lib/theme-system/content-adapter.ts:13-40)
  ShowcaseSourceItem dipaksa flatten ke {nama, harga, desc, gambar} untuk SEMUA
  industri ("Composable showcase generik → satu mapper"). Field khas industri
  yang SUDAH ADA di DB & SUDAH diisi template DIBUANG di sini.

Lapis 3 RENDER  (ComposableRenderer.tsx + blocks.tsx)
  showcase 90% card-grid + urutan section hardcode → bentuk seragam walau data kaya.
```

### 13.4 Verdict schema DB (cek via MCP supabase-websitebuilder `list_tables`, 2026-06-08)
**Sinyal industri SUDAH ADA di DB — tak perlu migration.** Yang dibuang adapter:

| Tabel | Dipakai adapter | DIBUANG (sudah ada di DB) |
|---|---|---|
| `products` | nama, deskripsi, harga, gambar_url | **kategori, stok** |
| `services` | nama, deskripsi, harga, gambar_url | **durasi_menit, kategori, dp_amount** |
| `menu_items` | nama, deskripsi, harga, gambar_url | **kategori** (→ menu tak bisa dikelompokkan) |
| `blog_posts` | judul→nama, ringkasan→desc, cover→gambar | **penulis, published_at, konten** |

Catatan: `templates.ts:110-111` malah SUDAH isi `kategori` di item armada ('Harian' dst) — lalu adapter buang. Sinyal dibikin, lalu dibuang.

### 13.5 Rencana fix — Sprint 10: "Variasi Layout (skeleton + konten, bukan skin)"
Urutan WAJIB (fix Lapis 3 saja tak kelihatan di produksi selama Lapis 1 & 2 belum):
1. **Lapis 1 — perkaya auto-build.** Generate testimoni/stats/faq (+ team/process per industri yang relevan) di `templates.ts` sebagai konten contoh; klien revisi pasca-DP (konsisten timing konten: konten dikumpulkan SETELAH DP, Claude draftkan dulu). Tanpa ini, balok baru apa pun tetap kosong di produksi.
2. **Lapis 2 — adapter bawa field industri.** Lebarkan `ShowcaseSourceItem` + map `kategori`/`durasi_menit`/`penulis`/`published_at`/`stok` lewat ke `ComposableContent`.
3. **Lapis 3 — balok showcase khas-industri** (mis. `ShowcaseServiceList` klinik/jasa: ikon+durasi+harga · `ShowcaseRooms` travel: foto besar+amenity · `ShowcaseArticles` blog: feed+kategori+tanggal+penulis · `ShowcaseMenuBoard` resto: berkategori). Lalu **petakan default per industri** (klinik→service-list, travel→rooms, blog→articles), bukan card-grid global. Audit 86 manifest card-grid, alihkan ke varian yang lebih cocok (murah, dampak cepat).
4. **Lapis 3b (opsional) — urutan section via manifest.** Ganti urutan hardcode `ComposableRenderer` jadi `manifest.sections: string[]` → industri bisa beda ritme (blog taruh feed lebih atas; klinik taruh team+info lebih awal).

### 13.6 Patuh aturan produksi
Tiap lapis = 1+ branch = 1+ PR, additive, nol regresi page published (renderer/varian lama tetap jalan; default baru hanya untuk tema yang dipetakan ulang), VARIASI wajib (#6), gerbang 3 skill §5.a + scorecard pixel (THEME_VISUAL_PIPELINE.md §3.2) saat VERIFY. Cek pixel (Playwright) = langkah VERIFY, bukan blocker analisis.

### 13.7 Status
- **Investigasi:** ✅ SELESAI & terbukti (kode + schema, bukan asumsi). Cukup dalam untuk eksekusi.
- **Eksekusi Sprint 10:** ⬜ BELUM. Mulai dari Lapis 1.
