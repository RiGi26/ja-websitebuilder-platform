import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import RumahLuxRenderer from './RumahLuxRenderer'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

// Render smoke test — memastikan RumahLuxRenderer benar-benar ter-mount tanpa
// error dan memenuhi kontrak no-JS (reveal digate `.lx-js`). gen-samples.test
// hanya jalan saat GEN_SAMPLES di-set, jadi ini satu-satunya yang selalu jalan.
describe('RumahLuxRenderer — render smoke (Selaras)', () => {
  const html = renderToStaticMarkup(
    <RumahLuxRenderer content={sampleContentForTheme('rumah-lux')} variant="selaras" />,
  )

  it('merender sample tanpa error + memuat konten kunci', () => {
    expect(html).toContain('rm-root')
    expect(html).toContain('Selaras')
    expect(html).toContain('Koleksi')
    expect(html.length).toBeGreaterThan(2000)
  })

  it('kontrak no-JS: reveal digate `.lx-js` → konten tampil penuh tanpa JS', () => {
    // .rm-rv hanya di-opacity:0 di bawah `.lx-js` (ditambah LUX_JS saat runtime).
    expect(html).toContain('.lx-js .rm-rv{opacity:0')
    // Tak ada aturan .rm-rv{opacity:0 yang TIDAK didahului `.lx-js `.
    expect(html).not.toMatch(/(?<!\.lx-js )\.rm-rv\{opacity:0/)
  })

  it('varian tak dikenal jatuh ke palet selaras (degradasi aman)', () => {
    const fallback = renderToStaticMarkup(
      <RumahLuxRenderer content={sampleContentForTheme('rumah-lux')} variant="entah" />,
    )
    expect(fallback).toContain('rm-root')
    expect(fallback).toContain('#F4F1EA') // --rm-bg dari PALETTES.selaras
  })
})
