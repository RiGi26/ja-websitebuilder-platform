import { describe, it, expect } from 'vitest'
import { PACKS, VARIANT_PACK, DEFAULT_PACK_ID, resolveTokenPack, isTokenDrivenTheme, packToCssVars, type TokenPack } from './packs'

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

describe('packToCssVars — lapis lux (nol regresi)', () => {
  // Tema TANPA pack.lux → tiap var lux TURUN dari token yang sudah ada → output
  // tak berubah secara visual (var ekstra inert, tak dibaca balok lama) & var
  // lama tetap = nilai pack. Ini kontrak nol-regresi untuk 5 pack generik + 96 industri.
  it('pack lama: var lux = turunan token yang ada, var lama tak tergeser', () => {
    for (const [id, p] of Object.entries(PACKS)) {
      const v = packToCssVars(p)
      // var lux baru = turunan default (== token lama)
      expect(v['--c-surface2'], id).toBe(p.color.surface)
      expect(v['--c-ink-dim'], id).toBe(p.color.muted)
      expect(v['--c-border2'], id).toBe(p.color.border)
      expect(v['--ce-ease'], id).toBe('cubic-bezier(.16,1,.3,1)')
      expect(v['--ce-dur-fast'], id).toBe('.2s')
      expect(v['--ce-dur-slow'], id).toBe('.5s')
      // var lama tetap = nilai pack (penambahan tak menggeser yang lama)
      expect(v['--c-primary'], id).toBe(p.color.primary)
      expect(v['--c-page'], id).toBe(p.color.page)
      expect(v['--c-surface'], id).toBe(p.color.surface)
      expect(v['--c-muted'], id).toBe(p.color.muted)
      expect(v['--c-border'], id).toBe(p.color.border)
      expect(v['--r-md'], id).toBe(p.radius.md)
      expect(v['--s-lg'], id).toBe(p.shadow.lg)
      expect(v['--f-display'], id).toBe(p.font.display)
    }
  })

  it('pack DENGAN lux:{} → var lux pakai override (bukan turunan)', () => {
    const luxPack: TokenPack = {
      ...PACKS['luxury-navy'],
      lux: { surface2: '#15100D', inkDim: '#D9CDBC', border2: 'rgba(243,236,225,.06)', ease: 'cubic-bezier(.22,1,.36,1)', durFast: '.3s', durSlow: '.9s' },
    }
    const v = packToCssVars(luxPack)
    expect(v['--c-surface2']).toBe('#15100D')
    expect(v['--c-ink-dim']).toBe('#D9CDBC')
    expect(v['--c-border2']).toBe('rgba(243,236,225,.06)')
    expect(v['--ce-ease']).toBe('cubic-bezier(.22,1,.36,1)')
    expect(v['--ce-dur-fast']).toBe('.3s')
    expect(v['--ce-dur-slow']).toBe('.9s')
    // var non-lux tetap dari pack dasar (override hanya menyentuh nada lux)
    expect(v['--c-primary']).toBe(PACKS['luxury-navy'].color.primary)
  })
})
