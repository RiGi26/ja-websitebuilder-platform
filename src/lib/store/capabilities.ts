import type {
  CapabilityDefinition,
  CapabilityGroup,
  PricePresentation,
  RecommendationTier,
  RecommendationTierDefinition,
} from './types'

export const STORE_INTENT_FILTERS = [
  { id: 'public.catalog', label: 'Menampilkan produk, menu, atau layanan' },
  { id: 'public.order-request', label: 'Menerima permintaan order' },
  { id: 'public.booking-request', label: 'Menerima permintaan booking' },
  { id: 'public.enrollment-request', label: 'Menerima minat pendaftaran' },
  { id: 'public.price-display', label: 'Menampilkan harga' },
  { id: 'public.whatsapp-contact', label: 'Membuka percakapan WhatsApp' },
  { id: 'ops.booking-management', label: 'Mengelola booking di belakang layar' },
  { id: 'ops.inventory', label: 'Mengelola stok atau inventaris' },
  { id: 'account.member-login', label: 'Menyediakan login member atau siswa' },
] as const satisfies ReadonlyArray<{ id: CapabilityDefinition['id']; label: string }>

export const CAPABILITY_GROUP_LABELS = {
  public: 'Untuk pelanggan',
  operational: 'Untuk tim',
  account: 'Akun / member',
} as const satisfies Record<CapabilityGroup, string>

export const CAPABILITY_TAXONOMY = {
  'public.business-profile': {
    id: 'public.business-profile',
    label: 'Profil bisnis',
    group: 'public',
    description: 'Perkenalkan bisnis, kredensial, dan cara kerjanya.',
  },
  'public.catalog': {
    id: 'public.catalog',
    label: 'Katalog pilihan',
    group: 'public',
    description: 'Tampilkan produk, menu, layanan, program, atau unit.',
  },
  'public.item-detail': {
    id: 'public.item-detail',
    label: 'Detail pilihan',
    group: 'public',
    description: 'Jelaskan detail pilihan sebelum pengunjung bertanya.',
  },
  'public.search-filter': {
    id: 'public.search-filter',
    label: 'Pencarian dan filter',
    group: 'public',
    description: 'Bantu pengunjung mencari dan membandingkan pilihan.',
  },
  'public.price-display': {
    id: 'public.price-display',
    label: 'Informasi harga',
    group: 'public',
    description: 'Tampilkan harga atau harga mulai yang informatif.',
  },
  'public.whatsapp-contact': {
    id: 'public.whatsapp-contact',
    label: 'Kontak WhatsApp',
    group: 'public',
    description: 'Hubungkan pengunjung ke WhatsApp bisnis.',
  },
  'public.lead-form': {
    id: 'public.lead-form',
    label: 'Form kontak awal',
    group: 'public',
    description: 'Kumpulkan informasi awal untuk tindak lanjut.',
  },
  'public.inquiry': {
    id: 'public.inquiry',
    label: 'Permintaan informasi',
    group: 'public',
    description: 'Terima pertanyaan dan permintaan informasi.',
  },
  'public.order-request': {
    id: 'public.order-request',
    label: 'Permintaan order',
    group: 'public',
    description: 'Terima permintaan order tanpa checkout otomatis.',
  },
  'public.booking-request': {
    id: 'public.booking-request',
    label: 'Permintaan booking',
    group: 'public',
    description: 'Terima permintaan jadwal atau tanggal booking.',
  },
  'public.enrollment-request': {
    id: 'public.enrollment-request',
    label: 'Minat pendaftaran',
    group: 'public',
    description: 'Terima minat pendaftaran program.',
  },
  'public.schedule-info': {
    id: 'public.schedule-info',
    label: 'Informasi jadwal',
    group: 'public',
    description: 'Tampilkan jadwal sebagai informasi sebelum konfirmasi.',
  },
  'public.location': {
    id: 'public.location',
    label: 'Lokasi dan area layanan',
    group: 'public',
    description: 'Tampilkan lokasi, area layanan, atau petunjuk datang.',
  },
  'public.process': {
    id: 'public.process',
    label: 'Alur layanan',
    group: 'public',
    description: 'Jelaskan langkah pesan, booking, daftar, atau konsultasi.',
  },
  'public.consultation': {
    id: 'public.consultation',
    label: 'Konsultasi',
    group: 'public',
    description: 'Arahkan kebutuhan spesifik ke percakapan konsultasi.',
  },
  'ops.content-management': {
    id: 'ops.content-management',
    label: 'Kelola konten katalog',
    group: 'operational',
    description: 'Perbarui isi produk, menu, layanan, program, atau unit.',
  },
  'ops.order-management': {
    id: 'ops.order-management',
    label: 'Kelola order',
    group: 'operational',
    description: 'Tinjau dan tindak lanjuti permintaan order.',
  },
  'ops.booking-management': {
    id: 'ops.booking-management',
    label: 'Kelola booking',
    group: 'operational',
    description: 'Tinjau permintaan booking dan konfirmasi jadwal.',
  },
  'ops.availability': {
    id: 'ops.availability',
    label: 'Kelola ketersediaan',
    group: 'operational',
    description: 'Atur ketersediaan slot atau unit sebelum konfirmasi.',
  },
  'ops.inventory': {
    id: 'ops.inventory',
    label: 'Kelola stok dan inventaris',
    group: 'operational',
    description: 'Pantau stok atau inventaris yang dipakai dalam operasional.',
  },
  'ops.customer-records': {
    id: 'ops.customer-records',
    label: 'Kelola data pelanggan',
    group: 'operational',
    description: 'Simpan dan kelola data pelanggan untuk tindak lanjut.',
  },
  'ops.inquiry-follow-up': {
    id: 'ops.inquiry-follow-up',
    label: 'Kelola dan tindak lanjuti permintaan pelanggan',
    group: 'operational',
    description: 'Kelola pertanyaan, calon pelanggan, atau permintaan yang masuk.',
  },
  'ops.practitioner-management': {
    id: 'ops.practitioner-management',
    label: 'Kelola praktisi dan staf',
    group: 'operational',
    description: 'Atur praktisi, staf, atau penyedia layanan.',
  },
  'ops.enrollment-management': {
    id: 'ops.enrollment-management',
    label: 'Kelola pendaftaran',
    group: 'operational',
    description: 'Tinjau dan kelola pendaftaran peserta.',
  },
  'ops.class-management': {
    id: 'ops.class-management',
    label: 'Kelola kelas',
    group: 'operational',
    description: 'Atur kelas, jadwal, dan peserta.',
  },
  'ops.reminders': {
    id: 'ops.reminders',
    label: 'Pengingat operasional',
    group: 'operational',
    description: 'Kirim pengingat untuk jadwal, booking, atau aktivitas peserta.',
  },
  'ops.payment-management': {
    id: 'ops.payment-management',
    label: 'Kelola pembayaran',
    group: 'operational',
    description: 'Kelola pembayaran dan status transaksi sesuai kebutuhan yang disepakati.',
  },
  'ops.internal-users': {
    id: 'ops.internal-users',
    label: 'Akses khusus untuk tim atau karyawan',
    group: 'operational',
    description: 'Atur siapa di tim yang dapat membuka halaman kerja.',
  },
  'ops.admin-dashboard': {
    id: 'ops.admin-dashboard',
    label: 'Halaman untuk mengelola operasional',
    group: 'operational',
    description: 'Pantau pekerjaan tim dari satu halaman kerja.',
  },
  'account.customer-login': {
    id: 'account.customer-login',
    label: 'Login pelanggan',
    group: 'account',
    description: 'Pelanggan punya login sendiri.',
  },
  'account.member-login': {
    id: 'account.member-login',
    label: 'Login member',
    group: 'account',
    description: 'Member punya area login sendiri.',
  },
  'account.student-login': {
    id: 'account.student-login',
    label: 'Login siswa',
    group: 'account',
    description: 'Siswa punya area belajar sendiri.',
  },
  'account.order-tracking': {
    id: 'account.order-tracking',
    label: 'Lacak order',
    group: 'account',
    description: 'Pelanggan dapat melacak status order.',
  },
  'account.booking-history': {
    id: 'account.booking-history',
    label: 'Riwayat booking',
    group: 'account',
    description: 'Pelanggan dapat melihat riwayat booking.',
  },
  'account.learning-materials': {
    id: 'account.learning-materials',
    label: 'Materi belajar',
    group: 'account',
    description: 'Siswa atau member dapat mengakses materi belajar.',
  },
  'account.attendance': {
    id: 'account.attendance',
    label: 'Kehadiran',
    group: 'account',
    description: 'Siswa atau member dapat melihat atau mengisi kehadiran.',
  },
  'account.membership': {
    id: 'account.membership',
    label: 'Keanggotaan',
    group: 'account',
    description: 'Kelola status dan manfaat keanggotaan.',
  },
} as const satisfies Record<CapabilityDefinition['id'], CapabilityDefinition>

export const RECOMMENDATION_TIERS = {
  website: {
    id: 'website',
    label: 'Website',
    definition: 'Kebutuhan untuk pelanggan saja.',
  },
  'website-portal': {
    id: 'website-portal',
    label: 'Website untuk pelanggan + halaman kerja untuk tim',
    definition: 'Website untuk pelanggan ditambah halaman kerja untuk tim.',
  },
  bundle: {
    id: 'bundle',
    label: 'Website + sistem lengkap untuk pelanggan dan tim',
    definition: 'Website, halaman kerja tim, dan alur akun atau member yang saling terhubung.',
  },
  consultation: {
    id: 'consultation',
    label: 'Perlu konsultasi',
    definition: 'Kebutuhan belum jelas, unsupported, atau terlalu kompleks untuk baseline.',
  },
} as const satisfies Record<RecommendationTier, RecommendationTierDefinition>

export const RECOMMENDATION_TIER_LABELS = {
  website: 'Website',
  'website-portal': 'Website untuk pelanggan + halaman kerja untuk tim',
  bundle: 'Website + sistem lengkap untuk pelanggan dan tim',
  consultation: 'Perlu konsultasi',
} as const satisfies Record<RecommendationTier, string>

export const V1_PRICE_PRESENTATION = {
  website: {
    displayMode: 'starting-price',
    display: 'Mulai Rp600.000',
    startingPrice: 600_000,
    note: 'Harga mulai untuk kebutuhan website publik, bukan harga final setiap template.',
  },
  websitePortal: {
    displayMode: 'consultation',
    display: 'Harga menyesuaikan kebutuhan',
    note: 'Halaman kerja tim ditentukan dari alur kerja dan kebutuhan tim.',
  },
  bundle: {
    displayMode: 'consultation',
    display: 'Harga menyesuaikan kebutuhan',
    note: 'Sistem lengkap ditentukan dari alur kerja dan akun atau member yang dibutuhkan.',
  },
} as const satisfies PricePresentation
