// ============================================================
// THEME SYSTEM — Lapis 3 manifest (Sprint 0, S0-2).
// 1 tema = 1 "resep" deklaratif: pilih balok per slot + token (base pack +
// override). Mesin ComposableRenderer membaca manifest ini.
//
// Reuse penuh packs.ts (TokenPack) sebagai bahasa token — manifest hanya
// memilih base pack + override warna/layout + varian balok. Belum di-wire ke
// SiteRenderer/brief form (itu S0-3/S0-4) → nol regresi.
//
// Catatan: 3 gaya Kuliner di sini = BENIH (engine proof). Token & balok masih
// reuse pack lama + override ringan; keotentikan penuh per gaya digarap di
// Sprint 1 (THEME_SYSTEM_PLAN §8). Lihat juga taxonomy.ts (id tema cocok).
// ============================================================
import { PACKS, type TokenPack } from '@/lib/design-tokens/packs'

export type HeroVariant = 'centered' | 'split' | 'fullbleed'
export type ShowcaseVariant = 'menu-list' | 'card-grid'

export interface ThemeManifest {
  id: string // cocok dgn ThemeOption.manifest di taxonomy.ts (mis. 'kuliner-rustic')
  label: string
  basePackId: string // id TokenPack dasar dari packs.ts
  colorOverrides?: Partial<TokenPack['color']>
  layoutOverrides?: Partial<TokenPack['layout']>
  blocks: {
    hero: HeroVariant
    showcase: ShowcaseVariant
  }
}

// ── Bentuk konten yang dikonsumsi mesin ───────────────────────
export interface ShowcaseItem {
  nama: string
  harga?: number
  desc?: string
  gambar?: string
}
export interface ComposableContent {
  nama: string
  hero: { eyebrow?: string; title: string; subtitle?: string; ctaText?: string; ctaHref?: string }
  showcase?: { title?: string; subtitle?: string; items: ShowcaseItem[] }
  about?: { title: string; body: string }
  cta?: { title: string; subtitle?: string; ctaText?: string; ctaHref?: string }
  contact?: { wa?: string; email?: string; alamat?: string }
}

// ── Registry manifest (pilot Kuliner ×3) ──────────────────────
export const MANIFESTS: Record<string, ThemeManifest> = {
  // Rustic Hangat — warung homemade (pempek). Hangat, terracotta, menu daftar.
  'kuliner-rustic': {
    id: 'kuliner-rustic',
    label: 'Rustic Hangat',
    basePackId: 'warm-cafe',
    colorOverrides: { primary: '#B5532A', onPrimary: '#FFFFFF' },
    blocks: { hero: 'centered', showcase: 'menu-list' },
  },
  // Modern Appetite — brand F&B kekinian. Bersih, cerah, grid kartu produk.
  'kuliner-modern': {
    id: 'kuliner-modern',
    label: 'Modern Appetite',
    basePackId: 'clean-modern',
    colorOverrides: { primary: '#E2582B', onPrimary: '#FFFFFF', heroTo: '#FFE4D6' },
    layoutOverrides: { hero: 'split' },
    blocks: { hero: 'split', showcase: 'card-grid' },
  },
  // Heritage Kuliner — kuliner premium/tradisional. Gelap-hangat maroon + gold.
  'kuliner-heritage': {
    id: 'kuliner-heritage',
    label: 'Heritage Kuliner',
    basePackId: 'luxury-navy',
    colorOverrides: {
      page: '#1A1011', surface: '#241619', ink: '#F4E9DE', muted: '#B9A89B',
      primary: '#C8A24B', onPrimary: '#1A1011',
      heroFrom: '#1A1011', heroTo: '#3D1F23', heroInk: '#FDF6EC',
    },
    blocks: { hero: 'fullbleed', showcase: 'menu-list' },
  },
}

export function getManifest(id?: string): ThemeManifest | undefined {
  if (!id) return undefined
  return MANIFESTS[id]
}

// Resolve TokenPack final dari manifest: base pack + override warna/layout.
export function resolveManifestPack(m: ThemeManifest): TokenPack {
  const base = PACKS[m.basePackId] ?? PACKS['clean-modern']
  return {
    ...base,
    color: { ...base.color, ...(m.colorOverrides ?? {}) },
    layout: { ...base.layout, ...(m.layoutOverrides ?? {}) },
  }
}
