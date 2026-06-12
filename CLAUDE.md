# ja-websitebuilder-platform — Instruksi Claude

## Konteks

Website builder Japan Arena: customer order + bayar (Midtrans) → platform auto-build situs klien per industri (tema lux/bespoke) → disajikan via route tenant `src/app/[slug]`. Stack: Next.js 16 App Router + React 18, Supabase, Tailwind v4, shadcn/Radix, vitest + playwright.

- Branch: `master` · Vercel: `ja-websitebuilder-platform` · Supabase MCP: `supabase-websitebuilder`
- Area route utama: `[slug]` (situs klien), `admin`, `portal` (dashboard customer), `order` (brief form), `mitra` + `r` (referral), `track`, `api`

## Dokumen sumber kebenaran — baca sebelum menyentuh areanya

| Area | Dokumen |
|---|---|
| Roadmap teknis | `UPGRADE_PLAN.md` |
| Sistem tema composable | `THEME_SYSTEM_PLAN.md` |
| Add-on (SSOT: `catalog.ts`) | `ADDON_ARCHITECTURE_PLAN.md` |
| E-commerce klien (checkout/Midtrans tenant) | `PLAN_ECOMMERCE.md` |
| Tema flagship Atelier | `FLAGSHIP_ATELIER_PLAN.md` |
| Review visual tema | `THEME_VISUAL_PIPELINE.md` |
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

**Perubahan visual tema:**
- Generate HTML sample (`npm run samples` — dijalankan user) untuk review sebelum lanjut ke tahap berikutnya. HTML saja, tanpa screenshot.
- Tema baru wajib lolos `/ui-design` + `/make-interfaces-feel-better` + `/website-review` sebelum diaktifkan.
- Ingat: perubahan renderer hanya berdampak ke **build baru** — situs klien lama tidak otomatis ter-rebuild.

**Checklist UI sebelum PR:** ukuran image wajar, kontras teks (gray-400 → 600), `aria-label` pada button ikon, hierarki heading benar.

## Definisi "selesai"

`npx tsc --noEmit` lolos → CI hijau → Vercel production **Ready** → (untuk visual) user sudah review HTML sample. Sebelum semua itu terpenuhi, status = "berjalan", bukan "done".

## Batasan lingkungan

- `npm test`, `npm run samples`, `npm run shoot` = crash di sandbox Windows (winmm.dll) → **minta user jalankan lokal**, jangan coba-coba di sandbox.
- `npx tsc --noEmit` dan `next lint` aman dijalankan langsung.
- Konten klien dikumpulkan SETELAH DP — form order = briefing + bayar, bukan konten. Claude draft konten contoh per industri, klien merevisi.
- Midtrans: endpoint dipilih dari `NEXT_PUBLIC_MIDTRANS_ENV` saja (bukan prefix key); ganti key tanpa flip flag = 401; env build-time, wajib redeploy.
