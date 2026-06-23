// Label maps untuk status order Portal (customer-facing). SATU sumber dipakai
// halaman lacak (/lacak/[token]) DAN engine invoice (lib/invoice) supaya konsisten
// — pelanggan lihat istilah yang sama di tracking page maupun faktur PDF.
//
// Catatan: METODE_LABEL di api/orders/route.ts SENGAJA terpisah (copy WA struk,
// kata-kata sedikit beda) — jangan disatukan agar teks WA tak berubah.

import type { MetodeBayar } from './types'

export const STATUS_BAYAR: Record<string, string> = {
  belum_bayar: 'Belum bayar',
  menunggu_verifikasi: 'Menunggu verifikasi',
  lunas: 'Lunas',
  cod: 'Bayar di kurir (COD)',
  gagal: 'Gagal',
  refund: 'Refund',
}

export const STATUS_FULFILLMENT: Record<string, string> = {
  menunggu: 'Menunggu',
  dikonfirmasi: 'Dikonfirmasi',
  diproduksi: 'Diproduksi',
  dikemas: 'Dikemas',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
  batal: 'Dibatalkan',
}

export const METODE: Record<MetodeBayar, string> = {
  transfer_jp: 'Transfer Bank (銀行振込)',
  transfer_id: 'Transfer Bank Indonesia',
  paypay: 'PayPay',
  cod_full: '代引き (COD penuh)',
  cod_ongkir: '着払い (ongkir di kurir)',
}

// Langkah fulfillment utk timeline (lacak page).
export const STEPS = ['menunggu', 'dikonfirmasi', 'diproduksi', 'dikemas', 'dikirim', 'selesai'] as const

// Status bayar yang dianggap "sudah dibayar" → invoice boleh dirender.
export const PAID_STATUSES: ReadonlySet<string> = new Set(['lunas', 'cod'])

export function isPaidStatus(statusBayar: string | null | undefined): boolean {
  return !!statusBayar && PAID_STATUSES.has(statusBayar)
}
