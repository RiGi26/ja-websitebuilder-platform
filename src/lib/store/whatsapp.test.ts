import { describe, expect, it } from 'vitest'
import {
  buildStoreWhatsAppLink,
  normalizeStoreWhatsAppNumber,
  storeWhatsAppUrl,
} from './whatsapp'

describe('Store WhatsApp handoff helper', () => {
  it('normalizes formatted international numbers to E.164 digits', () => {
    expect(normalizeStoreWhatsAppNumber('+62 812-3456-7890')).toBe('6281234567890')
    expect(normalizeStoreWhatsAppNumber('(1) 202.555.0123')).toBe('12025550123')
  })

  it('rejects missing, local, too-short, too-long, and malformed numbers', () => {
    for (const value of ['', '081234567890', '1234567', '1234567890123456', '62812abc7890', '628+1234567890', '++6281234567890']) {
      expect(normalizeStoreWhatsAppNumber(value)).toBeNull()
    }
  })

  it('returns an encoded URL with a stable WhatsApp message', () => {
    const message = 'Halo Webzoka, saya ingin konsultasi.\nTemplate: Warm Commerce'
    const link = buildStoreWhatsAppLink(message, '+62 812-3456-7890')

    expect(link).toMatchObject({ available: true, number: '6281234567890', status: 'available' })
    expect(link.href).toBe(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`)
  })

  it('does not create a fake URL when the number is missing or invalid', () => {
    expect(buildStoreWhatsAppLink('message', '')).toMatchObject({ available: false, href: null, status: 'missing-number' })
    expect(buildStoreWhatsAppLink('message', 'not-a-number')).toMatchObject({ available: false, href: null, status: 'invalid-number' })
    expect(storeWhatsAppUrl('message', '')).toBeNull()
  })
})
