import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fetchPageBySlug } from '@/lib/supabase/websitebuilder'
import { renderSite } from '@/app/components/SiteRenderer'
import EditBridge from '@/app/components/EditBridge'
import type { LandingPageWithSections } from '@/types/websitebuilder'
import { tenantFaviconDataUri } from '@/lib/tenant-favicon'

// Halaman publik klien. Render dinamis (data dari Supabase), dibaca via
// anon client → RLS hanya mengizinkan status='published' + section visible.
export const dynamic = 'force-dynamic'

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
  // SEO editan klien (panel "Konten Tema" portal, slot copy.seo_*) menang atas
  // meta_* studio; kosong/absen → fallback rantai lama (nol regresi).
  const themeCopy = (konten.theme_copy ?? {}) as Record<string, unknown>
  const seoTitle = typeof themeCopy['copy.seo_title'] === 'string' && (themeCopy['copy.seo_title'] as string).trim()
    ? (themeCopy['copy.seo_title'] as string).trim() : undefined
  const seoDesc = typeof themeCopy['copy.seo_description'] === 'string' && (themeCopy['copy.seo_description'] as string).trim()
    ? (themeCopy['copy.seo_description'] as string).trim() : undefined
  const title = seoTitle ?? konten.meta_title ?? page.nama_website
  const description = seoDesc ?? konten.meta_description ?? konten.deskripsi ?? konten.tagline ?? undefined
  const primary = (page.konfigurasi as any)?.branding?.primary as string | undefined
  return {
    title,
    description,
    icons: { icon: tenantFaviconDataUri(page.nama_website, primary) },
  }
}

export default async function PublicSitePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  // Click-to-edit (Wave 2): LivePreview portal memuat iframe dgn ?portalEdit=1
  // → suntik bridge (aktif hanya di dalam iframe; publik tanpa param = nol byte).
  const { portalEdit } = await searchParams
  const rendered = await renderSite({ page, slug, client: supabase })
  if (portalEdit !== '1') return rendered
  return (
    <>
      {rendered}
      <EditBridge />
    </>
  )
}
