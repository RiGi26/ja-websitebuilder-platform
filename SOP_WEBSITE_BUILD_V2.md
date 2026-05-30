# SOP Pembuatan Website V2 — Shared Multi-Tenant (Studio-Managed)

> **Status:** AKTIF (berlaku mulai 2026-05-29). Menggantikan `SOP_CUSTOM_BUILD.md` (DEPRECATED).

## 1. Filosofi Arsitektur

Berbeda dengan SOP lama (1 klien = 1 project Supabase), model resmi sekarang adalah **Shared Multi-Tenant**:

> **Semua website klien tinggal di 1 project Supabase & 1 deployment Vercel**, dipisahkan secara aman per-klien lewat `tenant_id` + Row Level Security (RLS).

- **3 klien atau 3.000 klien → jumlah tabel TETAP.** Yang bertambah hanya jumlah baris.
- Isolasi antar-klien sudah divalidasi (uji RLS 11/11 lulus, 2026-05-29): klien tak bisa membaca/ubah/hapus data klien lain.
- Variasi add-on **tidak** membuat tabel/schema baru per klien — diatur lewat **feature flag** + **tabel add-on bersama**.

**Pengecualian:** Hanya jika klien membeli "jual-putus source code", barulah dibuat project terpisah (prosedur handover terpisah — belum aktif).

## 2. Model Operasi: Studio-Managed

Tim JapanArena yang merakit & mengelola website klien lewat **panel admin** (memakai *service role* yang bypass RLS). **Belum ada login mandiri untuk klien** (self-service). Fondasi RLS sudah siap bila kelak fitur login klien dibuka.

## 3. Struktur Data Inti

| Tabel | Isi |
|-------|-----|
| `tenants` | 1 baris = 1 klien. Link ke `orders.id` asal. Dikelola service role. |
| `landing_pages` | 1 baris = 1 website. `tenant_id`, `slug`, `tipe_industri`, `status`, `data_konten` (JSONB konten), `konfigurasi` (JSONB feature flag + branding). |
| `page_sections` | 1 baris = 1 blok section. `tipe_komponen` + `isi_komponen` (JSONB). |
| Tabel add-on (`products`, `blog_posts`, `bookings`, …) | Dibuat saat add-on mulai dijual. Bersama semua klien, dipisah `tenant_id` + RLS. |

## 4. Konvensi Feature Flag (`landing_pages.konfigurasi`)

```jsonc
{
  "features": {
    "hasCart": true,      // toko online → tabel products
    "hasBlog": false,     // blog       → tabel blog_posts
    "hasBooking": true,   // reservasi  → tabel bookings
    "hasGallery": true,
    "hasSEO": true,
    "hasContactForm": true,
    "hasMap": false
  },
  "branding": { "primary": "#FF5733", "logo_url": "/...", "font": "Inter" }
}
```
Tipe TypeScript: `KonfigurasiWebsite` di `src/types/websitebuilder.ts`. Nyalakan flag sesuai add-on di struk order. Kode rendering hanya memuat komponen yang flag-nya `true`.

## 5. Alur Pembuatan Website (per order)

1. **Order masuk** (dari `ja-corp-landing` → checkout `ja-websitebuilder`). Lihat baris di tabel `orders`.
2. **Provisioning** (panel admin): buat `tenants` row dari data order → buat `landing_pages` row awal (`slug`, `tipe_industri` dari `order.industri`, `konfigurasi.features` dari add-on order) → set `orders.tenant_id`.
3. **Rakit konten**: isi `data_konten` + tambah `page_sections` (hero, about, layanan, dll) dari materi klien.
4. **Aktifkan add-on**: nyalakan feature flag; isi tabel add-on (`products`/`blog_posts`/…) bila perlu.
5. **Publish**: set `status = 'published'`. Website tampil di `/<slug>` (atau `domain_custom`).
6. **Serahkan URL** ke klien (kolom `orders.delivered_url`).

## 6. Yang Dibutuhkan dari Klien/Anda (tidak bisa dikarang sistem)
- Materi konten: logo, warna brand, teks, foto, daftar produk.
- Pilihan domain.

## 7. Aksi yang HARUS Dilakukan Manual oleh Tim (tidak otomatis)
- **Midtrans production switch** (uang asli + daftar webhook di dashboard Midtrans).
- **Fonnte** reconnect device (scan QR) bila notif WA mati.
- **Backup/PITR** & upgrade tier Supabase (Pro/Enterprise) di dashboard.
- **DNS** custom domain klien (di Vercel + registrar).

## 8. Aturan Emas
1. **Jangan** membuat tabel/schema baru per klien. Add-on baru = 1 tabel bersama (terkontrol), sekali.
2. **Selalu** sertakan `tenant_id` di setiap baris data klien + pastикан RLS aktif. Jalankan `get_advisors` setiap selesai DDL.
3. DDL lewat MCP `apply_migration` (bukan copy-paste manual di SQL editor) agar tercatat di migrations.
4. Service role HANYA di server (route handler/admin). Jangan pernah expose ke bundle client.
