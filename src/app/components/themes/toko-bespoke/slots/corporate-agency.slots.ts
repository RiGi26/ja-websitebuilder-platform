// ============================================================
// GENERATED — jangan edit manual. Sumber: theme-sources/corporate-agency/index.html
// Manifest slot tema 'corporate-agency': default = copy mockup verbatim (mockup =
// draft klien; teks kosong di portal = kembali ke bawaan ini).
// ============================================================
import type { ThemeSlotManifest } from '@/lib/theme-system/slot-schema'

export const CORPORATE_AGENCY_SLOTS: ThemeSlotManifest = {
  theme: 'corporate-agency',
  fields: [
    // ── Tombol & Ajakan ──
    { key: 'copy.nav_cta', type: 'text', label: 'Tombol di navigasi', group: 'Tombol & Ajakan', max: 24, default: 'Mulai Proyek' },
    { key: 'copy.hero_cta1', type: 'text', label: 'Tombol utama hero', group: 'Tombol & Ajakan', max: 40, default: 'Mulai Percakapan', hint: 'Dipakai bila konten tidak menyetel teksnya sendiri.' },
    { key: 'copy.hero_cta2', type: 'text', label: 'Tombol kedua hero', group: 'Tombol & Ajakan', max: 40, default: 'Lihat Layanan', hint: 'Dipakai bila konten tidak menyetel teksnya sendiri.' },
    { key: 'copy.cta_primary', type: 'text', label: 'Tombol utama panel ajakan', group: 'Tombol & Ajakan', max: 40, default: 'Ngobrol via WhatsApp', hint: 'Dipakai bila konten tidak menyetel teksnya sendiri.' },
    { key: 'copy.cta_ghost', type: 'text', label: 'Tombol kedua panel ajakan', group: 'Tombol & Ajakan', max: 30, default: 'Lihat Layanan' },
    // ── Hero ──
    { key: 'copy.hero_caption', type: 'text', label: 'Keterangan kecil di bawah foto hero', group: 'Hero', max: 60, default: 'Studio kami — Jakarta Selatan' },
    // ── Judul Bagian ──
    { key: 'copy.layanan_eyebrow', type: 'text', label: 'Label kecil bagian layanan', group: 'Judul Bagian', max: 30, default: 'Layanan' },
    { key: 'copy.features_eyebrow', type: 'text', label: 'Label kecil bagian keunggulan', group: 'Judul Bagian', max: 40, default: 'Cara Kerja', hint: 'Dipakai bila konten tidak menyetel teksnya sendiri.' },
    { key: 'copy.about_eyebrow', type: 'text', label: 'Label kecil bagian tentang', group: 'Judul Bagian', max: 30, default: 'Tentang' },
    { key: 'copy.ulasan_eyebrow', type: 'text', label: 'Label kecil bagian ulasan', group: 'Judul Bagian', max: 30, default: 'Ulasan' },
    { key: 'copy.ulasan_title', type: 'text', label: 'Judul bagian ulasan', group: 'Judul Bagian', max: 60, default: 'Kata klien kami' },
    { key: 'copy.faq_eyebrow', type: 'text', label: 'Label kecil bagian FAQ', group: 'Judul Bagian', max: 30, default: 'Pertanyaan' },
    { key: 'copy.faq_title', type: 'text', label: 'Judul bagian FAQ', group: 'Judul Bagian', max: 60, default: 'Sering ditanyakan' },
    // ── Footer ──
    { key: 'copy.footer_tagline', type: 'textarea', label: 'Tagline footer', group: 'Footer', max: 160, default: 'Studio digital untuk merek yang serius bertumbuh.' },
    { key: 'copy.footer_kontak_h', type: 'text', label: 'Judul kolom kontak', group: 'Footer', max: 30, default: 'Kontak' },
    { key: 'copy.footer_wa_label', type: 'text', label: 'Label tautan WhatsApp', group: 'Footer', max: 30, default: 'WhatsApp' },
    { key: 'copy.footer_jam_h', type: 'text', label: 'Judul kolom jam kerja', group: 'Footer', max: 30, default: 'Jam Kerja' },
    { key: 'copy.footer_jam_fallback', type: 'text', label: 'Footer jam fallback', group: 'Footer', max: 48, default: 'Senin–Jumat: 09.00–18.00' },
    { key: 'copy.footer_copyright', type: 'text', label: 'Teks hak cipta', group: 'Footer', max: 80, default: 'Semua hak cipta dilindungi.' },
    // ── SEO ──
    { key: 'copy.seo_title', type: 'text', label: 'Judul tab browser (SEO)', group: 'SEO', max: 70, default: '', hint: 'Kosong = pakai judul bawaan situs.' },
    { key: 'copy.seo_description', type: 'textarea', label: 'Deskripsi hasil pencarian (SEO)', group: 'SEO', max: 160, default: '' },
  ],
}
