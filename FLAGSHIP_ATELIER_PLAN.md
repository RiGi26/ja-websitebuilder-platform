# FLAGSHIP "TOKO ATELIER" — Template Maksimal Pilot (Bespoke, Toko/Fashion)

> Status: **S1–S4 SELESAI — PR #119 open (dark-launched)** (2026-06-10). Checkpoint A approved; B+C dilebur ke review HTML final atas perintah owner ("jalankan sprint 2 3 dan 4").
> Keputusan owner: pilot = **toko/fashion** · vehicle = **bespoke one-off renderer** (Opsi A, pola restaurant-lux; porting cost ke composable = accepted).
> Sisa: owner review `theme-samples/toko-atelier.html` + `npm test`/`npm run shoot toko-atelier` lokal → merge → UAT swap `branding.theme='toko-atelier'` di 1 site uji. Varian ivoire + admin preview = fast-follow opsional (di luar PR ini).

## Konteks

Hasil `theme-samples/lux-*.html` per industri dinilai belum maksimal di 3 sisi: **layout, animasi, kecanggihan**. Audit objektif vs situs agency-grade: tidak ada full-bleed/overlap/asimetri radikal, tidak ada scroll-choreography/parallax/count-up, tidak ada lightbox/carousel/filter, vocabulary shadow-gradient-tipografi dasar. Solusi: bangun **1 template flagship maksimal** sebagai bukti kualitas + sumber pola, sebelum mengangkat industri lain.

## Temuan teknis kunci (verified)

1. **`CeReveal.tsx` = `'use client'`+`useEffect`+`return null`** → mati total di `renderToStaticMarkup`; static samples tanpa `<script>`. Pola benar = **`BatikTokoRenderer.tsx` `ScrollRevealScript`**: `<script dangerouslySetInnerHTML>` IIFE inline → jalan di file:// samples DAN produksi SSR. Flagship memakai pola ini (`atelier-script.ts`).
2. Registrasi sample bespoke: record `LUX` di `gen-samples.test.tsx` → digeneralisasi (field `Renderer?` opsional, default `RestaurantLuxRenderer` → output lama byte-identical).
3. `sample-content.ts` `LUX_SAMPLE_ALIAS` wajib entri eksplisit `'toko-atelier'` (prefix-split jatuh ke sample toko generik).
4. `SiteRenderer.tsx` cek bespoke SEBELUM `getManifest` → branch baru dormant (nol regresi) sampai `branding.theme === 'toko-atelier'`.
5. `contrast.test.ts` hanya scan TokenPacks → flagship bawa **contrast self-test** sendiri (reuse `contrastRatio` dari `src/lib/design-tokens/packs.ts`).
6. **Dark-launch**: tidak menyentuh `taxonomy.ts`/`generateContent.ts` sampai owner approve aktivasi (pola UAT restaurant-lux: swap manual `branding.theme`).
7. Cart: pola `batik_toko` (pass `products`+`hasCart`, wrap `CartProvider`); tanpa cart → CTA WA prefilled.

## Identitas

- **Theme id** `toko-atelier` · namespace `.ta-`/`--ta-*` · `TokoAtelierRenderer` (server component)
- **Art direction "Atelier Noir"**: maison gelap-hangat; bg `#141210` · surface `#201C18` · ink `#F1EAE0` · muted `#A89C8C` · accent champagne `#C5A572` (overridable via `primary`); varian light `ivoire` = fast-follow opsional (S3)
- **Fonts**: Fraunces (display serif optical-sizing, italic moments) + Archivo (grotesque) via `@import` di CSS string
- Sample brand: **KALA Atelier** (9 produk ber-kategori + stok untuk badge kelangkaan, galeri proses 7 foto, 4 stats format campur)
- Copy Indonesia; section self-hide bila konten kosong; tiap slot gambar punya fallback

## File

| File | Status |
|---|---|
| `src/app/components/themes/toko-atelier/TokoAtelierRenderer.tsx` | S1 ✅ (nav+hero+marquee+statement+footer+WA) |
| `src/app/components/themes/toko-atelier/atelier-script.ts` | S2 ✅ (reveal+navState+filter+lightbox) → S3: countUp, carousel, magnetic |
| `src/app/components/themes/toko-atelier/TokoAtelierRenderer.test.tsx` | S2 ✅ (smoke + lookbook/lightbox/cart-vs-WA) |
| `src/app/components/themes/toko-atelier/AtelierCartButton.tsx` | S2 ✅ (di-inject via prop slot `CartButton` — renderer bebas modul cart/alias, graph workaround tetap bersih) |
| `src/app/components/themes/toko-atelier/toko-atelier.contrast.test.ts` | S4 |
| `src/lib/theme-system/sample-content.ts` (+`TOKO_ATELIER`+alias) | S1 ✅ |
| `src/lib/theme-system/gen-samples.test.tsx` (LUX generalisasi + 2 entri) | S1 ✅ |
| `src/app/components/SiteRenderer.tsx` (branch + CartProvider) | S2 ✅ |
| `scripts/shoot-themes.mjs` (freeze `.ta-*`) | S4 |
| `scripts/gen-atelier-entry.tsx` + `scripts/tsconfig.gen-atelier.json` | S1 ✅ — workaround generator (tsc→node) karena esbuild/vitest crash winmm.dll di shell agen; output identik gen-samples, hanya 2 entri atelier |
| `src/app/admin/theme-preview/[themeId]/page.tsx` (opsional) | S4 |

## Blueprint 13 Section (Atelier Noir)

| # | Section | Layout | Motion/Canggih | Primitive | Sprint |
|---|---|---|---|---|---|
| 1 | Nav fixed | Transparan → kompak+blur saat scroll | Sentinel IO; underline grow | navState | S1 ✅ |
| 2 | Hero Cover 100svh | Full-bleed + duotone scrim + grain; ghost wordmark; meta rail vertikal | Kaskade kata (clip per kata), Ken Burns, scroll cue | — (CSS) | S1 ✅ |
| 3 | Marquee strip | Edge-to-edge band | CSS loop, pause hover, masked edges | — | S1 ✅ |
| 4 | **Lookbook/Koleksi** | Spread asimetris item-01 (teks overlap gambar) + grid editorial offset + **filter chips** | Reveal cascade; hover grayscale→warna; badge stok; **quick-look lightbox**; CTA cart/WA | reveal, filter, lightbox | S2 ✅ |
| 5 | Statement | Band bg2; 1fr/2.1fr; quote italic raksasa | Blur+rise reveal; rule scaleX | reveal | S1 ✅ |
| 6 | Keunggulan rows | **Sticky passage** (kiri pinned, kanan rows bernomor) | Stagger kanan; hover numeral isi aksen | reveal | S2 ✅ |
| 7 | Cerita/About | Split-screen 50/50; H2 overlap seam | Parallax `view()` progressive | reveal | S2 ✅ |
| 8 | Stats | Band 4 kolom hairline | **Count-up** (SSR = nilai final) | countUp | S3 |
| 9 | Galeri | Editorial + 1 row breakout edge-to-edge | Reveal scale; lightbox prev/next | lightbox | S3 |
| 10 | Testimoni | **Scroll-snap carousel** + dots | JS hanya tombol+dot; aria carousel | carousel | S3 |
| 11 | FAQ | `<details>` CSS-only serif | ikon rotate | — | S3 |
| 12 | CTA band | Full-bleed duotone | **Magnetic button** (pointer:fine) | magnetic | S3 |
| 13 | Footer | Wordmark raksasa ter-crop; 3 kolom; ::selection themed | underline anims | — | S1 ✅ |

Aturan motion: transform/opacity/filter/clip-path saja; hidden digate `.ta-js` (no-JS tampil penuh); reduced-motion double-gate.

## JS Primitive (1 IIFE ≤ ~5.5KB)

reveal ✅ · navState ✅ · filter ✅ · lightbox ✅ (focus-trap, Esc, panah kiri/kanan, focus-return) · countUp (S3) · carousel (S3) · magnetic (S3). Marquee/parallax/FAQ/sticky = CSS murni.

## Sprint & Checkpoint (HTML review tiap sprint)

Per sprint: Claude koding + `npx tsc --noEmit` → **owner run lokal** `npx cross-env GEN_SAMPLES=toko-atelier,toko-atelier-brand vitest run src/lib/theme-system/gen-samples.test.tsx` (atau `npm run samples` penuh) → buka `theme-samples/toko-atelier.html` → approve → lanjut.

- **S1 — Stage & identitas** ✅ · Checkpoint A APPROVED (user suka arah noir)
- **S2 — Commerce core** ✅ kode (lookbook+filter+lightbox+CTA produk + sticky rows + about split + wiring SiteRenderer) · ⏸ Checkpoint B (cek juga lebar mobile)
- **S3 — Depth & delight**: count-up + galeri + carousel + FAQ + CTA magnetic + pass /make-interfaces-feel-better + opsional ivoire · Checkpoint C (scroll-through + reduced-motion)
- **S4 — QA & ship**: contrast self-test + freeze shoot + opsional admin preview; owner run `npm test` + samples penuh + `npm run shoot`; gate /ui-design + /make-interfaces-feel-better + /website-review; keyboard pass → **PR dark-launched**

## Verifikasi

1. tsc bersih tiap sprint. 2. Samples hidup di file:// **dengan animasi** + tanpa JS konten tampil. 3. `npm test` suite lama hijau + test baru lolos. 4. Shoot 3 viewport tanpa konten hidden. 5. Reduced-motion: semua tampil, counter final, marquee/magnetic mati. 6. Pasca-PR: swap `branding.theme='toko-atelier'` di 1 site uji.

## Risiko

gen-samples generalisasi → diff restaurant-lux harus identik · `useCart` luar provider → button hanya saat `hasCart` · berat gambar → `w=` per slot + lazy + aspect-ratio · scope creep → di luar blueprint = out · porting ke composable = accepted (primitive terisolasi → mudah dipanen jadi `CeMotion`; catat harvest candidates di PR).

## ▶ Resume

- "lanjut sprint 2 atelier" — setelah Checkpoint A approve
- "ubah arah atelier" — kalau Checkpoint A minta ganti art direction
