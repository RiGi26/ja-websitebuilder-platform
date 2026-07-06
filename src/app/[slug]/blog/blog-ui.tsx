import type { ReactNode, CSSProperties } from 'react'
import type { BlogPost } from '@/types/websitebuilder'

// ============================================================
// UI bersama blog publik tenant (/{slug}/blog + /{slug}/blog/{postSlug}).
// SATU layout baca universal lintas-tema (sub-route engine-agnostic, pola
// booking/sewa/po): aksen dari branding.primary, netral slate, serif Fraunces
// untuk badan artikel. Desain = mockup wb-blog-v2-sop (lolos gerbang
// /ui-design + /make-interfaces-feel-better + /website-review).
// Semua server component — index & detail tanpa JS client.
// ============================================================

export const BLOG_ACCENT_FALLBACK = '#1A56DB'
const SERIF = "var(--font-fraunces, Georgia, 'Times New Roman', serif)"

export function blogAccent(primaryRaw?: string | null): string {
  if (primaryRaw && /^#?[0-9a-fA-F]{6}$/.test(primaryRaw)) {
    return primaryRaw.startsWith('#') ? primaryRaw : `#${primaryRaw}`
  }
  return BLOG_ACCENT_FALLBACK
}

export function formatTanggalID(iso?: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Estimasi menit baca (±200 kata/menit), minimal 1.
export function readingMinutes(konten?: string | null): number {
  const words = (konten ?? '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

// konten plain text → blok paragraf. `\n\n` = paragraf baru, `\n` tunggal =
// line break. TANPA HTML mentah/markdown (konten ditulis tenant → anti-XSS);
// React meng-escape teks secara default.
export function kontenBlocks(konten?: string | null): string[][] {
  return (konten ?? '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((b) => b.length > 0)
}

// ── Kerangka halaman: topbar nama bisnis + konten + WA FAB ────
export function BlogShell({
  nama,
  base,
  accent,
  waHref,
  children,
}: {
  nama: string
  base: string
  accent: string
  waHref: string | null
  children: ReactNode
}) {
  return (
    <div
      className="min-h-screen bg-[#F7F9FC] text-[#0F1826]"
      style={{ '--blog-accent': accent, fontFamily: "var(--font-jakarta, system-ui, sans-serif)" } as CSSProperties}
    >
      <header className="sticky top-0 z-40 border-b border-[#E4E9F2] bg-[#F7F9FC]/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <a href={base || '/'} className="flex min-w-0 items-center gap-2.5 font-bold text-[15px] tracking-tight">
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[12px] font-extrabold text-white"
              style={{ backgroundColor: accent }}
              aria-hidden
            >
              {(nama.trim().match(/[A-Za-z0-9]/)?.[0] ?? 'W').toUpperCase()}
            </span>
            <span className="truncate">{nama}</span>
            <span className="shrink-0 font-semibold text-[#59647A]">/ Blog</span>
          </a>
          <a
            href={base || '/'}
            className="shrink-0 rounded-full border border-[#E4E9F2] bg-white px-4 py-2 text-[12px] font-bold text-[#28344A] transition-colors hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)]"
          >
            ← Situs utama
          </a>
        </div>
      </header>

      {children}

      {waHref && (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hubungi kami di WhatsApp"
          className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] shadow-[0_6px_22px_-4px_rgba(37,211,102,.55)] transition-transform hover:scale-105"
        >
          <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white" aria-hidden>
            <path d="M16 3C9 3 3.5 8.5 3.5 15.5c0 2.4.7 4.6 1.8 6.5L3 29l7.2-2.3c1.8 1 3.9 1.5 6 1.5 7 0 12.5-5.5 12.5-12.5S23 3 16 3zm0 22.8c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.3 1.4 1.4-4.2-.3-.4a10 10 0 0 1-1.6-5.4C5.7 9.8 10.3 5.3 16 5.3s10.3 4.5 10.3 10.2S21.7 25.8 16 25.8zm5.6-7.6c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6 3 .1 3 .8 3.6.7.5 0 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4z" />
          </svg>
        </a>
      )}
    </div>
  )
}

// ── Kartu artikel (grid & related) ───────────────────────────
export function PostCard({ post, hrefBase, accent }: { post: BlogPost; hrefBase: string; accent: string }) {
  const tgl = formatTanggalID(post.published_at)
  const inner = (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E4E9F2] bg-white shadow-[0_1px_2px_rgba(16,26,44,.04),0_12px_28px_-18px_rgba(16,26,44,.28)] transition-all duration-200 group-hover:-translate-y-1 group-hover:border-[color-mix(in_srgb,var(--blog-accent)_40%,#E4E9F2)] group-hover:shadow-[0_2px_4px_rgba(16,26,44,.05),0_30px_60px_-30px_rgba(16,26,44,.34)]">
      <div className="aspect-[16/9] w-full bg-[#EEF2F9]" style={!post.cover_url ? { background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 45%, #ffffff))` } : undefined}>
        {post.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_url} alt={post.judul} loading="lazy" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {post.kategori && (
          <span
            className="self-start rounded-md px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: accent, backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)` }}
          >
            {post.kategori}
          </span>
        )}
        <h3 className="text-[17px] font-bold leading-snug tracking-tight [text-wrap:balance]">{post.judul}</h3>
        {post.ringkasan && <p className="line-clamp-3 text-sm leading-relaxed text-[#59647A]">{post.ringkasan}</p>}
        <div className="mt-auto flex items-center gap-2 pt-1.5 font-mono text-[11px] text-[#59647A] [font-variant-numeric:tabular-nums]">
          {tgl && <span>{tgl}</span>}
          {tgl && <span className="h-[3px] w-[3px] rounded-full bg-current opacity-50" aria-hidden />}
          <span>{readingMinutes(post.konten)} menit baca</span>
        </div>
      </div>
    </article>
  )
  return post.slug ? (
    <a href={`${hrefBase}/${post.slug}`} className="group block h-full">{inner}</a>
  ) : (
    <div className="h-full">{inner}</div>
  )
}

// ── Featured (artikel terbaru, hanya hlm 1 tanpa filter) ─────
export function FeaturedCard({ post, hrefBase, accent }: { post: BlogPost; hrefBase: string; accent: string }) {
  const tgl = formatTanggalID(post.published_at)
  const inner = (
    <article className="grid overflow-hidden rounded-3xl border border-[#E4E9F2] bg-white shadow-[0_2px_4px_rgba(16,26,44,.05),0_30px_60px_-30px_rgba(16,26,44,.34)] transition-transform duration-200 group-hover:-translate-y-1 md:grid-cols-2">
      <div className="relative min-h-[220px] md:min-h-[320px]" style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 78%, #05122E), ${accent} 55%, color-mix(in srgb, ${accent} 45%, #ffffff))` }}>
        {post.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_url} alt={post.judul} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <span className="absolute left-4 top-4 rounded-md bg-white/95 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0F1826]">
          Unggulan
        </span>
      </div>
      <div className="flex flex-col gap-3 p-7 md:p-9">
        {post.kategori && (
          <span
            className="self-start rounded-md px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: accent, backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)` }}
          >
            {post.kategori}
          </span>
        )}
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight [text-wrap:balance] md:text-3xl">{post.judul}</h2>
        {post.ringkasan && <p className="leading-relaxed text-[#59647A]">{post.ringkasan}</p>}
        <div className="mt-auto flex items-center gap-3 pt-4">
          {post.penulis && (
            <>
              <span className="grid h-9 w-9 place-items-center rounded-full text-[12px] font-bold text-white" style={{ backgroundColor: accent }} aria-hidden>
                {post.penulis.trim().slice(0, 1).toUpperCase()}
              </span>
              <div className="text-sm">
                <div className="font-bold">{post.penulis}</div>
                <div className="font-mono text-[11px] text-[#59647A] [font-variant-numeric:tabular-nums]">
                  {[tgl, `${readingMinutes(post.konten)} menit baca`].filter(Boolean).join(' · ')}
                </div>
              </div>
            </>
          )}
          {!post.penulis && (
            <div className="font-mono text-[11px] text-[#59647A] [font-variant-numeric:tabular-nums]">
              {[tgl, `${readingMinutes(post.konten)} menit baca`].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>
      </div>
    </article>
  )
  return post.slug ? (
    <a href={`${hrefBase}/${post.slug}`} className="group block">{inner}</a>
  ) : (
    inner
  )
}

// ── Chips filter kategori (link server-side, tanpa JS) ───────
export function KategoriChips({
  kategoris,
  active,
  hrefBase,
  accent,
}: {
  kategoris: string[]
  active: string | null
  hrefBase: string
  accent: string
}) {
  if (kategoris.length === 0) return null
  const chip = (label: string, href: string, on: boolean) => (
    <a
      key={label}
      href={href}
      className="inline-flex min-h-[44px] items-center rounded-full border px-4 text-[13px] font-semibold transition-colors"
      style={on
        ? { backgroundColor: accent, borderColor: accent, color: '#fff' }
        : { borderColor: '#E4E9F2', backgroundColor: '#fff', color: '#28344A' }}
    >
      {label}
    </a>
  )
  return (
    <nav aria-label="Filter kategori" className="flex flex-wrap items-center gap-2.5">
      {chip('Semua', hrefBase, active === null)}
      {kategoris.map((k) => chip(k, `${hrefBase}?kategori=${encodeURIComponent(k)}`, active === k))}
    </nav>
  )
}

// ── Pagination prev/next ──────────────────────────────────────
export function BlogPagination({
  page,
  totalPages,
  hrefBase,
  kategori,
}: {
  page: number
  totalPages: number
  hrefBase: string
  kategori: string | null
}) {
  if (totalPages <= 1) return null
  const href = (p: number) => {
    const q = new URLSearchParams()
    if (kategori) q.set('kategori', kategori)
    if (p > 1) q.set('page', String(p))
    const qs = q.toString()
    return qs ? `${hrefBase}?${qs}` : hrefBase
  }
  const btn = 'inline-flex min-h-[44px] items-center rounded-full border border-[#E4E9F2] bg-white px-5 text-[13px] font-bold text-[#28344A] transition-colors hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)]'
  return (
    <nav aria-label="Navigasi halaman" className="flex items-center justify-center gap-3 pt-2">
      {page > 1 ? <a className={btn} href={href(page - 1)}>← Sebelumnya</a> : <span aria-hidden />}
      <span className="font-mono text-[12px] text-[#59647A] [font-variant-numeric:tabular-nums]">
        Hal {page} / {totalPages}
      </span>
      {page < totalPages ? <a className={btn} href={href(page + 1)}>Berikutnya →</a> : <span aria-hidden />}
    </nav>
  )
}

// ── Badan artikel: paragraf serif dari konten plain text ─────
export function ArticleProse({ konten }: { konten: string | null }) {
  const blocks = kontenBlocks(konten)
  if (blocks.length === 0) {
    return <p className="italic text-[#59647A]">Artikel ini belum memiliki isi.</p>
  }
  return (
    <div className="space-y-6 text-[17px] leading-[1.75] text-[#28344A] md:text-[18px]" style={{ fontFamily: SERIF }}>
      {blocks.map((lines, i) => (
        <p key={i}>
          {lines.map((line, j) => (
            <span key={j}>
              {j > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      ))}
    </div>
  )
}

// ── Band CTA WA di akhir halaman (skip bila tenant tanpa WA) ──
export function CtaBand({ nama, waHref, accent }: { nama: string; waHref: string | null; accent: string }) {
  if (!waHref) return null
  return (
    <section
      className="overflow-hidden rounded-3xl px-8 py-12 text-center text-white"
      style={{ background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 62%, #05122E))` }}
    >
      <h2 className="text-2xl font-extrabold tracking-tight [text-wrap:balance]">Ada pertanyaan untuk {nama}?</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-white/85">Hubungi kami lewat WhatsApp — dibalas langsung oleh tim kami.</p>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex min-h-[48px] items-center rounded-full bg-white px-8 text-[15px] font-bold transition-transform hover:-translate-y-0.5"
        style={{ color: accent }}
      >
        Chat WhatsApp
      </a>
    </section>
  )
}
