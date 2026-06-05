# THEME SYSTEM PLAN — Ekspansi Tema Otentik per Sub-Kategori

> **Sumber kebenaran durable** untuk program ekspansi tema JA Website Builder. Survive restart/terminal mati. Berbeda dari `UPGRADE_PLAN.md` (hardening platform 7→10, hampir tuntas) — file ini adalah **program berkelanjutan**: menambah tema otentik terus-menerus. Disusun 2026-06-05.

---

## 0. CURRENT STATUS (baca dulu)
- **Fase aktif:** 🟢 **Sprint 0 (infrastruktur) LENGKAP** — semua merged ke master, DORMANT (nol regresi).
- **Pilot:** Toko Online → sub-kategori **Kuliner ×3 gaya** sebagai cetakan end-to-end.
- **Yang sudah jalan (dormant):** taksonomi+registry, mesin ComposableRenderer+balok, mini-step brief form, resolusi build. Semua aktif HANYA saat sub-kategori ditandai `ready` — sekarang nol → produksi tak berubah, renderer lama utuh.
- **Step berikutnya:** **Sprint 1** — bangun 3 gaya Kuliner OTENTIK (token+balok penuh) lalu **flip Kuliner `ready: true`** di `taxonomy.ts` untuk mengaktifkan. Lihat §8 + playbook §5.
- **Keputusan standar tambahan (S0-1):** ikon = **lucide-react** (bukan emoji) — dijaga test anti-emoji. Calon isi `STANDARDS.md` saat ditulis.

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
3. BUILD     → varian section BARU yang belum ada di perpustakaan (kalau perlu)
4. SEED      → konten contoh per sub-kategori (preview langsung "hidup")
5. POLISH    → GERBANG KUALITAS 3 SKILL (wajib, lihat §5.a)
6. WIRE      → daftarkan sub-kategori + 3 tema ke taksonomi + filter brief form
7. VERIFY    → e2e render tiap gaya (SSR), no-regression, checklist performa UI
```
Makin banyak sub-kategori dibuat, makin penuh perpustakaan balok → makin cepat berikutnya.

### 5.a Gerbang kualitas 3 skill (WAJIB tiap tema — keputusan 2026-06-05)
Tiap tema harus dimaksimalkan dari **tiga sisi**; tiap sisi punya skill penjaga:
| Skill | Aspek dijamin |
|---|---|
| **/ui-design** | Tampilan — struktur, hierarki, kepatuhan sistem desain, arah visual |
| **/make-interfaces-feel-better** | Rasa — mikro-interaksi, motion, polish taktil |
| **/website-review** | Pesan — copy, persuasi, konversi (Ogilvy/CRO) |
Jalankan ketiganya pada tiap gaya sebelum WIRE/aktivasi. Tema tak dianggap "matang"
sampai lolos ketiga lensa ini. (Lihat [[feedback-theme-system-skills]].)

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
