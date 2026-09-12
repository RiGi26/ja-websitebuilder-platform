import { CAPABILITY_TAXONOMY } from './capabilities'
import { isTemplateSlug, STORE_CATEGORY_LABELS } from './templates'
import {
  CONTACT_CHANNEL_IDS,
  READINESS_ASSET_IDS,
  STORE_CATEGORY_IDS,
  type CapabilityId,
  type ContactChannelId,
  type CustomizeDraft,
  type CustomizeUncertainty,
  type CurrentWebsiteStatus,
  type OperationalSelectionMode,
  type ReadinessAssetId,
  type ReadinessState,
  type StoreCategoryId,
  type StoreTemplate,
  type TemplateSlug,
  type TimelinePreference,
} from './types'

export const CUSTOMIZE_DRAFT_SCHEMA_VERSION = 1 as const
export const CUSTOMIZE_STORAGE_KEY = 'webzoka.store.customize.v1'

export const CUSTOMIZE_STEP_LABELS = [
  { step: 1, label: 'Tentang bisnis' },
  { step: 2, label: 'Kebutuhan customer' },
  { step: 3, label: 'Kebutuhan operasional' },
  { step: 4, label: 'Kesiapan project' },
] as const

export const CURRENT_WEBSITE_STATUS_OPTIONS = [
  { id: 'none', label: 'Belum punya website', description: 'Mulai dari fondasi baru.' },
  { id: 'existing', label: 'Sudah punya website', description: 'Ada website yang masih dipakai.' },
  { id: 'refresh', label: 'Website lama perlu diperbarui', description: 'Strukturnya perlu dibuat lebih relevan.' },
  { id: 'unsure', label: 'Belum yakin', description: 'Bisa dibahas setelah konteksnya jelas.' },
] as const satisfies ReadonlyArray<{ id: CurrentWebsiteStatus; label: string; description: string }>

export const CONTACT_CHANNEL_OPTIONS = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'phone', label: 'Telepon' },
  { id: 'email', label: 'Email' },
  { id: 'walk-in', label: 'Walk-in / offline' },
  { id: 'other', label: 'Lainnya' },
] as const satisfies ReadonlyArray<{ id: ContactChannelId; label: string }>

export const READINESS_STATE_OPTIONS = [
  { id: 'ready', label: 'Sudah ada' },
  { id: 'missing', label: 'Belum ada' },
  { id: 'help', label: 'Perlu dibantu' },
] as const satisfies ReadonlyArray<{ id: Exclude<ReadinessState, 'unknown'>; label: string }>

export const TIMELINE_OPTIONS = [
  { id: 'asap', label: 'Secepatnya' },
  { id: 'one-two-weeks', label: '1–2 minggu' },
  { id: 'two-four-weeks', label: '2–4 minggu' },
  { id: 'undecided', label: 'Belum menentukan' },
] as const satisfies ReadonlyArray<{ id: TimelinePreference; label: string }>

export const OPERATIONAL_MODE_OPTIONS = [
  { id: 'selected', label: 'Ya, saya ingin memilih kebutuhannya', description: 'Pilih hal yang ingin dibantu atau dipantau tim.' },
  { id: 'none', label: 'Tidak perlu dashboard khusus', description: 'Cukup website publik untuk saat ini.' },
  { id: 'unsure', label: 'Belum yakin', description: 'Tandai untuk dibahas di tahap berikutnya.' },
] as const satisfies ReadonlyArray<{ id: OperationalSelectionMode; label: string; description: string }>

export const BUSINESS_CATEGORY_OPTIONS = STORE_CATEGORY_IDS.map((id) => ({
  id,
  label: STORE_CATEGORY_LABELS[id],
})) as ReadonlyArray<{ id: StoreCategoryId; label: string }>

const TEMPLATE_CUSTOMIZE_COPY = {
  'warm-commerce': {
    businessTypePrompt: 'Contoh: kedai makan rumahan atau bakery.',
    customerIntro: 'Pilih pengalaman yang ingin dirasakan orang sebelum memesan menu.',
    catalogAssetLabel: 'Menu, daftar harga, atau katalog produk',
  },
  'modern-catalog': {
    businessTypePrompt: 'Contoh: brand fashion atau toko home & living.',
    customerIntro: 'Pilih informasi yang membantu orang membandingkan koleksi sebelum bertanya.',
    catalogAssetLabel: 'Katalog produk dan daftar harga',
  },
  'trust-profile': {
    businessTypePrompt: 'Contoh: konsultan pajak atau studio kreatif.',
    customerIntro: 'Pilih cara calon pelanggan mengenal layanan dan memulai percakapan.',
    catalogAssetLabel: 'Daftar layanan, profil, atau paket konsultasi',
  },
  'care-booking': {
    businessTypePrompt: 'Contoh: klinik gigi atau praktik wellness.',
    customerIntro: 'Pilih informasi yang membantu orang memahami layanan dan meminta jadwal.',
    catalogAssetLabel: 'Daftar layanan dan informasi jadwal',
  },
  'course-enrollment': {
    businessTypePrompt: 'Contoh: kursus bahasa atau pusat pelatihan.',
    customerIntro: 'Pilih informasi yang membantu calon peserta memahami program dan mendaftar.',
    catalogAssetLabel: 'Daftar program, jadwal, atau materi',
  },
  'easy-booking': {
    businessTypePrompt: 'Contoh: rental mobil atau rental peralatan.',
    customerIntro: 'Pilih informasi yang membantu orang membandingkan unit sebelum meminta tanggal.',
    catalogAssetLabel: 'Daftar unit, spesifikasi, atau harga',
  },
} as const satisfies Record<TemplateSlug, {
  businessTypePrompt: string
  customerIntro: string
  catalogAssetLabel: string
}>

export interface CustomizeConfig {
  readonly customerCapabilities: readonly CapabilityId[]
  readonly operationalCapabilities: readonly CapabilityId[]
  readonly businessTypePrompt: string
  readonly customerIntro: string
  readonly catalogAssetLabel: string
}

function unique<T>(values: readonly T[]) {
  return Array.from(new Set(values))
}

export function getCustomizeConfig(template: StoreTemplate): CustomizeConfig {
  const customerCapabilities = unique([
    ...template.customerCan,
    ...template.optionalCapabilities.filter((id) => CAPABILITY_TAXONOMY[id].group === 'account'),
  ])
  const operationalCapabilities = unique(
    template.optionalCapabilities.filter((id) => CAPABILITY_TAXONOMY[id].group === 'operational'),
  )
  const copy = TEMPLATE_CUSTOMIZE_COPY[template.slug]

  return {
    customerCapabilities,
    operationalCapabilities,
    ...copy,
  }
}

const DEFAULT_ASSETS = {
  logo: 'unknown',
  domain: 'unknown',
  photos: 'unknown',
  catalog: 'unknown',
  'business-copy': 'unknown',
} as const

export function createCustomizeDraft(template: StoreTemplate): CustomizeDraft {
  return {
    schemaVersion: CUSTOMIZE_DRAFT_SCHEMA_VERSION,
    templateSlug: template.slug,
    status: 'draft',
    currentStep: 1,
    businessCategory: template.category,
    businessType: '',
    businessArea: '',
    currentWebsiteStatus: 'unsure',
    currentContactChannels: [],
    customerNeeds: [],
    operationalNeeds: [],
    operationalMode: 'unsure',
    assets: DEFAULT_ASSETS,
    timeline: 'undecided',
    uncertainties: [],
    needsConsultation: false,
  }
}

export function customizeStorageKey(templateSlug: TemplateSlug): string {
  return `${CUSTOMIZE_STORAGE_KEY}:${templateSlug}`
}

export interface CustomizeStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function serializeCustomizeDraft(draft: CustomizeDraft): string {
  return JSON.stringify(draft)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function hasUniqueStrings(value: unknown): value is readonly string[] {
  return Array.isArray(value)
    && value.every((item) => typeof item === 'string')
    && new Set(value).size === value.length
}

function isValueFrom<const T extends readonly (string | number)[]>(values: T, value: unknown): value is T[number] {
  return (typeof value === 'string' || typeof value === 'number') && values.includes(value)
}

function isCapabilityArray(value: unknown, allowedGroup: 'public' | 'account' | 'operational' | 'customer'): value is readonly CapabilityId[] {
  if (!hasUniqueStrings(value)) return false
  return value.every((id) => {
    if (!(id in CAPABILITY_TAXONOMY)) return false
    if (allowedGroup === 'customer') {
      return CAPABILITY_TAXONOMY[id as CapabilityId].group === 'public'
        || CAPABILITY_TAXONOMY[id as CapabilityId].group === 'account'
    }
    return CAPABILITY_TAXONOMY[id as CapabilityId].group === allowedGroup
  })
}

function isAssets(value: unknown): value is CustomizeDraft['assets'] {
  if (!isRecord(value)) return false
  return READINESS_ASSET_IDS.every((id) => isValueFrom(['ready', 'missing', 'help', 'unknown'] as const, value[id]))
}

export function isCustomizeDraft(value: unknown): value is CustomizeDraft {
  if (!isRecord(value)) return false
  if (value.schemaVersion !== CUSTOMIZE_DRAFT_SCHEMA_VERSION) return false
  if (typeof value.templateSlug !== 'string' || !isTemplateSlug(value.templateSlug)) return false
  if (!isValueFrom(['draft', 'complete'] as const, value.status)) return false
  if (!isValueFrom([1, 2, 3, 4] as const, value.currentStep)) return false
  if (!isValueFrom(STORE_CATEGORY_IDS, value.businessCategory)) return false
  if (typeof value.businessType !== 'string' || typeof value.businessArea !== 'string') return false
  if (!isValueFrom(['none', 'existing', 'refresh', 'unsure'] as const, value.currentWebsiteStatus)) return false
  if (!hasUniqueStrings(value.currentContactChannels) || !value.currentContactChannels.every((id) => isValueFrom(CONTACT_CHANNEL_IDS, id))) return false
  if (!isCapabilityArray(value.customerNeeds, 'customer')) return false
  if (!isCapabilityArray(value.operationalNeeds, 'operational')) return false
  if (!isValueFrom(['none', 'selected', 'unsure'] as const, value.operationalMode)) return false
  if (value.operationalMode !== 'selected' && value.operationalNeeds.length > 0) return false
  if (!isAssets(value.assets)) return false
  if (!isValueFrom(['asap', 'one-two-weeks', 'two-four-weeks', 'undecided'] as const, value.timeline)) return false
  if (!hasUniqueStrings(value.uncertainties) || !value.uncertainties.every((id) => isValueFrom(['customer-needs', 'operational-needs'] as const, id))) return false
  return typeof value.needsConsultation === 'boolean'
}

export function deserializeCustomizeDraft(raw: string | null, templateSlug: TemplateSlug): CustomizeDraft | null {
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    return isCustomizeDraft(parsed) && parsed.templateSlug === templateSlug ? parsed : null
  } catch {
    return null
  }
}

export function readCustomizeDraft(storage: CustomizeStorage | null | undefined, templateSlug: TemplateSlug): CustomizeDraft | null {
  if (!storage) return null
  try {
    return deserializeCustomizeDraft(storage.getItem(customizeStorageKey(templateSlug)), templateSlug)
  } catch {
    return null
  }
}

export function writeCustomizeDraft(storage: CustomizeStorage | null | undefined, draft: CustomizeDraft): boolean {
  if (!storage) return false
  try {
    storage.setItem(customizeStorageKey(draft.templateSlug), serializeCustomizeDraft(draft))
    return true
  } catch {
    return false
  }
}

export function resetCustomizeDraft(storage: CustomizeStorage | null | undefined, templateSlug: TemplateSlug): boolean {
  if (!storage) return false
  try {
    storage.removeItem(customizeStorageKey(templateSlug))
    return true
  } catch {
    return false
  }
}

function updateUncertainty(draft: CustomizeDraft, uncertainty: CustomizeUncertainty, enabled: boolean): CustomizeDraft {
  const remaining = draft.uncertainties.filter((id) => id !== uncertainty)
  const uncertainties = enabled ? [...remaining, uncertainty] : remaining
  return {
    ...draft,
    uncertainties,
    needsConsultation: uncertainties.length > 0,
  }
}

export function setCustomerNeeds(draft: CustomizeDraft, customerNeeds: readonly CapabilityId[]): CustomizeDraft {
  return updateUncertainty({ ...draft, customerNeeds: unique(customerNeeds) }, 'customer-needs', false)
}

export function setCustomerNeedsUncertain(draft: CustomizeDraft, enabled: boolean): CustomizeDraft {
  return {
    ...updateUncertainty({ ...draft, customerNeeds: enabled ? [] : draft.customerNeeds }, 'customer-needs', enabled),
  }
}

export function setOperationalMode(draft: CustomizeDraft, operationalMode: OperationalSelectionMode): CustomizeDraft {
  const next = updateUncertainty(
    {
      ...draft,
      operationalMode,
      operationalNeeds: operationalMode === 'selected' ? draft.operationalNeeds : [],
    },
    'operational-needs',
    operationalMode === 'unsure',
  )
  return next
}

export function setOperationalNeeds(draft: CustomizeDraft, operationalNeeds: readonly CapabilityId[]): CustomizeDraft {
  return setOperationalMode({ ...draft, operationalNeeds: unique(operationalNeeds) }, 'selected')
}

export function formatCapabilityLabel(id: CapabilityId): string {
  return CAPABILITY_TAXONOMY[id].label
}

export function formatBusinessCategory(category: StoreCategoryId): string {
  return STORE_CATEGORY_LABELS[category]
}
