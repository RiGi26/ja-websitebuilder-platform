export type WarmCommerceCategory = 'Semua' | 'Makanan' | 'Camilan' | 'Minuman' | 'Paket'

export type WarmCommerceProduct = {
  id: string
  name: string
  category: Exclude<WarmCommerceCategory, 'Semua'>
  description: string
  price: number
  image: string
  imageAlt: string
  featured?: boolean
}
export const warmCommerceMetadata = {
  slug: 'warm-commerce',
  name: 'Warm Commerce',
  category: 'Kuliner',
  status: 'Preview' as const,
  summary:
    'Template hangat untuk bisnis kuliner yang ingin menampilkan katalog dan menerima pesanan lewat WhatsApp.',
  capabilities: ['Katalog', 'WhatsApp', 'Lokasi'],
  businessTypes: [
    'Bakery',
    'Catering',
    'Frozen food',
    'Dessert',
    'Restaurant',
    'Home food business',
  ],
  intents: ['Tampilkan katalog', 'Terima inquiry', 'Terima pesanan'],
  included: [
    'Homepage',
    'Menu / katalog',
    'Bagian produk',
    'Promo',
    'Tentang bisnis',
    'CTA WhatsApp',
    'Lokasi',
    'Responsive',
    'SEO dasar',
  ],
  optional: [
    'Order management',
    'Stock',
    'Database pelanggan',
    'Admin dashboard',
    'Membership',
    'Payment',
  ],
  baseRecommendation: 'Website',
  upgradeRecommendation: 'Website + Portal',
}

export const dapurRona = {
  brand: 'Dapur Rona',
  tagline: 'Masakan rumahan dan camilan yang dibuat fresh untuk menemani hari kamu.',
  eyebrow: 'Dibuat fresh setiap hari',
  headline: 'Rasa rumahan, dibuat untuk dinikmati.',
  heroCopy:
    'Menu hangat, camilan renyah, dan paket praktis untuk makan siang sampai kumpul sore.',
  address: 'Lokasi contoh · Ciputat, Tangerang Selatan',
  hours: ['Senin–Jumat · 09.00–19.00', 'Sabtu–Minggu · 08.00–18.00'],
  socialLabel: '@dapur.rona.demo',
  heroImage: '/images/store/warm-commerce/dapur-rona-spread.webp',
}

export const warmCommerceCategories: WarmCommerceCategory[] = [
  'Semua',
  'Makanan',
  'Camilan',
  'Minuman',
  'Paket',
]
export const warmCommerceProducts: WarmCommerceProduct[] = [
  {
    id: 'pempek-kapal-selam',
    name: 'Pempek Kapal Selam',
    category: 'Makanan',
    description: 'Pempek ikan dengan telur, timun segar, dan cuko racikan Dapur Rona.',
    price: 28000,
    image: '/images/store/warm-commerce/pempek-kapal-selam.webp',
    imageAlt: 'Pempek kapal selam dengan cuko dan potongan timun',
    featured: true,
  },
  {
    id: 'pastel-ayam-rempah',
    name: 'Pastel Ayam Rempah',
    category: 'Camilan',
    description: 'Kulit renyah dengan isian ayam, sayur, dan bihun berbumbu hangat.',
    price: 9000,
    image: '/images/store/warm-commerce/pastel-ayam.webp',
    imageAlt: 'Pastel ayam renyah dengan satu pastel terbuka memperlihatkan isi',
  },
  {
    id: 'nasi-ayam-kemangi',
    name: 'Nasi Ayam Kemangi',
    category: 'Makanan',
    description: 'Ayam suwir gurih, kemangi, sambal, dan nasi hangat dalam satu mangkuk.',
    price: 32000,
    image: '/images/store/warm-commerce/nasi-ayam-kemangi.webp',
    imageAlt: 'Nasi ayam suwir kemangi dengan sambal dan irisan timun',
  },
  {
    id: 'es-teh-jeruk',
    name: 'Es Teh Jeruk',
    category: 'Minuman',
    description: 'Teh dingin dengan irisan jeruk segar, ringan untuk menemani menu gurih.',
    price: 12000,
    image: '/images/store/warm-commerce/dapur-rona-spread.webp',
    imageAlt: 'Es teh jeruk di meja makan bersama hidangan Dapur Rona',
  },
  {
    id: 'paket-rona-sore',
    name: 'Paket Rona Sore',
    category: 'Paket',
    description: 'Dua pempek kapal selam, empat pastel ayam, dan dua es teh jeruk.',
    price: 85000,
    image: '/images/store/warm-commerce/dapur-rona-spread.webp',
    imageAlt: 'Paket hidangan pempek, pastel, dan es teh jeruk di meja hangat',
  },
]
