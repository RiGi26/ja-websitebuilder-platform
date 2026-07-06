import type { ReactNode, CSSProperties } from 'react'
import type { BlogPost } from '@/types/websitebuilder'
import { formatTanggalID, readingMinutes, kontenBlocks } from './blog-ui'
import { sora, notoJp } from './fonts'

// ============================================================
// Skin blog 'ja-panel' — bahasa visual Japan Arena (mockup A "Majalah"):
// navy #0b2647 + panel putih radius 16 + tag pill warna + featured gradient
// ala wod-card + hiasan kanji. Dipilih via konfigurasi.blog.skin='ja-panel';
// tenant lain tetap skin 'slate' (blog-ui) — nol regresi.
// Semua server component, tanpa JS client.
// ============================================================

const NAVY = '#0b2647'
const INK = '#0c1b33'
const MUTED = '#5b6c87'
const LINE = '#e3e9f3'
const SKY = '#eaf2ff'
const BG = '#f5f7fb'

// Warna tag pill per kategori — palet ala level JLPT (stabil per nama).
const TAG_COLORS: Array<{ bg: string; fg: string }> = [
  { bg: '#eaf2ff', fg: '#3b82f6' }, // biru
  { bg: '#f4eaff', fg: '#a855f7' }, // ungu
  { bg: '#e8fbf2', fg: '#1fb674' }, // hijau
  { bg: '#fff2e6', fg: '#ff8a3c' }, // oranye
  { bg: '#feeaea', fg: '#ef4444' }, // merah
]
function tagColor(kategori: string): { bg: string; fg: string } {
  let h = 0
  for (const c of kategori) h = (h * 31 + c.charCodeAt(0)) % 997
  return TAG_COLORS[h % TAG_COLORS.length]
}

function Tag({ kategori }: { kategori: string }) {
  const c = tagColor(kategori)
  return (
    <span className="inline-block self-start rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: c.bg, color: c.fg }}>
      {kategori}
    </span>
  )
}

function metaLine(post: BlogPost): string {
  return [formatTanggalID(post.published_at), `${readingMinutes(post.konten)} menit baca`].filter(Boolean).join(' · ')
}

// ── Kerangka halaman: topbar JA + konten + footer ────────────
export function JaShell({
  nama,
  base,
  accent,
  children,
}: {
  nama: string
  base: string
  accent: string
  children: ReactNode
}) {
  return (
    <div
      className={`${sora.variable} ${notoJp.variable} min-h-screen`}
      style={{
        '--ja-accent': accent, background: BG, color: INK,
        fontFamily: `var(--font-sora), 'Avenir Next', system-ui, sans-serif`,
      } as CSSProperties}
    >
      <header className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ borderColor: LINE, background: 'rgba(245,247,251,.88)' }}>
        <div className="mx-auto flex h-16 max-w-[1150px] items-center justify-between gap-3 px-5">
          <a href={`${base}/blog`} className="flex min-w-0 items-center gap-2.5">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-[13px] font-extrabold text-white shadow-[0_6px_14px_-4px_rgba(21,97,216,.5)]"
              style={{ background: `linear-gradient(145deg, #3b82f6, ${NAVY})` }}
              aria-hidden
            >
              {(nama.trim().match(/[A-Za-z0-9]/)?.[0] ?? 'B').toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[17px] font-extrabold" style={{ color: NAVY }}>{nama}</span>
              <span className="block text-[10px] font-semibold tracking-wide" style={{ color: MUTED }}>Blog</span>
            </span>
          </a>
          <a
            href={base || '/'}
            className="shrink-0 rounded-full px-4 py-2.5 text-[12px] font-bold transition-colors"
            style={{ background: SKY, color: 'var(--ja-accent)' }}
          >
            Beranda →
          </a>
        </div>
      </header>

      {children}

      <footer className="border-t py-6 text-center text-[12px]" style={{ borderColor: LINE, color: MUTED }}>
        © {new Date().getFullYear()} {nama}. Powered by <b style={{ color: NAVY }}>Webzoka.com</b>
      </footer>
    </div>
  )
}

// ── Featured ala wod-card (artikel terbaru) ──────────────────
export function JaFeatured({ post, hrefBase, kanji }: { post: BlogPost; hrefBase: string; kanji: string }) {
  const inner = (
    <article
      className="flex flex-wrap items-center gap-6 rounded-2xl p-7 text-white transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_18px_36px_-18px_rgba(11,38,71,.55)]"
      style={{ background: `linear-gradient(135deg, ${NAVY}, #163f78)` }}
    >
      {kanji && (
        <div className="shrink-0 text-[clamp(2.4rem,6vw,3.8rem)] font-bold leading-none" style={{ fontFamily: 'var(--font-noto-jp), sans-serif' }} aria-hidden>
          {kanji}
        </div>
      )}
      <div className="min-w-[240px] flex-1">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[.06em]" style={{ color: '#9ec4ff' }}>Artikel Unggulan</div>
        <h2 className="text-[clamp(1.25rem,2.6vw,1.65rem)] font-extrabold leading-snug [text-wrap:balance]">{post.judul}</h2>
        {post.ringkasan && <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed" style={{ color: '#c4d6f3' }}>{post.ringkasan}</p>}
        <div className="mt-3 text-[12px] [font-variant-numeric:tabular-nums]" style={{ color: '#bcd2f0' }}>
          {[post.penulis, metaLine(post)].filter(Boolean).join(' · ')}
        </div>
      </div>
      <span className="rounded-full px-5 py-2.5 text-[13px] font-bold" style={{ background: 'rgba(255,255,255,.14)' }}>Baca →</span>
    </article>
  )
  return post.slug ? <a href={`${hrefBase}/${post.slug}`} className="group block">{inner}</a> : inner
}

// ── Kartu artikel ala article-card ───────────────────────────
export function JaCard({ post, hrefBase }: { post: BlogPost; hrefBase: string }) {
  const inner = (
    <article
      className="flex h-full flex-col gap-2 rounded-[14px] border bg-white p-[18px] transition-all duration-200 group-hover:-translate-y-[3px] group-hover:border-[#3b82f6] group-hover:shadow-[0_10px_24px_-14px_rgba(11,38,71,.2)]"
      style={{ borderColor: LINE }}
    >
      {post.kategori && <Tag kategori={post.kategori} />}
      <h4 className="text-[16px] font-extrabold leading-snug [text-wrap:balance]" style={{ color: NAVY }}>{post.judul}</h4>
      {post.ringkasan && <p className="line-clamp-3 text-[13px] leading-relaxed" style={{ color: MUTED }}>{post.ringkasan}</p>}
      <div className="mt-auto pt-2 text-[11px] [font-variant-numeric:tabular-nums]" style={{ color: MUTED }}>{metaLine(post)}</div>
    </article>
  )
  return post.slug ? <a href={`${hrefBase}/${post.slug}`} className="group block h-full">{inner}</a> : <div className="h-full">{inner}</div>
}

// ── Panel putih ala .panel + eyebrow ─────────────────────────
export function JaPanel({ eyebrow, title, children }: { eyebrow: string; title?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-6" style={{ borderColor: LINE }}>
      <div className="mb-3">
        <div className="text-[11px] font-bold uppercase tracking-[.05em]" style={{ color: 'var(--ja-accent)' }}>{eyebrow}</div>
        {title && <h3 className="mt-1 text-[19px] font-extrabold" style={{ color: NAVY }}>{title}</h3>}
      </div>
      {children}
    </section>
  )
}

// ── Daftar "Paling Dibaca" (artikel pinned, bernomor) ────────
export function JaPopular({ posts, hrefBase }: { posts: BlogPost[]; hrefBase: string }) {
  if (posts.length === 0) return null
  return (
    <JaPanel eyebrow="Paling Dibaca" title="Pilihan Redaksi">
      <div>
        {posts.map((p, i) => (
          <div key={p.id} className="flex items-start gap-3 border-b border-dashed py-2.5 last:border-b-0" style={{ borderColor: LINE }}>
            <span className="w-6 shrink-0 text-[12px] font-bold [font-variant-numeric:tabular-nums]" style={{ color: '#3b82f6' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {p.slug ? (
              <a href={`${hrefBase}/${p.slug}`} className="text-[14px] font-semibold leading-snug transition-colors hover:text-[var(--ja-accent)]" style={{ color: INK }}>{p.judul}</a>
            ) : (
              <span className="text-[14px] font-semibold leading-snug" style={{ color: INK }}>{p.judul}</span>
            )}
          </div>
        ))}
      </div>
    </JaPanel>
  )
}

// ── Chips filter kategori ────────────────────────────────────
export function JaChips({ kategoris, active, hrefBase }: { kategoris: string[]; active: string | null; hrefBase: string }) {
  if (kategoris.length === 0) return null
  const chip = (label: string, href: string, on: boolean) => (
    <a
      key={label}
      href={href}
      className="inline-flex min-h-[42px] items-center rounded-full border px-4 text-[13px] font-bold transition-colors"
      style={on
        ? { background: 'var(--ja-accent)', borderColor: 'var(--ja-accent)', color: '#fff' }
        : { borderColor: LINE, background: '#fff', color: MUTED }}
    >
      {label}
    </a>
  )
  return (
    <nav aria-label="Filter kategori" className="flex flex-wrap gap-2">
      {chip('Semua', hrefBase, active === null)}
      {kategoris.map((k) => chip(k, `${hrefBase}?kategori=${encodeURIComponent(k)}`, active === k))}
    </nav>
  )
}

// ── Pagination ───────────────────────────────────────────────
export function JaPagination({ page, totalPages, hrefBase, kategori }: { page: number; totalPages: number; hrefBase: string; kategori: string | null }) {
  if (totalPages <= 1) return null
  const href = (p: number) => {
    const q = new URLSearchParams()
    if (kategori) q.set('kategori', kategori)
    if (p > 1) q.set('page', String(p))
    const qs = q.toString()
    return qs ? `${hrefBase}?${qs}` : hrefBase
  }
  const cls = 'inline-flex min-h-[42px] items-center rounded-full border bg-white px-5 text-[13px] font-bold transition-colors hover:border-[#3b82f6]'
  return (
    <nav aria-label="Navigasi halaman" className="flex items-center justify-center gap-3">
      {page > 1 ? <a className={cls} style={{ borderColor: LINE, color: MUTED }} href={href(page - 1)}>← Sebelumnya</a> : <span aria-hidden />}
      <span className="text-[12px] [font-variant-numeric:tabular-nums]" style={{ color: MUTED }}>Hal {page} / {totalPages}</span>
      {page < totalPages ? <a className={cls} style={{ borderColor: LINE, color: MUTED }} href={href(page + 1)}>Berikutnya →</a> : <span aria-hidden />}
    </nav>
  )
}

// ── Band CTA gradient navy (slot-driven; fallback WA) ────────
export function JaCtaBand({
  nama,
  ctaTitle,
  ctaSubtitle,
  ctaLabel,
  ctaHref,
}: {
  nama: string
  ctaTitle: string
  ctaSubtitle: string
  ctaLabel: string
  ctaHref: string | null
}) {
  if (!ctaHref) return null
  return (
    <section className="rounded-2xl p-7 text-white" style={{ background: `linear-gradient(135deg, ${NAVY}, #1f5fa8)` }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-[240px] flex-1">
          <h3 className="text-[19px] font-extrabold [text-wrap:balance]">{ctaTitle || `Ada pertanyaan untuk ${nama}?`}</h3>
          <p className="mt-1.5 text-[13px]" style={{ color: '#bcd2f0' }}>{ctaSubtitle || 'Hubungi kami — dibalas langsung oleh tim kami.'}</p>
        </div>
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[46px] items-center rounded-full bg-white px-7 text-[14px] font-bold transition-transform hover:-translate-y-0.5"
          style={{ color: NAVY }}
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  )
}

// ── Hero halaman baca ala read-hero (navy + kanji watermark) ─
export function JaReadHero({ post, hrefBase, kanji }: { post: BlogPost; hrefBase: string; kanji: string }) {
  return (
    <header className="relative overflow-hidden rounded-2xl p-8 text-white md:p-9" style={{ background: `linear-gradient(135deg, ${NAVY}, #163f78)` }}>
      {kanji && (
        <span className="pointer-events-none absolute -bottom-5 right-3 text-[7rem] font-bold opacity-[.08]" style={{ fontFamily: 'var(--font-noto-jp), sans-serif' }} aria-hidden>
          {kanji}
        </span>
      )}
      <nav aria-label="Breadcrumb" className="mb-3 text-[12px] [font-variant-numeric:tabular-nums]" style={{ color: '#9ec4ff' }}>
        <a href={hrefBase} className="hover:text-white">Blog</a>
        {post.kategori && <span> / {post.kategori}</span>}
      </nav>
      {post.kategori && (
        <span className="inline-block rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: 'rgba(255,255,255,.14)', color: '#9ec4ff' }}>
          {post.kategori}
        </span>
      )}
      <h1 className="mt-3 max-w-[24ch] text-[clamp(1.5rem,3.4vw,2.1rem)] font-extrabold leading-tight [text-wrap:balance]">{post.judul}</h1>
      {post.ringkasan && <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed" style={{ color: '#c4d6f3' }}>{post.ringkasan}</p>}
      <div className="mt-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full text-[13px] font-bold" style={{ background: 'var(--ja-accent)' }} aria-hidden>
          {(post.penulis ?? 'A').trim().slice(0, 1).toUpperCase()}
        </span>
        <div>
          {post.penulis && <b className="block text-[14px]">{post.penulis}</b>}
          <span className="text-[12px] [font-variant-numeric:tabular-nums]" style={{ color: '#bcd2f0' }}>{metaLine(post)}</span>
        </div>
      </div>
    </header>
  )
}

// ── Prose ala panel (paragraf + callout sky) ─────────────────
export function JaProse({ konten }: { konten: string | null }) {
  const blocks = kontenBlocks(konten)
  if (blocks.length === 0) return <p className="italic" style={{ color: MUTED }}>Artikel ini belum memiliki isi.</p>
  return (
    <div className="space-y-5 text-[16px] leading-[1.8]" style={{ color: '#243350' }}>
      {blocks.map((b, i) =>
        b.type === 'callout' ? (
          <div key={i} className="rounded-xl px-5 py-4 text-[14px] leading-relaxed" style={{ background: SKY, color: INK }}>
            {b.lines.map((line, j) => (
              <span key={j}>{j > 0 && <br />}{line}</span>
            ))}
          </div>
        ) : (
          <p key={i}>
            {b.lines.map((line, j) => (
              <span key={j}>{j > 0 && <br />}{line}</span>
            ))}
          </p>
        ),
      )}
    </div>
  )
}

// ── "Baca Juga" mini (sidebar halaman baca) ──────────────────
export function JaRelated({ posts, hrefBase }: { posts: BlogPost[]; hrefBase: string }) {
  if (posts.length === 0) return null
  return (
    <JaPanel eyebrow="Baca Juga">
      <div className="flex flex-col gap-2.5">
        {posts.map((p) => (
          <a
            key={p.id}
            href={p.slug ? `${hrefBase}/${p.slug}` : hrefBase}
            className="block rounded-xl border px-3.5 py-3 transition-colors hover:border-[#3b82f6]"
            style={{ borderColor: LINE }}
          >
            <div className="text-[13px] font-bold leading-snug" style={{ color: NAVY }}>{p.judul}</div>
            <div className="mt-1 text-[11px] [font-variant-numeric:tabular-nums]" style={{ color: MUTED }}>
              {[p.kategori, `${readingMinutes(p.konten)} menit`].filter(Boolean).join(' · ')}
            </div>
          </a>
        ))}
      </div>
    </JaPanel>
  )
}
