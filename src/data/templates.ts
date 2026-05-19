export interface TemplateDetail {
  id: string
  title: string
  category: string
  description: string
  price: string
  originalPrice: string
  demoUrl: string
  repoUrl: string
  image: string
  features: string[]
  tags: string[]
  platform: string
  pages: string
  rating: number
  reviewCount: number
}

export const templatesData: Record<string, TemplateDetail> = {
  // === KATEGORI F&B ===
  'resto-modern': {
    id: 'resto-modern', title: 'Restoran Modern', category: 'F&B',
    description: 'Template elegan untuk restoran, kafe, atau rumah makan. Dilengkapi dengan menu digital, galeri foto, dan integrasi reservasi via WhatsApp.',
    price: 'Rp 899.000', originalPrice: 'Rp 1.500.000',
    demoUrl: 'https://restaurant-template.vercel.app', repoUrl: '#',
    image: '🍽️', features: ['Menu Digital Interaktif', 'Form Reservasi Meja', 'Integrasi Google Maps', 'Mobile Responsive'],
    tags: ['Restaurant', 'Cafe', 'Food'], platform: 'Next.js + Tailwind', pages: '5 Halaman', rating: 5, reviewCount: 42,
  },
  'cafe-minimalis': {
    id: 'cafe-minimalis', title: 'Coffee Shop Minimalis', category: 'F&B',
    description: 'Desain estetik dan bersih khusus untuk kedai kopi kekinian. Cocok untuk menonjolkan biji kopi dan suasana kafe.',
    price: 'Rp 699.000', originalPrice: 'Rp 1.200.000',
    demoUrl: 'https://restaurant-template.vercel.app', repoUrl: '#',
    image: '☕', features: ['Katalog Kopi', 'Cerita Kafe', 'Galeri Instagram', 'Lokasi Cabang'],
    tags: ['Cafe', 'Coffee', 'Minimalist'], platform: 'Next.js + Tailwind', pages: '4 Halaman', rating: 4.8, reviewCount: 89,
  },
  'fine-dining': {
    id: 'fine-dining', title: 'Luxury Fine Dining', category: 'F&B',
    description: 'Tampilan super premium dengan tema gelap (dark mode) untuk restoran bintang lima. Menambah kesan eksklusif.',
    price: 'Rp 999.000', originalPrice: 'Rp 1.800.000',
    demoUrl: 'https://ui.shadcn.com', repoUrl: '#',
    image: '🍷', features: ['Sistem Booking VVIP', 'Menu Eksklusif', 'Video Background', 'Multi-bahasa'],
    tags: ['Luxury', 'Fine Dining', 'Premium'], platform: 'Next.js + Framer Motion', pages: '6 Halaman', rating: 4.9, reviewCount: 24,
  },

  // === KATEGORI KORPORAT ===
  'company-pro': {
    id: 'company-pro', title: 'Company Profile Pro', category: 'Korporat',
    description: 'Desain profesional untuk perusahaan, agensi, atau konsultan. Menampilkan layanan, portofolio, dan tim Anda dengan elegan.',
    price: 'Rp 749.000', originalPrice: 'Rp 1.400.000',
    demoUrl: 'https://portfolio-template.vercel.app', repoUrl: '#',
    image: '🏢', features: ['Tentang Kami & Tim', 'Layanan & Portofolio', 'Blog/Berita', 'Form Kontak & Lead Gen'],
    tags: ['Corporate', 'Agency', 'Business'], platform: 'Next.js + Tailwind', pages: '7 Halaman', rating: 4.8, reviewCount: 128,
  },
  'startup-saas': {
    id: 'startup-saas', title: 'Startup & SaaS', category: 'Korporat',
    description: 'Landing page modern dan dinamis bergaya Silicon Valley. Sangat cocok untuk produk digital atau aplikasi.',
    price: 'Rp 849.000', originalPrice: 'Rp 1.500.000',
    demoUrl: 'https://linear.app', repoUrl: '#',
    image: '🚀', features: ['Tabel Harga', 'Integrasi Analytics', 'Animasi Scroll', 'Testimoni Klien'],
    tags: ['Startup', 'SaaS', 'Tech'], platform: 'Next.js + Tailwind', pages: '5 Halaman', rating: 5, reviewCount: 310,
  },
  'creative-agency': {
    id: 'creative-agency', title: 'Creative Agency', category: 'Korporat',
    description: 'Template nyentrik dan kreatif untuk agensi desain atau marketing. Menampilkan portofolio dengan transisi unik.',
    price: 'Rp 799.000', originalPrice: 'Rp 1.500.000',
    demoUrl: 'https://portfolio-template.vercel.app', repoUrl: '#',
    image: '🎨', features: ['Grid Portofolio 3D', 'Dark Mode Toggle', 'Cursor Custom', 'Form Konsultasi'],
    tags: ['Creative', 'Design', 'Portfolio'], platform: 'Next.js + GSAP', pages: '6 Halaman', rating: 4.7, reviewCount: 65,
  },

  // === KATEGORI RETAIL ===
  'toko-online': {
    id: 'toko-online', title: 'Toko Online E-Commerce', category: 'Retail',
    description: 'Website toko online lengkap dengan keranjang belanja, integrasi payment gateway lokal, dan penghitungan ongkos kirim.',
    price: 'Rp 1.299.000', originalPrice: 'Rp 2.500.000',
    demoUrl: 'https://demo.vercel.store', repoUrl: '#',
    image: '🛍️', features: ['Katalog Produk & Variasi', 'Shopping Cart', 'Payment Gateway (Midtrans)', 'Dashboard Admin'],
    tags: ['E-Commerce', 'Shop', 'Retail'], platform: 'Next.js + Supabase', pages: '10+ Halaman', rating: 4.9, reviewCount: 85,
  },
  'fashion-boutique': {
    id: 'fashion-boutique', title: 'Fashion Boutique', category: 'Retail',
    description: 'Toko online estetik dengan fokus pada foto produk besar. Sangat cocok untuk brand pakaian atau perhiasan.',
    price: 'Rp 899.000', originalPrice: 'Rp 1.800.000',
    demoUrl: 'https://demo.vercel.store', repoUrl: '#',
    image: '👗', features: ['Lookbook', 'Wishlist', 'Zoom Produk', 'Filter Kategori'],
    tags: ['Fashion', 'Apparel', 'Modern'], platform: 'Next.js + Tailwind', pages: '8 Halaman', rating: 4.6, reviewCount: 45,
  },
  'gadget-store': {
    id: 'gadget-store', title: 'Elektronik & Gadget', category: 'Retail',
    description: 'Template e-commerce dengan fitur perbandingan spesifikasi produk dan review. Ideal untuk toko handphone atau komputer.',
    price: 'Rp 1.199.000', originalPrice: 'Rp 2.400.000',
    demoUrl: 'https://demo.vercel.store', repoUrl: '#',
    image: '💻', features: ['Spesifikasi Teknis', 'Flash Sale Timer', 'Kalkulator Cicilan', 'Live Chat'],
    tags: ['Tech', 'Gadget', 'Store'], platform: 'Next.js + PostgreSQL', pages: '12 Halaman', rating: 4.8, reviewCount: 112,
  },

  // === KATEGORI KESEHATAN ===
  'klinik-sehat': {
    id: 'klinik-sehat', title: 'Klinik Medis & Dokter', category: 'Kesehatan',
    description: 'Template bersih dan terpercaya untuk klinik kesehatan, dokter gigi, atau rumah sakit. Termasuk fitur booking jadwal dokter.',
    price: 'Rp 749.000', originalPrice: 'Rp 1.400.000',
    demoUrl: 'https://ui.shadcn.com', repoUrl: '#',
    image: '🏥', features: ['Jadwal Dokter', 'Booking Konsultasi', 'Layanan Medis', 'Testimoni Pasien'],
    tags: ['Health', 'Clinic', 'Doctor'], platform: 'Next.js + Tailwind', pages: '6 Halaman', rating: 4.7, reviewCount: 34,
  },
  'dental-care': {
    id: 'dental-care', title: 'Dental Care Pro', category: 'Kesehatan',
    description: 'Desain ramah anak dan keluarga untuk klinik gigi. Warna cerah yang menenangkan pasien.',
    price: 'Rp 699.000', originalPrice: 'Rp 1.200.000',
    demoUrl: 'https://ui.shadcn.com', repoUrl: '#',
    image: '🦷', features: ['Galeri Before-After', 'Profil Dokter Spesialis', 'FAQ Perawatan', 'Form Pendaftaran'],
    tags: ['Dental', 'Health', 'Family'], platform: 'Next.js + Tailwind', pages: '5 Halaman', rating: 4.9, reviewCount: 56,
  },
  'spa-wellness': {
    id: 'spa-wellness', title: 'Spa & Beauty Wellness', category: 'Kesehatan',
    description: 'Template elegan dan rileks untuk salon kecantikan, spa, atau pijat refleksi.',
    price: 'Rp 749.000', originalPrice: 'Rp 1.400.000',
    demoUrl: 'https://ui.shadcn.com', repoUrl: '#',
    image: '💆', features: ['Katalog Treatment', 'Booking Jam Terapis', 'Harga Paket', 'Galeri Ruangan'],
    tags: ['Spa', 'Beauty', 'Wellness'], platform: 'Next.js + Tailwind', pages: '5 Halaman', rating: 4.8, reviewCount: 77,
  },

  // === KATEGORI EDUKASI ===
  'lms-edukasi': {
    id: 'lms-edukasi', title: 'LMS Kursus Online', category: 'Edukasi',
    description: 'Platform e-learning untuk menjual video kursus online. Termasuk sistem member, progres belajar, dan sertifikat digital.',
    price: 'Rp 1.399.000', originalPrice: 'Rp 3.000.000',
    demoUrl: 'https://nextjs.org/learn', repoUrl: '#',
    image: '🎓', features: ['Video Player & Progress', 'Membership Area', 'Kuis & Sertifikat', 'Pembayaran Otomatis'],
    tags: ['Course', 'Education', 'LMS'], platform: 'Next.js + PostgreSQL', pages: '15+ Halaman', rating: 5, reviewCount: 215,
  },
  'school-portal': {
    id: 'school-portal', title: 'Portal Sekolah Modern', category: 'Edukasi',
    description: 'Website resmi untuk sekolah (SD/SMP/SMA). Menyediakan informasi akademik, berita, dan pendaftaran siswa baru (PPDB).',
    price: 'Rp 899.000', originalPrice: 'Rp 1.800.000',
    demoUrl: 'https://nextjs.org/learn', repoUrl: '#',
    image: '🏫', features: ['Formulir PPDB Online', 'Kalender Akademik', 'Mading Digital', 'Galeri Kegiatan'],
    tags: ['School', 'Academy', 'Portal'], platform: 'Next.js + Tailwind', pages: '8 Halaman', rating: 4.6, reviewCount: 42,
  },
  'bootcamp-tech': {
    id: 'bootcamp-tech', title: 'Tech Bootcamp Academy', category: 'Edukasi',
    description: 'Template gelap beraksen neon untuk tempat kursus coding atau bootcamp teknologi.',
    price: 'Rp 699.000', originalPrice: 'Rp 1.400.000',
    demoUrl: 'https://ui.shadcn.com', repoUrl: '#',
    image: '👨‍💻', features: ['Silabus Kurikulum', 'Profil Mentor', 'Penyaluran Kerja', 'Testimoni Alumni'],
    tags: ['Bootcamp', 'Coding', 'Tech'], platform: 'Next.js + Tailwind', pages: '6 Halaman', rating: 4.8, reviewCount: 93,
  },

  // === KATEGORI BLOG ===
  'personal-blog': {
    id: 'personal-blog', title: 'Personal Blog / Penulis', category: 'Blog',
    description: 'Desain minimalis yang berfokus pada tipografi dan keterbacaan. Cocok untuk penulis, jurnalis, atau content creator.',
    price: 'Rp 599.000', originalPrice: 'Rp 1.000.000',
    demoUrl: 'https://next-blog-starter.vercel.app', repoUrl: '#',
    image: '✍️', features: ['Artikel & Kategori', 'Komentar Pembaca', 'Newsletter Subscribe', 'Dark/Light Mode'],
    tags: ['Blog', 'Writer', 'Minimalist'], platform: 'Next.js + Markdown', pages: '5 Halaman', rating: 4.6, reviewCount: 56,
  },
  'news-magazine': {
    id: 'news-magazine', title: 'Majalah / Portal Berita', category: 'Blog',
    description: 'Template padat informasi untuk portal berita lokal atau majalah gaya hidup. Mendukung banyak penulis.',
    price: 'Rp 799.000', originalPrice: 'Rp 1.500.000',
    demoUrl: 'https://next-blog-starter.vercel.app', repoUrl: '#',
    image: '📰', features: ['Breaking News Ticker', 'Kolom Opini', 'Ruang Iklan/Ads', 'Integrasi Sosial Media'],
    tags: ['News', 'Magazine', 'Portal'], platform: 'Next.js + Headless CMS', pages: '10 Halaman', rating: 4.7, reviewCount: 110,
  },
  'photo-portfolio': {
    id: 'photo-portfolio', title: 'Fotografer Portfolio', category: 'Blog',
    description: 'Fokus 100% pada gambar. Layout masonry grid yang indah untuk memamerkan hasil jepretan fotografer atau seniman.',
    price: 'Rp 499.000', originalPrice: 'Rp 900.000',
    demoUrl: 'https://portfolio-template.vercel.app', repoUrl: '#',
    image: '📷', features: ['Galeri Masonry', 'Zoom Image Lightbox', 'Proteksi Klik Kanan', 'Paket Pemotretan'],
    tags: ['Photography', 'Art', 'Gallery'], platform: 'Next.js + Tailwind', pages: '4 Halaman', rating: 4.9, reviewCount: 184,
  }
}

export const templatesList = Object.values(templatesData)
