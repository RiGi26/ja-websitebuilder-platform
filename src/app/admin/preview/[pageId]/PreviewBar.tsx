'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Eye, Loader2, Rocket, ExternalLink, CircleDot } from 'lucide-react'

type Props = {
  pageId: string
  slug: string
  status: string
}

// Bar mengambang di atas preview halaman. Admin lihat draft (service role),
// lalu Publish (PATCH /api/admin/pages action=publish) atau kembali.
export default function PreviewBar({ pageId, slug, status: initialStatus }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState(false)
  const isLive = status === 'published'

  const publish = async () => {
    if (!confirm('Publish halaman ini sekarang? Setelah live, pengunjung bisa mengaksesnya.')) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pageId, action: 'publish' }),
      })
      const json = await res.json()
      if (!res.ok) {
        alert(`Gagal publish: ${json.error ?? 'unknown'}`)
        return
      }
      setStatus('published')
      router.refresh()
    } catch {
      alert('Error koneksi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed top-0 inset-x-0 z-[9999] bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push('/admin')}
            className="shrink-0 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={15} /> Admin
          </button>
          <span className="h-5 w-px bg-white/15" aria-hidden />
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-300">
            <Eye size={14} /> Preview
          </span>
          <span
            className={`shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              isLive ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
            }`}
          >
            <CircleDot size={11} /> {isLive ? 'Live' : 'Draft'}
          </span>
          <span className="truncate text-xs text-gray-400">/{slug}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isLive && (
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ExternalLink size={13} /> Buka Live
            </a>
          )}
          <button
            disabled={loading || isLive}
            onClick={publish}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Rocket size={14} />}
            {isLive ? 'Sudah Live' : loading ? 'Mempublish…' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}
