import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { isPaidStatus } from '@/lib/portal/labels'
import { ensureInvoicePdf } from '@/lib/invoice/generate'

// ============================================================
// GET /invoice/[token] — sajikan PDF faktur untuk satu order Portal.
// Keamanan sama dgn /lacak/[token]: token EXACT 32-hex, rate-limit 60/min/IP,
// service-role baca order_projection (tanpa anon §8). GATE: hanya render saat
// pembayaran terverifikasi (lunas/cod). Serve-or-generate: stream cache bila ada,
// kalau belum → render & simpan dulu (lib/invoice/generate, idempoten).
// ============================================================
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs' // @react-pdf/renderer butuh Node runtime (bukan edge)

const SELECT_FIELDS =
  'order_code, tenant_slug, tracking_token, pembeli_nama, status_bayar, metode_bayar, ' +
  'ringkasan_items, total_online, total_courier, total_gross, biaya_kurir, resi, ' +
  'tgl_kirim, jam_kirim, created_at, invoice_generated_at'

function htmlMessage(title: string, body: string, status: number): Response {
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="font-family:system-ui,sans-serif;background:#FBF3E4;color:#2B1A12;min-height:100dvh;margin:0;display:flex;align-items:center;justify-content:center;padding:2rem">
<div style="max-width:420px;text-align:center">
<h1 style="font-size:1.4rem;margin:0 0 .6rem">${title}</h1>
<p style="font-size:.95rem;color:#6E5240;line-height:1.6;margin:0">${body}</p>
</div></body></html>`
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

export async function GET(request: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params

  const rl = rateLimit(`invoice:${clientIp(request)}`, 60, 60_000)
  if (!rl.allowed) {
    return htmlMessage('Terlalu banyak permintaan', 'Coba lagi sebentar.', 429)
  }

  if (!token || !/^[a-f0-9]{32}$/i.test(token)) {
    return htmlMessage('Invoice tidak ditemukan', 'Tautan tidak valid. Periksa kembali tautan dari WhatsApp Anda.', 404)
  }

  const { data, error } = await supabaseAdmin
    .from('order_projection')
    .select(SELECT_FIELDS)
    .eq('tracking_token', token)
    .maybeSingle()

  if (error) {
    console.error('[invoice] lookup error:', error.message)
    return htmlMessage('Terjadi kesalahan', 'Tidak bisa memuat invoice saat ini. Coba lagi sebentar.', 500)
  }
  if (!data) {
    return htmlMessage('Invoice tidak ditemukan', 'Tautan tidak valid atau sudah kedaluwarsa.', 404)
  }

  const p = data as unknown as Parameters<typeof ensureInvoicePdf>[0]

  if (!isPaidStatus(p.status_bayar)) {
    return htmlMessage(
      'Invoice belum tersedia',
      'Invoice akan bisa diunduh setelah pembayaran Anda terverifikasi. Pantau status di halaman lacak pesanan.',
      403,
    )
  }

  let pdf: Buffer | null
  try {
    pdf = await ensureInvoicePdf(p)
  } catch (e) {
    const err = e as Error
    console.error('[invoice] generate error:', err?.message, err?.stack)
    // TEMP DEBUG: ?debug=1 surfaces error detail (no secrets) untuk diagnosa UAT — hapus setelahnya.
    if (new URL(request.url).searchParams.get('debug') === '1') {
      return new Response(
        `name: ${err?.name}\nmessage: ${err?.message}\nstack:\n${err?.stack ?? ''}`,
        { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
      )
    }
    return htmlMessage('Gagal membuat invoice', 'Terjadi kesalahan saat menyiapkan PDF. Coba lagi sebentar.', 500)
  }
  if (!pdf) {
    return htmlMessage('Invoice belum tersedia', 'Coba lagi setelah pembayaran terverifikasi.', 403)
  }

  return new NextResponse(pdf as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Faktur-${p.order_code}.pdf"`,
      'Cache-Control': 'private, max-age=300',
    },
  })
}
