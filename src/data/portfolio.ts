export interface ProjectResult {
  metric: string
  description: string
}

export interface ProjectScreenshot {
  title: string
  description: string
}

export interface ProjectTestimonial {
  quote: string
  author: string
  role: string
  company: string
  avatar: string
}

export interface ProjectDetail {
  id: number
  title: string
  category: string
  year: string
  duration: string
  liveUrl: string
  image: string
  color: string
  size: 'small' | 'medium' | 'large'
  tags: string[]
  challenge: string
  solution: string
  results: ProjectResult[]
  screenshots: ProjectScreenshot[]
  testimonial: ProjectTestimonial
  badge?: string
}

export const projectsData: Record<string, ProjectDetail> = {

  // ─── 1. E-COMMERCE — Toko Online Fashion ──────────────────────────────────
  '1': {
    id: 1,
    title: 'Batik Warisan Store',
    category: 'Retail',
    badge: 'Concept Demo — E-Commerce',
    year: '2025',
    duration: '12 hari',
    liveUrl: '#',
    image: '👗',
    color: 'from-amber-100 to-orange-100',
    size: 'large',
    tags: ['Next.js', 'Supabase', 'Midtrans', 'Admin Dashboard'],
    challenge: 'Brand batik premium lokal ingin menjangkau pasar nasional secara digital. Website lama berbasis WordPress mereka lambat, sering eror saat checkout, dan tampilannya tidak merepresentasikan kesan premium produk.',
    solution: 'Kami membangun toko online modern dengan Next.js + Supabase. Sistem manajemen produk berbasis drag-and-drop, halaman checkout yang terintegrasi dengan Midtrans (transfer bank, QRIS, kartu kredit), serta dashboard admin real-time untuk memantau stok dan pesanan.',
    results: [
      { metric: '+240% Penjualan', description: 'Kenaikan omzet dalam 90 hari pertama setelah launch' },
      { metric: '< 1.5 detik', description: 'Waktu loading halaman produk di jaringan 4G' },
      { metric: '0% Downtime', description: 'Server stabil selama event Harbolnas & Lebaran' },
    ],
    screenshots: [
      { title: 'Halaman Produk', description: 'Grid produk dengan filter koleksi, ukuran & harga' },
      { title: 'Checkout', description: 'Proses checkout 3 langkah yang bersih dan cepat' },
      { title: 'Dashboard Admin', description: 'Pantau stok, pesanan masuk, dan revenue harian' },
      { title: 'Mobile View', description: 'Tampilan sempurna di smartphone' },
    ],
    testimonial: {
      quote: 'Tim Japan Arena Studio benar-benar paham kebutuhan bisnis fashion. Sistemnya sangat mudah dikelola, bahkan staf toko saya yang awam teknologi pun bisa update stok sendiri.',
      author: 'Riana Putri', role: 'Founder & CEO', company: 'Batik Warisan Store', avatar: 'RP',
    },
  },

  // ─── 2. KLINIK / KESEHATAN ────────────────────────────────────────────────
  '2': {
    id: 2,
    title: 'Klinik Mitra Sehat',
    category: 'Kesehatan',
    badge: 'Concept Demo — Klinik',
    year: '2025',
    duration: '10 hari',
    liveUrl: '#',
    image: '🏥',
    color: 'from-teal-100 to-cyan-100',
    size: 'small',
    tags: ['Next.js', 'Booking System', 'WhatsApp API', 'SEO Local'],
    challenge: 'Klinik umum dengan 4 dokter spesialis kesulitan mengatur antrean dan sering terjadi double-booking jadwal. Pasien juga banyak yang bertanya via WA manual sehingga admin kewalahan.',
    solution: 'Portal klinik dengan sistem booking jadwal dokter real-time. Pasien bisa memilih dokter, jam, dan layanan secara mandiri. Konfirmasi otomatis dikirim via WhatsApp API sehingga admin tidak perlu membalas chat satu per satu.',
    results: [
      { metric: '-65% Antrean', description: 'Penurunan waktu tunggu pasien di loket' },
      { metric: '+180 Booking/bulan', description: 'Pendaftaran online dalam bulan pertama' },
      { metric: '4.9 / 5.0', description: 'Rating kepuasan pasien di Google Review' },
    ],
    screenshots: [
      { title: 'Halaman Utama', description: 'Layanan, jadwal dokter, dan CTA booking yang menonjol' },
      { title: 'Booking System', description: 'Pilih dokter → Pilih tanggal & jam → Isi data diri → Konfirmasi WA' },
    ],
    testimonial: {
      quote: 'Sebelumnya admin kami kerja lembur setiap hari hanya untuk balas chat WhatsApp. Sekarang sistem bekerja otomatis, dan kami bisa fokus ke pelayanan pasien.',
      author: 'dr. Ahmad Fauzi', role: 'Direktur Operasional', company: 'Klinik Mitra Sehat', avatar: 'AF',
    },
  },

  // ─── 3. COMPANY PROFILE KORPORAT ──────────────────────────────────────────
  '3': {
    id: 3,
    title: 'PT. Garuda Konstruksi',
    category: 'Korporat',
    badge: 'Concept Demo — Company Profile',
    year: '2025',
    duration: '8 hari',
    liveUrl: '#',
    image: '🏗️',
    color: 'from-slate-100 to-blue-100',
    size: 'medium',
    tags: ['Next.js', 'Framer Motion', 'SEO', 'Form Lead Gen'],
    challenge: 'Perusahaan kontraktor berusia 15 tahun dengan portofolio proyek senilai ratusan miliar belum memiliki website yang merepresentasikan skala bisnis mereka. Klien korporat yang mereka targetkan mempertanyakan kredibilitas saat tidak bisa menemukan profil perusahaan di Google.',
    solution: 'Website company profile premium dengan animasi scroll yang halus (Framer Motion), halaman portofolio proyek yang detail, profil tim manajemen, dan form pengajuan penawaran yang terhubung langsung ke email direksi.',
    results: [
      { metric: '+3 Tender Baru', description: 'Proyek pemerintah yang berhasil didapatkan dalam 2 bulan' },
      { metric: 'Page 1 Google', description: 'Ranking untuk kata kunci "kontraktor Jakarta" dalam 6 minggu' },
      { metric: '12 Lead Masuk', description: 'Permintaan penawaran via form dalam bulan pertama' },
    ],
    screenshots: [
      { title: 'Hero Section', description: 'Animasi counter statistik perusahaan yang bergerak saat di-scroll' },
      { title: 'Portofolio Proyek', description: 'Grid foto proyek yang bisa difilter berdasarkan jenis pekerjaan' },
      { title: 'Tim Manajemen', description: 'Profil foto dan latar belakang direksi' },
      { title: 'Form Penawaran', description: 'Form inquiry yang langsung dikirim ke email direksi' },
    ],
    testimonial: {
      quote: 'Investasi terbaik yang pernah kami lakukan. Dalam 2 bulan kami berhasil memenangkan 3 tender baru karena klien sudah percaya sebelum bertemu langsung.',
      author: 'Hendra Gunawan', role: 'Direktur Utama', company: 'PT. Garuda Konstruksi', avatar: 'HG',
    },
  },

  // ─── 4. F&B — KAFE ─────────────────────────────────────────────────────────
  '4': {
    id: 4,
    title: 'Kopi Senja Roastery',
    category: 'F&B',
    badge: 'Concept Demo — Kafe & Restoran',
    year: '2025',
    duration: '7 hari',
    liveUrl: '#',
    image: '☕',
    color: 'from-yellow-100 to-amber-100',
    size: 'small',
    tags: ['Next.js', 'Tailwind', 'Google Maps API', 'Instagram Feed'],
    challenge: 'Coffee shop estetik dengan 2 cabang di Bandung ingin meningkatkan kehadiran digital. Banyak pelanggan Gen-Z yang mengatakan tidak tahu lokasi dan menu terbaru kafe mereka karena informasinya tersebar tidak konsisten di berbagai platform.',
    solution: 'Website kafe yang berfokus pada visual dan user experience. Halaman menu digital yang bisa diupdate mandiri, integrasi otomatis feed Instagram terbaru, peta lokasi 2 cabang, dan sistem reservasi meja via WhatsApp.',
    results: [
      { metric: '+400% Reach', description: 'Jangkauan audiens baru dari pencarian Google Maps' },
      { metric: '50+ Reservasi/minggu', description: 'Booking meja baru melalui website sejak minggu pertama' },
      { metric: '95% Mobile Score', description: 'Skor Google PageSpeed di perangkat mobile' },
    ],
    screenshots: [
      { title: 'Hero Visual', description: 'Foto kafe full-screen dengan animasi parallax yang memukau' },
      { title: 'Menu Digital', description: 'Katalog menu dengan kategori dan foto produk beresolusi tinggi' },
    ],
    testimonial: {
      quote: 'Website ini akhirnya bisa merepresentasikan vibe kafe kami dengan sempurna. Banyak pelanggan bilang mereka jatuh cinta duluan sebelum datang.',
      author: 'Aditya Pramana', role: 'Co-Founder', company: 'Kopi Senja Roastery', avatar: 'AP',
    },
  },

  // ─── 5. LMS / E-LEARNING ───────────────────────────────────────────────────
  '5': {
    id: 5,
    title: 'Academia Cerdas',
    category: 'Edukasi',
    badge: 'Concept Demo — LMS Platform',
    year: '2025',
    duration: '21 hari',
    liveUrl: '#',
    image: '🎓',
    color: 'from-violet-100 to-purple-100',
    size: 'medium',
    tags: ['Next.js', 'Supabase', 'Midtrans', 'Video Streaming', 'Sertifikat Digital'],
    challenge: 'Lembaga kursus bahasa Jepang yang sebelumnya 100% offline ingin berekspansi ke model online. Mereka membutuhkan platform yang bisa menjual kursus video, melacak progres murid, dan menerbitkan sertifikat digital.',
    solution: 'Platform LMS (Learning Management System) lengkap: sistem pembayaran kursus terintegrasi Midtrans, video player dengan pelacak progres per-bab, kuis interaktif di akhir setiap modul, dan generator sertifikat digital yang bisa diunduh otomatis setelah kelulusan.',
    results: [
      { metric: '350+ Murid Aktif', description: 'Pendaftar kursus dalam 3 bulan pertama' },
      { metric: 'Rp 87 Juta', description: 'Total revenue dari penjualan kursus online di bulan pertama' },
      { metric: '4.8/5.0', description: 'Rating kepuasan murid berdasarkan survei pasca-kursus' },
    ],
    screenshots: [
      { title: 'Dashboard Murid', description: 'Pantau progres belajar, kursus aktif, dan sertifikat' },
      { title: 'Video Player', description: 'Player dengan catatan timestamp dan progress bar per bab' },
      { title: 'Kuis Interaktif', description: 'Kuis pilihan ganda di akhir setiap modul dengan skor langsung' },
      { title: 'Sertifikat Digital', description: 'Auto-generate PDF sertifikat dengan nama murid dan QR code verifikasi' },
    ],
    testimonial: {
      quote: 'Kami bisa mencapai 350 murid dalam 3 bulan tanpa modal sewa gedung sama sekali. Platform ini mengubah total model bisnis kami menjadi jauh lebih scalable.',
      author: 'Sensei Yuki', role: 'Founder', company: 'Academia Cerdas', avatar: 'YK',
    },
  },

  // ─── 6. SPA & WELLNESS ────────────────────────────────────────────────────
  '6': {
    id: 6,
    title: 'Zenspa Wellness',
    category: 'Kesehatan',
    badge: 'Concept Demo — Spa & Beauty',
    year: '2024',
    duration: '9 hari',
    liveUrl: '#',
    image: '💆',
    color: 'from-pink-100 to-rose-100',
    size: 'large',
    tags: ['Next.js', 'Booking Calendar', 'Membership', 'WhatsApp Notif'],
    challenge: 'Spa premium dengan 8 terapis sering mengalami bentrok jadwal dan pembatalan mendadak yang merugikan. Sistem booking manual via WhatsApp sangat tidak efisien dan berpotensi menyebabkan konflik antar terapis.',
    solution: 'Website elegan dengan sistem booking terapis berbasis kalender real-time. Klien bisa melihat ketersediaan setiap terapis, memilih treatment, dan melakukan booking mandiri. Pengingat otomatis dikirim 24 jam dan 1 jam sebelum sesi via WhatsApp.',
    results: [
      { metric: '-72% No-Show', description: 'Pengurangan pembatalan mendadak sejak sistem notif otomatis aktif' },
      { metric: '+420 Member', description: 'Pendaftaran kartu member baru dalam 3 bulan' },
      { metric: '4.9/5.0', description: 'Skor kepuasan booking di ulasan Google' },
    ],
    screenshots: [
      { title: 'Katalog Treatment', description: 'Visual mewah untuk setiap paket layanan spa' },
      { title: 'Booking Terapis', description: 'Kalender interaktif dengan slot waktu tersedia per terapis' },
    ],
    testimonial: {
      quote: 'Sejak pakai sistem ini, tidak ada lagi drama jadwal terapis bentrok. Revenue kami naik 40% karena slot yang tadinya kosong akibat no-show sekarang terisi kembali otomatis.',
      author: 'Melati Sari', role: 'Owner', company: 'Zenspa Wellness', avatar: 'MS',
    },
  },

  // ─── 7. STARTUP / SAAS LANDING PAGE ──────────────────────────────────────
  '7': {
    id: 7,
    title: 'PayKu — Fintech Startup',
    category: 'Korporat',
    badge: 'Concept Demo — Startup Landing',
    year: '2025',
    duration: '6 hari',
    liveUrl: '#',
    image: '🚀',
    color: 'from-indigo-100 to-blue-100',
    size: 'small',
    tags: ['Next.js', 'Framer Motion', 'Analytics', 'A/B Testing'],
    challenge: 'Startup fintech yang baru keluar dari program inkubator membutuhkan landing page yang bisa meyakinkan investor dan early adopter. Mereka memiliki deadline presentasi ke VC hanya dalam 2 minggu.',
    solution: 'High-converting landing page dengan desain bergaya Silicon Valley: animasi scroll yang dramatis, tabel perbandingan fitur vs kompetitor, testimoni pengguna beta, seksi FAQ yang lengkap, dan form waitlist terintegrasi Google Sheets.',
    results: [
      { metric: '2.800+ Waitlist', description: 'Pengguna mendaftar antrian beta dalam 1 bulan' },
      { metric: '18% Conversion', description: 'Tingkat konversi pengunjung → pendaftar waitlist' },
      { metric: 'Funded ✅', description: 'Berhasil mendapatkan seed funding setelah demo landing page ke VC' },
    ],
    screenshots: [
      { title: 'Hero Section', description: 'Headline tajam dengan animasi product mockup yang bergerak' },
      { title: 'Fitur & Benefit', description: 'Showcase fitur dengan ikon animasi dan deskripsi singkat' },
      { title: 'Waitlist Form', description: 'Form pendaftaran dengan counter pengguna yang sudah daftar (social proof)' },
    ],
    testimonial: {
      quote: 'Landing page dari Japan Arena Studio bukan sekadar cantik — dia bekerja. Investor kami bilang website kami terlihat lebih matang dari startup yang sudah Series A.',
      author: 'Farid Nugroho', role: 'CEO & Co-Founder', company: 'PayKu', avatar: 'FN',
    },
  },

  // ─── 8. PORTAL SEKOLAH ────────────────────────────────────────────────────
  '8': {
    id: 8,
    title: 'SMA Nusantara Digital',
    category: 'Edukasi',
    badge: 'Concept Demo — Portal Sekolah',
    year: '2024',
    duration: '14 hari',
    liveUrl: '#',
    image: '🏫',
    color: 'from-green-100 to-emerald-100',
    size: 'medium',
    tags: ['Next.js', 'PPDB Online', 'Kalender Akademik', 'Mading Digital'],
    challenge: 'Sekolah menengah negeri favorit dengan 1.200+ siswa masih mengelola informasi akademik, pengumuman, dan penerimaan siswa baru (PPDB) secara manual via papan pengumuman fisik dan grup WhatsApp yang tidak teratur.',
    solution: 'Portal sekolah resmi yang modern: sistem PPDB online dengan formulir digital dan status pendaftaran real-time, kalender akademik interaktif, mading digital untuk pengumuman resmi, dan galeri kegiatan siswa yang dikelola oleh tim OSIS.',
    results: [
      { metric: '1.400+ Pendaftar PPDB', description: 'Pendaftaran online tanpa antrean fisik di tahun pertama' },
      { metric: '-90% Panggilan Masuk', description: 'Berkurangnya telepon ke TU karena info sudah tersedia online' },
      { metric: '2 Penghargaan', description: 'Juara 1 Lomba Website Sekolah tingkat Kota & Provinsi' },
    ],
    screenshots: [
      { title: 'Halaman Utama', description: 'Profil sekolah, statistik, dan akses cepat ke layanan utama' },
      { title: 'Form PPDB Online', description: 'Pendaftaran siswa baru dengan upload dokumen digital' },
      { title: 'Kalender Akademik', description: 'Jadwal kegiatan, ujian, dan libur sekolah secara interaktif' },
    ],
    testimonial: {
      quote: 'Orang tua siswa baru sangat terbantu dengan sistem PPDB online ini. Mereka tidak perlu datang jauh-jauh hanya untuk ambil formulir. Ini adalah lompatan digital yang nyata untuk sekolah kami.',
      author: 'Bpk. Supriyanto, M.Pd', role: 'Kepala Sekolah', company: 'SMA Nusantara Digital', avatar: 'SP',
    },
  },
}

// Derived array for the listing page
export const projectsList = Object.values(projectsData).map((p) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  badge: p.badge,
  image: p.image,
  color: p.color,
  size: p.size,
}))
