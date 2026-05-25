-- Migrasi untuk mendukung fitur Self-Service Upgrade ala Rumahweb
-- Tambahkan kolom type untuk membedakan pesanan baru dan upgrade fitur
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS type text DEFAULT 'new'; -- 'new', 'upgrade'

-- Tambahkan kolom domain untuk mencatat alamat website yang sudah aktif
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS domain text;

-- Tambahkan kolom parent_order_id untuk menghubungkan upgrade ke pesanan utama
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS parent_order_id uuid REFERENCES public.orders(id);

-- Buat index untuk mempercepat pencarian domain
CREATE INDEX IF NOT EXISTS idx_orders_domain ON public.orders(domain);

-- Tambahkan komentar untuk dokumentasi developer
COMMENT ON COLUMN public.orders.type IS 'Tipe pesanan: new (pesanan website baru) atau upgrade (penambahan fitur)';
COMMENT ON COLUMN public.orders.domain IS 'Domain website yang sudah aktif (untuk tipe upgrade)';
COMMENT ON COLUMN public.orders.parent_order_id IS 'ID pesanan utama jika tipe pesanan adalah upgrade';
