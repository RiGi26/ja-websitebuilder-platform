import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import KlinikEstetikRenderer from './KlinikEstetikRenderer'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

// Render smoke — KlinikEstetikRenderer "Lumen" + kontrak no-JS (#138). Source services.
describe('KlinikEstetikRenderer — render smoke (Lumen)', () => {
  const html = renderToStaticMarkup(
    <KlinikEstetikRenderer content={sampleContentForTheme('estetik-lux')} variant="lumen" />,
  )

  it('merender sample tanpa error + memuat konten kunci', () => {
    expect(html).toContain('le-root')
    expect(html).toContain('Klinik Estetika Luna')
    expect(html).toContain('Perawatan')
    expect(html.length).toBeGreaterThan(2000)
  })

  it('kontrak no-JS: reveal digate `.lx-js` → konten tampil penuh tanpa JS', () => {
    expect(html).toContain('.lx-js .le-rv{opacity:0')
    expect(html).not.toMatch(/(?<!\.lx-js )\.le-rv\{opacity:0/)
  })

  it('varian tak dikenal jatuh ke palet lumen (degradasi aman)', () => {
    const fb = renderToStaticMarkup(<KlinikEstetikRenderer content={sampleContentForTheme('estetik-lux')} variant="entah" />)
    expect(fb).toContain('le-root')
    expect(fb).toContain('#FBF9FA') // --le-bg dari PALETTES.lumen
  })

  it('showcase memberi data-count agar grid sparse terpusat (<3 perawatan)', () => {
    const base = sampleContentForTheme('estetik-lux')
    const solo = renderToStaticMarkup(<KlinikEstetikRenderer content={{ ...base, showcase: { ...base.showcase, items: (base.showcase?.items ?? []).slice(0, 1) } }} variant="lumen" />)
    expect(solo).toContain('data-count="1"')
  })
})
