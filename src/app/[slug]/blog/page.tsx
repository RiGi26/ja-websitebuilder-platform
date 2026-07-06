import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fetchPageBySlug } from '@/lib/supabase/websitebuilder'
import { fetchPublishedBlogPostsPaged, fetchBlogKategoris, fetchTenantProfile } from '@/lib/supabase/addons'
import { tenantFaviconDataUri } from '@/lib/tenant-favicon'
import { tenantBasePath } from '@/lib/tenant-path'
import { waLink } from '@/lib/wa'
import type { KonfigurasiWebsite, LandingPageWithSections } from '@/types/websitebuilder'
import { BlogShell, PostCard, FeaturedCard, KategoriChips, BlogPagination, CtaBand, blogAccent } from './blog-ui'

// ============================================================
// /{slug}/blog — index/arsip artikel publik tenant.
// Di subdomain otomatis {slug}.webzoka.com/blog (rewrite proxy Mode 1).
// Featured (terbaru) hanya di hlm 1 tanpa filter; chips kategori + pagination
// via querystring (server-rendered, nol JS client).
// ============================================================

export const dynamic = 'force-dynamic'

const PER_PAGE = 9

const getPage = cache(async (slug: string): Promise<LandingPageWithSections | null> => {
  try {
    return await fetchPageBySlug(supabase, slug)
  } catch (e) {
    console.error('[slug]/blog fetchPageBySlug error:', e)
    return null
  }
})

// Gate: industri blog ATAU add-on blog aktif. Selainnya → 404.
function blogEnabled(page: LandingPageWithSections): boolean {
  const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
  return page.tipe_industri === 'blog' || !!konfig.features?.hasBlog
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page || !blogEnabled(page)) return { title: 'Halaman tidak ditemukan' }
  const konten = (page.data_konten ?? {}) as Record<string, unknown>
  const primary = (page.konfigurasi as KonfigurasiWebsite | null)?.branding?.primary
  const description = typeof konten.deskripsi === 'string' ? konten.deskripsi : undefined
  return {
    title: `Blog · ${page.nama_website}`,
    description,
    icons: { icon: tenantFaviconDataUri(page.nama_website, primary) },
  }
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page || !blogEnabled(page)) notFound()

  const sp = await searchParams
  const kategori = typeof sp.kategori === 'string' && sp.kategori.trim() ? sp.kategori.trim() : null
  const pageNum = Math.max(1, Number.parseInt(typeof sp.page === 'string' ? sp.page : '1', 10) || 1)

  const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
  const accent = blogAccent(konfig.branding?.primary)

  const [{ posts, total }, kategoris, profile, base] = await Promise.all([
    fetchPublishedBlogPostsPaged(supabase, page.id, { page: pageNum, perPage: PER_PAGE, kategori }),
    fetchBlogKategoris(supabase, page.id),
    fetchTenantProfile(supabase, page.id),
    tenantBasePath(slug),
  ])
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  // Halaman melewati rentang → 404. Berbasis hasil (bukan hanya total):
  // range PostgREST di luar rentang balas 416 → helper mengembalikan
  // {posts:[], total:0}, sehingga cek total saja lolos keliru.
  if (pageNum > 1 && posts.length === 0) notFound()

  const hrefBase = `${base}/blog`
  const waRaw = profile?.wa ?? (page.data_konten as Record<string, unknown> | null)?.wa
  const waHref0 = waLink(typeof waRaw === 'string' ? waRaw : null)
  const waHref = waHref0 !== '#' ? waHref0 : null

  // Featured = artikel terbaru, hanya di halaman 1 tanpa filter kategori.
  const showFeatured = pageNum === 1 && !kategori && posts.length > 0
  const featured = showFeatured ? posts[0] : null
  const gridPosts = showFeatured ? posts.slice(1) : posts

  return (
    <BlogShell nama={page.nama_website} base={base} accent={accent} waHref={waHref}>
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-5 pb-16 pt-10">
        <header>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[.12em]" style={{ color: accent }}>
            Blog {page.nama_website}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight [text-wrap:balance] md:text-4xl">Artikel Terbaru</h1>
        </header>

        {featured && <FeaturedCard post={featured} hrefBase={hrefBase} accent={accent} />}

        <KategoriChips kategoris={kategoris} active={kategori} hrefBase={hrefBase} accent={accent} />

        {gridPosts.length === 0 && !featured ? (
          <p className="py-12 text-center text-sm italic text-[#59647A]">
            {kategori ? `Belum ada artikel di kategori “${kategori}”.` : 'Belum ada artikel.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((p) => (
              <PostCard key={p.id} post={p} hrefBase={hrefBase} accent={accent} />
            ))}
          </div>
        )}

        <BlogPagination page={pageNum} totalPages={totalPages} hrefBase={hrefBase} kategori={kategori} />

        <CtaBand nama={page.nama_website} waHref={waHref} accent={accent} />
      </main>
    </BlogShell>
  )
}
