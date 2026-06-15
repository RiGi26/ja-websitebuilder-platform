import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import KesehatanLuxRenderer from './KesehatanLuxRenderer'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

// Render smoke test — memastikan KesehatanLuxRenderer ter-mount tanpa error dan
// memenuhi kontrak no-JS (reveal digate `.lx-js`, pelajaran #138).
describe('KesehatanLuxRenderer — render smoke (Jamu)', () => {
  const html = renderToStaticMarkup(
    <KesehatanLuxRenderer content={sampleContentForTheme('kesehatan-lux')} variant="jamu" />,
  )

  it('merender sample tanpa error + memuat konten kunci', () => {
    expect(html).toContain('ks-root')
    expect(html).toContain('Sari Bumi')
    expect(html).toContain('Etalase')
    expect(html.length).toBeGreaterThan(2000)
  })

  it('kontrak no-JS: reveal digate `.lx-js` → konten tampil penuh tanpa JS', () => {
    expect(html).toContain('.lx-js .ks-rv{opacity:0')
    // Tak ada aturan .ks-rv{opacity:0 yang TIDAK didahului `.lx-js `.
    expect(html).not.toMatch(/(?<!\.lx-js )\.ks-rv\{opacity:0/)
  })

  it('varian tak dikenal jatuh ke palet jamu (degradasi aman)', () => {
    const fallback = renderToStaticMarkup(
      <KesehatanLuxRenderer content={sampleContentForTheme('kesehatan-lux')} variant="entah" />,
    )
    expect(fallback).toContain('ks-root')
    expect(fallback).toContain('#ECE3CE') // --ks-bg dari PALETTES.jamu
  })

  // Mode sparse (pelajaran #132): showcase 1–2 item → grid terpusat via data-count.
  it('showcase memberi data-count agar grid sparse terpusat (<3 produk)', () => {
    const base = sampleContentForTheme('kesehatan-lux')
    const slice = (n: number) => ({ ...base, showcase: { ...base.showcase, items: (base.showcase?.items ?? []).slice(0, n) } })
    const solo = renderToStaticMarkup(<KesehatanLuxRenderer content={slice(1)} variant="jamu" />)
    const duo = renderToStaticMarkup(<KesehatanLuxRenderer content={slice(2)} variant="jamu" />)
    expect(solo).toContain('data-count="1"')
    expect(duo).toContain('data-count="2"')
  })
})
