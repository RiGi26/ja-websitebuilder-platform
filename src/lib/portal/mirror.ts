import { supabaseAdmin } from '@/lib/supabase-admin'
import type { PortalCatalogItem, AvailStatus } from './types'

// ============================================================
// Baca catalog_mirror (WB-lokal) untuk storefront cutover portal (contract §3/§11).
// Server-only: mirror tanpa akses anon (§8) → service-role. Storefront WAJIB filter
// is_active=true (full-sync menonaktifkan, tak menghapus). Urut kategori lalu harga.
// ============================================================
export async function fetchCatalogMirror(tenantSlug: string): Promise<PortalCatalogItem[]> {
  const { data, error } = await supabaseAdmin
    .from('catalog_mirror')
    .select('pack_id, product_nama, kategori, deskripsi, foto_url, harga, avail_status')
    .eq('tenant_slug', tenantSlug)
    .eq('is_active', true)
    .order('kategori', { ascending: true, nullsFirst: false })
    .order('harga', { ascending: true })
  if (error) {
    console.error('fetchCatalogMirror:', error.message)
    return []
  }
  return (data ?? []).map((r) => ({
    pack_id: r.pack_id as string,
    product_nama: r.product_nama as string,
    kategori: (r.kategori as string | null) ?? null,
    deskripsi: (r.deskripsi as string | null) ?? null,
    foto_url: (r.foto_url as string | null) ?? null,
    harga: Number(r.harga) || 0,
    avail_status: (r.avail_status as AvailStatus) ?? 'tersedia',
  }))
}
