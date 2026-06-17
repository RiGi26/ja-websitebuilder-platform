// Format mata uang per-tenant.
//
// Default IDR/id-ID supaya tenant Indonesia existing TIDAK berubah (byte-identical
// dengan pola lama `'Rp ' + n.toLocaleString('id-ID')`). Tenant lain (mis. JPY/ja-JP)
// override via `landing_pages.konfigurasi.localeConfig`.
//
// Implementasi eksplisit (bukan Intl currency style) untuk menjamin parity:
// Intl.NumberFormat currency dapat menyisipkan non-breaking space yang berbeda
// dari output lama → di sini kita reproduksi format manual yang sudah dipakai.

import type { LocaleConfig } from '@/types/websitebuilder'

export function formatMoney(n: number, locale = 'id-ID', currency = 'IDR'): string {
  const v = Math.round(Number(n) || 0)
  if (currency === 'IDR') return 'Rp ' + v.toLocaleString('id-ID')
  if (currency === 'JPY') return '¥' + v.toLocaleString('ja-JP')
  // Fallback umum untuk mata uang lain.
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v)
}

// Ambil locale + currency dari konfigurasi tenant (fallback ke default IDR/id-ID).
export function moneyFromConfig(cfg?: LocaleConfig | null): { locale: string; currency: string } {
  return { locale: cfg?.locale || 'id-ID', currency: cfg?.currency || 'IDR' }
}
