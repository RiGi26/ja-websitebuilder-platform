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
export const ANALYTICS_CONSENT_KEY = 'webzoka_analytics_consent'
const GA_SCRIPT_ID = 'webzoka-google-tag'
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
const sentOnce = new Set<string>()

type AnalyticsProperties = Record<string, string | number | boolean | null>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __webzokaAnalyticsLoaded?: boolean
  }
}

export type AnalyticsConsent = 'granted' | 'denied'
const consentListeners = new Set<() => void>()

export function subscribeAnalyticsConsent(listener: () => void): () => void {
  consentListeners.add(listener)
  return () => consentListeners.delete(listener)
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') return null

  try {
    const sharedCookie = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${ANALYTICS_CONSENT_KEY}=`))
      ?.split('=')[1]
    if (sharedCookie === 'granted' || sharedCookie === 'denied') return sharedCookie

    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

export function setAnalyticsConsent(consent: AnalyticsConsent): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent)
  } catch {
    // Consent UI remains usable if storage is unavailable; analytics stays gated
    // for the current page unless the user accepts again after a reload.
  }

  const sharedDomain = window.location.hostname.endsWith('.webzoka.com') || window.location.hostname === 'webzoka.com'
    ? '; Domain=.webzoka.com'
    : ''
  document.cookie = `${ANALYTICS_CONSENT_KEY}=${consent}; Max-Age=31536000; Path=/; SameSite=Lax${sharedDomain}`
  consentListeners.forEach((listener) => listener())
}

function isValidMeasurementId(measurementId: string | undefined): measurementId is string {
  return Boolean(measurementId && /^G-[A-Z0-9]+$/i.test(measurementId))
}

/** Initialize GA4 exactly once, and only after the user has granted analytics consent. */
export function loadAnalytics(measurementId: string | undefined): boolean {
  if (typeof window === 'undefined' || getAnalyticsConsent() !== 'granted') return false
  if (!isValidMeasurementId(measurementId)) return false
  if (window.__webzokaAnalyticsLoaded) return true

  const existingScript = document.getElementById(GA_SCRIPT_ID)
  if (existingScript) {
    window.__webzokaAnalyticsLoaded = true
    return true
  }

  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function gtag(this: void) {
    window.dataLayer?.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId)

  const script = document.createElement('script')
  script.id = GA_SCRIPT_ID
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  document.head.appendChild(script)
  window.__webzokaAnalyticsLoaded = true
  return true
}

function queueEvent(eventName: AnalyticsEventName, properties: AnalyticsProperties): boolean {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, properties)
    return true
  }

  return false
}

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
): boolean {
  if (typeof window === 'undefined') return false
  if (getAnalyticsConsent() !== 'granted') return false
  if (!window.__webzokaAnalyticsLoaded && !loadAnalytics(GA_MEASUREMENT_ID)) return false

  try {
    return queueEvent(eventName, sanitizeProperties(eventName, properties))
  } catch {
    // Analytics must remain non-critical to the Store experience.
    return false
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
  if (trackEvent(eventName, properties)) sentOnce.add(key)
}
