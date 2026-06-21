import { NextResponse } from 'next/server'
import { verifySignedRequest, SIG_HEADERS } from '@/lib/portal/sign'
import { consumeIngestNonce } from '@/lib/portal/ingest-nonce'
import { applyCatalogSnapshot, type CatalogSnapshot } from '@/lib/portal/catalog-mirror'

// ============================================================
// WB INGEST — POST /api/sync/catalog (BAKSO_PORTAL_CONTRACT.md §4.2). Portal push
// katalog+stok → upsert catalog_mirror. HMAC WB_INGEST_SECRET (§8) + nonce store.
// Logika upsert/deactivate dibagi dgn cron reconcile via applyCatalogSnapshot().
// ============================================================
export const dynamic = 'force-dynamic'

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

  let body: CatalogSnapshot
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 })
  }

  const result = await applyCatalogSnapshot(body)
  if (!result.ok) {
    const status = result.error === 'invalid_payload' ? 400 : 500
    return NextResponse.json({ ok: false, error: result.error === 'invalid_payload' ? 'invalid_payload' : 'server_error' }, { status })
  }
  return NextResponse.json({ ok: true, upserted: result.upserted })
}
