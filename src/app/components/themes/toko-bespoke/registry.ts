// ============================================================
// BESPOKE — registry universal theme key → renderer bespoke (LINTAS INDUSTRI).
// SiteRenderer melakukan SATU lookup di sini (sebelum cabang composable) → tak
// ada cabang if per tema/industri. Tiap entri mendeklarasikan `source` (etalase
// mana yang di-fetch: products/menu/services/blog) + `hasCart` (toko saja).
// gen-samples.test.tsx mengimpor renderer langsung (bukan map ini).
// ============================================================
import type { ComponentType } from 'react'
import type { BespokeProps } from './types'
import RestaurantLuxRenderer from '../restaurant-lux/RestaurantLuxRenderer'
import TokoAtelierRenderer from '../toko-atelier/TokoAtelierRenderer'
import KulinerLuxRenderer from './KulinerLuxRenderer'
import KerajinanLuxRenderer from './KerajinanLuxRenderer'
import KecantikanLuxRenderer from './KecantikanLuxRenderer'
import GadgetLuxRenderer from './GadgetLuxRenderer'

/** Sumber etalase yang di-fetch SiteRenderer untuk renderer ini. */
export type BespokeSource = 'products' | 'menu' | 'services' | 'blog'

export interface BespokeEntry {
  Renderer: ComponentType<BespokeProps>
  /** Etalase mana yang di-fetch & dialirkan ke composableContentFromSections. */
  source: BespokeSource
  /** Toko: aktifkan keranjang (CartProvider + tombol per item). Default false. */
  hasCart?: boolean
  /** Judul default section showcase saat konten tak menyetelnya. */
  showcaseTitle?: string
}

export const BESPOKE_RENDERERS: Record<string, BespokeEntry> = {
  // Restaurant-lux (finedining) — etalase = menu_items, tanpa keranjang.
  'restaurant-lux': { Renderer: RestaurantLuxRenderer, source: 'menu', showcaseTitle: 'Menu Kami' },
  // Toko bespoke — etalase = products, keranjang aktif.
  'toko-atelier': { Renderer: TokoAtelierRenderer, source: 'products', hasCart: true, showcaseTitle: 'Koleksi Kami' },
  'toko-kuliner': { Renderer: KulinerLuxRenderer, source: 'products', hasCart: true, showcaseTitle: 'Menu Kami' },
  'toko-kerajinan': { Renderer: KerajinanLuxRenderer, source: 'products', hasCart: true, showcaseTitle: 'Koleksi Kerajinan' },
  'toko-kecantikan': { Renderer: KecantikanLuxRenderer, source: 'products', hasCart: true, showcaseTitle: 'Koleksi Kami' },
  'toko-gadget': { Renderer: GadgetLuxRenderer, source: 'products', hasCart: true, showcaseTitle: 'Katalog Produk' },
}
