import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import CafeRenderer from './CafeRenderer'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

// Render smoke test — CafeRenderer ter-mount tanpa error + kontrak no-JS
// (reveal digate `.lx-js`, pelajaran #138) + signature kopi-ring harga.
describe('CafeRenderer — render smoke (Seduh)', () => {
  const html = renderToStaticMarkup(
    <CafeRenderer content={sampleContentForTheme('cafe-lux')} variant="seduh" />,
  )

  it('merender sample tanpa error + memuat konten kunci', () => {
    expect(html).toContain('cf-root')
    expect(html).toContain('Kopi Senja')
    expect(html).toContain('Menu Pilihan')
    expect(html.length).toBeGreaterThan(2000)
  })

  it('signature kopi-ring: tiap kartu menu punya badge harga (cf-card-tag) ber-prefiks Rupiah', () => {
    expect(html).toContain('cf-card-tag')
    expect(html).toContain('Rp ') // priceText(harga>0) → "Rp <angka>" (format separator locale-dependent)
  })

  it('kontrak no-JS: reveal digate `.lx-js` → konten tampil penuh tanpa JS', () => {
    expect(html).toContain('.lx-js .cf-rv{opacity:0')
    expect(html).not.toMatch(/(?<!\.lx-js )\.cf-rv\{opacity:0/)
  })

  it('varian tak dikenal jatuh ke palet seduh (degradasi aman)', () => {
    const fallback = renderToStaticMarkup(
      <CafeRenderer content={sampleContentForTheme('cafe-lux')} variant="entah" />,
    )
    expect(fallback).toContain('cf-root')
    expect(fallback).toContain('#F4EEE3') // --cf-bg dari PALETTES.seduh
  })

  // Mode sparse (pelajaran #132): showcase 1–2 item → grid terpusat via data-count.
  it('showcase memberi data-count agar grid sparse terpusat (<3 menu)', () => {
    const base = sampleContentForTheme('cafe-lux')
    const slice = (n: number) => ({ ...base, showcase: { ...base.showcase, items: (base.showcase?.items ?? []).slice(0, n) } })
    const solo = renderToStaticMarkup(<CafeRenderer content={slice(1)} variant="seduh" />)
    const duo = renderToStaticMarkup(<CafeRenderer content={slice(2)} variant="seduh" />)
    expect(solo).toContain('data-count="1"')
    expect(duo).toContain('data-count="2"')
  })
})
