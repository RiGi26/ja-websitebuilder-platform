import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import SekolahAlmamaterRenderer from './SekolahAlmamaterRenderer'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

// Render smoke test — SekolahAlmamaterRenderer ter-mount tanpa error + kontrak
// no-JS (reveal digate `.lx-js`, pelajaran #138) + signature lencana/crest.
describe('SekolahAlmamaterRenderer — render smoke (Almamater)', () => {
  const html = renderToStaticMarkup(
    <SekolahAlmamaterRenderer content={sampleContentForTheme('sekolah-lux')} variant="almamater" />,
  )

  it('merender sample tanpa error + memuat konten kunci', () => {
    expect(html).toContain('al-root')
    expect(html).toContain('SMA Bina Bangsa')
    expect(html).toContain('Program Unggulan')
    expect(html.length).toBeGreaterThan(2000)
  })

  it('signature lencana/crest: hero punya crest dengan monogram', () => {
    expect(html).toContain('al-crest')
    expect(html).toContain('al-crest-mono')
  })

  it('kontrak no-JS: reveal digate `.lx-js` → konten tampil penuh tanpa JS', () => {
    expect(html).toContain('.lx-js .al-rv{opacity:0')
    expect(html).not.toMatch(/(?<!\.lx-js )\.al-rv\{opacity:0/)
  })

  it('varian tak dikenal jatuh ke palet almamater (degradasi aman)', () => {
    const fallback = renderToStaticMarkup(
      <SekolahAlmamaterRenderer content={sampleContentForTheme('sekolah-lux')} variant="entah" />,
    )
    expect(fallback).toContain('al-root')
    expect(fallback).toContain('#F6F1E6') // --al-bg dari PALETTES.almamater
  })

  // Mode sparse (pelajaran #132): showcase 1–2 item → grid terpusat via data-count.
  it('showcase memberi data-count agar grid sparse terpusat (<3 program)', () => {
    const base = sampleContentForTheme('sekolah-lux')
    const slice = (n: number) => ({ ...base, showcase: { ...base.showcase, items: (base.showcase?.items ?? []).slice(0, n) } })
    const solo = renderToStaticMarkup(<SekolahAlmamaterRenderer content={slice(1)} variant="almamater" />)
    const duo = renderToStaticMarkup(<SekolahAlmamaterRenderer content={slice(2)} variant="almamater" />)
    expect(solo).toContain('data-count="1"')
    expect(duo).toContain('data-count="2"')
  })
})
