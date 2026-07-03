'use client'

import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, ExternalLink, Monitor, Smartphone, X } from 'lucide-react'

// Pratinjau website inline (iframe situs published). Same-origin → aman di-iframe
// (route [slug] tak set X-Frame-Options). Auto-refresh saat ada event 'portal:saved'
// (mis. dari tab Konten) + tombol refresh manual. Situs `force-dynamic` → reload
// tampilkan perubahan terbaru.
export default function LivePreview({
  slug, published, onClose, onEditFocus,
}: {
  slug: string | null
  published: boolean
  onClose: () => void
  // Click-to-edit (Wave 2): elemen ber-data-edit diklik di iframe → key slot
  // pemiliknya. Parent (PortalDashboard) memetakan key → tab + form field.
  onEditFocus?: (key: string) => void
}) {
  const [key, setKey] = useState(0)
  const [mobile, setMobile] = useState(false)
  const refresh = useCallback(() => setKey((k) => k + 1), [])

  useEffect(() => {
    const h = () => refresh()
    window.addEventListener('portal:saved', h)
    return () => window.removeEventListener('portal:saved', h)
  }, [refresh])

  // Pesan 'ja:edit' dari EditBridge di iframe — validasi ORIGIN (same-origin
  // saja) + bentuk payload sebelum diteruskan.
  useEffect(() => {
    if (!onEditFocus) return
    const h = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      const d = e.data as { type?: unknown; key?: unknown } | null
      if (!d || d.type !== 'ja:edit' || typeof d.key !== 'string') return
      onEditFocus(d.key)
    }
    window.addEventListener('message', h)
    return () => window.removeEventListener('message', h)
  }, [onEditFocus])

  const btn = 'p-1.5 rounded-lg text-gray-400 hover:bg-white hover:text-gray-700 transition-colors'
  const active = 'p-1.5 rounded-lg bg-white text-apple-blue shadow-sm'

  return (
    <div className="mb-6 bg-white rounded-[28px] border border-black/5 apple-shadow overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-black/5 bg-gray-50">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Pratinjau Website</span>
        <div className="flex items-center gap-0.5">
          <button onClick={() => setMobile(false)} className={mobile ? btn : active} title="Tampilan desktop"><Monitor size={15} /></button>
          <button onClick={() => setMobile(true)} className={mobile ? active : btn} title="Tampilan ponsel"><Smartphone size={15} /></button>
          <span className="w-px h-4 bg-black/10 mx-1" />
          <button onClick={refresh} className={btn} title="Muat ulang"><RefreshCw size={15} /></button>
          {slug && <a href={`/${slug}`} target="_blank" rel="noopener noreferrer" className={btn} title="Buka di tab baru"><ExternalLink size={15} /></a>}
          <button onClick={onClose} className={btn} title="Tutup pratinjau"><X size={15} /></button>
        </div>
      </div>

      {!slug || !published ? (
        <div className="p-10 text-center text-sm text-gray-400">
          Pratinjau penuh tersedia setelah website Anda <strong>dipublikasikan</strong>.
        </div>
      ) : (
        <div className="flex justify-center bg-gray-100 p-3">
          <iframe
            key={key}
            src={`/${slug}${onEditFocus ? '?portalEdit=1' : ''}`}
            title="Pratinjau website"
            className={`bg-white border border-black/5 rounded-lg shrink-0 ${mobile ? 'w-[390px]' : 'w-full'}`}
            style={{ height: '62vh' }}
          />
        </div>
      )}
    </div>
  )
}
