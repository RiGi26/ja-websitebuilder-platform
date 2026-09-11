import { describe, expect, it } from 'vitest'
import {
  CAPABILITY_TAXONOMY,
  RECOMMENDATION_TIERS,
  V1_PRICE_PRESENTATION,
} from './capabilities'
import { STORE_TEMPLATE_REGISTRY } from './templates'
import { TEMPLATE_SLUGS } from './types'

describe('Store V2 template registry', () => {
  it('contains exactly six templates in deterministic order', () => {
    const slugs = STORE_TEMPLATE_REGISTRY.map((template) => template.slug)
    const sortOrders = STORE_TEMPLATE_REGISTRY.map((template) => template.sortOrder)

    expect(STORE_TEMPLATE_REGISTRY).toHaveLength(6)
    expect(slugs).toEqual(TEMPLATE_SLUGS)
    expect(new Set(slugs).size).toBe(6)
    expect(new Set(sortOrders).size).toBe(6)
  })

  it('resolves every baseline and optional capability through taxonomy', () => {
    for (const template of STORE_TEMPLATE_REGISTRY) {
      for (const capabilityId of [...template.capabilities, ...template.optionalCapabilities]) {
        expect(CAPABILITY_TAXONOMY[capabilityId]).toMatchObject({ id: capabilityId })
      }
    }
  })

  it('keeps customer-facing capabilities within the template baseline', () => {
    for (const template of STORE_TEMPLATE_REGISTRY) {
      for (const capabilityId of template.customerCan) {
        expect(template.capabilities).toContain(capabilityId)
      }
    }
  })

  it('uses only canonical recommendation tiers', () => {
    for (const template of STORE_TEMPLATE_REGISTRY) {
      expect(RECOMMENDATION_TIERS[template.baseRecommendation]).toBeDefined()
      expect(RECOMMENDATION_TIERS[template.upgradeRecommendation]).toBeDefined()
    }
  })

  it('keeps legacy commercial metadata out of every entry', () => {
    for (const template of STORE_TEMPLATE_REGISTRY) {
      expect(template).not.toHaveProperty('rating')
      expect(template).not.toHaveProperty('reviews')
      expect(template).not.toHaveProperty('soldCount')
    }
  })

  it('marks Warm Commerce as migrated and ready for later index merchandising', () => {
    const warmCommerce = STORE_TEMPLATE_REGISTRY.find((template) => template.slug === 'warm-commerce')

    expect(warmCommerce).toMatchObject({
      previewStatus: 'preview',
      runtimeStatus: 'local',
      runtimeOwner: 'canonical-store',
      storeIndexVisibility: 'visible',
      detailRoute: '/store/template/warm-commerce',
      previewRoute: '/store/template/warm-commerce/preview',
    })
  })

  it('exposes approved V1 price presentation without final template prices', () => {
    expect(V1_PRICE_PRESENTATION.website).toMatchObject({
      displayMode: 'starting-price',
      display: 'Mulai Rp600.000',
      startingPrice: 600_000,
    })
    expect(V1_PRICE_PRESENTATION.websitePortal).toMatchObject({
      displayMode: 'consultation',
      display: 'Harga menyesuaikan kebutuhan',
    })
    expect(V1_PRICE_PRESENTATION.bundle).toMatchObject({
      displayMode: 'consultation',
      display: 'Harga menyesuaikan scope',
    })
  })
})
