# Standard Operating Procedure (SOP): Custom Build Engine

> ⚠️ **DEPRECATED (2026-05-29).** Dokumen ini memakai model **single-tenant** (1 klien = 1 project Supabase) yang **tidak lagi dipakai**. Acuan resmi sekarang adalah **`SOP_WEBSITE_BUILD_V2.md`** (shared multi-tenant + studio-managed). File ini dipertahankan hanya sebagai referensi, dan tetap relevan **HANYA** untuk kasus pengecualian "jual-putus source code" ke klien.

## Filosofi Arsitektur
Proyek "Rakit Website" (Custom Build) yang dijual melalui Kalkulator di `ja-corp-landing` menggunakan pendekatan **Single-Tenant Modular Architecture**. 
Artinya: **1 Klien = 1 Project Supabase = 1 Vercel Deployment.**

Untuk mencapai efisiensi waktu development maksimal (High Margin), tim IT **TIDAK DIPERKENANKAN** melakukan *coding* dari nol untuk setiap klien baru. Semua pesanan Custom Build **WAJIB** menggunakan repositori `ja-websitebuilder-platform` sebagai fondasi (Boilerplate).

---

## Peran `ja-websitebuilder-platform`
Repositori ini BUKAN sebuah *drag-and-drop website builder* (seperti Elementor/Wix), melainkan sebuah **Modular Boilerplate** yang dikendalikan oleh *Feature Flags* (Saklar Fitur).

Semua fitur *Add-on* (Keranjang, Checkout, Blog, SEO, Booking) sudah ter-*coding* di dalam repo ini. Tim IT hanya bertugas menghidupkan/mematikan saklar sesuai dengan struk pembayaran klien.

---

## Alur Kerja Deployment (SOP)

### 1. Persiapan Database (Supabase)
*   Buat Project baru di bawah *Organization* **Japan Arena Corp** di Supabase. (Jangan buat akun email baru).
*   Jalankan *script* inisialisasi dasar yang ada di `ja-websitebuilder-platform/supabase_setup.sql`.
*   Jalankan *script* tabel tambahan hanya untuk fitur yang dibeli klien (misal: jalankan `table_blog.sql` jika klien beli add-on Blog).

### 2. Kloning & Konfigurasi Kode
*   Lakukan *Clone* / Fork repo `ja-websitebuilder-platform` untuk klien tersebut (misal menjadi repo: `client-toko-kue-budi`).
*   Buka file konfigurasi utama (misal `src/config/site.ts` atau `ja-config.ts`).
*   Nyalakan *Feature Flags* sesuai pesanan. Contoh:
    ```typescript
    export const CLIENT_CONFIG = {
      template: 'ecommerce-basic',
      features: {
        hasBlog: false,
        hasSEO: true,
        hasCart: true,
        hasBooking: false,
      },
      branding: {
        colors: { primary: '#FF5733' },
        logo: '/assets/logo-budi.png'
      }
    }
    ```

### 3. Penyesuaian Visual (Theming)
*   Sistem dalam *boilerplate* harus sudah dirancang agar warna utama (Primary Color), tipografi, dan *assets* (logo) bisa berubah secara dinamis berdasarkan `CLIENT_CONFIG` di atas, tanpa harus merubah CSS secara manual di ratusan *file*.

### 4. Deployment (Vercel)
*   Hubungkan repo klien (`client-toko-kue-budi`) ke Vercel.
*   Masukkan *Environment Variables* (URL & Anon Key Supabase klien).
*   Hubungkan *Custom Domain* klien.

---

## Golden Rules untuk Tim IT (Developer)

1. **Strict Isolation:** Dilarang keras menggabungkan 2 klien Custom ke dalam 1 *database* Supabase. Ini akan merusak kontrak *Single-Tenant* dan menyulitkan proses *Handover* (Serah Terima) jika klien ingin membeli putus *source code*.
2. **Push to Core:** Jika klien Custom meminta fitur baru yang belum ada di *boilerplate* dan Anda rasa fitur itu bagus untuk dijual ke klien lain, *coding*-lah fitur tersebut di repo klien, **lalu *merge* kembali (Push) fitur tersebut ke repo induk `ja-websitebuilder-platform`** dan buatkan *Feature Flag*-nya.
3. **No Dead Code Execution:** Pastikan kode fitur yang saklarnya dimatikan (false) tidak ikut ter-*load* ke *browser* pengunjung (gunakan *Dynamic Imports* atau *Conditional Rendering* yang ketat) agar *website* klien tetap cepat (A+ Lighthouse Score).
