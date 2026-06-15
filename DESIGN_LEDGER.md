# DESIGN LEDGER — Tema Bespoke

> Registry identitas visual setiap tema bespoke. Tujuan: tema baru WAJIB berbeda
> dari semua baris di sini (font display, pola hero, motif, keluarga palet, signature).
> Dicek di langkah **DEFINE** tiap sprint tema; baris baru ditambahkan **di PR tema
> yang sama**. Library 96 composable = legacy (keputusan owner 2026-06-12) dan tidak
> dicatat di sini.

## Registry

| Tema (key) | Industri / sub-kat | Varian | Font display + body | Palet inti | Motif / tekstur | Pola hero | Signature moment |
|---|---|---|---|---|---|---|---|
| `restaurant-lux` | restaurant / finedining (+ kartu Lux resto) | aurum · noir · hearth | Cormorant Garamond + Inter | gelap-mewah, aksen emas | — | fullbleed gelap, eyebrow tracking lebar | quote sinematik italic |
| `toko-atelier` | toko_online / fashion | noir · ivoire | Fraunces + Archivo | charcoal `#1A1614` / ivory `#F6F1E8`, champagne `#C5A572` | — | 100svh cover + scrim gelap, zoom 1.09 | lookbook editorial spread + quick-look |
| `toko-kuliner` (PR #126) | toko_online / kuliner | tungku · pamor | Newsreader + Plus Jakarta Sans | krem + terracotta (tungku) / espresso + emas (pamor) | geometri membulat | menu-board ber-leader titik | galeri film-strip |
| `toko-kerajinan` (PR #128) | toko_online / kerajinan | tanah | Cinzel + Raleway | Forest `#1E3A2F` · Parchment `#F7F0E3` · Bronze `#C8962A` | batik Kawung (SVG inline, ter-tint) | — | motif kawung sebagai identitas |
| `toko-kecantikan` (PR #152) | toko_online / kecantikan | embun | Italiana + Mulish | Porcelain `#FBF7F5` · Blush `#F4E7E4` · Rose `#B5566B`/`#A8455C` | glow bloom (radial-gradient CSS, bernapas) | asimetris terang, produk + halo glow di belakang | radial **glow halo** yang bernapas + **ritual stepper** bernomor |
| `toko-gadget` (Wave 1) | toko_online / gadget | onyx | Space Grotesk + IBM Plex Sans/Mono | Onyx `#0A0E14` · Surface `#131B25` · Cyan `#22D3EE` | blueprint grid + corner-bracket + node dots | dark blueprint-grid, device-frame ber-scanline | **spec-readout HUD** (kartu mono ber-corner-bracket + garis sirkuit) |
| `toko-rumah` (Wave 1) | toko_online / rumah | selaras | Spectral + Hanken Grotesk | Kapur `#F4F1EA` · Greige `#EDE8DD` · Arang `#2C2A25` · Sage-slate `#6F7A66` | bingkai arched alcove (ceruk lengkung) + bayangan natural lembut | hero terang asimetris + ruang lapang (ma) | **arched-alcove product frame** + statement tenang serif (bukan quote sinematik italik) |
| `toko-kesehatan` (Wave 1) | toko_online / kesehatan | jamu | Zilla Slab + Work Sans | Kraft `#ECE3CE`/`#E6DCC4` · Ink olive-hitam `#21271A` · Turmeric `#A8661A`/`#7C4A0E` | segel/stempel apotek (cincin-ganda) + dot-screen halftone + tepi perforasi | tipografi slab besar di atas produk + segel | **kartu "label apotek"** (tepi perforasi + segel) di etalase |
| `toko-anak` (Wave 1) | toko_online / anak | ceria | Fredoka + Nunito | Warm-white `#FFFCF5`/`#FFF3E2` · Sky `#2491C8`/`#176F9E` · Ink-navy `#1E3147` · pop coral `#FF6B5C`/sunny `#FFC23C`/mint `#3CC9A8` | blob organik + confetti titik warna + sudut membulat besar | bento ceria (klaster media membulat + sel pop) | **kartu "stiker"** (tag kategori menempel miring + bounce) di etalase |
| `klinik-umum` (Wave 2) | klinik / umum (jasa, source services) | bersih | Bricolage Grotesque + Public Sans | Snow `#F7FAFD`/`#EAF1F8`/`#E4EDF7` · Ink-navy `#0E2438` · Indigo `#2B5BD7`/accentDeep `#1E44A8` (palet tunggal, tanpa pop) | garis detak **EKG** (SVG hairline, titik puncak berdenyut) + ikon plus medis | hero teks + foto klinik + panel mengambang | **panel "Jadwal Praktik / Janji Temu"** mengambang di hero (jam praktik + EKG + CTA buat janji) |
| `klinik-estetik` (Wave 2) | klinik / estetik (jasa, source services) | lumen | Bodoni Moda + Outfit | Cool-white `#FBF9FA`/`#F1EBF1`/`#EAE2EB` · Plum-ink `#271F2C` · Orchid `#9A5C8E`/accentDeep `#7A3F70` (palet tunggal, tanpa pop) | bingkai **hairline tipis-ganda** + numeral serif + banyak ruang putih (editorial) | hero editorial: judul serif besar + potret berbingkai hairline + tag | **kartu perawatan ber-NUMERAL serif raksasa** (01/02/…) di etalase + bingkai hairline |
| `klinik-wellness` (Wave 2) | klinik / wellness (jasa, source services) | sanara | Marcellus + Figtree | Warm-stone `#F4F2EB`/`#E9E5DA`/`#E6E2D7` · Ink hijau-gelap `#25302D` · Teal `#3E8378`/accentDeep `#2C6359` (palet tunggal, tanpa pop) | bingkai foto **bentuk DAUN** (border-radius dua-ujung runcing) + motif **tunas/sprout** SVG | hero tenang: teks + foto bingkai daun + badge | **bingkai foto "daun"** + sprout di tiap eyebrow/panel (healing natural) |
| `restaurant-warung` (Wave 2) | restaurant / warung (source menu) | hangat | Caprasimo (display chunky-rounded) + Karla | Cream `#FBF3E4`/`#F3E7CF` · Ink coklat `#2B1A12` · Brick `#C0432E`/accentDeep `#9A3322` · pop Mustard `#E0A93C` | tag kertas miring (clip-path notch) + sudut membulat hangat + rotasi ringan | hero spanduk: teks + foto frame miring ber-stempel "Selalu Hangat" | **banderol** — label HARGA bentuk tag kertas miring di tiap kartu menu |

## Aturan pakai

1. **DEFINE (awal sprint tema):** baca tabel ini. Arah baru tidak boleh memakai font
   display, pola hero, motif, atau signature yang sudah dipakai baris mana pun.
   Keluarga palet boleh berdekatan hanya bila mood-nya berbeda jauh (mis. terang-hangat
   vs gelap-sinematik).
2. **PR tema baru:** wajib menambah barisnya di tabel (reviewer menolak PR tanpa baris ledger).
3. **Signature unik:** dua tema tidak boleh berbagi signature moment yang sama.

## Pelajaran UAT → aturan (loop belajar)

Setiap temuan dari UAT / order nyata yang menyangkut visual-UX dicatat di sini dan
**ditanam sebagai aturan permanen** di `src/lib/theme-system/design-rules/<mood>.md`,
checklist brief form, atau renderer-nya — supaya pelajaran tidak berhenti di ingatan.

| Tanggal | Temuan | Aturan yang ditanam | Lokasi tanam |
|---|---|---|---|
| 2026-06-12 | Picker fokus hero terlewat customer (thumbnail kecil + label abu) | Kontrol penting customer menyatu dengan preview besar + default aman (50% 50%) | `HeroImageField` (PR #129) |
| 2026-06-12 | Foto produk PNG latar putih jelek di hero ber-scrim gelap | Panduan foto di brief memperingatkan latar putih untuk tema gelap | brief form (PR #129) |
| 2026-06-12 | Lookbook timpang saat produk < 3 | Renderer bespoke wajib punya mode sparse (duo/solo simetris) | `TokoAtelierRenderer` (PR #132) — jadikan standar renderer berikutnya |
| 2026-06-13 | Tanah Loka KOSONG di sample statis (UAT batch 3): reveal/nav/judul digerakkan React hooks — `.kr-rv{opacity:0}` tanpa gate → tanpa hydration konten tak pernah muncul | Keadaan tersembunyi-awal WAJIB lewat primitive LUX_JS (`.lx-reveal`+`.lx-in` digate `.lx-js`, nav via `.lx-sentinel`) atau CSS animation murni ber-base TAMPIL; React state hanya untuk interaksi non-visibilitas (mis. FAQ) | `KerajinanLuxRenderer` (PR #138) — kontrak sudah tertulis di `lux-script.ts`, tegakkan saat review renderer baru |
