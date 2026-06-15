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
import RumahLuxRenderer from './RumahLuxRenderer'
import KesehatanLuxRenderer from './KesehatanLuxRenderer'
import AnakLuxRenderer from './AnakLuxRenderer'
import KlinikUmumRenderer from './KlinikUmumRenderer'
import KlinikEstetikRenderer from './KlinikEstetikRenderer'
import KlinikWellnessRenderer from './KlinikWellnessRenderer'
import WarungRenderer from './WarungRenderer'
import CafeRenderer from './CafeRenderer'
import SekolahAlmamaterRenderer from './SekolahAlmamaterRenderer'

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
  // Restaurant warung/kedai bespoke (Wave 2 "Hangat") — etalase = menu, tanpa keranjang.
  'restaurant-warung': { Renderer: WarungRenderer, source: 'menu', showcaseTitle: 'Menu Kami' },
  // Restaurant cafe/coffee shop bespoke (Wave 2 "Seduh") — etalase = menu, tanpa keranjang.
  'restaurant-cafe': { Renderer: CafeRenderer, source: 'menu', showcaseTitle: 'Menu Kami' },
  // Klinik bespoke (Wave 2) — etalase = services (jasa), tanpa keranjang.
  'klinik-umum': { Renderer: KlinikUmumRenderer, source: 'services', showcaseTitle: 'Layanan Kami' },
  'klinik-estetik': { Renderer: KlinikEstetikRenderer, source: 'services', showcaseTitle: 'Perawatan Kami' },
  'klinik-wellness': { Renderer: KlinikWellnessRenderer, source: 'services', showcaseTitle: 'Layanan Terapi' },
  // Sekolah bespoke (Wave 3 "Almamater") — etalase = services (program/jenjang), tanpa keranjang.
  'sekolah-reguler': { Renderer: SekolahAlmamaterRenderer, source: 'services', showcaseTitle: 'Program Kami' },
  // Toko bespoke — etalase = products, keranjang aktif.
  'toko-atelier': { Renderer: TokoAtelierRenderer, source: 'products', hasCart: true, showcaseTitle: 'Koleksi Kami' },
  'toko-kuliner': { Renderer: KulinerLuxRenderer, source: 'products', hasCart: true, showcaseTitle: 'Menu Kami' },
  'toko-kerajinan': { Renderer: KerajinanLuxRenderer, source: 'products', hasCart: true, showcaseTitle: 'Koleksi Kerajinan' },
  'toko-kecantikan': { Renderer: KecantikanLuxRenderer, source: 'products', hasCart: true, showcaseTitle: 'Koleksi Kami' },
  'toko-gadget': { Renderer: GadgetLuxRenderer, source: 'products', hasCart: true, showcaseTitle: 'Katalog Produk' },
  'toko-rumah': { Renderer: RumahLuxRenderer, source: 'products', hasCart: true, showcaseTitle: 'Koleksi Kami' },
  'toko-kesehatan': { Renderer: KesehatanLuxRenderer, source: 'products', hasCart: true, showcaseTitle: 'Etalase Herbal' },
  'toko-anak': { Renderer: AnakLuxRenderer, source: 'products', hasCart: true, showcaseTitle: 'Mainan Favorit' },
}
