import { track } from '@vercel/analytics'

export const ANALYTICS_EVENTS = {
  storeTemplateView: 'store_template_view',
  storePreviewView: 'store_preview_view',
  customizeStarted: 'customize_started',
  customizeCompleted: 'customize_completed',
  recommendationViewed: 'recommendation_viewed',
  summaryViewed: 'summary_viewed',
  whatsappConsultationClick: 'whatsapp_consultation_click',
} as const

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]

export type AnalyticsEventProperties = {
  [ANALYTICS_EVENTS.storeTemplateView]: {
    template_slug: string
  }
  [ANALYTICS_EVENTS.storePreviewView]: {
    template_slug: string
  }
  [ANALYTICS_EVENTS.customizeStarted]: {
    template_slug: string
    step: string
  }
  [ANALYTICS_EVENTS.customizeCompleted]: {
    template_slug: string
  }
  [ANALYTICS_EVENTS.recommendationViewed]: {
    template_slug: string
    recommendation_tier: string
  }
  [ANALYTICS_EVENTS.summaryViewed]: {
    template_slug: string
    recommendation_tier: string
  }
  [ANALYTICS_EVENTS.whatsappConsultationClick]: {
    template_slug: string
    recommendation_tier: string
    source_page: string
  }
}

const ALLOWED_PROPERTIES: Record<AnalyticsEventName, readonly string[]> = {
  [ANALYTICS_EVENTS.storeTemplateView]: ['template_slug'],
  [ANALYTICS_EVENTS.storePreviewView]: ['template_slug'],
  [ANALYTICS_EVENTS.customizeStarted]: ['template_slug', 'step'],
  [ANALYTICS_EVENTS.customizeCompleted]: ['template_slug'],
  [ANALYTICS_EVENTS.recommendationViewed]: ['template_slug', 'recommendation_tier'],
  [ANALYTICS_EVENTS.summaryViewed]: ['template_slug', 'recommendation_tier'],
  [ANALYTICS_EVENTS.whatsappConsultationClick]: ['template_slug', 'recommendation_tier', 'source_page'],
}

const MAX_PROPERTY_LENGTH = 255
const sentOnce = new Set<string>()

function sanitizeProperties<TEvent extends AnalyticsEventName>(
  eventName: TEvent,
  properties: AnalyticsEventProperties[TEvent],
): Record<string, string | number | boolean | null> {
  const allowed = ALLOWED_PROPERTIES[eventName]
  const safeProperties: Record<string, string | number | boolean | null> = {}

  for (const [key, value] of Object.entries(properties)) {
    if (!allowed.includes(key)) continue
    if (typeof value === 'string') {
      safeProperties[key] = value.trim().slice(0, MAX_PROPERTY_LENGTH)
    } else if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
      safeProperties[key] = value
    }
  }

  return safeProperties
}

/** Fire-and-forget, browser-only analytics. Provider failures never affect the Store flow. */
export function trackEvent<TEvent extends AnalyticsEventName>(
  eventName: TEvent,
  properties: AnalyticsEventProperties[TEvent],
): void {
  if (typeof window === 'undefined') return

  try {
    track(eventName, sanitizeProperties(eventName, properties))
  } catch {
    // Analytics must remain non-critical to the Store experience.
  }
}

/** Deduplicate view/action milestones within the current page runtime. Refresh starts a new runtime. */
export function trackEventOnce<TEvent extends AnalyticsEventName>(
  eventName: TEvent,
  properties: AnalyticsEventProperties[TEvent],
  dedupeKey: string,
): void {
  const key = `${eventName}:${dedupeKey}`
  if (sentOnce.has(key)) return
  sentOnce.add(key)
  trackEvent(eventName, properties)
}
