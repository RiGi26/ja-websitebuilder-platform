// ============================================================
// THEME SYSTEM — Konten contoh per sub-kategori (UAT preview).
// Dipakai /admin/theme-preview untuk merender tiap gaya dengan
// ComposableRenderer ASLI memakai konten realistis — supaya UAT bisa
// menilai tampilan tema persis seperti situs jadi (bukan mockup brief form).
//
// MURNI data. Tidak menyentuh jalur render produksi. Foto = Unsplash
// (terverifikasi 200) agar hero fullbleed + lookbook fashion tampil hidup.
// ============================================================
import type { ComposableContent } from './manifest'

const IMG = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`

// ── Kuliner (pempek — kasus nyata pemicu Theme System) ─────────
const KULINER: ComposableContent = {
  nama: 'Pempek RIGIZAF',
  hero: {
    eyebrow: 'Kuliner Khas Palembang',
    title: 'Pempek Homemade Asli Palembang',
    subtitle:
      'Dibuat segar tiap hari dari ikan tenggiri pilihan, dengan cuko racikan turun-temurun yang nampol.',
    ctaText: 'Pesan via WhatsApp',
    ctaHref: '#wa',
    image: IMG('photo-1565299624946-b28f40a0ae38'),
  },
  features: [
    { title: 'Homemade Harian', desc: 'Diproduksi segar setiap pagi, bukan stok lama.' },
    { title: 'Cuko Turun-temurun', desc: 'Racikan khas Palembang yang pedas-manis pas.' },
    { title: 'Vacuum & Frozen', desc: 'Tahan 1 bulan, aman dikirim ke seluruh Indonesia.' },
  ],
  showcase: {
    title: 'Menu Andalan',
    subtitle: 'Favorit pelanggan, dibuat dari resep keluarga.',
    items: [
      { nama: 'Pempek Kapal Selam', harga: 15000, desc: 'Telur ayam utuh di dalam, gurih melimpah.', gambar: IMG('photo-1567620905732-2d1ec7ab7445', 800) },
      { nama: 'Pempek Lenjer Besar', harga: 28000, desc: 'Padat kenyal, porsi puas untuk berbagi.', gambar: IMG('photo-1504674900247-0877df9cc836', 800) },
      { nama: 'Paket Campur 1/2 Kg + Cuko', harga: 55000, desc: 'Aneka pempek lengkap dengan cuko botol.', gambar: IMG('photo-1551024506-0bccd828d307', 800) },
    ],
  },
  about: {
    title: 'Cita Rasa Wong Kito',
    body: 'Sejak 2015 kami menjaga resep keluarga: ikan tenggiri segar, sagu pilihan, dan cuko yang diracik tangan. Ribuan pelanggan dari Sabang sampai Merauke sudah mencicipi.',
  },
  cta: {
    title: 'Lapar Pempek Asli?',
    subtitle: 'Pesan sekarang, kami kirim segar ke alamat Anda.',
    ctaText: 'Order via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@pempekrigizaf.id', alamat: 'Palembang, Sumatera Selatan' },
}

// ── Fashion (label busana — lookbook editorial) ────────────────
const FASHION: ComposableContent = {
  nama: 'ARNA Label',
  hero: {
    eyebrow: 'Koleksi Musim Ini',
    title: 'Busana yang Bicara Tanpa Suara',
    subtitle:
      'Potongan modern, bahan premium, dijahit terbatas. Untuk mereka yang tahu detail adalah segalanya.',
    ctaText: 'Lihat Koleksi',
    ctaHref: '#koleksi',
    image: IMG('photo-1490481651871-ab68de25d43d'),
  },
  features: [
    { title: 'Edisi Terbatas', desc: 'Tiap koleksi diproduksi dalam jumlah kecil — tak pasaran.' },
    { title: 'Bahan Premium', desc: 'Katun combed, linen, dan tenun pilihan yang nyaman seharian.' },
    { title: 'Custom Fit', desc: 'Tersedia penyesuaian ukuran agar pas di badan Anda.' },
  ],
  showcase: {
    title: 'Lookbook',
    subtitle: 'Koleksi unggulan musim ini.',
    items: [
      { nama: 'The Charcoal Set', harga: 450000, desc: 'Setelan monokrom, siluet tegas.', gambar: IMG('photo-1490481651871-ab68de25d43d', 900) },
      { nama: 'Linen Overshirt', harga: 320000, desc: 'Ringan, jatuh sempurna.', gambar: IMG('photo-1539109136881-3be0616acf4b', 900) },
      { nama: 'Essential Tee', harga: 180000, desc: 'Basic yang tak pernah salah.', gambar: IMG('photo-1521572163474-6864f9cf17ab', 900) },
      { nama: 'Tailored Trousers', harga: 380000, desc: 'Potongan rapi, nyaman bergerak.', gambar: IMG('photo-1483985988355-763728e1935b', 900) },
    ],
  },
  about: {
    title: 'Tentang ARNA',
    body: 'Kami percaya pakaian terbaik adalah yang tak berteriak. Setiap jahitan dikerjakan perajin lokal, setiap bahan dipilih untuk bertahan bertahun-tahun — bukan satu musim.',
  },
  cta: {
    title: 'Temukan Gayamu',
    subtitle: 'Koleksi terbatas — sekali habis, tak diproduksi ulang.',
    ctaText: 'Belanja Sekarang',
    ctaHref: '#koleksi',
  },
  contact: { wa: '6281296917963', email: 'hello@arnalabel.com', alamat: 'Bandung, Jawa Barat' },
}

// Sub-kategori → konten contoh. Tema diturunkan dari prefix id (mis.
// 'fashion-editorial' → 'fashion').
const BY_SUBKATEGORI: Record<string, ComposableContent> = {
  kuliner: KULINER,
  fashion: FASHION,
}

export function sampleContentForTheme(themeId: string): ComposableContent {
  const sub = themeId.split('-')[0]
  return BY_SUBKATEGORI[sub] ?? KULINER
}
