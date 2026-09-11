const STORE_WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WEBZOKA_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')

/**
 * Store-only WhatsApp contract. Missing configuration stays explicit so a
 * preview cannot silently point at a hard-coded production number.
 */
export function storeWhatsAppUrl(message?: string): string | null {
  if (!STORE_WHATSAPP_NUMBER) return null
  const base = 'https://wa.me/' + STORE_WHATSAPP_NUMBER
  return message ? base + '?text=' + encodeURIComponent(message) : base
}
