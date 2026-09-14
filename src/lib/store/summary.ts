import {
  BUSINESS_CATEGORY_OPTIONS,
  CONTACT_CHANNEL_OPTIONS,
  CURRENT_WEBSITE_STATUS_OPTIONS,
  deserializeCustomizeDraft,
  READINESS_STATE_OPTIONS,
  readActiveCustomizeTemplate,
  TIMELINE_OPTIONS,
  customizeStorageKey,
  getCustomizeConfig,
  type CustomizeStorage,
} from './customize'
import { CAPABILITY_TAXONOMY, RECOMMENDATION_TIERS, V1_PRICE_PRESENTATION } from './capabilities'
import { recommendStoreSolution } from './recommendation'
import { getStoreTemplateBySlug } from './templates'
import type {
  CapabilityId,
  CustomizeDraft,
  PricePresentation,
  RecommendationResult,
  RecommendationTier,
  StoreTemplate,
  TemplateSlug,
} from './types'

export interface SummaryReadinessItem {
  readonly label: string
  readonly state: string
}

export interface SummaryViewModel {
  readonly template: {
    readonly name: string
    readonly category: string
    readonly description: string
    readonly customizeRoute: StoreTemplate['customizeRoute']
    readonly detailRoute: StoreTemplate['detailRoute']
  }
  readonly business: {
    readonly type: string
    readonly category: string
    readonly area: string | null
    readonly websiteStatus: string
    readonly contactChannels: readonly string[]
  }
  readonly customerNeeds: readonly string[]
  readonly operationalNeeds: readonly string[]
  readonly accountNeeds: readonly string[]
  readonly readiness: readonly SummaryReadinessItem[]
  readonly timeline: string
  readonly recommendation: {
    readonly tier: RecommendationTier
    readonly label: string
    readonly summary: string
    readonly reasons: readonly string[]
    readonly price: {
      readonly display: string
      readonly note: string
    }
    readonly requiresConsultation: boolean
  }
}

export type SummaryRecoveryReason =
  | 'missing-draft'
  | 'corrupt-draft'
  | 'stale-template'
  | 'incomplete-draft'

export type SummaryResolution =
  | { readonly status: 'ready'; readonly templateSlug: TemplateSlug; readonly viewModel: SummaryViewModel }
  | {
      readonly status: 'recovery'
      readonly reason: SummaryRecoveryReason
      readonly customizeRoute: StoreTemplate['customizeRoute'] | null
    }

const WEBSITE_STATUS_LABELS = Object.fromEntries(
  CURRENT_WEBSITE_STATUS_OPTIONS.map((option) => [option.id, option.label]),
) as Record<CustomizeDraft['currentWebsiteStatus'], string>

const CONTACT_CHANNEL_LABELS = Object.fromEntries(
  CONTACT_CHANNEL_OPTIONS.map((option) => [option.id, option.label]),
) as Record<CustomizeDraft['currentContactChannels'][number], string>

const READINESS_STATE_LABELS = Object.fromEntries(
  READINESS_STATE_OPTIONS.map((option) => [option.id, option.label]),
) as Record<Exclude<CustomizeDraft['assets'][keyof CustomizeDraft['assets']], 'unknown'>, string>

const TIMELINE_LABELS = Object.fromEntries(
  TIMELINE_OPTIONS.map((option) => [option.id, option.label]),
) as Record<CustomizeDraft['timeline'], string>

const CATEGORY_LABELS = Object.fromEntries(
  BUSINESS_CATEGORY_OPTIONS.map((option) => [option.id, option.label]),
) as Record<CustomizeDraft['businessCategory'], string>

const CONSULTATION_PRICE = {
  display: 'Kebutuhan dibahas saat konsultasi',
  note: 'Kebutuhan yang belum jelas dibahas bersama sebelum pekerjaan ditentukan.',
} as const

function priceForTier(tier: RecommendationTier): PricePresentation['website'] | PricePresentation['websitePortal'] | PricePresentation['bundle'] | typeof CONSULTATION_PRICE {
  if (tier === 'website') return V1_PRICE_PRESENTATION.website
  if (tier === 'website-portal') return V1_PRICE_PRESENTATION.websitePortal
  if (tier === 'bundle') return V1_PRICE_PRESENTATION.bundle
  return CONSULTATION_PRICE
}

function capabilityLabels(ids: readonly CapabilityId[]): string[] {
  return ids.map((id) => CAPABILITY_TAXONOMY[id].label)
}

function safeRecommendation(draft: CustomizeDraft, template: StoreTemplate): RecommendationResult {
  try {
    return recommendStoreSolution(draft, template)
  } catch {
    return {
      tier: 'consultation',
      label: RECOMMENDATION_TIERS.consultation.label,
      summary: 'Jawabanmu perlu dibahas bersama sebelum kebutuhan ditentukan.',
      reasons: ['Rekomendasi awal belum dapat dihitung dengan aman, jadi konsultasi menjadi langkah berikutnya.'],
      evidence: { publicCapabilities: [], operationalCapabilities: [], accountCapabilities: [] },
      templateSlug: template.slug,
      requiresConsultation: true,
      consultationCode: 'invalid-draft',
    }
  }
}

function normalizeList(items: readonly string[], fallback: string): string[] {
  return items.length > 0 ? [...items] : [fallback]
}

export function buildSummaryViewModel(
  draft: CustomizeDraft,
  template: StoreTemplate,
  recommendation: RecommendationResult = safeRecommendation(draft, template),
): SummaryViewModel {
  const customizeConfig = getCustomizeConfig(template)
  const publicNeeds = draft.customerNeeds.filter((id) => CAPABILITY_TAXONOMY[id].group === 'public')
  const accountNeeds = draft.customerNeeds.filter((id) => CAPABILITY_TAXONOMY[id].group === 'account')
  const operationalNeeds = draft.operationalMode === 'none'
    ? ['Belum perlu halaman kerja untuk tim']
    : draft.operationalMode === 'unsure'
      ? ['Belum yakin']
      : normalizeList(capabilityLabels(draft.operationalNeeds), 'Belum dipilih')

  const readiness = (Object.entries(draft.assets) as Array<[keyof CustomizeDraft['assets'], CustomizeDraft['assets'][keyof CustomizeDraft['assets']]]>)
    .filter(([, state]) => state !== 'unknown')
    .map(([asset, state]) => ({
      label: asset === 'logo'
        ? 'Logo bisnis'
        : asset === 'domain'
          ? 'Nama domain'
          : asset === 'photos'
            ? 'Foto / visual'
            : asset === 'catalog'
              ? customizeConfig.catalogAssetLabel
              : 'Teks profil dan cerita bisnis',
      state: READINESS_STATE_LABELS[state as Exclude<typeof state, 'unknown'>],
    }))

  return {
    template: {
      name: template.name,
      category: CATEGORY_LABELS[template.category],
      description: template.shortDescription,
      customizeRoute: template.customizeRoute,
      detailRoute: template.detailRoute,
    },
    business: {
      type: draft.businessType.trim(),
      category: CATEGORY_LABELS[draft.businessCategory],
      area: draft.businessArea.trim() || null,
      websiteStatus: WEBSITE_STATUS_LABELS[draft.currentWebsiteStatus],
      contactChannels: draft.currentContactChannels.map((id) => CONTACT_CHANNEL_LABELS[id]),
    },
    customerNeeds: normalizeList(capabilityLabels(publicNeeds), draft.uncertainties.includes('customer-needs') ? 'Belum yakin' : 'Belum ditentukan'),
    operationalNeeds,
    accountNeeds: capabilityLabels(accountNeeds),
    readiness,
    timeline: TIMELINE_LABELS[draft.timeline],
    recommendation: {
      tier: recommendation.tier,
      label: recommendation.label,
      summary: recommendation.summary,
      reasons: recommendation.reasons.slice(0, 3),
      price: priceForTier(recommendation.tier),
      requiresConsultation: recommendation.requiresConsultation,
    },
  }
}

function compactMessageText(value: string, maxLength = 180): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength).trim()
}

function appendSection(lines: string[], heading: string, items: readonly string[]): void {
  const cleanItems = items.map((item) => compactMessageText(item)).filter(Boolean)
  if (cleanItems.length === 0) return
  lines.push('', `${heading}:`, ...cleanItems.map((item) => `- ${item}`))
}

const MAX_WHATSAPP_MESSAGE_LENGTH = 1800

export function buildSummaryWhatsAppMessage(viewModel: SummaryViewModel): string {
  const lines = [
    'Halo Webzoka, saya ingin konsultasi.',
    '',
    `Template: ${compactMessageText(viewModel.template.name, 80)}`,
    `Bisnis: ${compactMessageText(viewModel.business.type, 120)} (${compactMessageText(viewModel.business.category, 60)})`,
  ]

  appendSection(lines, 'Kebutuhan pelanggan', viewModel.customerNeeds)
  appendSection(lines, 'Kebutuhan operasional', viewModel.operationalNeeds)
  appendSection(lines, 'Kebutuhan akun/member', viewModel.accountNeeds)
  appendSection(lines, 'Kesiapan', viewModel.readiness.map((item) => `${item.label}: ${item.state}`))
  lines.push('', `Timeline: ${viewModel.timeline}`)
  lines.push(`Rekomendasi awal: ${viewModel.recommendation.label}`)

  const reasons = viewModel.recommendation.reasons.slice(0, 2).map((reason) => compactMessageText(reason, 240)).filter(Boolean)
  if (reasons.length > 0) lines.push(`Alasan: ${reasons.join(' ')}`)
  lines.push('', 'Saya ingin membahas kebutuhan dan langkah berikutnya.')

  let message = lines.join('\n')
  if (message.length <= MAX_WHATSAPP_MESSAGE_LENGTH) return message

  const closing = '\n\nSaya ingin membahas kebutuhan dan langkah berikutnya.'
  const shortened = `${message.slice(0, MAX_WHATSAPP_MESSAGE_LENGTH - closing.length - 1).trimEnd()}…${closing}`
  return shortened
}

export function resolveSummary(storage: CustomizeStorage | null | undefined): SummaryResolution {
  const activeTemplateSlug = readActiveCustomizeTemplate(storage)
  if (!activeTemplateSlug) {
    return { status: 'recovery', reason: 'missing-draft', customizeRoute: null }
  }

  const template = getStoreTemplateBySlug(activeTemplateSlug)
  if (!template) {
    return { status: 'recovery', reason: 'stale-template', customizeRoute: null }
  }

  let rawDraft: string | null = null
  try {
    rawDraft = storage?.getItem(customizeStorageKey(template.slug)) ?? null
  } catch {
    return { status: 'recovery', reason: 'corrupt-draft', customizeRoute: template.customizeRoute }
  }

  const draft = deserializeCustomizeDraft(rawDraft, template.slug)
  if (!draft) {
    return {
      status: 'recovery',
      reason: rawDraft ? 'corrupt-draft' : 'missing-draft',
      customizeRoute: template.customizeRoute,
    }
  }
  if (draft.status !== 'complete' || draft.currentStep !== 4) {
    return { status: 'recovery', reason: 'incomplete-draft', customizeRoute: template.customizeRoute }
  }

  return { status: 'ready', templateSlug: template.slug, viewModel: buildSummaryViewModel(draft, template) }
}
