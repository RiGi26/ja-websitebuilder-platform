import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { createLandingPage } from '@/lib/supabase/websitebuilder'
import { industriToTipe, addonsToFeatures, slugify } from '@/lib/websitebuilder-mapping'

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

// Cari slug unik: kalau base sudah dipakai, tambah suffix -2, -3, ...
async function uniqueSlug(base: string): Promise<string> {
  let candidate = base
  for (let i = 2; i < 1000; i++) {
    const { data } = await supabaseAdmin
      .from('landing_pages')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle()
    if (!data) return candidate
    candidate = `${base}-${i}`
  }
  // fallback sangat tak mungkin: tambah random
  return `${base}-${Math.random().toString(36).slice(2, 7)}`
}

// ── GET: daftar tenant + halaman-nya ──────────────────────────
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { data, error } = await supabaseAdmin
      .from('tenants')
      .select('*, landing_pages(*)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ tenants: data ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ── POST { orderId }: provision tenant + landing page awal ────
export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { orderId } = await request.json()
    if (!orderId) return NextResponse.json({ error: 'orderId wajib' }, { status: 400 })

    // 1. Ambil order
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    if (orderErr) throw orderErr

    // 2. Idempotent — kalau order sudah punya tenant, kembalikan halaman existing
    if (order.tenant_id) {
      const { data: existingPage } = await supabaseAdmin
        .from('landing_pages')
        .select('*')
        .eq('tenant_id', order.tenant_id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()
      return NextResponse.json({
        tenantId: order.tenant_id,
        page: existingPage,
        alreadyProvisioned: true,
      })
    }

    const namaKlien = order.nama_perusahaan || order.nama_usaha || 'Klien Tanpa Nama'

    // 3. Buat tenant
    const { data: tenant, error: tenantErr } = await supabaseAdmin
      .from('tenants')
      .insert({
        nama: namaKlien,
        email: order.email ?? null,
        nomor_wa: order.nomor_wa ?? null,
        order_id: orderId,
      })
      .select()
      .single()
    if (tenantErr) throw tenantErr

    // 4. Buat landing page awal (status draft)
    const slug = await uniqueSlug(slugify(namaKlien))
    const page = await createLandingPage(supabaseAdmin, {
      tenant_id: tenant.id,
      nama_website: namaKlien,
      slug,
      domain_custom: null,
      tipe_industri: industriToTipe(order.industri),
      status: 'draft',
      data_konten: {},
      konfigurasi: {
        features: addonsToFeatures(order.selected_addons),
        branding: {},
      },
    })

    // 5. Link balik order -> tenant
    const { error: linkErr } = await supabaseAdmin
      .from('orders')
      .update({ tenant_id: tenant.id })
      .eq('id', orderId)
    if (linkErr) throw linkErr

    return NextResponse.json({ tenantId: tenant.id, page, alreadyProvisioned: false })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
