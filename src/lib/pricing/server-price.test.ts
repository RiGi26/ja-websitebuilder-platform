import { describe, it, expect } from 'vitest'
import { computeServerPrice } from './server-price'

// SECURITY regression: the server must price authoritatively and never trust a
// client-supplied total. These cases mirror the two pricing models the order
// form uses (see server-price.ts) and the corp calculator's exact formula.
describe('computeServerPrice — WB-native path', () => {
  it('prices a known template + offered add-on from trusted tables', () => {
    // toko-online price_numeric = 1_899_000; addon "shop" = 450_000.
    const r = computeServerPrice({ template_id: 'toko-online', selected_addons: ['shop'] })
    expect(r.path).toBe('native')
    expect(r.gross).toBe(1_899_000 + 450_000)
  })

  it('ignores unknown/unoffered add-on ids (cannot inflate or be charged junk)', () => {
    const r = computeServerPrice({ template_id: 'company-pro', selected_addons: ['does-not-exist'] })
    expect(r.gross).toBe(999_000) // company-pro base, unknown addon contributes 0
  })

  it('bare order (no template, no calculator) falls back to the default base', () => {
    const r = computeServerPrice({ template_id: null, selected_addons: [] })
    expect(r.path).toBe('native-default')
    expect(r.gross).toBe(499_000)
  })

  it('a tampered/invalid template id degrades to the default base, never the claimed price', () => {
    const r = computeServerPrice({ template_id: 'totally-fake', selected_addons: [] })
    expect(r.gross).toBe(499_000)
  })
})

describe('computeServerPrice — corp calculator path', () => {
  it('package + priced add-ons matches corp setupTotal (incl. manual add-ons)', () => {
    // Basic 600k + admin-dash 250k + seo 150k + g-sheets(manual) 150k
    const r = computeServerPrice({
      paket: 'Basic', from_kalkulator: true,
      kalkulator_addons: 'admin-dash,seo,g-sheets',
    })
    expect(r.path).toBe('kalkulator')
    expect(r.gross).toBe(600_000 + 250_000 + 150_000 + 150_000)
    expect(r.maintenance).toBe(
      450_000 + Math.round(250_000 * 0.75) + Math.round(150_000 * 0.75) + Math.round(150_000 * 0.75),
    )
  })

  it('uses the fixed BUNDLE price, not the un-discounted sum', () => {
    // toko-online bundle: Starter + cart,checkout,midtrans,wa-auto → bundlePrice 1_699_000
    const r = computeServerPrice({
      paket: 'Starter', from_kalkulator: true, bundle: 'toko-online',
      kalkulator_addons: 'cart,checkout,midtrans,wa-auto',
    })
    expect(r.path).toBe('kalkulator-bundle')
    expect(r.gross).toBe(1_699_000)
  })

  it('non-priced add-ons (portal/soon) contribute 0', () => {
    // ppdb (portal) + stock (soon) are not priced → Starter base only.
    const r = computeServerPrice({
      paket: 'Starter', from_kalkulator: true, kalkulator_addons: 'ppdb,stock',
    })
    expect(r.gross).toBe(1_200_000)
  })

  it('rejects (gross=null) an unknown/tampered package name — fail closed', () => {
    const r = computeServerPrice({ paket: 'FreeForMe', from_kalkulator: true })
    expect(r.gross).toBeNull()
    expect(r.path).toBe('unpriceable')
  })
})
