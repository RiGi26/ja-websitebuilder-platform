import { NextResponse, type NextRequest } from 'next/server'

// Subdomain routing untuk situs tenant: `<slug>.webzoka.com` → render route
// publik `/[slug]` yang sudah ada. Path lama `wb.webzoka.com/<slug>` TETAP
// jalan (nol regresi) — middleware hanya menulis-ulang saat host benar-benar
// subdomain tenant di bawah ROOT_DOMAIN.
//
// Tak ada query DB di sini (edge ringan): kalau slug tak ada, route `[slug]`
// yang menangani 404.

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'webzoka.com'

// Subdomain yang BUKAN tenant: portal sistem + route/host fungsional platform.
// `wb` = host builder itu sendiri (admin/order/portal/pricing/dst).
const RESERVED_SUBDOMAINS = new Set([
  'www',
  'wb',
  'stock',
  'lms',
  'clinic',
  'pharmacy',
  'rent',
  'superadmin',
  'api',
])

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').split(':')[0].toLowerCase()

  // Hanya tangani host di bawah ROOT_DOMAIN. Apex (`webzoka.com`),
  // `*.vercel.app`, dan `localhost` lewat tanpa diubah → path-based tetap hidup.
  if (!host.endsWith(`.${ROOT_DOMAIN}`)) {
    return NextResponse.next()
  }

  const subdomain = host.slice(0, host.length - (ROOT_DOMAIN.length + 1))

  // Subdomain bertingkat (mis. `a.b.webzoka.com`) atau reserved → lewati.
  if (!subdomain || subdomain.includes('.') || RESERVED_SUBDOMAINS.has(subdomain)) {
    return NextResponse.next()
  }

  // Tenant subdomain: tulis-ulang path ke namespace slug.
  //   bakso-tini.webzoka.com/           → /bakso-tini
  //   bakso-tini.webzoka.com/checkout   → /bakso-tini/checkout
  const { pathname, search } = req.nextUrl
  const url = req.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${subdomain}` : `/${subdomain}${pathname}`
  url.search = search
  return NextResponse.rewrite(url)
}

export const config = {
  // Lewati API, internal Next, dan file statis (punya ekstensi). Pada subdomain
  // tenant, `/api/*` sengaja TIDAK ditulis-ulang → tetap mengarah ke API bersama.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
