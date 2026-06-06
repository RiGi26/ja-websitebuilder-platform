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

// ── Kerajinan / Heritage (batik & wastra — uji motif) ──────────
const KERAJINAN: ComposableContent = {
  nama: 'Wastra Nusantara',
  hero: {
    eyebrow: 'Warisan Wastra Indonesia',
    title: 'Batik Tulis, Dikerjakan Sepenuh Hati',
    subtitle:
      'Tiap helai dicanting tangan oleh perajin Pekalongan — bukan cetakan. Motif klasik yang hidup puluhan tahun.',
    ctaText: 'Lihat Koleksi',
    ctaHref: '#koleksi',
    image: IMG('photo-1528459801416-a9e53bbf4e17'),
  },
  features: [
    { title: 'Canting Tangan', desc: 'Dikerjakan perajin berpengalaman, bukan batik printing pabrik.' },
    { title: 'Pewarna Alami', desc: 'Indigo, soga, dan mengkudu — warna yang makin matang seiring waktu.' },
    { title: 'Edisi Terbatas', desc: 'Tiap motif diproduksi sedikit, jadi koleksi Anda tetap istimewa.' },
  ],
  showcase: {
    title: 'Koleksi Pilihan',
    subtitle: 'Mahakarya wastra dari tangan perajin terbaik.',
    items: [
      { nama: 'Batik Tulis Kawung', harga: 850000, desc: 'Motif klasik keraton, sutra premium.', gambar: IMG('photo-1582738411706-bfc8e691d1c2', 800) },
      { nama: 'Tenun Ikat Sumba', harga: 1250000, desc: 'Pewarna alami, ditenun 3 minggu.', gambar: IMG('photo-1610701596007-11502861dcfa', 800) },
      { nama: 'Selendang Songket', harga: 680000, desc: 'Benang emas, anyaman rapat.', gambar: IMG('photo-1606744837616-56c9a5c6a6eb', 800) },
      { nama: 'Kain Panjang Parang', harga: 720000, desc: 'Motif parang rusak, katun primisima.', gambar: IMG('photo-1528459801416-a9e53bbf4e17', 800) },
    ],
  },
  about: {
    title: 'Menjaga Warisan Leluhur',
    body: 'Sejak 1998 kami merangkul perajin wastra di Pekalongan, Sumba, dan Palembang. Setiap pembelian Anda menghidupi tangan-tangan yang menjaga tradisi tetap bernapas.',
  },
  cta: {
    title: 'Miliki Mahakarya Wastra',
    subtitle: 'Koleksi terbatas — tiap kain punya cerita.',
    ctaText: 'Pesan via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@wastranusantara.id', alamat: 'Pekalongan, Jawa Tengah' },
}

// ── Kecantikan / Skincare ──────────────────────────────────────
const KECANTIKAN: ComposableContent = {
  nama: 'Lumière Skin',
  hero: {
    eyebrow: 'Perawatan Kulit Sehari-hari',
    title: 'Kulit Sehat Mulai dari Rutinitas Sederhana',
    subtitle:
      'Formula lembut berbahan aktif teruji, cocok untuk kulit sensitif. Hasil nyata tanpa janji berlebihan.',
    ctaText: 'Belanja Sekarang',
    ctaHref: '#koleksi',
    image: IMG('photo-1522335789203-aabd1fc54bc9'),
  },
  features: [
    { title: 'BPOM Terdaftar', desc: 'Aman dipakai harian, lolos uji keamanan resmi.' },
    { title: 'Cruelty-Free', desc: 'Tanpa uji pada hewan, ramah & bertanggung jawab.' },
    { title: 'Cocok Kulit Sensitif', desc: 'Bebas alkohol & pewangi keras, pH seimbang.' },
  ],
  showcase: {
    title: 'Produk Terlaris',
    subtitle: 'Rutinitas yang dicintai ribuan pelanggan.',
    items: [
      { nama: 'Gentle Cleanser', harga: 89000, desc: 'Pembersih lembut, tak bikin kulit ketarik.', gambar: IMG('photo-1556228720-195a672e8a03', 800) },
      { nama: 'Vitamin C Serum', harga: 159000, desc: 'Mencerahkan & menyamarkan noda.', gambar: IMG('photo-1571781926291-c477ebfd024b', 800) },
      { nama: 'Hydrating Moisturizer', harga: 129000, desc: 'Lembap seharian, ringan tak lengket.', gambar: IMG('photo-1596462502278-27bfdc403348', 800) },
      { nama: 'Sunscreen SPF 50', harga: 99000, desc: 'Proteksi tinggi, no whitecast.', gambar: IMG('photo-1620916566398-39f1143ab7be', 800) },
    ],
  },
  about: {
    title: 'Kecantikan yang Jujur',
    body: 'Kami percaya kulit indah lahir dari konsistensi, bukan keajaiban semalam. Tiap produk diformulasi bersama dermatolog dan diuji nyata sebelum sampai ke tangan Anda.',
  },
  cta: {
    title: 'Mulai Rutinitas Glowing Anda',
    subtitle: 'Konsultasi gratis untuk jenis kulit Anda.',
    ctaText: 'Chat via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'care@lumiereskin.id', alamat: 'Jakarta Selatan' },
}

// ── Elektronik / Gadget ────────────────────────────────────────
const GADGET: ComposableContent = {
  nama: 'NEXA Gear',
  hero: {
    eyebrow: 'Gadget & Aksesoris Pilihan',
    title: 'Teknologi yang Bikin Hidup Lebih Mudah',
    subtitle:
      'Aksesoris original bergaransi resmi, dikurasi untuk performa dan daya tahan. Bukan barang abal-abal.',
    ctaText: 'Lihat Produk',
    ctaHref: '#koleksi',
    image: IMG('photo-1511707171634-5f897ff02aa9'),
  },
  features: [
    { title: 'Garansi Resmi', desc: '100% original, garansi distributor 1 tahun penuh.' },
    { title: 'Kirim Hari Ini', desc: 'Order sebelum jam 3 sore, langsung kami proses.' },
    { title: 'Uji Sebelum Kirim', desc: 'Tiap unit dicek QC, dijamin nyala & normal.' },
  ],
  showcase: {
    title: 'Produk Unggulan',
    subtitle: 'Gadget terlaris bulan ini.',
    items: [
      { nama: 'TWS Pro ANC', harga: 459000, desc: 'Peredam bising aktif, baterai 30 jam.', gambar: IMG('photo-1505740420928-5e560c06d30e', 800) },
      { nama: 'Powerbank 20.000mAh', harga: 279000, desc: 'Fast charging 22.5W, 3 port.', gambar: IMG('photo-1498049794561-7780e7231661', 800) },
      { nama: 'Smartwatch AMOLED', harga: 699000, desc: 'Pantau detak & tidur, tahan air.', gambar: IMG('photo-1572569511254-d8f925fe2cbb', 800) },
      { nama: 'Keyboard Mekanik', harga: 549000, desc: 'Hot-swap, RGB, switch taktil.', gambar: IMG('photo-1546435770-a3e426bf472b', 800) },
    ],
  },
  about: {
    title: 'Dipercaya 50.000+ Pelanggan',
    body: 'NEXA Gear hadir sejak 2019 sebagai reseller resmi brand teknologi global. Kami hanya menjual yang kami pakai sendiri — itu janji kami.',
  },
  cta: {
    title: 'Upgrade Gadget Anda Hari Ini',
    subtitle: 'Stok terbatas, harga promo akhir bulan.',
    ctaText: 'Order via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'cs@nexagear.id', alamat: 'Bandung, Jawa Barat' },
}

// ── Rumah & Dekor / Furniture ──────────────────────────────────
const RUMAH: ComposableContent = {
  nama: 'Rumah Kayu Studio',
  hero: {
    eyebrow: 'Furnitur & Dekorasi Rumah',
    title: 'Hangatkan Rumah dengan Kayu yang Bercerita',
    subtitle:
      'Furnitur kayu solid buatan pengrajin Jepara, dirancang minimalis untuk hunian modern yang nyaman.',
    ctaText: 'Jelajahi Koleksi',
    ctaHref: '#koleksi',
    image: IMG('photo-1538688525198-9b88f6f53126'),
  },
  features: [
    { title: 'Kayu Solid Pilihan', desc: 'Jati & mahoni bersertifikat, awet lintas generasi.' },
    { title: 'Rakitan Pengrajin', desc: 'Dikerjakan tangan tukang kayu Jepara berpengalaman.' },
    { title: 'Gratis Ongkir Jawa', desc: 'Pengiriman aman, dirakit sampai rapi di rumah.' },
  ],
  showcase: {
    title: 'Koleksi Pilihan',
    subtitle: 'Perabot yang membuat rumah terasa lengkap.',
    items: [
      { nama: 'Sofa Kayu Skandinavia', harga: 4250000, desc: 'Bantal premium, rangka jati.', gambar: IMG('photo-1555041469-a586c61ea9bc', 800) },
      { nama: 'Meja Makan 6 Kursi', harga: 6800000, desc: 'Kayu solid, finishing natural.', gambar: IMG('photo-1567538096630-e0c55bd6374c', 800) },
      { nama: 'Rak Dinding Minimalis', harga: 890000, desc: 'Hemat ruang, kuat menahan beban.', gambar: IMG('photo-1567016432779-094069958ea5', 800) },
      { nama: 'Lemari Pajangan', harga: 3200000, desc: 'Kaca tempered, lampu hangat.', gambar: IMG('photo-1493663284031-b7e3aefcae8e', 800) },
    ],
  },
  about: {
    title: 'Furnitur yang Tumbuh Bersama Anda',
    body: 'Kami merancang perabot yang tak lekang tren — bahan jujur, sambungan kuat, garis bersih. Dibuat untuk dipakai bertahun-tahun, bukan diganti tiap musim.',
  },
  cta: {
    title: 'Wujudkan Rumah Impian Anda',
    subtitle: 'Konsultasi desain interior gratis.',
    ctaText: 'Konsultasi via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@rumahkayustudio.id', alamat: 'Jepara, Jawa Tengah' },
}

// ── Kesehatan & Herbal ─────────────────────────────────────────
const HERBAL: ComposableContent = {
  nama: 'Tanah Herbal',
  hero: {
    eyebrow: 'Produk Herbal Alami',
    title: 'Sehat dari Alam, Diracik dengan Hati',
    subtitle:
      'Madu murni, jamu, dan herbal pilihan langsung dari petani lokal. Tanpa pengawet, tanpa pemanis buatan.',
    ctaText: 'Belanja Herbal',
    ctaHref: '#koleksi',
    image: IMG('photo-1556760544-74068565f05c'),
  },
  features: [
    { title: '100% Murni', desc: 'Tanpa campuran gula atau pengawet kimia apa pun.' },
    { title: 'Dari Petani Lokal', desc: 'Sumber langsung, harga adil untuk petani.' },
    { title: 'Teruji Lab', desc: 'Lolos uji kualitas, aman dikonsumsi keluarga.' },
  ],
  showcase: {
    title: 'Produk Pilihan',
    subtitle: 'Kebaikan alam untuk keluarga Anda.',
    items: [
      { nama: 'Madu Hutan Murni 500g', harga: 145000, desc: 'Panen liar, rasa kaya & alami.', gambar: IMG('photo-1471864190281-a93a3070b6de', 800) },
      { nama: 'Jamu Kunyit Asam', harga: 38000, desc: 'Segar, bantu jaga daya tahan.', gambar: IMG('photo-1597318181409-cf64d0b5d8a2', 800) },
      { nama: 'Teh Herbal Detoks', harga: 65000, desc: 'Racikan daun pilihan, bebas kafein.', gambar: IMG('photo-1564890369478-c89ca6d9cde9', 800) },
      { nama: 'Minyak Esensial Sereh', harga: 89000, desc: 'Aromaterapi menenangkan, 100% alami.', gambar: IMG('photo-1515378791036-0648a3ef77b2', 800) },
    ],
  },
  about: {
    title: 'Kembali ke Alam',
    body: 'Tanah Herbal lahir dari keyakinan bahwa tubuh paling cocok dengan yang alami. Kami bermitra dengan petani di lereng Merbabu untuk menghadirkan herbal terbaik tanpa perantara.',
  },
  cta: {
    title: 'Mulai Hidup Lebih Sehat',
    subtitle: 'Gratis konsultasi pilihan herbal sesuai kebutuhan.',
    ctaText: 'Tanya via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@tanahherbal.id', alamat: 'Magelang, Jawa Tengah' },
}

// ── Bayi & Anak / Mainan ───────────────────────────────────────
const ANAK: ComposableContent = {
  nama: 'Cilukba Kids',
  hero: {
    eyebrow: 'Perlengkapan Bayi & Anak',
    title: 'Teman Tumbuh Kembang si Kecil',
    subtitle:
      'Mainan edukatif & perlengkapan bayi yang aman, ceria, dan bikin belajar jadi menyenangkan.',
    ctaText: 'Lihat Mainan',
    ctaHref: '#koleksi',
    image: IMG('photo-1515488042361-ee00e0ddd4e4'),
  },
  features: [
    { title: 'Bahan Food-Grade', desc: 'Aman digigit, bebas BPA, lolos uji SNI.' },
    { title: 'Merangsang Kreativitas', desc: 'Dirancang bersama psikolog anak.' },
    { title: 'Awet & Tahan Banting', desc: 'Kuat menemani si kecil bermain seharian.' },
  ],
  showcase: {
    title: 'Mainan Favorit',
    subtitle: 'Pilihan terbaik untuk si kecil.',
    items: [
      { nama: 'Balok Susun Kayu', harga: 119000, desc: 'Melatih motorik & warna, cat aman.', gambar: IMG('photo-1522771739844-6a9f6d5f14af', 800) },
      { nama: 'Puzzle Hewan', harga: 75000, desc: 'Kenalkan bentuk & nama hewan seru.', gambar: IMG('photo-1503454537195-1dcabb73ffb9', 800) },
      { nama: 'Boneka Rajut Lembut', harga: 95000, desc: 'Halus dipeluk, jahitan kuat.', gambar: IMG('photo-1545558014-8692077e9b5c', 800) },
      { nama: 'Set Alat Musik Mini', harga: 135000, desc: 'Kenalkan nada & ritme sejak dini.', gambar: IMG('photo-1515488042361-ee00e0ddd4e4', 800) },
    ],
  },
  about: {
    title: 'Bermain Sambil Belajar',
    body: 'Cilukba Kids memilih tiap mainan dengan standar yang sama seperti untuk anak kami sendiri: aman, mendidik, dan menyenangkan. Karena masa kecil cuma sekali.',
  },
  cta: {
    title: 'Bahagiakan si Kecil Hari Ini',
    subtitle: 'Gratis kartu ucapan untuk setiap hadiah.',
    ctaText: 'Pesan via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@cilukbakids.id', alamat: 'Surabaya, Jawa Timur' },
}

// ── RESTAURANT · Warung / Kedai (masakan rumahan) ──────────────
const WARUNG: ComposableContent = {
  nama: 'Warung Bu Tatik',
  hero: {
    eyebrow: 'Masakan Rumahan Sejak 1998',
    title: 'Masakan Rumahan yang Bikin Kangen Rumah',
    subtitle:
      'Dimasak dadakan tiap pagi pakai resep nenek. Porsi mengenyangkan, harga kaki lima, rasa bintang lima.',
    ctaText: 'Lihat Menu',
    ctaHref: '#menu',
    image: IMG('photo-1555126634-323283e090fa'),
  },
  features: [
    { title: 'Dimasak Dadakan', desc: 'Bukan masakan kemarin. Kami masak segar tiap pagi sebelum buka.' },
    { title: 'Porsi Mengenyangkan', desc: 'Nasi boleh nambah. Kami tak hitung sendok, kami hitung kenyang.' },
    { title: 'Harga Bersahabat', desc: 'Makan lengkap mulai 15 ribu. Cocok untuk kantong harian.' },
  ],
  showcase: {
    title: 'Menu Andalan',
    subtitle: 'Yang paling dicari pelanggan tiap hari.',
    items: [
      { nama: 'Ayam Goreng Lengkuas + Nasi', harga: 18000, desc: 'Ayam ungkep bumbu meresap, kremes gurih.' },
      { nama: 'Soto Daging Bening', harga: 20000, desc: 'Kuah kaldu rebus 4 jam, segar tak bikin enek.' },
      { nama: 'Sayur Lodeh Komplit', harga: 13000, desc: 'Santan segar, sayur dari pasar pagi.' },
      { nama: 'Es Teh Poci Gula Batu', harga: 5000, desc: 'Teh tubruk wangi, manis pas.' },
    ],
  },
  stats: [
    { angka: '25+', label: 'Tahun melayani' },
    { angka: '300', label: 'Porsi terjual/hari' },
    { angka: '15rb', label: 'Mulai dari' },
    { angka: '4.8', label: 'Rating Google' },
  ],
  testimonials: [
    { quote: 'Rasanya persis masakan ibu saya dulu. Tiap pulang kampung pasti mampir ke sini.', nama: 'Pak Hendra', peran: 'Pelanggan sejak 2005' },
    { quote: 'Porsinya jujur, harganya jujur. Anak kos terselamatkan tiap akhir bulan.', nama: 'Rina', peran: 'Mahasiswa' },
    { quote: 'Sotonya juara. Kuahnya bening tapi rasanya dalam. Langganan kantor kami.', nama: 'Bu Sari', peran: 'Karyawan' },
  ],
  faq: [
    { q: 'Jam berapa buka?', a: 'Setiap hari pukul 07.00 sampai habis, biasanya sekitar 16.00. Datang lebih awal agar menu masih lengkap.' },
    { q: 'Bisa pesan untuk acara atau kantor?', a: 'Bisa. Untuk nasi kotak dan prasmanan, pesan minimal H-1 lewat WhatsApp.' },
    { q: 'Terima pesan antar?', a: 'Ya, lewat GoFood dan GrabFood, atau WhatsApp untuk antar sekitar warung.' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Jumat', jam: '07.00 – 16.00' },
      { hari: 'Sabtu – Minggu', jam: '07.00 – 17.00' },
    ],
    alamat: 'Jl. Kaliurang KM 5 No. 12, Sleman, Yogyakarta',
    mapsQuery: 'Jl. Kaliurang KM 5 Sleman Yogyakarta',
    telp: '081296917963',
    reservasiText: 'Pesan via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Dari Dapur Bu Tatik',
    body: 'Berawal dari gerobak kecil tahun 1998, kini Warung Bu Tatik sudah menemani tiga generasi pelanggan. Yang tak pernah berubah: resep, takaran, dan niat menyuguhkan makanan seperti untuk keluarga sendiri.',
  },
  cta: {
    title: 'Lapar? Mampir Sekarang',
    subtitle: 'Pesan antar atau makan di tempat, sama enaknya.',
    ctaText: 'Pesan via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@warungbutatik.id', alamat: 'Sleman, Yogyakarta' },
}

// ── RESTAURANT · Cafe / Coffee Shop ───────────────────────────
const CAFE: ComposableContent = {
  nama: 'Kopi Senja',
  hero: {
    eyebrow: 'Specialty Coffee & Ruang Nyaman',
    title: 'Tempat Kopimu Bertemu Cerita',
    subtitle:
      'Biji single-origin dari petani lokal, diseduh barista bersertifikat. Ruang yang dibuat untuk berlama-lama.',
    ctaText: 'Lihat Menu',
    ctaHref: '#menu',
    image: IMG('photo-1554118811-1e0d58224f24'),
  },
  features: [
    { title: 'Biji Single-Origin', desc: 'Dipanggang mingguan dari petani Gayo, Kintamani, dan Toraja.' },
    { title: 'Barista Bersertifikat', desc: 'Setiap cangkir diseduh tangan yang paham takaran dan suhu.' },
    { title: 'WiFi Kencang & Stop Kontak', desc: 'Banyak colokan, internet stabil. Nyaman kerja seharian.' },
  ],
  showcase: {
    title: 'Menu Favorit',
    subtitle: 'Yang paling sering dipesan tamu.',
    items: [
      { nama: 'Es Kopi Susu Senja', harga: 22000, desc: 'Signature kami. Manis gula aren, kopi tebal.', gambar: IMG('photo-1461023058943-07fcbe16d735', 800) },
      { nama: 'Caffe Latte', harga: 28000, desc: 'Espresso lembut, susu segar steamed.', gambar: IMG('photo-1572442388796-11668a67e53d', 800) },
      { nama: 'Butter Croissant', harga: 25000, desc: 'Dipanggang tiap pagi, renyah berlapis.', gambar: IMG('photo-1555507036-ab1f4038808a', 800) },
      { nama: 'Manual Brew V60', harga: 30000, desc: 'Pilih bijimu, kami seduh di depanmu.', gambar: IMG('photo-1495474472287-4d71bcdd2085', 800) },
    ],
  },
  testimonials: [
    { quote: 'Kopi susunya nagih, tempatnya tenang buat kerja. Sudah jadi kantor kedua saya.', nama: 'Dimas', peran: 'Freelancer' },
    { quote: 'Baristanya ramah dan tahu betul soal kopi. Direkomendasikan untuk yang mau belajar manual brew.', nama: 'Anita', peran: 'Pengunjung' },
    { quote: 'Estetik tanpa bikin kantong jebol. Croissant-nya wajib coba.', nama: 'Bella', peran: 'Mahasiswa' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Jumat', jam: '08.00 – 22.00' },
      { hari: 'Sabtu – Minggu', jam: '09.00 – 23.00' },
    ],
    alamat: 'Jl. Cihampelas No. 88, Bandung',
    mapsQuery: 'Jl. Cihampelas Bandung',
    telp: '081296917963',
    reservasiText: 'Reservasi Meja',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Tentang Kopi Senja',
    body: 'Kami percaya kopi terbaik lahir dari kedekatan: dekat dengan petani, dekat dengan tamu. Sejak 2019 kami menyeduh dengan biji yang kami kenal asalnya, di ruang yang sengaja dibuat untuk memperlambat hari.',
  },
  cta: {
    title: 'Ngopi Dulu, Yuk',
    subtitle: 'Pesan di tempat atau bungkus untuk jalan.',
    ctaText: 'Reservasi via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@kopisenja.id', alamat: 'Bandung, Jawa Barat' },
}

// ── RESTAURANT · Fine Dining / Resto Keluarga ─────────────────
const FINEDINING: ComposableContent = {
  nama: 'Meja Nusantara',
  hero: {
    eyebrow: 'Fine Dining Cita Rasa Indonesia',
    title: 'Hidangan Nusantara, Disajikan Istimewa',
    subtitle:
      'Resep warisan diolah chef berpengalaman, bahan terbaik dari penjuru negeri. Untuk momen yang pantas dirayakan.',
    ctaText: 'Reservasi Meja',
    ctaHref: '#reservasi',
    image: IMG('photo-1414235077428-338989a2e8c0'),
  },
  features: [
    { title: 'Chef Berpengalaman', desc: 'Dipimpin chef dengan 20 tahun mengolah masakan Nusantara.' },
    { title: 'Bahan Pilihan', desc: 'Rempah segar dan bahan premium, dipilih langsung tiap hari.' },
    { title: 'Suasana Berkelas', desc: 'Ruang elegan untuk rapat, ulang tahun, dan jamuan spesial.' },
  ],
  showcase: {
    title: 'Signature Menu',
    subtitle: 'Hidangan kebanggaan dapur kami.',
    items: [
      { nama: 'Iga Bakar Madu Kecombrang', harga: 145000, desc: 'Iga empuk, bumbu meresap, aroma kecombrang.' },
      { nama: 'Bebek Betutu Bali', harga: 165000, desc: 'Diungkep 6 jam dengan base genep otentik.' },
      { nama: 'Gurame Bakar Rica', harga: 135000, desc: 'Gurame segar, sambal rica pedas menggugah.' },
      { nama: 'Es Selendang Mayang', harga: 35000, desc: 'Pencuci mulut klasik Betawi, segar dan legit.' },
    ],
  },
  stats: [
    { angka: '20', label: 'Tahun pengalaman chef' },
    { angka: '50rb+', label: 'Tamu terlayani' },
    { angka: '4.9', label: 'Rating Google' },
    { angka: '120', label: 'Kapasitas kursi' },
  ],
  testimonials: [
    { quote: 'Tempat favorit keluarga untuk merayakan ulang tahun. Pelayanannya hangat, masakannya tak pernah mengecewakan.', nama: 'Keluarga Wijaya', peran: 'Pelanggan setia' },
    { quote: 'Kami adakan jamuan klien di sini. Suasananya pas, hidangannya membanggakan untuk disuguhkan.', nama: 'Bp. Surya', peran: 'Direktur perusahaan' },
    { quote: 'Bebek betutu-nya terbaik yang pernah saya cicipi di luar Bali.', nama: 'Maria', peran: 'Food blogger' },
  ],
  faq: [
    { q: 'Apakah perlu reservasi?', a: 'Untuk akhir pekan dan jam makan malam, kami sangat menyarankan reservasi agar meja terjamin.' },
    { q: 'Bisa untuk acara ulang tahun atau jamuan kantor?', a: 'Tentu. Kami menyediakan ruang semi-privat dan paket jamuan. Hubungi kami untuk pengaturan.' },
    { q: 'Apakah ada pilihan menu tanpa daging?', a: 'Ada beberapa hidangan sayur dan seafood. Beri tahu kami pantangan Anda saat memesan.' },
  ],
  info: {
    jam: [
      { hari: 'Selasa – Minggu', jam: '11.00 – 22.00' },
      { hari: 'Senin', jam: 'Tutup' },
    ],
    alamat: 'Jl. Senopati No. 45, Jakarta Selatan',
    mapsQuery: 'Jl. Senopati Jakarta Selatan',
    telp: '081296917963',
    reservasiText: 'Reservasi Sekarang',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Filosofi Meja Nusantara',
    body: 'Kami menghadirkan kekayaan rasa Nusantara dengan penyajian yang layak dirayakan. Setiap hidangan adalah penghormatan pada resep warisan, diolah dengan ketelitian dan bahan terbaik yang bisa kami dapatkan.',
  },
  cta: {
    title: 'Rayakan Momen Anda Bersama Kami',
    subtitle: 'Meja terbatas tiap malam. Pastikan tempat Anda.',
    ctaText: 'Reservasi via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'reservasi@mejanusantara.id', alamat: 'Jakarta Selatan' },
}

// ── KLINIK · Umum / Gigi ───────────────────────────────────────
const KLINIK_UMUM: ComposableContent = {
  nama: 'Klinik Sehat Sentosa',
  hero: {
    eyebrow: 'Klinik Keluarga Terpercaya',
    title: 'Layanan Kesehatan yang Mengutamakan Anda',
    subtitle:
      'Dokter berpengalaman, antrean online, dan suasana yang menenangkan. Sehat tak perlu menunggu lama.',
    ctaText: 'Buat Janji',
    ctaHref: '#janji',
    image: IMG('photo-1519494026892-80bbd2d6fd0d'),
  },
  features: [
    { title: 'Dokter Berpengalaman', desc: 'Ditangani dokter umum dan spesialis berlisensi resmi.' },
    { title: 'Antrean Online', desc: 'Daftar dari rumah, datang tepat giliran. Tanpa antre lama.' },
    { title: 'Terima BPJS & Asuransi', desc: 'Bekerja sama dengan BPJS dan asuransi swasta utama.' },
  ],
  showcase: {
    title: 'Layanan Kami',
    subtitle: 'Perawatan lengkap untuk seluruh keluarga.',
    items: [
      { nama: 'Pemeriksaan Umum', harga: 50000, desc: 'Konsultasi dokter umum, diagnosa & resep.', gambar: IMG('photo-1579684385127-1ef15d508118', 800) },
      { nama: 'Perawatan Gigi', harga: 150000, desc: 'Scaling, tambal, cabut oleh dokter gigi.', gambar: IMG('photo-1606811841689-23dfddce3e95', 800) },
      { nama: 'Vaksinasi', harga: 200000, desc: 'Imunisasi anak & dewasa, stok lengkap.', gambar: IMG('photo-1612277795421-9bc7706a4a34', 800) },
      { nama: 'Cek Laboratorium', harga: 100000, desc: 'Tes darah, gula, kolesterol. Hasil cepat.', gambar: IMG('photo-1582719508461-905c673771fd', 800) },
    ],
  },
  stats: [
    { angka: '15rb+', label: 'Pasien terlayani' },
    { angka: '12', label: 'Dokter & spesialis' },
    { angka: '4.9', label: 'Rating Google' },
    { angka: '7', label: 'Hari buka/minggu' },
  ],
  testimonials: [
    { quote: 'Dokternya sabar menjelaskan, antreannya rapi. Sekarang seluruh keluarga periksa di sini.', nama: 'Ibu Dewi', peran: 'Pasien keluarga' },
    { quote: 'Daftar online benar-benar hemat waktu. Datang langsung dipanggil.', nama: 'Pak Anton', peran: 'Pasien' },
    { quote: 'Klinik bersih, ramah, dan terima BPJS. Sangat membantu.', nama: 'Sari', peran: 'Pasien BPJS' },
  ],
  gallery: {
    title: 'Fasilitas Kami',
    subtitle: 'Ruang yang bersih dan nyaman untuk pemulihan Anda.',
    images: [
      { src: IMG('photo-1538108149393-fbbd81895907', 700), caption: 'Ruang tunggu nyaman' },
      { src: IMG('photo-1629909613654-28e377c37b09', 700), caption: 'Ruang periksa' },
      { src: IMG('photo-1631217868264-e5b90bb7e133', 700), caption: 'Tim medis' },
      { src: IMG('photo-1666214280557-f1b5022eb634', 700), caption: 'Laboratorium' },
      { src: IMG('photo-1516549655169-df83a0774514', 700), caption: 'Apotek internal' },
    ],
  },
  faq: [
    { q: 'Apakah perlu daftar dulu?', a: 'Disarankan daftar online agar tak menunggu lama, tapi pasien walk-in tetap kami layani sesuai antrean.' },
    { q: 'Apakah menerima BPJS?', a: 'Ya, kami melayani BPJS Kesehatan dan beberapa asuransi swasta. Bawa kartu saat berkunjung.' },
    { q: 'Jam berapa klinik buka?', a: 'Senin sampai Sabtu pukul 08.00 hingga 21.00, Minggu 08.00 hingga 14.00.' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Sabtu', jam: '08.00 – 21.00' },
      { hari: 'Minggu', jam: '08.00 – 14.00' },
    ],
    alamat: 'Jl. Diponegoro No. 21, Semarang',
    mapsQuery: 'Jl. Diponegoro Semarang',
    telp: '081296917963',
    reservasiText: 'Buat Janji via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Tentang Klinik Sehat Sentosa',
    body: 'Sejak 2010 kami hadir sebagai klinik keluarga di jantung kota. Filosofi kami sederhana: setiap pasien dilayani seperti keluarga sendiri, dengan waktu yang cukup untuk mendengar dan menjelaskan.',
  },
  cta: {
    title: 'Jaga Kesehatan Keluarga Anda',
    subtitle: 'Buat janji hari ini, kami siap melayani.',
    ctaText: 'Buat Janji via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@kliniksehatsentosa.id', alamat: 'Semarang, Jawa Tengah' },
}

// ── KLINIK · Estetik / Skincare (before-after) ─────────────────
const KLINIK_ESTETIK: ComposableContent = {
  nama: 'Klinik Estetika Luna',
  hero: {
    eyebrow: 'Klinik Kecantikan & Dermatologi',
    title: 'Kulit Sehat Bercahaya, Ditangani Ahlinya',
    subtitle:
      'Perawatan berbasis ilmu dermatologi oleh dokter bersertifikat. Hasil nyata, aman, tanpa janji berlebihan.',
    ctaText: 'Konsultasi Gratis',
    ctaHref: '#konsultasi',
    image: IMG('photo-1570172619644-dfd03ed5d881'),
  },
  features: [
    { title: 'Dokter Bersertifikat', desc: 'Ditangani dokter estetika berpengalaman, bukan terapis biasa.' },
    { title: 'Alat Berteknologi', desc: 'Laser dan perangkat modern berstandar medis internasional.' },
    { title: 'Konsultasi Personal', desc: 'Program perawatan disesuaikan dengan kondisi kulit Anda.' },
  ],
  showcase: {
    title: 'Perawatan Unggulan',
    subtitle: 'Pilihan perawatan favorit pasien kami.',
    items: [
      { nama: 'Facial Brightening', harga: 250000, desc: 'Mencerahkan & melembapkan, kulit segar.', gambar: IMG('photo-1512290923902-8a9f81dc236c', 800) },
      { nama: 'Chemical Peeling', harga: 450000, desc: 'Mengangkat sel mati, samarkan noda.', gambar: IMG('photo-1596462502278-27bfdc403348', 800) },
      { nama: 'Laser Rejuvenation', harga: 850000, desc: 'Meremajakan kulit, pori mengecil.', gambar: IMG('photo-1620916566398-39f1143ab7be', 800) },
      { nama: 'Acne Treatment', harga: 350000, desc: 'Program tuntas atasi jerawat membandel.', gambar: IMG('photo-1556228720-195a672e8a03', 800) },
    ],
  },
  testimonials: [
    { quote: 'Jerawat saya yang bertahun-tahun akhirnya membaik. Dokternya jujur soal ekspektasi.', nama: 'Nadia', peran: 'Pasien acne treatment' },
    { quote: 'Wajah terasa lebih cerah setelah beberapa sesi. Tempatnya nyaman dan higienis.', nama: 'Tika', peran: 'Pasien facial' },
    { quote: 'Konsultasinya detail, tidak menjual paket yang tak perlu. Saya percaya di sini.', nama: 'Rani', peran: 'Pasien' },
  ],
  gallery: {
    title: 'Hasil Perawatan',
    subtitle: 'Foto asli pasien, dipublikasikan atas persetujuan.',
    pairs: [
      { before: IMG('photo-1556228578-8c89e6adf883', 600), after: IMG('photo-1556228720-195a672e8a03', 600), label: 'Acne Treatment — 8 minggu' },
      { before: IMG('photo-1612349317150-e413f6a5b16d', 600), after: IMG('photo-1570172619644-dfd03ed5d881', 600), label: 'Brightening — 6 sesi' },
    ],
  },
  faq: [
    { q: 'Apakah aman untuk kulit sensitif?', a: 'Setiap perawatan diawali konsultasi dan analisa kulit. Dokter menyesuaikan tindakan dengan kondisi Anda.' },
    { q: 'Berapa kali perawatan untuk hasil terlihat?', a: 'Bergantung kondisi kulit. Umumnya hasil mulai terlihat setelah 3 sampai 6 sesi, dijelaskan saat konsultasi.' },
    { q: 'Apakah konsultasi berbayar?', a: 'Konsultasi awal gratis. Anda baru memutuskan perawatan setelah memahami pilihan dan biayanya.' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Sabtu', jam: '10.00 – 20.00' },
      { hari: 'Minggu', jam: 'Dengan perjanjian' },
    ],
    alamat: 'Jl. Kemang Raya No. 8, Jakarta Selatan',
    mapsQuery: 'Jl. Kemang Raya Jakarta Selatan',
    telp: '081296917963',
    reservasiText: 'Konsultasi via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Filosofi Klinik Luna',
    body: 'Kami percaya kecantikan sejati lahir dari kulit yang sehat. Pendekatan kami berbasis bukti ilmiah, mengutamakan keamanan dan kenyamanan, bukan sekadar hasil instan yang tak bertahan.',
  },
  cta: {
    title: 'Mulai Perjalanan Kulit Sehat Anda',
    subtitle: 'Konsultasi gratis dengan dokter kami hari ini.',
    ctaText: 'Konsultasi via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@klinikluna.id', alamat: 'Jakarta Selatan' },
}

// ── KLINIK · Fisio / Wellness ──────────────────────────────────
const KLINIK_WELLNESS: ComposableContent = {
  nama: 'Rumah Terapi Hasta',
  hero: {
    eyebrow: 'Fisioterapi & Pusat Wellness',
    title: 'Pulih Lebih Cepat, Bergerak Tanpa Nyeri',
    subtitle:
      'Terapis tersertifikasi membantu Anda pulih dari cedera dan nyeri kronis, dengan program yang ramah dan terukur.',
    ctaText: 'Jadwalkan Terapi',
    ctaHref: '#jadwal',
    image: IMG('photo-1600334129128-685c5582fd35'),
  },
  features: [
    { title: 'Terapis Tersertifikasi', desc: 'Ditangani fisioterapis berlisensi, bukan pijat biasa.' },
    { title: 'Program Terukur', desc: 'Rencana terapi bertahap dengan evaluasi tiap sesi.' },
    { title: 'Suasana Menenangkan', desc: 'Ruang terapi tenang yang mendukung pemulihan tubuh & pikiran.' },
  ],
  showcase: {
    title: 'Layanan Terapi',
    subtitle: 'Penanganan menyeluruh untuk tubuh yang sehat.',
    items: [
      { nama: 'Fisioterapi', harga: 200000, desc: 'Pemulihan cedera otot, sendi, pascaoperasi.', gambar: IMG('photo-1571019613454-1cb2f99b2d8b', 800) },
      { nama: 'Pijat Terapi', harga: 175000, desc: 'Meredakan nyeri otot & ketegangan.', gambar: IMG('photo-1600334129128-685c5582fd35', 800) },
      { nama: 'Akupunktur', harga: 250000, desc: 'Terapi titik tubuh untuk keseimbangan.', gambar: IMG('photo-1512290923902-8a9f81dc236c', 800) },
      { nama: 'Konsultasi Postur', harga: 150000, desc: 'Analisa postur & saran latihan harian.', gambar: IMG('photo-1544161515-4ab6ce6db874', 800) },
    ],
  },
  stats: [
    { angka: '8rb+', label: 'Sesi terapi' },
    { angka: '95%', label: 'Pasien membaik' },
    { angka: '4.9', label: 'Rating Google' },
    { angka: '6', label: 'Terapis ahli' },
  ],
  testimonials: [
    { quote: 'Setelah cedera lutut, terapi di sini membuat saya bisa jalan normal lagi. Terapisnya telaten.', nama: 'Pak Joko', peran: 'Pasien pascaoperasi' },
    { quote: 'Nyeri punggung saya jauh berkurang. Programnya jelas dan ada evaluasi tiap minggu.', nama: 'Bu Lina', peran: 'Pasien nyeri kronis' },
    { quote: 'Tempatnya tenang, bikin rileks. Pulang badan terasa enteng.', nama: 'Adit', peran: 'Pasien' },
  ],
  gallery: {
    title: 'Ruang Terapi Kami',
    subtitle: 'Tempat yang dirancang untuk ketenangan dan pemulihan.',
    images: [
      { src: IMG('photo-1540555700478-4be289fbecef', 700), caption: 'Ruang terapi' },
      { src: IMG('photo-1571019613454-1cb2f99b2d8b', 700), caption: 'Sesi fisioterapi' },
      { src: IMG('photo-1544161515-4ab6ce6db874', 700), caption: 'Ruang pijat' },
      { src: IMG('photo-1571019614242-c5c5dee9f50b', 700), caption: 'Area latihan' },
      { src: IMG('photo-1545205597-3d9d02c29597', 700), caption: 'Ruang relaksasi' },
    ],
  },
  faq: [
    { q: 'Apakah perlu rujukan dokter?', a: 'Tidak wajib. Anda bisa langsung datang untuk konsultasi awal, kami akan menilai kebutuhan terapi Anda.' },
    { q: 'Berapa lama satu sesi terapi?', a: 'Umumnya 45 sampai 60 menit per sesi, tergantung program yang disusun untuk Anda.' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Jumat', jam: '08.00 – 20.00' },
      { hari: 'Sabtu', jam: '08.00 – 16.00' },
    ],
    alamat: 'Jl. Ahmad Yani No. 17, Surabaya',
    mapsQuery: 'Jl. Ahmad Yani Surabaya',
    telp: '081296917963',
    reservasiText: 'Jadwalkan via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Tentang Rumah Terapi Hasta',
    body: 'Kami percaya pemulihan terbaik datang dari kombinasi keahlian dan kesabaran. Setiap pasien mendapat program yang disusun khusus, dengan terapis yang menemani sampai Anda benar-benar pulih.',
  },
  cta: {
    title: 'Saatnya Bebas dari Nyeri',
    subtitle: 'Jadwalkan sesi pertama Anda bersama terapis kami.',
    ctaText: 'Jadwalkan via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@terapihasta.id', alamat: 'Surabaya, Jawa Timur' },
}

// Sub-kategori → konten contoh. Tema diturunkan dari prefix id (mis.
// 'fashion-editorial' → 'fashion'). Catatan: tema Kesehatan memakai id
// berprefix 'herbal-' (branding), jadi kuncinya 'herbal' (bukan 'kesehatan').
const BY_SUBKATEGORI: Record<string, ComposableContent> = {
  kuliner: KULINER,
  fashion: FASHION,
  kerajinan: KERAJINAN,
  kecantikan: KECANTIKAN,
  gadget: GADGET,
  rumah: RUMAH,
  herbal: HERBAL,
  anak: ANAK,
  // Restaurant (Sprint 4): prefix id tema 'warung-' / 'cafe-' / 'finedining-'
  warung: WARUNG,
  cafe: CAFE,
  finedining: FINEDINING,
  // Klinik (Sprint 6): prefix id tema 'umum-' / 'estetik-' / 'wellness-'
  umum: KLINIK_UMUM,
  estetik: KLINIK_ESTETIK,
  wellness: KLINIK_WELLNESS,
}

export function sampleContentForTheme(themeId: string): ComposableContent {
  const sub = themeId.split('-')[0]
  return BY_SUBKATEGORI[sub] ?? KULINER
}
