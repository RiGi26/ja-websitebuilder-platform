'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Check, AlertCircle } from 'lucide-react'
import HeroImageField from './HeroImageField'

export interface TampilanData {
  foto_hero: string
  foto_hero_focus: string
}

// Tab Tampilan — atur foto hero & titik fokusnya SETELAH website jadi.
// Autosave 1 dtk setelah perubahan terakhir (pola sama dgn ContentPanel),
// lalu pancarkan 'portal:saved' supaya LivePreview memuat ulang.
export default function TampilanPanel({ initial }: { initial: TampilanData }) {
  const [draft, setDraft] = useState<TampilanData>(initial)
  const [saved, setSaved] = useState<TampilanData>(initial)
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [err, setErr] = useState<string | null>(null)
  const draftRef = useRef(draft)
  draftRef.current = draft

  const isDirty = draft.foto_hero !== saved.foto_hero || draft.foto_hero_focus !== saved.foto_hero_focus

  const save = async () => {
    const snapshot = { ...draftRef.current }
    setState('saving'); setErr(null)
    try {
      const res = await fetch('/api/portal/landing-page', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErr(json.error ?? 'Gagal menyimpan')
        setState('error')
        return
      }
      setSaved(snapshot)
      setState('saved')
      window.dispatchEvent(new Event('portal:saved')) // refresh live preview
    } catch {
      setErr('Error koneksi')
      setState('error')
    }
  }

  useEffect(() => {
    if (!isDirty) return
    const t = setTimeout(save, 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  })

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-gray-900">Tampilan Website</h2>
        <span className="text-[11px] font-bold uppercase tracking-widest" aria-live="polite">
          {state === 'saving' ? (
            <span className="flex items-center gap-1.5 text-gray-400"><Loader2 size={12} className="animate-spin" /> Menyimpan…</span>
          ) : state === 'saved' ? (
            <span className="flex items-center gap-1.5 text-green-600"><Check size={12} /> Tersimpan</span>
          ) : state === 'error' ? (
            <span className="flex items-center gap-1.5 text-red-500"><AlertCircle size={12} /> Gagal</span>
          ) : null}
        </span>
      </div>
      <p className="text-sm text-gray-400 font-medium mb-6">
        Atur foto utama (hero) dan titik fokusnya. Perubahan tersimpan otomatis — buka <strong>Pratinjau</strong> untuk melihat hasilnya.
      </p>

      <div className="max-w-xl">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Foto Hero / Latar Utama</label>
        <div className="mt-1.5">
          <HeroImageField
            value={draft.foto_hero}
            focus={draft.foto_hero_focus}
            onChange={(url) => setDraft((d) => ({ ...d, foto_hero: url }))}
            onFocusChange={(pos) => setDraft((d) => ({ ...d, foto_hero_focus: pos }))}
          />
        </div>
        {err && <p className="text-xs text-red-500 font-medium mt-2">{err}</p>}
      </div>
    </div>
  )
}
