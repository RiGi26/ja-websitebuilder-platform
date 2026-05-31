'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react'
import type { Service } from '@/types/websitebuilder'

function rupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export default function BookingClient({
  slug, namaWebsite, primary, services, initialServiceId,
}: {
  slug: string
  namaWebsite: string
  primary?: string
  services: Service[]
  initialServiceId: string
}) {
  const [serviceId, setServiceId] = useState(initialServiceId)
  const [form, setForm] = useState({ nama: '', kontak: '', email: '', jadwal: '', catatan: '' })
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<null | { requiresPayment: boolean; note?: string }>(null)

  const selected = services.find((s) => s.id === serviceId) ?? services[0]
  const inp = 'w-full text-sm rounded-xl border border-black/10 p-3 focus:outline-none focus:ring-2 focus:ring-black/10'

  const submit = async () => {
    if (!form.nama.trim() || !form.kontak.trim()) return alert('Nama & nomor kontak wajib diisi.')
    setBusy(true)
    try {
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, service_id: serviceId, jadwal: form.jadwal || null, pemesan: form }),
      })
      const json = await res.json()
      if (!res.ok && !json.booking_id) { alert(`Gagal: ${json.error ?? 'unknown'}`); return }
      // Perlu bayar DP & ada redirect → ke Midtrans.
      if (json.redirect_url) { window.location.href = json.redirect_url; return }
      // Tercatat tanpa pembayaran online (DP 0) atau pembayaran belum aktif.
      setDone({ requiresPayment: !!json.requires_payment, note: json.error })
    } catch { alert('Error koneksi') } finally { setBusy(false) }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
        <div className="bg-white rounded-[32px] p-10 max-w-md w-full apple-shadow border border-black/[0.03] text-center">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reservasi Terkirim 🎉</h1>
          <p className="text-sm text-gray-500 mb-6">
            {done.note ?? 'Terima kasih! Reservasi Anda sudah tercatat. Penjual akan menghubungi Anda untuk konfirmasi.'}
          </p>
          <Link href={`/${slug}`} className="inline-block text-sm font-bold text-gray-900 underline">← Kembali ke halaman</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href={`/${slug}`} className="flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6 hover:text-gray-700">
          <ChevronLeft size={14} /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Booking</h1>
        <p className="text-sm text-gray-500 mb-6">{namaWebsite}</p>

        {/* pilih layanan */}
        <div className="bg-white rounded-3xl p-6 apple-shadow border border-black/[0.03] mb-5">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Pilih Layanan</h2>
          <div className="space-y-2">
            {services.map((s) => (
              <label key={s.id} className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${serviceId === s.id ? 'border-gray-900 bg-gray-50' : 'border-black/10 hover:border-black/20'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="svc" checked={serviceId === s.id} onChange={() => setServiceId(s.id)} />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{s.nama}</p>
                    {s.durasi_menit ? <p className="text-[11px] text-gray-400">{s.durasi_menit} menit</p> : null}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{rupiah(s.harga)}</p>
                  {s.dp_amount > 0 && <p className="text-[11px] text-gray-400">DP {rupiah(s.dp_amount)}</p>}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* form pemesan */}
        <div className="bg-white rounded-3xl p-6 apple-shadow border border-black/[0.03] space-y-3">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Data Pemesan</h2>
          <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama lengkap *" className={inp} />
          <input value={form.kontak} onChange={(e) => setForm({ ...form, kontak: e.target.value })} placeholder="Nomor WhatsApp *" inputMode="tel" className={inp} />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (opsional)" className={inp} />
          <div>
            <label className="text-[11px] text-gray-400">Jadwal yang diinginkan</label>
            <input type="datetime-local" value={form.jadwal} onChange={(e) => setForm({ ...form, jadwal: e.target.value })} className={inp} />
          </div>
          <textarea value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} placeholder="Catatan (opsional)" rows={2} className={inp} />

          <button
            onClick={submit} disabled={busy}
            style={primary ? { backgroundColor: primary } : undefined}
            className="w-full py-3.5 rounded-2xl text-white font-bold bg-gray-900 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {busy ? <Loader2 size={18} className="animate-spin" /> : selected && selected.dp_amount > 0 ? `Bayar DP ${rupiah(selected.dp_amount)}` : 'Kirim Reservasi'}
          </button>
          {selected && selected.dp_amount > 0 && (
            <p className="text-[11px] text-gray-400 text-center">DP diproses aman via Midtrans. Sisa pembayaran diselesaikan saat layanan.</p>
          )}
        </div>
      </div>
    </div>
  )
}
