export default function TokoOnlineDemo() {
  const products = [
    { name: 'Batik Tulis Jogja', price: 'Rp 285.000', category: 'Batik', emoji: '👘', sold: 142, rating: 4.9 },
    { name: 'Tas Anyaman Rotan', price: 'Rp 175.000', category: 'Aksesoris', emoji: '👜', sold: 89, rating: 4.8 },
    { name: 'Sepatu Kulit Lokal', price: 'Rp 420.000', category: 'Sepatu', emoji: '👞', sold: 213, rating: 4.7 },
    { name: 'Keramik Motif Jawa', price: 'Rp 95.000', category: 'Dekorasi', emoji: '🏺', sold: 67, rating: 5.0 },
    { name: 'Sarung Tenun NTT', price: 'Rp 320.000', category: 'Kain', emoji: '🧣', sold: 55, rating: 4.9 },
    { name: 'Gelang Perak Bali', price: 'Rp 145.000', category: 'Perhiasan', emoji: '💍', sold: 178, rating: 4.8 },
  ]

  const categories = [
    { name: 'Batik & Kain', emoji: '👘', count: 48 },
    { name: 'Aksesoris', emoji: '👜', count: 32 },
    { name: 'Dekorasi', emoji: '🏺', count: 27 },
    { name: 'Kuliner', emoji: '🍱', count: 19 },
    { name: 'Perhiasan', emoji: '💎', count: 41 },
  ]

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Demo Banner */}
      <div className="bg-orange-600 text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
        ✦ Demo Template — Toko Online · Japan Arena Studio ✦
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur border-b border-orange-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <span className="text-xl font-black text-gray-900">Nusantara<span className="text-orange-500">Craft</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#" className="hover:text-orange-500 transition-colors">Produk</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Kategori</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Promo</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Tentang</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-orange-500 transition-colors text-xl">🛒</button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-black px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              🔥 Promo Akhir Bulan — Diskon s/d 40%
            </span>
            <h1 className="text-5xl font-black text-gray-900 leading-tight mb-6">
              Kerajinan Asli,<br />
              <span className="text-orange-500">Kualitas Premium</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Ribuan produk kerajinan tangan langsung dari pengrajin lokal Indonesia. Asli, berkualitas, dan berkelanjutan.
            </p>
            <div className="flex gap-3">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full text-sm transition-all shadow-lg shadow-orange-200">
                Belanja Sekarang
              </button>
              <button className="border-2 border-orange-200 text-orange-600 font-bold px-8 py-4 rounded-full text-sm hover:bg-orange-50 transition-all">
                Lihat Katalog
              </button>
            </div>
            <div className="flex items-center gap-6 mt-8">
              <div className="text-center">
                <p className="text-2xl font-black text-gray-900">2.4rb+</p>
                <p className="text-xs text-gray-400 font-semibold">Produk</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-black text-gray-900">18rb+</p>
                <p className="text-xs text-gray-400 font-semibold">Pelanggan</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-black text-gray-900">4.9 ⭐</p>
                <p className="text-xs text-gray-400 font-semibold">Rating</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-[40px] p-12 text-center shadow-2xl shadow-orange-200">
              <div className="text-9xl mb-4">🛍️</div>
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                <p className="text-white font-black text-lg">Flash Sale Hari Ini!</p>
                <p className="text-white/80 text-sm">Berakhir dalam 05:32:18</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2">
              <span className="text-xl">✅</span>
              <div>
                <p className="text-xs font-black text-gray-900">Order Masuk</p>
                <p className="text-[10px] text-gray-400">2 menit lalu</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2">
              <span className="text-xl">🚚</span>
              <div>
                <p className="text-xs font-black text-gray-900">Free Ongkir</p>
                <p className="text-[10px] text-gray-400">Min. Rp 150.000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Kategori Populer</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button key={cat.name} className="flex items-center gap-2 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-200 px-5 py-3 rounded-full text-sm font-bold text-gray-700 whitespace-nowrap transition-all shrink-0">
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
                <span className="text-xs text-gray-400 font-normal">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-gray-900">Produk Terlaris 🔥</h2>
            <button className="text-orange-500 font-bold text-sm hover:underline">Lihat Semua →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[24px] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 text-center">
                  <div className="text-6xl group-hover:scale-110 transition-transform">{p.emoji}</div>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-wider">{p.category}</span>
                  <p className="font-bold text-gray-900 text-sm mt-1 mb-2">{p.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-orange-500 font-black">{p.price}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-xs">⭐</span>
                      <span className="text-xs font-bold text-gray-600">{p.rating}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Terjual {p.sold}x</p>
                  <button className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all">
                    + Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-6 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-orange-500 to-amber-400 rounded-[32px] p-10 text-white text-center">
          <p className="text-4xl mb-3">🎉</p>
          <h3 className="text-3xl font-black mb-2">Gratis Ongkir Se-Indonesia!</h3>
          <p className="text-white/80 mb-6 font-medium">Berlaku untuk pembelian pertama dengan min. order Rp 100.000</p>
          <button className="bg-white text-orange-500 font-black px-10 py-3.5 rounded-full text-sm hover:scale-105 transition-all shadow-xl">
            Klaim Sekarang
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Kata Pelanggan Kami ❤️</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Sari W.', city: 'Jakarta', msg: 'Kualitas batiknya luar biasa! Motifnya cantik dan bahannya nyaman. Sudah order 5 kali dan selalu puas.', rating: 5 },
              { name: 'Budi R.', city: 'Surabaya', msg: 'Pengiriman cepat, packing rapi, produk sesuai foto. Sangat recommended untuk hadiah wisuda!', rating: 5 },
              { name: 'Maya K.', city: 'Bandung', msg: 'Akhirnya nemu toko kerajinan yang beneran original. Harga juga sangat terjangkau untuk kualitas segini.', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-[24px] p-6 shadow-sm">
                <div className="flex text-yellow-400 mb-3">{'⭐'.repeat(t.rating)}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.msg}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center font-black text-orange-500">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏪</span>
              <span className="text-xl font-black">Nusantara<span className="text-orange-400">Craft</span></span>
            </div>
            <p className="text-gray-400 text-sm">Kerajinan asli Indonesia, kualitas terjamin.</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full text-sm transition-all flex items-center gap-2">
              💬 Chat WA
            </button>
            <button className="border border-white/20 text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-white/10 transition-all">
              Lacak Pesanan
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 text-center text-xs text-gray-500">
          © 2025 NusantaraCraft · Powered by Japan Arena Studio
        </div>
      </footer>
    </div>
  )
}
