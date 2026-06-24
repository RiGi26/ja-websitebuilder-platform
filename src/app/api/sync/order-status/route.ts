import { NextResponse, after } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifySignedRequest, SIG_HEADERS } from '@/lib/portal/sign'
import { consumeIngestNonce } from '@/lib/portal/ingest-nonce'
import { isPaidStatus } from '@/lib/portal/labels'
import { pregenerateInvoiceByOrderCode } from '@/lib/invoice/generate'
import { notifyOrderStageChange } from '@/lib/notif/stage-notify'

// ============================================================
// WB INGEST — POST /api/sync/order-status (BAKSO_PORTAL_CONTRACT.md §4.3). Portal push
// perubahan status order → upsert order_projection dengan GUARD MONOTONIC: tulis HANYA
// jika incoming.updated_at >= source_updated_at (else skip). Create-on-upsert bila baris
// belum ada. HMAC WB_INGEST_SECRET (§8) + nonce store.
// ============================================================
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const secret = process.env.WB_INGEST_SECRET
  if (!secret) {
    console.error('[sync/order-status] WB_INGEST_SECRET belum di-set')
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

  let body: {
    tenant_slug?: string; order_code?: string; tracking_token?: string
    status_bayar?: string; status_fulfillment?: string
    resi?: string | null; tgl_kirim?: string | null; jam_kirim?: string | null; updated_at?: string
  }
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 })
  }
  const { tenant_slug, order_code, tracking_token, status_bayar, status_fulfillment } = body
  const updated_at = body.updated_at
  if (!tenant_slug || !order_code || !tracking_token || !updated_at) {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const { data: existing } = await supabaseAdmin
    .from('order_projection')
    .select('order_code, source_updated_at, status_bayar, status_fulfillment, metode_bayar, pembeli_nama, pembeli_telp, tracking_token, total_gross, ringkasan_items, wa_paid_sent_at, wa_shipped_sent_at')
    .eq('order_code', order_code)
    .maybeSingle()

  // Guard monotonic: abaikan push yang lebih lama dari yang sudah tercatat.
  if (existing && new Date(updated_at).getTime() < new Date(existing.source_updated_at as string).getTime()) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  if (existing) {
    const { error } = await supabaseAdmin
      .from('order_projection')
      .update({
        status_bayar,
        status_fulfillment,
        resi: body.resi ?? null,
        tgl_kirim: body.tgl_kirim ?? null,
        // jam_kirim SENGAJA tak ikut di-update: nilainya immutable (di-set saat
        // bootstrap order create) → biarkan apa adanya agar push status tak menimpanya null.
        source_updated_at: updated_at,
        synced_at: now,
      })
      .eq('order_code', order_code)
    if (error) {
      console.error('[sync/order-status] update error:', error.message)
      return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
    }
  } else {
    // Create-on-upsert (bootstrap telat / hilang). Field pembeli/total menyusul dari
    // bootstrap WB; di sini cukup status + token.
    const { error } = await supabaseAdmin.from('order_projection').insert({
      order_code,
      tenant_slug,
      tracking_token,
      status_bayar,
      status_fulfillment,
      resi: body.resi ?? null,
      tgl_kirim: body.tgl_kirim ?? null,
      jam_kirim: body.jam_kirim ?? null,
      source_updated_at: updated_at,
      synced_at: now,
    })
    if (error) {
      console.error('[sync/order-status] insert error:', error.message)
      return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
    }
  }

  // Pre-generate PDF invoice begitu pembayaran terverifikasi (lunas/cod) — fire-and-forget,
  // JANGAN await: push status Portal tak boleh nunggu render/upload (CLAUDE.md after-pattern).
  // pregenerate sendiri sudah guard (skip bila belum paid / sudah dibuat). Jaring pengaman:
  // route /invoice/[token] tetap bisa render lazy bila pre-gen ini gagal.
  if (isPaidStatus(status_bayar)) {
    pregenerateInvoiceByOrderCode(order_code).catch((e: unknown) =>
      console.error('[sync/order-status] invoice pre-gen:', (e as Error)?.message),
    )
  }

  // WA tahap-lanjut ke pembeli pada transisi lunas / dikirim. after() = jangan blok
  // response webhook (CLAUDE.md after-pattern); helper idempoten via *_sent_at columns.
  // Hanya untuk order yang sudah ada projection-nya (punya prev-state + nomor pembeli).
  if (existing) {
    after(() => notifyOrderStageChange({
      orderCode: order_code,
      tenantSlug: tenant_slug,
      trackingToken: tracking_token,
      pembeliNama: existing.pembeli_nama as string | null,
      pembeliTelp: existing.pembeli_telp as string | null,
      metodeBayar: existing.metode_bayar as string | null,
      totalGross: existing.total_gross as number | null,
      ringkasanItems: existing.ringkasan_items as { nama: string; qty: number; harga: number }[] | null,
      prevStatusBayar: existing.status_bayar as string | null,
      prevStatusFulfillment: existing.status_fulfillment as string | null,
      newStatusBayar: status_bayar ?? null,
      newStatusFulfillment: status_fulfillment ?? null,
      resi: body.resi ?? null,
      waPaidSentAt: existing.wa_paid_sent_at as string | null,
      waShippedSentAt: existing.wa_shipped_sent_at as string | null,
    }).catch((e: unknown) => console.error('[sync/order-status] stage notif:', (e as Error)?.message)))
  }

  return NextResponse.json({ ok: true })
}
