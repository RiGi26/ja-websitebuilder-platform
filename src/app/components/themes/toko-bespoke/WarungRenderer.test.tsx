import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import WarungRenderer from './WarungRenderer'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

// Render smoke test — WarungRenderer ter-mount tanpa error + kontrak no-JS
// (reveal digate `.lx-js`, pelajaran #138) + signature banderol harga.
describe('WarungRenderer — render smoke (Hangat)', () => {
  const html = renderToStaticMarkup(
    <WarungRenderer content={sampleContentForTheme('warung-lux')} variant="hangat" />,
  )

  it('merender sample tanpa error + memuat konten kunci', () => {
    expect(html).toContain('wr-root')
    expect(html).toContain('Warung Bu Yati')
    expect(html).toContain('Menu Andalan')
    expect(html.length).toBeGreaterThan(2000)
  })

  it('signature banderol: tiap kartu menu punya tag harga (wr-card-tag) ber-prefiks Rupiah', () => {
    expect(html).toContain('wr-card-tag')
    expect(html).toContain('Rp ') // priceText(harga>0) → "Rp <angka>" (format separator locale-dependent)
  })

  it('kontrak no-JS: reveal digate `.lx-js` → konten tampil penuh tanpa JS', () => {
    expect(html).toContain('.lx-js .wr-rv{opacity:0')
    expect(html).not.toMatch(/(?<!\.lx-js )\.wr-rv\{opacity:0/)
  })

  it('varian tak dikenal jatuh ke palet hangat (degradasi aman)', () => {
    const fallback = renderToStaticMarkup(
      <WarungRenderer content={sampleContentForTheme('warung-lux')} variant="entah" />,
    )
    expect(fallback).toContain('wr-root')
    expect(fallback).toContain('#FBF3E4') // --wr-bg dari PALETTES.hangat
  })

  // Mode sparse (pelajaran #132): showcase 1–2 item → grid terpusat via data-count.
  it('showcase memberi data-count agar grid sparse terpusat (<3 menu)', () => {
    const base = sampleContentForTheme('warung-lux')
    const slice = (n: number) => ({ ...base, showcase: { ...base.showcase, items: (base.showcase?.items ?? []).slice(0, n) } })
    const solo = renderToStaticMarkup(<WarungRenderer content={slice(1)} variant="hangat" />)
    const duo = renderToStaticMarkup(<WarungRenderer content={slice(2)} variant="hangat" />)
    expect(solo).toContain('data-count="1"')
    expect(duo).toContain('data-count="2"')
  })
})
