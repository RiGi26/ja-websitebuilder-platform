const STORE_WHATSAPP_ENV_KEY = 'NEXT_PUBLIC_WEBZOKA_WHATSAPP_NUMBER'

export type StoreWhatsAppAvailability = 'available' | 'missing-number' | 'invalid-number'

export interface StoreWhatsAppLink {
  readonly available: boolean
  readonly href: string | null
  readonly number: string | null
  readonly status: StoreWhatsAppAvailability
}

/** Normalize a formatted international number into E.164 digits only. */
export function normalizeStoreWhatsAppNumber(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null
  const input = value.trim()
  if (!input || !/^[+\d\s().-]+$/.test(input)) return null
  if (input.includes('+') && !/^\+\s*\d/.test(input)) return null

  const digits = input.replace(/\D/g, '')
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null
}

export function getStoreWhatsAppNumber(value: string | null | undefined = process.env.NEXT_PUBLIC_WEBZOKA_WHATSAPP_NUMBER): string | null {
  return normalizeStoreWhatsAppNumber(value)
}

/**
 * Store-only WhatsApp contract. Missing or invalid configuration stays explicit
 * so preview cannot silently point at a hard-coded production number.
 */
export function buildStoreWhatsAppLink(message?: string, configuredNumber?: string | null): StoreWhatsAppLink {
  const rawNumber = configuredNumber === undefined
    ? process.env.NEXT_PUBLIC_WEBZOKA_WHATSAPP_NUMBER
    : configuredNumber
  const number = getStoreWhatsAppNumber(rawNumber)
  const status: StoreWhatsAppAvailability = number
    ? 'available'
    : rawNumber?.trim()
      ? 'invalid-number'
      : 'missing-number'

  if (!number) {
    return { available: false, href: null, number: null, status }
  }

  const base = `https://wa.me/${number}`
  return {
    available: true,
    href: message ? `${base}?text=${encodeURIComponent(message)}` : base,
    number,
    status,
  }
}

export function storeWhatsAppUrl(message?: string, configuredNumber?: string | null): string | null {
  return buildStoreWhatsAppLink(message, configuredNumber).href
}

export { STORE_WHATSAPP_ENV_KEY }
