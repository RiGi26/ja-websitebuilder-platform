import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { generateContent } from '@/lib/build/generateContent'
import { applyBuildPlan } from '@/lib/build/persist'
import { isOrderPaid } from '@/lib/payment-state'
import type { KonfigurasiWebsite } from '@/types/websitebuilder'

// F1-3 — Bangun website otomatis dari order.
// POST /api/admin/build-order/[id]  body: { publish?: boolean } (default true)
// Alur: order -> generateContent (kode, nol-opex) -> applyBuildPlan (tulis +
// publish). Idempoten: panggil 2x tidak menggandakan section. Guard admin.

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id: orderId } = await params
    if (!orderId) return NextResponse.json({ error: 'orderId wajib' }, { status: 400 })

    // publish default true; kirim { publish: false } untuk build sebagai draft.
    let publish = true
    let force = false
    try {
      const body = await request.json()
      if (body && typeof body.publish === 'boolean') publish = body.publish
      if (body && body.force === true) force = true
    } catch {
      // body kosong -> pakai default
    }

    // 1. Ambil order.
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    if (orderErr || !order) {
      return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })
    }

    // Payment gate (audit 2026-06-13): jangan PUBLISH (situs jadi live) sebelum
    // bayar DP/lunas. Build draft (publish:false) tetap diizinkan utk persiapan.
    // Override eksplisit via { force: true }.
    if (publish && !force && !isOrderPaid(order.payment_status)) {
      return NextResponse.json(
        { error: 'Pembayaran belum dikonfirmasi (DP/lunas) — tidak bisa publish situs. Build draft (publish:false) tetap diizinkan.' },
        { status: 409 },
      )
    }

    // 2. Wajib sudah di-provision (tenant + landing page). Kalau belum, arahkan
    //    admin klik "Buatkan Website" dulu.
    if (!order.tenant_id) {
      return NextResponse.json(
        { error: 'Website belum di-provision. Klik "Buatkan Website" dulu.' },
        { status: 409 },
      )
    }

    const { data: page, error: pageErr } = await supabaseAdmin
      .from('landing_pages')
      .select('id, tenant_id, slug, konfigurasi')
      .eq('tenant_id', order.tenant_id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()
    if (pageErr) throw pageErr
    if (!page) {
      return NextResponse.json(
        { error: 'Landing page belum ada. Provision ulang lewat "Buatkan Website".' },
        { status: 409 },
      )
    }

    // 3. Generate konten (murni kode) lalu tulis ke DB.
    const plan = generateContent(order)
    const result = await applyBuildPlan(supabaseAdmin, {
      pageId: page.id,
      tenantId: page.tenant_id,
      currentKonfigurasi: (page.konfigurasi ?? {}) as KonfigurasiWebsite,
      plan,
      publish,
    })

    return NextResponse.json({
      ok: true,
      slug: page.slug,
      pageId: page.id,
      ...result,
      summary: plan.summary,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
