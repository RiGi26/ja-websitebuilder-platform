import { describe, it, expect } from 'vitest'
import { paymentEntitled, themeContentTabs, kontenBrandEditable } from './portal-tabs'

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

const NONE = { produk: false, menu: false, layanan: false, blog: false, galeri: false }

describe('themeContentTabs — tab konten terbuka mengikuti apa yang tema render', () => {
  it('bespoke toko: produk terbuka; galeri ikut renderer (atelier/kuliner ya, kerajinan tidak)', () => {
    expect(themeContentTabs({ theme: 'toko-atelier' }, 'toko_online')).toEqual({ ...NONE, produk: true, galeri: true })
    expect(themeContentTabs({ theme: 'toko-kuliner' }, 'toko_online')).toEqual({ ...NONE, produk: true, galeri: true })
    expect(themeContentTabs({ theme: 'toko-kerajinan' }, 'toko_online')).toEqual({ ...NONE, produk: true })
  })

  it('restaurant-lux: menu + galeri', () => {
    expect(themeContentTabs({ theme: 'restaurant-lux' }, 'restaurant')).toEqual({ ...NONE, menu: true, galeri: true })
  })

  it('bespoke warung (source menu, Wave 2): MENU terbuka, tanpa galeri (renderer tak render galeri)', () => {
    expect(themeContentTabs({ theme: 'restaurant-warung' }, 'restaurant')).toEqual({ ...NONE, menu: true })
  })

  it('bespoke cafe (source menu, Wave 2): MENU terbuka, tanpa galeri', () => {
    expect(themeContentTabs({ theme: 'restaurant-cafe' }, 'restaurant')).toEqual({ ...NONE, menu: true })
  })

  it('bespoke klinik (source services): LAYANAN terbuka, bukan produk (Wave 2)', () => {
    expect(themeContentTabs({ theme: 'klinik-umum' }, 'klinik')).toEqual({ ...NONE, layanan: true })
  })

  it('bespoke sekolah (source services, Wave 3): LAYANAN terbuka, bukan produk', () => {
    expect(themeContentTabs({ theme: 'sekolah-reguler' }, 'sekolah')).toEqual({ ...NONE, layanan: true })
  })

  it('manifest lux: sumber etalase per industri (cermin SiteRenderer)', () => {
    expect(themeContentTabs({ variant: 'lux-klinik' }, 'klinik')).toEqual({ ...NONE, layanan: true, galeri: true })
    expect(themeContentTabs({ variant: 'lux-restaurant' }, 'restaurant')).toEqual({ ...NONE, menu: true, galeri: true })
    expect(themeContentTabs({ variant: 'lux-blog' }, 'blog')).toEqual({ ...NONE, blog: true })
    expect(themeContentTabs({ variant: 'lux-toko' }, 'toko_online')).toEqual({ ...NONE, produk: true })
  })

  it('tema lama / tanpa branding → semua false (nol regresi: gate add-on tetap berlaku)', () => {
    expect(themeContentTabs(undefined, 'klinik')).toEqual(NONE)
    expect(themeContentTabs({ theme: 'klinik', variant: 'warm' }, 'klinik')).toEqual(NONE)
  })
})

describe('kontenBrandEditable — stats/faq/statement hanya untuk tema yang membacanya', () => {
  it('bespoke (toko + restaurant-lux + klinik) → semua true', () => {
    expect(kontenBrandEditable({ theme: 'toko-atelier' })).toEqual({ stats: true, faq: true, statement: true })
    expect(kontenBrandEditable({ theme: 'toko-kerajinan' })).toEqual({ stats: true, faq: true, statement: true })
    expect(kontenBrandEditable({ theme: 'restaurant-lux' })).toEqual({ stats: true, faq: true, statement: true })
    expect(kontenBrandEditable({ theme: 'restaurant-warung' })).toEqual({ stats: true, faq: true, statement: true })
    expect(kontenBrandEditable({ theme: 'restaurant-cafe' })).toEqual({ stats: true, faq: true, statement: true })
    expect(kontenBrandEditable({ theme: 'klinik-umum' })).toEqual({ stats: true, faq: true, statement: true })
    expect(kontenBrandEditable({ theme: 'sekolah-reguler' })).toEqual({ stats: true, faq: true, statement: true })
  })

  it('manifest → ikut blocks (lux-blog tanpa stats)', () => {
    expect(kontenBrandEditable({ variant: 'lux-klinik' })).toEqual({ stats: true, faq: true, statement: true })
    expect(kontenBrandEditable({ variant: 'lux-blog' })).toEqual({ stats: false, faq: true, statement: true })
  })

  it('tema lama → semua false (stats/faq diedit via section di tab Konten biasa)', () => {
    expect(kontenBrandEditable(undefined)).toEqual({ stats: false, faq: false, statement: false })
    expect(kontenBrandEditable({ theme: 'klinik', variant: 'warm' })).toEqual({ stats: false, faq: false, statement: false })
  })
})
