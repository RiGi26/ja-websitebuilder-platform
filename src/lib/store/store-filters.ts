import { CAPABILITY_TAXONOMY } from './capabilities'
import {
  BUSINESS_TYPE_LABELS,
  STORE_CATEGORY_LABELS,
} from './templates'
import type { CapabilityId, StoreCategoryId, StoreTemplate } from './types'

export type StoreFilterState = {
  query: string
  category: StoreCategoryId | ''
  intent: CapabilityId | ''
}

export function getTemplateSearchText(template: StoreTemplate): string {
  const capabilityIds = [
    ...template.capabilities,
    ...template.optionalCapabilities,
    ...template.customerCan,
  ]

  return [
    template.name,
    template.shortName,
    STORE_CATEGORY_LABELS[template.category],
    template.businessTypes.map((id) => BUSINESS_TYPE_LABELS[id]).join(' '),
    template.shortDescription,
    template.positioning,
    capabilityIds.map((id) => CAPABILITY_TAXONOMY[id].label).join(' '),
  ].join(' ').toLocaleLowerCase('id-ID')
}

export function matchesStoreFilters(template: StoreTemplate, filters: StoreFilterState): boolean {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase('id-ID')
  const queryMatches = !normalizedQuery || getTemplateSearchText(template).includes(normalizedQuery)
  const categoryMatches = !filters.category || template.category === filters.category
  const intentMatches = !filters.intent
    || [...template.capabilities, ...template.optionalCapabilities].includes(filters.intent)

  return queryMatches && categoryMatches && intentMatches
}
