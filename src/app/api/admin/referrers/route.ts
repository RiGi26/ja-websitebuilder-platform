import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { createReferrerWithAccount } from '@/lib/referrer-account'
import { generatePassword } from '@/lib/client-account'
import { notifyReferrer } from '@/lib/fonnte'
import { sendEmail, mitraWelcomeEmailHtml } from '@/lib/email'

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

// GET : daftar mitra + agregat komisi (pending/payable/paid) + kode default.
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [{ data: referrers, error }, { data: earnings }, { data: codes }] = await Promise.all([
    supabaseAdmin
      .from('referrers')
      .select('id, nama, email, nomor_wa, commission_percent, buyer_discount_percent, status, created_at, bank_name, bank_account_number, bank_account_name')
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('referral_earnings')
      .select('referrer_id, amount, status, payout_id'),
    supabaseAdmin
      .from('referral_codes')
      .select('referrer_id, code, status')
      .order('created_at', { ascending: true }),
  ])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const list = (referrers ?? []).map((r) => {
    const own = (earnings ?? []).filter((e) => e.referrer_id === r.id)
    const sum = (rows: typeof own) => rows.reduce((acc, e) => acc + (Number(e.amount) || 0), 0)
    return {
      ...r,
      code: (codes ?? []).find((c) => c.referrer_id === r.id && c.status === 'active')?.code ?? null,
      stats: {
        orders: own.filter((e) => e.status !== 'void').length,
        pendingRp: sum(own.filter((e) => e.status === 'pending')),
        payableRp: sum(own.filter((e) => e.status === 'confirmed' && !e.payout_id)),
        paidRp: sum(own.filter((e) => e.status === 'paid')),
      },
    }
  })

  return NextResponse.json({ referrers: list })
}

// POST { nama, email, nomor_wa, commission_percent?, buyer_discount_percent? }
// Buat mitra + akun + kode default, kirim kredensial via WA + email.
// Kredensial dikembalikan SEKALI di response (ditampilkan via CredentialBox).
export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const result = await createReferrerWithAccount({
      nama: String(body?.nama ?? ''),
      email: String(body?.email ?? ''),
      nomorWa: String(body?.nomor_wa ?? ''),
      commissionPercent: body?.commission_percent != null ? Number(body.commission_percent) : undefined,
      buyerDiscountPercent: body?.buyer_discount_percent != null ? Number(body.buyer_discount_percent) : undefined,
    })

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
    const refLink = `${base}/r/${result.code}`
    const mitraUrl = `${base}/mitra`

    // Kirim kredensial (fire-and-forget — kredensial tetap tampil di admin).
    const waTarget = String(body?.nomor_wa ?? '')
    if (waTarget) {
      notifyReferrer({ type: 'referrer_welcome' }, waTarget, {
        referrerName: String(body?.nama ?? 'Mitra'),
        mitraUrl: `${mitraUrl}/login`,
        code: result.code,
        refLink,
        loginEmail: result.email,
        loginPassword: result.password,
      }).catch((e) => console.error('[admin/referrers] WA welcome failed:', e))
    }
    sendEmail(
      result.email,
      'Selamat datang di Program Mitra Japan Arena 🤝',
      mitraWelcomeEmailHtml({
        nama: String(body?.nama ?? 'Mitra'),
        loginUrl: `${mitraUrl}/login`,
        email: result.email,
        password: result.password,
        refLink,
        code: result.code,
      }),
    ).catch((e) => console.error('[admin/referrers] email welcome failed:', e))

    return NextResponse.json({
      referrer: {
        id: result.referrerId,
        code: result.code,
        email: result.email,
        password: result.password,
        refLink,
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Gagal membuat mitra.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// PATCH { id, action: 'suspend' | 'activate' | 'reset_password' | 'update_percent', ... }
export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, action, commission_percent, buyer_discount_percent } = await request.json()
    if (!id || !action) return NextResponse.json({ error: 'id & action wajib' }, { status: 400 })

    if (action === 'suspend' || action === 'activate') {
      const { error } = await supabaseAdmin
        .from('referrers')
        .update({ status: action === 'suspend' ? 'suspended' : 'active' })
        .eq('id', id)
      if (error) throw new Error(error.message)
      return NextResponse.json({ ok: true })
    }

    if (action === 'update_percent') {
      const payload: Record<string, number> = {}
      if (commission_percent != null) payload.commission_percent = Number(commission_percent)
      if (buyer_discount_percent != null) payload.buyer_discount_percent = Number(buyer_discount_percent)
      if (Object.keys(payload).length === 0) {
        return NextResponse.json({ error: 'Tidak ada persentase yang diubah.' }, { status: 400 })
      }
      const { error } = await supabaseAdmin.from('referrers').update(payload).eq('id', id)
      if (error) throw new Error(error.message)
      return NextResponse.json({ ok: true })
    }

    if (action === 'reset_password') {
      const { data: referrer } = await supabaseAdmin
        .from('referrers')
        .select('user_id, email')
        .eq('id', id)
        .maybeSingle()
      if (!referrer?.user_id) {
        return NextResponse.json({ error: 'Mitra belum punya akun login.' }, { status: 400 })
      }
      const password = generatePassword()
      const { error } = await supabaseAdmin.auth.admin.updateUserById(referrer.user_id, { password })
      if (error) throw new Error(error.message)
      return NextResponse.json({ account: { email: referrer.email, password } })
    }

    return NextResponse.json({ error: `Action tidak dikenal: ${action}` }, { status: 400 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Gagal memperbarui mitra.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
