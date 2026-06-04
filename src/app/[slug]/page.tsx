import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fetchPageBySlug } from '@/lib/supabase/websitebuilder'
import { renderSite } from '@/app/components/SiteRenderer'
import type { LandingPageWithSections } from '@/types/websitebuilder'

// Halaman publik klien. Render dinamis (data dari Supabase), dibaca via
// anon client → RLS hanya mengizinkan status='published' + section visible.
export const dynamic = 'force-dynamic'

async function getPage(slug: string): Promise<LandingPageWithSections | null> {
  try {
    return await fetchPageBySlug(supabase, slug)
  } catch (e) {
    console.error('[slug] fetchPageBySlug error:', e)
    return null
  }
}

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
  return { title, description }
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
