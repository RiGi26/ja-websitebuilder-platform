// ============================================================
// Program Mitra — formula tier komisi/diskon (SATU-SATUNYA tempat).
// ------------------------------------------------------------
// Modul pure tanpa dependensi server: diimpor oleh form order
// (client) DAN payment/create + referral.ts (server), sehingga
// angka diskon yang dilihat pembeli identik dengan yang ditagih.
//
// Tier ditentukan dari GROSS (harga sebelum diskon) — pakai NET
// akan sirkular karena NET bergantung pada diskonnya sendiri.
//   gross <  Rp 1jt → FLAT: diskon Rp 25rb + komisi Rp 50rb
//                     (paten, tidak terpengaruh setting per-mitra)
//   gross >= Rp 1jt → persen per-mitra (default diskon 5%, komisi
//                     10% dari NET) seperti semula
// ============================================================

export const FLAT_TIER_MAX = 1_000_000
export const FLAT_BUYER_DISCOUNT = 25_000
export const FLAT_REFERRER_COMMISSION = 50_000

export function isFlatTier(gross: number): boolean {
  return gross > 0 && gross < FLAT_TIER_MAX
}

/** Diskon pembeli. Flat tier: Rp 25rb (maks = gross); persen: round(gross × pct / 100). */
export function referralDiscountFor(gross: number, discountPercent: number): number {
  if (gross <= 0) return 0
  if (isFlatTier(gross)) return Math.min(FLAT_BUYER_DISCOUNT, gross)
  return Math.round((gross * discountPercent) / 100)
}

/** Komisi mitra. Flat tier: Rp 50rb; persen: round(net × pct / 100). */
export function commissionForOrder(gross: number, net: number, commissionPercent: number): number {
  if (isFlatTier(gross)) return FLAT_REFERRER_COMMISSION
  return Math.round((net * commissionPercent) / 100)
}
