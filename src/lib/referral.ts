import { supabaseAdmin } from '@/lib/supabase-admin'
import { normalizeWa } from '@/lib/fonnte'

// ============================================================
// Program Mitra — helper referral (service role only).
// ------------------------------------------------------------
// Lifecycle earning: pending (DP dibayar) → confirmed (lunas /
// full-upfront) → paid (payout). void saat order dibatalkan.
// Semua helper idempotent: webhook Midtrans bisa retry berkali-
// kali, jadi insert pakai onConflict order_id + predicate status.
// ============================================================

export const REFERRAL_COOKIE = 'ja_ref'
export const PAYOUT_MIN = 100_000

const CODE_RE = /^[A-Z0-9]{4,16}$/

export function normalizeCode(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const code = raw.trim().toUpperCase()
  return CODE_RE.test(code) ? code : null
}

export interface ActiveReferral {
  referrerId: string
  code: string
  referrerName: string
  discountPercent: number
  commissionPercent: number
  referrerWa: string
  referrerEmail: string
}

/** Kode valid hanya jika kode AKTIF dan referrer-nya AKTIF. */
export async function lookupActiveCode(code: string): Promise<ActiveReferral | null> {
  const { data, error } = await supabaseAdmin
    .from('referral_codes')
    .select(
      'code, referrers!inner(id, nama, email, nomor_wa, commission_percent, buyer_discount_percent, status)',
    )
    .eq('code', code)
    .eq('status', 'active')
    .eq('referrers.status', 'active')
    .maybeSingle()

  if (error) {
    console.error('[referral] lookupActiveCode:', error.message)
    return null
  }
  if (!data) return null

  const r = data.referrers as unknown as {
    id: string
    nama: string
    email: string
    nomor_wa: string
    commission_percent: number
    buyer_discount_percent: number
  }

  return {
    referrerId: r.id,
    code: data.code,
    referrerName: r.nama,
    discountPercent: Number(r.buyer_discount_percent) || 0,
    commissionPercent: Number(r.commission_percent) || 0,
    referrerWa: r.nomor_wa,
    referrerEmail: r.email,
  }
}

/** Mitra tidak boleh memakai kodenya sendiri (WA/email sama dengan pembeli). */
export function isSelfReferral(ref: ActiveReferral, buyerWa: string, buyerEmail: string): boolean {
  if (buyerWa && ref.referrerWa && normalizeWa(buyerWa) === normalizeWa(ref.referrerWa)) return true
  if (
    buyerEmail &&
    ref.referrerEmail &&
    buyerEmail.trim().toLowerCase() === ref.referrerEmail.trim().toLowerCase()
  )
    return true
  return false
}

export interface EarningTransition {
  /** 'skipped' = tidak ada perubahan (retry webhook / order tanpa referral). */
  outcome: 'created' | 'created_confirmed' | 'confirmed' | 'voided' | 'skipped'
  amount?: number
  referrerWa?: string
  referrerName?: string
}

const SKIPPED: EarningTransition = { outcome: 'skipped' }

/**
 * Buat earning saat DP dibayar. Order < ambang DP dibayar 100% di muka dan
 * tidak pernah menyentuh payment_status='lunas' (pelunasan menolak sisa 0),
 * jadi earning full-upfront langsung 'confirmed'.
 */
export async function createEarningForOrder(orderId: string): Promise<EarningTransition> {
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .select('id, referrer_id, total_estimasi, dp_amount, type, status')
    .eq('id', orderId)
    .maybeSingle()

  if (orderErr) {
    console.error('[referral] createEarning load order:', orderErr.message)
    return SKIPPED
  }
  if (!order?.referrer_id) return SKIPPED
  if ((order.type ?? 'new') !== 'new') return SKIPPED
  if (order.status === 'cancelled') return SKIPPED

  const { data: referrer, error: refErr } = await supabaseAdmin
    .from('referrers')
    .select('id, nama, nomor_wa, commission_percent')
    .eq('id', order.referrer_id)
    .maybeSingle()

  if (refErr || !referrer) {
    if (refErr) console.error('[referral] createEarning load referrer:', refErr.message)
    return SKIPPED
  }

  const net = Number(order.total_estimasi) || 0
  const pct = Number(referrer.commission_percent) || 0
  const amount = Math.round((net * pct) / 100)
  const fullUpfront = Number(order.dp_amount) >= net

  const { data: inserted, error: insErr } = await supabaseAdmin
    .from('referral_earnings')
    .upsert(
      [
        {
          referrer_id: referrer.id,
          order_id: order.id,
          order_total: net,
          commission_percent: pct,
          amount,
          status: fullUpfront ? 'confirmed' : 'pending',
          confirmed_at: fullUpfront ? new Date().toISOString() : null,
        },
      ],
      { onConflict: 'order_id', ignoreDuplicates: true },
    )
    .select('id')

  if (insErr) {
    console.error('[referral] createEarning insert:', insErr.message)
    return SKIPPED
  }
  // Tidak ada row kembali = sudah ada earning untuk order ini (retry webhook).
  if (!inserted || inserted.length === 0) return SKIPPED

  return {
    outcome: fullUpfront ? 'created_confirmed' : 'created',
    amount,
    referrerWa: referrer.nomor_wa,
    referrerName: referrer.nama,
  }
}

/** pending → confirmed saat pelunasan dibayar. Idempotent via predicate status. */
export async function confirmEarningForOrder(orderId: string): Promise<EarningTransition> {
  const { data: rows, error } = await supabaseAdmin
    .from('referral_earnings')
    .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
    .eq('order_id', orderId)
    .eq('status', 'pending')
    .select('amount, referrer_id')

  if (error) {
    console.error('[referral] confirmEarning:', error.message)
    return SKIPPED
  }
  if (!rows || rows.length === 0) return SKIPPED

  const { data: referrer } = await supabaseAdmin
    .from('referrers')
    .select('nama, nomor_wa')
    .eq('id', rows[0].referrer_id)
    .maybeSingle()

  return {
    outcome: 'confirmed',
    amount: Number(rows[0].amount),
    referrerWa: referrer?.nomor_wa,
    referrerName: referrer?.nama,
  }
}

/** Batalkan earning yang belum dibayar. Earning 'paid' tidak pernah di-void otomatis. */
export async function voidEarningForOrder(orderId: string): Promise<EarningTransition> {
  const { data: rows, error } = await supabaseAdmin
    .from('referral_earnings')
    .update({ status: 'void' })
    .eq('order_id', orderId)
    .in('status', ['pending', 'confirmed'])
    .select('amount')

  if (error) {
    console.error('[referral] voidEarning:', error.message)
    return SKIPPED
  }
  if (!rows || rows.length === 0) return SKIPPED
  return { outcome: 'voided', amount: Number(rows[0].amount) }
}
