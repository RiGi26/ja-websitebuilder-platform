import { describe, it, expect } from 'vitest'
import { PACKS, VARIANT_PACK, DEFAULT_PACK_ID, resolveTokenPack, isTokenDrivenTheme } from './packs'

describe('token-pack registry', () => {
  it('setiap entri VARIANT_PACK menunjuk pack yang ada', () => {
    for (const [key, packId] of Object.entries(VARIANT_PACK)) {
      expect(PACKS[packId], `${key} → ${packId} tidak ada di PACKS`).toBeDefined()
    }
  })

  it('default pack ada', () => {
    expect(PACKS[DEFAULT_PACK_ID]).toBeDefined()
  })

  it('tiap pack punya field layout lengkap (F4)', () => {
    for (const [id, pack] of Object.entries(PACKS)) {
      expect(pack.layout, `${id} tanpa layout`).toBeDefined()
      expect(['centered', 'split', 'fullbleed']).toContain(pack.layout.hero)
      expect(['grid', 'rows', 'list']).toContain(pack.layout.features)
      expect(['normal', 'airy']).toContain(pack.layout.pad)
      expect(['center', 'left']).toContain(pack.layout.align)
    }
  })

  it('arketipe layout memang beda antar pack (bukan re-skin doang)', () => {
    // luxury-navy = split + rows; bold-energetic = fullbleed; minimal-refined = list
    expect(PACKS['luxury-navy'].layout.hero).toBe('split')
    expect(PACKS['luxury-navy'].layout.features).toBe('rows')
    expect(PACKS['bold-energetic'].layout.hero).toBe('fullbleed')
    expect(PACKS['minimal-refined'].layout.features).toBe('list')
    // baseline tetap centered+grid (no-regression)
    expect(PACKS['clean-modern'].layout).toMatchObject({ hero: 'centered', features: 'grid' })
    expect(PACKS['warm-cafe'].layout).toMatchObject({ hero: 'centered', features: 'grid' })
  })
})

describe('resolveTokenPack', () => {
  it('memetakan variant kunci ke pack yang dijanjikan', () => {
    expect(resolveTokenPack('company', 'editorial').id).toBe('bold-energetic')
    expect(resolveTokenPack('company', 'minimal').id).toBe('minimal-refined')
    expect(resolveTokenPack('restaurant', 'modern').id).toBe('luxury-navy')
    expect(resolveTokenPack('personal', 'bold').id).toBe('bold-energetic')
  })

  it('variant tak dikenal jatuh ke default pack', () => {
    expect(resolveTokenPack('entah', 'apa').id).toBe(DEFAULT_PACK_ID)
  })

  it('warna brand klien menimpa primary + memilih onPrimary kontras', () => {
    const dark = resolveTokenPack('custom', 'clean', '#0A0A0A')
    expect(dark.color.primary).toBe('#0A0A0A')
    expect(dark.color.onPrimary).toBe('#FFFFFF') // teks terang di atas gelap

    const light = resolveTokenPack('custom', 'clean', '#FFE066')
    expect(light.color.primary).toBe('#FFE066')
    expect(light.color.onPrimary).toBe('#111111') // teks gelap di atas terang
  })

  it('primary tak valid diabaikan (pakai pack apa adanya)', () => {
    const base = resolveTokenPack('custom', 'clean')
    const withBad = resolveTokenPack('custom', 'clean', 'bukan-hex')
    expect(withBad.color.primary).toBe(base.color.primary)
  })
})

describe('isTokenDrivenTheme', () => {
  it('tema bespoke = false, sisanya true', () => {
    for (const t of ['klinik', 'company', 'sekolah', 'restaurant', 'rental', 'batik_toko']) {
      expect(isTokenDrivenTheme(t), t).toBe(false)
    }
    for (const t of ['personal', 'blog', 'jastip', 'custom', undefined]) {
      expect(isTokenDrivenTheme(t), String(t)).toBe(true)
    }
  })
})
