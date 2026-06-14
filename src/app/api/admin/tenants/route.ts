import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { createLandingPage } from '@/lib/supabase/websitebuilder'
import { industriToTipe, addonsToFeatures, slugify, industryToTheme } from '@/lib/websitebuilder-mapping'
import { createClientAccountForTenant } from '@/lib/client-account'
import { generateContent } from '@/lib/build/generateContent'
import { applyBuildPlan } from '@/lib/build/persist'
import { isOrderPaid } from '@/lib/payment-state'
import type { KonfigurasiWebsite } from '@/types/websitebuilder'

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
    const { orderId, force } = await request.json()
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

    // Payment gate (audit 2026-06-13): jangan provision + auto-build untuk order
    // yang belum bayar (invariant pendapatan). Provisioning memicu auto-build +
    // pembuatan akun login klien, jadi normalnya hanya setelah DP/lunas. Override
    // eksplisit via { force: true } untuk pengecualian (mis. prep draft manual).
    if (!force && !isOrderPaid(order.payment_status)) {
      return NextResponse.json(
        { error: 'Pembayaran belum dikonfirmasi (DP/lunas). Provisioning ditahan. Kirim { force: true } untuk override.' },
        { status: 409 },
      )
    }

    const namaKlien = order.nama_perusahaan || order.nama_usaha || 'Klien Tanpa Nama'

    // Variant + warna brand dari briefing (jika sudah diisi sebelum provisioning).
    // Render ([slug]) baca konfig.branding.variant/primary untuk resolve token pack.
    const briefBranding = (order.briefing_data as { branding?: { variant?: string; primary_color?: string } } | null)?.branding

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
    if (tenantErr) {
      // Race (audit 2026-06-13): panggilan provisioning konkuren utk order yang
      // sama sudah membuat tenant (dijaga UNIQUE tenants.order_id, code 23505).
      // Perlakukan sebagai sudah-provisioned alih-alih membuat tenant orphan.
      if ((tenantErr as { code?: string }).code === '23505') {
        const { data: existingTenant } = await supabaseAdmin
          .from('tenants')
          .select('id')
          .eq('order_id', orderId)
          .maybeSingle()
        const { data: existingPage } = existingTenant
          ? await supabaseAdmin
              .from('landing_pages')
              .select('*')
              .eq('tenant_id', existingTenant.id)
              .order('created_at', { ascending: true })
              .limit(1)
              .maybeSingle()
          : { data: null }
        return NextResponse.json({
          tenantId: existingTenant?.id ?? null,
          page: existingPage,
          alreadyProvisioned: true,
        })
      }
      throw tenantErr
    }

    // 4. Buat landing page awal (status draft)
    const slug = await uniqueSlug(slugify(namaKlien))
    const tipeIndustri = industriToTipe(order.industri)
    const page = await createLandingPage(supabaseAdmin, {
      tenant_id: tenant.id,
      nama_website: namaKlien,
      slug,
      domain_custom: null,
      tipe_industri: tipeIndustri,
      status: 'draft',
      data_konten: {},
      konfigurasi: {
        features: addonsToFeatures(order.selected_addons),
        branding: {
          theme: industryToTheme(tipeIndustri),
          ...(briefBranding?.variant ? { variant: briefBranding.variant } : {}),
          ...(briefBranding?.primary_color ? { primary: briefBranding.primary_color } : {}),
        },
      },
    })

    // 5. Link balik order -> tenant
    const { error: linkErr } = await supabaseAdmin
      .from('orders')
      .update({ tenant_id: tenant.id })
      .eq('id', orderId)
    if (linkErr) throw linkErr

    // 5b. Auto-build konten DRAFT dari briefing (non-fatal). Briefing sudah diisi
    //     saat order, jadi ini menghasilkan konten nyata; field kosong -> fallback
    //     dummy spesifik bisnis (templates.ts), BUKAN halaman kosong. Tetap draft:
    //     anon RLS memblokir status draft -> belum live sampai admin Publish dari
    //     Preview. "Bangun Draft" di kartu order tinggal jadi rebuild bila perlu.
    let built: { nSections: number } | null = null
    let buildError: string | null = null
    try {
      const plan = generateContent(order)
      built = await applyBuildPlan(supabaseAdmin, {
        pageId: page.id,
        tenantId: tenant.id,
        currentKonfigurasi: (page.konfigurasi ?? {}) as KonfigurasiWebsite,
        plan,
        publish: false,
      })
    } catch (e: any) {
      // Non-fatal (provisioning tetap sukses) TAPI jangan ditelan diam-diam
      // (audit 2026-06-13, #10): surface alasannya agar admin tahu page draft
      // mungkin kosong/sampel & perlu "Bangun Draft" ulang.
      buildError = e?.message ?? String(e)
      console.error('auto-build saat provision (non-fatal, surfaced):', {
        orderId,
        tenantId: tenant.id,
        error: buildError,
      })
    }

    // 6. Buat akun login customer (otomatis). Tidak fatal kalau gagal /
    //    tak ada email — provisioning tetap sukses, akun bisa dibuat ulang nanti.
    let clientAccount = null
    try {
      clientAccount = await createClientAccountForTenant(tenant.id, order.email, namaKlien)
    } catch (e: any) {
      console.error('createClientAccountForTenant gagal (non-fatal):', e?.message)
    }

    return NextResponse.json({ tenantId: tenant.id, page, alreadyProvisioned: false, clientAccount, built, buildError })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
