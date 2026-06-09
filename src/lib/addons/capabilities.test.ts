import { describe, it, expect } from 'vitest'
import { resolveCapabilities } from './capabilities'

describe('resolveCapabilities — render-time capability flags', () => {
  it('booking + slug → bookingHref /{slug}/booking', () => {
    expect(resolveCapabilities(['booking'], 'kanawa').bookingHref).toBe('/kanawa/booking')
  })

  it('booking tanpa slug → bookingHref undefined', () => {
    expect(resolveCapabilities(['booking']).bookingHref).toBeUndefined()
  })

  it('slug tanpa cap booking → bookingHref undefined', () => {
    expect(resolveCapabilities(['qr-menu'], 'kanawa').bookingHref).toBeUndefined()
  })

  it('delivery-buttons / qr-menu / video-meeting → boolean benar', () => {
    const r = resolveCapabilities(['delivery-buttons', 'qr-menu', 'video-meeting'])
    expect(r.hasDelivery).toBe(true)
    expect(r.hasQrMenu).toBe(true)
    expect(r.hasVideoMeeting).toBe(true)
  })

  it('cap tak relevan → semua flag UI false', () => {
    const r = resolveCapabilities(['booking', 'cart', 'checkout-page'])
    expect(r.hasDelivery).toBe(false)
    expect(r.hasQrMenu).toBe(false)
    expect(r.hasVideoMeeting).toBe(false)
  })

  it('kosong / null / undefined → semua false, no bookingHref', () => {
    const inputs: (string[] | null | undefined)[] = [[], null, undefined]
    for (const input of inputs) {
      const r = resolveCapabilities(input, 'kanawa')
      expect(r.hasDelivery).toBe(false)
      expect(r.hasQrMenu).toBe(false)
      expect(r.hasVideoMeeting).toBe(false)
      expect(r.bookingHref).toBeUndefined()
      expect(r.caps.size).toBe(0)
    }
  })

  it('caps Set membawa capability mentah', () => {
    const r = resolveCapabilities(['booking', 'qr-menu'], 'x')
    expect(r.caps.has('booking')).toBe(true)
    expect(r.caps.has('qr-menu')).toBe(true)
    expect(r.caps.has('nope')).toBe(false)
  })
})
