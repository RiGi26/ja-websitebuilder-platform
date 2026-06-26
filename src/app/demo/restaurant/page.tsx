export default function RestaurantDemo() {
  const menu = [
    { emoji: '🍲', name: 'Sop Buntut Spesial', desc: 'Kaldu sapi pekat 8 jam, sayur segar, disajikan panas', price: 'Rp 58.000', badge: 'Best Seller', badgeColor: 'bg-red-500' },
    { emoji: '🍗', name: 'Ayam Bakar Madu', desc: 'Ayam kampung marinasi 12 jam, bakar dengan madu asli', price: 'Rp 45.000', badge: 'Favorit', badgeColor: 'bg-orange-500' },
    { emoji: '🐟', name: 'Ikan Gurame Goreng', desc: 'Gurame segar 600gr, krispy di luar lembut di dalam', price: 'Rp 75.000', badge: '', badgeColor: '' },
    { emoji: '🥗', name: 'Gado-Gado Jakarta', desc: 'Aneka sayur rebus, tahu, tempe, kerupuk, bumbu kacang', price: 'Rp 32.000', badge: 'Sehat', badgeColor: 'bg-green-500' },
    { emoji: '🍜', name: 'Mie Goreng Jawa', desc: 'Mie kuning, telur, sawi, bumbu rahasia warung', price: 'Rp 28.000', badge: '', badgeColor: '' },
    { emoji: '🥘', name: 'Rendang Daging Sapi', desc: 'Masak 4 jam, bumbu rempah lengkap, daging empuk', price: 'Rp 65.000', badge: 'Spesial', badgeColor: 'bg-amber-600' },
  ]

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Demo Banner */}
      <div className="bg-amber-700 text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
        ✦ Demo Template — Website Restaurant · Webzoka Studio ✦
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 bg-amber-900/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍽️</span>
            <div>
              <p className="font-black text-white text-base leading-tight">Dapur Mama Sari</p>
              <p className="text-amber-300 text-[10px] font-medium">Masakan Rumahan Sejak 1995</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-amber-200">
            <a href="#" className="hover:text-white transition-colors">Menu</a>
            <a href="#" className="hover:text-white transition-colors">Tentang</a>
            <a href="#" className="hover:text-white transition-colors">Reservasi</a>
            <a href="#" className="hover:text-white transition-colors">Lokasi</a>
          </div>
          <button className="bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all">
            🛵 Pesan Antar
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-900 to-orange-900 text-white py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20 text-[200px] leading-none overflow-hidden select-none pointer-events-none flex flex-wrap gap-4 p-4">
          {['🍲','🍗','🥘','🌶️','🍜','🥗'].map((e, i) => <span key={i}>{e}</span>)}
        </div>
        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-amber-200 text-xs font-black px-4 py-2 rounded-full mb-6">
              ⭐⭐⭐⭐⭐ 4.9/5 dari 2.300+ ulasan
            </span>
            <h1 className="text-5xl font-black leading-tight mb-6">
              Masakan Rumahan<br />
              <span className="text-amber-300">yang Bikin Kangen</span>
            </h1>
            <p className="text-amber-200 text-lg leading-relaxed mb-8">
              Cita rasa autentik masakan Jawa yang dimasak dengan cinta. Bahan segar pilihan setiap hari, tanpa MSG, tanpa pengawet.
            </p>
            <div className="flex gap-3">
              <button className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-full text-sm transition-all shadow-lg">
                🛵 Order Sekarang
              </button>
              <button className="border-2 border-white/30 text-white font-bold px-8 py-4 rounded-full text-sm hover:bg-white/10 transition-all">
                📋 Lihat Menu
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['🍲 Sop Buntut', '🍗 Ayam Bakar', '🥘 Rendang', '🐟 Ikan Goreng'].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-[20px] p-5 text-center hover:bg-white/20 transition-all cursor-pointer">
                <p className="text-2xl mb-2">{item.split(' ')[0]}</p>
                <p className="text-white text-sm font-bold">{item.split(' ').slice(1).join(' ')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operational Info */}
      <div className="bg-amber-50 border-y border-amber-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 text-sm font-semibold text-amber-900">
          <span>🕐 Buka: 10.00 – 21.00 WIB</span>
          <span>📍 Jl. Malioboro No. 88, Yogyakarta</span>
          <span>🚗 Parkir Luas Tersedia</span>
          <span>💳 Cash & QRIS Diterima</span>
        </div>
      </div>

      {/* Menu */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-700 text-xs font-black uppercase tracking-widest">Menu Kami</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">Masakan Pilihan Hari Ini</h2>
          </div>
          <div className="flex gap-3 justify-center mb-8 flex-wrap">
            {['Semua', 'Nasi & Lauk', 'Soto & Sop', 'Mie & Bakso', 'Minuman'].map(cat => (
              <button key={cat} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${cat === 'Semua' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-amber-50'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {menu.map((item, i) => (
              <div key={i} className="group bg-white border border-gray-100 rounded-[24px] overflow-hidden hover:shadow-xl transition-all">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-10 text-center relative">
                  <div className="text-7xl group-hover:scale-110 transition-transform">{item.emoji}</div>
                  {item.badge && (
                    <span className={`absolute top-3 right-3 ${item.badgeColor} text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-black text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-amber-600 font-black text-lg">{item.price}</p>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all">
                      + Pesan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="py-16 px-6 bg-amber-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Reservasi Meja</h2>
          <p className="text-amber-200 mb-8">Jamin tempat duduk Anda untuk acara keluarga, arisan, atau gathering kantor</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-white placeholder-white/50 text-sm outline-none" placeholder="Nama & No. HP" />
            <button className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-3 rounded-full text-sm transition-all whitespace-nowrap">
              Pesan via WA
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-stone-900 text-white py-10 px-6 text-center">
        <p className="text-2xl mb-2">🍽️</p>
        <p className="font-black text-lg mb-1">Dapur Mama Sari</p>
        <p className="text-stone-400 text-sm mb-1">Jl. Malioboro No. 88, Yogyakarta · 0812-xxxx-xxxx</p>
        <p className="text-stone-500 text-xs">© 2025 Dapur Mama Sari · Powered by Webzoka Studio</p>
      </footer>
    </div>
  )
}
