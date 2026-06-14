import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { notifyCustomer } from '@/lib/fonnte'
import { generateContent } from '@/lib/build/generateContent'
import { applyBuildPlan } from '@/lib/build/persist'
import type { KonfigurasiWebsite } from '@/types/websitebuilder'

const ADMIN_WA = process.env.NEXT_PUBLIC_WA_NUMBER ?? '6281296917963'

export async function POST(request: Request) {
  try {
    const { token, briefing_data } = await request.json()
    if (!token || !briefing_data) {
      return NextResponse.json({ error: 'token dan briefing_data wajib' }, { status: 400 })
    }

    // Validate token + pastikan belum submit sebelumnya
    const { data: order, error: fetchErr } = await supabaseAdmin
      .from('orders')
      .select('id, tenant_id, tracking_token, payment_status, briefing_submitted_at, nomor_wa, nama_usaha, nama_perusahaan, industri, created_at')
      .eq('tracking_token', token)
      .maybeSingle()

    if (fetchErr) throw fetchErr
    if (!order) return NextResponse.json({ error: 'Token tidak valid' }, { status: 404 })
    if (order.payment_status !== 'dp_paid') {
      return NextResponse.json({ error: 'DP belum terbayar' }, { status: 403 })
    }
    if (order.briefing_submitted_at) {
      return NextResponse.json({ error: 'Briefing sudah pernah disubmit', alreadySubmitted: true }, { status: 409 })
    }

    // Simpan briefing_data
    const { error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({
        briefing_data,
        briefing_submitted_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    if (updateErr) throw updateErr

    // Auto-rebuild dari briefing (audit 2026-06-13, #9): provisioning meng-auto-build
    // dari briefing_data yang ada SAAT provision (sering kosong → konten contoh).
    // Saat customer submit briefing (sekali; sudah di-gate dp_paid + belum-submit di
    // atas), regenerasi draft dari brief agar situs mencerminkan isian nyata, bukan
    // sampel. Non-fatal: kegagalan build tak boleh menggagalkan submit briefing.
    if (order.tenant_id) {
      try {
        const { data: full } = await supabaseAdmin
          .from('orders')
          .select('*')
          .eq('id', order.id)
          .single()
        const { data: page } = await supabaseAdmin
          .from('landing_pages')
          .select('id, tenant_id, konfigurasi')
          .eq('tenant_id', order.tenant_id)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle()
        if (full && page) {
          const plan = generateContent(full)
          await applyBuildPlan(supabaseAdmin, {
            pageId: page.id,
            tenantId: page.tenant_id,
            currentKonfigurasi: (page.konfigurasi ?? {}) as KonfigurasiWebsite,
            plan,
            publish: false,
          })
        }
      } catch (e: any) {
        console.error('[briefing] auto-rebuild (non-fatal):', e?.message)
      }
    }

    // Notif WA ke admin (fire-and-forget)
    const clientName = order.nama_perusahaan || order.nama_usaha || 'Customer'
    const year = new Date(order.created_at ?? Date.now()).getFullYear()
    const displayId = `JA-${year}-${order.id.slice(0, 8).toUpperCase()}`
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''

    // WA ke admin
    notifyCustomer({ type: 'briefing_received' }, ADMIN_WA, {
      clientName,
      displayId,
      trackUrl: `${base}/track?id=${order.id}`,
      industri: order.industri ?? '-',
      adminUrl: `${base}/admin`,
    }).catch((e) => console.error('[briefing] WA admin notify failed:', e))

    // WA ke customer — konfirmasi briefing diterima
    if (order.nomor_wa) {
      notifyCustomer({ type: 'briefing_submitted' }, order.nomor_wa, {
        clientName,
        displayId,
        trackUrl: `${base}/track?id=${order.id}`,
      }).catch((e) => console.error('[briefing] WA customer notify failed:', e))
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[briefing] error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
