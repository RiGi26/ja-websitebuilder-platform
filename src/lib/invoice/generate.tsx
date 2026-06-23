// Engine generate invoice PDF: projection → InvoiceData → render @react-pdf → cache
// ke Supabase Storage. Idempoten (invoice_generated_at = cache flag). Dipakai oleh:
//  • route /invoice/[token] (serve-or-generate, sudah punya projection),
//  • hook /api/sync/order-status (pre-gen fire-and-forget saat status jadi paid).
//
// PDF disimpan di bucket 'tenant-uploads' path invoices/<slug>/<token>.pdf (token
// 32-hex acak → tak bisa ditebak). TIDAK disajikan via public URL — route gated
// (rate-limit + paid-gate) yang men-stream-nya, agar akses tetap terkontrol.

import { renderToBuffer } from '@react-pdf/renderer'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isPaidStatus } from '@/lib/portal/labels'
import { InvoiceDocument } from './document'
import { invoiceDataFromProjection, type ProjectionRow } from './from-projection'
import type { InvoiceData } from './types'

const BUCKET = 'tenant-uploads'
const SELECT_FIELDS =
  'order_code, tenant_slug, tracking_token, pembeli_nama, status_bayar, metode_bayar, ' +
  'ringkasan_items, total_online, total_courier, total_gross, biaya_kurir, resi, ' +
  'tgl_kirim, jam_kirim, created_at, invoice_generated_at'

type ProjectionFull = ProjectionRow & { tracking_token: string; invoice_generated_at: string | null }

function storagePath(tenantSlug: string, token: string): string {
  return `invoices/${tenantSlug}/${token}.pdf`
}

// Prefetch logo → data-URL agar render PDF tak gagal jika URL logo mati. Best-effort.
async function fetchLogoDataUrl(url?: string | null): Promise<string | null> {
  if (!url || !/^https?:\/\//.test(url)) return null
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 8000)
    const res = await fetch(url, { signal: ctrl.signal })
    clearTimeout(t)
    if (!res.ok) return null
    const ct = res.headers.get('content-type') || ''
    if (!/^image\/(png|jpe?g)/i.test(ct)) return null // react-pdf andal utk PNG/JPG
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.byteLength > 2 * 1024 * 1024) return null // batasi 2MB
    return `data:${ct};base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

async function downloadCached(path: string): Promise<Buffer | null> {
  const { data, error } = await supabaseAdmin.storage.from(BUCKET).download(path)
  if (error || !data) return null
  return Buffer.from(await data.arrayBuffer())
}

/** Render PDF dari InvoiceData siap-pakai TANPA DB/Storage (dipakai test render +
 *  reuse internal). Elemen <InvoiceDocument/> dibuat di sini (classic runtime). */
export async function renderInvoicePdf(data: InvoiceData, logoDataUrl?: string | null): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument data={data} logoDataUrl={logoDataUrl ?? null} />)
}

async function renderAndStore(p: ProjectionFull): Promise<Buffer> {
  const data = await invoiceDataFromProjection(p)
  const logoDataUrl = await fetchLogoDataUrl(data.seller.logoUrl)
  const pdf = await renderInvoicePdf(data, logoDataUrl)

  const path = storagePath(p.tenant_slug, p.tracking_token)
  const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(path, pdf, {
    contentType: 'application/pdf',
    upsert: true,
  })
  if (upErr) throw upErr

  await supabaseAdmin
    .from('order_projection')
    .update({ invoice_generated_at: new Date().toISOString() })
    .eq('order_code', p.order_code)

  return pdf
}

/**
 * Pastikan PDF invoice ada → kembalikan bytes-nya (dari cache atau render baru).
 * GATE: hanya untuk order yang sudah dibayar (lunas/cod). Null = belum boleh / gagal.
 * Dipakai route yang sudah punya baris projection.
 */
export async function ensureInvoicePdf(p: ProjectionFull): Promise<Buffer | null> {
  if (!isPaidStatus(p.status_bayar)) return null

  const path = storagePath(p.tenant_slug, p.tracking_token)
  if (p.invoice_generated_at) {
    const cached = await downloadCached(path)
    if (cached) return cached
    // flag ada tapi file hilang → render ulang.
  }
  return renderAndStore(p)
}

/**
 * Pre-generate berdasar order_code (hook sync saat status jadi paid). Fire-and-forget:
 * fetch projection penuh sendiri, lalu render+simpan. Aman dipanggil tanpa await.
 */
export async function pregenerateInvoiceByOrderCode(orderCode: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from('order_projection')
    .select(SELECT_FIELDS)
    .eq('order_code', orderCode)
    .maybeSingle()
  if (error || !data) return
  const p = data as unknown as ProjectionFull
  if (!isPaidStatus(p.status_bayar)) return
  if (p.invoice_generated_at) return // sudah ada
  await renderAndStore(p)
}
