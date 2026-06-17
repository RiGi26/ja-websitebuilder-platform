-- ============================================================
-- F&B Pre-Order — hardening anon SELECT pada menu_items.
--
-- JALANKAN SETELAH kode kolom-eksplisit (fetchMenuItemsByPage tanpa hpp/stok)
-- sudah DEPLOY ke produksi. Jika dijalankan sebelum itu, situs resto live yang
-- masih `select('*')` via anon akan error (permission denied for column hpp).
--
-- Tujuan: hpp (biaya/cost) & stok_harian TIDAK boleh terbaca anon (anon key
-- publik bisa query PostgREST langsung). authenticated (owner) tetap penuh.
-- ============================================================

revoke select on public.menu_items from anon;
grant select (
  id, tenant_id, page_id, kategori, nama, deskripsi, harga,
  gambar_url, is_active, urutan, created_at, updated_at, is_sold_out
) on public.menu_items to anon;
