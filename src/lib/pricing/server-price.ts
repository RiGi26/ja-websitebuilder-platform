// Server-authoritative pricing for /api/payment/create.
//
// SECURITY: the order/checkout flow must NEVER trust a client-supplied price.
// Previously /api/payment/create took the client's `total_estimasi` verbatim as
// the Midtrans gross_amount — a tampered total became the real charge. This
// module recomputes the gross (and the year-2 maintenance quote) from trusted
// sources so the client number can only be used for display, never for billing.
//
// Two pricing models feed the order form (src/app/order/page.tsx):
//   1. WB-native — base = templatesData[template_id].price_numeric (or a bare
//      default) + Σ ADDON_CATALOG price for offered add-ons.
//   2. Corp "Rakit Website" calculator handoff — base = HOSTING_PACKAGES price
//      (or a fixed BUNDLES price) + Σ priced corp add-ons.
//
// ⚠️ SYNC: KALKULATOR_* below MIRRORS ja-corp-landing/constants/services.ts
// (HOSTING_PACKAGES, ADDON_GROUPS priced items, BUNDLES). They MUST stay in sync.
// Corp is a static export and cannot price at request time, so WB is the price
// authority for both surfaces. Numbers verified against services.ts 2026-06-13.
// Follow-up: a CI/test check asserting these tables match corp's SSOT.

import { templatesData } from '@/data/templates'
import { getAddon, isOffered } from '@/lib/addons/catalog'

// Bare WB-native order (no template chosen, no calculator) — mirrors the
// `|| 499000` / `|| 699000` fallbacks in src/app/order/page.tsx.
const DEFAULT_BASE = 499000
const DEFAULT_RENEWAL = 699000

// ── Mirror: corp HOSTING_PACKAGES (name → price/maintain) ───────
const KALKULATOR_PACKAGE: Record<string, { price: number; maintain: number }> = {
  Basic: { price: 600000, maintain: 450000 },
  Starter: { price: 1200000, maintain: 900000 },
  Growth: { price: 2500000, maintain: 1875000 },
  Business: { price: 5000000, maintain: 3750000 },
  Enterprise: { price: 10000000, maintain: 7500000 },
}

// ── Mirror: corp ADDON_GROUPS — PRICED items only (availability live|manual).
// An id absent here (portal/soon/unknown) contributes 0, exactly like corp's
// isPricedAddon() filter. Maintenance per add-on = round(price * 0.75).
const KALKULATOR_ADDON_PRICE: Record<string, number> = {
  'admin-dash': 250000,
  midtrans: 400000,
  'wa-auto': 300000,
  'g-sheets': 150000,
  'invoice-auto': 200000,
  seo: 150000,
  'live-chat': 100000,
  api: 450000,
  'email-auto': 200000,
  blog: 200000,
  career: 300000,
  newsletter: 200000,
  cart: 250000,
  checkout: 200000,
  booking: 300000,
  'doc-sched': 300000,
}

// ── Mirror: corp BUNDLES (id → fixed bundlePrice). Maintenance for a bundle is
// still package.maintain + Σ round(addon.price*0.75): corp computes maintain
// independently of the bundle setup discount.
const KALKULATOR_BUNDLE_SETUP: Record<string, number> = {
  'starter-bisnis': 999000,
  'corporate-pro': 1299000,
  'toko-online': 1699000,
}

export interface PriceInput {
  template_id?: string | null
  selected_addons?: string[] | null
  from_kalkulator?: boolean
  paket?: string | null
  /** Raw corp add-on ids, comma-joined (the calculator handoff `?addons=`). */
  kalkulator_addons?: string | null
  bundle?: string | null
}

export type PricePath =
  | 'native'
  | 'native-default'
  | 'kalkulator'
  | 'kalkulator-bundle'
  | 'unpriceable'

export interface PriceResult {
  /** Authoritative gross (pre-referral). null = unpriceable → caller must reject. */
  gross: number | null
  /** Authoritative year-2 maintenance quote (does not affect the charge). */
  maintenance: number | null
  path: PricePath
}

function parseIds(raw?: string | null): string[] {
  if (!raw) return []
  return raw.split(',').map((s) => s.trim()).filter(Boolean)
}

function computeNative(input: PriceInput): PriceResult {
  const tpl = input.template_id ? templatesData[input.template_id] : null
  let gross = tpl ? tpl.price_numeric : DEFAULT_BASE
  let maintenance = tpl ? tpl.renewal_price : DEFAULT_RENEWAL
  for (const id of input.selected_addons ?? []) {
    if (!isOffered(id)) continue
    const a = getAddon(id)
    if (!a) continue
    gross += a.price
    maintenance += a.yearlyMaint
  }
  return { gross, maintenance, path: tpl ? 'native' : 'native-default' }
}

function computeKalkulator(input: PriceInput): PriceResult {
  const pkg = input.paket ? KALKULATOR_PACKAGE[input.paket] : undefined
  if (!pkg) return { gross: null, maintenance: null, path: 'unpriceable' }

  const ids = parseIds(input.kalkulator_addons)
  const pricedSum = ids.reduce((acc, id) => acc + (KALKULATOR_ADDON_PRICE[id] ?? 0), 0)
  const maintenance =
    pkg.maintain +
    ids.reduce((acc, id) => acc + Math.round((KALKULATOR_ADDON_PRICE[id] ?? 0) * 0.75), 0)

  const bundlePrice = input.bundle ? KALKULATOR_BUNDLE_SETUP[input.bundle] : undefined
  if (bundlePrice != null) {
    return { gross: bundlePrice, maintenance, path: 'kalkulator-bundle' }
  }
  return { gross: pkg.price + pricedSum, maintenance, path: 'kalkulator' }
}

/**
 * Authoritative server price. The WB-native and bare paths are always
 * priceable; the calculator handoff is rejectable (gross=null) only when the
 * package name is unknown (tampered/unrecognised → fail closed).
 */
export function computeServerPrice(input: PriceInput): PriceResult {
  // A valid WB template id is the strongest signal → native authority.
  if (input.template_id && templatesData[input.template_id]) return computeNative(input)
  // Corp calculator handoff (carries a package name and/or the explicit flag).
  if (input.paket || input.from_kalkulator) return computeKalkulator(input)
  // Bare WB-native order (no template, no calculator) → default base + add-ons.
  return computeNative(input)
}
