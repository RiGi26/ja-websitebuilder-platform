// ============================================================
// SLOT MANIFEST — toko-atelier (flagship fashion "KALA"). Migrasi Wave 5.
// Tiap field = copy yang dulu literal di TokoAtelierRenderer.tsx; `default`
// WAJIB byte-identik hardcode semula (mekanisme parity — situs yang belum
// mengedit render persis sama; dijaga TokoAtelierRenderer.parity.test.tsx).
// Nilai editan klien: landing_pages.data_konten.theme_copy via panel
// "Konten Tema" portal (/api/portal/theme-copy).
// ============================================================
import type { ThemeSlotManifest } from '@/lib/theme-system/slot-schema'

export const TOKO_ATELIER_SLOTS: ThemeSlotManifest = {
  theme: 'toko-atelier',
  fields: [
    // ── Navigasi & Merek ──
    { key: 'copy.brand_sub', type: 'text', label: 'Label kecil di bawah nama (nav)', group: 'Navigasi & Merek', max: 30, default: 'Atelier' },
    { key: 'copy.nav_koleksi', type: 'text', label: 'Link nav: koleksi', group: 'Navigasi & Merek', max: 20, default: 'Koleksi' },
    { key: 'copy.nav_filosofi', type: 'text', label: 'Link nav: filosofi', group: 'Navigasi & Merek', max: 20, default: 'Filosofi' },
    { key: 'copy.nav_cerita', type: 'text', label: 'Link nav: cerita', group: 'Navigasi & Merek', max: 20, default: 'Cerita' },
    { key: 'copy.nav_galeri', type: 'text', label: 'Link nav: galeri', group: 'Navigasi & Merek', max: 20, default: 'Galeri' },
    { key: 'copy.nav_kontak', type: 'text', label: 'Link nav: kontak', group: 'Navigasi & Merek', max: 20, default: 'Kontak' },

    // ── Tombol & Ajakan ──
    { key: 'copy.contact_cta', type: 'text', label: 'Tombol hubungi kami', group: 'Tombol & Ajakan', max: 30, default: 'Hubungi Kami', hint: 'Dipakai di nav dan panel ajakan (bila konten tidak menyetel teksnya).' },
    { key: 'copy.card_pesan', type: 'text', label: 'Tombol pesan di kartu produk', group: 'Tombol & Ajakan', max: 20, default: 'Pesan' },
    { key: 'copy.quick_detail', type: 'text', label: 'Tombol lihat detail produk', group: 'Tombol & Ajakan', max: 30, default: 'Lihat Detail' },
    { key: 'copy.cta_ghost', type: 'text', label: 'Tombol kedua panel ajakan', group: 'Tombol & Ajakan', max: 30, default: 'Lihat Koleksi' },
    { key: 'copy.lightbox_cta', type: 'text', label: 'Tombol pesan di jendela produk', group: 'Tombol & Ajakan', max: 40, default: 'Pesan via WhatsApp' },
    { key: 'copy.faq_wa', type: 'text', label: 'Link tanya WhatsApp (FAQ)', group: 'Tombol & Ajakan', max: 40, default: 'Tanya via WhatsApp' },

    // ── Etalase ──
    { key: 'copy.stok_habis', type: 'text', label: 'Badge stok habis', group: 'Etalase', max: 20, default: 'Habis' },
    { key: 'copy.stok_sisa', type: 'text', label: 'Badge stok menipis (kata depan)', group: 'Etalase', max: 20, default: 'Sisa', hint: 'Dirangkai dengan angka: "Sisa 3".' },
    { key: 'copy.chip_semua', type: 'text', label: 'Chip filter semua', group: 'Etalase', max: 20, default: 'Semua' },
    { key: 'copy.gallery_lb_cat', type: 'text', label: 'Label kategori foto galeri (jendela)', group: 'Etalase', max: 30, default: 'Dari Atelier' },

    // ── Judul Bagian ──
    { key: 'copy.lookbook_eyebrow', type: 'text', label: 'Label kecil bagian koleksi', group: 'Judul Bagian', max: 40, default: 'Lookbook' },
    { key: 'copy.lookbook_title', type: 'text', label: 'Judul bagian koleksi', group: 'Judul Bagian', max: 60, default: 'Koleksi Kami', hint: 'Dipakai bila judul etalase kosong.' },
    { key: 'copy.statement_eyebrow', type: 'text', label: 'Label kecil bagian filosofi', group: 'Judul Bagian', max: 40, default: 'Filosofi', hint: 'Dipakai bila konten statement tidak menyetel label kecilnya sendiri.' },
    { key: 'copy.features_eyebrow', type: 'text', label: 'Label kecil bagian keunggulan', group: 'Judul Bagian', max: 40, default: 'Keunggulan', hint: 'Dipakai bila konten tidak menyetel label keunggulannya sendiri.' },
    { key: 'copy.features_title', type: 'text', label: 'Judul bagian keunggulan', group: 'Judul Bagian', max: 60, default: 'Yang membuat kami berbeda', hint: 'Dipakai bila konten tidak menyetel judul keunggulannya sendiri.' },
    { key: 'copy.about_eyebrow', type: 'text', label: 'Label kecil bagian cerita', group: 'Judul Bagian', max: 40, default: 'Cerita Kami' },
    { key: 'copy.gallery_eyebrow', type: 'text', label: 'Label kecil galeri', group: 'Judul Bagian', max: 40, default: 'Galeri' },
    { key: 'copy.gallery_title', type: 'text', label: 'Judul galeri', group: 'Judul Bagian', max: 60, default: 'Dari Atelier', hint: 'Dipakai bila galeri tidak menyetel judulnya sendiri.' },
    { key: 'copy.testi_eyebrow', type: 'text', label: 'Label kecil testimoni', group: 'Judul Bagian', max: 40, default: 'Testimoni' },
    { key: 'copy.testi_title', type: 'text', label: 'Judul testimoni', group: 'Judul Bagian', max: 60, default: 'Kata mereka yang memakainya' },
    { key: 'copy.faq_eyebrow', type: 'text', label: 'Label kecil bagian FAQ', group: 'Judul Bagian', max: 40, default: 'Tanya Jawab' },
    { key: 'copy.faq_title', type: 'text', label: 'Judul bagian FAQ', group: 'Judul Bagian', max: 60, default: 'Hal yang sering ditanyakan' },
    { key: 'copy.faq_sub', type: 'text', label: 'Subjudul bagian FAQ', group: 'Judul Bagian', max: 120, default: 'Tidak menemukan jawaban Anda? Kami senang mengobrol.' },

    // ── Footer ──
    { key: 'copy.footer_tagline', type: 'text', label: 'Tagline footer', group: 'Footer', max: 80, default: 'Dibuat perlahan, dipakai bertahun-tahun.', hint: 'Dipakai bila subjudul hero kosong.' },
    { key: 'copy.footer_kunjungi_h', type: 'text', label: 'Judul kolom kunjungi', group: 'Footer', max: 30, default: 'Kunjungi' },
    { key: 'copy.footer_jam_h', type: 'text', label: 'Judul kolom jam buka', group: 'Footer', max: 30, default: 'Jam Buka' },
    { key: 'copy.footer_copyright', type: 'text', label: 'Teks hak cipta', group: 'Footer', max: 80, default: 'Seluruh hak cipta.' },
    { key: 'copy.footer_credit', type: 'text', label: 'Kredit pembuat situs', group: 'Footer', max: 60, default: 'Dibuat dengan Webzoka' },

    // ── SEO ──
    { key: 'copy.seo_title', type: 'text', label: 'Judul tab browser (SEO)', group: 'SEO', max: 70, default: '', hint: 'Kosong = pakai judul bawaan situs.' },
    { key: 'copy.seo_description', type: 'textarea', label: 'Deskripsi hasil pencarian (SEO)', group: 'SEO', max: 160, default: '' },
  ],
}
