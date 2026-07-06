import type { ThemeSlotManifest } from '@/lib/theme-system/slot-schema'

// ============================================================
// Manifest slot copy halaman blog publik (/{slug}/blog + halaman baca).
// Bukan tema bespoke — dipakai sebagai FALLBACK manifest di
// /api/portal/theme-copy dan kartu "Konten Tema" portal bila blog aktif
// (tipe_industri='blog' / features.hasBlog) dan tema page tak punya slot
// sendiri. Nilai tersimpan di data_konten.theme_copy (pipe 'copy'), absen →
// renderer fallback default di bawah (retrofit-safe utk tenant existing).
// ============================================================
export const BLOG_SLOT_MANIFEST: ThemeSlotManifest = {
  theme: '__blog',
  fields: [
    { key: 'copy.blog_eyebrow', type: 'text', label: 'Label kecil di atas judul', group: 'Halaman Blog', max: 60, default: 'Blog' },
    { key: 'copy.blog_title', type: 'text', label: 'Judul halaman blog', group: 'Halaman Blog', max: 90, default: 'Artikel Terbaru' },
    { key: 'copy.blog_subtitle', type: 'textarea', label: 'Deskripsi singkat di bawah judul', group: 'Halaman Blog', max: 240, default: '' },
    { key: 'copy.blog_kanji', type: 'text', label: 'Hiasan aksara di kartu unggulan (skin panel)', group: 'Halaman Blog', max: 12, default: '記事', hint: 'Contoh: 記事 (artikel), 特定技能. Kosongkan untuk tanpa hiasan.' },
    { key: 'copy.blog_cta_title', type: 'text', label: 'Judul ajakan di akhir halaman', group: 'Ajakan (CTA)', max: 90, default: '' },
    { key: 'copy.blog_cta_subtitle', type: 'textarea', label: 'Teks pendukung ajakan', group: 'Ajakan (CTA)', max: 200, default: '' },
    { key: 'copy.blog_cta_label', type: 'text', label: 'Tulisan tombol ajakan', group: 'Ajakan (CTA)', max: 40, default: 'Chat WhatsApp' },
    { key: 'copy.blog_cta_link', type: 'link', label: 'Link tombol ajakan (https)', group: 'Ajakan (CTA)', default: '', hint: 'Kosongkan untuk memakai WhatsApp dari Profil Bisnis.' },
  ],
}

// Nilai copy blog efektif utk renderer: theme_copy → default manifest.
export type BlogCopy = {
  eyebrow: string
  title: string
  subtitle: string
  kanji: string
  ctaTitle: string
  ctaSubtitle: string
  ctaLabel: string
  ctaLink: string
}

export function resolveBlogCopy(dataKonten: Record<string, unknown> | null | undefined): BlogCopy {
  const tc = dataKonten?.theme_copy && typeof dataKonten.theme_copy === 'object' && !Array.isArray(dataKonten.theme_copy)
    ? (dataKonten.theme_copy as Record<string, unknown>)
    : {}
  const s = (k: string, d: string) => {
    const v = tc[k]
    return typeof v === 'string' && v.trim() ? v.trim() : d
  }
  return {
    eyebrow: s('copy.blog_eyebrow', 'Blog'),
    title: s('copy.blog_title', 'Artikel Terbaru'),
    subtitle: s('copy.blog_subtitle', ''),
    kanji: s('copy.blog_kanji', '記事'),
    ctaTitle: s('copy.blog_cta_title', ''),
    ctaSubtitle: s('copy.blog_cta_subtitle', ''),
    ctaLabel: s('copy.blog_cta_label', 'Chat WhatsApp'),
    ctaLink: s('copy.blog_cta_link', ''),
  }
}
