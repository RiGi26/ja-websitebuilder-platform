// ============================================================
// PARITY GATE — restaurant-warung (pilot zero-hardcoded-copy, Wave 1).
// Kontrak: situs yang BELUM pernah mengedit "Konten Tema" wajib render
// byte-identik dengan fixture (hasil render pra-perubahan). Perubahan visual
// yang DISENGAJA → regenerate fixture di PR yang sama:
//   npx tsc -p scripts/tsconfig.gen-warung.json
//   node scripts/run-gen.cjs .tmp-gen-warung .tmp-gen-warung/scripts/gen-warung-entry.js
//   lalu salin isi <body> theme-samples/warung-hangat.html (tahun → "© YYYY").
// Pola ini = gerbang wajib tiap migrasi tema berikutnya (Wave 5).
// ============================================================
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import WarungRenderer from './WarungRenderer'
import { WARUNG_SLOTS } from './slots/restaurant-warung.slots'
import { copyFields } from '@/lib/theme-system/slot-schema'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

const FIXTURE = join(__dirname, '__fixtures__', 'warung-hangat.parity.html')
const content = sampleContentForTheme('warung-lux')

// Normalisasi nilai dinamis-waktu supaya test tak basi tiap ganti tahun.
const normalizeYear = (s: string) => s.replace(/© \d{4}/g, '© YYYY')

describe('WarungRenderer parity (themeCopy kosong = byte-identik)', () => {
  it('render tanpa themeCopy identik dengan fixture', () => {
    const html = normalizeYear(renderToStaticMarkup(<WarungRenderer content={content} variant="hangat" />))
    const fixture = normalizeYear(readFileSync(FIXTURE, 'utf8'))
    expect(html).toBe(fixture)
  })

  it('semua default copy yang selalu tampil muncul di render default', () => {
    const html = renderToStaticMarkup(<WarungRenderer content={content} variant="hangat" />)
    // Kondisional/fallback-only: tak selalu tampil dgn sample (soldout butuh item
    // habis; hero_cta*/features_eyebrow/cta_primary tertimpa konten sample;
    // footer_jam_fallback tertimpa info.jam sample).
    const CONDITIONAL = new Set([
      'copy.soldout_badge', 'copy.hero_cta1', 'copy.hero_cta2',
      'copy.features_eyebrow', 'copy.cta_primary', 'copy.footer_jam_fallback',
    ])
    for (const f of copyFields(WARUNG_SLOTS)) {
      if (CONDITIONAL.has(f.key)) continue
      const defaults = Array.isArray(f.default) ? f.default : [f.default]
      for (const d of defaults) {
        if (typeof d !== 'string' || !d) continue
        expect(html, `default "${d}" (${f.key}) hilang dari render`).toContain(
          d.replace(/&/g, '&amp;'),
        )
      }
    }
  })

  it('nilai themeCopy editan menggantikan default', () => {
    const edited = {
      ...content,
      themeCopy: {
        'copy.stamp': 'Panas Terus',
        'copy.ribbon': ['Enak', 'Murah'],
        'copy.ulasan_title': 'Kata Mereka',
      },
    }
    const html = renderToStaticMarkup(<WarungRenderer content={edited} variant="hangat" />)
    expect(html).toContain('Panas Terus')
    expect(html).not.toContain('Selalu Hangat')
    expect(html).toContain('Kata Mereka')
    expect(html).not.toContain('Kata Pelanggan')
    expect(html).toContain('>Enak<')
    // Kata pita lama terganti ('Dimasak Dadakan' unik di pita; 'Masakan
    // Rumahan' tak bisa dipakai — muncul juga di eyebrow hero sample).
    expect(html).not.toContain('Dimasak Dadakan')
  })

  it('badge soldout memakai slot copy (muncul saat item habis)', () => {
    const soldout = {
      ...content,
      showcase: {
        ...content.showcase!,
        items: [{ ...content.showcase!.items[0], soldOut: true }],
      },
    }
    const html = renderToStaticMarkup(<WarungRenderer content={soldout} variant="hangat" />)
    expect(html).toContain('>Habis<')
    const editedHtml = renderToStaticMarkup(
      <WarungRenderer content={{ ...soldout, themeCopy: { 'copy.soldout_badge': 'Ludes' } }} variant="hangat" />,
    )
    expect(editedHtml).toContain('>Ludes<')
  })
})
