import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import AnakLuxRenderer from './AnakLuxRenderer'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

// Render smoke test — AnakLuxRenderer ter-mount tanpa error + kontrak no-JS
// (reveal digate `.lx-js`, pelajaran #138).
describe('AnakLuxRenderer — render smoke (Ceria)', () => {
  const html = renderToStaticMarkup(
    <AnakLuxRenderer content={sampleContentForTheme('anak-lux')} variant="ceria" />,
  )

  it('merender sample tanpa error + memuat konten kunci', () => {
    expect(html).toContain('an-root')
    expect(html).toContain('Cilukba Kids')
    expect(html).toContain('Etalase')
    expect(html.length).toBeGreaterThan(2000)
  })

  it('kontrak no-JS: reveal digate `.lx-js` → konten tampil penuh tanpa JS', () => {
    expect(html).toContain('.lx-js .an-rv{opacity:0')
    expect(html).not.toMatch(/(?<!\.lx-js )\.an-rv\{opacity:0/)
  })

  it('varian tak dikenal jatuh ke palet ceria (degradasi aman)', () => {
    const fallback = renderToStaticMarkup(
      <AnakLuxRenderer content={sampleContentForTheme('anak-lux')} variant="entah" />,
    )
    expect(fallback).toContain('an-root')
    expect(fallback).toContain('#FFFCF5') // --an-bg dari PALETTES.ceria
  })

  // Mode sparse (pelajaran #132): showcase 1–2 item → grid terpusat via data-count.
  it('showcase memberi data-count agar grid sparse terpusat (<3 produk)', () => {
    const base = sampleContentForTheme('anak-lux')
    const slice = (n: number) => ({ ...base, showcase: { ...base.showcase, items: (base.showcase?.items ?? []).slice(0, n) } })
    const solo = renderToStaticMarkup(<AnakLuxRenderer content={slice(1)} variant="ceria" />)
    const duo = renderToStaticMarkup(<AnakLuxRenderer content={slice(2)} variant="ceria" />)
    expect(solo).toContain('data-count="1"')
    expect(duo).toContain('data-count="2"')
  })
})
