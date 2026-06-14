# ja-websitebuilder-platform — Instruksi Claude

## Konteks

Website builder Japan Arena: customer order + bayar (Midtrans) → platform auto-build situs klien per industri (tema lux/bespoke) → disajikan via route tenant `src/app/[slug]`. Stack: Next.js 16 App Router + React 18, Supabase, Tailwind v4, shadcn/Radix, vitest + playwright.

- Branch: `master` · Vercel: `ja-websitebuilder-platform` · Supabase MCP: `supabase-websitebuilder`
- Area route utama: `[slug]` (situs klien), `admin`, `portal` (dashboard customer), `order` (brief form), `mitra` + `r` (referral), `track`, `api`

## Dokumen sumber kebenaran — baca sebelum menyentuh areanya

| Area | Dokumen |
|---|---|
| Roadmap teknis | `UPGRADE_PLAN.md` |
| Sistem tema composable (LEGACY — arah produk = bespoke, keputusan owner 2026-06-12) | `THEME_SYSTEM_PLAN.md` |
| Add-on (SSOT: `catalog.ts`) | `ADDON_ARCHITECTURE_PLAN.md` |
| E-commerce klien (checkout/Midtrans tenant) | `PLAN_ECOMMERCE.md` |
| Tema flagship Atelier | `FLAGSHIP_ATELIER_PLAN.md` |
| Roadmap tema bespoke per industri/sub-kategori (engine universal + 5 wave) | `ROADMAP_BESPOKE.md` |
| Review visual tema — gerbang bespoke = §7 | `THEME_VISUAL_PIPELINE.md` |
| Identitas visual antar tema bespoke (anti-duplikat + pelajaran UAT) | `DESIGN_LEDGER.md` |
| SOP build situs | `SOP_WEBSITE_BUILD_V2.md`, `SOP_CUSTOM_BUILD.md` |

## Alur kerja wajib

**Sebelum koding:**
- Komponen/halaman UI baru → jalankan skill `/ui-design` dulu
- Copy user-facing → `/website-review` dulu
- Polish visual → `/make-interfaces-feel-better`
- Menyentuh DB → cek schema via Supabase MCP dulu, baru tulis migration
- Scope ambigu / multi-file → ajukan rencana singkat + pertanyaan dulu, jangan langsung koding

**Git & deploy:**
- Fitur / API / DB / multi-file = **PR** (jangan direct push). Hanya perubahan ≤3 baris non-logic yang boleh direct push ke `master`.
- Setelah push: pantau CI + Vercel sampai **Ready/Error** — jangan lapor selesai saat masih Building.

**Perubahan visual tema (gerbang lengkap di THEME_VISUAL_PIPELINE.md §7):**
- Tema bespoke baru: cek `DESIGN_LEDGER.md` saat DEFINE (font/hero/motif/signature tak boleh duplikat) + tambah baris ledger di PR tema yang sama.
- Tema baru wajib lolos `/ui-design` + `/make-interfaces-feel-better` + `/website-review` (gerbang kode) **dan** gerbang pixel: `npm run shoot:chrome -- <id>` (Claude bisa jalankan + baca PNG sendiri; mode fold utk detail, `--full` utk komposisi) → scorecard §3.2, iterate ≤2×.
- HTML sample tetap dikirim ke user untuk review final sebelum aktivasi (`npm run samples` user-run, atau runner tsc+node).
- Temuan UAT visual → catat di `DESIGN_LEDGER.md` §Pelajaran + tanam aturannya di `design-rules/<mood>.md`/checklist terkait.
- Ingat: perubahan renderer hanya berdampak ke **build baru** — situs klien lama tidak otomatis ter-rebuild.

**Checklist UI sebelum PR:** ukuran image wajar, kontras teks (gray-400 → 600), `aria-label` pada button ikon, hierarki heading benar.

## Definisi "selesai"

`npx tsc --noEmit` lolos → CI hijau → Vercel production **Ready** → (untuk visual) user sudah review HTML sample. Sebelum semua itu terpenuhi, status = "berjalan", bukan "done".

## Batasan lingkungan

- `npm test`, `npm run samples`, `npm run shoot` = crash di sandbox Windows (winmm.dll) → **minta user jalankan lokal**, jangan coba-coba di sandbox.
- `npx tsc --noEmit` dan `next lint` aman dijalankan langsung.
- Konten klien dikumpulkan SETELAH DP — form order = briefing + bayar, bukan konten. Claude draft konten contoh per industri, klien merevisi.
- Midtrans: endpoint dipilih dari `NEXT_PUBLIC_MIDTRANS_ENV` saja (bukan prefix key); ganti key tanpa flip flag = 401; env build-time, wajib redeploy.
