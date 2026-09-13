import { describe, expect, it } from 'vitest'
import { CAPABILITY_TAXONOMY } from './capabilities'
import {
  createCustomizeDraft,
  customizeStorageKey,
  deserializeCustomizeDraft,
  getCustomizeConfig,
  isCustomizeDraft,
  readCustomizeDraft,
  resetCustomizeDraft,
  serializeCustomizeDraft,
  setOperationalMode,
  setOperationalNeeds,
  writeCustomizeDraft,
} from './customize'
import { getStoreTemplateBySlug, STORE_TEMPLATE_REGISTRY } from './templates'
import { TEMPLATE_SLUGS } from './types'

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

describe('Store S4 Customize model', () => {
  it('resolves one shared Customize contract for all six template slugs', () => {
    expect(TEMPLATE_SLUGS).toHaveLength(6)

    for (const template of STORE_TEMPLATE_REGISTRY) {
      const config = getCustomizeConfig(template)
      expect(template.customizeRoute).toBe(`/store/customize/${template.slug}`)
      expect(config.customerCapabilities.length).toBeGreaterThan(0)
      expect(config.operationalCapabilities.length).toBeGreaterThan(0)
      expect(new Set(config.customerCapabilities).size).toBe(config.customerCapabilities.length)
      expect(new Set(config.operationalCapabilities).size).toBe(config.operationalCapabilities.length)

      for (const id of config.customerCapabilities) {
        expect(CAPABILITY_TAXONOMY[id].group).toMatch(/public|account/)
      }
      for (const id of config.operationalCapabilities) {
        expect(CAPABILITY_TAXONOMY[id].group).toBe('operational')
      }
    }
  })

  it('keeps unknown template slugs outside the Customize resolver', () => {
    expect(getStoreTemplateBySlug('not-a-template')).toBeUndefined()
  })

  it('serializes and restores a draft only for the same template', () => {
    const storage = new MemoryStorage()
    const template = STORE_TEMPLATE_REGISTRY[0]
    const draft = { ...createCustomizeDraft(template), businessType: 'Kedai makan rumahan' }

    expect(writeCustomizeDraft(storage, draft)).toBe(true)
    expect(storage.getItem(customizeStorageKey(template.slug))).toBe(serializeCustomizeDraft(draft))
    expect(readCustomizeDraft(storage, template.slug)).toEqual(draft)
    expect(readCustomizeDraft(storage, STORE_TEMPLATE_REGISTRY[1].slug)).toBeNull()
  })

  it('rejects corrupt, duplicate, and unknown capability payloads safely', () => {
    const template = STORE_TEMPLATE_REGISTRY[0]
    const draft = createCustomizeDraft(template)

    expect(deserializeCustomizeDraft('{not-json', template.slug)).toBeNull()
    expect(deserializeCustomizeDraft(JSON.stringify({ ...draft, templateSlug: 'modern-catalog' }), template.slug)).toBeNull()
    expect(isCustomizeDraft({ ...draft, customerNeeds: ['public.catalog', 'public.catalog'] })).toBe(false)
    expect(isCustomizeDraft({ ...draft, customerNeeds: ['public.not-real'] })).toBe(false)
    expect(isCustomizeDraft({ ...draft, operationalNeeds: ['public.catalog'] })).toBe(false)
  })

  it('makes no-dashboard and unsure operational paths mutually exclusive', () => {
    const draft = createCustomizeDraft(STORE_TEMPLATE_REGISTRY[0])
    const selected = setOperationalNeeds(draft, ['ops.inventory'])
    expect(selected.operationalMode).toBe('selected')
    expect(selected.operationalNeeds).toEqual(['ops.inventory'])

    const noDashboard = setOperationalMode(selected, 'none')
    expect(noDashboard.operationalMode).toBe('none')
    expect(noDashboard.operationalNeeds).toEqual([])
    expect(noDashboard.uncertainties).not.toContain('operational-needs')

    const unsure = setOperationalMode(selected, 'unsure')
    expect(unsure.operationalMode).toBe('unsure')
    expect(unsure.operationalNeeds).toEqual([])
    expect(unsure.uncertainties).toContain('operational-needs')
    expect(unsure.needsConsultation).toBe(true)
  })

  it('resets only the current template draft', () => {
    const storage = new MemoryStorage()
    const warm = { ...createCustomizeDraft(STORE_TEMPLATE_REGISTRY[0]), businessType: 'Kedai makan' }
    const modern = { ...createCustomizeDraft(STORE_TEMPLATE_REGISTRY[1]), businessType: 'Brand fashion' }

    writeCustomizeDraft(storage, warm)
    writeCustomizeDraft(storage, modern)
    expect(resetCustomizeDraft(storage, warm.templateSlug)).toBe(true)
    expect(readCustomizeDraft(storage, warm.templateSlug)).toBeNull()
    expect(readCustomizeDraft(storage, modern.templateSlug)).toEqual(modern)
  })
})
