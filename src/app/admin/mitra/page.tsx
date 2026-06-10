import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import AdminMitraClient, {
  type AdminReferrer, type AdminPayout, type AdminEarning,
} from './AdminMitraClient'

export const dynamic = 'force-dynamic'

function displayIdOf(orderId: string, createdAt: string | null): string {
  const year = new Date(createdAt ?? Date.now()).getFullYear()
  return `JA-${year}-${orderId.slice(0, 8).toUpperCase()}`
}

// Admin Program Mitra: buat mitra, antrean pencairan, daftar mitra + komisi.
// Data dibaca langsung di server (service role); aksi via API admin +
// router.refresh() — pola sama dengan halaman admin lain.
export default async function AdminMitraPage() {
  const cookieStore = await cookies()
  const isAuth = verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
  if (!isAuth) redirect('/admin/login')

  const [{ data: referrerRows }, { data: earningRows }, { data: codeRows }, { data: payoutRows }] =
    await Promise.all([
      supabaseAdmin
        .from('referrers')
        .select('id, nama, email, nomor_wa, commission_percent, buyer_discount_percent, status, created_at')
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('referral_earnings')
        .select('id, referrer_id, amount, order_total, commission_percent, status, payout_id, created_at, orders(id, created_at, nama_usaha, nama_perusahaan)')
        .order('created_at', { ascending: false })
        .limit(200),
      supabaseAdmin
        .from('referral_codes')
        .select('referrer_id, code, status')
        .order('created_at', { ascending: true }),
      supabaseAdmin
        .from('referral_payouts')
        .select('id, referrer_id, amount, status, bank_snapshot, requested_at, paid_at, admin_note, referrers(nama)')
        .order('requested_at', { ascending: false })
        .limit(100),
    ])

  const nameOf = new Map((referrerRows ?? []).map((r) => [r.id, r.nama]))

  const referrers: AdminReferrer[] = (referrerRows ?? []).map((r) => {
    const own = (earningRows ?? []).filter((e) => e.referrer_id === r.id)
    const sum = (rows: typeof own) => rows.reduce((acc, e) => acc + (Number(e.amount) || 0), 0)
    return {
      id: r.id,
      nama: r.nama,
      email: r.email,
      nomorWa: r.nomor_wa,
      commissionPercent: Number(r.commission_percent) || 0,
      buyerDiscountPercent: Number(r.buyer_discount_percent) || 0,
      status: r.status as AdminReferrer['status'],
      createdAt: r.created_at,
      code: (codeRows ?? []).find((c) => c.referrer_id === r.id && c.status === 'active')?.code ?? null,
      stats: {
        orders: own.filter((e) => e.status !== 'void').length,
        pendingRp: sum(own.filter((e) => e.status === 'pending')),
        payableRp: sum(own.filter((e) => e.status === 'confirmed' && !e.payout_id)),
        paidRp: sum(own.filter((e) => e.status === 'paid')),
      },
    }
  })

  const payouts: AdminPayout[] = (payoutRows ?? []).map((p) => {
    const bank = (p.bank_snapshot ?? {}) as Record<string, string>
    const ref = p.referrers as unknown as { nama: string } | null
    return {
      id: p.id,
      amount: Number(p.amount) || 0,
      status: p.status as AdminPayout['status'],
      bankLabel: [bank.bank_name, bank.bank_account_number, bank.bank_account_name ? `a.n. ${bank.bank_account_name}` : null]
        .filter(Boolean).join(' · '),
      requestedAt: p.requested_at,
      paidAt: p.paid_at,
      adminNote: p.admin_note,
      referrerName: ref?.nama ?? nameOf.get(p.referrer_id) ?? '—',
    }
  })

  const earnings: AdminEarning[] = (earningRows ?? []).map((e) => {
    const order = e.orders as unknown as {
      id: string; created_at: string | null; nama_usaha: string | null; nama_perusahaan: string | null
    } | null
    return {
      id: e.id,
      amount: Number(e.amount) || 0,
      orderTotal: Number(e.order_total) || 0,
      pct: Number(e.commission_percent) || 0,
      status: e.status as AdminEarning['status'],
      claimed: !!e.payout_id,
      createdAt: e.created_at,
      referrerName: nameOf.get(e.referrer_id) ?? '—',
      displayId: order ? displayIdOf(order.id, order.created_at) : '—',
      customerName: order?.nama_perusahaan || order?.nama_usaha || 'Customer',
    }
  })

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <main className="pt-12 pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12 animate-fade-in">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-apple-blue px-3 py-1 bg-blue-50 rounded-lg inline-block">
                  Studio Management
                </p>
                <Link href="/admin" className="text-[10px] font-bold text-gray-400 hover:text-apple-blue transition-colors flex items-center gap-1 uppercase tracking-widest">
                  <ChevronLeft size={12} /> Kembali ke Admin
                </Link>
              </div>
              <h1 className="text-4xl md:text-5xl sf-display-heavy text-[#1D1D1F] tracking-tight">
                Program Mitra
              </h1>
              <p className="text-gray-500 mt-2 font-medium">Kelola mitra referral, komisi, dan pencairan.</p>
            </div>
            <div className="bg-white px-6 py-4 rounded-3xl apple-shadow border border-black/5 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Mitra</p>
              <p className="text-3xl sf-display-heavy text-apple-blue">{referrers.length}</p>
            </div>
          </div>

          <AdminMitraClient referrers={referrers} payouts={payouts} earnings={earnings} />
        </div>
      </main>
    </div>
  )
}
