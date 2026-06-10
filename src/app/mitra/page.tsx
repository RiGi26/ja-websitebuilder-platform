import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { PAYOUT_MIN } from '@/lib/referral'
import MitraDashboard, { type EarningRow, type PayoutRow } from './MitraDashboard'

export const dynamic = 'force-dynamic'

// Dashboard Mitra (Program Mitra). Arsitektur mirror /portal:
// guard sesi di server → baca via service role difilter referrer milik
// user JWT → kirim HANYA props aman ke client component (tanpa PII customer).

// Nama bisnis customer di-mask sebelum dikirim ke mitra: "Kedai Kopi Mulyo"
// → "Kedai K•••". Mitra cukup tahu ordernya masuk, bukan identitas customer.
function maskName(name: string | null | undefined): string {
  if (!name) return 'Customer'
  const words = name.trim().split(/\s+/)
  if (words.length === 1) {
    const w = words[0]
    return w.length <= 4 ? w : `${w.slice(0, 4)}•••`
  }
  return `${words[0]} ${words[1][0]}•••`
}

function displayIdOf(orderId: string, createdAt: string | null): string {
  const year = new Date(createdAt ?? Date.now()).getFullYear()
  return `JA-${year}-${orderId.slice(0, 8).toUpperCase()}`
}

export default async function MitraPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/mitra/login')

  // Resolve mitra dari user_id (bukan app_metadata) — tahan drift metadata.
  const { data: referrer } = await supabaseAdmin
    .from('referrers')
    .select('id, nama, email, commission_percent, buyer_discount_percent, bank_name, bank_account_number, bank_account_name, status')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!referrer) redirect('/mitra/login')

  const [{ data: codeRow }, { data: earningRows }, { data: payoutRows }] = await Promise.all([
    supabaseAdmin
      .from('referral_codes')
      .select('code')
      .eq('referrer_id', referrer.id)
      .eq('status', 'active')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabaseAdmin
      .from('referral_earnings')
      .select('id, amount, status, payout_id, created_at, order_total, orders(id, created_at, nama_usaha, nama_perusahaan)')
      .eq('referrer_id', referrer.id)
      .order('created_at', { ascending: false })
      .limit(200),
    supabaseAdmin
      .from('referral_payouts')
      .select('id, amount, status, requested_at, paid_at, admin_note')
      .eq('referrer_id', referrer.id)
      .order('requested_at', { ascending: false })
      .limit(50),
  ])

  const earnings: EarningRow[] = (earningRows ?? []).map((e) => {
    const order = e.orders as unknown as {
      id: string; created_at: string | null; nama_usaha: string | null; nama_perusahaan: string | null
    } | null
    return {
      id: e.id,
      displayId: order ? displayIdOf(order.id, order.created_at) : '—',
      customerLabel: maskName(order?.nama_perusahaan || order?.nama_usaha),
      orderTotal: Number(e.order_total) || 0,
      amount: Number(e.amount) || 0,
      status: e.status as EarningRow['status'],
      claimed: !!e.payout_id,
      createdAt: e.created_at,
    }
  })

  const payouts: PayoutRow[] = (payoutRows ?? []).map((p) => ({
    id: p.id,
    amount: Number(p.amount) || 0,
    status: p.status as PayoutRow['status'],
    requestedAt: p.requested_at,
    paidAt: p.paid_at,
    adminNote: p.admin_note,
  }))

  const sum = (rows: EarningRow[]) => rows.reduce((acc, r) => acc + r.amount, 0)
  const stats = {
    orders: earnings.filter((e) => e.status !== 'void').length,
    pendingRp: sum(earnings.filter((e) => e.status === 'pending')),
    payableRp: sum(earnings.filter((e) => e.status === 'confirmed' && !e.claimed)),
    paidRp: sum(earnings.filter((e) => e.status === 'paid')),
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  const code = codeRow?.code ?? ''

  return (
    <MitraDashboard
      referrerName={referrer.nama}
      code={code}
      refLink={code ? `${base}/r/${code}` : ''}
      discountPercent={Number(referrer.buyer_discount_percent) || 0}
      commissionPercent={Number(referrer.commission_percent) || 0}
      stats={stats}
      earnings={earnings}
      payouts={payouts}
      bank={{
        bankName: referrer.bank_name ?? '',
        accountNumber: referrer.bank_account_number ?? '',
        accountName: referrer.bank_account_name ?? '',
      }}
      hasPendingPayout={payouts.some((p) => p.status === 'requested')}
      payoutMin={PAYOUT_MIN}
    />
  )
}
