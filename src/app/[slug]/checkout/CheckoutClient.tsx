'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Loader2 } from 'lucide-react'
import type { CartItem } from '@/app/components/cart/CartProvider'

function rupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

// Checkout berdiri sendiri (baca keranjang dari localStorage langsung) agar
// halaman ini tak perlu dibungkus CartProvider. Submit ke Snap menyusul Stage 1.4.
export default function CheckoutClient({ slug, namaWebsite, primary }: { slug: string; namaWebsite: string; primary?: string }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [form, setForm] = useState({ nama: '', hp: '', email: '', alamat: '', catatan: '' })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`ja_cart:${slug}`)
      if (raw) setItems(JSON.parse(raw))
    } catch { /* noop */ }
    setHydrated(true)
  }, [slug])

  const subtotal = items.reduce((a, b) => a + b.harga * b.qty, 0)
  const inp = 'w-full text-sm rounded-xl border border-black/10 p-3 focus:outline-none focus:ring-2 focus:ring-black/10'

  const submit = async () => {
    if (!form.nama.trim() || !form.hp.trim()) return alert('Nama & nomor HP wajib diisi.')
    if (items.length === 0) return alert('Keranjang kosong.')
    setBusy(true)
    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          pembeli: form,
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
        }),
      })
      const json = await res.json()
      if (!res.ok) { alert(`Gagal: ${json.error ?? 'unknown'}`); return }
      if (json.redirect_url) {
        window.location.href = json.redirect_url
      } else {
        alert('Pembayaran belum aktif untuk toko ini. Hubungi penjual.')
      }
    } catch { alert('Error koneksi') } finally { setBusy(false) }
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-500 mb-4">Keranjang kosong.</p>
        <Link href={`/${slug}`} className="text-sm font-bold text-gray-900 underline">← Kembali ke toko</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href={`/${slug}`} className="flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6 hover:text-gray-700">
          <ChevronLeft size={14} /> Lanjut belanja
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Checkout</h1>
        <p className="text-sm text-gray-500 mb-6">{namaWebsite}</p>

        {/* ringkasan */}
        <div className="bg-white rounded-3xl p-6 apple-shadow border border-black/[0.03] mb-5">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Pesanan</h2>
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{it.nama} <span className="text-gray-400">×{it.qty}</span></span>
                <span className="font-bold text-gray-900">{rupiah(it.harga * it.qty)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-black/5">
            <span className="text-sm font-bold text-gray-900">Total</span>
            <span className="text-lg font-extrabold" style={primary ? { color: primary } : undefined}>{rupiah(subtotal)}</span>
          </div>
        </div>

        {/* form pembeli */}
        <div className="bg-white rounded-3xl p-6 apple-shadow border border-black/[0.03] space-y-3">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Data Pembeli</h2>
          <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama lengkap *" className={inp} />
          <input value={form.hp} onChange={(e) => setForm({ ...form, hp: e.target.value })} placeholder="Nomor WhatsApp *" inputMode="tel" className={inp} />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (opsional)" className={inp} />
          <textarea value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} placeholder="Alamat pengiriman" rows={2} className={inp} />
          <textarea value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} placeholder="Catatan (opsional)" rows={2} className={inp} />

          <button
            onClick={submit} disabled={busy}
            style={primary ? { backgroundColor: primary } : undefined}
            className="w-full py-3.5 rounded-2xl text-white font-bold bg-gray-900 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {busy ? <Loader2 size={18} className="animate-spin" /> : 'Bayar Sekarang'}
          </button>
          <p className="text-[11px] text-gray-400 text-center">Pembayaran diproses aman via Midtrans.</p>
        </div>
      </div>
    </div>
  )
}
