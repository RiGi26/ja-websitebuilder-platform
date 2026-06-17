'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Loader2, CheckCircle2, Minus, Plus, Store, Bike } from 'lucide-react'
import { formatMoney, moneyFromConfig } from '@/lib/format-money'
import type { LocaleConfig, PreorderConfig } from '@/types/websitebuilder'

type MenuLite = {
  id: string
  nama: string
  harga: number
  kategori: string | null
  gambar_url: string | null
  is_sold_out: boolean
}

export default function POClient({
  slug, namaWebsite, primary, preorder, localeConfig, menu,
}: {
  slug: string
  namaWebsite: string
  primary?: string
  preorder: PreorderConfig
  localeConfig?: LocaleConfig
  menu: MenuLite[]
}) {
  const { locale, currency } = moneyFromConfig(localeConfig)
  const fmt = (n: number) => formatMoney(n, locale, currency)
  const phoneCc = localeConfig?.phone_cc || '62'

  const fulfillOptions = preorder.fulfillment?.length ? preorder.fulfillment : (['pickup', 'delivery'] as const)
  const [ftype, setFtype] = useState<'pickup' | 'delivery'>(fulfillOptions[0] as 'pickup' | 'delivery')
  const [qty, setQty] = useState<Record<string, number>>({})
  const [form, setForm] = useState({ nama: '', hp: '', email: '', alamat: '', date: '', time: '', catatan: '' })
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<null | { orderShort: string }>(null)

  // min tanggal = hari ini (set pasca-mount → hindari mismatch hydration)
  const [today, setToday] = useState('')
  useEffect(() => { setToday(new Date().toISOString().slice(0, 10)) }, [])

  const inp = 'w-full text-sm rounded-xl border border-black/10 p-3 focus:outline-none focus:ring-2 focus:ring-black/10'

  const grouped = useMemo(() => {
    const g: Record<string, MenuLite[]> = {}
    for (const m of menu) { const k = m.kategori || 'Menu'; (g[k] ??= []).push(m) }
    return Object.entries(g)
  }, [menu])

  const lines = useMemo(
    () => menu.filter((m) => (qty[m.id] ?? 0) > 0).map((m) => ({ ...m, qty: qty[m.id] })),
    [menu, qty],
  )
  const total = lines.reduce((a, b) => a + b.harga * b.qty, 0)
  const totalQty = lines.reduce((a, b) => a + b.qty, 0)

  const bump = (id: string, d: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + d) }))

  const submit = async () => {
    if (lines.length === 0) return alert('Pilih minimal satu menu.')
    if (!form.nama.trim() || !form.hp.trim()) return alert('Nama & nomor WhatsApp wajib diisi.')
    if (!form.date) return alert('Pilih tanggal pengambilan/pengantaran.')
    if (ftype === 'delivery' && !form.alamat.trim()) return alert('Alamat pengantaran wajib diisi.')
    setBusy(true)
    try {
      const res = await fetch('/api/preorder/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          pembeli: { nama: form.nama, hp: form.hp, email: form.email, catatan: form.catatan },
          fulfillment: { type: ftype, date: form.date, time: form.time, alamat: form.alamat },
          items: lines.map((l) => ({ id: l.id, qty: l.qty })),
        }),
      })
      const json = await res.json()
      if (!res.ok) { alert(`Gagal: ${json.error ?? 'unknown'}`); return }
      setDone({ orderShort: String(json.order_id).slice(0, 8).toUpperCase() })
    } catch { alert('Error koneksi') } finally { setBusy(false) }
  }

  // ── PO ditutup ──
  if (!preorder.open) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
        <div className="bg-white rounded-[32px] p-10 max-w-md w-full apple-shadow border border-black/[0.03] text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pre-Order sedang ditutup</h1>
          <p className="text-sm text-gray-500 mb-6">
            {preorder.open_label ?? 'Ronde pemesanan berikutnya akan segera dibuka. Pantau terus, ya!'}
          </p>
          <Link href={`/${slug}`} className="inline-block text-sm font-bold text-gray-900 underline">← Kembali ke halaman</Link>
        </div>
      </div>
    )
  }

  // ── Konfirmasi ──
  if (done) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
        <div className="bg-white rounded-[32px] p-10 max-w-md w-full apple-shadow border border-black/[0.03] text-center">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pesanan diterima! 🎉</h1>
          <p className="text-sm text-gray-500 mb-2">
            Nomor pesanan Anda: <span className="font-bold text-gray-900">{done.orderShort}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Terima kasih! {namaWebsite} akan mengonfirmasi ketersediaan & detail pembayaran via WhatsApp.
          </p>
          <Link href={`/${slug}`} className="inline-block text-sm font-bold text-gray-900 underline">← Kembali ke halaman</Link>
        </div>
      </div>
    )
  }

  // ── Form ──
  return (
    <div className="min-h-screen bg-[#F5F5F7] py-10 px-4 pb-28">
      <div className="max-w-2xl mx-auto">
        <Link href={`/${slug}`} className="flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6 hover:text-gray-700">
          <ChevronLeft size={14} /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Pesan (Pre-Order)</h1>
        <p className="text-sm text-gray-500 mb-2">{namaWebsite}</p>
        {preorder.open_label && (
          <p className="text-[13px] text-gray-600 mb-6 inline-flex items-center gap-2 bg-white rounded-full px-3 py-1.5 apple-shadow border border-black/[0.03]">
            🕒 {preorder.open_label}
          </p>
        )}

        {/* MENU */}
        <div className="bg-white rounded-3xl p-6 apple-shadow border border-black/[0.03] mb-5 mt-2">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Pilih Menu</h2>
          <div className="space-y-6">
            {grouped.map(([kat, list]) => (
              <div key={kat}>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">{kat}</p>
                <div className="space-y-2">
                  {list.map((m) => {
                    const n = qty[m.id] ?? 0
                    return (
                      <div key={m.id} className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border ${m.is_sold_out ? 'border-black/5 opacity-55' : 'border-black/10'}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          {m.gambar_url
                            ? <img src={m.gambar_url} alt={m.nama} className="h-12 w-12 rounded-lg object-cover shrink-0" loading="lazy" />
                            : <div className="h-12 w-12 rounded-lg bg-gray-100 shrink-0" />}
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{m.nama}</p>
                            <p className="text-[13px] text-gray-500">{m.harga > 0 ? fmt(m.harga) : 'Tanya'}</p>
                          </div>
                        </div>
                        {m.is_sold_out ? (
                          <span className="text-[11px] font-bold text-gray-500 bg-gray-100 rounded-full px-3 py-1.5 shrink-0">Habis</span>
                        ) : (
                          <div className="flex items-center gap-2 shrink-0">
                            {n > 0 && (
                              <button
                                type="button" aria-label={`Kurangi ${m.nama}`} onClick={() => bump(m.id, -1)}
                                className="h-11 w-11 rounded-full border border-black/10 flex items-center justify-center text-gray-700 active:scale-95 transition-transform"
                              >
                                <Minus size={16} />
                              </button>
                            )}
                            {n > 0 && <span className="w-5 text-center text-sm font-bold tabular-nums">{n}</span>}
                            <button
                              type="button" aria-label={`Tambah ${m.nama}`} onClick={() => bump(m.id, 1)}
                              style={primary ? { backgroundColor: primary, color: '#fff', borderColor: primary } : undefined}
                              className="h-11 w-11 rounded-full border border-black/10 flex items-center justify-center text-gray-900 active:scale-95 transition-transform"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PEMENUHAN */}
        <div className="bg-white rounded-3xl p-6 apple-shadow border border-black/[0.03] mb-5">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Cara Terima</h2>
          {fulfillOptions.length > 1 ? (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {fulfillOptions.map((opt) => {
                const active = ftype === opt
                return (
                  <button
                    key={opt} type="button" onClick={() => setFtype(opt as 'pickup' | 'delivery')}
                    style={active && primary ? { borderColor: primary } : undefined}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-bold transition-colors ${active ? 'border-gray-900 bg-gray-50 text-gray-900' : 'border-black/10 text-gray-500'}`}
                  >
                    {opt === 'delivery' ? <Bike size={18} /> : <Store size={18} />}
                    {opt === 'delivery' ? 'Diantar' : 'Ambil sendiri'}
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-700 mb-4 flex items-center gap-2">
              {ftype === 'delivery' ? <Bike size={18} /> : <Store size={18} />}
              {ftype === 'delivery' ? 'Diantar' : 'Ambil sendiri'}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-400">Tanggal *</label>
              <input type="date" min={today || undefined} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inp} />
            </div>
            <div>
              <label className="text-[11px] text-gray-400">Jam (opsional)</label>
              <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="mis. 12:00–14:00" className={inp} />
            </div>
          </div>
          {ftype === 'delivery' && (
            <div className="mt-3">
              <label className="text-[11px] text-gray-400">Alamat pengantaran (Jepang) *</label>
              <textarea value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} placeholder="Prefektur, kota, alamat lengkap (banchi)" rows={2} className={inp} />
            </div>
          )}
        </div>

        {/* DATA PEMESAN */}
        <div className="bg-white rounded-3xl p-6 apple-shadow border border-black/[0.03] space-y-3">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Data Pemesan</h2>
          <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama lengkap *" className={inp} />
          <div>
            <input value={form.hp} onChange={(e) => setForm({ ...form, hp: e.target.value })} placeholder="Nomor WhatsApp *" inputMode="tel" className={inp} />
            <p className="text-[11px] text-gray-400 mt-1">Kode negara +{phoneCc}. Contoh: {phoneCc === '81' ? '09012345678' : '081234567890'}</p>
          </div>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (opsional)" className={inp} />
          <textarea value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} placeholder="Catatan pesanan (opsional)" rows={2} className={inp} />
        </div>
      </div>

      {/* BAR TOTAL STICKY */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-black/5 px-4 py-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-400">{totalQty > 0 ? `${totalQty} item` : 'Belum ada item'}</p>
            <p className="text-lg font-extrabold text-gray-900 tabular-nums" style={primary ? { color: primary } : undefined}>{fmt(total)}</p>
          </div>
          <button
            onClick={submit} disabled={busy || lines.length === 0}
            style={primary ? { backgroundColor: primary } : undefined}
            className="py-3.5 px-7 rounded-2xl text-white font-bold bg-gray-900 hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 shrink-0"
          >
            {busy ? <Loader2 size={18} className="animate-spin" /> : 'Kirim Pesanan'}
          </button>
        </div>
      </div>
    </div>
  )
}
