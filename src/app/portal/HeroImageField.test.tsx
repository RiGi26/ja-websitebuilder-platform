import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import HeroImageField from './HeroImageField'

const noop = () => {}

describe('HeroImageField — upload + titik fokus terpadu', () => {
  it('tanpa foto → panduan foto tampil, grid fokus TIDAK tampil', () => {
    const html = renderToStaticMarkup(
      <HeroImageField value="" focus="" onChange={noop} onFocusChange={noop} />,
    )
    expect(html).toContain('foto suasana / landscape')
    expect(html).not.toContain('Atur titik fokus foto')
  })

  it('dengan foto → grid 3×3 tampil dengan label fokus aktif', () => {
    const html = renderToStaticMarkup(
      <HeroImageField value="https://contoh.com/foto.jpg" focus="50% 0%" onChange={noop} onFocusChange={noop} />,
    )
    expect(html).toContain('Atur titik fokus foto')
    // 9 tombol fokus, posisi aktif ditandai aria-pressed
    expect(html.match(/aria-label="Fokus /g)?.length).toBe(9)
    expect(html).toContain('aria-pressed="true"')
    // label posisi aktif "atas" tampil di caption
    expect(html).toContain('atas')
    // preview memakai posisi terpilih
    expect(html).toContain('background-position:50% 0%')
  })

  it('fokus kosong → default tengah (50% 50%)', () => {
    const html = renderToStaticMarkup(
      <HeroImageField value="https://contoh.com/foto.jpg" focus="" onChange={noop} onFocusChange={noop} />,
    )
    expect(html).toContain('tengah')
    expect(html).toContain('background-position:50% 50%')
  })
})
