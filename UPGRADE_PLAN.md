# Upgrade Plan — JA Website Builder Platform

> **Tujuan:** Naikkan sistem dari 7/10 → 10/10 (fitur builder) dan keamanan DB 7.5/10 → 9/10, **tanpa merusak production**.
>
> **File ini = sumber kebenaran.** Kalau terminal Claude Code mati / laptop restart: buka file ini, baca **CURRENT STATUS** + checkbox tiap fase, lanjut dari step yang belum `[x]`. Jangan andalkan ingatan sesi.

---

## CURRENT STATUS

- **Tanggal mulai:** 2026-06-04
- **Fase aktif:** Sprint 2 dimulai (F2 variant gap). Sprint 1 inti SELESAI + F1 MERGED ke production (PR#46, deploy Ready 2026-06-04). P0-1 nunggu user, F1-5 ditunda.
- **Step berikutnya:** F2-2 lanjut renderer berikutnya (klinik premium / restaurant / company / batik). sekolah ✅. Lalu F3-2 template varian.
- **Catatan terakhir:** 2026-06-04 — F1 otomatisasi build_order LIVE (lokal verified, PR dibuka). generateContent + templates 6 industri + API route + tombol admin. e2e klinik seed sukses, idempoten, render 200. SEBELUMNYA: P0-2 & P0-3 done (deny-all RLS, advisor 3 INFO→0). Sisa P0-1 (WARN password, butuh dashboard).

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

- [!] **P0-1** Nyalakan **leaked password protection** (HaveIBeenPwned) di Supabase Auth dashboard.
  - ⚠️ BUTUH USER: tidak ada MCP tool untuk toggle ini. Dashboard → Authentication → Policies/Password → aktifkan "Leaked password protection".
  - Verify: jalankan `get_advisors security` → WARN `auth_leaked_password_protection` hilang.
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

- [ ] **P5DB-1** Rate limiting di API publik (`/api/track`, `/api/admin/*`).
- [ ] **P5DB-2** Security headers (CSP, HSTS) di `next.config`.
- [ ] **P5DB-3** Monitoring/alert (login gagal beruntun, lonjakan akses).

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
  - [ ] restaurant (INK dual-role bg+teks light/dark — terakhir, paling tricky).
- [ ] **F2-3** Sinkronkan swatch `website-variants.ts` dgn palet renderer nyata (sekolah ✅).
- [ ] **F2-4** Verify tiap variant render beda nyata (e2e flip variant di DB, restore setelah).

## Fase F3 — Konten dari Data Nyata (GAP 4.1)

> **Jalur default = TANPA Claude API (nol opex).** F3-1 + F3-2 sudah cukup buat hasil layak jual. F3-3 (LLM) OPSIONAL, ditunda jadi upgrade premium.

- [ ] **F3-1** `generateContent` isi template pakai briefing nyata (nama bisnis, layanan, kota) — bukan placeholder generik.
- [ ] **F3-2** **Template varian** (jalan tengah, NOL OPEX): tiap industri punya 3–4 versi copy, bukan 1. Pilih berdasarkan variant klien (luxury→formal, energetic→semangat) atau rotasi. Bikin hasil terasa hidup tanpa seragam, tanpa API.
- [ ] **F3-3** *(OPSIONAL — ADA opex ~ribuan/order, BUKAN jalur default)* LLM polish copy via Claude API server-side. **Flag-gated, default OFF.** Nyalakan cuma untuk hasil premium / klien bayar lebih. Bisa on/off tanpa ubah arsitektur — F3-1+F3-2 tetap fallback kalau flag off.

## Fase F4 — Layout Beda (GAP 3)

Token-pack saat ini cuma re-skin. Tambah layout arketipe.

- [ ] **F4-1** Tambah field `layout` ke `TokenPack` (hero-style, section-order, card-grid).
- [ ] **F4-2** `TokenDrivenRenderer` baca `layout` → ubah susunan, bukan cuma CSS var.
- [ ] **F4-3** 2–3 layout arketipe: luxury (split hero, serif, whitespace) / energetic (fullbleed, bold) / minimal (center, tipis).

## Fase F5 — Robustness Produk (GAP 5)

- [ ] **F5-1** Preview sebelum publish (admin lihat hasil build sebelum live).
- [ ] **F5-2** Rollback/versi (balik ke versi sebelum kalau build salah).
- [ ] **F5-3** Self-edit klien (ganti teks/gambar sendiri).
- [ ] **F5-4** Test suite render (snapshot tiap theme+variant) di CI.

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
| 2026-06-04 | P0-1 | — | ⏳ user | toggle leaked-pw protection di dashboard (tak ada MCP tool) |
| 2026-06-04 | F1-1..F1-4 | feat/f1-build-order | ✅ done | otomatisasi build_order: generateContent+templates+API+tombol; e2e klinik verified, idempoten |
