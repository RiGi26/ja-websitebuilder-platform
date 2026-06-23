import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit'
import {
  getTenantNotif, getTenantNotifStatus, saveTenantNotif, effectiveFonnteToken,
} from '@/lib/tenant-notif'
import {
  validateTemplate, renderTemplate, NOTIF_EVENTS, type NotifEventKey, type NotifVars,
} from '@/lib/notif/template'
import { sendWhatsApp } from '@/lib/fonnte'
import type { KonfigurasiWebsite } from '@/types/websitebuilder'

// ============================================================
// Self-service notifikasi WA per-tenant (Phase 2 UI backend).
// GET  → status (TANPA token mentah). POST → simpan (validateTemplate = gerbang)
// atau action:'test' (kirim 1 WA uji, rate-limited). Tenant dari sesi (JWT).
// ============================================================

async function getSessionTenantId(): Promise<string | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const tid = (user.app_metadata as Record<string, unknown>)?.tenant_id
  return typeof tid === 'string' ? tid : null
}

function sampleVars(bisnis: string): NotifVars {
  return {
    nama: 'Budi Santoso', bisnis, kode: 'BT-2606-0042',
    items: 'Bakso Campur ×2, Es Teh ×1', total: '¥1.800', bayar: 'Transfer Bank',
    lacak: 'https://situsanda.com/lacak/abc123', alamat: 'Shibuya 1-2-3, Tokyo',
    catatan: 'pedas sedang', tanggal: '2026-06-25',
    invoice: 'https://situsanda.com/invoice/abc123',
  }
}

export async function GET() {
  const tenantId = await getSessionTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const status = await getTenantNotifStatus(tenantId)
  return NextResponse.json({ status })
}

export async function POST(request: Request) {
  const tenantId = await getSessionTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()

    // ── Aksi: kirim WA uji (rate-limited per tenant) ──
    if (body.action === 'test') {
      const rl = rateLimit(`notif:test:${tenantId}:${clientIp(request)}`, 5, 60_000)
      if (!rl.allowed) return tooManyRequests(rl.retryAfter)

      const phone = String(body.phone || '').trim()
      if (!phone) return NextResponse.json({ ok: false, error: 'Nomor tujuan wajib diisi.' }, { status: 400 })
      const event: NotifEventKey = body.event === 'order_admin' ? 'order_admin' : 'order_receipt'

      const { data: page } = await supabaseAdmin
        .from('landing_pages')
        .select('nama_website, konfigurasi')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()
      const konfig = (page?.konfigurasi ?? {}) as KonfigurasiWebsite
      const cc = konfig.localeConfig?.phone_cc || '62'

      const notif = await getTenantNotif(tenantId)
      const token = effectiveFonnteToken(notif)
      const rendered = renderTemplate(event, notif.templates[event], sampleVars(page?.nama_website || 'Bisnis Anda'))
      const msg = `🧪 *Pesan uji dari portal* — abaikan bila Anda menerima ini sebagai pelanggan.\n\n${rendered}`

      const res = await sendWhatsApp(phone, msg, cc, token)
      if (!res.ok) {
        const reason = res.error === 'no_token'
          ? 'Belum ada token WA aktif (token tenant non-aktif & platform kosong).'
          : res.error === 'invalid_phone' ? 'Nomor tujuan tidak valid.' : res.error
        return NextResponse.json({ ok: false, error: reason }, { status: 400 })
      }
      return NextResponse.json({ ok: true })
    }

    // ── Simpan konfigurasi (token / aktif / templates) ──
    let templates: Partial<Record<NotifEventKey, string>> | undefined
    if (body.templates && typeof body.templates === 'object') {
      templates = {}
      const errors: Partial<Record<NotifEventKey, string[]>> = {}
      for (const k of Object.keys(NOTIF_EVENTS) as NotifEventKey[]) {
        const t = body.templates[k]
        if (typeof t === 'string' && t.trim()) {
          const v = validateTemplate(k, t)
          if (!v.ok) { errors[k] = v.errors; continue }
          templates[k] = t
        }
        // string kosong → key dibuang (saveTenantNotif simpan hanya yang non-kosong) = pakai default
      }
      if (Object.keys(errors).length) {
        return NextResponse.json({ error: 'template_invalid', errors }, { status: 400 })
      }
    }

    await saveTenantNotif(tenantId, {
      token: typeof body.token === 'string' ? body.token : undefined,
      isActive: typeof body.isActive === 'boolean' ? body.isActive : undefined,
      templates,
    })

    const status = await getTenantNotifStatus(tenantId)
    return NextResponse.json({ status })
  } catch (err) {
    console.error('[portal/notifications]', (err as Error)?.message)
    return NextResponse.json({ error: (err as Error)?.message || 'server_error' }, { status: 500 })
  }
}
