import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fetchPageBySlug } from '@/lib/supabase/websitebuilder'
import { fetchBlogPostBySlug, fetchBlogPostsByPage, fetchTenantProfile } from '@/lib/supabase/addons'
import { tenantFaviconDataUri } from '@/lib/tenant-favicon'
import { tenantBasePath } from '@/lib/tenant-path'
import { waLink } from '@/lib/wa'
import type { KonfigurasiWebsite, LandingPageWithSections } from '@/types/websitebuilder'
import {
  BlogShell, PostCard, ArticleProse, CtaBand, blogAccent, formatTanggalID, readingMinutes,
} from '../blog-ui'

// ============================================================
// /{slug}/blog/{postSlug} — halaman baca artikel (gap #1 blog engine:
// blog_posts.konten akhirnya dirender). Kolom baca sempit, badan serif,
// related + CTA WA. Draft/slug asing → 404 (fetch filter is_published).
// ============================================================

export const dynamic = 'force-dynamic'

const getPage = cache(async (slug: string): Promise<LandingPageWithSections | null> => {
  try {
    return await fetchPageBySlug(supabase, slug)
  } catch (e) {
    console.error('[slug]/blog/[postSlug] fetchPageBySlug error:', e)
    return null
  }
})

const getPost = cache(async (pageId: string, postSlug: string) =>
  fetchBlogPostBySlug(supabase, pageId, postSlug).catch(() => null))

function blogEnabled(page: LandingPageWithSections): boolean {
  const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
  return page.tipe_industri === 'blog' || !!konfig.features?.hasBlog
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; postSlug: string }>
}): Promise<Metadata> {
  const { slug, postSlug } = await params
  const page = await getPage(slug)
  if (!page || !blogEnabled(page)) return { title: 'Halaman tidak ditemukan' }
  const post = await getPost(page.id, postSlug)
  if (!post) return { title: 'Artikel tidak ditemukan' }

  const primary = (page.konfigurasi as KonfigurasiWebsite | null)?.branding?.primary
  const description = post.ringkasan ?? (post.konten ? post.konten.slice(0, 160) : undefined)
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'webzoka.com'
  return {
    title: `${post.judul} · ${page.nama_website}`,
    description,
    icons: { icon: tenantFaviconDataUri(page.nama_website, primary) },
    // Canonical ke bentuk subdomain → hindari duplikat konten
    // subdomain vs path-form di mata mesin pencari.
    alternates: { canonical: `https://${slug}.${root}/blog/${postSlug}` },
    openGraph: {
      type: 'article',
      title: post.judul,
      description,
      publishedTime: post.published_at ?? undefined,
      authors: post.penulis ? [post.penulis] : undefined,
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string; postSlug: string }>
}) {
  const { slug, postSlug } = await params
  const page = await getPage(slug)
  if (!page || !blogEnabled(page)) notFound()
  const post = await getPost(page.id, postSlug)
  if (!post) notFound()

  const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
  const accent = blogAccent(konfig.branding?.primary)

  const [allPosts, profile, base] = await Promise.all([
    fetchBlogPostsByPage(supabase, page.id),
    fetchTenantProfile(supabase, page.id),
    tenantBasePath(slug),
  ])
  const hrefBase = `${base}/blog`

  // Related: kategori sama dulu, lalu terbaru lain — tanpa artikel ini, maks 3.
  const others = allPosts.filter((p) => p.id !== post.id)
  const related = [
    ...others.filter((p) => post.kategori && p.kategori === post.kategori),
    ...others.filter((p) => !post.kategori || p.kategori !== post.kategori),
  ].slice(0, 3)

  const waRaw = profile?.wa ?? (page.data_konten as Record<string, unknown> | null)?.wa
  const waHref0 = waLink(typeof waRaw === 'string' ? waRaw : null)
  const waHref = waHref0 !== '#' ? waHref0 : null

  const tgl = formatTanggalID(post.published_at)

  return (
    <BlogShell nama={page.nama_website} base={base} accent={accent} waHref={waHref}>
      <main className="mx-auto max-w-5xl px-5 pb-16 pt-10">
        <article className="mx-auto max-w-[720px]">
          <nav aria-label="Breadcrumb" className="font-mono text-[12px] text-[#59647A]">
            <a href={hrefBase} className="transition-colors hover:text-[var(--blog-accent)]">Blog</a>
            {post.kategori && <span> / {post.kategori}</span>}
          </nav>

          <header className="mt-5">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-[12px] text-[#59647A] [font-variant-numeric:tabular-nums]">
              {post.kategori && (
                <span
                  className="rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: accent, backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)` }}
                >
                  {post.kategori}
                </span>
              )}
              {tgl && <span>{tgl}</span>}
              <span aria-hidden>·</span>
              <span>{readingMinutes(post.konten)} menit baca</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight [text-wrap:balance] md:text-4xl">
              {post.judul}
            </h1>
            {post.ringkasan && (
              <p className="mt-4 text-lg leading-relaxed text-[#59647A]">{post.ringkasan}</p>
            )}
            {post.penulis && (
              <div className="mt-6 flex items-center gap-3 border-b border-[#E4E9F2] pb-6">
                <span className="grid h-10 w-10 place-items-center rounded-full text-[13px] font-bold text-white" style={{ backgroundColor: accent }} aria-hidden>
                  {post.penulis.trim().slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <div className="text-sm font-bold">{post.penulis}</div>
                  <div className="text-[12px] text-[#59647A]">{page.nama_website}</div>
                </div>
              </div>
            )}
          </header>

          {post.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_url}
              alt={post.judul}
              className="mt-7 aspect-[16/9] w-full rounded-2xl object-cover shadow-[0_2px_4px_rgba(16,26,44,.05),0_30px_60px_-30px_rgba(16,26,44,.34)]"
            />
          )}

          <div className="mt-8">
            <ArticleProse konten={post.konten} />
          </div>
        </article>

        {related.length > 0 && (
          <section className="mx-auto mt-14 max-w-4xl">
            <div className="mb-5 flex items-baseline justify-between gap-3">
              <h2 className="text-xl font-extrabold tracking-tight">Baca juga</h2>
              <a
                href={hrefBase}
                className="rounded-full border border-[#E4E9F2] bg-white px-4 py-2 text-[12px] font-bold text-[#28344A] transition-colors hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)]"
              >
                Semua artikel →
              </a>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.id} post={p} hrefBase={hrefBase} accent={accent} />
              ))}
            </div>
          </section>
        )}

        <div className="mx-auto mt-14 max-w-4xl">
          <CtaBand nama={page.nama_website} waHref={waHref} accent={accent} />
        </div>
      </main>
    </BlogShell>
  )
}
