// ============================================================
// BESPOKE — kontrak props bersama SEMUA renderer bespoke (lintas industri:
// toko, restaurant-lux, dan tema industri berikutnya). Superset: field commerce
// (products/hasCart/CartButton) dipakai toko; field jasa (slug/capabilities)
// dipakai restaurant-lux & industri jasa. Renderer mengonsumsi yang relevan,
// mengabaikan sisanya → satu kontrak, satu registry (registry.ts).
// ============================================================
import type { ComponentType } from 'react'
import type { ComposableContent } from '@/lib/theme-system/manifest'
import type { Product, LocaleConfig } from '@/types/websitebuilder'

export interface BespokeProps {
  content: ComposableContent
  variant?: string
  primary?: string
  /** Produk DB mentah (toko) — dipasangkan ke item showcase via nama. */
  products?: Product[]
  hasCart?: boolean
  /** Slot tombol keranjang (SiteRenderer mengirim AtelierCartButton saat hasCart). */
  CartButton?: ComponentType<{ product: Product }>
  /** Slug tenant (restaurant-lux/jasa): basis href booking & link internal. */
  slug?: string
  /** Capability add-on aktif (booking/delivery/qr-menu) — UI kondisional. */
  capabilities?: string[]
  /** F&B Pre-Order: URL form PO (`/{slug}/po`) bila tenant mengaktifkan hasPreorder + ronde dibuka.
   *  Renderer mengarahkan CTA "Pesan" utama ke sini; WhatsApp jadi opsi sekunder. */
  poUrl?: string
  /** Locale per-tenant (currency/locale/phone) — format harga. Default IDR/id-ID bila kosong. */
  localeConfig?: LocaleConfig
}

/** @deprecated alias — pakai BespokeProps. Dipertahankan utk renderer toko lama. */
export type BespokeTokoProps = BespokeProps
