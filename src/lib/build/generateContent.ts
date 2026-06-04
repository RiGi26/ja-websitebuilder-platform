// ============================================================
// F1-1 — generateContent(order): pintu masuk pipeline build_order.
// order -> normalisasi briefing -> template per industri -> tokens + features
// -> BuildPlan siap tulis. Murni fungsi (tanpa I/O) → mudah dites & dipanggil
// dari API route. Port logika skill .claude/commands/build-order.md.
// ============================================================
import type { BuildPlan, BuildTenantProfile } from './types'
import { normalizeBriefing } from './briefing'
import { runTemplate } from './templates'
import { deriveDesignTokens, defaultVariant } from './designTokens'
import { industryToTheme, addonsToFeatures } from '@/lib/websitebuilder-mapping'

type OrderLike = {
  industri?: string | null
  nama_usaha?: string | null
  nama_perusahaan?: string | null
  nomor_wa?: string | null
  email?: string | null
  briefing_data?: unknown
  selected_addons?: string[] | null
}

export function generateContent(order: OrderLike): BuildPlan {
  const b = normalizeBriefing(order)
  const out = runTemplate(b)

  const theme = industryToTheme(b.tipe)
  const variant = b.variant || defaultVariant(b.tipe)
  const designTokens = deriveDesignTokens(b.tipe, b.primary)
  const features = addonsToFeatures(order.selected_addons)

  const services = out.services ?? []
  const menuItems = out.menuItems ?? []
  const products = out.products ?? []

  const tenantProfile: BuildTenantProfile = {
    wa: b.wa || undefined,
    email: b.email || undefined,
    alamat: b.alamat || undefined,
    jam: b.jamOperasional || undefined,
    instagram: b.sosial.instagram || undefined,
  }

  return {
    theme,
    variant,
    primary: b.primary,
    designTokens,
    features,
    dataKonten: out.dataKonten,
    sections: out.sections,
    services,
    menuItems,
    products,
    tenantProfile,
    summary: {
      tipe: b.tipe,
      theme,
      variant,
      primary: b.primary,
      nSections: out.sections.length,
      nServices: services.length,
      nMenu: menuItems.length,
      nProducts: products.length,
    },
  }
}
