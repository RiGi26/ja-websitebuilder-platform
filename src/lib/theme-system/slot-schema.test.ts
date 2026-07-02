// Fondasi slot-schema (Wave 0) — validator input theme-copy + pembaca copyGetter.
// Kontrak inti: key di luar manifest DITOLAK, XSS DITOLAK, null/''/[] = hapus
// (fallback default), dan copyGetter selalu jatuh ke default byte-identik
// (mekanisme parity situs existing).
import { describe, it, expect } from 'vitest'
import { validateThemeCopyInput, copyFields, type ThemeSlotManifest } from './slot-schema'
import { copyGetter } from './theme-copy'

const MANIFEST: ThemeSlotManifest = {
  theme: 'restaurant-warung',
  fields: [
    { key: 'copy.stamp', type: 'text', label: 'Teks Stempel', group: 'Pita & Badge', max: 30, default: 'Selalu Hangat' },
    { key: 'copy.ribbon', type: 'array', label: 'Kata Pita', group: 'Pita & Badge', max: 8, default: ['Masakan Rumahan', 'Hangat'] },
    { key: 'copy.footer_tagline', type: 'textarea', label: 'Tagline Footer', group: 'Footer', max: 160, default: 'Dimasak dadakan.' },
    { key: 'copy.badge_image', type: 'image', label: 'Gambar Badge', group: 'Pita & Badge', default: '' },
    {
      key: 'copy.jam_rows', type: 'array', label: 'Baris Jam', group: 'Footer', max: 3,
      default: [{ hari: 'Senin–Jumat', jam: '08.00–17.00' }],
      item: [
        { key: 'hari', type: 'text', label: 'Hari', group: 'Footer', max: 40, default: '' },
        { key: 'jam', type: 'text', label: 'Jam', group: 'Footer', max: 40, default: '' },
      ],
    },
    // Terdaftar hanya untuk mapping click-to-edit — bukan pipe 'copy'.
    { key: 'hero.title', type: 'text', label: 'Judul Hero', group: 'Hero', default: '', source: 'section' },
  ],
}

describe('copyFields', () => {
  it('hanya mengembalikan field pipe copy (source absen = copy)', () => {
    const keys = copyFields(MANIFEST).map((f) => f.key)
    expect(keys).toContain('copy.stamp')
    expect(keys).not.toContain('hero.title')
  })
})

describe('validateThemeCopyInput', () => {
  it('menerima nilai valid per tipe', () => {
    const r = validateThemeCopyInput(MANIFEST, {
      'copy.stamp': '  Hangat Selalu ',
      'copy.ribbon': ['Enak', 'Murah'],
      'copy.jam_rows': [{ hari: 'Sabtu', jam: '09.00–14.00' }],
    })
    expect(r).toMatchObject({ ok: true })
    if (r.ok) {
      expect(r.values['copy.stamp']).toBe('Hangat Selalu') // ter-trim
      expect(r.values['copy.ribbon']).toEqual(['Enak', 'Murah'])
      expect(r.values['copy.jam_rows']).toEqual([{ hari: 'Sabtu', jam: '09.00–14.00' }])
    }
  })

  it('menolak key di luar manifest & key non-copy', () => {
    expect(validateThemeCopyInput(MANIFEST, { 'copy.tidak_ada': 'x' }).ok).toBe(false)
    expect(validateThemeCopyInput(MANIFEST, { 'hero.title': 'x' }).ok).toBe(false)
  })

  it('null / string kosong / array kosong = removal (kembali ke default)', () => {
    const r = validateThemeCopyInput(MANIFEST, { 'copy.stamp': '', 'copy.ribbon': [], 'copy.footer_tagline': null })
    expect(r).toMatchObject({ ok: true })
    if (r.ok) {
      expect(r.values).toEqual({})
      expect(r.removals.sort()).toEqual(['copy.footer_tagline', 'copy.ribbon', 'copy.stamp'])
    }
  })

  it('menegakkan max panjang & max item', () => {
    expect(validateThemeCopyInput(MANIFEST, { 'copy.stamp': 'x'.repeat(31) }).ok).toBe(false)
    expect(validateThemeCopyInput(MANIFEST, { 'copy.ribbon': Array(9).fill('a') }).ok).toBe(false)
  })

  it('menolak XSS (javascript:, data:text/html, field html)', () => {
    expect(validateThemeCopyInput(MANIFEST, { 'copy.stamp': 'javascript:alert(1)' }).ok).toBe(false)
    expect(validateThemeCopyInput(MANIFEST, { 'copy.footer_tagline': ' data:text/html,<b>x</b>' }).ok).toBe(false)
  })

  it('image wajib https://', () => {
    expect(validateThemeCopyInput(MANIFEST, { 'copy.badge_image': 'http://a.com/x.png' }).ok).toBe(false)
    expect(validateThemeCopyInput(MANIFEST, { 'copy.badge_image': 'https://a.com/x.png' }).ok).toBe(true)
  })

  it('item array objek: semua sub-field wajib & tervalidasi', () => {
    expect(validateThemeCopyInput(MANIFEST, { 'copy.jam_rows': [{ hari: 'Sabtu' }] }).ok).toBe(false)
    expect(validateThemeCopyInput(MANIFEST, { 'copy.jam_rows': ['bukan objek'] }).ok).toBe(false)
  })

  it('payload bukan objek / kosong ditolak', () => {
    expect(validateThemeCopyInput(MANIFEST, null).ok).toBe(false)
    expect(validateThemeCopyInput(MANIFEST, []).ok).toBe(false)
    expect(validateThemeCopyInput(MANIFEST, {}).ok).toBe(false)
  })
})

describe('copyGetter', () => {
  it('tanpa themeCopy → default manifest (parity situs existing)', () => {
    const c = copyGetter(undefined, MANIFEST)
    expect(c.t('copy.stamp')).toBe('Selalu Hangat')
    expect(c.list('copy.ribbon')).toEqual(['Masakan Rumahan', 'Hangat'])
    expect(c.items('copy.jam_rows')).toEqual([{ hari: 'Senin–Jumat', jam: '08.00–17.00' }])
  })

  it('nilai editan menimpa default; bentuk salah jatuh ke default', () => {
    const c = copyGetter(
      { 'copy.stamp': 'Panas Terus', 'copy.ribbon': 'bukan-array', 'copy.jam_rows': [42] },
      MANIFEST,
    )
    expect(c.t('copy.stamp')).toBe('Panas Terus')
    expect(c.list('copy.ribbon')).toEqual(['Masakan Rumahan', 'Hangat'])
    expect(c.items('copy.jam_rows')).toEqual([{ hari: 'Senin–Jumat', jam: '08.00–17.00' }])
  })

  it('key tak terdaftar → nilai kosong aman', () => {
    const c = copyGetter(undefined, MANIFEST)
    expect(c.t('copy.tidak_ada')).toBe('')
    expect(c.list('copy.tidak_ada')).toEqual([])
    expect(c.items('copy.tidak_ada')).toEqual([])
  })
})
