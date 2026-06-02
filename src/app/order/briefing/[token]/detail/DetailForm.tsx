'use client'

import { useState } from 'react'
import { industriToTipe } from '@/lib/websitebuilder-mapping'
import { Check, Loader2, Plus, Trash2 } from 'lucide-react'

interface TestimoniRow { nama: string; kota: string; teks: string; bintang: string }

interface DetailState {
  foto_hero: string
  foto_items: { label: string; url: string }[]
  testimoni: TestimoniRow[]
  kebijakan: string
  catatan_tambahan: string
}

const INIT: DetailState = {
  foto_hero: '',
  foto_items: [{ label: '', url: '' }],
  testimoni: [
    { nama: '', kota: '', teks: '', bintang: '5' },
    { nama: '', kota: '', teks: '', bintang: '5' },
  ],
  kebijakan: '',
  catatan_tambahan: '',
}

const inputCls = "w-full px-4 py-3 rounded-[14px] border border-black/[0.08] text-sm font-medium focus:outline-none focus:border-[#0071E3] bg-white transition-colors"
const textareaCls = `${inputCls} resize-none`

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400">{label}</label>
      {hint && <p className="text-xs text-gray-400 font-medium -mt-1">{hint}</p>}
      {children}
    </div>
  )
}

// Label foto per industri
const FOTO_LABELS: Record<string, string[]> = {
  travel: ['Foto Armada Unggulan', 'Foto Interior Kendaraan', 'Foto Suasana Layanan'],
  restaurant: ['Foto Makanan Unggulan', 'Foto Suasana Restoran', 'Foto Eksterior Tempat'],
  corporate: ['Foto Kantor / Gedung', 'Foto Tim / Karyawan', 'Foto Portofolio / Hasil Kerja'],
  klinik: ['Foto Ruang Klinik', 'Foto Dokter / Tim Medis', 'Foto Fasilitas'],
  sekolah: ['Foto Gedung Sekolah', 'Foto Kegiatan Siswa', 'Foto Fasilitas Belajar'],
  toko_online: ['Foto Produk Unggulan 1', 'Foto Produk Unggulan 2', 'Foto Brand / Packaging'],
  personal: ['Foto Profil Utama', 'Foto Portfolio / Karya', 'Foto Behind the Scenes'],
}

interface Props {
  token: string
  orderId: string
  namaKlien: string
  industri: string
}

export default function DetailForm({ token, orderId, namaKlien, industri }: Props) {
  const tipe = industriToTipe(industri)
  const fotoLabels = FOTO_LABELS[tipe] ?? ['Foto Utama', 'Foto Pendukung 1', 'Foto Pendukung 2']

  const [form, setForm] = useState<DetailState>({
    ...INIT,
    foto_items: fotoLabels.map(label => ({ label, url: '' })),
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof DetailState, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  function updateTestimoni(idx: number, field: keyof TestimoniRow, val: string) {
    setForm(f => {
      const arr = [...f.testimoni]
      arr[idx] = { ...arr[idx], [field]: val }
      return { ...f, testimoni: arr }
    })
  }

  function updateFotoItem(idx: number, val: string) {
    setForm(f => {
      const arr = [...f.foto_items]
      arr[idx] = { ...arr[idx], url: val }
      return { ...f, foto_items: arr }
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const detail_data = {
        foto_hero: form.foto_hero,
        foto_items: form.foto_items.filter(f => f.url.trim()),
        testimoni: form.testimoni.filter(t => t.nama.trim() && t.teks.trim()).map(t => ({
          ...t,
          bintang: parseInt(t.bintang) || 5,
        })),
        kebijakan: form.kebijakan,
        catatan_tambahan: form.catatan_tambahan,
      }
      const res = await fetch('/api/briefing/detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, detail_data }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Gagal submit')
      setSubmitted(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="bg-white rounded-[32px] p-10 shadow-sm border border-black/[0.04]">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Website Siap Disempurnakan!</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Detail lengkap diterima, {namaKlien}. Tim kami akan update website dengan foto dan testimoni nyata Anda.
          </p>
          <a href={`/track?id=${orderId}`}
            className="inline-flex items-center gap-2 py-3 px-6 bg-[#0071E3] text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors text-sm">
            Lacak Progress
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0071E3] text-xs font-black px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
          Tahap 2 — Pelengkap Website
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Lengkapi Detail Website</h1>
        <p className="text-gray-500 text-sm font-medium">
          Halo <strong>{namaKlien}</strong>! Tambahkan foto asli dan testimoni nyata agar website Anda terasa lebih personal dan terpercaya.
        </p>
      </div>

      <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-sm border border-black/[0.03] space-y-8">

        {/* Foto Hero */}
        <Field label="Foto Utama / Hero" hint="Foto terbaik yang mewakili bisnis Anda — tampil paling menonjol di website.">
          <input className={inputCls} value={form.foto_hero} onChange={e => set('foto_hero', e.target.value)}
            placeholder="https://drive.google.com/... atau link foto lainnya" />
        </Field>

        {/* Foto per kategori */}
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Foto Pendukung</p>
          <p className="text-xs text-gray-400 font-medium mb-4">Boleh link Google Drive (pastikan akses publik), atau URL langsung.</p>
          <div className="space-y-3">
            {form.foto_items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 w-40 shrink-0">{item.label}</span>
                <input className={inputCls} value={item.url} onChange={e => updateFotoItem(i, e.target.value)}
                  placeholder="https://..." />
              </div>
            ))}
          </div>
        </div>

        {/* Testimoni nyata */}
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Testimoni Nyata Pelanggan</p>
          <p className="text-xs text-gray-400 font-medium mb-4">Minta izin pelanggan Anda dulu. Minimal 1 testimonial agar website terasa kredibel.</p>
          {form.testimoni.map((t, i) => (
            <div key={i} className="bg-gray-50 rounded-[16px] p-5 mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Testimoni {i + 1}</span>
                {form.testimoni.length > 1 && (
                  <button onClick={() => setForm(f => ({ ...f, testimoni: f.testimoni.filter((_, j) => j !== i) }))}
                    className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Nama pelanggan" value={t.nama} onChange={e => updateTestimoni(i, 'nama', e.target.value)} />
                <input className={inputCls} placeholder="Kota / Profesi" value={t.kota} onChange={e => updateTestimoni(i, 'kota', e.target.value)} />
              </div>
              <textarea className={textareaCls} rows={2} placeholder="Review / testimoni dalam kalimat mereka sendiri..."
                value={t.teks} onChange={e => updateTestimoni(i, 'teks', e.target.value)} />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Rating:</span>
                {['5','4','3'].map(v => (
                  <button key={v} onClick={() => updateTestimoni(i, 'bintang', v)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${t.bintang === v ? 'bg-amber-400 border-amber-400 text-amber-900' : 'border-gray-200 text-gray-500 hover:border-amber-300'}`}>
                    {'★'.repeat(parseInt(v))}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={() => setForm(f => ({ ...f, testimoni: [...f.testimoni, { nama: '', kota: '', teks: '', bintang: '5' }] }))}
            className="flex items-center gap-2 text-[#0071E3] text-sm font-bold hover:underline">
            <Plus size={16} /> Tambah Testimoni
          </button>
        </div>

        {/* Kebijakan */}
        <Field label="Kebijakan / Syarat & Ketentuan" hint="Informasi penting untuk calon pelanggan — cancellation, refund, syarat, dll.">
          <textarea className={textareaCls} rows={3} value={form.kebijakan}
            onChange={e => set('kebijakan', e.target.value)}
            placeholder="Contoh: Pembatalan H-1 kena charge 50%. Deposit dikembalikan setelah kendaraan diperiksa..." />
        </Field>

        {/* Catatan tambahan */}
        <Field label="Catatan Tambahan untuk Tim Kami" hint="Hal lain yang perlu tim kami tahu — request khusus, preferensi design, dll.">
          <textarea className={textareaCls} rows={2} value={form.catatan_tambahan}
            onChange={e => set('catatan_tambahan', e.target.value)}
            placeholder="Contoh: Mohon gunakan warna yang lebih gelap, saya ingin tampilan mewah..." />
        </Field>

        {error && (
          <div className="p-4 rounded-[16px] bg-red-50 border border-red-100">
            <p className="text-sm font-bold text-red-700">{error}</p>
          </div>
        )}

        <button onClick={handleSubmit} disabled={submitting}
          className="w-full py-4 rounded-2xl bg-[#0071E3] text-white font-black text-sm disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
          {submitting ? <><Loader2 size={18} className="animate-spin" /> Mengirim...</> : <><Check size={18} /> Kirim Detail Website</>}
        </button>
        <p className="text-center text-[11px] text-gray-400 font-medium">
          Semua field opsional. Lewati yang belum siap — bisa diupdate kapan saja via portal.
        </p>
      </div>
    </div>
  )
}
