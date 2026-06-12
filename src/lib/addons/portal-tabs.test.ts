import { describe, it, expect } from 'vitest'
import { paymentEntitled } from './portal-tabs'

describe('portal-tabs — gating tab Pembayaran per add-on', () => {
  it('add-on midtrans dibeli (hasPayment) → entitled', () => {
    expect(paymentEntitled({ hasPayment: true }, false)).toBe(true)
  })

  it('tanpa add-on & tanpa konfigurasi (order bypass/test) → TERKUNCI', () => {
    expect(paymentEntitled({}, false)).toBe(false)
    expect(paymentEntitled(undefined, false)).toBe(false)
    expect(paymentEntitled({ hasCart: true, hasBooking: true }, false)).toBe(false) // shop/booking saja tidak cukup
  })

  it('grandfather: sudah pernah konfigurasi pembayaran → tetap entitled', () => {
    expect(paymentEntitled({}, true)).toBe(true)
    expect(paymentEntitled(undefined, true)).toBe(true)
  })
})
