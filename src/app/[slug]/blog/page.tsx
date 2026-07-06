import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fetchPageBySlug } from '@/lib/supabase/websitebuilder'
import {
  fetchPublishedBlogPostsPaged, fetchBlogKategoris, fetchPinnedBlogPosts, fetchTenantProfile,
} from '@/lib/supabase/addons'
import { tenantFaviconDataUri } from '@/lib/tenant-favicon'
import { tenantBasePath } from '@/lib/tenant-path'
import { waLink } from '@/lib/wa'
import type { KonfigurasiWebsite, LandingPageWithSections } from '@/types/websitebuilder'
import { BlogShell, PostCard, FeaturedCard, KategoriChips, BlogPagination, CtaBand, blogAccent } from './blog-ui'
import { resolveBlogCopy } from './blog.slots'
import { JaShell, JaFeatured, JaCard, JaChips, JaPagination, JaPopular, JaCtaBand } from './ja-panel'

// ============================================================
// /{slug}/blog — index/arsip artikel publik tenant.
// Dua skin (konfigurasi.blog.skin): 'slate' (default, netral) dan 'ja-panel'
// (panel-navy, mockup A klien Japan Arena). Copy chrome editable via slot
// theme_copy (blog.slots.ts) — fallback default = tampilan lama.
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
  const title = typeof konten.meta_title === 'string' && konten.meta_title.trim()
    ? konten.meta_title
    : `Blog · ${page.nama_website}`
  const description = typeof konten.meta_description === 'string' && konten.meta_description.trim()
    ? konten.meta_description
    : (typeof konten.deskripsi === 'string' ? konten.deskripsi : undefined)
  return {
    title,
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
  const skin = konfig.blog?.skin === 'ja-panel' ? 'ja-panel' : 'slate'
  const copy = resolveBlogCopy(page.data_konten as Record<string, unknown> | null)

  const [{ posts, total }, kategoris, pinned, profile, base] = await Promise.all([
    fetchPublishedBlogPostsPaged(supabase, page.id, { page: pageNum, perPage: PER_PAGE, kategori }),
    fetchBlogKategoris(supabase, page.id),
    fetchPinnedBlogPosts(supabase, page.id),
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
  // Link CTA: slot copy menang; kosong → fallback WA; dua-duanya kosong → band disembunyikan.
  const ctaHref = copy.ctaLink || waHref

  // Featured = artikel terbaru, hanya di halaman 1 tanpa filter kategori.
  const showFeatured = pageNum === 1 && !kategori && posts.length > 0
  const featured = showFeatured ? posts[0] : null
  const gridPosts = showFeatured ? posts.slice(1) : posts

  // ── Skin JA panel (mockup A) ────────────────────────────────
  if (skin === 'ja-panel') {
    return (
      <JaShell nama={page.nama_website} base={base} accent={accent}>
        <main className="mx-auto flex max-w-[1150px] flex-col gap-6 px-5 pb-16 pt-9">
          <header>
            <p className="text-[11px] font-bold uppercase tracking-[.05em]" style={{ color: accent }}>
              {copy.eyebrow} · {page.nama_website}
            </p>
            <h1 className="mt-1.5 text-[clamp(1.7rem,3.6vw,2.3rem)] font-extrabold [text-wrap:balance]" style={{ color: '#0b2647' }}>
              {copy.title}
            </h1>
            {copy.subtitle && <p className="mt-2 max-w-[56ch] text-[14px]" style={{ color: '#5b6c87' }}>{copy.subtitle}</p>}
          </header>

          {featured && <JaFeatured post={featured} hrefBase={hrefBase} kanji={copy.kanji} />}

          <JaChips kategoris={kategoris} active={kategori} hrefBase={hrefBase} />

          {gridPosts.length === 0 && !featured ? (
            <p className="py-12 text-center text-sm italic" style={{ color: '#5b6c87' }}>
              {kategori ? `Belum ada artikel di kategori “${kategori}”.` : 'Belum ada artikel.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((p) => (
                <JaCard key={p.id} post={p} hrefBase={hrefBase} />
              ))}
            </div>
          )}

          <JaPagination page={pageNum} totalPages={totalPages} hrefBase={hrefBase} kategori={kategori} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_1fr]">
            <JaPopular posts={pinned} hrefBase={hrefBase} />
            <JaCtaBand
              nama={page.nama_website}
              ctaTitle={copy.ctaTitle}
              ctaSubtitle={copy.ctaSubtitle}
              ctaLabel={copy.ctaLabel}
              ctaHref={ctaHref}
            />
          </div>
        </main>
      </JaShell>
    )
  }

  // ── Skin slate (default) ────────────────────────────────────
  return (
    <BlogShell nama={page.nama_website} base={base} accent={accent} waHref={waHref}>
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-5 pb-16 pt-10">
        <header>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[.12em]" style={{ color: accent }}>
            {copy.eyebrow} {page.nama_website}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight [text-wrap:balance] md:text-4xl">{copy.title}</h1>
          {copy.subtitle && <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-[#59647A]">{copy.subtitle}</p>}
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

        <CtaBand nama={page.nama_website} waHref={ctaHref} accent={accent} ctaTitle={copy.ctaTitle} ctaSubtitle={copy.ctaSubtitle} ctaLabel={copy.ctaLabel} />
      </main>
    </BlogShell>
  )
}
