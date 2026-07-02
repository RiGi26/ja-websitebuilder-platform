'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Eye, Loader2, Rocket, ExternalLink, CircleDot, History, RotateCcw, Save, X, Link2, Check } from 'lucide-react'

type Props = {
  pageId: string
  slug: string
  status: string
}

type Version = {
  id: string
  label: string | null
  kind: string
  created_at: string
  nSections: number
}

const KIND_LABEL: Record<string, string> = {
  pre_build: 'Sebelum build',
  pre_restore: 'Sebelum restore',
  manual: 'Manual',
}

function relTime(iso: string): string {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'baru saja'
  if (m < 60) return `${m} mnt lalu`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} jam lalu`
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

// Bar mengambang di atas preview halaman. Admin lihat draft (service role),
// lalu Publish, atau buka Riwayat untuk rollback ke versi sebelumnya (F5-2).
export default function PreviewBar({ pageId, slug, status: initialStatus }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [versions, setVersions] = useState<Version[] | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [linkState, setLinkState] = useState<'idle' | 'busy' | 'copied'>('idle')
  const isLive = status === 'published'

  // Link pratinjau klien (alur "mockup = draft build"): mint token → salin URL
  // → admin kirim ke klien via WA. Klien lihat draft persis-live tanpa login.
  const copyClientLink = async () => {
    setLinkState('busy')
    try {
      const res = await fetch('/api/admin/preview-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId }),
      })
      const json = await res.json()
      if (!res.ok) {
        alert(`Gagal membuat link: ${json.error ?? 'unknown'}`)
        setLinkState('idle')
        return
      }
      await navigator.clipboard.writeText(json.url)
      setLinkState('copied')
      setTimeout(() => setLinkState('idle'), 2500)
    } catch {
      alert('Error koneksi / clipboard')
      setLinkState('idle')
    }
  }

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

  const loadVersions = async () => {
    setVersions(null)
    try {
      const res = await fetch(`/api/admin/pages/${pageId}/versions`)
      const json = await res.json()
      if (!res.ok) {
        alert(`Gagal memuat riwayat: ${json.error ?? 'unknown'}`)
        setVersions([])
        return
      }
      setVersions(json.versions ?? [])
    } catch {
      alert('Error koneksi')
      setVersions([])
    }
  }

  const toggleHistory = () => {
    const next = !historyOpen
    setHistoryOpen(next)
    if (next && versions === null) loadVersions()
  }

  const saveSnapshot = async () => {
    setBusyId('__save__')
    try {
      const res = await fetch(`/api/admin/pages/${pageId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'snapshot' }),
      })
      const json = await res.json()
      if (!res.ok) {
        alert(`Gagal simpan versi: ${json.error ?? 'unknown'}`)
        return
      }
      await loadVersions()
    } catch {
      alert('Error koneksi')
    } finally {
      setBusyId(null)
    }
  }

  const restore = async (versionId: string) => {
    if (!confirm('Kembalikan konten halaman ke versi ini? State sekarang otomatis disimpan dulu (bisa dibalik lagi).')) return
    setBusyId(versionId)
    try {
      const res = await fetch(`/api/admin/pages/${pageId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore', versionId }),
      })
      const json = await res.json()
      if (!res.ok) {
        alert(`Gagal restore: ${json.error ?? 'unknown'}`)
        return
      }
      await loadVersions()
      router.refresh()
    } catch {
      alert('Error koneksi')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="fixed top-0 inset-x-0 z-[9999]">
      <div className="bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80 text-white shadow-lg">
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
            <button
              onClick={copyClientLink}
              disabled={linkState === 'busy'}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              title="Salin link pratinjau untuk dikirim ke klien (berlaku 14 hari)"
            >
              {linkState === 'busy' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : linkState === 'copied' ? (
                <Check size={14} className="text-emerald-400" />
              ) : (
                <Link2 size={14} />
              )}
              <span className="hidden sm:inline">{linkState === 'copied' ? 'Tersalin' : 'Link Klien'}</span>
            </button>
            <button
              onClick={toggleHistory}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                historyOpen ? 'bg-white/15 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <History size={14} /> <span className="hidden sm:inline">Riwayat</span>
            </button>
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

      {/* Panel Riwayat (F5-2) */}
      {historyOpen && (
        <div className="bg-gray-900/95 backdrop-blur border-t border-white/10 text-white shadow-xl">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-300">Riwayat Versi</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={saveSnapshot}
                  disabled={busyId === '__save__'}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  {busyId === '__save__' ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  Simpan Versi
                </button>
                <button onClick={() => setHistoryOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" aria-label="Tutup riwayat">
                  <X size={16} />
                </button>
              </div>
            </div>

            {versions === null ? (
              <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
                <Loader2 size={15} className="animate-spin" /> Memuat…
              </div>
            ) : versions.length === 0 ? (
              <p className="text-sm text-gray-400 py-4">
                Belum ada versi tersimpan. Versi otomatis dibuat tiap kali kamu klik &ldquo;Bangun Draft&rdquo;, atau simpan manual di atas.
              </p>
            ) : (
              <ul className="divide-y divide-white/10 max-h-72 overflow-y-auto">
                {versions.map((v) => (
                  <li key={v.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{v.label ?? KIND_LABEL[v.kind] ?? 'Versi'}</span>
                        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-300">
                          {KIND_LABEL[v.kind] ?? v.kind}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{relTime(v.created_at)} · {v.nSections} section</div>
                    </div>
                    <button
                      onClick={() => restore(v.id)}
                      disabled={busyId !== null}
                      className="shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest bg-amber-600 text-white hover:bg-amber-500 transition-colors disabled:opacity-50"
                    >
                      {busyId === v.id ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
                      Pulihkan
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
