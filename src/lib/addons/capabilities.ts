// ============================================================
// RENDER-TIME capability resolver.
// ------------------------------------------------------------
// konfigurasi.capabilities (string[], hasil capabilitiesForAddons di build-time)
// → flag UI siap-pakai untuk renderer (booking CTA / delivery / QR / video).
//
// Beda peran dengan `capabilitiesForAddons` di catalog.ts:
//   - catalog.capabilitiesForAddons : BUILD-TIME, selected_addons → capability strings.
//   - resolveCapabilities (ini)      : RENDER-TIME, capability strings → flag UI.
// Dipisah supaya logika baca-capability ditulis SEKALI dan dipakai-ulang lintas
// renderer (restaurant-lux + composable + lux industri lain) tanpa duplikasi.
// ============================================================

export interface CapabilityFlags {
  /** Set mentah capability (untuk cek ad-hoc bila perlu). */
  caps: Set<string>
  /** Tautan ke sistem booking nyata `/{slug}/booking` bila cap 'booking' ada & slug diberi. */
  bookingHref?: string
  /** 'delivery-buttons' → tombol "Pesan Antar". */
  hasDelivery: boolean
  /** 'qr-menu' → catatan menu digital QR. */
  hasQrMenu: boolean
  /** 'video-meeting' (merge telemedicine+live-session, #112) — di-expose untuk UI nanti. */
  hasVideoMeeting: boolean
}

/** Baca array capability (dari konfigurasi.capabilities) → flag UI siap render. */
export function resolveCapabilities(
  capabilities: string[] | null | undefined,
  slug?: string,
): CapabilityFlags {
  const caps = new Set(capabilities ?? [])
  return {
    caps,
    bookingHref: caps.has('booking') && slug ? `/${slug}/booking` : undefined,
    hasDelivery: caps.has('delivery-buttons'),
    hasQrMenu: caps.has('qr-menu'),
    hasVideoMeeting: caps.has('video-meeting'),
  }
}
