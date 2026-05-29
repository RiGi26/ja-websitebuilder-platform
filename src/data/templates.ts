export interface TemplateDetail {
  id: string
  title: string
  category: string
  tier: 'starter' | 'business' | 'elite'
  description: string
  price: string
  price_numeric: number
  renewal_price: number
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
  recommendedAddons?: string[] // Link ke ID Addons
}

export const templatesData: Record<string, TemplateDetail> = {
  // === TIER STARTER (Rp 499rb - Rp 799rb) ===
  'photo-portfolio': {
    id: 'photo-portfolio', title: 'Fotografer Portfolio', category: 'Portfolio', tier: 'starter',
    description: 'Fokus 100% pada gambar. Layout masonry grid yang indah untuk memamerkan hasil jepretan fotografer atau seniman.',
    price: 'Rp 599.000', price_numeric: 599000, renewal_price: 699000, originalPrice: 'Rp 900.000',
    demoUrl: 'https://portfolio-template.vercel.app', repoUrl: '#',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1200&auto=format&fit=crop', features: ['Galeri Masonry', 'Zoom Image Lightbox', 'Proteksi Klik Kanan', 'Paket Pemotretan'],
    tags: ['Photography', 'Art', 'Gallery'], platform: 'Next.js + Tailwind', pages: '4 Halaman', rating: 4.9, reviewCount: 184,
    recommendedAddons: ['admin', 'seo', 'protection'],
  },
  'personal-blog': {
    id: 'personal-blog', title: 'Personal Blog / Penulis', category: 'Blog', tier: 'starter',
    description: 'Desain minimalis yang berfokus pada tipografi dan keterbacaan. Cocok untuk penulis, jurnalis, atau content creator.',
    price: 'Rp 649.000', price_numeric: 649000, renewal_price: 699000, originalPrice: 'Rp 1.000.000',
    demoUrl: 'https://next-blog-starter.vercel.app', repoUrl: '#',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop', features: ['Artikel & Kategori', 'Komentar Pembaca', 'Newsletter Subscribe', 'Dark/Light Mode'],
    tags: ['Blog', 'Writer', 'Minimalist'], platform: 'Next.js + Markdown', pages: '5 Halaman', rating: 4.6, reviewCount: 56,
    recommendedAddons: ['admin', 'seo', 'newsletter'],
  },

  // === TIER BUSINESS (Rp 899rb - Rp 1.2jt) ===
  'company-pro': {
    id: 'company-pro', title: 'Company Profile Pro', category: 'Korporat', tier: 'business',
    description: 'Desain profesional untuk perusahaan, agensi, atau konsultan. Menampilkan layanan, portofolio, dan tim Anda dengan elegan.',
    price: 'Rp 999.000', price_numeric: 999000, renewal_price: 899000, originalPrice: 'Rp 1.800.000',
    demoUrl: 'https://portfolio-template.vercel.app', repoUrl: '#',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop', features: ['Tentang Kami & Tim', 'Layanan & Portofolio', 'Blog/Berita', 'Form Kontak & Lead Gen'],
    tags: ['Corporate', 'Agency', 'Business'], platform: 'Next.js + Tailwind', pages: '7 Halaman', rating: 4.8, reviewCount: 128,
    recommendedAddons: ['admin', 'seo', 'lang-multi', 'career', 'email-biz'],
  },
  'resto-modern': {
    id: 'resto-modern', title: 'Restoran Modern', category: 'F&B', tier: 'business',
    description: 'Template elegan untuk restoran, kafe, atau rumah makan. Dilengkapi dengan menu digital, galeri foto, dan integrasi reservasi via WhatsApp.',
    price: 'Rp 899.000', price_numeric: 899000, renewal_price: 899000, originalPrice: 'Rp 1.500.000',
    demoUrl: 'https://restaurant-template.vercel.app', repoUrl: '#',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop', features: ['Menu Digital Interaktif', 'Form Reservasi Meja', 'Integrasi Google Maps', 'Mobile Responsive'],
    tags: ['Restaurant', 'Cafe', 'Food'], platform: 'Next.js + Tailwind', pages: '5 Halaman', rating: 5, reviewCount: 42,
    recommendedAddons: ['qr-menu', 'booking', 'wa', 'delivery'],
  },
  'klinik-sehat': {
    id: 'klinik-sehat', title: 'Klinik Medis & Dokter', category: 'Kesehatan', tier: 'business',
    description: 'Template bersih dan terpercaya untuk klinik kesehatan, dokter gigi, atau rumah sakit. Termasuk fitur booking jadwal dokter.',
    price: 'Rp 949.000', price_numeric: 949000, renewal_price: 899000, originalPrice: 'Rp 1.600.000',
    demoUrl: 'https://ui.shadcn.com', repoUrl: '#',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop', features: ['Jadwal Dokter', 'Booking Konsultasi', 'Layanan Medis', 'Testimoni Pasien'],
    tags: ['Health', 'Clinic', 'Doctor'], platform: 'Next.js + Tailwind', pages: '6 Halaman', rating: 4.7, reviewCount: 34,
    recommendedAddons: ['booking', 'wa', 'chat', 'telemedicine'],
  },

  // === TIER ELITE (Rp 1.5jt - Rp 2.5jt) ===
  'toko-online': {
    id: 'toko-online', title: 'Toko Online E-Commerce', category: 'Retail', tier: 'elite',
    description: 'Website toko online lengkap dengan keranjang belanja, integrasi payment gateway lokal, dan penghitungan ongkos kirim.',
    price: 'Rp 1.899.000', price_numeric: 1899000, renewal_price: 1200000, originalPrice: 'Rp 3.500.000',
    demoUrl: 'https://demo.vercel.store', repoUrl: '#',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop', features: ['Katalog Produk & Variasi', 'Shopping Cart', 'Payment Gateway (Midtrans)', 'Dashboard Admin'],
    tags: ['E-Commerce', 'Shop', 'Retail'], platform: 'Next.js + Supabase', pages: '10+ Halaman', rating: 4.9, reviewCount: 85,
    recommendedAddons: ['shop', 'midtrans', 'ongkir', 'katalog-pro', 'wa', 'variant'],
  },
  'lms-edukasi': {
    id: 'lms-edukasi', title: 'LMS Kursus Online', category: 'Edukasi', tier: 'elite',
    description: 'Platform e-learning untuk menjual video kursus online. Termasuk sistem member, progres belajar, dan sertifikat digital.',
    price: 'Rp 2.499.000', price_numeric: 2499000, renewal_price: 1499000, originalPrice: 'Rp 5.000.000',
    demoUrl: 'https://nextjs.org/learn', repoUrl: '#',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1200&auto=format&fit=crop', features: ['Video Player & Progress', 'Membership Area', 'Kuis & Sertifikat', 'Pembayaran Otomatis'],
    tags: ['Course', 'Education', 'LMS'], platform: 'Next.js + PostgreSQL', pages: '15+ Halaman', rating: 5, reviewCount: 215,
    recommendedAddons: ['membership', 'lms', 'cert-auto', 'midtrans', 'live-session'],
  }
}

export const templatesList = Object.values(templatesData)
