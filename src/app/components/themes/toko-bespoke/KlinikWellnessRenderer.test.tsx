import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import KlinikWellnessRenderer from './KlinikWellnessRenderer'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

// Render smoke — KlinikWellnessRenderer "Sanara" + kontrak no-JS (#138). Source services.
describe('KlinikWellnessRenderer — render smoke (Sanara)', () => {
  const html = renderToStaticMarkup(
    <KlinikWellnessRenderer content={sampleContentForTheme('wellness-lux')} variant="sanara" />,
  )

  it('merender sample tanpa error + memuat konten kunci', () => {
    expect(html).toContain('sn-root')
    expect(html).toContain('Rumah Terapi Hasta')
    expect(html).toContain('Layanan')
    expect(html.length).toBeGreaterThan(2000)
  })

  it('kontrak no-JS: reveal digate `.lx-js` → konten tampil penuh tanpa JS', () => {
    expect(html).toContain('.lx-js .sn-rv{opacity:0')
    expect(html).not.toMatch(/(?<!\.lx-js )\.sn-rv\{opacity:0/)
  })

  it('motif sprout tampil tanpa JS (tak digate)', () => {
    expect(html).toContain('sn-sprout')
    expect(html).not.toMatch(/\.lx-js\s+\.sn-sprout\{/)
  })

  it('varian tak dikenal jatuh ke palet sanara (degradasi aman)', () => {
    const fb = renderToStaticMarkup(<KlinikWellnessRenderer content={sampleContentForTheme('wellness-lux')} variant="entah" />)
    expect(fb).toContain('sn-root')
    expect(fb).toContain('#F4F2EB') // --sn-bg dari PALETTES.sanara
  })

  it('showcase memberi data-count agar grid sparse terpusat (<3 layanan)', () => {
    const base = sampleContentForTheme('wellness-lux')
    const slice = (n: number) => ({ ...base, showcase: { ...base.showcase, items: (base.showcase?.items ?? []).slice(0, n) } })
    expect(renderToStaticMarkup(<KlinikWellnessRenderer content={slice(1)} variant="sanara" />)).toContain('data-count="1"')
    expect(renderToStaticMarkup(<KlinikWellnessRenderer content={slice(2)} variant="sanara" />)).toContain('data-count="2"')
  })
})
