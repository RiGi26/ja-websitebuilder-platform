// ============================================================
// Origin situs tenant untuk TAUTAN customer-facing (lacak pesanan, invoice PDF)
// yang dikirim via WhatsApp/email. Tenant disajikan di subdomain
// `<slug>.<ROOT_DOMAIN>` ATAU custom domain — lihat src/proxy.ts (Mode 1 +
// TENANT_PASSTHROUGH `lacak`/`invoice`).
//
// JANGAN pakai NEXT_PUBLIC_BASE_URL untuk tautan ini: itu host platform (www =
// app corp landing, BUKAN app WB). Route /lacak & /invoice hanya ada di app WB
// (disajikan di `wb.webzoka.com` + subdomain tenant), jadi link `www.webzoka.com/lacak/...`
// jatuh ke app corp → 404. Bangun dari slug/custom-domain tenant agar akurat &
// ter-branding (mis. `bakso-tini.webzoka.com/lacak/<token>`).
// ============================================================

/** Origin (skema+host, tanpa trailing slash) situs tenant. */
export function tenantSiteOrigin(slug: string, domainCustom?: string | null): string {
  const custom = domainCustom?.trim()
  if (custom) {
    const withScheme = /^https?:\/\//i.test(custom) ? custom : `https://${custom}`
    return withScheme.replace(/\/+$/, '')
  }
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'webzoka.com'
  return `https://${slug}.${root}`
}
