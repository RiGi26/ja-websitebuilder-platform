# Program Mitra — Alur Sistem (Referensi Developer)

> Referensi teknis internal. Dibangun di PR #124 (websitebuilder) + PR #56
> (corp-landing). Migration: `supabase/add_referral_system.sql` (sudah applied).

---

## 1. Gambaran Arsitektur

```
MITRA                    CALON CUSTOMER                      SISTEM
  │                            │                                │
  │ bagikan /r/KODE            │                                │
  ├───────────────────────────>│                                │
  │                            │ GET /r/KODE (builder)          │
  │                            ├───────────────────────────────>│ set cookie ja_ref (30 hari)
  │                            │<─ redirect japanarena.com/?ref=KODE
  │                            │                                │
  │                            │ landing (static export)        │
  │                            │   RefCapture.tsx ──────────────│ localStorage ja_ref + ja_ref_ts
  │                            │                                │
  │                            │ /seluruh-layanan → CTA order   │
  │                            │   href .../order?...&ref=KODE  │
  │                            │                                │
  │                            │ /order (builder)               │
  │                            │   prefill: ?ref → cookie ja_ref│
  │                            │   validasi: POST /api/referral/validate (debounce 450ms)
  │                            │   tampil: diskon X% + payableTotal
  │                            │                                │
  │                            │ submit → POST /api/payment/create
  │                            │   server VALIDASI ULANG kode   │
  │                            │   hitung ulang diskon (Math.round(gross*pct/100))
  │                            │   tolak self-referral (WA/email == mitra)
  │                            │   insert orders: total_estimasi = NET,
  │                            │     referral_code, referrer_id, referral_discount
  │                            │                                │
  │                            │ bayar DP/lunas via Midtrans Snap
  │                            │                                │
  │   WA "komisi baru" <───────┤ webhook / confirm → createEarningForOrder()
  │   WA "bisa dicairkan" <────┤ webhook -LUNAS → confirmEarningForOrder()
  │                            │                                │
  │ /mitra: ajukan pencairan (≥100k) ──> POST /api/mitra/payout │
  │                            │         klaim earning confirmed (payout_id)
  │   admin dapat WA ──────────┼────────────────────────────────│
  │                            │ admin /admin/mitra → Tandai Dibayar
  │   WA "dana terkirim" <─────┤ earning confirmed → paid       │
```

---

## 2. State Machine Komisi (`referral_earnings.status`)

```
                  (DP dibayar, order < ambang 4jt = full upfront)
                 ┌──────────────────────────────────────────────┐
                 │                                              ▼
  [tidak ada] ──DP dibayar──> pending ──lunas / konfirmasi──> confirmed ──payout dibayar──> paid
                                 │           manual admin         │
                                 └────────── order cancel ────────┘
                                                ▼
                                              void   (earning 'paid' TIDAK PERNAH di-void otomatis)
```

| Transisi | Trigger | Lokasi kode |
|---|---|---|
| ∅ → `pending` | webhook DP paid / confirm polling | `createEarningForOrder()` di `src/lib/referral.ts`, dipanggil dari `api/payment/webhook` (branch DP) **dan** `api/payment/confirm` |
| ∅ → `confirmed` langsung | DP = 100% (dp_amount ≥ total_estimasi) | sama seperti di atas (`fullUpfront`) — order <4jt tak pernah menyentuh `payment_status='lunas'` |
| `pending` → `confirmed` | webhook `-LUNAS` paid | `confirmEarningForOrder()`, dipanggil dari `api/payment/webhook` (branch pelunasan) |
| `pending` → `confirmed` | lunas manual di luar Midtrans | tombol **Konfirmasi** di `/admin/mitra` → `PATCH api/admin/referral-earnings` |
| `pending/confirmed` → `void` | admin set order `cancelled` | `voidEarningForOrder()` di `api/admin/orders` PATCH; atau tombol **Void** (hanya bila `payout_id IS NULL`) |
| `confirmed` → klaim payout | mitra ajukan pencairan | `POST api/mitra/payout` → set `payout_id` (predikat `payout_id IS NULL` = race-safe) |
| `confirmed` → `paid` | admin **Tandai Dibayar** | `PATCH api/admin/referral-payouts` action `paid` |
| klaim dilepas | admin **Tolak** payout | action `rejected` → `payout_id = NULL` (kembali payable) |

**Idempotency**: `referral_earnings.order_id` UNIQUE + upsert
`onConflict:'order_id', ignoreDuplicates:true` → retry webhook Midtrans aman,
notifikasi tidak dobel (notif hanya saat helper melaporkan transisi nyata).

---

## 3. Database (Supabase websitebuilder)

| Tabel | Kolom kunci | Catatan |
|---|---|---|
| `referrers` | `user_id` UNIQUE→auth.users, `commission_percent` (10), `buyer_discount_percent` (5), `bank_*`, `status` active/suspended | suspend = blokir atribusi BARU, komisi lama tetap |
| `referral_codes` | `code` UNIQUE CHECK `^[A-Z0-9]{4,16}$`, `referrer_id` | 1 kode default per mitra (slug nama + 3 acak) |
| `referral_earnings` | `order_id` UNIQUE, `order_total` (NET snapshot), `commission_percent` (snapshot), `amount`, `status`, `payout_id` | snapshot = perubahan % tidak mengubah komisi lama |
| `referral_payouts` | `amount`, `status` requested/paid/rejected, `bank_snapshot` jsonb, `admin_note`, `transfer_proof_url` | bank di-snapshot saat pengajuan |
| `orders` (+kolom) | `referral_code`, `referrer_id`, `referral_discount` | **`total_estimasi` = NET setelah diskon** |

**RLS**: 4 tabel RLS-on, TANPA write policy (semua tulis via service role).
SELECT-own untuk `authenticated` via `referrers.user_id = auth.uid()`
(defense-in-depth; dashboard tetap baca via service role).
`anon_insert_lead` di orders diketatkan: anon tidak bisa set
`referrer_id` / `referral_discount`.

---

## 4. Endpoint API

| Endpoint | Method | Auth | Fungsi |
|---|---|---|---|
| `/api/referral/validate` | POST/GET | publik, rate-limit 30/mnt/IP | `{valid, discountPercent, referrerName}` — tidak pernah bocorkan komisi/kontak |
| `/r/[code]` | GET | publik | set cookie `ja_ref` 30d → redirect landing `?ref=` |
| `/api/payment/create` | POST | publik | + `referral_code` di body; diskon dihitung server |
| `/api/payment/webhook` | POST | signature Midtrans | create/confirm earning + notif mitra |
| `/api/payment/confirm` | POST | publik (polling thank-you) | create earning (race-safe vs webhook) |
| `/api/mitra/payout` | POST | sesi Supabase (mitra) | ajukan pencairan; klaim earning; WA admin |
| `/api/mitra/bank` | POST | sesi Supabase (mitra) | update rekening sendiri |
| `/api/admin/referrers` | GET/POST/PATCH | cookie admin | list+agregat / buat mitra / suspend·activate·reset_password·update_percent |
| `/api/admin/referral-payouts` | GET/PATCH | cookie admin | antrean / paid·rejected |
| `/api/admin/referral-earnings` | GET/PATCH | cookie admin | list / confirm·void |
| `/api/admin/orders` | PATCH | cookie admin | (existing) + void earning saat cancelled |

---

## 5. Peta File

```
src/lib/referral.ts                  ← inti: normalizeCode, lookupActiveCode,
                                        isSelfReferral, create/confirm/voidEarning,
                                        REFERRAL_COOKIE='ja_ref', PAYOUT_MIN=100_000
src/lib/referrer-account.ts          ← buat mitra: referrer + auth user
                                        (app_metadata {referrer_id, role:'referrer'})
                                        + kode default; cleanup on failure
src/lib/fonnte.ts                    ← notifyReferrer() 4 event + template
src/lib/email.ts                     ← mitraWelcomeEmailHtml()
src/app/order/page.tsx               ← field kode + diskon live (formula = server)
src/app/mitra/{login,page,MitraDashboard}  ← dashboard mitra (mirror /portal)
src/app/admin/mitra/{page,AdminMitraClient} ← admin: create/queue/confirm/void
supabase/add_referral_system.sql     ← migration (APPLIED)

ja-corp-landing/app/RefCapture.tsx   ← ?ref → localStorage (30d) — window.location.search,
                                        BUKAN useSearchParams (static export)
ja-corp-landing/app/seluruh-layanan  ← handoff /order?...&ref= (state, hydration-safe)
```

---

## 6. Matrix Notifikasi

| Event | Penerima | Channel | Kapan |
|---|---|---|---|
| `referrer_welcome` | mitra | WA + email | admin buat akun (kredensial juga tampil sekali di admin) |
| `referral_earning_pending` | mitra | WA | DP masuk (earning pending) |
| `referral_earning_confirmed` | mitra | WA | lunas / full-upfront / konfirmasi manual |
| payout requested | **admin** (`NEXT_PUBLIC_WA_NUMBER`) | WA | mitra ajukan pencairan |
| `referral_payout_paid` | mitra | WA | admin Tandai Dibayar |

Semua fire-and-forget (`.catch(console.error)`) — tidak pernah memblokir
webhook/response. Email no-op bila `RESEND_API_KEY` kosong.

---

## 7. Invariant Penting (JANGAN dilanggar saat refactor)

1. **`orders.total_estimasi` = NET** (setelah diskon). Semua math hilir
   (ambang DP 4jt, `payment/retry`, pelunasan) bergantung pada ini.
   `referral_discount` hanya audit; gross = net + discount.
2. **Formula diskon identik client & server**: `Math.round(gross * pct / 100)`.
   Ubah satu = ubah dua (order/page.tsx ↔ payment/create).
3. **`dp_paid` di-set di DUA tempat** (webhook + confirm) → earning HARUS
   selalu dibuat lewat `createEarningForOrder()` (upsert idempotent), jangan
   insert langsung.
4. **Kode invalid tidak pernah memblokir order** — order jalan tanpa diskon.
5. **Self-referral** dicek saat order (WA/email == mitra), bukan saat validate
   (data buyer belum ada) → form bisa tampil "valid" tapi server drop atribusi.
6. **Suspend mitra** = `lookupActiveCode` gagal → atribusi BARU berhenti;
   earning lama tidak disentuh.
7. Earning `paid` tidak pernah di-void; earning ber-`payout_id` harus
   dilepas (tolak payout) sebelum bisa di-void.
8. Order `type='upgrade'` di-skip oleh `createEarningForOrder` (MVP new-only).

---

## 8. Runbook Operasional (Admin)

| Tugas | Caranya |
|---|---|
| Daftarkan mitra baru | `/admin/mitra` → Tambah Mitra (nama, email, WA, %) → kredensial tampil SEKALI + otomatis terkirim WA/email |
| Mitra lupa password | `/admin/mitra` → Reset di baris mitra → kredensial baru tampil sekali |
| Order dilunasi di luar Midtrans (transfer manual) | `/admin/mitra` → tabel Semua Komisi → **Konfirmasi** pada earning pending |
| Bayar komisi | antrean di `/admin/mitra` → transfer manual ke rekening tertera → **Tandai Dibayar** (+catatan no. ref) |
| Tolak pengajuan payout | **Tolak** → earning otomatis kembali ke saldo payable mitra |
| Order batal | ubah status order ke `cancelled` di `/admin` (earning auto-void) |
| Hentikan mitra nakal | `/admin/mitra` → **Suspend** |
| Ubah % komisi/diskon per mitra | `PATCH /api/admin/referrers` action `update_percent` (UI belum ada — via API) |

---

## 9. Konfigurasi & Konstanta

| Apa | Nilai | Lokasi |
|---|---|---|
| Komisi default | 10% | kolom DB `referrers.commission_percent` (default) |
| Diskon buyer default | 5% | kolom DB `referrers.buyer_discount_percent` (default) |
| Minimal payout | Rp 100.000 | `PAYOUT_MIN` di `src/lib/referral.ts` |
| Cookie atribusi | `ja_ref`, 30 hari, bukan httpOnly | `REFERRAL_COOKIE` di `src/lib/referral.ts` |
| Format kode | `^[A-Z0-9]{4,16}$` | CHECK DB + `normalizeCode()` + RefCapture |
| Rate limit validate | 30/menit/IP | `api/referral/validate` |
| WA admin | `NEXT_PUBLIC_WA_NUMBER` (fallback 6281296917963) | payout route |
| Redirect /r | `NEXT_PUBLIC_LANDING_URL` (fallback japanarena.com) | `src/app/r/[code]/route.ts` |

Tidak ada env var baru yang wajib.

---

## 10. Checklist UAT (sandbox Midtrans)

1. Buat mitra dari `/admin/mitra` → login `/mitra/login` jalan, WA/email kredensial masuk.
2. `/r/KODE` → redirect landing `?ref=`, cookie `ja_ref` ada di domain builder.
3. Order ≥4jt (net) pakai kode → diskon tampil → bayar DP (kartu sandbox `4811 1111 1111 1114`) → earning `pending`, WA mitra masuk; **replay webhook** → tetap 1 earning.
4. Pelunasan dari `/track` → earning `confirmed`, WA "bisa dicairkan".
5. Order <4jt pakai kode → langsung `confirmed`.
6. Order pakai WA/email mitra sendiri → sukses TANPA diskon, `referrer_id` null.
7. Cancel order dari admin → earning `void`.
8. `/mitra`: saldo benar, ajukan payout → WA admin; admin Tandai Dibayar → earning `paid` + WA mitra; Tolak → saldo kembali.
9. Regresi: order TANPA kode end-to-end identik dengan sebelum fitur.
10. Cross-app: `japanarena.com/?ref=KODE` → localStorage → CTA configurator bawa `&ref=` → form prefill.

Fase 2 (belum dibangun): klik analytics, self-registration, tiered rate,
komisi upgrade/renewal/subscription, upload bukti transfer payout.
