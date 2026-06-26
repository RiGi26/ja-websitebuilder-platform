export default function SekolahDemo() {
  const programs = [
    { emoji: '💻', name: 'Teknik Komputer & Jaringan', duration: '1 Tahun', jobs: 'IT Support, Network Admin', color: 'blue' },
    { emoji: '📊', name: 'Akuntansi & Keuangan', duration: '1 Tahun', jobs: 'Staff Akuntan, Admin Keuangan', color: 'green' },
    { emoji: '🎨', name: 'Desain Grafis & Multimedia', duration: '6 Bulan', jobs: 'Desainer, Content Creator', color: 'purple' },
    { emoji: '🔧', name: 'Teknik Otomotif', duration: '1 Tahun', jobs: 'Mekanik, Service Advisor', color: 'orange' },
  ]

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Demo Banner */}
      <div className="bg-indigo-700 text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
        ✦ Demo Template — Website Sekolah/LPK · Webzoka Studio ✦
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-xl">🎓</div>
            <div>
              <p className="font-black text-gray-900 text-sm">LPK Cendekia Utama</p>
              <p className="text-[10px] text-indigo-600 font-bold">Terakreditasi · Bersertifikat BNSP</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-gray-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Beranda</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Program</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Galeri</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Alumni</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Kontak</a>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all">
            Daftar Sekarang
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}} />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-indigo-200 text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
            🏅 Lembaga Pelatihan Kerja Terbaik 2024
          </span>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            Wujudkan Karier<br />
            <span className="text-indigo-300">Impianmu Bersama Kami</span>
          </h1>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Program pelatihan vokasional berkualitas tinggi dengan instruktur berpengalaman, sertifikasi nasional, dan jaminan penempatan kerja.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-white text-indigo-700 font-black px-10 py-4 rounded-full text-sm hover:scale-105 transition-all shadow-xl">
              Daftar Sekarang — Gratis
            </button>
            <button className="border-2 border-white/30 text-white font-bold px-10 py-4 rounded-full text-sm hover:bg-white/10 transition-all">
              Lihat Program
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { num: '4.200+', label: 'Alumni Tersertifikasi' },
              { num: '92%', label: 'Langsung Kerja' },
              { num: '47', label: 'Perusahaan Mitra' },
              { num: '11', label: 'Tahun Berdiri' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-black text-white">{s.num}</p>
                <p className="text-indigo-300 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcement bar */}
      <div className="bg-yellow-50 border-b border-yellow-200 py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="text-yellow-600 text-sm font-black">📢 PENGUMUMAN:</span>
          <p className="text-yellow-800 text-sm font-medium">Penerimaan siswa baru gelombang 3 dibuka hingga 30 Juni 2025. Kuota terbatas!</p>
          <button className="ml-auto text-xs font-black text-yellow-700 underline whitespace-nowrap">Daftar →</button>
        </div>
      </div>

      {/* Programs */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-indigo-600 text-xs font-black uppercase tracking-widest">Pilih Program</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">Program Unggulan Kami</h2>
            <p className="text-gray-500 mt-3 font-medium">Semua program dilengkapi sertifikasi BNSP & garansi penyaluran kerja</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {programs.map((p, i) => (
              <div key={i} className="group flex gap-5 p-7 rounded-[28px] border-2 border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all cursor-pointer">
                <div className="w-16 h-16 bg-indigo-50 group-hover:bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl transition-all shrink-0">
                  {p.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-lg mb-1">{p.name}</h3>
                  <div className="flex gap-3 mb-2">
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">⏱️ {p.duration}</span>
                  </div>
                  <p className="text-gray-500 text-sm">Prospek karier: <span className="font-bold text-gray-700">{p.jobs}</span></p>
                  <button className="mt-3 text-indigo-600 font-bold text-sm hover:underline">Lihat Detail →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="py-16 px-6 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-black mb-4">Siap Mulai Perjalananmu?</h2>
          <p className="text-indigo-200 mb-8 text-lg">Daftar sekarang dan dapatkan konsultasi program gratis dengan tim kami.</p>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-[32px] p-8 max-w-md mx-auto">
            <div className="space-y-3 mb-5">
              <input className="w-full bg-white/20 border border-white/30 rounded-2xl px-4 py-3 text-white placeholder-white/60 text-sm font-medium outline-none" placeholder="Nama Lengkap" />
              <input className="w-full bg-white/20 border border-white/30 rounded-2xl px-4 py-3 text-white placeholder-white/60 text-sm font-medium outline-none" placeholder="No. WhatsApp" />
              <select className="w-full bg-white/20 border border-white/30 rounded-2xl px-4 py-3 text-white/80 text-sm font-medium outline-none">
                <option className="text-gray-900">Pilih Program</option>
                {programs.map(p => <option key={p.name} className="text-gray-900">{p.name}</option>)}
              </select>
            </div>
            <button className="w-full bg-white text-indigo-700 font-black py-3.5 rounded-2xl hover:scale-105 transition-all shadow-xl text-sm">
              Daftar Sekarang — Gratis!
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Kisah Sukses Alumni 🎓</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Fajar M.', program: 'TKJ', company: 'PT Telkom Indonesia', msg: 'Setelah lulus LPK ini, langsung diterima magang dan kini sudah jadi karyawan tetap!', emoji: '👨‍💻' },
              { name: 'Ayu R.', program: 'Akuntansi', company: 'KAP Tanjung & Partner', msg: 'Materi pelatihan sangat relevan dengan dunia kerja. Instrukturnya profesional dan sabar.', emoji: '👩‍💼' },
              { name: 'Dito S.', program: 'Desain Grafis', company: 'Freelancer', msg: 'Dari nol sampai bisa terima klien sendiri. Portofolio yang dibangun selama LPK sangat membantu!', emoji: '🎨' },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-[24px] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl">{t.emoji}</div>
                  <div>
                    <p className="font-black text-gray-900">{t.name}</p>
                    <p className="text-xs text-indigo-600 font-bold">{t.program} · {t.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">&ldquo;{t.msg}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-indigo-900 text-white py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-2xl">🎓</span>
          <span className="font-black text-lg">LPK Cendekia Utama</span>
        </div>
        <p className="text-indigo-300 text-sm mb-2">Jl. Pahlawan No. 12, Semarang · (024) 7xxx-xxxx</p>
        <p className="text-indigo-400 text-xs">© 2025 LPK Cendekia Utama · Powered by Webzoka Studio</p>
      </footer>
    </div>
  )
}
