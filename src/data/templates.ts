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
  'resto-modern': {
    id: 'resto-modern',
    title: 'Restoran Modern',
    category: 'F&B',
    description: 'Template elegan untuk restoran, kafe, atau rumah makan. Dilengkapi dengan menu digital, galeri foto, dan integrasi reservasi via WhatsApp.',
    price: 'Rp 2.500.000',
    originalPrice: 'Rp 3.500.000',
    demoUrl: 'https://demo-resto.vercel.app',
    repoUrl: 'https://github.com/vercel/nextjs-restaurant-starter',
    image: '🍽️',
    features: ['Menu Digital Interaktif', 'Form Reservasi Meja', 'Integrasi Google Maps', 'Mobile Responsive'],
    tags: ['Restaurant', 'Cafe', 'Food'],
    platform: 'Next.js + Tailwind',
    pages: '5 Halaman',
    rating: 5,
    reviewCount: 42,
  },
  'company-pro': {
    id: 'company-pro',
    title: 'Company Profile Pro',
    category: 'Korporat',
    description: 'Desain profesional untuk perusahaan, agensi, atau konsultan. Menampilkan layanan, portofolio, dan tim Anda dengan elegan.',
    price: 'Rp 3.000.000',
    originalPrice: 'Rp 4.000.000',
    demoUrl: 'https://demo-company.vercel.app',
    repoUrl: 'https://github.com/vercel/nextjs-portfolio-starter',
    image: '🏢',
    features: ['Tentang Kami & Tim', 'Layanan & Portofolio', 'Blog/Berita', 'Form Kontak & Lead Gen'],
    tags: ['Corporate', 'Agency', 'Business'],
    platform: 'Next.js + Tailwind',
    pages: '7 Halaman',
    rating: 4.8,
    reviewCount: 128,
  },
  'toko-online': {
    id: 'toko-online',
    title: 'Toko Online E-Commerce',
    category: 'Retail',
    description: 'Website toko online lengkap dengan keranjang belanja, integrasi payment gateway lokal, dan penghitungan ongkos kirim.',
    price: 'Rp 5.500.000',
    originalPrice: 'Rp 7.000.000',
    demoUrl: 'https://demo-ecommerce.vercel.app',
    repoUrl: 'https://github.com/vercel/commerce',
    image: '🛍️',
    features: ['Katalog Produk & Variasi', 'Shopping Cart', 'Payment Gateway (Midtrans)', 'Dashboard Admin'],
    tags: ['E-Commerce', 'Shop', 'Retail'],
    platform: 'Next.js + Supabase',
    pages: '10+ Halaman',
    rating: 4.9,
    reviewCount: 85,
  },
  'klinik-sehat': {
    id: 'klinik-sehat',
    title: 'Klinik Medis & Dokter',
    category: 'Kesehatan',
    description: 'Template bersih dan terpercaya untuk klinik kesehatan, dokter gigi, atau rumah sakit. Termasuk fitur booking jadwal dokter.',
    price: 'Rp 3.500.000',
    originalPrice: 'Rp 4.500.000',
    demoUrl: 'https://demo-clinic.vercel.app',
    repoUrl: 'https://github.com/vercel/nextjs-clinic-starter',
    image: '🏥',
    features: ['Jadwal Dokter', 'Booking Konsultasi', 'Layanan Medis', 'Testimoni Pasien'],
    tags: ['Health', 'Clinic', 'Doctor'],
    platform: 'Next.js + Tailwind',
    pages: '6 Halaman',
    rating: 4.7,
    reviewCount: 34,
  },
  'lms-edukasi': {
    id: 'lms-edukasi',
    title: 'LMS Kursus Online',
    category: 'Edukasi',
    description: 'Platform e-learning untuk menjual video kursus online. Termasuk sistem member, progres belajar, dan sertifikat digital.',
    price: 'Rp 7.500.000',
    originalPrice: 'Rp 10.000.000',
    demoUrl: 'https://demo-lms.vercel.app',
    repoUrl: 'https://github.com/vercel/nextjs-lms-starter',
    image: '🎓',
    features: ['Video Player & Progress', 'Membership Area', 'Kuis & Sertifikat', 'Pembayaran Otomatis'],
    tags: ['Course', 'Education', 'LMS'],
    platform: 'Next.js + PostgreSQL',
    pages: '15+ Halaman',
    rating: 5,
    reviewCount: 215,
  },
  'personal-blog': {
    id: 'personal-blog',
    title: 'Personal Blog / Penulis',
    category: 'Blog',
    description: 'Desain minimalis yang berfokus pada tipografi dan keterbacaan. Cocok untuk penulis, jurnalis, atau content creator.',
    price: 'Rp 1.500.000',
    originalPrice: 'Rp 2.000.000',
    demoUrl: 'https://demo-blog.vercel.app',
    repoUrl: 'https://github.com/vercel/nextjs-blog-starter',
    image: '✍️',
    features: ['Artikel & Kategori', 'Komentar Pembaca', 'Newsletter Subscribe', 'Dark/Light Mode'],
    tags: ['Blog', 'Writer', 'Minimalist'],
    platform: 'Next.js + Markdown',
    pages: '5 Halaman',
    rating: 4.6,
    reviewCount: 56,
  }
}

export const templatesList = Object.values(templatesData)
