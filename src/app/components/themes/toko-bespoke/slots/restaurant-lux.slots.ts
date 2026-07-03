// ============================================================
// SLOT MANIFEST — restaurant-lux ("Aurum", fine dining). Migrasi Wave 5.
// Tiap field = copy yang dulu literal di RestaurantLuxRenderer.tsx; `default`
// WAJIB byte-identik hardcode semula (mekanisme parity — situs yang belum
// mengedit render persis sama; dijaga RestaurantLuxRenderer.parity.test.tsx).
// Nilai editan klien: landing_pages.data_konten.theme_copy via panel
// "Konten Tema" portal (/api/portal/theme-copy).
// ============================================================
import type { ThemeSlotManifest } from '@/lib/theme-system/slot-schema'

export const RESTAURANT_LUX_SLOTS: ThemeSlotManifest = {
  theme: 'restaurant-lux',
  fields: [
    // ── Navigasi & Merek ──
    { key: 'copy.brand_sub', type: 'text', label: 'Label kecil di bawah nama (nav)', group: 'Navigasi & Merek', max: 30, default: 'Fine Dining' },
    { key: 'copy.nav_menu', type: 'text', label: 'Link nav: menu', group: 'Navigasi & Merek', max: 20, default: 'Menu', hint: 'Dipakai bila judul etalase kosong (nav memakai kata pertama judul etalase).' },
    { key: 'copy.nav_filosofi', type: 'text', label: 'Link nav: filosofi', group: 'Navigasi & Merek', max: 20, default: 'Filosofi' },
    { key: 'copy.nav_cerita', type: 'text', label: 'Link nav: cerita', group: 'Navigasi & Merek', max: 20, default: 'Cerita' },
    { key: 'copy.nav_tim', type: 'text', label: 'Link nav: tim', group: 'Navigasi & Merek', max: 20, default: 'Tim', hint: 'Dipakai bila judul bagian tim kosong (nav memakai kata pertama judul tim).' },
    { key: 'copy.nav_galeri', type: 'text', label: 'Link nav: galeri', group: 'Navigasi & Merek', max: 20, default: 'Galeri' },
    { key: 'copy.nav_kunjungi', type: 'text', label: 'Link nav: kunjungi', group: 'Navigasi & Merek', max: 20, default: 'Kunjungi' },

    // ── Tombol & Ajakan ──
    { key: 'copy.reservasi', type: 'text', label: 'Tombol reservasi', group: 'Tombol & Ajakan', max: 30, default: 'Reservasi', hint: 'Dipakai bila teks reservasi di Info tidak diisi.' },
    { key: 'copy.reservasi_booking', type: 'text', label: 'Tombol reservasi (add-on booking)', group: 'Tombol & Ajakan', max: 30, default: 'Reservasi Meja', hint: 'Dipakai saat add-on booking aktif.' },
    { key: 'copy.hero_cta2', type: 'text', label: 'Tombol kedua hero', group: 'Tombol & Ajakan', max: 30, default: 'Lihat Menu', hint: 'Dipakai bila konten hero tidak menyetel teks tombol keduanya sendiri.' },
    { key: 'copy.delivery_cta', type: 'text', label: 'Tombol pesan antar (add-on delivery)', group: 'Tombol & Ajakan', max: 30, default: 'Pesan Antar' },

    // ── Judul Bagian ──
    { key: 'copy.statement_eyebrow', type: 'text', label: 'Label kecil bagian filosofi', group: 'Judul Bagian', max: 40, default: 'Filosofi', hint: 'Dipakai bila konten statement tidak menyetel label kecilnya sendiri.' },
    { key: 'copy.signature_eyebrow', type: 'text', label: 'Label kecil hidangan andalan', group: 'Judul Bagian', max: 40, default: 'Yang Kami Banggakan' },
    { key: 'copy.signature_title', type: 'text', label: 'Judul hidangan andalan', group: 'Judul Bagian', max: 60, default: 'Hidangan yang menentukan kami' },
    { key: 'copy.menu_eyebrow', type: 'text', label: 'Label kecil bagian menu', group: 'Judul Bagian', max: 40, default: 'Menu' },
    { key: 'copy.menu_title', type: 'text', label: 'Judul bagian menu', group: 'Judul Bagian', max: 60, default: 'Daftar Pilihan', hint: 'Dipakai bila judul etalase kosong.' },
    { key: 'copy.about_eyebrow', type: 'text', label: 'Label kecil bagian cerita', group: 'Judul Bagian', max: 40, default: 'Cerita Kami' },
    { key: 'copy.team_eyebrow', type: 'text', label: 'Label kecil bagian tim', group: 'Judul Bagian', max: 40, default: 'Tim Kami', hint: 'Dipakai bila konten tidak menyetel label timnya sendiri.' },
    { key: 'copy.team_title', type: 'text', label: 'Judul bagian tim', group: 'Judul Bagian', max: 60, default: 'Di Balik Dapur', hint: 'Dipakai bila konten tidak menyetel judul timnya sendiri.' },
    { key: 'copy.gallery_eyebrow', type: 'text', label: 'Label kecil galeri', group: 'Judul Bagian', max: 40, default: 'Suasana & Sajian', hint: 'Dipakai bila galeri tidak menyetel judulnya sendiri.' },
    { key: 'copy.gallery_title', type: 'text', label: 'Judul galeri', group: 'Judul Bagian', max: 60, default: 'Ruang untuk perayaan', hint: 'Dipakai bila galeri tidak menyetel subjudulnya sendiri.' },
    { key: 'copy.testi_eyebrow', type: 'text', label: 'Label kecil ulasan tamu', group: 'Judul Bagian', max: 40, default: 'Kata Tamu' },
    { key: 'copy.faq_eyebrow', type: 'text', label: 'Label kecil bagian FAQ', group: 'Judul Bagian', max: 40, default: 'Pertanyaan' },
    { key: 'copy.faq_title', type: 'text', label: 'Judul bagian FAQ', group: 'Judul Bagian', max: 60, default: 'Sebelum Anda datang' },
    { key: 'copy.visit_eyebrow', type: 'text', label: 'Label kecil bagian kunjungan', group: 'Judul Bagian', max: 40, default: 'Kunjungi Kami' },
    { key: 'copy.visit_title', type: 'text', label: 'Judul bagian kunjungan', group: 'Judul Bagian', max: 60, default: 'Amankan malam Anda' },

    // ── Info & Catatan ──
    { key: 'copy.qr_note', type: 'text', label: 'Catatan menu QR (add-on qr-menu)', group: 'Info & Catatan', max: 80, default: 'Pindai QR di meja untuk akses menu digital.' },
    { key: 'copy.visit_jam_label', type: 'text', label: 'Label baris jam buka', group: 'Info & Catatan', max: 30, default: 'Jam Buka' },
    { key: 'copy.visit_alamat_label', type: 'text', label: 'Label baris alamat', group: 'Info & Catatan', max: 30, default: 'Alamat' },
    { key: 'copy.visit_telp_label', type: 'text', label: 'Label baris telepon reservasi', group: 'Info & Catatan', max: 30, default: 'Reservasi' },

    // ── Footer ──
    { key: 'copy.footer_copyright', type: 'text', label: 'Teks hak cipta', group: 'Footer', max: 80, default: 'Dibuat dengan Webzoka.' },

    // ── SEO ──
    { key: 'copy.seo_title', type: 'text', label: 'Judul tab browser (SEO)', group: 'SEO', max: 70, default: '', hint: 'Kosong = pakai judul bawaan situs.' },
    { key: 'copy.seo_description', type: 'textarea', label: 'Deskripsi hasil pencarian (SEO)', group: 'SEO', max: 160, default: '' },
  ],
}
