import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { PAYOUT_MIN } from '@/lib/referral'
import { sendWhatsApp } from '@/lib/fonnte'

export const dynamic = 'force-dynamic'

const ADMIN_WA = process.env.NEXT_PUBLIC_WA_NUMBER ?? '6281296917963'
const rp = (n: number) => `Rp ${Math.round(n).toLocaleString('id-ID')}`

// Mitra mengajukan pencairan: klaim semua earning 'confirmed' yang belum
// di-payout (set payout_id), jumlahkan, lalu kunci nominalnya di payout row.
// Klaim via UPDATE berpredikat payout_id IS NULL → dua request bersamaan
// tidak bisa mengklaim earning yang sama.
export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: referrer } = await supabaseAdmin
      .from('referrers')
      .select('id, nama, status, bank_name, bank_account_number, bank_account_name')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!referrer) return NextResponse.json({ error: 'Akun mitra tidak ditemukan.' }, { status: 403 })
    if (referrer.status !== 'active') {
      return NextResponse.json({ error: 'Akun mitra sedang ditangguhkan.' }, { status: 403 })
    }
    if (!referrer.bank_name || !referrer.bank_account_number || !referrer.bank_account_name) {
      return NextResponse.json({ error: 'Lengkapi rekening bank terlebih dahulu.' }, { status: 400 })
    }

    // Satu pengajuan aktif dalam satu waktu.
    const { data: existing } = await supabaseAdmin
      .from('referral_payouts')
      .select('id')
      .eq('referrer_id', referrer.id)
      .eq('status', 'requested')
      .limit(1)
      .maybeSingle()
    if (existing) {
      return NextResponse.json({ error: 'Masih ada pengajuan pencairan yang sedang diproses.' }, { status: 400 })
    }

    const bankSnapshot = {
      bank_name: referrer.bank_name,
      bank_account_number: referrer.bank_account_number,
      bank_account_name: referrer.bank_account_name,
    }

    const { data: payout, error: payoutErr } = await supabaseAdmin
      .from('referral_payouts')
      .insert([{ referrer_id: referrer.id, amount: 0, status: 'requested', bank_snapshot: bankSnapshot }])
      .select('id')
      .single()
    if (payoutErr) throw new Error(payoutErr.message)

    // Klaim earning yang bisa dicairkan.
    const { data: claimed, error: claimErr } = await supabaseAdmin
      .from('referral_earnings')
      .update({ payout_id: payout.id })
      .eq('referrer_id', referrer.id)
      .eq('status', 'confirmed')
      .is('payout_id', null)
      .select('amount')

    if (claimErr) {
      await supabaseAdmin.from('referral_payouts').delete().eq('id', payout.id)
      throw new Error(claimErr.message)
    }

    const total = (claimed ?? []).reduce((acc, r) => acc + (Number(r.amount) || 0), 0)
    if (total < PAYOUT_MIN) {
      // Batal: lepas klaim + hapus payout.
      await supabaseAdmin.from('referral_earnings').update({ payout_id: null }).eq('payout_id', payout.id)
      await supabaseAdmin.from('referral_payouts').delete().eq('id', payout.id)
      return NextResponse.json(
        { error: `Saldo bisa dicairkan minimal ${rp(PAYOUT_MIN)}.` },
        { status: 400 },
      )
    }

    const { error: amountErr } = await supabaseAdmin
      .from('referral_payouts')
      .update({ amount: total })
      .eq('id', payout.id)
    if (amountErr) throw new Error(amountErr.message)

    // Notif admin (fire-and-forget).
    sendWhatsApp(
      ADMIN_WA,
      [
        `💸 *Pengajuan pencairan mitra*`,
        ``,
        `Mitra: ${referrer.nama}`,
        `Nominal: ${rp(total)}`,
        `Rekening: ${bankSnapshot.bank_name} ${bankSnapshot.bank_account_number} a.n. ${bankSnapshot.bank_account_name}`,
        ``,
        `Proses di admin: ${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/admin/mitra`,
      ].join('\n'),
    ).catch((e) => console.error('[mitra/payout] WA admin failed:', e))

    return NextResponse.json({ ok: true, amount: total })
  } catch (err) {
    console.error('[mitra/payout]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Gagal mengajukan pencairan.' }, { status: 500 })
  }
}
