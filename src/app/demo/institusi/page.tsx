export default function InstitusiDemo() {
  const services = [
    { emoji: '📄', name: 'Surat Keterangan', desc: 'Penerbitan surat keterangan domisili, usaha, dan keterangan lainnya' },
    { emoji: '🏘️', name: 'Data Kependudukan', desc: 'Informasi dan pembaruan data warga RT/RW/Kelurahan' },
    { emoji: '💰', name: 'Bantuan Sosial', desc: 'Pendaftaran dan informasi program bantuan sosial masyarakat' },
    { emoji: '🗺️', name: 'Tata Ruang Wilayah', desc: 'Peta dan informasi rencana tata ruang wilayah desa/kelurahan' },
    { emoji: '📢', name: 'Pengumuman Resmi', desc: 'Informasi kebijakan, peraturan, dan pengumuman terbaru' },
    { emoji: '📞', name: 'Layanan Pengaduan', desc: 'Sampaikan laporan, keluhan, dan aspirasi masyarakat' },
  ]

  const news = [
    { title: 'Musyawarah Desa Penetapan APBDES 2025 Berjalan Lancar', date: '20 Mei 2025', emoji: '🏛️' },
    { title: 'Program Posyandu Bulan Juni: Imunisasi Gratis untuk Balita', date: '18 Mei 2025', emoji: '💉' },
    { title: 'Gotong Royong Perbaikan Jalan Desa Akan Dilaksanakan Pekan Ini', date: '15 Mei 2025', emoji: '🛠️' },
  ]

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Demo Banner */}
      <div className="bg-gray-700 text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
        ✦ Demo Template — Website Institusi · Japan Arena Studio ✦
      </div>

      {/* Top Bar */}
      <div className="bg-red-700 text-white py-2 px-6 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>📞 (0271) 123-456 &nbsp;|&nbsp; 📧 info@sukamajudesa.go.id</span>
          <span>🕐 Pelayanan: Senin – Jumat, 08.00 – 15.00 WIB</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 bg-white z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-2xl">🏛️</div>
            <div>
              <p className="font-black text-gray-900 text-base">Pemerintah Desa Sukamaju</p>
              <p className="text-red-700 text-xs font-bold">Kec. Jatirejo · Kab. Mojokerto · Jawa Timur</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
            <a href="#" className="hover:text-red-700 transition-colors">Beranda</a>
            <a href="#" className="hover:text-red-700 transition-colors">Profil Desa</a>
            <a href="#" className="hover:text-red-700 transition-colors">Layanan</a>
            <a href="#" className="hover:text-red-700 transition-colors">Berita</a>
            <a href="#" className="hover:text-red-700 transition-colors">Kontak</a>
          </div>
          <button className="bg-red-700 hover:bg-red-800 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all">
            Layanan Online
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-r from-red-800 to-red-600 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-200 text-sm font-bold uppercase tracking-widest mb-3">Portal Resmi</p>
          <h1 className="text-5xl font-black mb-4">Desa Sukamaju</h1>
          <p className="text-red-200 text-lg max-w-2xl mx-auto mb-8">
            Melayani dengan sepenuh hati. Portal informasi dan layanan masyarakat Desa Sukamaju secara digital, transparan, dan akuntabel.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-white text-red-700 font-bold px-8 py-3.5 rounded-lg text-sm hover:scale-105 transition-all shadow-xl">
              📄 Permohonan Surat
            </button>
            <button className="bg-red-700/50 border border-white/30 text-white font-bold px-8 py-3.5 rounded-lg text-sm hover:bg-red-700/70 transition-all">
              📢 Pengumuman
            </button>
            <button className="bg-red-700/50 border border-white/30 text-white font-bold px-8 py-3.5 rounded-lg text-sm hover:bg-red-700/70 transition-all">
              📊 APBDes 2025
            </button>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="bg-gray-900 py-6 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { num: '4.872', label: 'Jumlah Penduduk' },
            { num: '1.245', label: 'Kepala Keluarga' },
            { num: '12', label: 'RT / 4 RW' },
            { num: '98%', label: 'Layanan Digital' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-black text-red-400">{s.num}</p>
              <p className="text-gray-400 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Layanan Online</h2>
          <p className="text-gray-500 mb-10 font-medium">Ajukan permohonan layanan tanpa harus antri ke kantor desa</p>
          <div className="grid md:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div key={i} className="group p-6 rounded-[20px] border-2 border-gray-100 hover:border-red-200 hover:shadow-lg transition-all cursor-pointer">
                <div className="w-12 h-12 bg-red-50 group-hover:bg-red-600 rounded-xl flex items-center justify-center text-2xl transition-all mb-4">
                  {s.emoji}
                </div>
                <h3 className="font-black text-gray-900 mb-2">{s.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                <button className="mt-3 text-red-600 text-sm font-bold hover:underline">Ajukan →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-gray-900">Berita & Pengumuman</h2>
            <button className="text-red-600 font-bold text-sm hover:underline">Lihat Semua →</button>
          </div>
          <div className="space-y-4">
            {news.map((n, i) => (
              <div key={i} className="bg-white flex items-center gap-5 p-5 rounded-[20px] border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-3xl shrink-0">{n.emoji}</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium">📅 {n.date}</p>
                </div>
                <button className="text-gray-400 hover:text-red-600 transition-colors">→</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center text-lg">🏛️</div>
              <p className="font-black">Desa Sukamaju</p>
            </div>
            <p className="text-gray-400 text-sm">Kec. Jatirejo, Kab. Mojokerto, Jawa Timur 61374</p>
          </div>
          <div>
            <p className="font-black mb-3 text-sm uppercase tracking-widest text-gray-400">Kontak</p>
            <p className="text-gray-400 text-sm">📞 (0271) 123-456</p>
            <p className="text-gray-400 text-sm">📧 info@sukamajudesa.go.id</p>
          </div>
          <div>
            <p className="font-black mb-3 text-sm uppercase tracking-widest text-gray-400">Jam Operasional</p>
            <p className="text-gray-400 text-sm">Senin – Jumat: 08.00 – 15.00</p>
            <p className="text-gray-400 text-sm">Sabtu: 08.00 – 12.00</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 text-center text-xs text-gray-500">
          © 2025 Pemerintah Desa Sukamaju · Powered by Japan Arena Studio
        </div>
      </footer>
    </div>
  )
}
