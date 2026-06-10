import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { notifyReferrer } from '@/lib/fonnte'

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

// GET : antrean pencairan (requested dulu, lalu riwayat terbaru).
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('referral_payouts')
    .select('id, amount, status, bank_snapshot, requested_at, paid_at, transfer_proof_url, admin_note, referrers(nama, email, nomor_wa)')
    .order('requested_at', { ascending: false })
    .limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const payouts = (data ?? []).sort((a, b) =>
    a.status === 'requested' && b.status !== 'requested' ? -1
    : a.status !== 'requested' && b.status === 'requested' ? 1 : 0,
  )
  return NextResponse.json({ payouts })
}

// PATCH { id, action: 'paid' | 'rejected', admin_note?, transfer_proof_url? }
//   paid     → payout paid + paid_at; earning yang diklaim → 'paid'; notif mitra.
//   rejected → payout rejected; earning dilepas (payout_id=null) kembali payable.
export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, action, admin_note, transfer_proof_url } = await request.json()
    if (!id || !['paid', 'rejected'].includes(action)) {
      return NextResponse.json({ error: 'id & action (paid|rejected) wajib' }, { status: 400 })
    }

    // Hanya payout berstatus 'requested' yang bisa diproses (idempotent).
    const { data: payout, error: updErr } = await supabaseAdmin
      .from('referral_payouts')
      .update({
        status: action,
        paid_at: action === 'paid' ? new Date().toISOString() : null,
        admin_note: admin_note ?? null,
        transfer_proof_url: transfer_proof_url ?? null,
      })
      .eq('id', id)
      .eq('status', 'requested')
      .select('id, amount, referrer_id, referrers(nama, nomor_wa)')
      .maybeSingle()
    if (updErr) throw new Error(updErr.message)
    if (!payout) {
      return NextResponse.json({ error: 'Payout tidak ditemukan / sudah diproses.' }, { status: 400 })
    }

    if (action === 'paid') {
      const { error } = await supabaseAdmin
        .from('referral_earnings')
        .update({ status: 'paid' })
        .eq('payout_id', payout.id)
        .eq('status', 'confirmed')
      if (error) throw new Error(error.message)

      const referrer = payout.referrers as unknown as { nama: string; nomor_wa: string } | null
      if (referrer?.nomor_wa) {
        const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
        notifyReferrer({ type: 'referral_payout_paid' }, referrer.nomor_wa, {
          referrerName: referrer.nama,
          amount: Number(payout.amount),
          mitraUrl: `${base}/mitra`,
        }).catch((e) => console.error('[admin/referral-payouts] WA paid failed:', e))
      }
    } else {
      // rejected → lepas klaim, komisi kembali ke saldo payable mitra.
      const { error } = await supabaseAdmin
        .from('referral_earnings')
        .update({ payout_id: null })
        .eq('payout_id', payout.id)
      if (error) throw new Error(error.message)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Gagal memproses payout.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
