import { supabaseAdmin } from '@/lib/supabase-admin'

// ============================================================
// Terapkan snapshot katalog Portal → catalog_mirror WB (BAKSO_PORTAL_CONTRACT.md §4.2).
// Dipakai oleh dua jalur sync (shape envelope identik { tenant_slug, mode, products[] }):
//   - PUSH  : POST /api/sync/catalog (Portal kirim saat reserve/consume)
//   - PULL  : GET  /api/cron/reconcile-catalog (cron tarik full = jaring pengaman §4.4)
// mode:full → pack absen di-nonaktifkan (is_active=false, TAK dihapus); mode:delta →
// upsert saja. Storefront memfilter is_active=true.
// ============================================================

export interface SyncPack {
  pack_id: string
  pack_nama: string
  berat_gram?: number | null
  harga: number
  avail_status: string
}
export interface SyncProduct {
  product_id: string
  nama: string
  kategori?: string | null
  deskripsi?: string | null
  foto_url?: string | null
  is_active?: boolean
  packs: SyncPack[]
}
export interface CatalogSnapshot {
  tenant_slug?: string
  mode?: string
  products?: SyncProduct[]
}

export type ApplyResult =
  | { ok: true; upserted: number; deactivated: boolean }
  | { ok: false; error: 'invalid_payload' | 'db_error'; detail?: string }

/**
 * Upsert snapshot ke catalog_mirror (idempotent, onConflict tenant_slug,pack_id).
 * mode:full juga menonaktifkan pack milik tenant yang tak hadir di snapshot.
 */
export async function applyCatalogSnapshot(snapshot: CatalogSnapshot): Promise<ApplyResult> {
  const tenant = snapshot?.tenant_slug
  const mode = snapshot?.mode === 'full' ? 'full' : 'delta'
  const products = snapshot?.products
  if (!tenant || !Array.isArray(products)) {
    return { ok: false, error: 'invalid_payload' }
  }

  const now = new Date().toISOString()
  const rows: Record<string, unknown>[] = []
  const pushedPackIds: string[] = []
  for (const p of products) {
    if (!p?.product_id || !Array.isArray(p.packs)) continue
    const productActive = p.is_active !== false
    for (const pk of p.packs) {
      if (!pk?.pack_id) continue
      pushedPackIds.push(pk.pack_id)
      rows.push({
        tenant_slug: tenant,
        product_id: p.product_id,
        product_nama: p.nama,
        kategori: p.kategori ?? null,
        deskripsi: p.deskripsi ?? null,
        foto_url: p.foto_url ?? null,
        pack_id: pk.pack_id,
        pack_nama: pk.pack_nama,
        berat_gram: pk.berat_gram ?? null,
        harga: pk.harga,
        avail_status: pk.avail_status ?? 'tersedia',
        is_active: productActive,
        synced_at: now,
      })
    }
  }

  if (rows.length > 0) {
    const { error } = await supabaseAdmin.from('catalog_mirror').upsert(rows, { onConflict: 'tenant_slug,pack_id' })
    if (error) {
      console.error('[catalog-mirror] upsert error:', error.message)
      return { ok: false, error: 'db_error', detail: error.message }
    }
  }

  let deactivated = false
  if (mode === 'full') {
    let q = supabaseAdmin.from('catalog_mirror').update({ is_active: false, synced_at: now }).eq('tenant_slug', tenant)
    if (pushedPackIds.length > 0) q = q.not('pack_id', 'in', `(${pushedPackIds.join(',')})`)
    const { error } = await q
    if (error) console.error('[catalog-mirror] deactivate-absent error:', error.message)
    else deactivated = true
  }

  return { ok: true, upserted: rows.length, deactivated }
}
