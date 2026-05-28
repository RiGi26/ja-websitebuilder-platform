export default function PerusahaanDemo() {
  const services = [
    { emoji: '📊', name: 'Konsultasi Bisnis', desc: 'Strategi pertumbuhan bisnis yang terukur dan berkelanjutan untuk perusahaan Anda.' },
    { emoji: '⚖️', name: 'Hukum & Legalitas', desc: 'Pendampingan legalitas perusahaan, kontrak, dan kepatuhan regulasi.' },
    { emoji: '💰', name: 'Audit Keuangan', desc: 'Pemeriksaan laporan keuangan menyeluruh dengan standar internasional.' },
    { emoji: '🚀', name: 'Digital Transformation', desc: 'Migrasi proses bisnis ke platform digital yang efisien dan scalable.' },
    { emoji: '👥', name: 'HR & Rekrutmen', desc: 'Manajemen SDM dan rekrutmen talenta terbaik untuk kebutuhan perusahaan.' },
    { emoji: '🌐', name: 'Ekspansi Pasar', desc: 'Riset pasar dan strategi ekspansi ke segmen atau wilayah baru.' },
  ]

  const team = [
    { name: 'Dr. Ahmad Fauzi', role: 'CEO & Founding Partner', emoji: '👨‍💼', exp: '20+ tahun' },
    { name: 'Ir. Dewi Lestari', role: 'Head of Finance', emoji: '👩‍💼', exp: '15+ tahun' },
    { name: 'M. Rizal, S.H.', role: 'Legal Director', emoji: '👨‍⚖️', exp: '12+ tahun' },
  ]

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Demo Banner */}
      <div className="bg-blue-700 text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
        ✦ Demo Template — Website Perusahaan · Japan Arena Studio ✦
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center text-white font-black text-sm">M</div>
            <div>
              <p className="font-black text-gray-900 text-sm leading-tight">Meridian Konsultan</p>
              <p className="text-[10px] text-gray-400 font-medium">Indonesia</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#" className="hover:text-blue-700 transition-colors">Beranda</a>
            <a href="#" className="hover:text-blue-700 transition-colors">Layanan</a>
            <a href="#" className="hover:text-blue-700 transition-colors">Tim Kami</a>
            <a href="#" className="hover:text-blue-700 transition-colors">Portofolio</a>
            <a href="#" className="hover:text-blue-700 transition-colors">Kontak</a>
          </div>
          <button className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all">
            Konsultasi Gratis
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-500/10 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
              🏆 Terpercaya sejak 2008
            </span>
            <h1 className="text-5xl font-black leading-tight mb-6">
              Membangun Bisnis<br />
              <span className="text-blue-400">Anda Lebih Jauh</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Kami adalah mitra strategis perusahaan Anda dalam navigasi tantangan bisnis, transformasi digital, dan pertumbuhan berkelanjutan.
            </p>
            <div className="flex gap-3">
              <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-full text-sm transition-all">
                Konsultasi Gratis
              </button>
              <button className="border border-white/20 text-white font-bold px-8 py-4 rounded-full text-sm hover:bg-white/10 transition-all">
                Portofolio Kami
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: '500+', label: 'Klien Aktif', icon: '🤝' },
              { num: '17', label: 'Tahun Pengalaman', icon: '📅' },
              { num: '98%', label: 'Tingkat Kepuasan', icon: '⭐' },
              { num: '45+', label: 'Expert Konsultan', icon: '👥' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[20px] p-5 backdrop-blur">
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-3xl font-black text-white">{s.num}</p>
                <p className="text-sm text-slate-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-700 text-xs font-black uppercase tracking-widest">Layanan Kami</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">Solusi Komprehensif<br />untuk Bisnis Anda</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className="group p-7 rounded-[24px] border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-700 rounded-2xl flex items-center justify-center text-2xl transition-all mb-5">
                  {s.emoji}
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{s.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Strip */}
      <section className="py-16 px-6 bg-blue-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 text-white">
          <div className="flex-1">
            <h2 className="text-3xl font-black mb-4">Mengapa Memilih Meridian?</h2>
            <div className="space-y-3">
              {[
                'Tim berpengalaman dengan latar belakang Big 4 dan multinasional',
                'Pendekatan data-driven yang terukur dan transparan',
                'Dukungan purna layanan 12 bulan tanpa biaya tambahan',
                'Jaringan partner internasional di 12 negara',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">✓</div>
                  <p className="text-blue-100 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur rounded-[28px] p-8 border border-white/20">
            <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-2">Jadwalkan Konsultasi</p>
            <h3 className="text-2xl font-black mb-4">Sesi 30 Menit Gratis</h3>
            <p className="text-blue-200 text-sm mb-6">Ceritakan tantangan bisnis Anda. Kami siapkan analisis awal tanpa biaya.</p>
            <button className="w-full bg-white text-blue-700 font-black py-3.5 rounded-full hover:scale-105 transition-all text-sm">
              Booking Sekarang →
            </button>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-700 text-xs font-black uppercase tracking-widest">Tim Profesional</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">Dipimpin Oleh Para Ahli</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((m, i) => (
              <div key={i} className="text-center p-8 rounded-[28px] border border-gray-100 hover:shadow-lg transition-all">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">{m.emoji}</div>
                <h3 className="font-black text-gray-900 text-lg">{m.name}</h3>
                <p className="text-blue-700 font-bold text-sm mt-1">{m.role}</p>
                <p className="text-gray-400 text-xs mt-2 font-medium">Pengalaman {m.exp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center font-black text-sm">M</div>
              <span className="font-black text-lg">Meridian Konsultan Indonesia</span>
            </div>
            <p className="text-gray-400 text-sm">Jl. Sudirman Kav. 25, Jakarta Pusat · (021) 5xxx-xxxx</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-full text-sm transition-all">
              📧 Kirim Email
            </button>
            <button className="border border-white/20 text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-white/10 transition-all">
              📞 Hubungi Kami
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 text-center text-xs text-gray-500">
          © 2025 Meridian Konsultan Indonesia · Powered by Japan Arena Studio
        </div>
      </footer>
    </div>
  )
}
