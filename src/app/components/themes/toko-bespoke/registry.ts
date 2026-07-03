// ============================================================
// BESPOKE — registry universal theme key → renderer bespoke (LINTAS INDUSTRI).
// SiteRenderer melakukan SATU lookup di sini (sebelum cabang composable) → tak
// ada cabang if per tema/industri. Tiap entri mendeklarasikan `source` (etalase
// mana yang di-fetch: products/menu/services/blog) + `hasCart` (toko saja).
// gen-samples.test.tsx mengimpor renderer langsung (bukan map ini).
// ============================================================
import type { ComponentType } from 'react'
import type { BespokeProps } from './types'
import type { ThemeSlotManifest } from '@/lib/theme-system/slot-schema'
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
import KlinikFisioRenderer from './KlinikFisioRenderer'
import WarungRenderer from './WarungRenderer'
import CafeRenderer from './CafeRenderer'
import SekolahAlmamaterRenderer from './SekolahAlmamaterRenderer'
import AgencyPosterRenderer from './AgencyPosterRenderer'
import { WARUNG_SLOTS } from './slots/restaurant-warung.slots'
import { CORPORATE_AGENCY_SLOTS } from './slots/corporate-agency.slots'

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
  /** Manifest field editable tema (slot-schema) — sumber form "Konten Tema" di
   *  portal + validasi /api/portal/theme-copy. Absen = tema belum dimigrasi
   *  zero-hardcode (portal tak menampilkan panel; route menolak tulis). */
  slots?: ThemeSlotManifest
  /** Style knobs (Wave 3) — pilihan KURASI per tema utk tenant: palet (id =
   *  variant renderer, wajib punya contrast test) + font pairing (cek ledger:
   *  jangan tabrak font identitas tema lain). [0] = bawaan. Absen = tema tak
   *  menawarkan knob (portal tak menampilkan picker; route menolak tulis). */
  design?: ThemeDesignOptions
}

export interface ThemeFontPairing {
  id: string
  label: string
  /** URL Google Fonts css2 lengkap (display=swap). */
  importUrl: string
  /** Nilai font-family CSS display & body (dengan fallback stack). */
  display: string
  body: string
}

export interface ThemeDesignOptions {
  /** id = key PALETTES/variant renderer; swatch utk picker portal. [0] = bawaan. */
  palettes: { id: string; label: string; swatch: string }[]
  /** [0] = bawaan (WAJIB identik konstanta renderer — parity situs existing). */
  fontPairings?: ThemeFontPairing[]
  /** true = tenant boleh set warna aksen hex bebas (belum dipakai tema mana pun). */
  allowAccent?: boolean
}

export const BESPOKE_RENDERERS: Record<string, BespokeEntry> = {
  // Restaurant-lux (finedining) — etalase = menu_items, tanpa keranjang.
  'restaurant-lux': { Renderer: RestaurantLuxRenderer, source: 'menu', showcaseTitle: 'Menu Kami' },
  // Restaurant warung/kedai bespoke (Wave 2 "Hangat") — etalase = menu, tanpa keranjang.
  // Pilot zero-hardcoded-copy (slots) + style knobs (design). Pairing alternatif
  // lolos cek ledger: Bree Serif/Karla & Alegreya tak dipakai tema lain (Karla =
  // body warung sesuai ledger). Palet 'biru' sudah ber-contrast test.
  'restaurant-warung': {
    Renderer: WarungRenderer, source: 'menu', showcaseTitle: 'Menu Kami', slots: WARUNG_SLOTS,
    design: {
      palettes: [
        { id: 'hangat', label: 'Hangat (bawaan)', swatch: '#C0432E' },
        { id: 'biru', label: 'Biru Minimal', swatch: '#0071E3' },
      ],
      fontPairings: [
        {
          id: 'bawaan', label: 'Hangat Bulat (bawaan)',
          importUrl: 'https://fonts.googleapis.com/css2?family=Caprasimo&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
          display: '"Caprasimo","Cooper Black",Georgia,serif',
          body: '"Plus Jakarta Sans","Segoe UI",system-ui,sans-serif',
        },
        {
          id: 'rustik', label: 'Rustik',
          importUrl: 'https://fonts.googleapis.com/css2?family=Bree+Serif&family=Karla:wght@300;400;500;600;700;800&display=swap',
          display: '"Bree Serif",Georgia,serif',
          body: '"Karla","Segoe UI",system-ui,sans-serif',
        },
        {
          id: 'klasik', label: 'Klasik Hangat',
          importUrl: 'https://fonts.googleapis.com/css2?family=Alegreya:wght@500;600;700&family=Alegreya+Sans:wght@300;400;500;700;800&display=swap',
          display: '"Alegreya",Georgia,serif',
          body: '"Alegreya Sans","Segoe UI",system-ui,sans-serif',
        },
      ],
    },
  },
  // Restaurant cafe/coffee shop bespoke (Wave 2 "Seduh") — etalase = menu, tanpa keranjang.
  'restaurant-cafe': { Renderer: CafeRenderer, source: 'menu', showcaseTitle: 'Menu Kami' },
  // Klinik bespoke (Wave 2) — etalase = services (jasa), tanpa keranjang.
  'klinik-umum': { Renderer: KlinikUmumRenderer, source: 'services', showcaseTitle: 'Layanan Kami' },
  'klinik-estetik': { Renderer: KlinikEstetikRenderer, source: 'services', showcaseTitle: 'Perawatan Kami' },
  'klinik-wellness': { Renderer: KlinikWellnessRenderer, source: 'services', showcaseTitle: 'Layanan Terapi' },
  'klinik-fisio': { Renderer: KlinikFisioRenderer, source: 'services', showcaseTitle: 'Paket Terapi' },
  // Sekolah bespoke (Wave 3 "Almamater") — etalase = services (program/jenjang), tanpa keranjang.
  'sekolah-reguler': { Renderer: SekolahAlmamaterRenderer, source: 'services', showcaseTitle: 'Program Kami' },
  // Corporate agency bespoke (Wave 4 "Poster") — tema PERTAMA hasil compiler
  // HTML-first (theme-sources/corporate-agency). Etalase = services, tanpa
  // keranjang. Slots + design ikut di-emit/kurasi dari sumber HTML; pairing
  // alternatif lolos cek ledger (Bebas Neue/Oswald/Onest tak dipakai tema lain).
  'corporate-agency': {
    Renderer: AgencyPosterRenderer, source: 'services', showcaseTitle: 'Layanan Kami', slots: CORPORATE_AGENCY_SLOTS,
    design: {
      palettes: [
        { id: 'bawaan', label: 'Paper (bawaan)', swatch: '#1B2AB8' },
        { id: 'arang', label: 'Arang (gelap)', swatch: '#93A2FF' },
      ],
      fontPairings: [
        {
          id: 'bawaan', label: 'Poster (bawaan)',
          importUrl: 'https://fonts.googleapis.com/css2?family=Anton&family=Albert+Sans:wght@400;500;600;700;800&display=swap',
          display: "'Anton','Arial Narrow',Impact,sans-serif",
          body: "'Albert Sans','Segoe UI',system-ui,sans-serif",
        },
        {
          id: 'klasik', label: 'Klasik Poster',
          importUrl: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Onest:wght@400;500;600;700;800&display=swap',
          display: "'Bebas Neue','Arial Narrow',Impact,sans-serif",
          body: "'Onest','Segoe UI',system-ui,sans-serif",
        },
        {
          id: 'ringkas', label: 'Ringkas',
          importUrl: 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Albert+Sans:wght@400;500;600;700;800&display=swap',
          display: "'Oswald','Arial Narrow',Impact,sans-serif",
          body: "'Albert Sans','Segoe UI',system-ui,sans-serif",
        },
      ],
    },
  },
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
