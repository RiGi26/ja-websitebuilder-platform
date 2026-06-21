import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { signPayload, newNonce, newTimestamp, SIG_HEADERS } from '@/lib/portal/sign'
import { applyCatalogSnapshot } from '@/lib/portal/catalog-mirror'

// ============================================================
// WB CRON — GET /api/cron/reconcile-catalog (BAKSO_PORTAL_CONTRACT.md §4.4).
// Jaring pengaman drift: tarik snapshot FULL dari Portal GET /api/catalog (signed)
// untuk tiap tenant ber-source_of_truth='portal', lalu terapkan ke catalog_mirror
// (applyCatalogSnapshot, mode:full → nonaktifkan pack absen). Self-heal kalau push
// per-order terlewat / katalog Portal berubah tanpa order.
//
// Dijadwalkan via vercel.json crons. Auth: Vercel mengirim
// `Authorization: Bearer ${CRON_SECRET}` saat CRON_SECRET di-set di env.
// HMAC ke Portal pakai PORTAL_API_SECRET atas canonical path+query (body kosong, §4.4).
// ============================================================
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/** Canonical body-kosong identik milik Portal (lib/portal/nonce.ts) — signer == verifier. */
function canonicalPathQuery(url: URL): string {
  const params = [...url.searchParams.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  const qs = params.map(([k, v]) => `${k}=${v}`).join('&')
  return qs ? `${url.pathname}?${qs}` : url.pathname
}

export async function GET(request: Request) {
  // 1. Auth cron (fail-closed): butuh CRON_SECRET + Bearer cocok.
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const portalBase = process.env.PORTAL_API_URL?.trim().replace(/\/+$/, '')
  const secret = process.env.PORTAL_API_SECRET
  if (!portalBase || !secret) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 500 })
  }

  // 2. Tenant ber-SoR portal (storefront baca mirror).
  const { data: pages, error: pagesErr } = await supabaseAdmin
    .from('landing_pages')
    .select('slug')
    .eq('status', 'published')
    .eq('konfigurasi->>source_of_truth', 'portal')
  if (pagesErr) {
    console.error('[cron/reconcile-catalog] list tenant error:', pagesErr.message)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
  const slugs = [...new Set((pages ?? []).map((p) => p.slug as string).filter(Boolean))]

  // 3. Tarik full + terapkan per tenant (kegagalan satu tenant tak menggagalkan lainnya).
  const results: Array<{ slug: string; ok: boolean; upserted?: number; status?: number; error?: string }> = []
  for (const slug of slugs) {
    try {
      const target = new URL(`${portalBase}/catalog`)
      target.searchParams.set('tenant', slug)
      const canonical = canonicalPathQuery(target)
      const ts = newTimestamp()
      const nonce = newNonce()
      const sig = signPayload(secret, ts, nonce, canonical)

      const res = await fetch(target.toString(), {
        headers: {
          [SIG_HEADERS.timestamp]: ts,
          [SIG_HEADERS.nonce]: nonce,
          [SIG_HEADERS.signature]: sig,
        },
        cache: 'no-store',
      })
      if (!res.ok) {
        results.push({ slug, ok: false, status: res.status })
        continue
      }
      const snap = await res.json()
      const applied = await applyCatalogSnapshot(snap)
      if (applied.ok) results.push({ slug, ok: true, upserted: applied.upserted })
      else results.push({ slug, ok: false, error: applied.error })
    } catch (err) {
      results.push({ slug, ok: false, error: (err as Error)?.message })
    }
  }

  const okCount = results.filter((r) => r.ok).length
  return NextResponse.json({ ok: true, tenants: slugs.length, reconciled: okCount, results })
}
