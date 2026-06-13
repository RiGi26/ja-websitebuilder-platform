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
