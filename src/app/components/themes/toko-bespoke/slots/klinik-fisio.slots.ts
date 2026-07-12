// ============================================================
// SLOT MANIFEST — klinik-fisio ("Gerak", sport-physio). Migrasi Wave 5.
// Tiap field = copy yang dulu literal di KlinikFisioRenderer.tsx; `default`
// WAJIB byte-identik hardcode semula (mekanisme parity — situs yang belum
// mengedit render persis sama; dijaga KlinikFisioRenderer.parity.test.tsx).
// Nilai editan klien: landing_pages.data_konten.theme_copy via panel
// "Konten Tema" portal (/api/portal/theme-copy).
//
// CATATAN: RECOVERY_STEPS (jalur pemulihan 3 langkah) SENGAJA belum di-slot —
// butuh array objek {title,desc}, ThemeCopyPanel belum punya editor item-array
// (lihat ThemeCopyPanel.tsx). Follow-up saat editor itu dibangun.
// Label "Contoh untuk mockup — ganti dengan testimoni asli" juga SENGAJA tetap
// literal — guard [[kejujuran-jualan]], hilang lewat konten asli, bukan diedit.
// ============================================================
import type { ThemeSlotManifest } from '@/lib/theme-system/slot-schema'

export const KLINIK_FISIO_SLOTS: ThemeSlotManifest = {
  theme: 'klinik-fisio',
  fields: [
    // ── Tombol & Ajakan ──
    { key: 'copy.booking_cta', type: 'text', label: 'Tombol booking online', group: 'Tombol & Ajakan', max: 30, default: 'Booking Online', hint: 'Tampil saat booking online aktif (nav, hero, panel ajakan).' },
    { key: 'copy.wa_cta', type: 'text', label: 'Tombol WhatsApp singkat', group: 'Tombol & Ajakan', max: 20, default: 'WhatsApp' },
    { key: 'copy.hero_cta', type: 'text', label: 'Tombol utama hero', group: 'Tombol & Ajakan', max: 40, default: 'Konsultasi Gratis via WhatsApp', hint: 'Dipakai bila konten hero tidak menyetel teks tombolnya sendiri.' },
    { key: 'copy.hero_cta2', type: 'text', label: 'Tombol lihat layanan', group: 'Tombol & Ajakan', max: 30, default: 'Lihat Layanan' },
    { key: 'copy.cta_wa', type: 'text', label: 'Tombol WhatsApp panel ajakan', group: 'Tombol & Ajakan', max: 40, default: 'Konsultasi via WhatsApp', hint: 'Juga dipakai tombol pesan di jendela detail layanan.' },
    { key: 'copy.about_cta', type: 'text', label: 'Teks link tentang kami', group: 'Tombol & Ajakan', max: 40, default: 'Pelajari lebih lanjut', hint: 'Dipakai bila konten tentang tidak menyetel teks CTA-nya sendiri.' },
    { key: 'copy.hero_booking_cta', type: 'text', label: 'Tombol utama hero (booking aktif)', group: 'Tombol & Ajakan', max: 40, default: 'Cek Jadwal & Booking', hint: 'Tampil saat booking online aktif; mengarah ke papan jadwal.' },

    // ── Hero & Badge ──
    { key: 'copy.hero_em', type: 'text', label: 'Kata judul hero yang disorot', group: 'Hero & Badge', max: 40, default: 'gerak bebas', hint: 'Potongan judul hero ini diberi warna teal + garis oranye. Harus persis ada di judul hero.' },
    { key: 'copy.hero_chip', type: 'text', label: 'Chip di kartu visual hero', group: 'Hero & Badge', max: 50, default: 'Sport & Clinical Physiotherapy' },
    { key: 'copy.hero_quote_1', type: 'text', label: 'Quote kartu visual: baris 1', group: 'Hero & Badge', max: 40, default: 'Dari meja terapi' },
    { key: 'copy.hero_quote_2', type: 'text', label: 'Quote kartu visual: baris 2 (oranye)', group: 'Hero & Badge', max: 40, default: 'kembali ke lapangan.' },
    { key: 'copy.hero_micro', type: 'text', label: 'Teks kecil bawah tombol hero', group: 'Hero & Badge', max: 80, default: 'Balas cepat di jam kerja. Tanpa komitmen.' },
    { key: 'copy.trust_reviews', type: 'text', label: 'Label ulasan di strip rating', group: 'Hero & Badge', max: 30, default: 'ulasan pasien' },
    { key: 'copy.float_rating_prefix', type: 'text', label: 'Kartu rating: kata depan', group: 'Hero & Badge', max: 20, default: 'Rating' },
    { key: 'copy.float_rating_suffix', type: 'text', label: 'Kartu rating: kata belakang', group: 'Hero & Badge', max: 20, default: 'di Google' },
    { key: 'copy.float_rating_sub', type: 'text', label: 'Kartu rating: keterangan', group: 'Hero & Badge', max: 40, default: 'Ulasan dari pasien' },
    { key: 'copy.badge_open', type: 'text', label: 'Badge jam: kata buka', group: 'Hero & Badge', max: 20, default: 'Buka' },
    { key: 'copy.jam_fallback', type: 'text', label: 'Jam di badge (bawaan)', group: 'Hero & Badge', max: 30, default: '09.00–18.00', hint: 'Dipakai bila profil bisnis belum mengisi jam operasional.' },

    // ── Judul Bagian ──
    { key: 'copy.keluhan_eyebrow', type: 'text', label: 'Label kecil bagian keluhan', group: 'Judul Bagian', max: 40, default: 'Yang Kami Tangani' },
    { key: 'copy.keluhan_title', type: 'text', label: 'Judul bagian keluhan', group: 'Judul Bagian', max: 80, default: 'Keluhan yang paling sering kami pulihkan' },
    {
      key: 'copy.keluhan_items', type: 'array', label: 'Daftar pill keluhan', group: 'Judul Bagian', max: 12,
      default: ['Cedera ACL & lutut', 'Nyeri punggung bawah', 'Saraf kejepit', 'Frozen shoulder', 'Cedera lari & olahraga', 'Pemulihan pasca-operasi', 'Pemulihan pasca-stroke', 'Skoliosis', 'Nyeri leher & postur kerja'],
    },
    { key: 'copy.features_eyebrow', type: 'text', label: 'Label kecil bagian keunggulan', group: 'Judul Bagian', max: 40, default: 'Kenapa Kami', hint: 'Dipakai bila konten tidak menyetel label keunggulannya sendiri.' },
    { key: 'copy.steps_eyebrow', type: 'text', label: 'Label kecil jalur pemulihan', group: 'Judul Bagian', max: 40, default: 'Recovery Track' },
    { key: 'copy.steps_title', type: 'text', label: 'Judul jalur pemulihan', group: 'Judul Bagian', max: 60, default: 'Jalur pemulihanmu, jelas dari hari pertama' },
    { key: 'copy.steps_sub', type: 'text', label: 'Subjudul jalur pemulihan', group: 'Judul Bagian', max: 120, default: 'Tidak ada terapi asal-jalan. Setiap pasien lewat tiga tahap yang terukur.' },
    { key: 'copy.layanan_eyebrow', type: 'text', label: 'Label kecil bagian layanan', group: 'Judul Bagian', max: 40, default: 'Paket Terapi' },
    { key: 'copy.layanan_title', type: 'text', label: 'Judul bagian layanan', group: 'Judul Bagian', max: 60, default: 'Layanan & harga, tanpa kejutan' },
    { key: 'copy.layanan_sub', type: 'text', label: 'Subjudul bagian layanan', group: 'Judul Bagian', max: 140, default: 'Sesi one-on-one dengan fisioterapis berlisensi. Harga di bawah sudah final.' },
    { key: 'copy.jadwal_eyebrow', type: 'text', label: 'Label kecil papan jadwal', group: 'Judul Bagian', max: 40, default: 'Jadwal & Ketersediaan', hint: 'Tampil saat booking online aktif (papan jadwal realtime).' },
    { key: 'copy.jadwal_title', type: 'text', label: 'Judul papan jadwal', group: 'Judul Bagian', max: 80, default: 'Siapa yang bisa menanganimu hari ini', hint: 'Tampil saat booking online aktif.' },
    { key: 'copy.jadwal_sub', type: 'text', label: 'Subjudul papan jadwal', group: 'Judul Bagian', max: 140, default: 'Ketersediaan terapis diperbarui langsung dari sistem booking klinik. Pilih jam yang pas, amankan slotmu.', hint: 'Tampil saat booking online aktif.' },
    { key: 'copy.jadwal_week_title', type: 'text', label: 'Judul tabel jadwal mingguan', group: 'Judul Bagian', max: 60, default: 'Jadwal praktik mingguan', hint: 'Tampil saat booking online aktif.' },
    { key: 'copy.jadwal_note', type: 'text', label: 'Catatan bawah papan jadwal', group: 'Judul Bagian', max: 160, default: 'Jam praktik bisa berubah saat hari libur nasional. Slot yang tampil = slot yang benar-benar tersedia.', hint: 'Tampil saat booking online aktif.' },
    { key: 'copy.booking_eyebrow', type: 'text', label: 'Label kecil bagian booking', group: 'Judul Bagian', max: 40, default: 'Booking Online' },
    { key: 'copy.booking_title', type: 'text', label: 'Judul bagian booking', group: 'Judul Bagian', max: 60, default: 'Pilih jadwal & amankan slotmu' },
    { key: 'copy.booking_sub', type: 'text', label: 'Subjudul bagian booking', group: 'Judul Bagian', max: 120, default: 'Cek ketersediaan real-time lalu booking langsung di sini — tanpa antre chat.' },
    { key: 'copy.about_eyebrow', type: 'text', label: 'Label kecil bagian tentang', group: 'Judul Bagian', max: 40, default: 'Tentang Kami' },
    { key: 'copy.terapis_eyebrow', type: 'text', label: 'Label kecil bagian terapis', group: 'Judul Bagian', max: 40, default: 'Tim Fisioterapis', hint: 'Tampil saat booking online aktif (data dari portal klinik).' },
    { key: 'copy.terapis_title', type: 'text', label: 'Judul bagian terapis', group: 'Judul Bagian', max: 60, default: 'Ditangani spesialis, bukan generalis', hint: 'Tampil saat booking online aktif.' },
    { key: 'copy.terapis_sub', type: 'text', label: 'Subjudul bagian terapis', group: 'Judul Bagian', max: 140, default: 'Setiap terapis punya fokus keahlian — kamu ditangani orang yang paling paham kondisimu.', hint: 'Tampil saat booking online aktif.' },
    { key: 'copy.cabang_eyebrow', type: 'text', label: 'Label kecil bagian cabang', group: 'Judul Bagian', max: 40, default: 'Cabang', hint: 'Tampil saat booking online aktif (data dari portal klinik).' },
    { key: 'copy.cabang_title', type: 'text', label: 'Judul bagian cabang', group: 'Judul Bagian', max: 60, default: 'Satu standar pemulihan di semua cabang', hint: 'Tampil saat booking online aktif.' },
    { key: 'copy.cabang_sub', type: 'text', label: 'Subjudul bagian cabang', group: 'Judul Bagian', max: 140, default: 'Pilih cabang terdekat — rutin terapi tidak jadi beban.', hint: 'Tampil saat booking online aktif.' },
    { key: 'copy.ulasan_eyebrow', type: 'text', label: 'Label kecil bagian ulasan', group: 'Judul Bagian', max: 40, default: 'Bukti, Bukan Janji' },
    { key: 'copy.ulasan_title', type: 'text', label: 'Judul bagian ulasan', group: 'Judul Bagian', max: 60, default: 'Mereka sudah kembali bergerak' },
    { key: 'copy.faq_eyebrow', type: 'text', label: 'Label kecil bagian FAQ', group: 'Judul Bagian', max: 40, default: 'FAQ' },
    { key: 'copy.faq_title', type: 'text', label: 'Judul bagian FAQ', group: 'Judul Bagian', max: 60, default: 'Sering ditanyakan' },

    // ── Etalase ──
    { key: 'copy.price_fallback', type: 'text', label: 'Teks harga kosong', group: 'Etalase', max: 20, default: 'Konsultasi', hint: 'Tampil sebagai pengganti harga bila layanan tidak berharga tetap.' },
    { key: 'copy.durasi_suffix', type: 'text', label: 'Satuan durasi', group: 'Etalase', max: 15, default: 'menit' },

    // ── Footer ──
    { key: 'copy.footer_desc', type: 'text', label: 'Deskripsi singkat (footer)', group: 'Footer', max: 80, default: 'fisioterapi & sport rehabilitation.', hint: 'Dipakai bila konten hero tidak punya eyebrow; dirangkai "Nama — deskripsi".' },
    { key: 'copy.footer_tagline', type: 'text', label: 'Tagline footer', group: 'Footer', max: 80, default: 'Siap gerak bebas tanpa khawatir.' },
    { key: 'copy.footer_kontak_h', type: 'text', label: 'Judul kolom kontak', group: 'Footer', max: 30, default: 'Kontak' },
    { key: 'copy.footer_jam_h', type: 'text', label: 'Judul kolom jam praktik', group: 'Footer', max: 30, default: 'Jam Praktik' },
    { key: 'copy.footer_jam_fallback', type: 'text', label: 'Jam praktik bawaan', group: 'Footer', max: 60, default: 'Senin–Sabtu: 09.00–18.00', hint: 'Dipakai bila profil bisnis belum mengisi jam operasional.' },
    { key: 'copy.footer_copyright', type: 'text', label: 'Teks hak cipta', group: 'Footer', max: 80, default: 'Semua hak cipta dilindungi.' },

    // ── SEO ──
    { key: 'copy.seo_title', type: 'text', label: 'Judul tab browser (SEO)', group: 'SEO', max: 70, default: '', hint: 'Kosong = pakai judul bawaan situs.' },
    { key: 'copy.seo_description', type: 'textarea', label: 'Deskripsi hasil pencarian (SEO)', group: 'SEO', max: 160, default: '' },
  ],
}
