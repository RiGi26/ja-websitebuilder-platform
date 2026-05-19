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
}

export const projectsData: Record<string, ProjectDetail> = {
  '1': {
    id: 1,
    title: 'Kafe Nusantara',
    category: 'Restoran',
    year: '2025',
    duration: '14 hari',
    liveUrl: 'https://kafenusantara.com',
    image: '🍽️',
    color: 'from-orange-100 to-red-100',
    size: 'large',
    tags: ['React', 'Tailwind CSS', 'SEO', 'Responsive'],
    challenge: 'Kafe Nusantara membutuhkan website yang modern dan mudah digunakan untuk menampilkan menu, lokasi, dan reservasi online. Website lama mereka tidak mobile-friendly dan sulit diupdate.',
    solution: 'Kami membangun website baru dengan fokus pada user experience dan mobile-first design. Integrasi dengan sistem reservasi memudahkan pelanggan untuk booking meja secara online.',
    results: [
      { metric: 'Traffic +300%', description: 'Peningkatan pengunjung website dalam 3 bulan' },
      { metric: 'Konversi +40%', description: 'Lebih banyak reservasi online' },
      { metric: 'Loading 2.1s', description: 'Waktu loading yang sangat cepat' },
    ],
    screenshots: [
      { title: 'Homepage', description: 'Landing page dengan menu unggulan' },
      { title: 'Menu', description: 'Katalog menu lengkap dengan foto' },
      { title: 'Reservasi', description: 'Form booking yang mudah digunakan' },
      { title: 'Kontak', description: 'Lokasi dan informasi kontak' },
    ],
    testimonial: {
      quote: 'Website baru kami benar-benar mengubah cara kami berinteraksi dengan pelanggan. Reservasi online meningkat drastis dan pelanggan sering memuji tampilan website yang profesional.',
      author: 'Budi Santoso', role: 'Pemilik', company: 'Kafe Nusantara', avatar: 'BS',
    },
  },
  '2': {
    id: 2,
    title: 'Klinik Sehat Bersama',
    category: 'Klinik',
    year: '2024',
    duration: '21 hari',
    liveUrl: 'https://kliniksehat.com',
    image: '🏥',
    color: 'from-blue-100 to-cyan-100',
    size: 'small',
    tags: ['Next.js', 'Booking System', 'HIPAA Compliant'],
    challenge: 'Klinik membutuhkan sistem antrian online dan profil dokter yang mudah diakses pasien.',
    solution: 'Pembuatan portal pasien terintegrasi dengan sistem antrian real-time dan direktori jadwal dokter interaktif.',
    results: [
      { metric: 'Antrian -50%', description: 'Pengurangan waktu tunggu di klinik' },
      { metric: 'Booking +200%', description: 'Kenaikan pendaftaran online' },
      { metric: 'Rating 4.8/5', description: 'Kepuasan pasien meningkat' },
    ],
    screenshots: [
      { title: 'Beranda', description: 'Informasi layanan dan akses cepat' },
      { title: 'Jadwal Dokter', description: 'Pencarian dokter spesialis' },
    ],
    testimonial: {
      quote: 'Sistem antrian online sangat membantu mengatur flow pasien kami setiap harinya.',
      author: 'Dr. Andi', role: 'Direktur', company: 'Klinik Sehat', avatar: 'DA',
    },
  },
  '3': {
    id: 3,
    title: 'Properti Prima',
    category: 'Properti',
    year: '2024',
    duration: '30 hari',
    liveUrl: 'https://propertiprima.com',
    image: '🏠',
    color: 'from-green-100 to-emerald-100',
    size: 'medium',
    tags: ['Real Estate', 'Advanced Search', 'Map Integration'],
    challenge: 'Butuh platform untuk menampilkan ratusan listing properti dengan pencarian yang kompleks.',
    solution: 'Website dengan fitur pencarian properti berbasis peta, filter harga/lokasi, dan virtual tour 360.',
    results: [
      { metric: 'Leads +150%', description: 'Kenaikan prospek pembeli' },
      { metric: 'Bounce Rate -30%', description: 'Pengunjung betah lebih lama' },
      { metric: 'Listings >500', description: 'Properti aktif dikelola' },
    ],
    screenshots: [
      { title: 'Pencarian', filter: 'Filter canggih berdasarkan lokasi' },
      { title: 'Detail Properti', filter: 'Galeri dan info lengkap properti' },
    ] as any,
    testimonial: {
      quote: 'Website kami sekarang terlihat jauh lebih premium dibanding kompetitor.',
      author: 'Siska', role: 'Head of Marketing', company: 'Properti Prima', avatar: 'SK',
    },
  },
  '4': {
    id: 4,
    title: 'Toko Buku Pintar',
    category: 'Jasa',
    year: '2025',
    duration: '10 hari',
    liveUrl: 'https://tokobukupintar.com',
    image: '📚',
    color: 'from-purple-100 to-pink-100',
    size: 'small',
    tags: ['E-Commerce', 'Payment Gateway', 'Inventory'],
    challenge: 'Toko buku offline yang ingin berekspansi ke jualan online.',
    solution: 'Toko online terintegrasi dengan payment gateway lokal dan penghitung ongkir otomatis.',
    results: [
      { metric: 'Sales +80%', description: 'Kenaikan penjualan dari luar kota' },
      { metric: 'Transaksi >1000', description: 'Pesanan per bulan' },
      { metric: 'Uptime 99.9%', description: 'Server stabil' },
    ],
    screenshots: [
      { title: 'Katalog', description: 'Katalog buku lengkap' },
      { title: 'Checkout', description: 'Proses checkout yang mudah' },
    ],
    testimonial: {
      quote: 'Sangat mudah digunakan, omzet kami naik drastis sejak go online.',
      author: 'Rina', role: 'Owner', company: 'Toko Buku Pintar', avatar: 'RN',
    },
  },
  '5': {
    id: 5,
    title: 'Restoran Padang Sederhana',
    category: 'Restoran',
    year: '2023',
    duration: '15 hari',
    liveUrl: 'https://padangsederhana.com',
    image: '🍛',
    color: 'from-yellow-100 to-orange-100',
    size: 'medium',
    tags: ['Food Delivery', 'Menu Digital'],
    challenge: 'Ingin menyediakan layanan delivery order sendiri tanpa bergantung pada aplikasi pihak ketiga.',
    solution: 'Sistem order online khusus untuk pelanggan area lokal dengan integrasi WhatsApp.',
    results: [
      { metric: 'Margin +20%', description: 'Penghematan komisi aplikasi' },
      { metric: 'Pesanan +50/hari', description: 'Rata-rata order harian via web' },
      { metric: 'Pelanggan 5k+', description: 'Database pelanggan baru' },
    ],
    screenshots: [
      { title: 'Menu', description: 'Menu digital interaktif' },
      { title: 'Order', description: 'Form pesanan langsung ke WA' },
    ],
    testimonial: {
      quote: 'Kami sekarang tidak perlu bayar komisi mahal ke aplikasi ojol.',
      author: 'Uda Buyung', role: 'Pemilik', company: 'Padang Sederhana', avatar: 'UB',
    },
  },
  '6': {
    id: 6,
    title: 'Spa & Wellness',
    category: 'Jasa',
    year: '2024',
    duration: '20 hari',
    liveUrl: 'https://spawellness.com',
    image: '💆',
    color: 'from-pink-100 to-purple-100',
    size: 'large',
    tags: ['Booking', 'Membership', 'Blog'],
    challenge: 'Kesulitan mengatur jadwal terapis dan pelanggan yang bentrok.',
    solution: 'Sistem booking dengan kalender real-time untuk memilih terapis dan layanan.',
    results: [
      { metric: 'No-show -40%', description: 'Pengurangan pelanggan batal' },
      { metric: 'Member +300', description: 'Pendaftaran member baru' },
      { metric: 'Rating 4.9/5', description: 'Kepuasan booking online' },
    ],
    screenshots: [
      { title: 'Layanan', description: 'Daftar treatment' },
      { title: 'Booking', description: 'Kalender booking interaktif' },
    ],
    testimonial: {
      quote: 'Sangat rapi, jadwal terapis kami sekarang tertata dengan baik.',
      author: 'Lina', role: 'Manajer', company: 'Spa & Wellness', avatar: 'LN',
    },
  },
  '7': {
    id: 7,
    title: 'Rumah Sakit Harapan',
    category: 'Klinik',
    year: '2023',
    duration: '45 hari',
    liveUrl: 'https://rsharapan.com',
    image: '🏥',
    color: 'from-teal-100 to-blue-100',
    size: 'small',
    tags: ['Enterprise', 'Portal Pasien', 'Integrasi API'],
    challenge: 'Migrasi dari website lama yang lambat dan rentan diretas.',
    solution: 'Arsitektur modern dengan tingkat keamanan tinggi dan portal pasien terenkripsi.',
    results: [
      { metric: 'Speed +500%', description: 'Peningkatan kecepatan loading' },
      { metric: 'Security 100%', description: 'Bebas dari serangan siber' },
      { metric: 'Traffic 50k/mo', description: 'Pengunjung aktif bulanan' },
    ],
    screenshots: [
      { title: 'Portal Pasien', description: 'Akses riwayat medis' },
      { title: 'Informasi', description: 'Pusat informasi kesehatan' },
    ],
    testimonial: {
      quote: 'Website kami sekarang jauh lebih aman dan cepat diakses oleh pasien.',
      author: 'Bpk. Hendra', role: 'IT Director', company: 'RS Harapan', avatar: 'HD',
    },
  },
  '8': {
    id: 8,
    title: 'Apartemen Modern',
    category: 'Properti',
    year: '2025',
    duration: '25 hari',
    liveUrl: 'https://apartemenmodern.com',
    image: '🏢',
    color: 'from-gray-100 to-slate-100',
    size: 'medium',
    tags: ['Landing Page', 'Lead Gen', '3D Tour'],
    challenge: 'Kebutuhan kampanye digital untuk penjualan unit apartemen baru.',
    solution: 'High-converting landing page dengan virtual tour 3D dan form pengumpulan lead terintegrasi CRM.',
    results: [
      { metric: 'Leads +500', description: 'Prospek terkumpul dalam 1 bulan' },
      { metric: 'Conversion 12%', description: 'Tingkat konversi landing page' },
      { metric: 'Sold Out', description: 'Penjualan tahap 1 berhasil' },
    ],
    screenshots: [
      { title: 'Hero Section', description: 'Tampilan utama yang menarik' },
      { title: 'Virtual Tour', description: 'Eksplorasi unit apartemen' },
    ],
    testimonial: {
      quote: 'Landing page ini adalah mesin pencetak lead terbaik yang pernah kami miliki.',
      author: 'Dimas', role: 'Sales Manager', company: 'Apartemen Modern', avatar: 'DM',
    },
  }
}

// Derived array for the listing page
export const projectsList = Object.values(projectsData).map((p) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  image: p.image,
  color: p.color,
  size: p.size,
}))
