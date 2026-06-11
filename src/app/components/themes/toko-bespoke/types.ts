// ============================================================
// TOKO-BESPOKE — kontrak props bersama untuk renderer bespoke toko.
// Bentuk IDENTIK dengan TokoAtelierProps (nol plumbing baru): mengonsumsi
// ComposableContent + produk DB mentah + slot tombol keranjang.
// ============================================================
import type { ComponentType } from 'react'
import type { ComposableContent } from '@/lib/theme-system/manifest'
import type { Product } from '@/types/websitebuilder'

export interface BespokeTokoProps {
  content: ComposableContent
  variant?: string
  primary?: string
  /** Produk DB mentah (produksi) — dipasangkan ke item showcase via nama. */
  products?: Product[]
  hasCart?: boolean
  /** Slot tombol keranjang (SiteRenderer mengirim AtelierCartButton saat hasCart). */
  CartButton?: ComponentType<{ product: Product }>
}
