// ============================================================
// PARITY GATE — toko-atelier (migrasi zero-hardcoded-copy, Wave 5).
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
import TokoAtelierRenderer from './TokoAtelierRenderer'
import { TOKO_ATELIER_SLOTS } from '../toko-bespoke/slots/toko-atelier.slots'
import { copyFields } from '@/lib/theme-system/slot-schema'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

const FIXTURE = join(__dirname, '__fixtures__', 'toko-atelier-noir.parity.html')
const content = sampleContentForTheme('toko-atelier')

// Normalisasi nilai dinamis-waktu supaya test tak basi tiap ganti tahun.
const normalizeYear = (s: string) => s.replace(/© \d{4}/g, '© YYYY')

describe('TokoAtelierRenderer parity (themeCopy kosong = byte-identik)', () => {
  it('render tanpa themeCopy identik dengan fixture', () => {
    const html = normalizeYear(renderToStaticMarkup(<TokoAtelierRenderer content={content} variant="noir" />))
    const fixture = normalizeYear(readFileSync(FIXTURE, 'utf8'))
    expect(html).toBe(fixture)
  })

  it('semua default copy yang selalu tampil muncul di render default', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} variant="noir" />)
    // Kondisional/fallback-only: tertimpa konten sample (judul etalase,
    // eyebrow/judul keunggulan, subtitle hero utk tagline footer).
    const CONDITIONAL = new Set([
      'copy.lookbook_title', 'copy.features_eyebrow', 'copy.features_title', 'copy.footer_tagline',
    ])
    for (const f of copyFields(TOKO_ATELIER_SLOTS)) {
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
        'copy.lookbook_eyebrow': 'Koleksi Terbaru',
        'copy.quick_detail': 'Intip',
        'copy.footer_credit': 'Situs oleh KALA',
      },
    }
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={edited} variant="noir" />)
    expect(html).toContain('Koleksi Terbaru')
    expect(html).not.toContain('>Lookbook<')
    expect(html).toContain('>Intip<')
    expect(html).not.toContain('>Lihat Detail<')
    expect(html).toContain('Situs oleh KALA')
    expect(html).not.toContain('Dibuat dengan Webzoka')
  })

  it('style knob font pairing mengganti font; tanpa prop = font bawaan', () => {
    const base = renderToStaticMarkup(<TokoAtelierRenderer content={content} variant="noir" />)
    expect(base).toContain('Fraunces')
    expect(base).not.toContain('Prata')
    const alt = renderToStaticMarkup(
      <TokoAtelierRenderer
        content={content}
        variant="noir"
        font={{
          importUrl: 'https://fonts.googleapis.com/css2?family=Prata&family=Archivo:wght@400;500;600;700&display=swap',
          display: "'Prata', Georgia, 'Times New Roman', serif",
          body: "'Archivo', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      />,
    )
    expect(alt).toContain('Prata')
    expect(alt).not.toContain('Fraunces')
  })

  it('badge stok memakai slot copy', () => {
    const html = renderToStaticMarkup(
      <TokoAtelierRenderer
        content={{ ...content, themeCopy: { 'copy.stok_sisa': 'Tersisa' } }}
        variant="noir"
      />,
    )
    expect(html).toContain('Tersisa 3')
    expect(html).not.toContain('Sisa 3')
  })
})
