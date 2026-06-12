'use client'

import { useState, useRef } from 'react'
import { Loader2, Upload, Image as ImageIcon, X } from 'lucide-react'

// Field gambar reusable: unggah file (→ /api/portal/upload → Supabase Storage)
// ATAU tempel URL (fallback). Mengganti input URL polos di seluruh panel portal.
export default function ImageUploadField({
  value, onChange, label, compact = false,
  uploadUrl = '/api/portal/upload', extraFields, hidePreview = false,
}: {
  value: string
  onChange: (url: string) => void
  label?: string
  compact?: boolean
  /** Endpoint unggah. Default portal (sesi tenant); form briefing pakai
   *  '/api/briefing/upload' (otorisasi via token). */
  uploadUrl?: string
  /** Field tambahan di-append ke FormData (mis. { token } untuk briefing). */
  extraFields?: Record<string, string>
  /** Sembunyikan thumbnail kecil (pemanggil merender preview-nya sendiri,
   *  mis. HeroImageField dengan grid titik fokus). */
  hidePreview?: boolean
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [showUrl, setShowUrl] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    setBusy(true); setErr(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (extraFields) for (const [k, v] of Object.entries(extraFields)) fd.append(k, v)
      const res = await fetch(uploadUrl, { method: 'POST', body: fd })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(json.error ?? 'Gagal unggah'); return }
      onChange(json.url as string)
    } catch { setErr('Error koneksi') } finally { setBusy(false) }
  }

  const thumb = value ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={value} alt="" className={`${compact ? 'w-11 h-11' : 'w-14 h-14'} rounded-lg object-cover border border-black/10 shrink-0`} />
  ) : (
    <div className={`${compact ? 'w-11 h-11' : 'w-14 h-14'} rounded-lg border border-dashed border-black/15 flex items-center justify-center text-gray-300 shrink-0`}>
      <ImageIcon size={compact ? 15 : 18} />
    </div>
  )

  return (
    <div>
      {label && <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>}
      <div className={`flex gap-2 items-start ${label ? 'mt-1' : ''}`}>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-black/10 text-xs font-bold text-gray-600 hover:border-apple-blue/40 hover:text-apple-blue disabled:opacity-50 transition-colors">
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Unggah Gambar
            </button>
            <button type="button" onClick={() => setShowUrl((s) => !s)}
              className="px-2.5 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors">atau URL</button>
            {value && (
              <button type="button" onClick={() => onChange('')} title="Hapus gambar"
                className="px-2 py-2 rounded-lg text-gray-300 hover:text-red-500 transition-colors"><X size={14} /></button>
            )}
          </div>
          {showUrl && (
            <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…"
              className="w-full text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none" />
          )}
          {err && <p className="text-[11px] text-red-500">{err}</p>}
        </div>
        {!hidePreview && thumb}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = '' }} />
    </div>
  )
}
