export const TEMPLATE_SLUGS = [
  'warm-commerce',
  'modern-catalog',
  'trust-profile',
  'care-booking',
  'course-enrollment',
  'easy-booking',
] as const

export type TemplateSlug = (typeof TEMPLATE_SLUGS)[number]

export const STORE_CATEGORY_IDS = [
  'kuliner',
  'retail',
  'jasa-profesional',
  'klinik-wellness',
  'edukasi',
  'rental',
] as const

export type StoreCategoryId = (typeof STORE_CATEGORY_IDS)[number]

export const BUSINESS_TYPE_IDS = [
  'restaurant',
  'cafe',
  'bakery',
  'food-service',
  'retail-brand',
  'fashion-brand',
  'home-living',
  'lifestyle-brand',
  'consultant',
  'agency',
  'professional-practice',
  'creative-studio',
  'clinic',
  'practitioner',
  'wellness-practice',
  'course-provider',
  'tutoring',
  'training-center',
  'academy',
  'car-rental',
  'motorcycle-rental',
  'equipment-rental',
  'property-rental',
] as const

export type BusinessTypeId = (typeof BUSINESS_TYPE_IDS)[number]

export type TemplateStatus = 'preview' | 'live' | 'coming-soon'
export type TemplateRuntimeStatus = 'local' | 'pending-migration'
export type TemplateRuntimeOwner = 'canonical-store' | 'public-webzoka'
export type StoreIndexVisibility = 'visible' | 'hidden-until-runtime'

export type CapabilityGroup = 'public' | 'operational' | 'account'

export type CapabilityId =
  | 'public.business-profile'
  | 'public.catalog'
  | 'public.item-detail'
  | 'public.search-filter'
  | 'public.price-display'
  | 'public.whatsapp-contact'
  | 'public.lead-form'
  | 'public.inquiry'
  | 'public.order-request'
  | 'public.booking-request'
  | 'public.enrollment-request'
  | 'public.schedule-info'
  | 'public.location'
  | 'public.process'
  | 'public.consultation'
  | 'ops.content-management'
  | 'ops.order-management'
  | 'ops.booking-management'
  | 'ops.availability'
  | 'ops.inventory'
  | 'ops.customer-records'
  | 'ops.inquiry-follow-up'
  | 'ops.practitioner-management'
  | 'ops.enrollment-management'
  | 'ops.class-management'
  | 'ops.reminders'
  | 'ops.payment-management'
  | 'ops.internal-users'
  | 'ops.admin-dashboard'
  | 'account.customer-login'
  | 'account.member-login'
  | 'account.student-login'
  | 'account.order-tracking'
  | 'account.booking-history'
  | 'account.learning-materials'
  | 'account.attendance'
  | 'account.membership'

export type RecommendationTier = 'website' | 'website-portal' | 'bundle' | 'consultation'

export interface CapabilityDefinition {
  readonly id: CapabilityId
  readonly label: string
  readonly group: CapabilityGroup
  readonly description: string
}

export interface RecommendationTierDefinition {
  readonly id: RecommendationTier
  readonly label: string
  readonly definition: string
}

export type PriceDisplayMode = 'starting-price' | 'consultation'

export interface StartingPricePresentation {
  readonly displayMode: 'starting-price'
  readonly display: string
  readonly startingPrice: number
  readonly note: string
}

export interface ConsultationPricePresentation {
  readonly displayMode: 'consultation'
  readonly display: string
  readonly note: string
}

export interface PricePresentation {
  readonly website: StartingPricePresentation
  readonly websitePortal: ConsultationPricePresentation
  readonly bundle: ConsultationPricePresentation
}

export type ConfigurableFieldKind =
  | 'brand'
  | 'media'
  | 'catalog'
  | 'pricing'
  | 'schedule'
  | 'location'
  | 'contact'
  | 'copy'
  | 'operations'

export interface ConfigurableField {
  readonly id: string
  readonly label: string
  readonly kind: ConfigurableFieldKind
  readonly required: boolean
}

export interface PreviewAsset {
  readonly src: string
  readonly alt: string
  readonly kind: 'card' | 'hero' | 'desktop' | 'mobile' | 'gallery'
}

export interface StoreTemplate {
  readonly slug: TemplateSlug
  readonly name: string
  readonly shortName: string
  readonly category: StoreCategoryId
  readonly businessTypes: readonly BusinessTypeId[]
  /** Baseline capabilities represented by the template direction. */
  readonly capabilities: readonly CapabilityId[]
  /** Scope that can be added later; it is not implied by the preview. */
  readonly optionalCapabilities: readonly CapabilityId[]
  readonly shortDescription: string
  readonly positioning: string
  /** Visitor-facing baseline capabilities, kept separate from operational scope. */
  readonly customerCan: readonly CapabilityId[]
  readonly includedFeatures: readonly string[]
  readonly optionalFeatures: readonly string[]
  readonly previewStatus: TemplateStatus
  readonly runtimeStatus: TemplateRuntimeStatus
  readonly runtimeOwner: TemplateRuntimeOwner
  readonly storeIndexVisibility: StoreIndexVisibility
  readonly detailRoute: `/store/template/${TemplateSlug}`
  readonly previewRoute: `/store/template/${TemplateSlug}/preview`
  readonly pricePresentation: PricePresentation
  readonly baseRecommendation: RecommendationTier
  readonly upgradeRecommendation: RecommendationTier
  readonly featured: boolean
  readonly sortOrder: number
  readonly runtimeKey: string
  readonly previewAssets?: readonly PreviewAsset[]
  readonly configurableFields?: readonly ConfigurableField[]
}
