import { CAPABILITY_TAXONOMY, RECOMMENDATION_TIERS } from './capabilities'
import { STORE_CATEGORY_IDS } from './types'
import type {
  CapabilityGroup,
  CapabilityId,
  CustomizeDraft,
  RecommendationConsultationCode,
  RecommendationEvidence,
  RecommendationResult,
  RecommendationTier,
  StoreTemplate,
} from './types'

const ACCOUNT_LOGIN_CAPABILITIES: ReadonlySet<CapabilityId> = new Set([
  'account.customer-login',
  'account.member-login',
  'account.student-login',
])

const ACCOUNT_STATE_CAPABILITIES: ReadonlySet<CapabilityId> = new Set([
  'account.order-tracking',
  'account.booking-history',
  'account.learning-materials',
  'account.attendance',
  'account.membership',
])

const CONNECTED_CUSTOMER_FLOWS: ReadonlySet<CapabilityId> = new Set([
  'public.order-request',
  'public.booking-request',
  'public.enrollment-request',
])

const CONSULTATION_SUMMARIES: Record<RecommendationConsultationCode, string> = {
  'invalid-draft': 'Jawaban inti belum lengkap atau perlu diperiksa lagi sebelum scope ditentukan.',
  'template-mismatch': 'Pilihan template dan jawaban kebutuhanmu belum berada dalam satu arah yang jelas.',
  'uncertain-needs': 'Beberapa kebutuhan utama masih belum cukup jelas untuk menentukan apakah kamu membutuhkan website saja, portal operasional, atau alur customer yang terhubung.',
  'contradictory-selections': 'Beberapa pilihan kebutuhanmu belum konsisten.',
  'empty-needs': 'Belum ada kebutuhan utama yang cukup jelas untuk menentukan solusi.',
  'ambiguous-account': 'Kebutuhan login belum menunjukkan alur customer, member, atau siswa yang jelas.',
  'unsupported-capability': 'Ada kebutuhan yang belum cocok dengan pilihan template ini.',
}

const CONSULTATION_REASONS: Record<RecommendationConsultationCode, string> = {
  'invalid-draft': 'Jawaban inti belum lengkap, jadi rekomendasi belum bisa ditentukan dengan aman.',
  'template-mismatch': 'Pilihan template dan kebutuhanmu belum berada dalam satu arah yang jelas. Konsultasi akan membantu memastikan pilihan yang paling tepat.',
  'uncertain-needs': 'Beberapa kebutuhan utama masih belum cukup jelas untuk menentukan apakah kamu membutuhkan website saja, portal operasional, atau alur customer yang terhubung.',
  'contradictory-selections': 'Pilihan kebutuhan publik dan operasionalmu belum konsisten, jadi scope perlu diklarifikasi sebelum solusi ditentukan.',
  'empty-needs': 'Belum ada kebutuhan utama yang cukup jelas untuk menentukan solusi secara bertanggung jawab. Konsultasi akan membantu memulai dari prioritas bisnis.',
  'ambiguous-account': 'Kebutuhan login yang dipilih belum menunjukkan alur customer, member, atau siswa yang jelas. Konsultasi akan membantu memastikan kebutuhan yang tepat.',
  'unsupported-capability': 'Ada kebutuhan yang belum cocok dengan pilihan template ini. Konsultasi akan membantu menentukan scope yang tepat.',
}

function emptyEvidence(): RecommendationEvidence {
  return {
    publicCapabilities: [],
    operationalCapabilities: [],
    accountCapabilities: [],
  }
}

function resultFor(
  template: StoreTemplate,
  tier: RecommendationTier,
  evidence: RecommendationEvidence,
  reasons: readonly string[],
  consultationCode?: RecommendationConsultationCode,
): RecommendationResult {
  return {
    tier,
    label: RECOMMENDATION_TIERS[tier].label,
    summary: consultationCode
      ? CONSULTATION_SUMMARIES[consultationCode]
      : tier === 'website'
        ? 'Website publik untuk memperkenalkan bisnis dan membantu customer mengambil langkah berikutnya.'
        : tier === 'website-portal'
          ? 'Website dengan portal operasional untuk membantu tim mengelola pekerjaan di belakang layar.'
          : 'Website, portal, dan alur customer atau member yang saling terhubung.',
    reasons,
    evidence,
    templateSlug: template.slug,
    requiresConsultation: tier === 'consultation',
    ...(consultationCode ? { consultationCode } : {}),
  }
}

function consultationResult(
  template: StoreTemplate,
  evidence: RecommendationEvidence,
  code: RecommendationConsultationCode,
): RecommendationResult {
  return resultFor(template, 'consultation', evidence, [CONSULTATION_REASONS[code]], code)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isKnownCapability(value: unknown): value is CapabilityId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(CAPABILITY_TAXONOMY, value)
}

function isStoreCategory(value: unknown): value is CustomizeDraft['businessCategory'] {
  return typeof value === 'string' && (STORE_CATEGORY_IDS as readonly string[]).includes(value)
}

interface SelectionRead {
  readonly ids: CapabilityId[]
  readonly invalid: boolean
}

function readSelection(value: unknown, groups: readonly CapabilityGroup[]): SelectionRead {
  if (!Array.isArray(value)) return { ids: [], invalid: true }

  const ids: CapabilityId[] = []
  const seen = new Set<CapabilityId>()
  let invalid = false

  for (const item of value) {
    if (!isKnownCapability(item)) {
      invalid = true
      continue
    }
    if (seen.has(item) || !groups.includes(CAPABILITY_TAXONOMY[item].group)) {
      invalid = true
      continue
    }
    seen.add(item)
    ids.push(item)
  }

  return { ids, invalid }
}

function createEvidence(customer: SelectionRead, operational: SelectionRead): RecommendationEvidence {
  return {
    publicCapabilities: customer.ids.filter((id) => CAPABILITY_TAXONOMY[id].group === 'public'),
    operationalCapabilities: operational.ids,
    accountCapabilities: customer.ids.filter((id) => CAPABILITY_TAXONOMY[id].group === 'account'),
  }
}

function formatCapabilityList(ids: readonly CapabilityId[]): string {
  const labels = ids.slice(0, 2).map((id) => CAPABILITY_TAXONOMY[id].label.toLocaleLowerCase('id-ID'))
  if (labels.length === 0) return 'kebutuhan tersebut'
  if (labels.length === 1) return labels[0]
  if (ids.length === 2) return `${labels[0]} dan ${labels[1]}`
  return `${labels[0]}, ${labels[1]}, dan kebutuhan lain`
}

function formatOperationalList(ids: readonly CapabilityId[]): string {
  return formatCapabilityList(ids).replace(/^kelola /, 'pengelolaan ').replace(/^tindak lanjuti /, 'tindak lanjut ')
}

function isSupportedByTemplate(template: StoreTemplate, evidence: RecommendationEvidence): boolean {
  return evidence.publicCapabilities.every((id) => template.customerCan.includes(id))
    && evidence.operationalCapabilities.every((id) => template.optionalCapabilities.includes(id))
    && evidence.accountCapabilities.every((id) => template.optionalCapabilities.includes(id))
}

function hasConnectedAccountWorkflow(evidence: RecommendationEvidence): boolean {
  const hasAccountState = evidence.accountCapabilities.some((id) => ACCOUNT_STATE_CAPABILITIES.has(id))
  const hasConnectedPublicFlow = evidence.accountCapabilities.some((id) => ACCOUNT_LOGIN_CAPABILITIES.has(id))
    && evidence.publicCapabilities.some((id) => CONNECTED_CUSTOMER_FLOWS.has(id))
  return hasAccountState || hasConnectedPublicFlow
}

/**
 * Deterministic S5 engine. It reads normalized S4 selections only; no pricing,
 * inference, persistence, or backend calls belong in this function.
 */
export function recommendStoreSolution(draft: CustomizeDraft, template: StoreTemplate): RecommendationResult {
  const rawDraft = draft as unknown
  if (!isRecord(rawDraft)) return consultationResult(template, emptyEvidence(), 'invalid-draft')

  if (rawDraft.templateSlug !== template.slug) {
    return consultationResult(template, emptyEvidence(), 'template-mismatch')
  }

  if (
    rawDraft.schemaVersion !== 1
    || rawDraft.status !== 'complete'
    || rawDraft.currentStep !== 4
    || typeof rawDraft.businessType !== 'string'
    || rawDraft.businessType.trim().length < 2
    || !isStoreCategory(rawDraft.businessCategory)
    || typeof rawDraft.needsConsultation !== 'boolean'
  ) {
    return consultationResult(template, emptyEvidence(), 'invalid-draft')
  }

  const customer = readSelection(rawDraft.customerNeeds, ['public', 'account'])
  const operational = readSelection(rawDraft.operationalNeeds, ['operational'])
  const evidence = createEvidence(customer, operational)

  if (customer.invalid || operational.invalid) {
    return consultationResult(template, evidence, 'invalid-draft')
  }

  if (!isSupportedByTemplate(template, evidence)) {
    return consultationResult(template, evidence, 'unsupported-capability')
  }

  const uncertainties = rawDraft.uncertainties
  if (
    !Array.isArray(uncertainties)
    || uncertainties.some((value) => value !== 'customer-needs' && value !== 'operational-needs')
    || new Set(uncertainties).size !== uncertainties.length
  ) {
    return consultationResult(template, evidence, 'invalid-draft')
  }

  if (rawDraft.operationalMode !== 'none' && rawDraft.operationalMode !== 'selected' && rawDraft.operationalMode !== 'unsure') {
    return consultationResult(template, evidence, 'contradictory-selections')
  }
  if (rawDraft.operationalMode === 'none' && evidence.operationalCapabilities.length > 0) {
    return consultationResult(template, evidence, 'contradictory-selections')
  }
  if (rawDraft.operationalMode === 'selected' && evidence.operationalCapabilities.length === 0) {
    return consultationResult(template, evidence, 'contradictory-selections')
  }
  if (rawDraft.operationalMode === 'unsure' && evidence.operationalCapabilities.length > 0) {
    return consultationResult(template, evidence, 'contradictory-selections')
  }

  const hasStrongSolutionSignal = evidence.publicCapabilities.length > 0
    || evidence.operationalCapabilities.length > 0
    || evidence.accountCapabilities.length > 0
  const hasBothCoreUncertainties = uncertainties.includes('customer-needs')
    && uncertainties.includes('operational-needs')

  // S4 keeps needsConsultation for compatibility, but one Belum yakin marker
  // must not override a clear public, operational, or account signal.
  if (hasBothCoreUncertainties && !hasStrongSolutionSignal) {
    return consultationResult(template, evidence, 'uncertain-needs')
  }

  if (evidence.publicCapabilities.length === 0 && evidence.accountCapabilities.length === 0) {
    return consultationResult(template, evidence, 'empty-needs')
  }

  if (evidence.accountCapabilities.length > 0) {
    if (evidence.operationalCapabilities.length > 0 || hasConnectedAccountWorkflow(evidence)) {
      return resultFor(
        template,
        'bundle',
        evidence,
        ['Kamu membutuhkan login customer, member, atau siswa yang terhubung dengan alur layanan, sehingga website dan portal perlu berjalan dalam satu alur.'],
      )
    }

    const onlyGenericLogin = evidence.accountCapabilities.every((id) => ACCOUNT_LOGIN_CAPABILITIES.has(id))
    if (onlyGenericLogin) {
      return consultationResult(template, evidence, 'ambiguous-account')
    }

    return resultFor(
      template,
      'bundle',
      evidence,
      ['Kamu membutuhkan area customer, member, atau siswa yang menyimpan alur dan statusnya, sehingga website dan portal perlu saling terhubung.'],
    )
  }

  if (evidence.operationalCapabilities.length > 0) {
    return resultFor(
      template,
      'website-portal',
      evidence,
      [`Kamu memilih kebutuhan ${formatOperationalList(evidence.operationalCapabilities)}, sehingga dibutuhkan dashboard operasional selain website.`],
    )
  }

  return resultFor(
    template,
    'website',
    evidence,
    [`Kebutuhanmu masih berfokus pada ${formatCapabilityList(evidence.publicCapabilities)}, tanpa dashboard operasional, sehingga website publik menjadi pilihan yang tepat.`],
  )
}
