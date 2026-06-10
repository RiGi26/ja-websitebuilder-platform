import { describe, it, expect } from 'vitest'
import type { BuildSection } from '@/lib/build/types'
import { addonSectionBlueprints, mergeAddonSections } from './sections'
import { generateContent } from '@/lib/build/generateContent'

// Template tiruan ala restaurant: punya showcase (pricing_table) + contact_form + cta.
const restoSections: BuildSection[] = [
  { tipe_komponen: 'hero_banner', isi_komponen: {} },
  { tipe_komponen: 'pricing_table', isi_komponen: { title: 'Menu' } },
  { tipe_komponen: 'contact_form', isi_komponen: {} },
  { tipe_komponen: 'cta', isi_komponen: {} },
]

const VALID_KOMPONEN = new Set([
  'hero_banner', 'about', 'features', 'pricing_table', 'gallery', 'testimonials',
  'team', 'cta', 'contact_form', 'faq', 'stats', 'blog_list', 'product_list',
  'service_list', 'video_embed', 'map_embed', 'social_feed', 'custom_html',
])

describe('addonSectionBlueprints — kumpulkan blueprint dari add-on terpilih', () => {
  it('blog → blueprint blog_list', () => {
    expect(addonSectionBlueprints(['blog']).some((b) => b.tipe === 'blog_list')).toBe(true)
  })
  it('resolve alias (cart → shop → product_list)', () => {
    expect(addonSectionBlueprints(['cart']).some((b) => b.tipe === 'product_list')).toBe(true)
  })
  it('id tak dikenal / kosong / null → []', () => {
    expect(addonSectionBlueprints(['ngawur-xyz'])).toEqual([])
    expect(addonSectionBlueprints([])).toEqual([])
    expect(addonSectionBlueprints(null)).toEqual([])
  })
})

describe('mergeAddonSections — inject + dedupe per-tipe', () => {
  it('blog_list di-inject (template tak punya) — setelah showcase, sebelum cta', () => {
    const tipes = mergeAddonSections(restoSections, addonSectionBlueprints(['blog'])).map((s) => s.tipe_komponen)
    expect(tipes).toContain('blog_list')
    expect(tipes.indexOf('blog_list')).toBeGreaterThan(tipes.indexOf('pricing_table'))
    expect(tipes.indexOf('blog_list')).toBeLessThan(tipes.indexOf('cta'))
  })

  it('contact_form (blueprint booking) DEDUPED — native menang', () => {
    const merged = mergeAddonSections(restoSections, addonSectionBlueprints(['booking']))
    expect(merged.filter((s) => s.tipe_komponen === 'contact_form')).toHaveLength(1)
  })

  it('cta (blueprint newsletter) DEDUPED — template sudah punya cta', () => {
    const merged = mergeAddonSections(restoSections, addonSectionBlueprints(['newsletter']))
    expect(merged.filter((s) => s.tipe_komponen === 'cta')).toHaveLength(1)
  })

  it('blueprint kosong → identik template', () => {
    expect(mergeAddonSections(restoSections, [])).toEqual(restoSections)
  })

  it('hanya emit tipe_komponen valid (cegah insert gagal CHECK)', () => {
    const merged = mergeAddonSections(restoSections, addonSectionBlueprints(['blog', 'newsletter', 'shop', 'booking']))
    for (const s of merged) expect(VALID_KOMPONEN.has(s.tipe_komponen)).toBe(true)
  })
})

describe('generateContent — booking seed + section inject (B-section)', () => {
  it('restaurant + booking → seed service "Reservasi Meja" (cegah /booking 404)', () => {
    const plan = generateContent({
      industri: 'Restaurant', nama_usaha: 'Resto Uji',
      selected_addons: ['booking'], briefing_data: { industri_tipe: 'restaurant' },
    })
    expect(plan.services.some((s) => s.nama === 'Reservasi Meja')).toBe(true)
  })

  it('klinik + booking → pakai service template (dokter), TANPA seed', () => {
    const plan = generateContent({
      industri: 'Klinik', nama_usaha: 'Klinik Uji',
      selected_addons: ['booking'], briefing_data: { industri_tipe: 'klinik' },
    })
    expect(plan.services.length).toBeGreaterThan(0)
    expect(plan.services.some((s) => s.nama === 'Reservasi Meja')).toBe(false)
  })

  it('restaurant TANPA booking → tak ada seed', () => {
    const plan = generateContent({
      industri: 'Restaurant', nama_usaha: 'Resto Uji',
      briefing_data: { industri_tipe: 'restaurant' },
    })
    expect(plan.services.some((s) => s.nama === 'Reservasi Meja')).toBe(false)
  })

  it('restaurant + blog → blog_list ter-inject di sections', () => {
    const plan = generateContent({
      industri: 'Restaurant', nama_usaha: 'Resto Uji',
      selected_addons: ['blog'], briefing_data: { industri_tipe: 'restaurant' },
    })
    expect(plan.sections.some((s) => s.tipe_komponen === 'blog_list')).toBe(true)
  })
})
