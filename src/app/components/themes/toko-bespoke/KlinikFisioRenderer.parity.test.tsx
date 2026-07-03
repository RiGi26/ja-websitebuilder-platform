// ============================================================
// PARITY GATE — klinik-fisio (migrasi zero-hardcoded-copy, Wave 5).
// Kontrak: situs yang BELUM pernah mengedit "Konten Tema" wajib render
// byte-identik dengan fixture (hasil render pra-perubahan). Perubahan visual
// yang DISENGAJA → regenerate fixture di PR yang sama:
//   node node_modules/typescript/bin/tsc -p scripts/tsconfig.gen-parity.json
//   node scripts/run-gen.cjs .tmp-gen-parity .tmp-gen-parity/scripts/gen-parity-entry.js
// ============================================================
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import KlinikFisioRenderer from './KlinikFisioRenderer'
import { KLINIK_FISIO_SLOTS } from './slots/klinik-fisio.slots'
import { copyFields } from '@/lib/theme-system/slot-schema'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

const FIXTURE = join(__dirname, '__fixtures__', 'klinik-fisio-gerak.parity.html')
const content = sampleContentForTheme('fisio-lux')

// Normalisasi nilai dinamis-waktu supaya test tak basi tiap ganti tahun.
const normalizeYear = (s: string) => s.replace(/© \d{4}/g, '© YYYY')

describe('KlinikFisioRenderer parity (themeCopy kosong = byte-identik)', () => {
  it('render tanpa themeCopy identik dengan fixture', () => {
    const html = normalizeYear(renderToStaticMarkup(<KlinikFisioRenderer content={content} variant="gerak" />))
    const fixture = normalizeYear(readFileSync(FIXTURE, 'utf8'))
    expect(html).toBe(fixture)
  })

  it('semua default copy yang selalu tampil muncul di render default', () => {
    const html = renderToStaticMarkup(<KlinikFisioRenderer content={content} variant="gerak" />)
    // Kondisional/fallback-only: booking_* butuh bookingSlug; about_cta butuh
    // about.ctaHref; jam/footer fallback tertimpa info.jam sample; footer_desc
    // tertimpa hero.eyebrow sample.
    const CONDITIONAL = new Set([
      'copy.booking_cta', 'copy.booking_eyebrow', 'copy.booking_title', 'copy.booking_sub',
      'copy.about_cta', 'copy.jam_fallback', 'copy.footer_desc', 'copy.footer_jam_fallback',
    ])
    for (const f of copyFields(KLINIK_FISIO_SLOTS)) {
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
        'copy.keluhan_title': 'Sakit yang menahan langkahmu?',
        'copy.steps_title': 'Tiga langkah menuju pulih',
        'copy.hero_micro': 'Dibalas maksimal 1 jam kerja.',
      },
    }
    const html = renderToStaticMarkup(<KlinikFisioRenderer content={edited} variant="gerak" />)
    expect(html).toContain('Sakit yang menahan langkahmu?')
    expect(html).not.toContain('Nyeri yang bikin kamu berhenti bergerak?')
    expect(html).toContain('Tiga langkah menuju pulih')
    expect(html).not.toContain('Jalur pemulihan dalam tiga langkah')
    expect(html).toContain('Dibalas maksimal 1 jam kerja.')
    expect(html).not.toContain('Balas cepat di jam kerja. Tanpa komitmen.')
  })

  it('style knob font pairing mengganti font; tanpa prop = font bawaan', () => {
    const base = renderToStaticMarkup(<KlinikFisioRenderer content={content} variant="gerak" />)
    expect(base).toContain('Sora')
    expect(base).not.toContain('Lexend')
    const alt = renderToStaticMarkup(
      <KlinikFisioRenderer
        content={content}
        variant="gerak"
        font={{
          importUrl: 'https://fonts.googleapis.com/css2?family=Lexend:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
          display: '"Lexend","Segoe UI",system-ui,sans-serif',
          body: '"Plus Jakarta Sans","Segoe UI",system-ui,sans-serif',
        }}
      />,
    )
    expect(alt).toContain('Lexend')
    expect(alt).not.toContain('Sora')
  })

  it('CTA booking memakai slot copy saat bookingSlug aktif', () => {
    const html = renderToStaticMarkup(
      <KlinikFisioRenderer content={content} variant="gerak" bookingSlug="klinik-demo" />,
    )
    expect(html).toContain('Booking Online')
    const edited = renderToStaticMarkup(
      <KlinikFisioRenderer
        content={{ ...content, themeCopy: { 'copy.booking_cta': 'Ambil Jadwal' } }}
        variant="gerak"
        bookingSlug="klinik-demo"
      />,
    )
    expect(edited).toContain('Ambil Jadwal')
  })
})
