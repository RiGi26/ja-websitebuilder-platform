import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const { token, detail_data } = await request.json()
    if (!token || !detail_data) {
      return NextResponse.json({ error: 'token dan detail_data wajib' }, { status: 400 })
    }

    const { data: order, error: fetchErr } = await supabaseAdmin
      .from('orders')
      .select('id, payment_status, briefing_submitted_at, briefing_data')
      .eq('tracking_token', token)
      .maybeSingle()

    if (fetchErr) throw fetchErr
    if (!order) return NextResponse.json({ error: 'Token tidak valid' }, { status: 404 })
    if (!order.briefing_submitted_at) {
      return NextResponse.json({ error: 'Briefing Tahap 1 belum disubmit' }, { status: 403 })
    }

    // Merge tahap_2 ke briefing_data tanpa overwrite Tahap 1
    const merged = {
      ...(order.briefing_data as Record<string, unknown> ?? {}),
      tahap_2: detail_data,
    }

    const { error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({ briefing_data: merged })
      .eq('id', order.id)

    if (updateErr) throw updateErr
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[briefing/detail]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
