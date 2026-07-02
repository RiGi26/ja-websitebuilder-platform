// ============================================================
// SLOT MANIFEST — restaurant-warung ("Hangat"). Pilot zero-hardcoded-copy.
// Tiap field = copy yang dulu literal di WarungRenderer.tsx; `default` WAJIB
// byte-identik hardcode semula (mekanisme parity — situs yang belum mengedit
// render persis sama; dijaga WarungRenderer.parity.test.tsx).
// Nilai editan klien: landing_pages.data_konten.theme_copy via panel
// "Konten Tema" portal (/api/portal/theme-copy).
// ============================================================
import type { ThemeSlotManifest } from '@/lib/theme-system/slot-schema'

export const WARUNG_SLOTS: ThemeSlotManifest = {
  theme: 'restaurant-warung',
  fields: [
    // ── Pita & Badge ──
    {
      key: 'copy.ribbon', type: 'array', label: 'Kata-kata pita merah', group: 'Pita & Badge', max: 8,
      default: ['Masakan Rumahan', 'Hangat', 'Dimasak Dadakan', 'Bersama', 'Sederhana'],
      hint: 'Kata vibe warung, bukan klaim (hindari "terenak/halal" — klaim spesifik taruh di konten).',
    },
    { key: 'copy.stamp', type: 'text', label: 'Teks stempel foto hero', group: 'Pita & Badge', max: 30, default: 'Selalu Hangat' },
    { key: 'copy.soldout_badge', type: 'text', label: 'Badge menu habis', group: 'Pita & Badge', max: 20, default: 'Habis' },

    // ── Tombol & Ajakan ──
    { key: 'copy.nav_cta', type: 'text', label: 'Tombol pesan di navigasi', group: 'Tombol & Ajakan', max: 20, default: 'Pesan' },
    { key: 'copy.hero_cta1', type: 'text', label: 'Tombol utama hero', group: 'Tombol & Ajakan', max: 30, default: 'Lihat Menu', hint: 'Dipakai bila konten hero tidak menyetel teks tombolnya sendiri.' },
    { key: 'copy.hero_cta2', type: 'text', label: 'Tombol kedua hero', group: 'Tombol & Ajakan', max: 30, default: 'Pesan Antar' },
    { key: 'copy.card_more', type: 'text', label: 'Teks ajakan di kartu menu', group: 'Tombol & Ajakan', max: 40, default: 'Lihat & pesan →' },
    { key: 'copy.cta_primary', type: 'text', label: 'Tombol utama panel ajakan', group: 'Tombol & Ajakan', max: 40, default: 'Pesan via WhatsApp' },
    { key: 'copy.cta_ghost', type: 'text', label: 'Tombol kedua panel ajakan', group: 'Tombol & Ajakan', max: 30, default: 'Lihat Menu' },
    { key: 'copy.lightbox_cta', type: 'text', label: 'Tombol pesan di jendela menu', group: 'Tombol & Ajakan', max: 40, default: 'Pesan via WhatsApp' },

    // ── Judul Bagian ──
    { key: 'copy.features_eyebrow', type: 'text', label: 'Label kecil bagian keunggulan', group: 'Judul Bagian', max: 40, default: 'Kenapa Kami', hint: 'Dipakai bila konten tidak menyetel label keunggulannya sendiri.' },
    { key: 'copy.menu_eyebrow', type: 'text', label: 'Label kecil bagian menu', group: 'Judul Bagian', max: 40, default: 'Menu' },
    { key: 'copy.about_eyebrow', type: 'text', label: 'Label kecil bagian tentang', group: 'Judul Bagian', max: 40, default: 'Tentang Kami' },
    { key: 'copy.ulasan_eyebrow', type: 'text', label: 'Label kecil bagian ulasan', group: 'Judul Bagian', max: 40, default: 'Ulasan' },
    { key: 'copy.ulasan_title', type: 'text', label: 'Judul bagian ulasan', group: 'Judul Bagian', max: 60, default: 'Kata Pelanggan' },
    { key: 'copy.faq_eyebrow', type: 'text', label: 'Label kecil bagian FAQ', group: 'Judul Bagian', max: 40, default: 'Pertanyaan' },
    { key: 'copy.faq_title', type: 'text', label: 'Judul bagian FAQ', group: 'Judul Bagian', max: 60, default: 'Sering Ditanyakan' },

    // ── Footer ──
    { key: 'copy.footer_tagline', type: 'textarea', label: 'Tagline footer', group: 'Footer', max: 160, default: '', hint: 'Kosong = pakai eyebrow hero / kalimat bawaan tema.' },
    { key: 'copy.footer_kontak_h', type: 'text', label: 'Judul kolom kontak', group: 'Footer', max: 30, default: 'Kontak' },
    { key: 'copy.footer_jam_h', type: 'text', label: 'Judul kolom jam buka', group: 'Footer', max: 30, default: 'Jam Buka' },
    { key: 'copy.footer_jam_fallback', type: 'text', label: 'Jam buka bawaan', group: 'Footer', max: 60, default: 'Setiap hari: 07.00–21.00', hint: 'Dipakai bila profil bisnis belum mengisi jam operasional.' },
    { key: 'copy.footer_copyright', type: 'text', label: 'Teks hak cipta', group: 'Footer', max: 80, default: 'Semua hak cipta dilindungi.' },

    // ── SEO ──
    { key: 'copy.seo_title', type: 'text', label: 'Judul tab browser (SEO)', group: 'SEO', max: 70, default: '', hint: 'Kosong = pakai judul bawaan situs.' },
    { key: 'copy.seo_description', type: 'textarea', label: 'Deskripsi hasil pencarian (SEO)', group: 'SEO', max: 160, default: '' },
  ],
}
