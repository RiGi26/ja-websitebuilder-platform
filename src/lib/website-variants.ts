// ============================================================
// Website variant definitions per industri.
// Variant = gaya visual (layout + palet + tipografi).
// Konten tetap dari DB — hanya tampilan yang berbeda.
// ============================================================

export interface VariantOption {
  id: string
  nama: string
  deskripsi: string
  emoji: string
  mood: string // warna preview swatch (hex)
  bg: 'dark' | 'light' | 'warm'
}

export const INDUSTRY_VARIANTS: Record<string, VariantOption[]> = {
  klinik: [
    {
      id: 'warm',
      nama: 'Warm Sanctuary',
      deskripsi: 'Hangat, personal, sage green. Seperti klinik wellness premium.',
      emoji: '🌿',
      mood: '#2D6A4F',
      bg: 'dark',
    },
    {
      id: 'clean',
      nama: 'Clean Modern',
      deskripsi: 'Bersih, putih, modern. Terasa seperti rumah sakit internasional.',
      emoji: '🏥',
      mood: '#0EA5E9',
      bg: 'light',
    },
    {
      id: 'premium',
      nama: 'Premium Clinic',
      deskripsi: 'Elegan, dark navy, luxury. Untuk klinik estetik & premium.',
      emoji: '✨',
      mood: '#1E3A5F',
      bg: 'dark',
    },
  ],
  travel: [
    {
      id: 'bold',
      nama: 'Bold Drive',
      deskripsi: 'Energik, orange, berani. Cocok untuk rental aktif & dinamis.',
      emoji: '🔥',
      mood: '#EA580C',
      bg: 'dark',
    },
    {
      id: 'fresh',
      nama: 'Fresh & Light',
      deskripsi: 'Bersih, terang, mudah dibaca. Accessible untuk semua usia.',
      emoji: '☀️',
      mood: '#0284C7',
      bg: 'light',
    },
    {
      id: 'luxury',
      nama: 'Luxury Fleet',
      deskripsi: 'Premium, dark charcoal, eksklusif. Untuk rental kelas atas.',
      emoji: '🖤',
      mood: '#1C1917',
      bg: 'dark',
    },
  ],
  corporate: [
    {
      id: 'editorial',
      nama: 'Bold Editorial',
      deskripsi: 'Grafis kuat, dark, agency feel. Untuk agensi & startup.',
      emoji: '⚡',
      mood: '#1D4ED8',
      bg: 'dark',
    },
    {
      id: 'clean',
      nama: 'Clean Professional',
      deskripsi: 'Bersih, light, terpercaya. Untuk konsultan & perusahaan established.',
      emoji: '💼',
      mood: '#0369A1',
      bg: 'light',
    },
    {
      id: 'minimal',
      nama: 'Minimal Tech',
      deskripsi: 'Minimalis, putih, tech forward. Untuk startup tech & SaaS.',
      emoji: '🔲',
      mood: '#334155',
      bg: 'light',
    },
  ],
  restaurant: [
    {
      id: 'rustic',
      nama: 'Rustic Warm',
      deskripsi: 'Hangat, amber, cozy. Untuk warung, cafe, dan restoran lokal.',
      emoji: '🍂',
      mood: '#B45309',
      bg: 'warm',
    },
    {
      id: 'modern',
      nama: 'Modern Dark',
      deskripsi: 'Elegan, dark, premium dining. Untuk restoran fine dining.',
      emoji: '🌙',
      mood: '#1C1917',
      bg: 'dark',
    },
  ],
  sekolah: [
    {
      id: 'warm',
      nama: 'Academic Heritage',
      deskripsi: 'Hangat, maroon & amber, berwibawa. Untuk LPK & sekolah swasta premium.',
      emoji: '📚',
      mood: '#7B2D3E',
      bg: 'light',
    },
    {
      id: 'clean',
      nama: 'Modern Institutional',
      deskripsi: 'Bersih, royal blue, terpercaya. Untuk sekolah formal & institusi.',
      emoji: '🎓',
      mood: '#1D4ED8',
      bg: 'light',
    },
  ],
  toko_online: [
    {
      id: 'batik',
      nama: 'Batik Heritage',
      deskripsi: 'Traditional, warm, authentic. Untuk produk lokal & kerajinan.',
      emoji: '🌺',
      mood: '#DC2626',
      bg: 'light',
    },
    {
      id: 'modern',
      nama: 'Modern Shop',
      deskripsi: 'Clean, minimal, contemporary. Untuk brand fashion & lifestyle.',
      emoji: '🛍️',
      mood: '#0F172A',
      bg: 'dark',
    },
  ],
  personal: [
    {
      id: 'minimal',
      nama: 'Minimal Portfolio',
      deskripsi: 'Bersih, focused, elegant. Untuk profesional & freelancer.',
      emoji: '✦',
      mood: '#1C1917',
      bg: 'light',
    },
    {
      id: 'bold',
      nama: 'Bold Creative',
      deskripsi: 'Berani, colorful, memorable. Untuk kreator & desainer.',
      emoji: '🎨',
      mood: '#DB2777',
      bg: 'dark',
    },
  ],
  custom: [
    {
      id: 'clean',
      nama: 'Clean & Simple',
      deskripsi: 'Layout bersih dan fleksibel.',
      emoji: '📄',
      mood: '#0EA5E9',
      bg: 'light',
    },
  ],
}

export function getVariants(tipe: string): VariantOption[] {
  return INDUSTRY_VARIANTS[tipe] ?? INDUSTRY_VARIANTS.custom
}

export function getVariant(tipe: string, variantId: string): VariantOption {
  const variants = getVariants(tipe)
  return variants.find(v => v.id === variantId) ?? variants[0]
}
