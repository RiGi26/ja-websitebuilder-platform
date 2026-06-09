// ============================================================
// WhatsApp terpusat (render-side). Satu sumber nomor WA = tenant_profile.wa
// (tab Profil portal). Link wa.me di situs dirender ULANG dari nomor terkini,
// bukan dari cta_link yang di-bake saat build (yang basi saat customer ganti WA).
// ============================================================

export function waDigits(wa: string | null | undefined): string {
  return (wa ?? '').replace(/[^\d]/g, '')
}

/** Link wa.me siap pakai dari nomor. '#' bila nomor kosong. */
export function waLink(wa: string | null | undefined): string {
  const d = waDigits(wa)
  return d ? `https://wa.me/${d}` : '#'
}

const WA_RE = /^https?:\/\/(?:wa\.me|api\.whatsapp\.com)\//i

/**
 * Pusatkan WA di link CTA: bila `href` adalah link wa.me/whatsapp (atau placeholder
 * '#' dari build saat WA masih kosong), render ulang dari `wa` terkini. Link non-WA
 * (mis. '#menu', '#koleksi') dibiarkan utuh. `wa` kosong → href apa adanya.
 */
export function resolveWaHref(href: string | undefined, wa: string | null | undefined): string | undefined {
  const d = waDigits(wa)
  if (!d) return href
  if (href && WA_RE.test(href)) return `https://wa.me/${d}`
  if (href === '#') return `https://wa.me/${d}`
  return href
}
