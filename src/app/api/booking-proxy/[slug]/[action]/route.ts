import { NextResponse } from 'next/server'

// ============================================================
// B5 (Kamy): proxy server-side WB → Portal Klinik untuk booking online realtime.
// Browser situs klien memanggil route ini (same-origin) → tak ada CORS. Server
// meneruskan ke endpoint booking publik Portal (info/slots/check-patient/submit).
// Allowlist host Portal (anti open-proxy) + whitelist aksi. Dipakai flow booking
// native tema klinik bespoke (KlinikFisioBooking) via konfigurasi.booking.slug.
// ============================================================

export const dynamic = 'force-dynamic'

// Host Portal Klinik yang diizinkan (tambah di sini bila portal pindah domain).
const ALLOWED_PORTAL = 'https://ja-clinic-platform.vercel.app'
const GET_ACTIONS = new Set(['info', 'slots', 'check-patient', 'schedule'])
const POST_ACTIONS = new Set(['submit'])

function targetUrl(slug: string, action: string, search: string): string {
  return `${ALLOWED_PORTAL}/api/booking/${encodeURIComponent(slug)}/${action}${search}`
}

async function relay(url: string, init: RequestInit) {
  try {
    const res = await fetch(url, { ...init, cache: 'no-store' })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: 'Gagal menghubungi portal booking. Coba lagi.' }, { status: 502 })
  }
}

export async function GET(
  request: Request,
  ctx: { params: Promise<{ slug: string; action: string }> },
) {
  const { slug, action } = await ctx.params
  if (!GET_ACTIONS.has(action)) {
    return NextResponse.json({ error: 'Aksi tidak dikenal' }, { status: 404 })
  }
  const { search } = new URL(request.url)
  return relay(targetUrl(slug, action, search), { headers: { accept: 'application/json' } })
}

export async function POST(
  request: Request,
  ctx: { params: Promise<{ slug: string; action: string }> },
) {
  const { slug, action } = await ctx.params
  if (!POST_ACTIONS.has(action)) {
    return NextResponse.json({ error: 'Aksi tidak dikenal' }, { status: 404 })
  }
  const body = await request.text()
  return relay(targetUrl(slug, action, ''), {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body,
  })
}
