import { describe, expect, it } from 'vitest'
import { createCustomizeDraft, writeCustomizeDraft, CUSTOMIZE_ACTIVE_TEMPLATE_KEY } from './customize'
import { recommendStoreSolution } from './recommendation'
import { buildSummaryViewModel, buildSummaryWhatsAppMessage, resolveSummary } from './summary'
import { getStoreTemplate } from './templates'
import type { CustomizeDraft, StoreTemplate } from './types'

class MemoryStorage {
  private values = new Map<string, string>()

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }

  removeItem(key: string) {
    this.values.delete(key)
  }
}

function completeDraft(template: StoreTemplate, overrides: Partial<CustomizeDraft> = {}): CustomizeDraft {
  return {
    ...createCustomizeDraft(template),
    status: 'complete',
    currentStep: 4,
    businessType: 'Kedai makan rumahan',
    businessArea: 'Bandung dan sekitarnya',
    customerNeeds: ['public.catalog', 'public.order-request'],
    operationalMode: 'none',
    assets: {
      logo: 'ready',
      domain: 'missing',
      photos: 'help',
      catalog: 'unknown',
      'business-copy': 'unknown',
    },
    timeline: 'one-two-weeks',
    ...overrides,
  }
}

function viewModelFor(slug: StoreTemplate['slug'], overrides: Partial<CustomizeDraft> = {}) {
  const template = getStoreTemplate(slug)
  const draft = completeDraft(template, overrides)
  const recommendation = recommendStoreSolution(draft, template)
  return buildSummaryViewModel(draft, template, recommendation)
}

describe('Store S6 summary model and handoff', () => {
  it('builds a Website summary with canonical buyer-facing labels', () => {
    const viewModel = viewModelFor('warm-commerce')

    expect(viewModel).toMatchObject({
      template: { name: 'Warm Commerce', category: 'Kuliner' },
      business: { type: 'Kedai makan rumahan', category: 'Kuliner' },
      customerNeeds: ['Katalog pilihan', 'Permintaan order'],
      operationalNeeds: ['Tidak perlu dashboard khusus'],
      timeline: '1–2 minggu',
      recommendation: { tier: 'website', label: 'Website', price: { display: 'Mulai Rp600.000' } },
    })
    expect(JSON.stringify(viewModel)).not.toMatch(/public\.|ops\.|account\./)
  })

  it('builds Website + Portal, Bundle, and Consultation summaries', () => {
    expect(viewModelFor('easy-booking', {
      customerNeeds: [],
      operationalMode: 'selected',
      operationalNeeds: ['ops.booking-management', 'ops.inventory'],
    }).recommendation).toMatchObject({ tier: 'website-portal', label: 'Website + Portal', price: { display: 'Harga menyesuaikan kebutuhan' } })

    expect(viewModelFor('course-enrollment', {
      customerNeeds: ['public.catalog', 'account.student-login', 'account.learning-materials'],
    }).recommendation).toMatchObject({ tier: 'bundle', label: 'Bundle', price: { display: 'Harga menyesuaikan scope' } })

    expect(viewModelFor('course-enrollment', {
      customerNeeds: [],
      operationalMode: 'unsure',
      uncertainties: ['customer-needs', 'operational-needs'],
    }).recommendation).toMatchObject({ tier: 'consultation', label: 'Perlu konsultasi', price: { display: 'Scope dibahas saat konsultasi' } })
  })

  it('separates account needs and omits unknown readiness fields', () => {
    const viewModel = viewModelFor('course-enrollment', {
      customerNeeds: ['public.catalog', 'account.student-login'],
    })

    expect(viewModel.accountNeeds).toEqual(['Login siswa'])
    expect(viewModel.readiness).toEqual([
      { label: 'Logo bisnis', state: 'Sudah ada' },
      { label: 'Nama domain', state: 'Belum ada' },
      { label: 'Foto / visual', state: 'Perlu dibantu' },
    ])
  })

  it('generates concise deterministic WhatsApp content without internal or sensitive fields', () => {
    const viewModel = viewModelFor('warm-commerce', {
      businessArea: 'Bandung dan sekitarnya',
      customerNeeds: ['public.catalog', 'public.order-request'],
    })
    const message = buildSummaryWhatsAppMessage(viewModel)

    expect(message).toContain('Template: Warm Commerce')
    expect(message).toContain('Bisnis: Kedai makan rumahan (Kuliner)')
    expect(message).toContain('Kebutuhan customer:')
    expect(message).toContain('- Katalog pilihan')
    expect(message).toContain('Timeline: 1–2 minggu')
    expect(message).toContain('Rekomendasi awal: Website')
    expect(message).not.toMatch(/public\.|ops\.|account\.|sessionStorage|@|08\d/)
    expect(message.indexOf('Template:')).toBeLessThan(message.indexOf('Kebutuhan customer:'))
    expect(message.indexOf('Kebutuhan customer:')).toBeLessThan(message.indexOf('Timeline:'))
    expect(message.indexOf('Timeline:')).toBeLessThan(message.indexOf('Rekomendasi awal:'))
    expect(message).toBe(buildSummaryWhatsAppMessage(viewModel))
  })

  it('resolves missing, corrupt, stale, incomplete, and valid active drafts safely', () => {
    const emptyStorage = new MemoryStorage()
    expect(resolveSummary(emptyStorage)).toMatchObject({ status: 'recovery', reason: 'missing-draft' })

    emptyStorage.setItem(CUSTOMIZE_ACTIVE_TEMPLATE_KEY, 'retired-template')
    expect(resolveSummary(emptyStorage)).toMatchObject({ status: 'recovery', reason: 'stale-template', customizeRoute: null })

    const template = getStoreTemplate('warm-commerce')
    writeCustomizeDraft(emptyStorage, { ...completeDraft(template), status: 'draft' })
    expect(resolveSummary(emptyStorage)).toMatchObject({ status: 'recovery', reason: 'incomplete-draft', customizeRoute: template.customizeRoute })

    emptyStorage.setItem(`${CUSTOMIZE_ACTIVE_TEMPLATE_KEY}`, template.slug)
    emptyStorage.setItem(`webzoka.store.customize.v1:${template.slug}`, '{broken')
    expect(resolveSummary(emptyStorage)).toMatchObject({ status: 'recovery', reason: 'corrupt-draft', customizeRoute: template.customizeRoute })

    writeCustomizeDraft(emptyStorage, completeDraft(template))
    expect(resolveSummary(emptyStorage)).toMatchObject({ status: 'ready', templateSlug: template.slug })
  })
})
