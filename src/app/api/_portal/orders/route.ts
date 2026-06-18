import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifySignedRequest, makeNonceCache, SIG_HEADERS } from '@/lib/portal/sign'
import {
  METODE_BAYAR,
  type MetodeBayar,
  type PortalOrderRequest,
  type PortalOrderResponse,
  type StockConflictEntry,
  type StatusBayar,
} from '@/lib/portal/types'

// ============================================================
// ⚠️ FASE 1 STUB — bukan Portal nyata. Berperan sebagai {PORTAL}/api/orders
// (BAKSO_PORTAL_CONTRACT.md §4.1) supaya storefront WB bisa dibangun & diuji
// SEBELUM Portal asli ada (D-A portal-first). Hapus route ini saat Portal Fase 2
// live (cukup arahkan PORTAL_API_URL ke origin Portal).
//
// Yang DISIMULASIKAN sesuai kontrak: verifikasi HMAC §8 + skew + nonce-replay ·
// idempotency replay → 200 body asli · reprice OTORITATIF dari catalog_mirror ·
// stok otoritatif dari menu_items.stok_harian → 409 stock_conflict (demo mirror basi) ·
// total per metode_bayar §7 · order_code + tracking_token.
//
// Yang TIDAK disimulasikan (Portal nyata Fase 2): RPC reserve FEFO all-or-nothing,
// RLS tenant, mutasi stok, push sync balik. Stok di sini READ-ONLY (UAT repeatable).
// ============================================================

export const dynamic = 'force-dynamic'

const seenNonce = makeNonceCache() // per-instance (caveat sama rate-limit.ts) — cukup utk stub

const BAKSO_SLUG = 'bakso-tini'

// Rekening dummy per metode (Fase 1). Portal nyata baca dari tenant_config.settings.
const REKENING: Record<MetodeBayar, string | null> = {
  transfer_jp: 'Japan Post Bank（ゆうちょ）店番 018・普通 1234567・バクソティニ',
  transfer_id: 'BCA 123-456-7890 a.n. Bakso Tini (kurs ¥→Rp saat konfirmasi)',
  paypay: 'PayPay for Business — ID @baksotini',
  cod_full: null,
  cod_ongkir: 'Japan Post Bank（ゆうちょ）店番 018・普通 1234567・バクソティニ',
}

function badSignature() {
  return NextResponse.json({ ok: false, error: 'bad_signature' }, { status: 401 })
}
function invalid(msg = 'invalid_payload') {
  return NextResponse.json({ ok: false, error: msg }, { status: 400 })
}

export async function POST(request: Request) {
  // 1. Verifikasi tanda tangan (transport auth) atas RAW body (§8)
  const rawBody = await request.text()
  const secret = process.env.PORTAL_API_SECRET
  if (!secret) {
    console.error('[portal-stub] PORTAL_API_SECRET belum di-set')
    return NextResponse.json({ ok: false, error: 'stub_misconfigured' }, { status: 500 })
  }
  const verify = verifySignedRequest({
    secret,
    timestamp: request.headers.get(SIG_HEADERS.timestamp),
    nonce: request.headers.get(SIG_HEADERS.nonce),
    signature: request.headers.get(SIG_HEADERS.signature),
    rawBody,
    seenNonce,
  })
  if (!verify.ok) return badSignature()

  const idempotencyKey = request.headers.get(SIG_HEADERS.idempotency)?.trim()
  if (!idempotencyKey) return invalid() // wajib utk channel website (§4.1)

  // 2. Parse + validasi payload
  let body: PortalOrderRequest
  try {
    body = JSON.parse(rawBody)
  } catch {
    return invalid()
  }
  const tenant = body?.tenant_slug
  const pembeli = body?.pembeli
  const metode = body?.metode_bayar
  const items = body?.items
  if (!tenant || !pembeli?.nama?.trim() || !pembeli?.telp?.trim()) return invalid()
  if (!METODE_BAYAR.includes(metode)) return invalid()
  if (!Array.isArray(items) || items.length === 0) return invalid()
  if (tenant !== BAKSO_SLUG) {
    return NextResponse.json({ ok: false, error: 'unknown_tenant' }, { status: 404 })
  }

  // 3. Idempotency: cek DULU (§4.1 step 1) — replay → balas body 201 asli sbg HTTP 200
  const { data: prior } = await supabaseAdmin
    .from('portal_stub_orders')
    .select('response')
    .eq('tenant_slug', tenant)
    .eq('idempotency_key', idempotencyKey)
    .maybeSingle()
  if (prior?.response) {
    return NextResponse.json(prior.response, { status: 200 })
  }

  // 4. Reprice OTORITATIF dari catalog_mirror (jangan percaya harga browser)
  const packIds = items.map((it) => it?.product_pack_id).filter(Boolean) as string[]
  if (packIds.length !== items.length) return invalid()
  const { data: mirrorRows } = await supabaseAdmin
    .from('catalog_mirror')
    .select('pack_id, product_nama, pack_nama, harga, avail_status')
    .eq('tenant_slug', tenant)
    .eq('is_active', true)
    .in('pack_id', packIds)
  const mirror = new Map((mirrorRows ?? []).map((r) => [r.pack_id as string, r]))

  // 5. Stok OTORITATIF dari menu_items.stok_harian (seed: pack_id = menu_items.id).
  //    avail_status mirror bisa BASI → otoritas di sini → 409 (demo D-B kontrak).
  const { data: stockRows } = await supabaseAdmin
    .from('menu_items')
    .select('id, nama, is_sold_out, stok_harian')
    .in('id', packIds)
  const stock = new Map((stockRows ?? []).map((r) => [r.id as string, r]))

  const lines: { pack_id: string; nama: string; harga: number; qty: number }[] = []
  const conflicts: StockConflictEntry[] = []
  for (const it of items) {
    const packId = it.product_pack_id
    const m = mirror.get(packId)
    if (!m) {
      return NextResponse.json({ ok: false, error: 'unknown_pack' }, { status: 404 })
    }
    const qty = Math.max(1, Math.floor(Number(it.qty) || 1))
    const st = stock.get(packId)
    const soldOut = !!st?.is_sold_out || m.avail_status === 'habis'
    const stokHarian = st?.stok_harian // null = tak terbatas
    if (soldOut) {
      conflicts.push({ kind: 'pack', ref_id: packId, nama: m.product_nama, tersedia: 0, diminta: qty })
      continue
    }
    if (stokHarian != null && qty > Number(stokHarian)) {
      conflicts.push({ kind: 'pack', ref_id: packId, nama: m.product_nama, tersedia: Number(stokHarian), diminta: qty })
      continue
    }
    lines.push({ pack_id: packId, nama: m.product_nama, harga: Number(m.harga) || 0, qty })
  }
  if (conflicts.length > 0) {
    // Nol mutasi (stub read-only) — sesuai all-or-nothing §4.1/§10
    return NextResponse.json({ ok: false, error: 'stock_conflict', conflicts }, { status: 409 })
  }

  // 6. Hitung total per metode_bayar (§7). biaya_kurir Fase 1 = 0 (manual).
  const subtotal = lines.reduce((a, b) => a + b.harga * b.qty, 0)
  if (subtotal <= 0) return invalid()
  const ongkir = Math.max(0, Number(body.ongkir) || 0) // estimasi echo; region calc ditunda §12
  const biaya_kurir = 0
  const total_gross = subtotal + ongkir
  let total_online = 0
  let total_courier = 0
  let status_bayar: StatusBayar
  if (metode === 'cod_full') {
    total_online = 0
    total_courier = subtotal + ongkir + biaya_kurir
    status_bayar = 'cod'
  } else if (metode === 'cod_ongkir') {
    total_online = subtotal
    total_courier = ongkir
    status_bayar = 'menunggu_verifikasi'
  } else {
    total_online = subtotal + ongkir
    total_courier = 0
    status_bayar = 'menunggu_verifikasi'
  }

  // 7. Buat kode + token, susun response
  const now = new Date()
  const yymm = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}`
  // order_code DETERMINISTIK dari idempotency_key → distinct order = distinct code
  // (cegah tabrakan birthday 16-bit yg membuat order_projection ke-2 di-drop diam2
  //  oleh upsert ignoreDuplicates → /lacak 404). 32-bit prefix sha256, cukup utk stub.
  const order_code = `BT-${yymm}-${crypto.createHash('sha256').update(`${tenant}:${idempotencyKey}`).digest('hex').slice(0, 8).toUpperCase()}`
  const tracking_token = crypto.randomBytes(16).toString('hex')

  const instruksiNominal = metode === 'cod_full' ? total_courier : total_online
  const response: PortalOrderResponse = {
    ok: true,
    order_code,
    tracking_token,
    status_bayar,
    status_fulfillment: 'menunggu',
    metode_bayar: metode,
    total_online,
    total_courier,
    total_gross,
    biaya_kurir,
    instruksi_bayar: {
      metode,
      nominal: instruksiNominal,
      rekening: REKENING[metode],
      catatan:
        metode === 'cod_full'
          ? 'Bayar ke kurir saat barang tiba (代引き / daibiki).'
          : metode === 'cod_ongkir'
            ? 'Transfer harga barang lalu kirim bukti via WhatsApp. Ongkir 着払い dibayar ke kurir saat barang tiba.'
            : 'Transfer lalu kirim bukti via WhatsApp untuk verifikasi.',
    },
    created_at: now.toISOString(),
  }

  // 8. Simpan utk replay idempoten (ignore-duplicate bila race)
  await supabaseAdmin
    .from('portal_stub_orders')
    .insert({ tenant_slug: tenant, idempotency_key: idempotencyKey, order_code, response })

  return NextResponse.json(response, { status: 201 })
}
