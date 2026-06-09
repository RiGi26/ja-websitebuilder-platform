import { describe, it, expect } from 'vitest'
import { waDigits, waLink, resolveWaHref } from './wa'

describe('wa — util WhatsApp terpusat', () => {
  it('waDigits buang non-angka', () => {
    expect(waDigits('+62 812-3456')).toBe('628123456')
    expect(waDigits(null)).toBe('')
    expect(waDigits(undefined)).toBe('')
  })

  it('waLink bentuk link / # bila kosong', () => {
    expect(waLink('0812345678')).toBe('https://wa.me/0812345678')
    expect(waLink('')).toBe('#')
    expect(waLink(null)).toBe('#')
  })

  describe('resolveWaHref — pusatkan link WA ke nomor terkini', () => {
    const WA = '0822' // nomor profil terkini

    it('link wa.me lama → dirender ulang ke nomor profil', () => {
      expect(resolveWaHref('https://wa.me/0811', WA)).toBe('https://wa.me/0822')
      expect(resolveWaHref('https://api.whatsapp.com/send?phone=0811', WA)).toBe('https://wa.me/0822')
    })

    it("placeholder '#' (WA kosong saat build) → pakai nomor profil", () => {
      expect(resolveWaHref('#', WA)).toBe('https://wa.me/0822')
    })

    it('link non-WA dibiarkan utuh', () => {
      expect(resolveWaHref('#menu', WA)).toBe('#menu')
      expect(resolveWaHref('#koleksi', WA)).toBe('#koleksi')
      expect(resolveWaHref('https://example.com', WA)).toBe('https://example.com')
    })

    it('nomor profil kosong → href apa adanya (tak merusak link lama)', () => {
      expect(resolveWaHref('https://wa.me/0811', '')).toBe('https://wa.me/0811')
      expect(resolveWaHref('#', null)).toBe('#')
    })

    it('href undefined → undefined', () => {
      expect(resolveWaHref(undefined, WA)).toBeUndefined()
    })
  })
})
