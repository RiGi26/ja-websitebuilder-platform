import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifySignedRequest, SIG_HEADERS } from '@/lib/portal/sign'
import { consumeIngestNonce } from '@/lib/portal/ingest-nonce'

// ============================================================
// WB INGEST — POST /api/sync/catalog (BAKSO_PORTAL_CONTRACT.md §4.2). Portal push
// katalog+stok → upsert catalog_mirror. HMAC WB_INGEST_SECRET (§8) + nonce store.
// mode:full → pack absen di-nonaktifkan (is_active=false, TAK dihapus); mode:delta →
// upsert saja (jangan nonaktifkan yang absen). Storefront filter is_active=true.
// ============================================================
export const dynamic = 'force-dynamic'

interface SyncPack { pack_id: string; pack_nama: string; berat_gram?: number | null; harga: number; avail_status: string }
interface SyncProduct {
  product_id: string; nama: string; kategori?: string | null; deskripsi?: string | null
  foto_url?: string | null; is_active?: boolean; packs: SyncPack[]
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const secret = process.env.WB_INGEST_SECRET
  if (!secret) {
    console.error('[sync/catalog] WB_INGEST_SECRET belum di-set')
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }

  const nonce = request.headers.get(SIG_HEADERS.nonce)
  const verify = verifySignedRequest({
    secret,
    timestamp: request.headers.get(SIG_HEADERS.timestamp),
    nonce,
    signature: request.headers.get(SIG_HEADERS.signature),
    rawBody,
  })
  if (!verify.ok) return NextResponse.json({ ok: false, error: 'bad_signature' }, { status: 401 })
  if ((await consumeIngestNonce(nonce)) !== 'fresh') {
    return NextResponse.json({ ok: false, error: 'bad_signature' }, { status: 401 })
  }

  let body: { tenant_slug?: string; mode?: string; products?: SyncProduct[] }
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 })
  }
  const tenant = body.tenant_slug
  const mode = body.mode === 'full' ? 'full' : 'delta'
  const products = body.products
  if (!tenant || !Array.isArray(products)) {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 })
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
      console.error('[sync/catalog] upsert error:', error.message)
      return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
    }
  }

  // mode:full → nonaktifkan pack yang tak hadir (tak dihapus). delta → tidak.
  if (mode === 'full') {
    let q = supabaseAdmin.from('catalog_mirror').update({ is_active: false, synced_at: now }).eq('tenant_slug', tenant)
    if (pushedPackIds.length > 0) q = q.not('pack_id', 'in', `(${pushedPackIds.join(',')})`)
    const { error } = await q
    if (error) console.error('[sync/catalog] deactivate-absent error:', error.message)
  }

  return NextResponse.json({ ok: true, upserted: rows.length })
}
