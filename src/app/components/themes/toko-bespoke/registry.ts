// ============================================================
// TOKO-BESPOKE — registry theme key → renderer bespoke.
// SiteRenderer melakukan SATU lookup di sini (sebelum cabang composable) →
// tak ada cabang if per sub-kategori. gen-samples.test.tsx juga membaca map ini.
// WAJIB sinkron dengan TOKO_BESPOKE_VARIANTS (variants.ts, field `theme`).
// ============================================================
import type { ComponentType } from 'react'
import type { BespokeTokoProps } from './types'
import TokoAtelierRenderer from '../toko-atelier/TokoAtelierRenderer'
import KulinerLuxRenderer from './KulinerLuxRenderer'
import KerajinanLuxRenderer from './KerajinanLuxRenderer'

export interface BespokeEntry {
  Renderer: ComponentType<BespokeTokoProps>
  /** Judul default section showcase saat konten tak menyetelnya. */
  showcaseTitle?: string
}

export const TOKO_BESPOKE: Record<string, BespokeEntry> = {
  'toko-atelier': { Renderer: TokoAtelierRenderer, showcaseTitle: 'Koleksi Kami' },
  'toko-kuliner': { Renderer: KulinerLuxRenderer, showcaseTitle: 'Menu Kami' },
  'toko-kerajinan': { Renderer: KerajinanLuxRenderer, showcaseTitle: 'Koleksi Kerajinan' },
}
