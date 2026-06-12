# Rencana: E-Commerce (Checkout + Pembayaran) untuk Website Klien

## Keputusan arsitektur (disepakati 2026-05-31)
- **Aliran uang: akun Midtrans KLIEN sendiri.** Tiap tenant simpan kredensial Midtrans-nya (server key + client key) terenkripsi per-tenant. Uang pembeli **langsung ke rekening klien** — studio tidak pernah memegang dana (bebas risiko legal/pajak/cashflow). Nilai jual: "pembayaran langsung masuk ke rekening Anda".
- Pakai-ulang pola Midtrans Snap + webhook + verifikasi signature yang SUDAH ada di `/api/payment/*` (dipakai untuk DP order). Bukan dari nol.
- Konsisten dgn arsitektur: shared multi-tenant, RLS isolasi via `get_tenant_id()`, studio-managed + Client Portal.

---

# TAHAP 1 — E-Commerce untuk industri Toko Online

## Stage 1.1 — Skema DB pesanan toko (shop orders)
Tabel bersama multi-tenant (pola sama seperti `products`):
- **`shop_orders`**: id, tenant_id, page_id, midtrans_order_id (unik), pembeli (nama, hp, email, alamat), subtotal, ongkir, total, status (pending/paid/processing/shipped/done/cancelled), payment_status, catatan, created_at, updated_at.
- **`shop_order_items`**: id, shop_order_id, product_id (snapshot nama+harga saat beli), qty, harga_satuan, subtotal.
- **`tenant_payment_config`**: tenant_id (pk), midtrans_server_key (ENKRIPSI), midtrans_client_key, midtrans_is_production (bool), is_active. RLS: service-role only (rahasia, tak pernah ke klien-side).
- Kurangi stok `products.stok` saat order dibayar (opsional, bisa Stage lanjut).
- RLS: shop_orders/items → SELECT+UPDATE tenant sendiri (klien lihat pesanan tokonya di portal); INSERT publik terbatas via server route (pembeli anonim tak boleh tulis langsung). Uji isolasi seperti biasa.

## Stage 1.2 — Enkripsi & simpan kredensial Midtrans klien
- Util enkripsi (AES-256-GCM, key dari env `PAYMENT_ENC_SECRET`) — server key klien tak boleh plaintext di DB.
- API admin/portal: klien input Midtrans server+client key → simpan terenkripsi ke `tenant_payment_config`.
- Helper `getTenantMidtrans(tenantId)` (server-only, dekripsi) untuk dipakai route checkout.

## Stage 1.3 — Keranjang belanja (frontend toko publik)
- State keranjang di `localStorage` (per-website, key di-scope slug). Tambah/kurang qty, hapus.
- Komponen `product_list` (sudah ada) + tombol "Tambah ke Keranjang". Drawer keranjang + ringkasan.
- Halaman `/[slug]/cart` & `/[slug]/checkout` (form data pembeli + alamat).
- Hanya aktif jika `konfigurasi.features.hasCart` true.

## Stage 1.4 — Route checkout + Snap pakai kredensial klien
- `POST /api/shop/checkout` (server): validasi item & harga dari DB (jangan percaya harga dari client!), hitung total, buat `shop_orders`+items (status pending), panggil Snap pakai **server key KLIEN** (dari `getTenantMidtrans`), return snap token/redirect.
- `POST /api/shop/webhook` (atau per-tenant routing): verifikasi signature pakai server key klien → update `shop_orders.payment_status`. Catatan: webhook URL per akun Midtrans klien diatur di dashboard Midtrans masing-masing (aksi klien, didokumentasikan).
- Halaman status/terima kasih pesanan untuk pembeli.

## Stage 1.5 — Manajemen pesanan di Portal Customer
- Tab "Pesanan" di `/portal`: klien lihat pesanan masuk, ubah status (proses/kirim/selesai), lihat detail pembeli & item.
- Notifikasi opsional (WA/email) — pakai Fonnte yang sudah ada (Stage lanjut).

## Stage 1.6 — Uji & rilis
- Uji checkout end-to-end pakai Midtrans SANDBOX milik tenant uji (batik).
- Uji isolasi RLS shop_orders. Advisor check. Merge bertahap + review.

## Di luar cakupan Tahap 1
- Ongkir real-time (RajaOngkir/Komerce) — bisa add-on terpisah.
- Varian produk (size/warna), voucher/diskon, multi-kurir — Stage lanjut.
- Stok otomatis lintas channel.

---

# TAHAP 2 — Perluas E-Commerce ke industri lain (rencana awal)

Pola Tahap 1 (checkout + payment per-tenant + portal pesanan) dipakai ulang, **disesuaikan jenis "transaksi" tiap industri**:

## 2A. Klinik / Jasa / Salon — **Booking berbayar**
- Tabel `bookings` (sudah ada) + pembayaran DP/booking fee via Snap klien.
- Pembeli pilih layanan + jadwal → bayar booking fee → status di portal klien.
- Reuse: checkout route, payment config, portal "Pesanan" → jadi "Reservasi".

## 2B. Restoran / Kafe — **Pesan makanan / menu digital**
- Tabel `menu_items` (pola `products`) + `shop_orders` reuse untuk pesanan.
- QR menu per meja (opsional), pesan + bayar / bayar di kasir.

## 2C. Sekolah / LMS — **Pembayaran kelas / pendaftaran**
- Tabel `courses` + `enrollments` + pembayaran via Snap klien.
- Akses materi setelah bayar (gate konten) — lebih kompleks, Stage tersendiri.

## 2D. Properti / Rental — **Listing + booking/DP**
- Tabel `listings` (pola `products`) + inquiry/DP via checkout.

## Prinsip Tahap 2
Setiap industri = **duplikasi pola** (tabel data + checkout + portal), bukan sistem baru. Dibuat **saat add-on industri itu dijual**, bukan sekaligus. Engine pembayaran (kredensial per-tenant + Snap + webhook) dibangun sekali di Tahap 1, dipakai semua industri.

---

## Catatan keamanan & legal (berlaku semua tahap)
- Server key Midtrans klien WAJIB terenkripsi (AES-256-GCM), tak pernah dikirim ke browser.
- Harga & total SELALU dihitung ulang di server dari DB (cegah manipulasi harga dari client).
- Webhook selalu verifikasi signature; return 200 agar Midtrans tak retry.
- Studio tidak memegang dana → tak ada kewajiban escrow/PPN atas transaksi klien.
- Setiap DDL → advisor check + uji isolasi RLS (pola transaksi-rollback).
