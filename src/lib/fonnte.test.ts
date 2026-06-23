import { describe, it, expect } from 'vitest'
import { normalizeWa } from './fonnte'

describe('normalizeWa — fleksibel ID/JP', () => {
  // ── Indonesia (cc 62) ──
  it('ID lokal 08… pada tenant ID (cc 62)', () => {
    expect(normalizeWa('081296917963', '62')).toBe('6281296917963')
    expect(normalizeWa('0821-8906-2756', '62')).toBe('6282189062756')
    expect(normalizeWa('085712345678', '62')).toBe('6285712345678')
  })

  // ── Lintas-negara: nomor ID pada tenant JEPANG (cc 81) — kasus bug yang diperbaiki ──
  it('ID lokal 08… pada tenant JP (cc 81) → tetap dikenali 62', () => {
    expect(normalizeWa('082189062756', '81')).toBe('6282189062756')
    expect(normalizeWa('081296917963', '81')).toBe('6281296917963')
  })

  // ── Jepang (cc 81) ──
  it('JP lokal 0[789]0… pada tenant JP (cc 81)', () => {
    expect(normalizeWa('09012345678', '81')).toBe('819012345678')
    expect(normalizeWa('080-1234-5678', '81')).toBe('818012345678')
    expect(normalizeWa('07012345678', '81')).toBe('817012345678')
  })
  it('JP mobile pada tenant ID (cc 62) → tetap dikenali 81', () => {
    expect(normalizeWa('09012345678', '62')).toBe('819012345678')
  })
  it('JP landline 0NN… pada tenant JP (cc 81) → pakai defaultCc', () => {
    expect(normalizeWa('0312345678', '81')).toBe('81312345678')
  })

  // ── Internasional eksplisit ──
  it('prefix + dihormati apa adanya (lintas-negara aman)', () => {
    expect(normalizeWa('+6282189062756', '81')).toBe('6282189062756')
    expect(normalizeWa('+81 90 1234 5678', '62')).toBe('819012345678')
  })
  it('prefix 00 (akses internasional) dihormati', () => {
    expect(normalizeWa('006282189062756', '81')).toBe('6282189062756')
  })

  // ── Sudah ber-kode-negara tenant ──
  it('sudah diawali cc tenant → tak di-double-prefix', () => {
    expect(normalizeWa('6281296917963', '62')).toBe('6281296917963')
    expect(normalizeWa('819012345678', '81')).toBe('819012345678')
  })

  // ── ID landline via defaultCc ──
  it('ID landline 0NN… → pakai defaultCc 62', () => {
    expect(normalizeWa('0215551234', '62')).toBe('62215551234')
    expect(normalizeWa('0711234567', '62')).toBe('62711234567')
  })

  // ── Parity guard cc=62 (perilaku harus identik versi lama) ──
  it('parity cc=62: format campur', () => {
    expect(normalizeWa('0811234567', '62')).toBe('62811234567')
    expect(normalizeWa('+62 812 9691 7963', '62')).toBe('6281296917963')
    expect(normalizeWa('6281296917963', '62')).toBe('6281296917963') // sudah diawali cc tenant → apa adanya
  })
})
