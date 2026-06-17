import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { KonfigurasiWebsite, PreorderConfig } from '@/types/websitebuilder'

// POST { open, open_label?, wa_admin?, fulfillment?: ('pickup'|'delivery')[] }
// Owner mengubah setelan PO. Tenant diambil dari sesi (JWT app_metadata) →
// merge ke landing_pages.konfigurasi.preorder via service role (JSONB merge aman
// di server). Bukan satu-satunya pagar: RLS landing_pages tetap tenant-scoped.
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 })
    const tenantId = (user.app_metadata as Record<string, unknown>)?.tenant_id as string | undefined
    if (!tenantId) return NextResponse.json({ error: 'Tenant tidak ditemukan.' }, { status: 403 })

    const body = await request.json()
    const open = body.open === true
    const open_label = typeof body.open_label === 'string' && body.open_label.trim() ? body.open_label.trim().slice(0, 160) : undefined
    const wa_admin = typeof body.wa_admin === 'string' && body.wa_admin.trim() ? body.wa_admin.trim().slice(0, 30) : undefined
    const fulfillment = Array.isArray(body.fulfillment)
      ? (body.fulfillment.filter((f: unknown) => f === 'pickup' || f === 'delivery') as ('pickup' | 'delivery')[])
      : undefined

    // Halaman tenant (paling awal) — sama seperti portal/page.tsx
    const { data: page } = await supabaseAdmin
      .from('landing_pages')
      .select('id, konfigurasi')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()
    if (!page) return NextResponse.json({ error: 'Halaman tidak ditemukan.' }, { status: 404 })

    const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
    const preorder: PreorderConfig = {
      ...(konfig.preorder ?? { open: false }),
      open, open_label, wa_admin,
      fulfillment: fulfillment && fulfillment.length ? fulfillment : undefined,
    }
    const next = { ...konfig, preorder }

    const { error } = await supabaseAdmin.from('landing_pages').update({ konfigurasi: next }).eq('id', page.id)
    if (error) throw new Error(error.message)
    return NextResponse.json({ ok: true, preorder })
  } catch (err: any) {
    console.error('[portal/preorder-settings]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
