'use client'

import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'

// Banner onboarding portal: muncul saat konten website masih CONTOH
// (konfigurasi.content_is_sample — briefing inti dikosongkan saat order, build
// pakai template). Mengajak customer mengganti dengan data asli. Dismissible
// per-tenant (localStorage). HANYA di dashboard — situs publik tidak menampilkan
// label "contoh".
export default function SampleContentBanner({
  tenantId, onEdit,
}: {
  tenantId: string
  onEdit: () => void
}) {
  const KEY = `ja_sample_banner_dismissed_${tenantId}`
  const [hidden, setHidden] = useState(() => {
    if (typeof window === 'undefined') return false
    try { return localStorage.getItem(KEY) === '1' } catch { return false }
  })
  if (hidden) return null

  const dismiss = () => {
    try { localStorage.setItem(KEY, '1') } catch { /* ignore */ }
    setHidden(true)
  }

  return (
    <div className="mb-6 rounded-[24px] border border-blue-100 bg-blue-50/70 p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-2xl bg-apple-blue/10 flex items-center justify-center shrink-0">
        <Sparkles size={18} className="text-apple-blue" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900">Konten awal ini masih contoh</p>
        <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
          Kami isi otomatis agar website tidak tampil kosong. Ganti dengan data asli Anda kapan saja dari sini.
        </p>
        <button onClick={onEdit}
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-apple-blue text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors">
          Edit Konten
        </button>
      </div>
      <button onClick={dismiss} title="Tutup" aria-label="Tutup pemberitahuan"
        className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white transition-colors">
        <X size={16} />
      </button>
    </div>
  )
}
