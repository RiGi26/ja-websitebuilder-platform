import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fetchPageBySlug } from '@/lib/supabase/websitebuilder'
import { SectionRenderer } from '@/app/components/sections/SectionRenderer'
import type { KonfigurasiWebsite, LandingPageWithSections } from '@/types/websitebuilder'

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

  const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
  const primary = konfig.branding?.primary
  const sections = [...(page.page_sections ?? [])].sort((a, b) => a.urutan - b.urutan)

  return (
    <main className="min-h-screen bg-white">
      {/* aksen branding tipis (theming dasar) */}
      {primary && <div style={{ height: 4, backgroundColor: primary }} />}

      {sections.length === 0 ? (
        <div className="px-6 py-32 text-center text-gray-400">
          <h1 className="text-2xl font-bold text-gray-700">{page.nama_website}</h1>
          <p className="mt-2 text-sm">Halaman ini belum memiliki konten.</p>
        </div>
      ) : (
        sections.map((s) => <SectionRenderer key={s.id} section={s} />)
      )}
    </main>
  )
}
