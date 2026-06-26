export default function RentalDemo() {
  const fleet = [
    {
      emoji: '🚗',
      name: 'Toyota Avanza',
      category: 'MPV',
      capacity: '7 Kursi',
      transmission: 'Manual',
      year: '2022',
      price: 350_000,
      available: true,
    },
    {
      emoji: '🚙',
      name: 'Toyota Innova',
      category: 'Premium MPV',
      capacity: '8 Kursi',
      transmission: 'Otomatis',
      year: '2023',
      price: 550_000,
      available: true,
    },
    {
      emoji: '🏍️',
      name: 'Yamaha NMAX',
      category: 'Skutik Premium',
      capacity: '2 Orang',
      transmission: 'Otomatis',
      year: '2023',
      price: 120_000,
      available: true,
    },
    {
      emoji: '🛵',
      name: 'Honda Vario 160',
      category: 'Skutik',
      capacity: '2 Orang',
      transmission: 'Otomatis',
      year: '2022',
      price: 95_000,
      available: false,
    },
    {
      emoji: '🚐',
      name: 'Toyota HiAce',
      category: 'Minibus',
      capacity: '15 Kursi',
      transmission: 'Manual',
      year: '2021',
      price: 950_000,
      available: true,
    },
    {
      emoji: '🚘',
      name: 'Honda HRV',
      category: 'SUV',
      capacity: '5 Kursi',
      transmission: 'Otomatis',
      year: '2023',
      price: 480_000,
      available: true,
    },
    {
      emoji: '🏎️',
      name: 'Toyota Fortuner',
      category: 'SUV Premium',
      capacity: '7 Kursi',
      transmission: 'Otomatis',
      year: '2023',
      price: 750_000,
      available: false,
    },
    {
      emoji: '🛺',
      name: 'Honda Beat',
      category: 'Skutik',
      capacity: '2 Orang',
      transmission: 'Otomatis',
      year: '2022',
      price: 80_000,
      available: true,
    },
  ]

  const reasons = [
    {
      emoji: '🔧',
      title: 'Armada Terawat',
      desc: 'Setiap kendaraan melalui pemeriksaan teknis menyeluruh sebelum dan sesudah penyewaan.',
    },
    {
      emoji: '👨‍✈️',
      title: 'Driver Profesional',
      desc: 'Tersedia opsi driver berpengalaman, ramah, dan menguasai rute terbaik di daerah Anda.',
    },
    {
      emoji: '📍',
      title: 'GPS Real-Time',
      desc: 'Pantau posisi kendaraan Anda secara real-time. Aman dan transparan selama perjalanan.',
    },
    {
      emoji: '🕐',
      title: 'Support 24/7',
      desc: 'Tim kami siaga 24 jam. Hubungi kami kapan saja jika ada kendala di perjalanan.',
    },
  ]

  const steps = [
    {
      num: '01',
      emoji: '🔍',
      title: 'Pilih Kendaraan',
      desc: 'Pilih kendaraan sesuai kebutuhan perjalanan dan budget Anda dari katalog lengkap kami.',
    },
    {
      num: '02',
      emoji: '💳',
      title: 'Bayar & Konfirmasi',
      desc: 'Lakukan pembayaran DP via transfer atau dompet digital. Konfirmasi otomatis via WhatsApp.',
    },
    {
      num: '03',
      emoji: '🚀',
      title: 'Jemput & Berangkat',
      desc: 'Kendaraan diantar ke lokasi Anda tepat waktu. Selamat menikmati perjalanan!',
    },
  ]

  const testimonials = [
    {
      name: 'Budi Santoso',
      city: 'Jakarta',
      stars: 5,
      text: 'Avanza-nya bersih banget dan AC dingin. Driver tepat waktu, sangat membantu selama perjalanan bisnis ke Bandung.',
      role: 'Pengusaha',
    },
    {
      name: 'Siti Rahayu',
      city: 'Surabaya',
      stars: 5,
      text: 'Booking mudah, respon cepat. NMAX yang kami sewa dalam kondisi prima. Pasti balik lagi ke Nusantara Drive!',
      role: 'Content Creator',
    },
    {
      name: 'Ahmad Fauzi',
      city: 'Yogyakarta',
      stars: 5,
      text: 'Sewa Innova untuk family trip 3 hari. Harga sangat terjangkau dengan kualitas kendaraan yang luar biasa.',
      role: 'Dokter',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans" style={{ fontVariantNumeric: 'tabular-nums' }}>

      {/* Demo Banner */}
      <div className="bg-amber-400 text-amber-950 text-center py-2 text-[11px] font-black uppercase tracking-widest">
        ✦ Demo Template — Travel &amp; Rental · Webzoka Studio ✦
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-stone-100 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
              ND
            </div>
            <div>
              <p className="font-black text-stone-900 text-sm leading-tight">Nusantara Drive</p>
              <p className="text-[10px] text-stone-400 font-medium">Premium Rental</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-600">
            <a href="#" className="hover:text-orange-600 transition-colors">Beranda</a>
            <a href="#armada" className="hover:text-orange-600 transition-colors">Armada</a>
            <a href="#cara-pesan" className="hover:text-orange-600 transition-colors">Cara Pesan</a>
            <a href="#testimoni" className="hover:text-orange-600 transition-colors">Testimoni</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Kontak</a>
          </div>
          <button className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors shadow-lg shadow-orange-200">
            Booking Sekarang
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-950 via-orange-950 to-amber-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #EA580C 0%, transparent 50%), radial-gradient(circle at 80% 20%, #D97706 0%, transparent 50%)' }} />
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Copy */}
            <div>
              <span className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[11px] font-black px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
                🏆 #1 Rental Terpercaya di Indonesia
              </span>
              <h1 className="text-5xl md:text-6xl font-black leading-[0.95] tracking-tight mb-5">
                Perjalanan<br />
                <span className="text-orange-400">Lebih Nyaman,</span><br />
                Harga Lebih Hemat.
              </h1>
              <p className="text-stone-300 text-lg leading-relaxed mb-8 font-medium">
                Armada lengkap — mobil MPV, SUV, hingga motor premium. Siap antar ke tujuan Anda di seluruh Indonesia.
              </p>
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3">
                {['500+ Armada', '10.000+ Pelanggan', 'Driver Profesional', 'Asuransi Inklusif'].map((badge) => (
                  <span key={badge} className="flex items-center gap-1.5 bg-white/10 border border-white/15 text-white/90 text-xs font-bold px-3 py-2 rounded-full">
                    ✓ {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[28px] p-7">
              <p className="text-white font-black text-lg mb-1">Cari Kendaraan</p>
              <p className="text-stone-400 text-sm font-medium mb-6">Tersedia hari ini</p>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Lokasi Penjemputan</label>
                  <select className="w-full bg-white/10 border border-white/20 text-white rounded-[14px] px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-orange-400 transition-colors" defaultValue="">
                    <option value="" disabled className="text-stone-900">Pilih kota...</option>
                    <option className="text-stone-900">Jakarta</option>
                    <option className="text-stone-900">Bandung</option>
                    <option className="text-stone-900">Surabaya</option>
                    <option className="text-stone-900">Yogyakarta</option>
                    <option className="text-stone-900">Bali</option>
                    <option className="text-stone-900">Medan</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Tanggal Mulai</label>
                    <input type="date" className="w-full bg-white/10 border border-white/20 text-white rounded-[14px] px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-orange-400 transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Tanggal Selesai</label>
                    <input type="date" className="w-full bg-white/10 border border-white/20 text-white rounded-[14px] px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-orange-400 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Jenis Kendaraan</label>
                  <select className="w-full bg-white/10 border border-white/20 text-white rounded-[14px] px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-orange-400 transition-colors" defaultValue="">
                    <option value="" disabled className="text-stone-900">Semua jenis</option>
                    <option className="text-stone-900">MPV (Avanza, Innova)</option>
                    <option className="text-stone-900">SUV (HRV, Fortuner)</option>
                    <option className="text-stone-900">Minibus (HiAce)</option>
                    <option className="text-stone-900">Motor Skutik</option>
                    <option className="text-stone-900">Motor Premium</option>
                  </select>
                </div>
                <button className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black text-sm py-4 rounded-full transition-colors shadow-xl shadow-orange-900/50">
                  🔍 Cari Kendaraan Tersedia
                </button>
              </div>
              <p className="text-center text-[10px] text-stone-500 font-medium mt-4">Konfirmasi via WhatsApp dalam 5 menit</p>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#FFFBF7]" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-stone-100 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: '500+', label: 'Unit Armada' },
              { num: '10rb+', label: 'Pelanggan Puas' },
              { num: '50+', label: 'Kota Layanan' },
              { num: '4.9★', label: 'Rating Google' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">{s.num}</p>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Catalog */}
      <section id="armada" className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <span className="text-[11px] font-black text-orange-600 uppercase tracking-widest">Katalog Kendaraan</span>
          <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight mt-2 mb-3">
            Pilih Armada Favorit Anda
          </h2>
          <p className="text-stone-500 font-medium max-w-xl">
            Semua kendaraan terawat rutin, bersih, dan siap mengantarkan Anda ke mana saja.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {fleet.map((v) => (
            <div
              key={v.name}
              className="bg-white border border-stone-200 rounded-[20px] p-5 flex flex-col hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 group"
            >
              {/* Emoji vehicle */}
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-stone-100 to-amber-50 rounded-[14px] flex items-center justify-center mb-4 group-hover:from-orange-50 group-hover:to-amber-50 transition-colors">
                <span className="text-6xl">{v.emoji}</span>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2.5 py-1 rounded-full">
                  {v.category}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                  v.available
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-600'
                }`}>
                  {v.available ? '✓ Tersedia' : '✗ Habis'}
                </span>
              </div>

              <h3 className="font-black text-stone-900 text-lg mt-2 mb-2 leading-tight">{v.name}</h3>

              {/* Specs */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {[v.capacity, v.transmission, v.year].map((spec) => (
                  <span key={spec} className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>

              <div className="mt-auto">
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-xs font-bold text-stone-400">Mulai</span>
                  <span className="text-xl font-black text-orange-600">
                    Rp {v.price.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs font-bold text-stone-400">/hari</span>
                </div>
                <button
                  className={`w-full py-3 rounded-full text-sm font-black transition-colors ${
                    v.available
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-200'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                  disabled={!v.available}
                >
                  {v.available ? 'Booking Sekarang' : 'Tidak Tersedia'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="border-2 border-stone-200 text-stone-700 font-bold text-sm px-8 py-3.5 rounded-full hover:border-orange-400 hover:text-orange-600 transition-colors">
            Lihat Semua Armada →
          </button>
        </div>
      </section>

      {/* Why Choose Us — dark section */}
      <section className="bg-stone-950 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[11px] font-black text-orange-400 uppercase tracking-widest">Mengapa Kami</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-2">
              Bukan Sekadar Rental Biasa
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((r) => (
              <div key={r.title} className="bg-white/5 border border-white/10 rounded-[20px] p-7 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
                <div className="text-4xl mb-5">{r.emoji}</div>
                <h3 className="text-white font-black text-lg mb-2 leading-tight">{r.title}</h3>
                <p className="text-stone-400 text-sm font-medium leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="cara-pesan" className="bg-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[11px] font-black text-orange-600 uppercase tracking-widest">Mudah & Cepat</span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight mt-2">
              Cara Pesan Hanya 3 Langkah
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-14 left-[25%] right-[25%] h-[2px] bg-orange-200 z-0" />

            {steps.map((step, i) => (
              <div key={step.num} className="relative z-10 text-center">
                <div className="w-28 h-28 bg-white border-4 border-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-100">
                  <span className="text-5xl">{step.emoji}</span>
                </div>
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 md:translate-x-0 md:right-auto md:left-1/2 md:-translate-x-1/2">
                  <span className="inline-block bg-orange-600 text-white text-[11px] font-black px-3 py-1 rounded-full">{step.num}</span>
                </div>
                <h3 className="font-black text-stone-900 text-xl mb-2">{step.title}</h3>
                <p className="text-stone-500 font-medium text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[11px] font-black text-orange-600 uppercase tracking-widest">Testimoni</span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight mt-2">
              Mereka Sudah Merasakan Manfaatnya
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#FFFBF7] border border-stone-200 rounded-[20px] p-7">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-stone-700 font-medium text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-lg font-black text-orange-700">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-black text-stone-900 text-sm leading-tight">{t.name}</p>
                    <p className="text-[11px] text-stone-400 font-medium">{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-orange-600 to-amber-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 10% 50%, #fff 0%, transparent 40%), radial-gradient(circle at 90% 50%, #fff 0%, transparent 40%)' }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <div className="text-6xl mb-6">🚗</div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Siap Melakukan<br />Perjalanan?
          </h2>
          <p className="text-orange-100 text-lg font-medium mb-10 leading-relaxed">
            Pesan sekarang dan dapatkan konfirmasi dalam 5 menit. Lebih dari 10.000 pelanggan telah mempercayai kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 font-black px-10 py-4 rounded-full text-sm hover:bg-orange-50 transition-colors shadow-xl">
              Booking Sekarang
            </button>
            <a
              href="https://wa.me/6281234567890"
              className="border-2 border-white/50 text-white font-bold px-10 py-4 rounded-full text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              💬 Chat WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xs">ND</div>
                <p className="font-black text-white text-sm">Nusantara Drive</p>
              </div>
              <p className="text-sm font-medium leading-relaxed">
                Solusi rental kendaraan premium untuk perjalanan bisnis maupun wisata di seluruh Indonesia.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-4">Layanan</p>
              <ul className="space-y-2.5 text-sm font-medium">
                {['Rental Mobil', 'Rental Motor', 'Paket Wisata', 'Antar Jemput Bandara', 'Rental Minibus'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-orange-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-4">Kontak</p>
              <ul className="space-y-2.5 text-sm font-medium">
                <li>📞 +62 812-3456-7890</li>
                <li>📧 halo@nusantaradrive.id</li>
                <li>📍 Jakarta, Bandung, Surabaya, Bali</li>
                <li className="pt-2">
                  <a href="#" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors">
                    💬 WhatsApp Kami
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
            <p>© 2024 Nusantara Drive. Semua hak dilindungi.</p>
            <p className="text-stone-600">
              Dibuat dengan{' '}
              <a href="https://www.webzoka.com" className="text-orange-500 hover:underline font-bold">
                Webzoka
              </a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
