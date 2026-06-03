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
      .select('id, payment_status, briefing_submitted_at, briefing_data, tenant_id')
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

    // Auto-update landing_pages.data_konten dengan foto + testimoni
    if (order.tenant_id) {
      const { foto_hero, foto_items, testimoni, kebijakan } = detail_data as {
        foto_hero?: string
        foto_items?: { label: string; url: string }[]
        testimoni?: { nama: string; kota: string; teks: string; bintang: number }[]
        kebijakan?: string
      }

      const { data: lp } = await supabaseAdmin
        .from('landing_pages')
        .select('id, data_konten')
        .eq('tenant_id', order.tenant_id)
        .maybeSingle()

      if (lp) {
        const existing = (lp.data_konten as Record<string, unknown>) ?? {}
        const validFotoItems = foto_items?.filter(f => f.url?.trim())
        const validTestimoni = testimoni?.filter(t => t.nama?.trim() && t.teks?.trim())
          .map(t => ({ ...t, bintang: Number(t.bintang) || 5 }))

        const updates: Record<string, unknown> = {}
        if (foto_hero?.trim()) updates.foto_hero = foto_hero.trim()
        if (validFotoItems?.length) updates.foto_items = validFotoItems
        if (validTestimoni?.length) updates.testimoni = validTestimoni
        if (kebijakan?.trim()) updates.kebijakan = kebijakan.trim()

        if (Object.keys(updates).length > 0) {
          await supabaseAdmin
            .from('landing_pages')
            .update({ data_konten: { ...existing, ...updates } })
            .eq('id', lp.id)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[briefing/detail]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
