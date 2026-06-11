import { describe, it, expect } from 'vitest'
import {
  FLAT_TIER_MAX,
  FLAT_BUYER_DISCOUNT,
  FLAT_REFERRER_COMMISSION,
  isFlatTier,
  referralDiscountFor,
  commissionForOrder,
} from './referral-tier'

describe('isFlatTier — batas Rp 1 juta', () => {
  it('di bawah 1 juta = flat', () => {
    expect(isFlatTier(999_999)).toBe(true)
    expect(isFlatTier(600_000)).toBe(true)
  })

  it('tepat 1 juta dan di atasnya = persen', () => {
    expect(isFlatTier(FLAT_TIER_MAX)).toBe(false)
    expect(isFlatTier(1_000_000)).toBe(false)
    expect(isFlatTier(4_500_000)).toBe(false)
  })

  it('gross 0/negatif bukan flat tier', () => {
    expect(isFlatTier(0)).toBe(false)
    expect(isFlatTier(-1)).toBe(false)
  })
})

describe('referralDiscountFor', () => {
  it('flat tier: diskon paten Rp 25.000, persen mitra diabaikan', () => {
    expect(referralDiscountFor(750_000, 5)).toBe(FLAT_BUYER_DISCOUNT)
    expect(referralDiscountFor(750_000, 50)).toBe(FLAT_BUYER_DISCOUNT)
    expect(referralDiscountFor(999_999, 0)).toBe(FLAT_BUYER_DISCOUNT)
  })

  it('flat tier: diskon tidak pernah melebihi gross', () => {
    expect(referralDiscountFor(20_000, 5)).toBe(20_000)
  })

  it('persen tier: round(gross × pct / 100)', () => {
    expect(referralDiscountFor(1_000_000, 5)).toBe(50_000)
    expect(referralDiscountFor(4_500_000, 5)).toBe(225_000)
    // pembulatan
    expect(referralDiscountFor(1_234_567, 5)).toBe(Math.round((1_234_567 * 5) / 100))
  })

  it('gross 0 → diskon 0', () => {
    expect(referralDiscountFor(0, 5)).toBe(0)
  })
})

describe('commissionForOrder', () => {
  it('flat tier: komisi paten Rp 50.000, persen mitra diabaikan', () => {
    expect(commissionForOrder(750_000, 725_000, 10)).toBe(FLAT_REFERRER_COMMISSION)
    expect(commissionForOrder(999_999, 974_999, 25)).toBe(FLAT_REFERRER_COMMISSION)
  })

  it('persen tier: dihitung dari NET, bukan gross', () => {
    // gross 1jt, diskon 5% → net 950rb, komisi 10% dari net = 95rb
    expect(commissionForOrder(1_000_000, 950_000, 10)).toBe(95_000)
    expect(commissionForOrder(4_500_000, 4_275_000, 10)).toBe(427_500)
  })

  it('persen tier: pembulatan Math.round', () => {
    expect(commissionForOrder(1_000_001, 950_001, 10)).toBe(Math.round((950_001 * 10) / 100))
  })
})
