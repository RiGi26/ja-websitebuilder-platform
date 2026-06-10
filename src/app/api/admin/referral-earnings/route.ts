import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { notifyReferrer } from '@/lib/fonnte'

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

// GET : seluruh earning (untuk tabel admin), terbaru dulu.
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('referral_earnings')
    .select('id, amount, order_total, commission_percent, status, payout_id, created_at, confirmed_at, referrers(nama), orders(id, created_at, nama_usaha, nama_perusahaan)')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ earnings: data ?? [] })
}

// PATCH { id, action: 'void' | 'confirm' }
//   confirm → pending → confirmed (kasus lunas manual/di luar Midtrans).
//   void    → pending|confirmed → void; HANYA bila belum diklaim payout.
export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, action } = await request.json()
    if (!id || !['void', 'confirm'].includes(action)) {
      return NextResponse.json({ error: 'id & action (void|confirm) wajib' }, { status: 400 })
    }

    if (action === 'confirm') {
      const { data: rows, error } = await supabaseAdmin
        .from('referral_earnings')
        .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
        .eq('id', id)
        .eq('status', 'pending')
        .select('amount, referrer_id, orders(id, created_at)')
      if (error) throw new Error(error.message)
      if (!rows || rows.length === 0) {
        return NextResponse.json({ error: 'Earning tidak ditemukan / bukan status pending.' }, { status: 400 })
      }

      // Notif mitra (fire-and-forget) — konsisten dengan jalur webhook lunas.
      const { data: referrer } = await supabaseAdmin
        .from('referrers')
        .select('nama, nomor_wa')
        .eq('id', rows[0].referrer_id)
        .maybeSingle()
      if (referrer?.nomor_wa) {
        const order = rows[0].orders as unknown as { id: string; created_at: string | null } | null
        const year = new Date(order?.created_at ?? Date.now()).getFullYear()
        const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
        notifyReferrer({ type: 'referral_earning_confirmed' }, referrer.nomor_wa, {
          referrerName: referrer.nama,
          amount: Number(rows[0].amount),
          displayId: order ? `JA-${year}-${order.id.slice(0, 8).toUpperCase()}` : null,
          mitraUrl: `${base}/mitra`,
        }).catch((e) => console.error('[admin/referral-earnings] WA confirm failed:', e))
      }
      return NextResponse.json({ ok: true })
    }

    // action === 'void' — earning yang sudah diklaim payout harus dilepas dulu
    // (tolak payout-nya) sebelum bisa di-void; earning 'paid' tak pernah di-void.
    const { data: rows, error } = await supabaseAdmin
      .from('referral_earnings')
      .update({ status: 'void' })
      .eq('id', id)
      .in('status', ['pending', 'confirmed'])
      .is('payout_id', null)
      .select('id')
    if (error) throw new Error(error.message)
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Earning tidak bisa di-void (sudah dibayar / sedang dalam payout).' },
        { status: 400 },
      )
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Gagal memperbarui earning.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
