import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import KlinikUmumRenderer from './KlinikUmumRenderer'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

// Render smoke test — KlinikUmumRenderer "Klinik Bersih" ter-mount tanpa error +
// kontrak no-JS (reveal digate `.lx-js`, pelajaran #138). Source = services.
describe('KlinikUmumRenderer — render smoke (Klinik Bersih)', () => {
  const html = renderToStaticMarkup(
    <KlinikUmumRenderer content={sampleContentForTheme('klinik-lux')} variant="bersih" />,
  )

  it('merender sample tanpa error + memuat konten kunci', () => {
    expect(html).toContain('kb-root')
    expect(html).toContain('Klinik Sehat Sentosa')
    expect(html).toContain('Jadwal Praktik') // signature panel
    expect(html).toContain('Layanan')
    expect(html.length).toBeGreaterThan(2000)
  })

  it('kontrak no-JS: reveal digate `.lx-js` → konten tampil penuh tanpa JS', () => {
    expect(html).toContain('.lx-js .kb-rv{opacity:0')
    expect(html).not.toMatch(/(?<!\.lx-js )\.kb-rv\{opacity:0/)
  })

  it('signature EKG tampil tanpa JS (tak digate .lx-js → motif selalu terlihat)', () => {
    expect(html).toContain('kb-ekg')
    expect(html).not.toMatch(/\.lx-js\s+\.kb-ekg\{/)
  })

  it('varian tak dikenal jatuh ke palet bersih (degradasi aman)', () => {
    const fallback = renderToStaticMarkup(
      <KlinikUmumRenderer content={sampleContentForTheme('klinik-lux')} variant="entah" />,
    )
    expect(fallback).toContain('kb-root')
    expect(fallback).toContain('#F7FAFD') // --kb-bg dari PALETTES.bersih
  })

  // Mode sparse (pelajaran #132): showcase 1–2 layanan → grid terpusat via data-count.
  it('showcase memberi data-count agar grid sparse terpusat (<3 layanan)', () => {
    const base = sampleContentForTheme('klinik-lux')
    const slice = (n: number) => ({ ...base, showcase: { ...base.showcase, items: (base.showcase?.items ?? []).slice(0, n) } })
    const solo = renderToStaticMarkup(<KlinikUmumRenderer content={slice(1)} variant="bersih" />)
    const duo = renderToStaticMarkup(<KlinikUmumRenderer content={slice(2)} variant="bersih" />)
    expect(solo).toContain('data-count="1"')
    expect(duo).toContain('data-count="2"')
  })
})
