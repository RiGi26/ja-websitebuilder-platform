export default function PersonalBrandingDemo() {
  const projects = [
    { emoji: '📱', name: 'Fintech Mobile App', client: 'PT Dana Sejahtera', type: 'UI/UX Design', year: '2024' },
    { emoji: '🛒', name: 'E-commerce Redesign', client: 'Tokopedia UMKM', type: 'Product Design', year: '2024' },
    { emoji: '🏥', name: 'Healthcare Dashboard', client: 'RS Medika Prima', type: 'UI Design', year: '2023' },
    { emoji: '🎓', name: 'LMS Platform', client: 'EdTech Startup', type: 'UX Research + Design', year: '2023' },
  ]

  const skills = ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design System', 'React', 'Tailwind CSS', 'User Testing']

  return (
    <div className="min-h-screen bg-[#0A0A0F] font-sans text-white">
      {/* Demo Banner */}
      <div className="bg-violet-700 text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
        ✦ Demo Template — Personal Branding · Japan Arena Studio ✦
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 bg-[#0A0A0F]/90 backdrop-blur border-b border-white/5 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-black text-lg">
            <span className="text-white">dimas</span>
            <span className="text-violet-400">.</span>
            <span className="text-gray-400">arief</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Tentang</a>
            <a href="#" className="hover:text-white transition-colors">Portofolio</a>
            <a href="#" className="hover:text-white transition-colors">Layanan</a>
            <a href="#" className="hover:text-white transition-colors">Blog</a>
          </div>
          <button className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all">
            Hire Me ✨
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Available for freelance work
            </div>
            <h1 className="text-6xl font-black leading-tight mb-6">
              UI/UX Designer<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                & Digital Kreator
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Halo! Saya Dimas Arief. Saya bantu startup dan brand tumbuh lewat desain produk yang intuitif, estetis, dan berdampak nyata pada konversi.
            </p>
            <div className="flex gap-3 mb-10">
              <button className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-full text-sm transition-all shadow-lg shadow-violet-900">
                Lihat Portofolio
              </button>
              <button className="border border-white/10 text-white font-bold px-8 py-4 rounded-full text-sm hover:bg-white/5 transition-all">
                Download CV
              </button>
            </div>
            <div className="flex gap-6">
              {[
                { num: '4+', label: 'Tahun Pengalaman' },
                { num: '60+', label: 'Proyek Selesai' },
                { num: '98%', label: 'Klien Puas' },
              ].map((s, i) => (
                <div key={i} className="border-l border-white/10 pl-5 first:border-0 first:pl-0">
                  <p className="text-2xl font-black text-violet-400">{s.num}</p>
                  <p className="text-gray-500 text-xs font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="w-full aspect-square bg-gradient-to-br from-violet-800/50 to-pink-800/30 rounded-[40px] flex items-center justify-center text-[120px] border border-violet-500/20">
              👨‍💻
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm font-black text-white">Proyek Selesai</p>
                <p className="text-xs text-gray-400">Figma App — 2 hari lalu</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
              <div className="text-yellow-400 text-sm mb-1">⭐⭐⭐⭐⭐</div>
              <p className="text-xs font-bold text-white">&ldquo;Outstanding work!&rdquo;</p>
              <p className="text-[10px] text-gray-400">— Client Review</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-12 px-6 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-500 text-xs font-black uppercase tracking-widest mb-6">Tools & Keahlian</p>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map(s => (
              <span key={s} className="bg-white/5 border border-white/10 text-gray-300 text-sm font-bold px-5 py-2.5 rounded-full hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-violet-300 transition-all cursor-pointer">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-violet-400 text-xs font-black uppercase tracking-widest mb-2">Portofolio</p>
              <h2 className="text-4xl font-black">Proyek Pilihan</h2>
            </div>
            <button className="text-gray-400 font-bold text-sm hover:text-white transition-colors">Lihat Semua →</button>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((p, i) => (
              <div key={i} className="group bg-white/3 border border-white/5 rounded-[28px] p-7 hover:bg-white/6 hover:border-violet-500/20 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-violet-500/10 transition-all">
                    {p.emoji}
                  </div>
                  <span className="text-gray-500 text-xs font-bold">{p.year}</span>
                </div>
                <h3 className="font-black text-white text-xl mb-1">{p.name}</h3>
                <p className="text-gray-500 text-sm font-medium mb-3">{p.client}</p>
                <span className="text-xs font-bold bg-violet-500/10 text-violet-400 px-3 py-1.5 rounded-full border border-violet-500/20">
                  {p.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-white/2">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-10">Kata Klien Saya 💬</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Andi S.', role: 'CTO, Fintech Startup', msg: 'Dimas tidak hanya membuat desain yang cantik, tapi juga memahami kebutuhan user kami dengan sangat baik.', rating: 5 },
              { name: 'Lisa R.', role: 'Product Manager', msg: 'Kerja sama yang sangat profesional. Revisi responsif, komunikasi lancar, hasil akhir melebihi ekspektasi!', rating: 5 },
              { name: 'Budi T.', role: 'CEO, E-commerce', msg: 'Setelah redesign dengan Dimas, conversion rate toko online kami naik 34% dalam 2 bulan pertama.', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-white/3 border border-white/5 rounded-[24px] p-6">
                <div className="text-violet-400 text-sm mb-3">{'★'.repeat(t.rating)}</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">&ldquo;{t.msg}&rdquo;</p>
                <div>
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">👋</div>
          <h2 className="text-4xl font-black mb-4">Punya Proyek Seru?</h2>
          <p className="text-gray-400 mb-8 text-lg">Yuk diskusi! Saya open untuk proyek freelance, kolaborasi, dan peluang kerja penuh waktu.</p>
          <a href="https://wa.me/6281234567890" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-10 py-4 rounded-full text-sm transition-all shadow-xl shadow-violet-900">
            💬 Chat via WhatsApp
          </a>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-gray-600 text-sm">© 2025 Dimas Arief · Powered by Japan Arena Studio</p>
      </footer>
    </div>
  )
}
