import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fetchPageBySlug } from '@/lib/supabase/websitebuilder'
import { renderSite } from '@/app/components/SiteRenderer'
import type { LandingPageWithSections } from '@/types/websitebuilder'

// Halaman publik klien. Render dinamis (data dari Supabase), dibaca via
// anon client → RLS hanya mengizinkan status='published' + section visible.
export const dynamic = 'force-dynamic'

// Favicon tab PER-TENANT: inisial nama bisnis di atas warna brand-nya (SVG
// data-URI inline → tanpa request/DB tambahan). Tenant belum punya logo upload,
// jadi inisial-mark = identitas tab yang khas per situs. Di-set via metadata.icons
// di segmen [slug] → override ikon Webzoka root utk halaman tenant.
function tenantFaviconDataUri(name: string, primaryRaw?: string): string {
  const letter = (name.trim().match(/[A-Za-z0-9]/)?.[0] ?? 'W').toUpperCase()
  const bg = primaryRaw && /^#?[0-9a-fA-F]{3,8}$/.test(primaryRaw)
    ? (primaryRaw.startsWith('#') ? primaryRaw : `#${primaryRaw}`)
    : '#2563EB'
  // Kontras teks: putih di warna gelap, mendekati hitam di warna terang.
  const h = bg.slice(1)
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6)
  const r = parseInt(full.slice(0, 2), 16), g = parseInt(full.slice(2, 4), 16), b = parseInt(full.slice(4, 6), 16)
  const fg = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? '#1A1A1A' : '#FFFFFF'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${bg}"/><text x="32" y="33" font-family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="40" font-weight="700" fill="${fg}" text-anchor="middle" dominant-baseline="central">${letter}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// Dibungkus React cache() → dedupe per-request: generateMetadata DAN komponen
// page memanggil getPage(slug) dengan arg sama, tapi query Supabase hanya jalan
// SEKALI per request (hilangkan 1 round-trip DB per load).
const getPage = cache(async (slug: string): Promise<LandingPageWithSections | null> => {
  try {
    return await fetchPageBySlug(supabase, slug)
  } catch (e) {
    console.error('[slug] fetchPageBySlug error:', e)
    return null
  }
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return { title: 'Halaman tidak ditemukan' }

  const konten = (page.data_konten ?? {}) as Record<string, any>
  const title = konten.meta_title ?? page.nama_website
  const description = konten.meta_description ?? konten.deskripsi ?? konten.tagline ?? undefined
  const primary = (page.konfigurasi as any)?.branding?.primary as string | undefined
  return {
    title,
    description,
    icons: { icon: tenantFaviconDataUri(page.nama_website, primary) },
  }
}

export default async function PublicSitePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  return renderSite({ page, slug, client: supabase })
}
