# Upgrade Plan — JA Website Builder Platform

> **Tujuan:** Naikkan sistem dari 7/10 → 10/10 (fitur builder) dan keamanan DB 7.5/10 → 9/10, **tanpa merusak production**.
>
> **File ini = sumber kebenaran.** Kalau terminal Claude Code mati / laptop restart: buka file ini, baca **CURRENT STATUS** + checkbox tiap fase, lanjut dari step yang belum `[x]`. Jangan andalkan ingatan sesi.

---

## CURRENT STATUS

- **Tanggal mulai:** 2026-06-04
- **Fase aktif:** 🎉 **SELURUH UPGRADE_PLAN INTI TUNTAS.** F1–F5 LENGKAP (skor fitur 10/10). P5DB-1/2/3 LENGKAP (DB hardening ~9.5). Semua kode SELESAI & MERGED. Sisa OPT-IN: P0-1 (DEFERRED — butuh Pro plan, user aktifkan stlh upgrade), F1-5 (webhook auto-build), F3-3 (LLM polish).
- **Step berikutnya:** Tak ada pekerjaan kode wajib. P0-1 nunggu upgrade Pro plan (2026-06-04 dicoba, gagal — fitur Pro-only). F1-5/F3-3 kalau ada kebutuhan. Builder = 10/10, DB hardening = ~9.5.
- **📋 Blueprint siap eksekusi (di akhir file) — buka saat mau jalankan:** (1) **F3-3** LLM copy (Polish→**Transform**, ada Bagian 0 strategi: trigger gating + gerbang eval), (2) **AI-2** Normalisasi input briefing / "Smart-Fill" (hulu dari F3-3; obat friksi form; WAJIB confirm-step karena sentuh fakta), (3) **AI-3** Agentic edit assistant / "edit lewat ngobrol" (membungkus primitive F5-1/2/3 yang sudah ada; guardrail typed-tool + snapshot-before + draft-only + fact-lock; bangun PALING AKHIR), (4) **F1-5** auto-build webhook, (5) **CD** custom domain (wildcard subdomain + domain klien + otomasi Vercel API). Lapis aplikasi custom domain SUDAH ada di `src/proxy.ts`. **Peta strategi AI (lengkap):** #1 copy (F3-3, Polish→Transform) · #2 input (AI-2, Smart-Fill) · #3 agentic edit (AI-3). Ketiganya berbagi SDK + tabel `llm_usage`; urutan nilai-vs-risiko: F3-3 dulu → AI-2 → AI-3 terakhir.
- **Catatan terakhir:** 2026-06-04 — P5DB-3 DONE (PR#61, CI pass + Vercel Ready): migration `security_events` (kind/ip/detail jsonb, RLS deny_public_access, index); `security-log.ts` logSecurityEvent (console.warn + insert, non-fatal); login log failed+ratelimited, track log ratelimited. Persist+log tanpa channel (keputusan user). SEBELUMNYA: P5DB-1 MERGED (PR#60) rate limit login 8/10mnt+track 60/mnt; P5DB-2 MERGED (PR#59) security headers; F5 TUNTAS (F5-1..4 PR#55-58); F4 LIVE; F2+F3 LENGKAP; F1 LIVE; P0-2/P0-3 done. Sisa P0-1 (WARN password, butuh dashboard).

> Update baris di atas tiap selesai 1 step. Ini yang dibaca pertama saat resume.

---

## Cara Resume (kalau sesi hilang)

1. Baca **CURRENT STATUS** di atas → tau posisi terakhir.
2. Scroll ke fase aktif → cari step pertama yang `[ ]` atau `[~]`.
3. Cek apakah ada branch git yang belum di-merge: `git branch` + `git status` di `ja-websitebuilder-platform`.
4. Lanjut step itu. Ikuti **Aturan Produksi** di bawah.
5. Setelah step beres → ubah checkbox jadi `[x]` + update CURRENT STATUS.

Status marker:
- `[ ]` belum
- `[~]` lagi dikerjakan (tulis di CURRENT STATUS apa yang setengah jalan)
- `[x]` selesai + verified
- `[!]` kepentok / butuh keputusan user

---

## Gambaran Sistem: Sekarang vs Setelah Upgrade

### SEKARANG (7/10)

```
┌─────────────────────────────────────────────────────────────────┐
│  CUSTOMER                                                         │
│   1. Isi form order (briefing + pilih variant)                   │
│   2. Bayar DP (Midtrans)              ✅ OTOMATIS (kode app)      │
│   3. Isi briefing detail (auto-save)  ✅ OTOMATIS                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │  order masuk DB
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN / TIM                                                     │
│   4. Klik "Buatkan Website"           🟡 MANUAL (1 klik)         │
│      → provisioning (tenant+page KOSONG)                         │
│                                                                  │
│   5. Buka sesi Claude Code                                       │
│      ketik /build-order [id]          🔴 MANUAL (butuh AI)       │
│      → Claude generate konten                                    │
│      → insert section + set theme/variant                       │
│      → publish                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  RENDER  [slug]                                                  │
│   • Theme bespoke (rental/klinik/...)  → renderer khusus ✅      │
│   • Theme lain + variant               → TokenDrivenRenderer     │
│       └─ ~8 variant ada pack ✅                                  │
│       └─ ~10 variant KOSONG 🔴 → fallback generik               │
│   • Copy = template generik 🟡 (nama+kota ganti doang)          │
│   • Gak ada preview / rollback 🔴                               │
└─────────────────────────────────────────────────────────────────┘

DB: RLS nyala tapi 3 tabel 0-policy 🟡 · password protection OFF 🟡
```

**Bottleneck:** langkah 5 — tiap order butuh manusia buka Claude. Order banyak = macet.

### NANTI (10/10, setelah upgrade)

```
┌─────────────────────────────────────────────────────────────────┐
│  CUSTOMER                                                         │
│   1. Isi form order (briefing + pilih variant)                   │
│   2. Bayar DP (Midtrans)              ✅ OTOMATIS                 │
│   3. Isi briefing detail              ✅ OTOMATIS                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │  DP lunas → webhook (opsional)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  BUILD OTOMATIS  (API route /api/admin/build-order)  [F1]       │
│   • generateContent(industry, briefing)   ✅ OTOMATIS (kode)    │
│   • template varian 3–4 versi/industri    ✅ [F3-2]             │
│   • isi pakai data briefing nyata         ✅ [F3-1]             │
│   • set theme + variant + pack + primary  ✅                    │
│   → DRAFT jadi sendiri dalam detik                              │
│                                                                  │
│   (opsional) LLM polish premium  🟦 flag OFF default [F3-3]     │
└───────────────────────────┬─────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN                                                           │
│   • PREVIEW hasil build  ✅ [F5-1]                              │
│   • 1 klik publish (atau revisi)  🟢 RINGAN                     │
│   • rollback kalau salah  ✅ [F5-2]                            │
└───────────────────────────┬─────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  RENDER  [slug]                                                  │
│   • Theme bespoke → renderer khusus ✅                          │
│   • 18 variant SEMUA ada pack ✅ [F2]                          │
│   • Layout beda nyata (luxury/energetic/minimal) ✅ [F4]       │
│   • Copy variatif per bisnis ✅ [F3]                           │
│   • Klien edit teks/gambar sendiri ✅ [F5-3]                   │
└─────────────────────────────────────────────────────────────────┘

DB: 3 policy eksplisit ✅ · password protection ON ✅ [P0]
    + rate limit + CSP [P5DB]
```

**Bottleneck hilang:** order → website draft jadi sendiri. Admin cuma review+publish. Claude cuma buat kasus custom.

### Tabel ringkas

| Aspek | Sekarang | Nanti | Step |
|---|---|---|---|
| Bangun website | 🔴 manual via Claude tiap order | ✅ otomatis (API), admin review | F1 |
| Variant | 🟡 8 ada, 10 kosong | ✅ 18 lengkap | F2 |
| Copy | 🟡 generik, seragam | ✅ varian + data nyata | F3 |
| Layout | 🟡 re-skin (warna/font) | ✅ layout beda nyata | F4 |
| Preview/rollback | 🔴 gak ada | ✅ ada | F5 |
| Edit klien | 🔴 minta tim | ✅ self-edit | F5 |
| DB security | 🟡 7.5 (3 policy longgar) | ✅ 9.5 | P0+P5DB |
| **Skor** | **7/10** | **10/10** | |

> **Sekarang:** order = manusia harus buka Claude, bangun manual, tiap satu.
> **Nanti:** order = website draft jadi sendiri, manusia cuma klik publish.
>
> Skala bergeser dari "berapa Claude session tim sanggup jalanin" → "berapa server sanggup proses" (ribuan).

---

## Aturan Produksi (WAJIB tiap step)

Biar tidak ada yang salah di prod:

1. **Satu step = satu branch = satu PR.** Jangan campur fase.
2. **DB: additive dulu.** Tambah kolom/policy baru sebelum hapus yang lama. Jangan DROP di langkah yang sama dengan yang masih dipakai render.
3. **Migration via Supabase MCP** (`apply_migration`), bukan SQL manual liar. Nama migration jelas.
4. **Backup sebelum ubah data/policy sensitif.** Minimal: query state lama, simpan hasilnya di catatan step.
5. **Verify sebelum merge:** loop cek Vercel sampai Ready/Error (jangan lapor pas masih Building). Untuk DB: cek advisor + query ulang.
6. **Tiap perubahan independen shippable** — kalau berhenti di tengah fase, yang sudah merged tetap aman.
7. **Rollback siap:** tiap step DB tulis cara baliknya. Tiap fitur = revert PR.
8. Commit pakai `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

---

# TRACK A — DATABASE (keamanan)

Murah, cepat, tutup risiko. Kerjain barengan awal.

## Fase P0 — DB Quick Security (target: 1–2 jam)

- [!] **P0-1** Nyalakan **leaked password protection** (HaveIBeenPwned) di Supabase Auth dashboard. **DEFERRED — butuh Pro plan.**
  - Lokasi UI: Authentication → Providers → **Email** → bagian password → toggle **"Prevent use of leaked passwords"**.
  - ⚠️ 2026-06-04: dicoba aktifkan, GAGAL — *"available on Pro Plans and up"*. Project masih Free plan. User akan aktifkan **setelah upgrade ke Pro**. Bukan blocker (mitigasi lain sudah jalan: min-password-length 6, rate limit login, audit log, RLS deny).
  - Verify (nanti setelah upgrade+toggle): `get_advisors security` → WARN `auth_leaked_password_protection` hilang.
  - Rollback: matikan lagi di dashboard (gak ada risiko data).
- [x] **P0-2** Audit akses `tenant_payment_config` (config bayar, sensitif). ✅ 2026-06-04
  - Hasil audit: service-role-only (cuma `src/lib/tenant-midtrans.ts` via supabaseAdmin). Anon tak nyentuh.
  - Migration `rls_policy_tenant_payment_config`: policy `deny_public_access` (anon+authenticated, using/with_check false).
  - Backup: state lama = RLS on, 0 policy. Rollback: `drop policy "deny_public_access" on public.tenant_payment_config;`
- [x] **P0-3** Policy eksplisit untuk `tenants` + `order_progress_logs`. ✅ 2026-06-04
  - Audit membuktikan render `[slug]` (anon) baca `landing_pages`/`page_sections`/`tenant_profile`, BUKAN `tenants`. Warning lama keliru — `tenants` service-role-only.
  - Migration `rls_policy_tenants_order_progress_logs`: `deny_public_access` di kedua tabel.
  - Verify: advisor 3 INFO `rls_enabled_no_policy` → 0. Render anon tak terdampak (tabel tak dibaca anon).
  - Rollback: `drop policy "deny_public_access" on public.tenants;` + `... on public.order_progress_logs;`

## Fase P5-DB — DB Hardening lanjut (backlog, setelah fitur jalan)

- [x] **P5DB-1** Rate limiting di API publik (`/api/track`, `/api/admin/*`). ✅ 2026-06-04 (PR#60).
  - `src/lib/rate-limit.ts`: limiter in-memory fixed-window (`rateLimit`/`clientIp`/`tooManyRequests`), lazy prune. Best-effort per-instance (Vercel serverless) — upgrade ke Upstash Redis saat env ada, API helper tetap sama.
  - `/api/admin/login`: rem brute force 8 / 10 mnt per IP. `/api/track`: 60 / mnt per IP.
  - 5 unit test (window/reset/key/clientIp). Helper reusable utk endpoint lain (payment/briefing/shop).
  - Rollback: revert PR. Tak ada perubahan DB.
- [x] **P5DB-2** Security headers (CSP, HSTS) di `next.config`. ✅ 2026-06-04 (PR#59).
  - Semua route: HSTS (max-age 1th, tanpa includeSubDomains), X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (camera/mic/geolocation off), X-DNS-Prefetch-Control.
  - `/admin` + `/portal`: anti-clickjacking (X-Frame-Options DENY + CSP frame-ancestors none).
  - **Situs klien `[slug]` SENGAJA tetap bisa di-iframe** (galeri corp-landing) → proteksi frame hanya di area sensitif, nol regresi galeri. HSTS tanpa includeSubDomains (jangan paksa subdomain ekosistem). CSP konten penuh utk situs publik DITUNDA (klien embed konten arbitrer).
  - Verified curl lokal (next start): /pricing dapat header aman tanpa frame-block; /admin/login dapat DENY+frame-ancestors none.
  - Rollback: revert PR (cuma next.config).
- [x] **P5DB-3** Monitoring/alert (login gagal beruntun, lonjakan akses). ✅ 2026-06-04 (PR#61). **Persist + log, tanpa channel keluar** (keputusan user).
  - Migration `security_events` (MCP): kind/ip/detail jsonb, RLS `deny_public_access` (service-role-only), index (kind,created_at)+created_at.
  - `src/lib/security-log.ts`: `logSecurityEvent` → console.warn (Vercel logs) + insert. Best-effort, NON-FATAL.
  - `/api/admin/login`: `admin_login_failed` + `admin_login_ratelimited`. `/api/track`: `track_ratelimited`.
  - Audit via SQL (mis. `select ip,count(*) from security_events where kind='admin_login_failed' and created_at>now()-interval '1 hour' group by ip`). Alert channel (WA/email) = upgrade lain waktu.
  - Rollback: revert PR + `drop table security_events`.

---

# TRACK B — FITUR BUILDER

Urut dampak. Tiap fase shippable sendiri.

## Fase F1 — Otomatisasi build_order (GAP 1) — DAMPAK TERBESAR

Pindah generasi konten dari skill manual `.md` → API route TypeScript. Order masuk → website draft jadi sendiri.

- [x] **F1-1** Buat fungsi `generateContent(industry, briefing)` (TS) — port logika dari `.claude/commands/build-order.md` jadi kode. ✅ 2026-06-04
  - `src/lib/build/generateContent.ts` (+ `types.ts`, `briefing.ts` normalisasi, `designTokens.ts` derivasi token+accent). Fungsi murni, nol-opex.
- [x] **F1-2** Template konten per industri sebagai data (TS), bukan prompt. ✅ 2026-06-04
  - `src/lib/build/templates.ts` — registry 6 industri (travel/restaurant/corporate/klinik/sekolah/toko_online) + generic (personal/blog/jastip/custom). Isi dari briefing nyata, fallback copy spesifik bisnis (nama+kota), BUKAN Lorem ipsum.
  - Section-aware per renderer: restaurant pakai `pricing_table` (menu), batik pakai `product_list`; rental/klinik/company/sekolah baca data_konten.
- [x] **F1-3** API route `/api/admin/build-order/[id]` — order → `generateContent` → `applyBuildPlan` (sections+services/menu/products+tenant_profile) → publish. ✅ 2026-06-04
  - Guard admin (`verifyAdminSessionToken`). Body `{publish?:boolean}` default true.
  - Idempoten: `persist.ts` wipe baris generate lama lalu insert ulang → panggil 2x tetap 6 section (terverifikasi e2e).
- [x] **F1-4** Tombol "Bangun Otomatis" (emerald, Wand2) di kartu order admin (`BuildButton.tsx`) → 1 klik → konfirmasi hasil. ✅ 2026-06-04
- [ ] **F1-5** (Opsional) Auto-trigger setelah DP lunas via Midtrans webhook → draft auto-build → admin review+publish.
  - ⚠️ Jangan auto-publish tanpa review di tahap awal. Draft dulu.
  - 📋 **Rancangan detail siap eksekusi ada di akhir file: lihat section "F1-5 — Rancangan Detail Auto-Build Webhook".** Catatan kunci: pemicu terbaik = SETELAH briefing submit (data lengkap), bukan saat DP lunas (konten belum ada); wajib refactor `runBuild.ts` reusable + penanda idempotensi anti-timpa-editan.

Verify F1: ✅ e2e di order seed `klinik-sehat-prima` (a3bc…001) — build API 200, 6 section + 3 service (3 dokter nyata) + tenant_profile, design_tokens derived (#059669→accent #76c5ad), render `[slug]` HTTP 200 41KB konten nyata, rebuild idempoten tetap 6 section.

## Fase F2 — Tutup Variant Gap (GAP 2) — pendekatan: VARIANT NYATA PENUH

> **Temuan audit F2-1 (2026-06-04):** token-pack (`packs.ts`/`resolveTokenPack`) HANYA jalan untuk tema non-bespoke (personal/blog/jastip/custom). Tema bespoke (klinik/rental/company/sekolah/restaurant/batik) pakai renderer sendiri & TIDAK konsumsi pack — bahkan company/sekolah/restaurant/batik tak terima prop variant. Cuma 5/18 variant render beda nyata. Pack di VARIANT_PACK sudah distinct; gap-nya renderer tak pakai.
> **Keputusan user:** variant nyata penuh — tiap renderer bespoke honor variant-nya (palet/aksen/tipografi), BERTAHAP 1 renderer per PR.

- [x] **F2-1** Audit 18 variant vs render nyata. ✅ 2026-06-04 (lihat temuan di atas).
- [~] **F2-2** Wire variant ke tiap renderer bespoke (palet per-variant di-thread sbg `pal`). Per renderer = 1 PR:
  - [x] **sekolah** ✅ 2026-06-04 (PR#47 merged): warm (Academic Heritage maroon/amber, default no-regression) vs clean (Modern Institutional royal blue). e2e lpk-sakura: warm=maroon+amber/0 blue, clean=blue/0 maroon.
  - [x] **rental** ✅ 2026-06-04 (PR feat/f2-rental-variants): VARIANT_ACCENTS per variant (bold=oranye/dark, fresh=biru/light, luxury=gold/dark) di-thread (accent+light+lighter+dark+bg). Variant menang atas design_tokens.bg_style (build selalu 'dark'). primary klien override base. e2e nusantara-drive-test ketiga variant beda nyata.
  - [x] **klinik** ✅ 2026-06-04 (PR feat/f2-klinik-premium): premium dulu fallback ke warm renderer → kini distinct. warm (Warm Sanctuary sage/terracotta, default no-regression) vs premium (Luxe Clinic navy+gold di atas ivory, light luxe — hindari flip peran warna). clean tetap KlinikCleanRenderer terpisah. e2e klinik-sehat-prima: warm=sage+terra/0 navy-gold, premium=navy+gold+bronze/0 sage-terra.
  - [x] **company** ✅ 2026-06-04 (PR feat/f2-company-variants): FLIP light/dark pertama. Palet dipecah jadi peran semantik (pageBg/surfaceBg/cardBg/text/accent/onAccent/strong/onStrong/border/gridLine) karena INK/LIGHT dwiperan. editorial (Bold Editorial near-black+amber, default no-regression) vs clean (Clean Professional putih+royal blue) vs minimal (Minimal Tech putih monokrom). e2e arkana-digital: editorial=amber74/blue0, clean=blue74/amber0, minimal=mono100/blue0-amber0.
  - [x] **batik_toko** ✅ 2026-06-04 (PR feat/f2-batik-variants): file terbesar (693 baris), 3 token dwiperan (INK/CREAM/INDIGO). Palet dipecah jadi ~18 peran semantik; nilai 'batik' PERSIS original (no-regression). batik (Luxury Heritage indigo/krem/amber, default) vs modern (Contemporary Dark slate+gold refined). e2e batik-larasati: batik=indigo22+amber37+gold84/slate0; modern=slate30+modgold102+lighttext38/indigo0 (amber17 = client primary di produk, override sesuai desain).
  - [x] **restaurant** ✅ 2026-06-04 (PR#52 merged, deploy Ready 6e7da14): INK dwiperan dipecah jadi peran semantik (darkBg/lightBg/heading/clay/gold/onClay/...). rustic (Rustic Warm espresso/krem/terracotta, default no-regression) vs modern (Modern Dark fine dining slate gelap merata + champagne gold, Story/Galeri/Visit di-flip jadi gelap). e2e kanawa: rustic=espresso28/clay16/gold48/0-modern; modern=slate22/clay16/gold48/cream58/0-rustic.
- [x] **F2-3** Sinkronkan swatch `website-variants.ts` dgn palet renderer nyata. ✅ 2026-06-04 (sekolah + restaurant inline; commit a77fc66: travel luxury #1C1917→#C8A24B gold, batik #DC2626→#B45309 amber, toko modern #0F172A→#0F1115). corporate/klinik sudah selaras dari awal.
- [x] **F2-4** Verify tiap variant render beda nyata (e2e flip variant di DB, restore setelah). ✅ 2026-06-04 — terverifikasi per-renderer saat masing-masing PR (rental nusantara-drive, company arkana-digital, klinik klinik-sehat-prima, batik batik-larasati, sekolah lpk-sakura, restaurant kanawa). Tiap kasus: flip variant di DB → curl [slug] → hitung warna penanda beda nyata, restore setelah.

## Fase F3 — Konten dari Data Nyata (GAP 4.1)

> **Jalur default = TANPA Claude API (nol opex).** F3-1 + F3-2 sudah cukup buat hasil layak jual. F3-3 (LLM) OPSIONAL, ditunda jadi upgrade premium.

- [x] **F3-1** `generateContent` isi template pakai briefing nyata (nama bisnis, layanan, kota) — bukan placeholder generik. ✅ 2026-06-04 — sudah terpenuhi sejak F1-2: templates baca namaUsaha/kotaLayanan/layanan/dokter/menu/produk/program/keunggulan/kebijakan/sosial dari briefing nyata; fallback spesifik bisnis (nama+kota), bukan Lorem ipsum. fallbackDeskripsi/fallbackTagline = briefing menang.
- [x] **F3-2** **Template varian** (jalan tengah, NOL OPEX). ✅ 2026-06-04 (PR#53, deploy Ready 5c15e60): modul `src/lib/build/copyVariants.ts` — 3 register copy fallback/industri (warm/energetic/elegant). deskripsi (hero+about) & CTA-subtitle dipilih by TONE variant klien (luxury/premium→elegant, bold/editorial→energetic, fresh/clean/minimal→lugas, rustic/warm/batik→hangat); feature trio dirotasi by hash nama bisnis (rolling+avalanche, sebaran rata) → tak kembar. Cakupan = body copy saja (keputusan user). Briefing nyata tetap menang; default no-regression (verified tsx: tone beda/variant, default identik, briefing override, rotasi 3 trio).
- [ ] **F3-3** *(OPSIONAL — BUKAN jalur default)* LLM polish copy via Claude API server-side. **Flag-gated, default OFF.** Nyalakan cuma untuk hasil premium / klien bayar lebih. Bisa on/off tanpa ubah arsitektur — F3-1+F3-2 tetap fallback kalau flag off. **DITUNDA** (jalur default sudah layak jual).
  - 📋 **Rancangan detail siap eksekusi ada di akhir file: lihat section "F3-3 — Rancangan Detail LLM Polish".** Catatan biaya: dengan Haiku 4.5 sebenarnya pecahan sen/order (kesan "ribuan" itu skenario Opus).

## Fase F4 — Layout Beda (GAP 3)

Token-pack saat ini cuma re-skin. Tambah layout arketipe.

- [x] **F4-1** Tambah field `layout` ke `TokenPack` (hero/features/pad/align). ✅ 2026-06-04 (PR#54).
- [x] **F4-2** `TokenDrivenRenderer` baca `layout` → ubah susunan, bukan cuma CSS var. ✅ 2026-06-04 — komponen hero (Centered/Split/Fullbleed) & features (Grid/Rows/List) dipilih dari pack.layout.
- [x] **F4-3** Layout arketipe. ✅ 2026-06-04 (PR#54, deploy Ready 711495a): luxury-navy=split hero + rows editorial + airy; bold-energetic=fullbleed hero + grid; minimal-refined=center tipis + list garis; clean-modern & warm-cafe=centered+grid (baseline no-regression). Verified renderToStaticMarkup (SSR) tiap pack layout struktural beda. Nol risiko regresi (tak ada page live pakai TokenDrivenRenderer; yg ada commerce→SectionRenderer).
- **Catatan F4:** arketipe split (luxury-navy) & warm-cafe sekarang cuma dipetakan ke tema BESPOKE (yg tak pakai TokenDrivenRenderer). Token-driven aktif untuk personal/blog/jastip/custom → variant personal:bold→fullbleed, personal:minimal→list, custom:clean→centered. Kalau mau split tampil live, petakan variant token-driven ke luxury-navy di VARIANT_PACK.

## Fase F5 — Robustness Produk (GAP 5)

- [x] **F5-1** Preview sebelum publish (admin lihat hasil build sebelum live). ✅ 2026-06-04 (PR#55, preview deploy Ready).
  - `SiteRenderer.tsx`: ekstrak semua cabang render tema dari `[slug]/page.tsx` jadi komponen server bersama `renderSite({page,slug,client})`. Publik pakai anon (RLS gated published), preview pakai service role (lihat draft). Refactor no-regression.
  - `fetchPageByIdAdmin(client,pageId)`: fetch by id + section visible, TANPA filter status.
  - Route `/admin/preview/[pageId]`: admin-gated (cookie verify), render WYSIWYG via renderer sama; `PreviewBar` sticky top (badge Draft/Live, Publish via PATCH /api/admin/pages action=publish, link Buka Live).
  - `BuildButton`: "Bangun Otomatis"→"Bangun Draft" (publish:false) → redirect ke Preview; tombol Preview + Kelola.
  - Rollback: revert PR#55. Tidak ada perubahan DB/schema.
- [x] **F5-2** Rollback/versi (balik ke versi sebelum kalau build salah). ✅ 2026-06-04 (PR#56, preview deploy Ready).
  - Migration `page_versions` (MCP): jsonb snapshot/page, RLS `deny_public_access` (service-role-only), index (page_id, created_at desc).
  - `src/lib/build/versions.ts`: `snapshotPage` (skip kalau kosong, prune sisakan 15), `listPageVersions`, `restorePageVersion` (wipe+insert page_sections/services/menu_items/products/gallery_images + update data_konten/konfigurasi; **status TIDAK diubah**; auto-snapshot `pre_restore` sbg jaring pengaman).
  - `persist.ts`: `applyBuildPlan` auto-snapshot `pre_build` sebelum wipe (best-effort, non-fatal).
  - API `/api/admin/pages/[id]/versions`: GET list, POST `restore`|`snapshot` (validasi versi milik page).
  - `PreviewBar`: panel Riwayat (list versi + Pulihkan + Simpan Versi).
  - Rollback: revert PR + `drop table page_versions` (additive, tak dipakai render publik).
- [x] **F5-3** Self-edit klien (ganti teks/gambar sendiri). ✅ 2026-06-04 (PR#57, preview deploy Ready).
  - API `/api/portal/sections` PATCH: verifikasi sesi portal (JWT `app_metadata.tenant_id`) + ownership section, update `isi_komponen` via service role. TAK melebarkan RLS `page_sections` (konsisten dgn route portal lain).
  - `ContentPanel.tsx`: editor generik per section — field string top-level (judul/subjudul/cta/deskripsi/gambar) + array `items` (features/testimoni/faq), label ramah, textarea teks panjang, preview thumbnail gambar, Simpan per section + badge "Belum disimpan".
  - `portal/page.tsx` fetch `page_sections`; `PortalDashboard` tab "Konten" (default kalau ada section). Live langsung setelah simpan.
  - Rollback: revert PR. Tak ada perubahan DB.
- [x] **F5-4** Test suite render (snapshot tiap theme+variant) di CI. ✅ 2026-06-04 (PR#58, CI pass + preview Ready).
  - Vitest (env node, `renderToStaticMarkup` — tanpa jsdom). Script `test`/`test:watch`/`typecheck`; `vitest.config.ts` alias `@` + JSX automatic.
  - `packs.test.ts`: VARIANT_PACK semua valid, tiap pack layout lengkap, arketipe beda nyata (split/rows/fullbleed/list vs baseline centered+grid), `resolveTokenPack` mapping + override primary/onPrimary kontras, `isTokenDrivenTheme`.
  - `TokenDrivenRenderer.test.tsx`: render 5 pack tanpa error + konten inti + CSS var; snapshot markup tiap pack; assert layout beda struktural.
  - `.github/workflows/ci.yml`: PR + push master → npm ci, typecheck, test. **CI hijau di PR pertama (41s).**
  - 20 test pass, 5 snapshot. Rollback: revert PR (tak ada perubahan runtime/DB).

---

## Urutan Eksekusi (saran)

```
SPRINT 1 (sekarang):
  P0-1, P0-2, P0-3     ← DB cepat, tutup risiko (1-2 jam)
  F1-1 ... F1-4        ← otomatisasi build_order (dampak terbesar)

SPRINT 2:
  F2 (variant gap)     ← tepati janji ke klien
  F3-1 (data nyata)

SPRINT 3:
  F4 (layout beda)     ← visual wow
  F5 (robustness)
  P5DB (hardening lanjut)
```

Target skor:
- Setelah Sprint 1: fitur ~8, DB ~9
- Setelah Sprint 2: fitur ~8.5–9
- Setelah Sprint 3: fitur 10, DB 9.5

---

## Log Perubahan (isi tiap merge)

| Tanggal | Step | PR | Status | Catatan |
|---|---|---|---|---|
| 2026-06-04 | — | — | plan dibuat | Belum ada perubahan |
| 2026-06-04 | P0-2 | migration MCP | ✅ done | deny_public_access tenant_payment_config |
| 2026-06-04 | P0-3 | migration MCP | ✅ done | deny_public_access tenants + order_progress_logs; advisor 3 INFO→0 |
| 2026-06-04 | P0-1 | — | ⛔ deferred | leaked-pw protection = Pro-plan only; dicoba 2026-06-04 gagal; user aktifkan stlh upgrade |
| 2026-06-04 | F1-1..F1-4 | feat/f1-build-order | ✅ done | otomatisasi build_order: generateContent+templates+API+tombol; e2e klinik verified, idempoten |
| 2026-06-04 | F2-2 restaurant | PR#52 (6e7da14) | ✅ done | variant rustic+modern, palet semantik, e2e kanawa clean flip; **F2 TUNTAS** |
| 2026-06-04 | F2-3 | a77fc66 (master) | ✅ done | sync swatch picker: travel luxury+batik+toko modern ke palet renderer |
| 2026-06-04 | F3-1 | (sejak F1-2) | ✅ done | template isi briefing nyata; fallback spesifik nama+kota, bukan Lorem |
| 2026-06-04 | F3-2 | PR#53 (5c15e60) | ✅ done | copyVariants.ts: 3 register copy/industri, tone by variant + rotasi nama; **F3 jalur default TUNTAS** |
| 2026-06-04 | F4-1..F4-3 | PR#54 (711495a) | ✅ done | arketipe layout TokenPack: split/fullbleed/list + centered baseline; verified SSR |
| 2026-06-04 | F5-1 | PR#55 | ✅ merged | preview draft sebelum publish: SiteRenderer bersama + /admin/preview + PreviewBar; prod deploy Ready |
| 2026-06-04 | F5-2 | PR#56 | ✅ merged | rollback/versi: page_versions + versions.ts + API versions + panel Riwayat; e2e round-trip verified |
| 2026-06-04 | F5-3 | PR#57 | ✅ merged | self-edit klien: /api/portal/sections + ContentPanel + tab Konten portal; prod deploy Ready |
| 2026-06-04 | F5-4 | PR#58 | ✅ merged | test suite render + CI: Vitest + packs/TokenDriven snapshot + GH Actions; CI hijau PR pertama; **F5 TUNTAS** |
| 2026-06-04 | P5DB-2 | PR#59 | ✅ merged | security headers: HSTS+nosniff+referrer+permissions global, anti-clickjacking di /admin+/portal; situs klien tetap framable; verified curl |
| 2026-06-04 | P5DB-1 | PR#60 | ✅ merged | rate limiting in-memory: login 8/10mnt + track 60/mnt per IP; helper reusable; 5 test |
| 2026-06-04 | P5DB-3 | PR#61 | ✅ done | monitoring: security_events + logSecurityEvent (login gagal/ratelimit, track ratelimit); persist+log tanpa channel; **P5DB TUNTAS** |
| 2026-06-04 | UX briefing | PR#62 | ✅ merged | DetailForm tahap-2 benar-benar opsional (hapus jebakan foto hero wajib + jalan keluar "lewati"); audit form: tahap-1 sudah ramping |

---

# Penjelasan Detail Fitur (referensi)

> Dokumentasi tiap fitur yang sudah dibangun: **apa masalahnya, solusinya, cara kerja (file + alur), cara pakai, dan verifikasinya.** Untuk onboarding tim / mengingat kembali konteks tanpa membaca semua kode.

## TRACK A — Keamanan Database

### P0-2 / P0-3 — Policy RLS eksplisit (deny publik)
- **Masalah:** 3 tabel sensitif (`tenant_payment_config`, `tenants`, `order_progress_logs`) punya RLS *aktif tapi 0 policy*. Advisor menandai sebagai risiko ("RLS enabled, no policy").
- **Solusi:** Tambah policy `deny_public_access` (anon + authenticated → `using(false)`, `with_check(false)`). Service role tetap bypass RLS, jadi kode server (API admin) tak terdampak.
- **Cara kerja:** Migration via Supabase MCP. Audit membuktikan render publik `[slug]` (anon) hanya membaca `landing_pages`/`page_sections`/`tenant_profile` — bukan ketiga tabel itu. Jadi deny publik = nol regresi.
- **Verifikasi:** advisor `rls_enabled_no_policy` 3 INFO → 0. Render anon tak terpengaruh.
- **Rollback:** `drop policy "deny_public_access" on <tabel>;`

### P0-1 — Leaked password protection *(PENDING USER)*
- Toggle di **Supabase Dashboard → Authentication → Password** ("Leaked password protection" / HaveIBeenPwned). Tidak ada MCP tool, harus diklik manual. Setelah aktif, advisor WARN `auth_leaked_password_protection` hilang.

---

## TRACK B — Fitur Builder

### F1 — Otomatisasi build_order *(dampak terbesar)*
- **Masalah:** Tiap order, tim harus buka Claude Code, ketik `/build-order`, generate konten manual, insert section, publish. Order banyak = macet (bottleneck "berapa sesi Claude tim sanggup jalanin").
- **Solusi:** Pindah generasi konten dari skill `.md` manual → **kode TypeScript** yang jalan otomatis. Order → website draft jadi sendiri dalam hitungan detik.
- **Cara kerja:**
  - `src/lib/build/generateContent.ts` — fungsi murni: order → `BuildPlan` (sections + services/menu/products + tenant_profile + theme/variant/design_tokens).
  - `src/lib/build/templates.ts` — registry 6 industri (travel/restaurant/corporate/klinik/sekolah/toko_online) + generic. Isi dari briefing nyata, fallback copy spesifik bisnis (nama+kota), **bukan Lorem ipsum**.
  - `src/lib/build/persist.ts` — `applyBuildPlan` tulis ke DB. **Idempoten:** wipe baris generate lama lalu insert ulang → panggil 2× tetap sama.
  - API `/api/admin/build-order/[id]` (guard admin) + tombol di `BuildButton.tsx`.
- **Cara pakai:** Admin → kartu order → "Buatkan Website" (provisioning) → "Bangun Draft" → konten terisi otomatis.
- **Verifikasi:** e2e order seed `klinik-sehat-prima` — 6 section + 3 dokter nyata + tenant_profile, design_tokens derived, render `[slug]` 200, rebuild idempoten tetap 6 section.

### F2 — Variant nyata penuh *(18 variant)*
- **Masalah:** Token-pack hanya jalan untuk tema non-bespoke. Tema bespoke (klinik/rental/company/sekolah/restaurant/batik) pakai renderer sendiri & **tidak konsumsi variant** → cuma 5/18 variant render beda nyata; sisanya identik.
- **Solusi:** Tiap renderer bespoke "honor" variant-nya (palet/aksen/tipografi di-thread sebagai `pal`), 1 renderer per PR.
- **Cara kerja:** Tiap renderer dapat palet per-variant. Warna dwiperan (mis. INK/CREAM/INDIGO) **dipecah jadi peran semantik** (pageBg/surfaceBg/heading/accent/onAccent/…) supaya bisa flip light↔dark tanpa pecah. Nilai default = persis warna lama (no-regression).
  - sekolah: warm (maroon/amber) vs clean (royal blue).
  - rental: bold (oranye/dark) / fresh (biru/light) / luxury (gold/dark).
  - klinik: warm (sage/terracotta) / premium (navy+gold di ivory) / clean (renderer terpisah).
  - company: editorial (near-black+amber) / clean (putih+royal blue) / minimal (monokrom).
  - batik_toko: batik (indigo/krem/amber) / modern (slate+gold).
  - restaurant: rustic (espresso/krem/terracotta) / modern (slate gelap+champagne gold).
- **Verifikasi:** per renderer — flip variant di DB → `curl [slug]` → hitung warna penanda beda nyata → restore. Swatch picker (`website-variants.ts`) ikut disinkron ke palet renderer asli.

### F3 — Konten dari data nyata *(nol-opex)*
- **Masalah:** Copy generik & seragam antar bisnis.
- **Solusi (jalur default TANPA Claude API → nol biaya LLM/order):**
  - **F3-1** (sejak F1-2): template diisi briefing nyata (nama usaha, layanan, kota, dokter, menu, produk, program, keunggulan). Fallback spesifik nama+kota, bukan placeholder.
  - **F3-2** `src/lib/build/copyVariants.ts`: 3 register copy/industri (warm/energetic/elegant). Deskripsi (hero+about) & subtitle CTA dipilih by **tone variant** klien (luxury/premium→elegant, bold/editorial→energetic, fresh/clean/minimal→lugas, rustic/warm/batik→hangat). Feature trio **dirotasi by hash nama bisnis** → tak kembar antar klien.
- **Catatan:** Briefing nyata selalu **menang** atas fallback. **F3-3** (LLM polish via Claude API, ~ribuan opex/order) sengaja **DITUNDA** & flag-gated default OFF — jalur default sudah layak jual.

### F4 — Layout arketipe *(bukan sekadar re-skin)*
- **Masalah:** Token-pack cuma ganti warna/font — susunan tetap sama, jadi variant terasa mirip.
- **Solusi:** Tambah field `layout` ke `TokenPack` (`hero` centered/split/fullbleed · `features` grid/rows/list · `pad` normal/airy · `align` center/left). `TokenDrivenRenderer` baca `layout` → **ubah susunan komponen**, bukan cuma CSS var.
- **Pemetaan:** luxury-navy = split hero + rows editorial + airy; bold-energetic = fullbleed hero + grid; minimal-refined = center tipis + list garis; clean-modern & warm-cafe = centered + grid (baseline no-regression).
- **Verifikasi:** `renderToStaticMarkup` (SSR) tiap pack menghasilkan struktur HTML berbeda. Scope = TokenDrivenRenderer (tema non-bespoke).

### F5 — Robustness Produk *(4/4)*

#### F5-1 — Preview sebelum publish
- **Masalah:** Hasil build langsung live, tak ada cara review dulu. Tak ada "WYSIWYG" sebelum publik melihat.
- **Solusi:** Bangun sebagai **DRAFT** → admin review di halaman Preview → klik **Publish**.
- **Cara kerja:**
  - `src/app/components/SiteRenderer.tsx` — logika render semua tema diekstrak jadi **komponen server bersama** `renderSite({page, slug, client})`. Dipakai dua tempat: `[slug]` publik (client anon, RLS gated `published`) **dan** preview (service role → bisa lihat draft). Satu sumber kebenaran = preview persis = hasil live.
  - `fetchPageByIdAdmin` — fetch by id tanpa filter status.
  - `/admin/preview/[pageId]` (admin-gated) + `PreviewBar` (badge Draft/Live, tombol Publish, Buka Live).
  - `BuildButton`: "Bangun Otomatis" → "Bangun Draft" (publish:false) → redirect ke Preview.
- **Cara pakai:** kartu order → Bangun Draft → Preview muncul → Publish. Publish lewat `PATCH /api/admin/pages action=publish`.

#### F5-2 — Rollback / versi
- **Masalah:** Kalau build/edit salah, tak ada cara balik ke versi sebelumnya. Rebuild menimpa konten lama permanen.
- **Solusi:** Snapshot konten halaman tiap sebelum rebuild → bisa **Pulihkan**.
- **Cara kerja:**
  - Tabel `page_versions` (jsonb snapshot/page, RLS deny publik, service-role-only).
  - `src/lib/build/versions.ts`: `snapshotPage` (skip kalau kosong, simpan **15 versi terbaru**), `restorePageVersion` (wipe+insert add-on tables + update data_konten/konfigurasi; **status live/draft TIDAK diubah**; auto bikin versi `pre_restore` sbg jaring pengaman → restore pun bisa dibatalkan).
  - `applyBuildPlan` auto-snapshot `pre_build` sebelum wipe (best-effort, non-fatal).
  - API `/api/admin/pages/[id]/versions` (GET list, POST restore|snapshot) + panel **Riwayat** di PreviewBar.
- **Verifikasi:** e2e round-trip (temp page) — snapshot → hapus section + corrupt konten → restore → semua pulih + `pre_restore` terbuat.

#### F5-3 — Self-edit klien
- **Masalah:** Klien harus minta tim untuk ubah teks/gambar website. Portal sudah bisa kelola produk/layanan/menu/blog/galeri/profil, tapi **bukan copy halaman** (hero/about/heading).
- **Solusi:** Tab **Konten** di portal — klien edit teks & gambar tiap section sendiri.
- **Cara kerja:**
  - API `/api/portal/sections` PATCH — verifikasi sesi portal (JWT `app_metadata.tenant_id`) + **ownership section**, tulis via service role. **Tidak melebarkan RLS `page_sections`** (pola sama dgn route portal lain).
  - `src/app/portal/ContentPanel.tsx` — editor generik per section: field string top-level (judul/subjudul/CTA/deskripsi/gambar) + array `items` (keunggulan/testimoni/FAQ), label ramah, textarea utk teks panjang, preview thumbnail gambar, Simpan per section + badge "Belum disimpan".
- **Cara pakai:** Klien login portal → tab **Konten** → edit → Simpan (langsung live).

#### F5-4 — Test suite render + CI
- **Masalah:** Tak ada jaring pengaman — regresi render baru ketahuan setelah live.
- **Solusi:** Snapshot test render + CI otomatis tiap PR.
- **Cara kerja:**
  - **Vitest** (env node, `renderToStaticMarkup` — tanpa jsdom). Script `npm test` / `test:watch` / `typecheck`.
  - `packs.test.ts` — VARIANT_PACK semua valid, tiap pack layout lengkap, arketipe beda nyata, `resolveTokenPack` + kontras `onPrimary`, `isTokenDrivenTheme`.
  - `TokenDrivenRenderer.test.tsx` — render 5 pack tanpa error + snapshot markup + assert layout beda struktural.
  - `.github/workflows/ci.yml` — PR + push master → `npm ci` → typecheck → test.
- **Status:** 25 test pass (incl. rate-limit), CI hijau sejak PR pertama.

---

## P5DB — DB Hardening lanjut *(3/3)*

### P5DB-2 — Security headers
- **Apa:** `next.config.mjs` `headers()`.
  - **Semua route:** HSTS (`max-age=31536000`, tanpa includeSubDomains), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geolocation off), `X-DNS-Prefetch-Control`.
  - **/admin + /portal:** anti-clickjacking (`X-Frame-Options: DENY` + CSP `frame-ancestors 'none'`).
- **Keputusan penting:** Situs klien `[slug]` **SENGAJA tetap bisa di-iframe** (galeri "Karya Kami" di corp-landing menampilkannya via iframe) → proteksi frame hanya di area sensitif, nol regresi galeri. HSTS tanpa includeSubDomains agar tak memaksa HTTPS ke subdomain ekosistem lain. CSP konten penuh utk situs publik **ditunda** (klien embed konten arbitrer: gambar URL bebas, video/map embed).
- **Verifikasi:** curl lokal — `/pricing` dapat header aman tanpa frame-block; `/admin/login` dapat DENY + frame-ancestors none.

### P5DB-1 — Rate limiting
- **Apa:** `src/lib/rate-limit.ts` — limiter **in-memory fixed-window** (`rateLimit`/`clientIp`/`tooManyRequests`), lazy prune.
- **Penerapan:** `/api/admin/login` rem brute force **8 / 10 menit per IP**; `/api/track` rem spam **60 / menit per IP**. Helper reusable utk endpoint lain (payment/briefing/shop).
- **Catatan penting:** Vercel serverless = memori per-instance → ini **best-effort** (menaikkan bar, bukan jaminan global lintas instance). Untuk penegakan global, ganti store ke **Upstash Redis** saat env tersedia — API helper tetap sama, cuma implementasi internal yang berubah.

### P5DB-3 — Monitoring peristiwa keamanan
- **Apa:** Catat peristiwa keamanan untuk audit & deteksi lonjakan. **Persist + log, tanpa channel notifikasi keluar** (keputusan user).
- **Cara kerja:**
  - Tabel `security_events` (kind/ip/detail jsonb, RLS deny publik, index by kind+created_at).
  - `src/lib/security-log.ts` `logSecurityEvent` → `console.warn` (Vercel logs) + insert. **Best-effort, NON-FATAL** (tak pernah menggagalkan request asal).
  - `/api/admin/login` log `admin_login_failed` + `admin_login_ratelimited`; `/api/track` log `track_ratelimited`.
- **Cara audit (SQL):**
  ```sql
  -- login gagal per IP, 1 jam terakhir
  select ip, count(*) from security_events
  where kind = 'admin_login_failed' and created_at > now() - interval '1 hour'
  group by ip order by 2 desc;
  ```
- **Upgrade nanti:** sambungkan ke channel alert (WA gateway / email / Slack) untuk notifikasi real-time saat ada lonjakan.

---

## Ringkasan Arsitektur Setelah Upgrade

```
Order masuk → "Bangun Draft" (API generateContent, nol-opex)
            → konten + variant + layout otomatis (F1/F2/F3/F4)
            → DRAFT (tidak langsung live)
Admin       → Preview WYSIWYG (F5-1) → Publish
            → kalau salah: Riwayat → Pulihkan versi (F5-2)
Klien       → portal tab "Konten": edit teks/gambar sendiri (F5-3)
CI          → tiap PR: typecheck + snapshot render test (F5-4)
Keamanan    → headers (P5DB-2) + rate limit (P5DB-1) + audit log (P5DB-3)
            + RLS deny-all di tabel sensitif (P0)
```

**File kunci:**
- Build: `src/lib/build/{generateContent,templates,persist,versions,copyVariants}.ts`
- Render: `src/app/components/SiteRenderer.tsx` (bersama) + renderer per tema + `TokenDrivenRenderer`
- Token/layout: `src/lib/design-tokens/packs.ts`
- Portal self-edit: `src/app/portal/ContentPanel.tsx` + `/api/portal/sections`
- Preview/rollback: `src/app/admin/preview/[pageId]/` + `/api/admin/pages/[id]/versions`
- Keamanan: `src/lib/{rate-limit,security-log}.ts` + `next.config.mjs`
- Test: `*.test.ts(x)` + `.github/workflows/ci.yml`

---

# F3-3 — Rancangan Detail LLM Polish *(BELUM DIIMPLEMENTASI — spec untuk nanti)*

> **Status:** OPSIONAL, ditunda. Jalur default (F3-1 template + F3-2 copyVariants) sudah layak jual & nol-opex. F3-3 = lapisan premium di atasnya. Dokumen ini = blueprint siap eksekusi saat user memutuskan menyalakan. **Baca dulu sebelum implement.**

## 0. Strategi aktivasi & kualitas (BACA DULU — lapisan di atas implementasi)
> Bagian 1–10 menjawab **BAGAIMANA** memoles. Bagian 0 ini menjawab **KAPAN layak** & **BAGAIMANA tahu hasilnya lebih baik, bukan lebih buruk.** Ditambahkan 2026-06-05 setelah diskusi strategi AI.

### 0.a Risiko sejati: regresi diam-diam (bukan biaya/halusinasi)
Biaya (Haiku = pecahan sen) & halusinasi (validasi regex) sudah dimitigasi. Risiko terbesar yang TERSISA: **copy template di `copyVariants.ts` sudah ditulis manusia — spesifik, hangat, anti-klise.** LLM gampang meregresikannya jadi klise generik ("solusi terpercaya", "harga terjangkau", "pelayanan memuaskan"), dan **di skala ribuan order tak akan ketahuan.** Maka strategi WAJIB punya gerbang kualitas, bukan cuma gerbang fakta.

### 0.b Reframe inti — Polish vs Transform
| Mode | Input | Nilai | Risiko |
|---|---|---|---|
| **Polish** | template (sudah bagus) → dihaluskan | rendah (marginal) | tinggi (jadi AI-ish/klise) |
| **Transform** | kata-kata mentah klien (briefing freeform) → copy rapi | **tinggi** (benar-benar khusus bisnis) | rendah (ada bahan nyata) |

**Keputusan: F3-3 diposisikan sebagai TRANSFORM, bukan Polish.** Nilai sejati LLM = merapikan cerita/keunggulan yang ditulis klien dengan kata-kata mereka sendiri — sesuatu yang template tak akan pernah bisa. Memoles template yang sudah bagus = effort sia-sia berisiko regresi.

### 0.c Kriteria pemicu (trigger gating) — polish hanya jalan saat layak
Hitung **skor kekayaan briefing** dari field freeform terisi (panjang `deskripsi`, ada `keunggulan`, cerita/USP, dll).
- **Briefing KAYA** → kandidat transform, jalankan LLM. Di sinilah nilai muncul.
- **Briefing TIPIS** → **SKIP LLM**, pakai template+rotasi (F3-2). Lebih aman dari LLM mengarang basa-basi, sekaligus hemat biaya otomatis.
Jadi guardrail biaya bukan cuma rate-limit — tapi *relevansi*: order yang tak punya bahan tak dipoles.

### 0.d Gerbang kualitas (eval) — WAJIB sebelum default-on premium
Jangan ship tanpa bukti polish menang. Sebelum aktifkan:
1. Kumpulkan **golden set 15–20 briefing nyata** lintas industri (campur tipis & kaya).
2. Render **template vs hasil-LLM** untuk tiap briefing.
3. **Rating blind manual** (kamu): mana lebih baik?
4. **Gerbang lulus:** hasil-LLM harus MENANG di mayoritas briefing kaya, **dan TAK PERNAH lebih buruk** di briefing tipis. Kalau kalah → perbaiki prompt, **jangan ship.**
5. Simpan golden set sebagai **uji regresi** — tiap ubah prompt/model, jalankan ulang.

### 0.e Pemaketan & ekonomi
Biaya Haiku per order = pecahan sen → margin ~penuh kalau dijual. **Posisikan sebagai add-on berbayar "Copywriting AI khusus bisnismu" di tier premium**, BUKAN default paket dasar (template sudah layak jual). Prinsip: AI = nilai tambah berbayar, jangan jadi biaya tertanam di harga dasar.

### 0.f Sinergi & gerbang keputusan
- **Sinergi:** mode Transform = jembatan ke "Normalisasi input briefing" (titik AI #3). Kalau normalisasi dibangun, F3-3 transform numpang pipeline yang sama. Pertimbangkan bangun berbarengan.
- **Gerbang keputusan (kapan mulai ngoding):** bangun F3-3 HANYA jika (1) ada permintaan tier premium nyata / klien mau bayar lebih, ATAU (2) data konversi menunjukkan copy template jadi bottleneck. Sampai itu: tetap blueprint. **Jangan bangun karena "keren".**

## 1. Tujuan & prinsip
- **Tujuan:** Setelah draft copy template jadi, perhalus pakai Claude API → copy lebih natural, spesifik, persuasif, "ditulis khusus" untuk bisnis itu (bukan template isi-formulir).
- **Prinsip yang TAK boleh dilanggar:**
  1. **Flag-gated, default OFF.** Matikan flag = balik 100% ke template. Arsitektur tak berubah.
  2. **Fallback penuh & non-fatal.** API error/timeout/JSON invalid → pakai copy template apa adanya. **Build TAK BOLEH gagal** gara-gara LLM.
  3. **Nol halusinasi fakta.** LLM hanya boleh memoles GAYA BAHASA. Dilarang mengarang fakta (harga, alamat, no WA, nama dokter, jam buka). Fakta selalu dari briefing.
  4. **Cakupan = body copy saja** (sama dgn F3-2): hero title/subtitle/eyebrow, about body, cta title/subtitle, feature title+desc. JANGAN sentuh data terstruktur (nama menu/layanan/produk/harga, kontak).
  5. **Bahasa Indonesia**, panjang terjaga (jangan meluap dari batas layout).

## 2. Arsitektur & titik integrasi
```
order → generateContent() → BuildPlan (copy template)        [F3-1/F3-2, ADA]
                              │
                              ├─ flag OFF → applyBuildPlan(plan)            ← jalur default
                              │
                              └─ flag ON  → polishBuildPlan(plan, briefing) [F3-3, BARU]
                                              → Claude API (server) → copy halus
                                              → merge ke plan (fallback per-field kalau gagal)
                                              → applyBuildPlan(plan)
```
- **File baru:** `src/lib/build/llmPolish.ts` — fungsi `polishCopy(input): Promise<PolishResult>` (murni I/O LLM, tak sentuh DB).
- **Titik panggil:** di `/api/admin/build-order/[id]/route.ts`, SETELAH `generateContent`, SEBELUM `applyBuildPlan`. Bungkus try/catch → fallback ke plan asli.
- **Reuse:** sebelum tulis, F5-2 `snapshotPage` sudah auto jalan (pre_build) → hasil polish pun bisa di-rollback.

## 3. Flag & kontrol (2 lapis)
1. **Kapabilitas (global, env):** `ANTHROPIC_API_KEY` ada + `LLM_POLISH_ENABLED=true`. Kalau tak ada → fitur mati total, tombol pun tak muncul.
2. **Per-build (pilihan admin):** body request `{ polish: true }` dari tombol baru di `BuildButton` ("Bangun + Poles AI ✨"). Default tombol "Bangun Draft" tetap tanpa polish.
   - *(Opsional lanjutan)* per-tenant: kolom `tenants.tier = 'premium'` → polish auto untuk klien premium.

## 4. Skema data (audit & idempotensi)
- Tambah ke `konfigurasi.branding` (atau `data_konten._meta`): `{ copy_source: 'template' | 'llm', polished_at, model }` → tahu section mana sudah dipoles, dan render/preview bisa kasih badge.
- **Catat pemakaian** ke tabel baru `llm_usage` (atau reuse `security_events` kind `llm_polish`): `{ order_id, page_id, model, input_tokens, output_tokens, est_cost_idr, ok, created_at }`. RLS deny publik (service-role-only). Buat lewat Supabase MCP (additive).

## 5. Desain prompt (structured output)
- **System (cacheable — pakai prompt caching):** peran = copywriter senior Indonesia untuk UMKM; aturan keras (jangan mengarang fakta, pertahankan semua angka/kontak/nama persis, output JSON sesuai skema, jaga panjang, bahasa Indonesia luwes non-klise — hindari "solusi terpercaya", "harga terjangkau", dst).
- **User:** JSON berisi `{ industri, namaUsaha, kota, tone, briefingFakta, draftCopy }`.
- **Output (JSON ketat):** mirror field `draftCopy` (hero.title, hero.subtitle, about.body, cta.title, cta.subtitle, features[].title, features[].desc). Validasi: kunci sama persis, tiap nilai string, panjang ≤ batas per-field. Pakai tool/`response_format` JSON atau parse + validasi Zod.
- **Anti-halusinasi:** instruksi + post-check: pastikan tak ada digit/no telp/alamat BARU yang tak ada di briefing (regex sanity), kalau ada → tolak field itu, pakai template.

## 6. Model & estimasi biaya
- **Default polish:** **Haiku 4.5** (`claude-haiku-4-5-20251001`) — cepat & paling murah, cukup untuk poles gaya.
- **Premium:** **Sonnet 4.6** (`claude-sonnet-4-6`) untuk nuansa lebih tinggi; **Opus 4.8** (`claude-opus-4-8`) untuk paket top.
- **Estimasi token/order:** input ~1.4k (instruksi cacheable + briefing + draft), output ~0.6–1.2k. → sangat kecil. Dengan **Haiku** biayanya **pecahan sen USD per order** (jauh lebih murah dari kesan "ribuan rupiah" — itu skenario Opus). Dengan **prompt caching**, token instruksi berulang lebih murah lagi.
- ⚠️ **Verifikasi harga terkini** di pricing Anthropic saat implement (rate bisa berubah). Simpan `est_cost_idr` per panggilan dari `usage` di respons API.
- **Guardrail biaya:** `max_tokens` ketat (mis. 1500), timeout (mis. 8 dtk), rate-limit pakai `src/lib/rate-limit.ts` (mis. polish 30/menit), dan polish HANYA saat diminta eksplisit (bukan tiap build).

## 7. Fallback & validasi (wajib)
- Timeout/throw/JSON invalid/skema tak cocok → **return plan asli** (template). Log `llm_polish` ok=false.
- Per-field: kalau satu field gagal validasi (kepanjangan / ada fakta baru) → field itu pakai template, sisanya boleh pakai hasil LLM (degradasi anggun).
- Tak ada `ANTHROPIC_API_KEY` → lewati total, tak error.

## 8. Langkah implementasi (checklist saat dikerjakan)
- [ ] Tambah dep `@anthropic-ai/sdk`; pakai skill **claude-api** (wajib prompt caching).
- [ ] Env: `ANTHROPIC_API_KEY`, `LLM_POLISH_ENABLED`, `LLM_POLISH_MODEL` (default haiku). Set via Vercel (jangan commit).
- [ ] `src/lib/build/llmPolish.ts`: `polishCopy()` + skema Zod + validasi anti-halusinasi + caching.
- [ ] Migration `llm_usage` (atau extend `security_events`) via MCP, RLS deny.
- [ ] Wire di `/api/admin/build-order/[id]` (try/catch → fallback), terima `{ polish }`.
- [ ] `BuildButton`: tombol "Bangun + Poles AI ✨" (muncul hanya kalau kapabilitas ON).
- [ ] Badge "Dipoles AI" di PreviewBar/admin (dari `copy_source`).
- [ ] Unit test: fallback saat API mock gagal, validasi tolak fakta-baru, skema output, flag OFF = identik template.
- [ ] Verify e2e: 1 order dgn polish ON → bandingkan draftCopy vs hasil, cek `llm_usage` terisi, flag OFF → identik template.

## 9. Risiko & mitigasi
- **Biaya tak terkendali** → polish on-demand + rate-limit + max_tokens + log biaya.
- **Halusinasi fakta** → aturan prompt keras + post-validasi regex + fallback per-field.
- **Copy klise/AI-ish** → instruksi anti-klise; pertimbangkan skill **humanize** sebagai referensi gaya.
- **Vendor lock / downtime** → fallback template bikin sistem tetap jalan walau API mati.
- **Bahasa salah / meluap layout** → batasi panjang per-field + validasi.

## 10. Definisi "selesai" F3-3
Flag OFF = byte-identik dengan jalur template sekarang (no-regression). Flag ON + tombol = copy dipoles, fakta utuh, biaya tercatat, gagal-anggun ke template, ada badge sumber. Semua lewat CI + 1 PR (sesuai Aturan Produksi).

---

# AI-2 — Rancangan Detail Normalisasi Input Briefing / "Smart-Fill" *(BELUM DIIMPLEMENTASI — spec untuk nanti)*

> **Status:** OPSIONAL, ditunda. Titik AI #3 dari peta strategi (F3-3=#1 copy, ini=#2 input, agentic edit=#3). Ditambahkan 2026-06-05. **Baca dulu sebelum implement.**

## 1. Beda dengan normalisasi yang SUDAH ada (penting)
- **`normalizeBriefing()` (ADA, deterministik, nol-opex):** trim string, parse "Rp 350.000"→angka, bentuk objek. **JANGAN diganti/dihapus** — tetap jadi lapisan akhir.
- **AI-2 (BARU, LLM):** **normalisasi SEMANTIK** — input manusia berantakan (kotak teks bebas) → **fakta terstruktur** (daftar produk/layanan, jam, harga, kontak, kota). Yang `asStr/asNum` tak bisa: ekstraksi & strukturisasi dari prosa bebas. Output AI-2 → tetap lewat `normalizeBriefing()` sesudahnya.

## 2. Posisi dalam pipa (HULU dari F3-3)
```
Input mentah klien ─► [AI-2 NORMALISASI] ─► fakta terstruktur ─► normalizeBriefing() ─► template/[F3-3 Transform] ─► copy
   (kotak bebas)         ekstrak DATA          (pre-fill form)      (struktural, ADA)        hasilkan PROSA
```
- **AI-2 mengubah DATA** (fakta, angka, daftar) — di **form-time**, sebelum bayar.
- **F3-3 mengubah PROSA** (body copy) — di **build-time**.
- Shippable terpisah; kalau dibangun bareng, berbagi SDK + infra `llm_usage`/validasi.

## 3. Prinsip yang TAK boleh dilanggar (beda dari F3-3!)
1. **Assistive + confirmable, TIDAK PERNAH silent.** LLM hanya **mengusulkan** isi field. Klien/admin **wajib review & koreksi** sebelum jadi kebenaran. **Dilarang auto-commit fakta hasil ekstrak.** (Beda dari F3-3: di sana fallback diam-diam aman; di sini fakta salah = tayang salah.)
2. **Augmentasi, bukan substitusi.** Field terstruktur tetap ADA & tetap sumber kebenaran. Smart-Fill cuma **pre-fill** untuk mempercepat. Form tetap jalan penuh tanpa fitur ini (flag OFF = form biasa).
3. **Nol fabrikasi.** Field yang tak disebut klien → biarkan KOSONG, jangan ditebak. Angka/kontak harus berasal dari teks; kalau ragu → kosong (bukan tebakan).
4. **Flag-gated, default OFF.** OFF = form terstruktur biasa (perilaku sekarang, PR#62 UX). 

## 4. Bentuk UX (menjawab kekhawatiran "form kebanyakan")
- Di atas form terstruktur (BriefingForm/DetailForm): kotak besar **opsional** — *"Males ngisi satu-satu? Ceritakan bisnismu bebas di sini, nanti kami rapikan ✨"*.
- Klien nulis bebas → tombol "Rapikan" → LLM ekstrak → **pre-fill** field di bawah (yang tetap editable, ada highlight "diisi otomatis, cek ya").
- Klien koreksi → submit seperti biasa. Friksi turun, kontrol tetap di tangan manusia.
- *(Varian admin-side, lebih aman tapi tak kurangi friksi klien):* admin lihat briefing tipis → "Rapikan" → konfirmasi. Bisa jadi fase 1 sebelum buka ke klien.

## 5. Arsitektur & titik integrasi
- **File baru:** `src/lib/build/normalizeInput.ts` — `extractBriefing(rawText, { tipe }): Promise<ExtractResult>` (murni I/O LLM, tak sentuh DB). Output = parsial `briefing_data` (subset field yang ditemukan) + skor keyakinan per field.
- **API:** `/api/order/smart-fill` (POST `{ rawText, tipe }`) → balikan usulan field. **Rate-limit** (`src/lib/rate-limit.ts`) ketat — ini form-time, sebelum bayar, rawan abuse. Mis. 10/menit per IP.
- **Reuse:** SDK `@anthropic-ai/sdk`, skema Zod, log `llm_usage` (sama dgn F3-3 §4). Output divalidasi Zod ketat sebelum dikirim ke klien.

## 6. Prompt (structured extraction)
- **System (cacheable):** peran = asisten yang MENGEKSTRAK fakta, bukan mengarang. Aturan keras: hanya isi yang tersurat; ragu → null; jangan normalisasi angka secara kreatif (250rb→250000 boleh, tapi jangan tebak yang tak ada); output JSON sesuai skema field briefing per industri.
- **User:** `{ tipe, rawText }`.
- **Output (JSON ketat):** mirror subset `briefing_data` (identitas.deskripsi, jam, alamat, kota_layanan[], wa, email, konten.<bucket>[], dst) + `_confidence` per field. Field tak ditemukan → null/absen.

## 7. Risiko & mitigasi (fokus FAKTA)
- **Salah ekstrak angka/kontak** → **confirm-step wajib** (prinsip #1) + highlight "diisi otomatis" + skor keyakinan rendah ditandai. Manusia penangkap terakhir.
- **Fabrikasi field** → prompt "ragu=null" + validasi: tolak nilai yang regex-nya tak muncul di rawText (mis. nomor telp harus substring teks).
- **Biaya form-time sebelum bayar** → opsional (klien klik sendiri) + rate-limit + max_tokens. Bukan jalan tiap submit.
- **Privasi** → teks bisnis klien dikirim ke Anthropic; sama dgn F3-3 — catat di kebijakan, jangan kirim data sensitif tak perlu.

## 8. Langkah implementasi (checklist)
- [ ] (kalau F3-3 belum) tambah `@anthropic-ai/sdk` + skill **claude-api** (prompt caching).
- [ ] `src/lib/build/normalizeInput.ts`: `extractBriefing()` + Zod + anti-fabrikasi.
- [ ] API `/api/order/smart-fill` + rate-limit + log `llm_usage`.
- [ ] UI: kotak "Smart-Fill" opsional di BriefingForm/DetailForm + pre-fill + highlight "diisi otomatis" + tetap editable.
- [ ] Flag `SMART_FILL_ENABLED` (default OFF) — OFF = form biasa.
- [ ] Test: flag OFF = form identik sekarang; mock LLM → pre-fill benar; field tak disebut = kosong; nilai non-substring ditolak.
- [ ] Verify e2e: tulis paragraf bebas → cek field ter-prefill akurat & yang tak disebut tetap kosong; cek confirm-step jalan.

## 9. Gerbang keputusan (kapan mulai ngoding)
Bangun AI-2 jika: (1) data/observasi menunjukkan **friksi form** jadi penyebab drop-off briefing, ATAU (2) admin sering harus merapikan briefing berantakan manual. Sampai itu: PR#62 (skip aman + opsional + autosave) sudah cukup menurunkan friksi tanpa opex. Pertimbangkan bangun **berbarengan F3-3 Transform** (berbagi pipeline & SDK).

## 10. Definisi "selesai" AI-2
Flag OFF = form terstruktur identik sekarang (no-regression). Flag ON = kotak Smart-Fill opsional mengisi field akurat, fakta tak-disebut tetap kosong (nol fabrikasi), semua hasil **dikonfirmasi manusia** sebelum submit, biaya tercatat. Lewat CI + 1 PR.

---

# AI-3 — Rancangan Detail Agentic Edit Assistant ("Edit lewat ngobrol") *(BELUM DIIMPLEMENTASI — spec untuk nanti)*

> **Status:** OPSIONAL, ditunda — **titik AI #3, paling kompleks/mahal/berisiko, dibangun PALING AKHIR.** Klien (atau admin) menyuruh perubahan via bahasa natural → agent mengeksekusi lewat tool aman. Ditambahkan 2026-06-05. **Baca dulu sebelum implement.**

## 1. Beda dari F5-3 (self-edit manual yang SUDAH ada)
- **F5-3 (ADA):** `ContentPanel` — klien edit field section satu-satu, manual. Sudah cukup untuk edit dasar.
- **AI-3 (BARU):** lapisan agentic di ATAS F5-3 — klien bilang *"bikin lebih mewah, tambah testimoni, ganti judul"* → agent rencanakan & eksekusi lintas section. AI-3 = kenyamanan/wow, **bukan** pengganti F5-3.

## 2. Primitive yang SUDAH ada (agent membungkus ini, bukan bikin dari nol)
| Primitive | Status | Sumber |
|---|---|---|
| **APPLY** ubah `isi_komponen` (ownership-scoped) | ✅ ADA | F5-3 `PATCH /api/portal/sections` |
| **UNDO** snapshot-before + restore | ✅ ADA | F5-2 `snapshotPage` / `restorePageVersion` |
| **OBSERVE** render draft utk preview | ✅ ADA | F5-1 `SiteRenderer` + `/admin/preview/[pageId]` |

Bagian tersulit agentic (cara membatalkan kalau AI ngaco + cegah sentuh tenant lain) **sudah selesai di F5.** Sisa = orkestrasi + beberapa tool CRUD section + UI chat.

## 3. Insight inti — KLASIFIKASI dulu, jangan langsung loop
Mayoritas permintaan = **1 aksi deterministik**, tak butuh agent:
- *"ganti judul jadi X"*, *"sembunyikan section harga"* → **1 tool call** (murah, tanpa reasoning berlapis).
- *"bikin lebih mewah"*, *"rapikan biar premium"* → **baru** ini agentic (palet+copy+layout+spasi lintas section, multi-langkah).

**Aturan: klasifikasi intent → simple = satu tool call (jalur murah) → compound/kabur = agent loop.** Cermin filosofi nol-opex F3: LLM mahal jangan di jalur default. ~80% permintaan tak menyentuh loop.

## 4. Risiko sejati — agency atas aset LIVE klien (kelas berbeda dari F3-3/AI-2)
F3-3 sentuh copy (kosmetik), AI-2 sentuh input pre-bayar (ada confirm). **AI-3 memutasi website klien yang sungguhan:** destruktif (hapus section salah), scope-creep (disuruh ganti judul → menulis ulang seluruh halaman), korupsi fakta (ganti nomor telp saat "memperindah"), biaya loop, auto-publish tak ditinjau.

## 5. Guardrail (kontrak tool typed + reversible; LLM-nya swappable)
1. **Snapshot-before WAJIB** — tiap run agent `snapshotPage(kind:'pre_agent')` dulu → undo 1 klik (F5-2). *Sudah ada.*
2. **Draft-only, NEVER auto-publish** — agent edit draft → klien preview (F5-1) → klien sendiri Publish. (Prinsip = F1-5.)
3. **Whitelist tool typed** — agent HANYA panggil tool terdaftar (`update_section_text`, `set_palette`, `reorder_sections`, `add_section`, `remove_section`, `toggle_visibility`). **BUKAN SQL bebas.** Tiap tool ownership-scoped (reuse cek F5-3). Agent tak bisa sentuh tenant lain / skema DB.
4. **Fact-lock** — data terstruktur (harga/kontak/nama di services/menu/products) **off-limits** atau butuh konfirmasi eksplisit. Agent ubah presentasi & copy, bukan fakta. (Nol-fabrikasi = AI-2.)
5. **Budget langkah & biaya** — maks N tool-call/run, max_tokens, rate-limit; loop WAJIB terminasi.
6. **Plan-then-confirm utk operasi destruktif** — add/remove/reorder = agent ajukan *diff*, klien setujui sebelum apply. Tweak teks boleh lebih langsung (tetap draft + undo).

## 6. Tool surface (yang perlu DIBANGUN vs reuse)
- **Reuse:** `update_section_text` → F5-3 PATCH; snapshot/restore → F5-2; preview → F5-1.
- **BARU (endpoint CRUD section yg belum ada):** `add_section`, `remove_section`, `reorder_sections` (kolom `urutan`), `toggle_visibility` (`is_visible`), `set_palette` (tulis `konfigurasi`/token). Semua ownership-scoped service-role seperti F5-3 (TAK lebarkan RLS).
- **File baru:** `src/lib/agent/editTools.ts` (definisi tool + skema Zod) + `src/lib/agent/runEditAgent.ts` (orkestrasi loop) + `/api/portal/agent` (entry, rate-limit, budget).

## 7. Orkestrasi loop
Tool-use loop Claude API: kirim intent + ringkasan state section (bukan seluruh isi — hemat token) + daftar tool → model panggil tool → eksekusi (ownership-checked) → balikan hasil → ulang s/d selesai atau budget habis. Catat tiap step ke `llm_usage` (reuse F3-3 §4). Akhiri dgn ringkasan perubahan + link preview.

## 8. Penempatan & rollout
- **Fase 1 (aman): admin-internal** — admin pakai agent mempercepat build/revisi. Pakar selalu in-the-loop, risiko rendah, uji guardrail di lingkungan terkendali.
- **Fase 2 (produk): klien premium** di portal — "Edit lewat ngobrol ✨" sebagai diferensiator berbayar, setelah Fase 1 terbukti aman.

## 9. Biaya & paket
Agent loop = fitur AI **termahal** (multi-call). **Metered/credit-based** (mis. "10 edit AI / bulan") atau tier premium. Jangan unlimited. Guardrail biaya = budget langkah + rate-limit + klasifikasi (§3).

## 10. Checklist & gerbang keputusan
- [ ] Endpoint CRUD section baru (add/remove/reorder/toggle/palette) ownership-scoped + test.
- [ ] `editTools.ts` (skema Zod) + `runEditAgent.ts` (loop + budget) + `/api/portal/agent`.
- [ ] Snapshot-before tiap run; plan-confirm utk destruktif; fact-lock.
- [ ] UI chat di portal (Fase 2) / panel admin (Fase 1).
- [ ] Test: ownership (tak bisa edit tenant lain), budget terminasi, undo pulihkan, simple-intent = 1 call (bukan loop), fact-lock tolak ubah harga/kontak.
- **Gerbang keputusan (BANGUN PALING AKHIR):** hanya jika (1) ada permintaan tier premium nyata, DAN (2) F5-3 manual terbukti tak cukup. Sampai itu, F5-3 sudah memenuhi kebutuhan edit. **Jangan bangun karena "keren" — ini paling mahal & berisiko dari ketiga titik AI.**

## 11. Definisi "selesai" AI-3
Agent hanya bisa lewat tool typed (tak ada jalan ke tenant lain/SQL), tiap run ada snapshot-before (undo jalan), draft-only (tak pernah auto-publish), fakta terkunci, operasi destruktif via plan-confirm, biaya/loop terbatas & tercatat. Fase 1 admin-internal hijau dulu sebelum Fase 2 klien. Lewat CI + PR bertahap (1 PR per tool batch + 1 PR orkestrasi).

---

# F1-5 — Rancangan Detail Auto-Build Webhook *(BELUM DIIMPLEMENTASI — spec untuk nanti)*

> **Status:** OPSIONAL, ditunda. Sekarang admin klik manual: "Buatkan Website" (provisioning) → "Bangun Draft" (F1/F5-1). F1-5 = otomatiskan pemicunya supaya **draft jadi sendiri** begitu data siap, admin tinggal review+publish. **Baca dulu sebelum implement.**

## 1. Tujuan & prinsip
- **Tujuan:** Hilangkan langkah klik manual. Order bayar + briefing masuk → sistem provisioning + bangun **DRAFT** otomatis → admin cukup review & publish (F5-1).
- **Prinsip yang TAK boleh dilanggar:**
  1. **JANGAN auto-publish.** Selalu berhenti di DRAFT. Publik baru lihat setelah admin klik Publish (F5-1). (Aman: hindari konten salah/PII tampil tanpa review.)
  2. **Idempoten & non-destruktif.** Jangan rebuild kalau halaman sudah pernah dibangun **dan** sudah diedit admin/klien. Auto-build hanya untuk build PERTAMA. (Pakai penanda, lihat §4.)
  3. **Non-fatal.** Gagal auto-build TIDAK boleh menggagalkan webhook pembayaran / submit briefing. Bungkus try/catch, log, biar admin tetap bisa klik manual.
  4. **Flag-gated, default OFF.** `AUTO_BUILD_ENABLED=true` baru aktif. OFF = perilaku sekarang (manual).
  5. **Aman dipanggil tanpa cookie admin** — pemicu (webhook/briefing) bukan admin login.

## 2. Pemicu: KAPAN auto-build? (keputusan kunci)
Ada 2 momen; **rekomendasi: pakai keduanya, peran beda.**
| Momen | Sinyal | Aksi |
|---|---|---|
| **DP lunas** | Midtrans webhook `payment_status → paid` | **Provisioning** (tenant + landing page kosong). Konten belum ada → JANGAN build penuh. |
| **Briefing tahap-1 submit** | `POST /api/briefing` sukses (`briefing_submitted_at` set) | **Auto-build DRAFT** (di sini konten/briefing baru lengkap). |
- **Kenapa bukan build saat DP lunas?** Saat DP lunas, briefing konten sering BELUM diisi (alur: bayar dulu, briefing belakangan) → hasil build cuma fallback. Build paling bernas SETELAH briefing masuk. (Kalau mau super simpel, cukup hook 1 titik: briefing submit, sekaligus provisioning bila belum ada.)

## 3. Arsitektur & refactor wajib
- **Masalah sekarang:** logika build ada di route `/api/admin/build-order/[id]` yang **di-guard cookie admin**. Webhook/briefing tak punya cookie itu.
- **Refactor:** ekstrak inti jadi fungsi reusable **`src/lib/build/runBuild.ts`** → `runBuild(orderId, { publish:false }): Promise<BuildResult>` (ambil order → `generateContent` → `applyBuildPlan`). Tak ada dependensi cookie.
  - Route admin **memanggil** `runBuild` (tetap di-guard admin).
  - Pemicu auto (webhook/briefing) **memanggil** `runBuild` juga (di-guard flag + signature webhook), pakai `supabaseAdmin`.
- **Provisioning reusable:** ekstrak logika `/api/admin/tenants` (provisioning) jadi `provisionFromOrder(orderId)` biar bisa dipanggil otomatis juga.
```
Midtrans webhook (paid) → [flag ON] provisionFromOrder(orderId)            (draft kosong)
POST /api/briefing OK   → [flag ON] ensureProvisioned() → runBuild(draft)  (draft terisi)
                                          │ gagal → log, non-fatal (admin bisa manual)
                                          ▼
Admin → Preview (F5-1) → Publish
```

## 4. Idempotensi & penanda (cegah timpa kerja admin)
- Tambah penanda di `landing_pages.konfigurasi._build` atau kolom: `{ auto_built_at, build_count, locked_by_edit: boolean }`.
- Aturan auto-build jalan HANYA jika: `tenant_id` ada **dan** belum pernah auto-build (`auto_built_at` null) **dan** belum ada edit manual (`locked_by_edit` false / belum published).
- Saat admin/klien edit (F5-3 ContentPanel / builder) → set `locked_by_edit=true` → auto-build tak akan menimpa lagi.
- `runBuild` sendiri sudah idempoten (F1: wipe+insert), tapi penanda ini mencegah rebuild MENGHAPUS editan manual.

## 5. Keamanan webhook
- **Verifikasi signature Midtrans** (`signature_key` = SHA512(order_id+status_code+gross_amount+ServerKey)) sebelum proses — tolak kalau tak cocok. (Cek apakah `/api/payment/webhook` sudah verifikasi; kalau belum, ini prasyarat.)
- Webhook harus **balas cepat 200** lalu kerja berat async, atau pastlikan runBuild cukup cepat (<~10s). Pertimbangkan jalankan build di "after response" / queue ringan agar Midtrans tak timeout/retry.
- Rate-limit & log (`security_events` kind `auto_build`).

## 6. Notifikasi admin (review siap)
- Setelah draft auto-build sukses → tandai order "Draft siap direview" (kolom status / badge di `/admin`).
- Log `security_events` / (nanti) kirim WA ke admin: "Order X draft siap, klik Preview".
- Admin buka `/admin` → kartu order tampil tombol **Preview** (sudah ada F5-1) → review → Publish.

## 7. Fallback & kegagalan
- `runBuild` throw → tangkap, log, set order flag `auto_build_failed` → admin tetap lihat tombol manual "Bangun Draft". **Webhook/briefing tetap balas sukses.**
- Briefing belum cukup data → build tetap jalan (fallback copy F3-1/F3-2). Tak apa, itu draft.
- Flag OFF / belum provisioned → lewati diam-diam.

## 8. Langkah implementasi (checklist saat dikerjakan)
- [ ] Refactor `runBuild.ts` (ekstrak dari route admin) + `provisionFromOrder.ts` (ekstrak dari `/api/admin/tenants`). Route admin pakai fungsi ini (no behaviour change).
- [ ] Env `AUTO_BUILD_ENABLED` (default OFF) di Vercel.
- [ ] Penanda idempotensi di `landing_pages` (additive, via MCP) + set `locked_by_edit` saat edit (F5-3/builder).
- [ ] Hook di `POST /api/briefing` (setelah sukses): flag ON → ensureProvisioned → runBuild draft → set `auto_built_at` → log. Try/catch non-fatal.
- [ ] (Opsional) Hook di `/api/payment/webhook` (paid): flag ON → provisionFromOrder. Pastikan signature terverifikasi.
- [ ] Badge "Draft siap review" di `/admin` + (opsional) notif.
- [ ] Test: webhook/briefing mock → draft terbentuk, TAK published; rebuild kedua tak menimpa editan (locked); flag OFF = perilaku lama; gagal build = non-fatal.
- [ ] Verify e2e: order baru → bayar (sandbox) → isi briefing → cek draft otomatis ada di Preview, status draft, konten dari briefing.

## 9. Risiko & mitigasi
- **Auto-publish konten salah** → HARD RULE draft-only; publish tetap manual.
- **Timpa editan admin/klien** → penanda `locked_by_edit` + cek `auto_built_at`.
- **Webhook timeout/duplikat** (Midtrans retry) → idempoten + balas 200 cepat + signature verify.
- **PII/briefing bocor** → tetap di draft (RLS gated published; preview admin-only).
- **Build berat saat trafik order tinggi** → ringan (kode murni); kalau perlu, antrian.

## 10. Definisi "selesai" F1-5
Flag OFF = perilaku manual sekarang (no-regression). Flag ON = order+briefing → draft otomatis muncul di Preview tanpa klik, TIDAK pernah auto-publish, tak menimpa editan manual, gagal-anggun ke jalur manual. Lewat CI + PR bertahap (refactor dulu, baru hook).

---

# CD — Rancangan Detail Custom Domain *(BELUM DIIMPLEMENTASI PENUH — spec untuk nanti)*

> **Status:** Lapis aplikasi SUDAH ADA (`src/proxy.ts`), tapi langkah Vercel + DNS masih MANUAL dan deep-path belum di-rewrite. Spec ini = blueprint untuk menyempurnakan + otomasi. **Baca dulu sebelum implement.**

## 1. Tujuan
Klien bisa pakai domainnya sendiri (`tokobudi.com`) atau subdomain studio (`tokobudi.japanarena.id`) untuk menampilkan website-nya, dengan setup seminimal mungkin (idealnya tanpa kerja manual tim).

## 2. Yang SUDAH ada (jangan dibangun ulang)
- **`src/proxy.ts`** (Next 16 "proxy", pengganti middleware): request dari host non-utama → query `landing_pages` `domain_custom = host` & `status=published` → **rewrite root `/` ke `/<slug>`**.
- Kolom **`landing_pages.domain_custom`** (diset admin via `PATCH /api/admin/pages`).
- `isPrimaryHost()`: localhost / `*.vercel.app` / `NEXT_PUBLIC_BASE_URL` dilewati apa adanya.
- **Keterbatasan saat ini:**
  1. Hanya rewrite **pathname `/`** → situs >1 halaman (commerce `/checkout`, `/booking`) belum ikut.
  2. Domain harus **manual** di-add ke Vercel + DNS diarahkan tim. Belum ada otomasi.

## 3. Dua model domain (pilih sesuai kebutuhan)
| Model | Contoh | Setup Vercel | Cocok untuk |
|---|---|---|---|
| **Subdomain studio (wildcard)** | `tokobudi.japanarena.id` | add `*.japanarena.id` **sekali** | Skala besar — tiap klien instan, nol setup per-domain |
| **Domain milik klien** | `tokobudi.com` | add per-domain (manual/API) + DNS klien | Klien yang sudah punya brand domain |
- **Rekomendasi:** dukung **dua-duanya**. Default tiap klien dapat subdomain wildcard gratis-instan; domain sendiri = upgrade.

## 4. Lapis infra (DNS & Vercel)
- **Wildcard** `*.japanarena.id`: add 1× di Vercel, DNS `*.japanarena.id` CNAME → `cname.vercel-dns.com`. Setelah itu subdomain klien tak perlu sentuh DNS lagi.
- **Domain klien** `tokobudi.com`:
  - Apex: **A → `76.76.21.21`** (verifikasi nilai terkini di Vercel).
  - `www`/subdomain: **CNAME → `cname.vercel-dns.com`**.
  - SSL: Vercel auto Let's Encrypt setelah DNS valid.

## 5. Otomasi via Vercel Domains API (hilangkan kerja manual tim)
- Saat admin/klien set `domain_custom`, panggil **Vercel REST API** dari server:
  - `POST /v10/projects/{projectId}/domains` body `{ name }` (+ header `Authorization: Bearer VERCEL_TOKEN`, query `teamId`).
  - `GET /v9/projects/{projectId}/domains/{domain}/verify` untuk status verifikasi.
  - Tampilkan **instruksi DNS** (record + nilai) ke klien di portal, plus indikator status: *Menunggu DNS → Aktif (SSL ✓)*.
- Env baru: `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`. Simpan di Vercel env (jangan commit). Flag `CUSTOM_DOMAIN_AUTOMATION`.
- Untuk subdomain wildcard: **tak perlu API call** (sudah ke-cover wildcard) — cukup set `domain_custom` = subdomain & pastikan proxy match.

## 6. Rewrite deep-path (untuk situs commerce/booking di domain sendiri)
- Perluas `proxy.ts`: kalau host = domain custom → rewrite **semua path** `/<x>` ke `/<slug>/<x>` (bukan cuma root), KECUALI aset/api.
- Hati-hati: hindari double-rewrite & loop; pertahankan query string; jangan ganggu `/portal`, `/admin` (itu area studio, bukan situs klien).
- Cache resolusi host→slug (mis. in-memory TTL pendek / header) supaya tak query DB tiap request.

## 7. Skema data
- Pakai `landing_pages.domain_custom` (sudah ada). Tambah status: `domain_status` (`none|pending_dns|active`) + `domain_added_at`. Additive via MCP.
- Index `domain_custom` (unik, where not null) supaya lookup proxy cepat & cegah dobel klaim domain.

## 8. Keamanan & validasi
- **Cegah domain hijack:** verifikasi kepemilikan via Vercel verify (TXT/CNAME) sebelum `domain_status=active`. Jangan render situs di domain yang belum terverifikasi.
- Validasi format domain (regex) + tolak domain milik studio sendiri (japanarena.id/.com) sebagai domain_custom klien.
- Unik: 1 domain → 1 page (constraint DB).
- `domain_custom` lookup hanya untuk `status=published` (sudah di proxy) — draft tak bocor lewat domain.

## 9. Langkah implementasi (checklist saat dikerjakan)
- [ ] Wildcard `*.japanarena.id` di Vercel + DNS CNAME (1× setup infra). Uji 1 subdomain klien.
- [ ] Migration: `domain_status` + `domain_added_at` + index unik `domain_custom`. (MCP, additive)
- [ ] Perluas `proxy.ts`: rewrite deep-path untuk custom domain + cache host→slug.
- [ ] (Otomasi) `src/lib/vercel-domains.ts`: add/verify domain via Vercel API. Flag-gated.
- [ ] Admin/portal UI: input domain + tampilkan instruksi DNS + status (pending/active).
- [ ] Validasi & keamanan (verify kepemilikan, tolak domain studio, unik).
- [ ] Test: subdomain wildcard resolve ke slug; domain custom (mock) resolve; deep-path `/checkout` ke `/<slug>/checkout`; draft tak tampil; domain belum verified tak render.
- [ ] Verify e2e: set domain_custom → akses → website klien tampil + SSL.

## 10. Risiko & mitigasi
- **Rewrite loop / path bocor ke /admin /portal** → exclude eksplisit + test.
- **Query DB tiap request** (proxy jalan di edge) → cache host→slug TTL pendek.
- **Domain belum diarahkan** → tampilkan status "pending DNS", jangan janji aktif instan.
- **VERCEL_TOKEN bocor** → scope token minimal (domains only), simpan di env, rotasi.
- **Klien klaim domain orang** → wajib verify kepemilikan sebelum active.

## 11. Definisi "selesai" CD
Subdomain wildcard: klien baru langsung punya `nama.japanarena.id` tanpa setup tim. Domain sendiri: klien input domain → dapat instruksi DNS → setelah verified, situs tampil di domainnya dgn SSL, deep-path jalan, draft & area studio tak bocor. Bertahap per PR (wildcard + deep-path dulu; otomasi API belakangan).
