// ============================================================
// PARITY GATE — restaurant-lux (migrasi zero-hardcoded-copy, Wave 5).
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
import RestaurantLuxRenderer from './RestaurantLuxRenderer'
import { RESTAURANT_LUX_SLOTS } from '../toko-bespoke/slots/restaurant-lux.slots'
import { copyFields } from '@/lib/theme-system/slot-schema'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

const FIXTURE = join(__dirname, '__fixtures__', 'restaurant-lux-aurum.parity.html')
const content = sampleContentForTheme('finedining-aurum')

// Normalisasi nilai dinamis-waktu supaya test tak basi tiap ganti tahun.
const normalizeYear = (s: string) => s.replace(/© \d{4}/g, '© YYYY')

describe('RestaurantLuxRenderer parity (themeCopy kosong = byte-identik)', () => {
  it('render tanpa themeCopy identik dengan fixture', () => {
    const html = normalizeYear(renderToStaticMarkup(<RestaurantLuxRenderer content={content} variant="aurum" />))
    const fixture = normalizeYear(readFileSync(FIXTURE, 'utf8'))
    expect(html).toBe(fixture)
  })

  it('semua default copy yang selalu tampil muncul di render default', () => {
    const html = renderToStaticMarkup(<RestaurantLuxRenderer content={content} variant="aurum" />)
    // Kondisional/fallback-only: delivery_cta+qr_note+reservasi_booking butuh
    // capability add-on; menu_title/team_eyebrow/gallery_title tertimpa konten sample.
    const CONDITIONAL = new Set([
      'copy.delivery_cta', 'copy.qr_note', 'copy.reservasi_booking',
      'copy.menu_title', 'copy.team_eyebrow', 'copy.gallery_title',
    ])
    for (const f of copyFields(RESTAURANT_LUX_SLOTS)) {
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
        'copy.signature_eyebrow': 'Andalan Dapur',
        'copy.faq_title': 'Tanya Dulu',
        'copy.visit_title': 'Pesan meja Anda',
      },
    }
    const html = renderToStaticMarkup(<RestaurantLuxRenderer content={edited} variant="aurum" />)
    expect(html).toContain('Andalan Dapur')
    expect(html).not.toContain('Yang Kami Banggakan')
    expect(html).toContain('Tanya Dulu')
    expect(html).not.toContain('Sebelum Anda datang')
    expect(html).toContain('Pesan meja Anda')
    expect(html).not.toContain('Amankan malam Anda')
  })

  it('style knob font pairing mengganti font; tanpa prop = font bawaan', () => {
    const base = renderToStaticMarkup(<RestaurantLuxRenderer content={content} variant="aurum" />)
    expect(base).toContain('Cormorant Garamond')
    expect(base).not.toContain('Playfair Display')
    const alt = renderToStaticMarkup(
      <RestaurantLuxRenderer
        content={content}
        variant="aurum"
        font={{
          importUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600;700&display=swap',
          display: "'Playfair Display', Georgia, 'Times New Roman', serif",
          body: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      />,
    )
    expect(alt).toContain('Playfair Display')
    expect(alt).not.toContain('Cormorant Garamond')
  })
})
