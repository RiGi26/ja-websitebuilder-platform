import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// Mitra memperbarui rekening pencairan miliknya sendiri. Write tetap lewat
// service role (RLS tabel referrers tanpa write policy) — identitas dari sesi.
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: referrer } = await supabaseAdmin
      .from('referrers')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
    if (!referrer) return NextResponse.json({ error: 'Akun mitra tidak ditemukan.' }, { status: 403 })

    const body = await request.json()
    const bankName = String(body?.bank_name ?? '').trim()
    const accountNumber = String(body?.bank_account_number ?? '').trim()
    const accountName = String(body?.bank_account_name ?? '').trim()

    if (!bankName || !accountNumber || !accountName) {
      return NextResponse.json({ error: 'Semua kolom rekening wajib diisi.' }, { status: 400 })
    }
    if (!/^[0-9-]{6,30}$/.test(accountNumber)) {
      return NextResponse.json({ error: 'Nomor rekening tidak valid.' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('referrers')
      .update({
        bank_name: bankName.slice(0, 60),
        bank_account_number: accountNumber,
        bank_account_name: accountName.slice(0, 120),
      })
      .eq('id', referrer.id)
    if (error) throw new Error(error.message)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[mitra/bank]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Gagal menyimpan rekening.' }, { status: 500 })
  }
}
