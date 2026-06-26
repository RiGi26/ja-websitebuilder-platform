export default function JastipDemo() {
  const items = [
    { emoji: '👟', name: 'Nike Air Max 270', origin: 'Jepang 🇯🇵', price: 'Rp 1.850.000', stock: 'Ready', color: 'text-green-500' },
    { emoji: '🎮', name: 'Nintendo Switch OLED', origin: 'Jepang 🇯🇵', price: 'Rp 4.200.000', stock: 'Ready', color: 'text-green-500' },
    { emoji: '💄', name: 'SKII Facial Treatment Essence', origin: 'Korea 🇰🇷', price: 'Rp 1.650.000', stock: 'Indent', color: 'text-yellow-500' },
    { emoji: '👜', name: 'Coach Mini Bag', origin: 'Amerika 🇺🇸', price: 'Rp 3.400.000', stock: 'Ready', color: 'text-green-500' },
    { emoji: '📷', name: 'Fujifilm Instax Mini 12', origin: 'Jepang 🇯🇵', price: 'Rp 980.000', stock: 'Ready', color: 'text-green-500' },
    { emoji: '🧴', name: 'Hada Labo Premium Set', origin: 'Jepang 🇯🇵', price: 'Rp 420.000', stock: 'Ready', color: 'text-green-500' },
  ]

  const steps = [
    { num: '01', emoji: '📝', title: 'Request Barang', desc: 'Kirimkan link produk atau deskripsi barang yang ingin dititip lewat form atau WA kami.' },
    { num: '02', emoji: '💳', title: 'DP 50%', desc: 'Konfirmasi harga + ongkir, lakukan DP 50%. Kami langsung proses pembelian.' },
    { num: '03', emoji: '✈️', title: 'Kami Belanjakan', desc: 'Tim kami belanja langsung di toko/marketplace resmi negara tujuan.' },
    { num: '04', emoji: '📦', title: 'Terima di Rumah', desc: 'Barang tiba, lakukan pelunasan, dan kami kirim ke alamat Anda. Aman & terjamin!' },
  ]

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Demo Banner */}
      <div className="bg-rose-600 text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
        ✦ Demo Template — Custom Jastip · Webzoka Studio ✦
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur border-b border-pink-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <div>
              <span className="font-black text-gray-900 text-lg">JastipKu</span>
              <span className="text-rose-500 font-black text-lg"> Express</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-gray-600">
            <a href="#" className="hover:text-rose-500 transition-colors">Katalog</a>
            <a href="#" className="hover:text-rose-500 transition-colors">Cara Order</a>
            <a href="#" className="hover:text-rose-500 transition-colors">Cek Status</a>
            <a href="#" className="hover:text-rose-500 transition-colors">Testimoni</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="border border-rose-200 text-rose-500 font-bold text-sm px-4 py-2 rounded-full hover:bg-rose-50 transition-all">
              Cek Status
            </button>
            <button className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all">
              Order Sekarang
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-900 via-pink-900 to-rose-800 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-400/10 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex gap-2 mb-6">
              {['🇯🇵 Jepang', '🇰🇷 Korea', '🇺🇸 Amerika', '🇬🇧 UK'].map(c => (
                <span key={c} className="bg-white/10 border border-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">{c}</span>
              ))}
            </div>
            <h1 className="text-5xl font-black leading-tight mb-6">
              Titip Belanja<br />
              <span className="text-pink-300">Luar Negeri</span><br />
              Aman & Terpercaya
            </h1>
            <p className="text-rose-200 text-lg leading-relaxed mb-8">
              Dapatkan produk original dari Jepang, Korea, Amerika, dan Eropa dengan harga transparan. Sudah dipercaya 5.000+ pembeli Indonesia.
            </p>
            <div className="flex gap-3">
              <button className="bg-white text-rose-700 font-black px-8 py-4 rounded-full text-sm hover:scale-105 transition-all shadow-xl">
                Request Barang
              </button>
              <button className="border-2 border-white/30 text-white font-bold px-8 py-4 rounded-full text-sm hover:bg-white/10 transition-all">
                Lihat Katalog
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: '✅', title: 'Original 100%', desc: 'Pembelian langsung di toko resmi' },
              { emoji: '🔍', title: 'Tracking Real-time', desc: 'Pantau status order 24/7' },
              { emoji: '💰', title: 'Harga Transparan', desc: 'Tidak ada biaya tersembunyi' },
              { emoji: '🛡️', title: 'Garansi Aman', desc: 'Full refund jika barang rusak' },
            ].map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 backdrop-blur rounded-[20px] p-5">
                <div className="text-2xl mb-2">{f.emoji}</div>
                <p className="font-black text-sm">{f.title}</p>
                <p className="text-rose-300 text-xs mt-1 font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-rose-50 border-y border-rose-100 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-10">
          {[
            { num: '5.200+', label: 'Pembeli Puas' },
            { num: '12.400+', label: 'Paket Terkirim' },
            { num: '4.9/5', label: 'Rating Kepuasan' },
            { num: '0', label: 'Kasus Penipuan' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-rose-600">{s.num}</p>
              <p className="text-gray-500 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-rose-500 text-xs font-black uppercase tracking-widest">Cara Kerja</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">Order dalam 4 Langkah Mudah</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-rose-100 z-0" />
                )}
                <div className="relative z-10 w-24 h-24 bg-rose-50 border-2 border-rose-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  {s.emoji}
                </div>
                <span className="text-xs font-black text-rose-400 uppercase tracking-wider">{s.num}</span>
                <h3 className="font-black text-gray-900 mt-1 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-gray-900">Katalog Tersedia 🛍️</h2>
            <button className="text-rose-500 font-bold text-sm hover:underline">Semua Katalog →</button>
          </div>
          <div className="flex gap-3 mb-6 flex-wrap">
            {['Semua', '🇯🇵 Jepang', '🇰🇷 Korea', '🇺🇸 Amerika', '🎮 Elektronik', '👟 Fashion', '💄 Beauty'].map(c => (
              <button key={c} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${c === 'Semua' ? 'bg-rose-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-rose-200'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {items.map((item, i) => (
              <div key={i} className="bg-white rounded-[24px] border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-10 text-center">
                  <div className="text-6xl group-hover:scale-110 transition-transform">{item.emoji}</div>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">{item.origin}</p>
                  <h3 className="font-black text-gray-900 mb-2">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-rose-500 font-black text-lg">{item.price}</p>
                    <span className={`text-[10px] font-black ${item.color} bg-gray-50 px-2.5 py-1 rounded-full border border-current/20`}>
                      {item.stock}
                    </span>
                  </div>
                  <button className="w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all">
                    + Request Barang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Pembeli Setia Kami ❤️</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Putri A.', city: 'Jakarta', order: 'Nike + Hada Labo', msg: 'Sudah 8 kali order, selalu puas! Barang original, packing aman, harga jujur. Recommended banget!', emoji: '👩' },
              { name: 'Kevin R.', city: 'Bandung', order: 'Nintendo Switch', msg: 'Awalnya ragu, tapi ternyata luar biasa. Barang sampai dalam kondisi perfect dengan bukti pembelian resmi.', emoji: '👨' },
              { name: 'Dina M.', city: 'Surabaya', order: 'Korean Skincare Set', msg: 'Real-time tracking-nya sangat membantu. Bisa pantau status order dari beli sampai tiba di tangan.', emoji: '👩' },
            ].map((t, i) => (
              <div key={i} className="bg-rose-50 border border-rose-100 rounded-[24px] p-6">
                <div className="text-rose-400 text-sm mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&ldquo;{t.msg}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-200 rounded-full flex items-center justify-center text-xl">{t.emoji}</div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{t.name} · {t.city}</p>
                    <p className="text-xs text-rose-500 font-medium">Beli: {t.order}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl">✈️</span>
          <span className="font-black text-lg">JastipKu <span className="text-rose-400">Express</span></span>
        </div>
        <p className="text-gray-400 text-sm mb-1">WA: 0812-xxxx-xxxx · IG: @jastipku_express</p>
        <p className="text-gray-500 text-xs">© 2025 JastipKu Express · Powered by Webzoka Studio</p>
      </footer>
    </div>
  )
}
