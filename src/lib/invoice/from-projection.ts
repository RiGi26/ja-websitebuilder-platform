// Adapter: order_projection (mirror Portal, anti-PII) + meta tenant → InvoiceData.
// Field pelanggan yang tersedia HANYA pembeli_nama (kontrak §8) — cukup untuk faktur
// makanan. Identitas penjual (alamat/kontak/logo/warna) diambil dari landing_pages +
// tenant_profile milik tenant.

import { supabaseAdmin } from '@/lib/supabase-admin'
import { STATUS_BAYAR, METODE } from '@/lib/portal/labels'
import type { MetodeBayar } from '@/lib/portal/types'
import type { InvoiceData, InvoiceItem } from './types'

export interface ProjectionRow {
  order_code: string
  tenant_slug: string
  pembeli_nama: string | null
  status_bayar: string
  metode_bayar: string | null
  ringkasan_items: Array<{ nama: string; qty: number; harga: number }> | null
  total_online: number | string | null
  total_courier: number | string | null
  total_gross: number | string | null
  biaya_kurir: number | string | null
  resi: string | null
  tgl_kirim: string | null
  jam_kirim: string | null
  created_at: string | null
}

const num = (v: number | string | null | undefined) => Number(v) || 0

async function getTenantMeta(slug: string) {
  const { data: page } = await supabaseAdmin
    .from('landing_pages')
    .select('id, tenant_id, nama_website, konfigurasi')
    .eq('slug', slug)
    .maybeSingle()

  const konfig = (page?.konfigurasi ?? {}) as {
    localeConfig?: { locale?: string; currency?: string }
    branding?: { logo_url?: string; primary?: string }
  }

  // Kontak penjual dari tenant_profile (alamat/wa/email) — boleh kosong.
  let profile: { alamat?: string | null; wa?: string | null; email?: string | null } | null = null
  if (page?.id) {
    const { data } = await supabaseAdmin
      .from('tenant_profile')
      .select('alamat, wa, email')
      .eq('page_id', page.id)
      .maybeSingle()
    profile = data
  }

  return {
    nama: (page?.nama_website as string) || 'Toko',
    locale: konfig.localeConfig?.locale || 'id-ID',
    currency: konfig.localeConfig?.currency || 'IDR',
    logoUrl: konfig.branding?.logo_url ?? null,
    primary: konfig.branding?.primary ?? null,
    alamat: profile?.alamat ?? null,
    wa: profile?.wa ?? null,
    email: profile?.email ?? null,
  }
}

export async function invoiceDataFromProjection(p: ProjectionRow): Promise<InvoiceData> {
  const meta = await getTenantMeta(p.tenant_slug)

  const items: InvoiceItem[] = (p.ringkasan_items ?? []).map((it) => ({
    nama: it.nama,
    qty: Number(it.qty) || 0,
    harga: Number(it.harga) || 0,
    subtotal: (Number(it.harga) || 0) * (Number(it.qty) || 0),
  }))

  const metode = p.metode_bayar as MetodeBayar | null

  return {
    seller: {
      nama: meta.nama,
      alamat: meta.alamat,
      wa: meta.wa,
      email: meta.email,
      logoUrl: meta.logoUrl,
      primary: meta.primary,
    },
    buyerNama: p.pembeli_nama,
    orderCode: p.order_code,
    tanggal: p.created_at,
    items,
    totalGross: num(p.total_gross),
    totalOnline: num(p.total_online),
    totalCourier: num(p.total_courier),
    biayaKurir: num(p.biaya_kurir),
    metodeLabel: (metode && METODE[metode]) || (p.metode_bayar ?? '-'),
    statusBayarLabel: STATUS_BAYAR[p.status_bayar] ?? p.status_bayar,
    tglKirim: p.tgl_kirim,
    jamKirim: p.jam_kirim,
    resi: p.resi,
    locale: meta.locale,
    currency: meta.currency,
  }
}
