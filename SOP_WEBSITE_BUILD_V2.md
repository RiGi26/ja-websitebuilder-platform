# SOP — Pembuatan Website Klien (v2)

**Model:** Shared Multi-Tenant (1 Supabase DB) + **Hybrid** (Studio-built, Customer-editable data). Berlaku sejak 2026-05-29, diperbarui 2026-06-01. Menggantikan `SOP_CUSTOM_BUILD.md` (single-tenant, DEPRECATED).

---

## Prinsip Inti

1. **Satu DB, banyak tenant.** Semua klien di 1 project Supabase. Isolasi via `tenant_id` + RLS (`get_tenant_id()` dari JWT `app_metadata`).
2. **Hybrid (studio + customer).** Tim JapanArena **merakit struktur & desain** website (service role, panel admin). Setelah publish, **customer login ke Client Portal** untuk mengelola **DATA bisnisnya sendiri** (lihat Matriks Editabilitas). Akun customer dibuat OTOMATIS saat provisioning.
3. **Add-on = feature flag.** Variasi fitur lewat `landing_pages.konfigurasi.features` (JSONB).
4. **Konten via section.** Halaman = kumpulan `page_sections` (tipe_komponen + isi_komponen JSONB).
5. **Desain custom, BUKAN template.** Rancang desain pakai skill frontend design (lihat Tema). Hindari template generik seragam.

---

## Matriks Editabilitas — Siapa Boleh Edit Apa

> Aturan emas: **customer edit DATA & profil bisnis; studio pegang STRUKTUR, DESAIN, & copywriting utama.**

### 🟢 CUSTOMER-editable (via Client Portal)

**Data bisnis (tabel add-on + panel portal):**

| Fitur | Flag | Tabel | Status panel |
|---|---|---|---|
| Produk (toko) | `hasCart` | `products` | ✅ |
| Pesanan toko | `hasCart` | `shop_orders` | ✅ |
| Layanan (booking) | `hasBooking` | `services` | ✅ |
| Reservasi | `hasBooking` | `bookings` | ✅ |
| Menu (resto) | `hasMenu` | `menu_items` | ⬜ dibangun |
| Blog / Artikel | `hasBlog` | `blog_posts` | ⬜ panel belum (tabel ada) |
| Membership | `hasMembership` | `memberships` | ⬜ dibangun |
| Kelas / LMS | `hasLMS` | `courses`, `enrollments` | ⬜ dibangun |
| Lowongan / Career | `hasCareer` | `job_posts` | ⬜ dibangun |

**Profil bisnis & integrasi (customer isi sendiri):**

| Item | Flag |
|---|---|
| Galeri foto | `hasGallery` |
| Kontak, Jam buka, Alamat, Peta | `hasContactForm`, `hasMap` |
| Email bisnis | `hasEmail` |
| Nomor WhatsApp | `hasWhatsApp` |
| Ongkir | `hasShipping` |
| Delivery (GoFood/GrabFood) | `hasDelivery` |
| Newsletter | `hasNewsletter` |
| Kredensial pembayaran (Midtrans key) | `hasPayment` | ✅ (panel Pembayaran) |

### 🔵 STUDIO-managed (tidak diedit customer)

- **Tema visual & desain** (renderer per industri, branding: warna/logo/font).
- **Tata letak & urutan section**, hero, about, copywriting utama.
- **SEO meta** (`hasSEO`), **Multi-bahasa** (`hasMultiLang`), **Analytics/Pixel** (`hasAnalytics`), **Live chat** (`hasLiveChat`).

> Catatan implementasi: data galeri & profil bisnis (kontak/jam/alamat/peta/WA/email/ongkir/delivery/newsletter) dipindah dari `page_sections.isi_komponen` (struktur, studio) ke penyimpanan **customer-editable** (tabel profil/galeri) agar bisa diedit di portal tanpa memberi kendali struktur. Studio tetap menentukan PENEMPATAN section-nya.

---

## Alur Pembuatan (per order)

1. **Order masuk** → row di `orders` (form `/order`).
2. **Provisioning** (panel admin / API `POST /api/admin/tenants`): buat `tenants` + `landing_pages` (draft) + set `orders.tenant_id` + **akun login customer otomatis** (`createClientAccountForTenant`).
3. **Rakit desain & struktur**: pilih/atur tema (`branding.theme`), tambah `page_sections`, set `konfigurasi.features` & `branding`. Rancang custom (bukan template).
4. **Isi data awal**: studio boleh seed contoh (produk/menu/layanan) lalu customer revisi sendiri.
5. **Publish**: `status` → `published`. Live di `/{slug}`.

---

## Tema Visual (multi-tema)

- `konfigurasi.branding.theme` memilih renderer di `src/app/[slug]/page.tsx`.
- `restaurant` → `RestaurantRenderer` (bespoke). Default (tanpa theme) → `SectionRenderer` generik.
- Tambah industri baru = tulis renderer bespoke baru + set `branding.theme`. Konten tetap dari `page_sections` (editable), hanya tampilan beda.

---

## Pola Membangun Fitur Customer-Editable Baru

Tiap fitur data baru mengikuti pola yang SAMA (lihat `products`/`services` sebagai acuan):
1. **Tabel** `tenant_id` + `page_id` + kolom data + `is_active`/`urutan` + RLS (public read published-or-own; tenant insert/update/delete dgn cek kepemilikan halaman; tulis sensitif server-only).
2. **Fetch** di `src/lib/supabase/addons.ts` + render di renderer terkait.
3. **Panel portal** di `PortalDashboard.tsx` (tab baru, muncul saat flag aktif).
4. **Uji isolasi RLS** (transaksi-rollback) + `get_advisors`.

---

## Catatan Penting

- **Auth admin**: cookie `ja_admin_session` (HMAC, `src/lib/admin-auth.ts`).
- **Auth customer**: Supabase Auth, `app_metadata.tenant_id`; portal di `/portal`.
- **Slug**: unik, pola `^[a-z0-9]+(-[a-z0-9]+)*$` (`slugify`).
- **RLS**: setiap tabel add-on WAJIB ada policy + uji isolasi.
- **DDL**: lewat MCP `apply_migration`, lalu `get_advisors`.
- **Deploy**: PR → merge ke `master` → Vercel auto-deploy.
- **Pembayaran**: kredensial Midtrans per-tenant (terenkripsi), uang ke rekening klien; harga selalu dihitung ulang server-side.

---

## Status Implementasi (2026-06-01)

- ✅ DB fondasi + provisioning + editor admin + akun customer otomatis.
- ✅ Rendering publik `/{slug}` + multi-tema (generik + `restaurant`).
- ✅ Customer-editable LIVE: Produk, Pesanan, Layanan, Reservasi, Pembayaran.
- ✅ E-commerce (checkout + Snap per-tenant) & Booking berbayar (DP) LIVE.
- ⬜ Customer-editable BERIKUTNYA (point B): **Menu**, Blog, Membership, LMS, Career.
- ⬜ Profil bisnis & galeri editable (reklasifikasi dari studio → customer): Galeri, Kontak/Jam/Alamat/Peta, Email, WA, Ongkir, Delivery, Newsletter.
