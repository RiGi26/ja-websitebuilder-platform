// ============================================================
// Notifikasi WA tahap-lanjut order (sisi WB ingest, BAKSO_PORTAL_CONTRACT.md §4.3).
// Saat Portal push perubahan status ke /api/sync/order-status, kita kirim WA ke
// PEMBELI pada dua transisi yang sebelumnya hening:
//   • pembayaran terverifikasi (… → lunas)  → payment_confirmed
//   • pesanan dikirim (… → dikirim, +resi)   → order_shipped
//
// Dedupe via kolom wa_paid_sent_at / wa_shipped_sent_at (di-set hanya saat kirim
// SUKSES) → aman terhadap push berulang / reconcile cron, dan retry bila gagal.
// Server-only. Dipanggil di dalam after() agar tak memblok response webhook.
// ============================================================
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendWhatsApp } from '@/lib/fonnte'
import { getTenantNotif, effectiveFonnteToken } from '@/lib/tenant-notif'
import { renderTemplate, type NotifVars, type NotifEventKey } from '@/lib/notif/template'
import { logWa } from '@/lib/notif/wa-log'
import { isPaidStatus, METODE } from '@/lib/portal/labels'
import { formatMoney, moneyFromConfig } from '@/lib/format-money'
import { tenantSiteOrigin } from '@/lib/tenant-site-url'
import type { MetodeBayar } from '@/lib/portal/types'
import type { KonfigurasiWebsite } from '@/types/websitebuilder'

export interface StageNotifyInput {
  orderCode: string
  tenantSlug: string
  trackingToken: string
  pembeliNama: string | null
  pembeliTelp: string | null
  metodeBayar: string | null
  totalGross: number | null
  ringkasanItems: { nama: string; qty: number; harga: number }[] | null
  /** Status SEBELUM update ini (untuk deteksi transisi). */
  prevStatusBayar: string | null
  prevStatusFulfillment: string | null
  /** Status SESUDAH update (dari payload Portal). */
  newStatusBayar: string | null
  newStatusFulfillment: string | null
  resi: string | null
  /** Penanda dedupe yang sudah tercatat (null = belum pernah terkirim). */
  waPaidSentAt: string | null
  waShippedSentAt: string | null
}

function itemsText(items: StageNotifyInput['ringkasanItems']): string {
  return (items ?? []).map((i) => `${i.nama} ×${i.qty}`).join(', ')
}

/**
 * Kirim WA tahap-lanjut bila ada transisi relevan. Idempoten via kolom *_sent_at.
 * Aman dipanggil berkali-kali untuk order yang sama (hanya kirim sekali per tahap).
 */
export async function notifyOrderStageChange(input: StageNotifyInput): Promise<void> {
  const paidNow = isPaidStatus(input.newStatusBayar) && !isPaidStatus(input.prevStatusBayar)
  const shippedNow = input.newStatusFulfillment === 'dikirim' && input.prevStatusFulfillment !== 'dikirim'

  // cod_full berstatus 'cod' (sudah "paid") sejak awal → bukan target payment_confirmed.
  const wantPaid = paidNow && input.metodeBayar !== 'cod_full' && !input.waPaidSentAt
  const wantShipped = shippedNow && !input.waShippedSentAt

  if (!wantPaid && !wantShipped) return
  if (!input.pembeliTelp) return // tak bisa kirim tanpa nomor (order pra-fitur)

  // Tenant context: token Fonnte + phone_cc + nama bisnis. landing_pages by slug.
  const { data: page } = await supabaseAdmin
    .from('landing_pages')
    .select('tenant_id, nama_website, domain_custom, konfigurasi')
    .eq('slug', input.tenantSlug)
    .eq('status', 'published')
    .maybeSingle()
  if (!page?.tenant_id) return

  const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
  const phoneCc = konfig.localeConfig?.phone_cc || '62'
  const { locale, currency } = moneyFromConfig(konfig.localeConfig)
  const notif = await getTenantNotif(page.tenant_id).catch(() => null)
  const token = notif ? effectiveFonnteToken(notif) : (process.env.FONNTE_TOKEN || undefined)

  // Tautan ke origin situs tenant (subdomain/custom domain), bukan host platform.
  const siteOrigin = tenantSiteOrigin(input.tenantSlug, page.domain_custom)
  const metodeLabel = input.metodeBayar ? (METODE[input.metodeBayar as MetodeBayar] ?? input.metodeBayar) : ''
  const vars: NotifVars = {
    nama: input.pembeliNama || 'Pelanggan',
    bisnis: page.nama_website,
    kode: input.orderCode,
    items: itemsText(input.ringkasanItems),
    total: formatMoney(input.totalGross ?? 0, locale, currency),
    bayar: metodeLabel,
    lacak: `${siteOrigin}/lacak/${input.trackingToken}`,
    resi: input.resi,
  }

  const send = async (event: NotifEventKey, sentCol: 'wa_paid_sent_at' | 'wa_shipped_sent_at') => {
    const msg = renderTemplate(event, notif?.templates[event], vars)
    const res = await sendWhatsApp(input.pembeliTelp!.trim(), msg, phoneCc, token)
    await logWa({ orderCode: input.orderCode, tenantSlug: input.tenantSlug, event, target: input.pembeliTelp!, result: res })
    // Set penanda dedupe HANYA bila sukses → gagal = biarkan reconcile/push berikutnya retry.
    if (res.ok) {
      await supabaseAdmin
        .from('order_projection')
        .update({ [sentCol]: new Date().toISOString() })
        .eq('order_code', input.orderCode)
    }
  }

  if (wantPaid) await send('payment_confirmed', 'wa_paid_sent_at')
  if (wantShipped) await send('order_shipped', 'wa_shipped_sent_at')
}

export interface TotalFinalInput {
  orderCode: string
  tenantSlug: string
  trackingToken: string
  pembeliNama: string | null
  pembeliTelp: string | null
  metodeBayar: string | null
  /** Total final (barang + ongkir) sesudah operator set ongkir. */
  totalGross: number | null
  ongkir: number | null
  /** Rekening tujuan (dari instruksi_bayar); null utk metode COD → baris di-drop. */
  rekening: string | null
  ringkasanItems: { nama: string; qty: number; harga: number }[] | null
}

/**
 * Kirim WA `total_final` ke pembeli saat operator selesai menghitung ongkir
 * (transisi ongkir_status pending→set di /api/sync/order-status). Pembeli baru
 * tahu TOTAL FINAL + rekening di sini → bayar SEKALI (model "operator finalisasi
 * ongkir"). Idempoten via kolom wa_total_sent_at (di-set hanya saat kirim sukses).
 * Server-only; dipanggil di dalam after().
 */
export async function notifyTotalFinal(input: TotalFinalInput): Promise<void> {
  if (!input.pembeliTelp) return

  const { data: page } = await supabaseAdmin
    .from('landing_pages')
    .select('tenant_id, nama_website, domain_custom, konfigurasi')
    .eq('slug', input.tenantSlug)
    .eq('status', 'published')
    .maybeSingle()
  if (!page?.tenant_id) return

  const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
  const phoneCc = konfig.localeConfig?.phone_cc || '62'
  const { locale, currency } = moneyFromConfig(konfig.localeConfig)
  const notif = await getTenantNotif(page.tenant_id).catch(() => null)
  const token = notif ? effectiveFonnteToken(notif) : (process.env.FONNTE_TOKEN || undefined)

  const siteOrigin = tenantSiteOrigin(input.tenantSlug, page.domain_custom)
  const metodeLabel = input.metodeBayar ? (METODE[input.metodeBayar as MetodeBayar] ?? input.metodeBayar) : ''
  const vars: NotifVars = {
    nama: input.pembeliNama || 'Pelanggan',
    bisnis: page.nama_website,
    kode: input.orderCode,
    items: itemsText(input.ringkasanItems),
    total: formatMoney(input.totalGross ?? 0, locale, currency),
    bayar: metodeLabel,
    lacak: `${siteOrigin}/lacak/${input.trackingToken}`,
    ongkir: formatMoney(input.ongkir ?? 0, locale, currency),
    rekening: input.rekening,
  }

  const msg = renderTemplate('total_final', notif?.templates.total_final, vars)
  const res = await sendWhatsApp(input.pembeliTelp.trim(), msg, phoneCc, token)
  await logWa({ orderCode: input.orderCode, tenantSlug: input.tenantSlug, event: 'total_final', target: input.pembeliTelp, result: res })
  if (res.ok) {
    await supabaseAdmin
      .from('order_projection')
      .update({ wa_total_sent_at: new Date().toISOString() })
      .eq('order_code', input.orderCode)
  }
}
