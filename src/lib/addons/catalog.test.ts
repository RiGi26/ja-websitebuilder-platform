import { describe, it, expect } from 'vitest'
import type { FeatureFlags } from '@/types/websitebuilder'
import { addonsToFeatures } from '../websitebuilder-mapping'
import {
  ADDON_CATALOG, FLAG_ALIASES, explicitFeatures, getAddon,
  orderAddons, upgradeAddons, aliasToId, isOffered, capabilitiesForAddons,
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

  it('SKU flag-mati TIDAK ditandai live (jangan jual sbg jadi)', () => {
    // career & newsletter keluar dari daftar ini (2026-06-11): band cta
    // ber-preset kini terinjeksi build + dirender AddonBand (composable/lux)
    // dan natively oleh SectionRenderer (token path) → pembaca NYATA ada.
    const deadFlagAddons = [
      'delivery', 'membership', 'lms', 'cert-auto', 'email-biz', 'lang-multi',
      'ads-tracking', 'protection', 'client-portal',
    ]
    for (const id of deadFlagAddons) {
      expect(ADDON_CATALOG.find((a) => a.id === id)?.status).not.toBe('live')
    }
  })

  it('career & newsletter LIVE — band terinjeksi + dirender (fix 2026-06-11)', () => {
    for (const id of ['career', 'newsletter']) {
      expect(ADDON_CATALOG.find((a) => a.id === id)?.status).toBe('live')
    }
  })
})

describe('A1 — triage visibility (keputusan user 2026-06-09; revisi kejujuran 2026-06-12)', () => {
  const NOT_OFFERED = [
    'protection', 'email-biz', 'client-portal', // drop snake-oil
    'lms', 'membership', 'cert-auto', 'lang-multi', // hide heavy-unbuilt
  ]
  // Kebijakan owner 2026-06-12: yang masih 'planned' TIDAK dijual sampai dibangun.
  const PLANNED_HIDDEN = ['ongkir', 'katalog-pro', 'variant', 'delivery', 'ads-tracking', 'video-meeting']
  const STILL_OFFERED = ['newsletter', 'career'] // sudah live (#123)

  it('7 SKU di-drop/hide tak ditawarkan', () => {
    for (const id of NOT_OFFERED) {
      expect(isOffered(id), id).toBe(false)
      expect(orderAddons().some((a) => a.id === id), id).toBe(false)
      expect(upgradeAddons().some((a) => a.id === id), id).toBe(false)
    }
  })

  it('SKU planned disembunyikan dari order & upgrade sampai kapabilitasnya dibangun', () => {
    for (const id of PLANNED_HIDDEN) {
      expect(getAddon(id), id).toBeDefined() // tetap SKU kanonik di katalog
      expect(isOffered(id), id).toBe(false)
      expect(orderAddons().some((a) => a.id === id), id).toBe(false)
      expect(upgradeAddons().some((a) => a.id === id), id).toBe(false)
    }
  })

  it('SKU live tetap ditawarkan', () => {
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
    expect(upgradeAddons().find((a) => a.id === 'career')?.price).toBe(300000)
  })

  it('harga seo selaras corp-landing (keputusan owner 2026-06-12)', () => {
    expect(orderAddons().find((a) => a.id === 'seo')?.price).toBe(150000)
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

describe('B-cap — capabilitiesForAddons (add-on → capability renderer)', () => {
  it('memetakan id → capability dari katalog', () => {
    expect(capabilitiesForAddons(['booking'])).toEqual(expect.arrayContaining(['booking', 'booking-page']))
    expect(capabilitiesForAddons(['delivery'])).toEqual(['delivery-buttons'])
    expect(capabilitiesForAddons(['qr-menu'])).toEqual(['qr-menu'])
    expect(capabilitiesForAddons(['shop'])).toEqual(expect.arrayContaining(['cart', 'checkout-page']))
  })

  it('dedupe capability dari banyak add-on', () => {
    // booking + telemedicine → 'video-meeting' tak dobel, 'booking' tetap ada
    const caps = capabilitiesForAddons(['booking', 'telemedicine', 'live-session'])
    expect(caps.filter((c) => c === 'video-meeting')).toHaveLength(1)
    expect(caps).toContain('booking')
  })

  it('resolve alias (clinic-res → booking)', () => {
    expect(capabilitiesForAddons(['clinic-res'])).toEqual(expect.arrayContaining(['booking']))
  })

  it('id tak dikenal / kosong → []', () => {
    expect(capabilitiesForAddons(['id-ngawur'])).toEqual([])
    expect(capabilitiesForAddons([])).toEqual([])
    expect(capabilitiesForAddons(null)).toEqual([])
  })
})

describe('A2 — gating dependency + relevansi industri', () => {
  const offeredIds = new Set(orderAddons().map((a) => a.id))

  it('live-session tak lagi SKU standalone (di-merge ke video-meeting)', () => {
    expect(getAddon('live-session')).toBeUndefined()
    expect(isOffered('live-session')).toBe(false)
    expect(offeredIds.has('live-session')).toBe(false)
  })

  it('midtrans tak lagi requires shop (payment lintas shop/booking)', () => {
    expect(getAddon('midtrans')?.requires ?? []).toEqual([])
  })

  it('INVARIAN: requires tiap add-on YANG DITAWARKAN juga ditawarkan (no orphan-parent)', () => {
    for (const a of orderAddons()) {
      for (const r of a.requires ?? []) {
        expect(offeredIds.has(r), `${a.id} requires '${r}' yang tak ditawarkan`).toBe(true)
      }
    }
  })

  it('orderAddons membawa requires + industries utk gating', () => {
    // variant kini planned-hidden → cek requires di katalog; industries via SKU live.
    expect(getAddon('variant')?.requires).toContain('shop')
    expect(orderAddons().find((a) => a.id === 'qr-menu')?.industries).toContain('restaurant')
  })
})

describe('Merge video — telemedicine + live-session → video-meeting (Temuan D)', () => {
  const offeredIds = new Set(orderAddons().map((a) => a.id))

  it('video-meeting = SKU kanonik, tapi planned → TAK ditawarkan sampai dibangun (2026-06-12)', () => {
    const vm = getAddon('video-meeting')
    expect(vm).toBeDefined()
    expect(vm?.capability).toContain('video-meeting')
    expect(isOffered('video-meeting')).toBe(false)
    expect(offeredIds.has('video-meeting')).toBe(false)
  })

  it('telemedicine & live-session bukan lagi SKU kanonik', () => {
    expect(getAddon('telemedicine')).toBeUndefined()
    expect(getAddon('live-session')).toBeUndefined()
  })

  it('id lama jadi alias → video-meeting (order lama tetap resolve capability)', () => {
    const M = aliasToId()
    expect(M['telemedicine']).toBe('video-meeting')
    expect(M['live-session']).toBe('video-meeting')
    expect(capabilitiesForAddons(['telemedicine'])).toContain('video-meeting')
    expect(capabilitiesForAddons(['live-session'])).toContain('video-meeting')
  })

  it('parity flag id lama dipertahankan (FLAG_ALIASES → order lama tak berubah)', () => {
    expect(addonsToFeatures(['telemedicine'])).toEqual({ hasBooking: true })
    expect(addonsToFeatures(['live-session'])).toEqual({ hasLMS: true, hasBooking: true })
  })

  it('video-meeting requires booking (bukan lms) → bukan orphan', () => {
    expect(getAddon('video-meeting')?.requires).toEqual(['booking'])
    expect(offeredIds.has('booking')).toBe(true)
  })
})
