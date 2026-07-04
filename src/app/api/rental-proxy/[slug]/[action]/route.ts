import { NextResponse } from 'next/server'

// ============================================================
// SetirYuk: proxy server-side WB → Portal Rental untuk booking mobil realtime
// (pola booking-proxy Kamy; route terpisah supaya nol regresi ke klinik).
// Browser situs klien memanggil route ini (same-origin) → tanpa CORS. Aksi:
//   GET  info         → {PORTAL}/api/booking/{slug}/info
//   GET  availability → {PORTAL}/api/booking/{slug}/availability?vehicle_id&from&to
//   GET  status?code= → {PORTAL}/api/payment/check-status/{code}   (poll halaman /sewa)
//   POST submit       → {PORTAL}/api/booking/{slug}/submit (+ return_url dibangun
//                       server-side dari host request — jangan percaya client)
// ============================================================

export const dynamic = 'force-dynamic'

const ALLOWED_PORTAL = 'https://ja-rental-platform.vercel.app'
const GET_ACTIONS = new Set(['info', 'availability', 'status'])
const POST_ACTIONS = new Set(['submit'])
const CODE_RE = /^JA-[A-Z0-9]{8}$/
const HOST_RE = /^[a-z0-9.-]+(:\d+)?$/i

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
  const { search, searchParams } = new URL(request.url)

  if (action === 'status') {
    const code = searchParams.get('code') ?? ''
    if (!CODE_RE.test(code)) {
      return NextResponse.json({ error: 'Kode booking tidak valid' }, { status: 400 })
    }
    return relay(`${ALLOWED_PORTAL}/api/payment/check-status/${code}`, {
      headers: { accept: 'application/json' },
    })
  }

  return relay(
    `${ALLOWED_PORTAL}/api/booking/${encodeURIComponent(slug)}/${action}${search}`,
    { headers: { accept: 'application/json' } },
  )
}

export async function POST(
  request: Request,
  ctx: { params: Promise<{ slug: string; action: string }> },
) {
  const { slug, action } = await ctx.params
  if (!POST_ACTIONS.has(action)) {
    return NextResponse.json({ error: 'Aksi tidak dikenal' }, { status: 404 })
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 })
  }

  // Finish URL Midtrans balik ke halaman status situs INI. Base dari host request
  // (setiryuk.webzoka.com atau preview vercel); portal menempelkan /{bookingCode}.
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? ''
  const returnUrl = HOST_RE.test(host) && !host.startsWith('localhost') && !host.startsWith('127.')
    ? `https://${host}/sewa`
    : undefined

  return relay(`${ALLOWED_PORTAL}/api/booking/${encodeURIComponent(slug)}/submit`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ ...body, return_url: returnUrl }),
  })
}
