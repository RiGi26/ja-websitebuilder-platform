import { describe, it, expect } from 'vitest'
import type { FeatureFlags } from '@/types/websitebuilder'
import { addonsToFeatures } from '../websitebuilder-mapping'
import {
  ADDON_CATALOG, FLAG_ALIASES, explicitFeatures,
  orderAddons, upgradeAddons, aliasToId, isOffered,
} from './catalog'

// ============================================================
// GOLDEN — snapshot ADDON_FLAG_MAP LAMA (sebelum SSOT). Sprint A0 WAJIB
// behavior-preserving: addonsToFeatures([id]) harus identik dgn map lama ini.
// Jika test ini gagal, refactor mengubah perilaku flag = REGRESI.
// ============================================================
const GOLDEN: Record<string, (keyof FeatureFlags)[]> = {
  admin: ['hasAdmin'],
  'client-portal': ['hasClientPortal'],
  shop: ['hasCart'],
  midtrans: ['hasPayment'],
  ongkir: ['hasCart', 'hasShipping'],
  'katalog-pro': ['hasCart'],
  variant: ['hasCart'],
  'qr-menu': ['hasMenu'],
  delivery: ['hasDelivery'],
  booking: ['hasBooking'],
  telemedicine: ['hasBooking'],
  membership: ['hasMembership'],
  lms: ['hasLMS'],
  'cert-auto': ['hasLMS'],
  'live-session': ['hasLMS', 'hasBooking'],
  'email-biz': ['hasEmail'],
  'lang-multi': ['hasMultiLang'],
  wa: ['hasWhatsApp'],
  seo: ['hasSEO'],
  'ads-tracking': ['hasAnalytics'],
  protection: [],
  career: ['hasCareer'],
  newsletter: ['hasNewsletter'],
  chat: ['hasLiveChat'],
  // rental travel group
  gps: ['hasTracking'],
  'e-ticket': ['hasTracking'],
  'driver-sched': ['hasBooking'],
  seat: ['hasBooking'],
  'invoice-travel': [],
}

const expectedFlags = (keys: (keyof FeatureFlags)[]): FeatureFlags =>
  Object.fromEntries(keys.map((k) => [k, true])) as FeatureFlags

// CHECK page_sections.tipe_komponen — 18 nilai sah. Section blueprint di luar
// daftar ini akan gagal insert ke DB.
const VALID_KOMPONEN = new Set([
  'hero_banner', 'about', 'features', 'pricing_table', 'gallery', 'testimonials',
  'team', 'cta', 'contact_form', 'faq', 'stats', 'blog_list', 'product_list',
  'service_list', 'video_embed', 'map_embed', 'social_feed', 'custom_html',
])

describe('addon catalog — parity dgn ADDON_FLAG_MAP lama (behavior-preserving)', () => {
  for (const [id, keys] of Object.entries(GOLDEN)) {
    it(`addonsToFeatures(['${id}']) == map lama`, () => {
      expect(addonsToFeatures([id])).toEqual(expectedFlags(keys))
    })
  }

  it('union(katalog.features, FLAG_ALIASES) menutup PERSIS semua id GOLDEN', () => {
    const covered = new Set([
      ...ADDON_CATALOG.map((a) => a.id),
      ...Object.keys(FLAG_ALIASES),
    ])
    // tiap id GOLDEN harus punya sumber eksplisit (bukan jatuh ke substring)
    for (const id of Object.keys(GOLDEN)) {
      expect(explicitFeatures(id), `id '${id}' kehilangan mapping eksplisit`).toBeDefined()
      expect(covered.has(id)).toBe(true)
    }
  })

  it('explicitFeatures id tak dikenal = undefined (jatuh ke heuristik)', () => {
    expect(explicitFeatures('id-ngawur-xyz')).toBeUndefined()
  })

  it('heuristik substring fallback tetap hidup', () => {
    expect(addonsToFeatures(['reservasi janji'])).toEqual({ hasBooking: true })
    expect(addonsToFeatures(['member area'])).toEqual({ hasMembership: true })
    expect(addonsToFeatures([])).toEqual({})
    expect(addonsToFeatures(null)).toEqual({})
  })
})

describe('addon catalog — integritas data', () => {
  it('id unik', () => {
    const ids = ADDON_CATALOG.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('harga & maintenance non-negatif', () => {
    for (const a of ADDON_CATALOG) {
      expect(a.price, a.id).toBeGreaterThanOrEqual(0)
      expect(a.yearlyMaint, a.id).toBeGreaterThanOrEqual(0)
    }
  })

  it('requires merujuk id katalog yang ada', () => {
    const ids = new Set(ADDON_CATALOG.map((a) => a.id))
    for (const a of ADDON_CATALOG) {
      for (const dep of a.requires ?? []) {
        expect(ids.has(dep), `${a.id} requires '${dep}' yang tak ada`).toBe(true)
      }
    }
  })

  it('section blueprint tipe ∈ CHECK page_sections (cegah insert gagal)', () => {
    for (const a of ADDON_CATALOG) {
      for (const s of a.sections ?? []) {
        expect(VALID_KOMPONEN.has(s.tipe), `${a.id} section '${s.tipe}' invalid`).toBe(true)
      }
    }
  })

  it('alias tak bentrok (1 alias → maks 1 id katalog) & bukan id kanonik', () => {
    const ids = new Set(ADDON_CATALOG.map((a) => a.id))
    const seen = new Map<string, string>()
    for (const a of ADDON_CATALOG) {
      for (const al of a.aliases ?? []) {
        expect(ids.has(al), `alias '${al}' bentrok dgn id kanonik`).toBe(false)
        expect(seen.has(al), `alias '${al}' dipakai ${seen.get(al)} & ${a.id}`).toBe(false)
        seen.set(al, a.id)
      }
    }
  })
})

describe('addon catalog — census audit (kunci kesimpulan §B)', () => {
  it('SKU hidup terverifikasi', () => {
    for (const id of ['shop', 'booking', 'chat']) {
      expect(ADDON_CATALOG.find((a) => a.id === id)?.status).toBe('live')
    }
  })

  it('SKU bukan-artefak-situs = deprecated', () => {
    for (const id of ['client-portal', 'email-biz', 'protection']) {
      expect(ADDON_CATALOG.find((a) => a.id === id)?.status).toBe('deprecated')
    }
  })

  it('11 SKU flag-mati TIDAK ditandai live (jangan jual sbg jadi)', () => {
    const deadFlagAddons = [
      'delivery', 'membership', 'lms', 'cert-auto', 'email-biz', 'lang-multi',
      'ads-tracking', 'protection', 'career', 'newsletter', 'client-portal',
    ]
    for (const id of deadFlagAddons) {
      expect(ADDON_CATALOG.find((a) => a.id === id)?.status).not.toBe('live')
    }
  })
})

describe('A1 — triage visibility (keputusan user 2026-06-09)', () => {
  const NOT_OFFERED = [
    'protection', 'email-biz', 'client-portal', // drop snake-oil
    'lms', 'membership', 'cert-auto', 'lang-multi', // hide heavy-unbuilt
  ]
  const STILL_OFFERED = ['delivery', 'newsletter', 'career', 'ads-tracking'] // wire nanti

  it('7 SKU di-drop/hide tak ditawarkan', () => {
    for (const id of NOT_OFFERED) {
      expect(isOffered(id), id).toBe(false)
      expect(orderAddons().some((a) => a.id === id), id).toBe(false)
      expect(upgradeAddons().some((a) => a.id === id), id).toBe(false)
    }
  })

  it('4 SKU "wire nanti" TETAP ditawarkan', () => {
    for (const id of STILL_OFFERED) {
      expect(isOffered(id), id).toBe(true)
      expect(orderAddons().some((a) => a.id === id), id).toBe(true)
    }
  })
})

describe('A1 — dual-tier harga (nol perubahan ke customer)', () => {
  it('harga order = harga form lama (shop 450k)', () => {
    expect(orderAddons().find((a) => a.id === 'shop')?.price).toBe(450000)
  })

  it('harga upgrade = harga marketplace lama (shop 299k)', () => {
    expect(upgradeAddons().find((a) => a.id === 'shop')?.price).toBe(299000)
  })

  it('SKU tanpa override upgrade → fallback ke harga order', () => {
    expect(upgradeAddons().find((a) => a.id === 'ongkir')?.price).toBe(250000)
  })
})

describe('A1 — alias terkoreksi (fix mapping korup Temuan B)', () => {
  const M = aliasToId()

  it('alias benar dihormati', () => {
    expect(M['admin-dash']).toBe('admin')
    expect(M['cart']).toBe('shop')
    expect(M['member']).toBe('membership')
    expect(M['live-chat']).toBe('chat')
  })

  it('mapping korup LENYAP (blog→newsletter, track-pack→ads-tracking, g-sheets→admin)', () => {
    expect(M['blog']).toBeUndefined() // blog kini SKU kanonik, bukan alias newsletter
    expect(M['track-pack']).toBeUndefined()
    expect(M['g-sheets']).toBeUndefined()
    expect(M['email-auto']).toBeUndefined()
  })

  it('blog jadi SKU kanonik (hasBlog), bukan dipetakan ke newsletter', () => {
    const blog = ADDON_CATALOG.find((a) => a.id === 'blog')
    expect(blog).toBeDefined()
    expect(blog?.features).toContain('hasBlog')
    expect(addonsToFeatures(['blog'])).toEqual({ hasBlog: true })
  })
})
