import { describe, it, expect } from 'vitest'
import { composeDeskripsi, joinPembeda } from './composeNarasi'

describe('joinPembeda — pemisah Indonesia', () => {
  it('kosong → string kosong', () => {
    expect(joinPembeda([])).toBe('')
    expect(joinPembeda(['', '  '])).toBe('')
  })
  it('satu item apa adanya', () => {
    expect(joinPembeda(['Antar-jemput bandara'])).toBe('Antar-jemput bandara')
  })
  it('dua item pakai "dan"', () => {
    expect(joinPembeda(['Cepat', 'Murah'])).toBe('Cepat dan Murah')
  })
  it('tiga item pakai koma + "dan"', () => {
    expect(joinPembeda(['Cepat', 'Murah', 'Aman'])).toBe('Cepat, Murah, dan Aman')
  })
})

describe('composeDeskripsi — luwes saat field sebagian kosong', () => {
  it('tanpa tawaran → kosong (sengaja jatuh ke fallback copyVariants)', () => {
    expect(composeDeskripsi({ pelanggan: 'Keluarga', pembeda: ['Cepat'] })).toBe('')
    expect(composeDeskripsi({})).toBe('')
  })
  it('tawaran saja → satu kalimat berkapital', () => {
    expect(composeDeskripsi({ tawaran: 'sewa mobil harian' })).toBe('Sewa mobil harian.')
  })
  it('tawaran + pelanggan → klausa "untuk", pelanggan di-lowercase di tengah', () => {
    expect(composeDeskripsi({ tawaran: 'Sewa mobil harian', pelanggan: 'Keluarga di Bali' })).toBe(
      'Sewa mobil harian untuk keluarga di Bali.',
    )
  })
  it('lengkap → dua kalimat', () => {
    expect(
      composeDeskripsi({
        tawaran: 'Sewa mobil harian',
        pelanggan: 'wisatawan',
        pembeda: ['Antar-jemput bandara 24 jam', 'semua unit ber-GPS'],
      }),
    ).toBe('Sewa mobil harian untuk wisatawan. Antar-jemput bandara 24 jam dan semua unit ber-GPS.')
  })
  it('pembeda kosong diabaikan rapi', () => {
    expect(composeDeskripsi({ tawaran: 'Jasa foto', pembeda: ['', '   '] })).toBe('Jasa foto.')
  })
})
