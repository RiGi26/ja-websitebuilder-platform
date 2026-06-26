export default function BlogDemo() {
  const posts = [
    { emoji: '🤖', title: 'AI Generatif Mengubah Cara Kerja Developer di 2025', category: 'Teknologi', time: '8 min read', date: '27 Mei 2025', views: '12.4rb' },
    { emoji: '📈', title: 'Strategi Pertumbuhan UMKM Digital: Dari 0 ke 100 Juta/Bulan', category: 'Bisnis', time: '6 min read', date: '25 Mei 2025', views: '8.7rb' },
    { emoji: '📱', title: 'Review: 5 Aplikasi Produktivitas Terbaik untuk Remote Worker', category: 'Lifestyle', time: '5 min read', date: '23 Mei 2025', views: '6.2rb' },
    { emoji: '🔐', title: 'Panduan Keamanan Digital: Lindungi Data Bisnis Anda', category: 'Keamanan', time: '10 min read', date: '20 Mei 2025', views: '9.1rb' },
    { emoji: '💡', title: 'Startup Indonesia yang Berhasil Menembus Pasar ASEAN', category: 'Startup', time: '7 min read', date: '18 Mei 2025', views: '15.3rb' },
    { emoji: '🌐', title: 'Web 3.0 dan Masa Depan Internet: Apa yang Perlu Anda Tahu', category: 'Teknologi', time: '12 min read', date: '15 Mei 2025', views: '11.8rb' },
  ]

  const categories = ['Semua', 'Teknologi', 'Bisnis', 'Startup', 'Lifestyle', 'Keamanan']

  return (
    <div className="min-h-screen bg-[#0F1117] text-white font-sans">
      {/* Demo Banner */}
      <div className="bg-emerald-700 text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
        ✦ Demo Template — Blog / Media · Webzoka Studio ✦
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 bg-[#0F1117]/95 backdrop-blur border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-sm">K</div>
            <span className="font-black text-lg tracking-tight">KABAR<span className="text-emerald-400">DIGITAL</span></span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-gray-400">
            {categories.slice(1).map(c => (
              <a key={c} href="#" className="hover:text-white transition-colors">{c}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-white transition-colors">🔍</button>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-5 py-2 rounded-full transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </nav>

      {/* Breaking News Ticker */}
      <div className="bg-emerald-600 py-2.5 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <span className="bg-white text-emerald-700 text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-wider shrink-0">TERBARU</span>
          <div className="flex gap-8 overflow-hidden text-sm font-medium text-white/90 whitespace-nowrap">
            <span>🔴 OpenAI umumkan GPT-5 dengan kemampuan reasoning baru</span>
            <span>📊 IHSG tembus 7.800, investor asing kembali masuk pasar</span>
            <span>🚀 Startup AI Indonesia raih pendanaan $50 juta dari Sequoia</span>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-900/60 to-teal-900/60 border border-white/5 rounded-[32px] p-10 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 text-[200px] opacity-10 leading-none">🚀</div>
            <div className="relative z-10 md:max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-3 py-1.5 rounded-full border border-emerald-500/30 uppercase">
                  🔥 Artikel Utama
                </span>
                <span className="text-gray-500 text-xs font-medium">27 Mei 2025</span>
              </div>
              <h2 className="text-4xl font-black leading-tight mb-4">
                Indonesia Masuki Era<br />
                <span className="text-emerald-400">Super App Economy</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Ekosistem digital Indonesia kini dikuasai oleh super app yang mengintegrasikan layanan keuangan, transportasi, e-commerce, dan kesehatan dalam satu platform. Bagaimana dampaknya terhadap UMKM?
              </p>
              <div className="flex items-center gap-4">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-3 rounded-full text-sm transition-all">
                  Baca Selengkapnya
                </button>
                <span className="text-gray-500 text-sm font-medium">15 min read · 24.7rb views</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <div className="px-6 mb-8">
        <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto pb-2">
          {categories.map(c => (
            <button key={c} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${c === 'Semua' ? 'bg-emerald-600 text-white' : 'bg-white/5 border border-white/10 text-gray-400 hover:border-emerald-500/30 hover:text-white'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Article Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            {posts.map((p, i) => (
              <article key={i} className="group bg-white/3 border border-white/5 rounded-[24px] overflow-hidden hover:border-emerald-500/20 hover:bg-white/5 transition-all cursor-pointer">
                <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/30 p-10 text-center text-6xl group-hover:scale-105 transition-transform">
                  {p.emoji}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-wider">{p.category}</span>
                    <span className="text-gray-600 text-xs">{p.time}</span>
                  </div>
                  <h3 className="font-black text-white leading-snug mb-3 group-hover:text-emerald-300 transition-colors">
                    {p.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>{p.date}</span>
                    <span>👁 {p.views}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6 bg-emerald-900/20 border-t border-white/5">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-4xl mb-4">📬</p>
          <h2 className="text-3xl font-black mb-3">Newsletter Mingguan</h2>
          <p className="text-gray-400 mb-6 font-medium">Rangkuman berita terpenting dikirim langsung ke inbox Anda setiap Senin pagi.</p>
          <div className="flex gap-2">
            <input className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-emerald-500/50" placeholder="email@anda.com" />
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-full text-sm transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-3">32.000+ subscribers · Tanpa spam</p>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="font-black text-base mb-1">KABAR<span className="text-emerald-400">DIGITAL</span></p>
        <p className="text-gray-500 text-xs">© 2025 KabarDigital · Powered by Webzoka Studio</p>
      </footer>
    </div>
  )
}
