import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// ============================================================
// Proxy (Next 16; menggantikan konvensi "middleware") — domain custom.
// Untuk request dari DOMAIN CUSTOM klien (bukan host utama app), cari
// landing page published dengan domain_custom = host lalu rewrite root '/'
// ke '/<slug>' sehingga halaman klien tampil di domainnya.
//
// Host utama (localhost, *.vercel.app, host NEXT_PUBLIC_BASE_URL) dilewati
// apa adanya. Catatan: DNS custom domain harus diarahkan ke Vercel oleh tim
// (aksi manual) sebelum ini berfungsi end-to-end.
// ============================================================

function isPrimaryHost(host: string): boolean {
  const h = host.split(':')[0].toLowerCase()
  if (h === 'localhost' || h === '127.0.0.1') return true
  if (h.endsWith('.vercel.app')) return true
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL
    if (base) {
      const baseHost = new URL(base).hostname.toLowerCase()
      if (h === baseHost) return true
    }
  } catch {
    /* abaikan */
  }
  return false
}

// Refresh sesi Supabase Auth (cookie) untuk area portal customer, sesuai
// pola @supabase/ssr. Tanpa ini, token bisa basi & server component gagal
// membaca user. Hanya menyentuh request ke /portal.
async function refreshPortalSession(req: NextRequest): Promise<NextResponse> {
  const res = NextResponse.next({ request: req })
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) return res

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() { return req.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
      },
    },
  })
  await supabase.auth.getUser()
  return res
}

export async function proxy(req: NextRequest) {
  const host = req.headers.get('host') ?? ''

  // Area portal customer: jaga sesi auth tetap segar.
  if (req.nextUrl.pathname.startsWith('/portal')) {
    return refreshPortalSession(req)
  }

  if (!host || isPrimaryHost(host)) return NextResponse.next()

  // Hanya tangani root path; path lain (aset, dsb) dibiarkan.
  if (req.nextUrl.pathname !== '/') return NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) return NextResponse.next()

  try {
    const cleanHost = host.split(':')[0].toLowerCase()
    const url = `${supabaseUrl}/rest/v1/landing_pages?domain_custom=eq.${encodeURIComponent(
      cleanHost
    )}&status=eq.published&select=slug&limit=1`
    const res = await fetch(url, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.next()
    const rows = (await res.json()) as Array<{ slug: string | null }>
    const slug = rows?.[0]?.slug
    if (!slug) return NextResponse.next()

    const rewriteUrl = req.nextUrl.clone()
    rewriteUrl.pathname = `/${slug}`
    return NextResponse.rewrite(rewriteUrl)
  } catch {
    return NextResponse.next()
  }
}

// Jangan jalankan untuk aset internal & API.
export const config = {
  matcher: ['/((?!_next/|api/|favicon.ico|.*\\.).*)'],
}
