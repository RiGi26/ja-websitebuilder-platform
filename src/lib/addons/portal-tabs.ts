import type { FeatureFlags } from '@/types/websitebuilder'

// Gating tab portal berbasis add-on (SSOT = landing_pages.konfigurasi.features,
// diisi addonsToFeatures(order.selected_addons) saat provisioning; admin bisa
// override per-page via BuilderEditor). Helper murni — aman diimpor client.

/**
 * Tab Pembayaran (Midtrans self-service) = berbayar (add-on `midtrans`).
 * Entitled bila flag hasPayment menyala ATAU tenant sudah pernah konfigurasi
 * pembayaran (grandfather — tab dulunya tanpa gate; jangan matikan checkout
 * yang sudah hidup).
 */
export function paymentEntitled(features: FeatureFlags | undefined, hasExistingConfig: boolean): boolean {
  return !!features?.hasPayment || hasExistingConfig
}
