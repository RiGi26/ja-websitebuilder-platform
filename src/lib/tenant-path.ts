import { headers } from 'next/headers'

// ============================================================
// Basis path link internal antar-halaman situs tenant.
//
// Proxy Mode 1 me-rewrite SEMUA path subdomain dengan prefix slug
// (`blog.webzoka.com/x` → `/blog/x`), jadi href `/{slug}/x` di subdomain
// berubah jadi `/{slug}/{slug}/x` → 404. Di host utama (wb.webzoka.com,
// *.vercel.app) dan domain custom (Mode 2 pass-through utk path non-root),
// href `/{slug}/x` justru benar.
//
// → Di subdomain tenant milik slug ybs: basis = '' (href `/x`).
// → Selain itu: basis = `/{slug}`.
// Server-side padanan trik client sewa (SewaStatusClient.basePath).
// ============================================================
export async function tenantBasePath(slug: string): Promise<string> {
  const host = (await headers()).get('host') ?? ''
  const h = host.split(':')[0].toLowerCase()
  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'webzoka.com').toLowerCase()
  if (h.endsWith(`.${root}`)) {
    const sub = h.slice(0, h.length - (root.length + 1))
    if (sub && !sub.includes('.') && sub === slug.toLowerCase()) return ''
  }
  return `/${slug}`
}
