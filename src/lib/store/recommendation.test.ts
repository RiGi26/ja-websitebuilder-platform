import { describe, expect, it } from 'vitest'
import { createCustomizeDraft } from './customize'
import { recommendStoreSolution } from './recommendation'
import { getStoreTemplate, STORE_TEMPLATE_REGISTRY } from './templates'
import type { CapabilityId, CustomizeDraft, StoreTemplate } from './types'

function completeDraft(
  template: StoreTemplate,
  overrides: Partial<CustomizeDraft> = {},
): CustomizeDraft {
  return {
    ...createCustomizeDraft(template),
    status: 'complete',
    currentStep: 4,
    businessType: 'Bisnis contoh',
    customerNeeds: ['public.catalog'],
    operationalMode: 'none',
    ...overrides,
  }
}

function resultFor(templateSlug: StoreTemplate['slug'], overrides: Partial<CustomizeDraft> = {}) {
  const template = getStoreTemplate(templateSlug)
  return recommendStoreSolution(completeDraft(template, overrides), template)
}

describe('Store S5 recommendation engine', () => {
  it('recommends Website for public-only needs across all six templates', () => {
    for (const template of STORE_TEMPLATE_REGISTRY) {
      const result = resultFor(template.slug)

      expect(result.tier).toBe('website')
      expect(result.requiresConsultation).toBe(false)
      expect(result.evidence.publicCapabilities).toEqual(['public.catalog'])
    }
  })

  it('recommends Website + Portal for operational needs', () => {
    const result = resultFor('warm-commerce', {
      operationalMode: 'selected',
      operationalNeeds: ['ops.order-management'],
    })

    expect(result.tier).toBe('website-portal')
    expect(result.evidence.operationalCapabilities).toEqual(['ops.order-management'])
    expect(result.reasons[0]).toContain('kebutuhan pengelolaan order')
  })

  it('recommends Bundle for account needs combined with operations', () => {
    const result = resultFor('warm-commerce', {
      customerNeeds: ['public.catalog', 'account.customer-login'],
      operationalMode: 'selected',
      operationalNeeds: ['ops.order-management'],
    })

    expect(result.tier).toBe('bundle')
    expect(result.evidence.accountCapabilities).toEqual(['account.customer-login'])
    expect(result.reasons[0]).toContain('website dan portal')
  })

  it('sends generic login without a connected workflow to consultation', () => {
    const result = resultFor('trust-profile', {
      customerNeeds: ['public.business-profile', 'account.member-login'],
    })

    expect(result).toMatchObject({
      tier: 'consultation',
      consultationCode: 'ambiguous-account',
      requiresConsultation: true,
    })
  })

  it('keeps explicit no-dashboard plus public needs at Website', () => {
    const result = resultFor('modern-catalog', {
      operationalMode: 'none',
      operationalNeeds: [],
    })

    expect(result.tier).toBe('website')
  })

  it('guards contradictions, uncertainty, and empty completed drafts', () => {
    expect(resultFor('easy-booking', {
      operationalMode: 'none',
      operationalNeeds: ['ops.inventory'],
    })).toMatchObject({ tier: 'consultation', consultationCode: 'contradictory-selections' })

    expect(resultFor('care-booking', {
      uncertainties: ['customer-needs'],
      needsConsultation: true,
    })).toMatchObject({ tier: 'consultation', consultationCode: 'uncertain-needs' })

    expect(resultFor('course-enrollment', {
      customerNeeds: [],
      operationalMode: 'none',
      operationalNeeds: [],
    })).toMatchObject({ tier: 'consultation', consultationCode: 'empty-needs' })

    expect(resultFor('modern-catalog', {
      customerNeeds: [],
      operationalMode: 'selected',
      operationalNeeds: ['ops.inventory'],
    })).toMatchObject({ tier: 'consultation', consultationCode: 'empty-needs' })
  })

  it('lets actual needs outrank template baseRecommendation', () => {
    const template = getStoreTemplate('modern-catalog')
    const alteredTemplate = { ...template, baseRecommendation: 'bundle' } as StoreTemplate

    expect(recommendStoreSolution(completeDraft(alteredTemplate), alteredTemplate).tier).toBe('website')
    expect(recommendStoreSolution(completeDraft(alteredTemplate, {
      operationalMode: 'selected',
      operationalNeeds: ['ops.inventory'],
    }), alteredTemplate).tier).toBe('website-portal')
  })

  it('covers the Course Enrollment three-tier examples', () => {
    expect(resultFor('course-enrollment', {
      customerNeeds: ['public.catalog', 'public.enrollment-request'],
    }).tier).toBe('website')

    expect(resultFor('course-enrollment', {
      operationalMode: 'selected',
      operationalNeeds: ['ops.enrollment-management'],
    }).tier).toBe('website-portal')

    expect(resultFor('course-enrollment', {
      customerNeeds: ['public.catalog', 'account.student-login', 'account.learning-materials'],
    }).tier).toBe('bundle')
  })

  it('covers representative Care Booking, Easy Booking, and Warm Commerce operations', () => {
    expect(resultFor('care-booking', {
      operationalMode: 'selected',
      operationalNeeds: ['ops.booking-management'],
    }).tier).toBe('website-portal')

    expect(resultFor('easy-booking', {
      operationalMode: 'selected',
      operationalNeeds: ['ops.inventory'],
    }).tier).toBe('website-portal')

    expect(resultFor('warm-commerce', {
      operationalMode: 'selected',
      operationalNeeds: ['ops.order-management'],
    }).tier).toBe('website-portal')
  })

  it('fails safely for unknown and unsupported runtime capabilities', () => {
    const unknownCapabilityDraft = completeDraft(getStoreTemplate('warm-commerce'), {
      customerNeeds: ['public.catalog', 'public.not-real' as CapabilityId],
    })
    const unknownResult = recommendStoreSolution(unknownCapabilityDraft, getStoreTemplate('warm-commerce'))
    expect(unknownResult).toMatchObject({ tier: 'consultation', consultationCode: 'invalid-draft' })

    const unsupportedResult = resultFor('trust-profile', {
      customerNeeds: ['public.business-profile', 'account.student-login'],
    })
    expect(unsupportedResult).toMatchObject({ tier: 'consultation', consultationCode: 'unsupported-capability' })
  })

  it('returns the same deterministic result for the same draft and template', () => {
    const template = getStoreTemplate('easy-booking')
    const draft = completeDraft(template, {
      operationalMode: 'selected',
      operationalNeeds: ['ops.availability', 'ops.inventory'],
    })

    expect(recommendStoreSolution(draft, template)).toEqual(recommendStoreSolution(draft, template))
  })

  it('always returns non-empty buyer-facing Indonesian reasons', () => {
    const cases = [
      resultFor('warm-commerce'),
      resultFor('modern-catalog', { operationalMode: 'selected', operationalNeeds: ['ops.inventory'] }),
      resultFor('course-enrollment', { customerNeeds: ['public.catalog', 'account.student-login'] }),
      resultFor('trust-profile', { customerNeeds: ['public.business-profile', 'account.member-login'] }),
    ]

    for (const result of cases) {
      expect(result.reasons.length).toBeGreaterThan(0)
      expect(result.reasons.every((reason) => reason.trim().length > 20)).toBe(true)
      expect(result.reasons.every((reason) => !reason.includes('undefined'))).toBe(true)
    }
  })

  it('routes payment-management scope to consultation without implying checkout', () => {
    const result = resultFor('easy-booking', {
      operationalMode: 'selected',
      operationalNeeds: ['ops.payment-management'],
    })

    expect(result).toMatchObject({ tier: 'consultation', consultationCode: 'unsupported-scope' })
  })
})
