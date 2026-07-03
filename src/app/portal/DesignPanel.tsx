'use client'

import { useState } from 'react'
import { Loader2, Check, AlertCircle, Palette, Type, Plus } from 'lucide-react'
import type { ThemeDesignOptions } from '@/app/components/themes/toko-bespoke/registry'

// Tab Tampilan — kartu "Gaya Tema" (Wave 3 style knobs): tenant memilih palet
// & font pairing dari daftar KURASI temanya (BespokeEntry.design; bukan
// free-form — kualitas bespoke terjaga, tiap palet ber-contrast test). Pilihan
// tersimpan langsung saat klik → PATCH /api/portal/design → LivePreview reload.
// + "Tambah Bagian": blok opsional tema yang datanya masih kosong — klik =
// lompat ke form pengisinya (reuse jalur click-to-edit PortalDashboard).

export default function DesignPanel({ options, current, addable, onAddSection }: {
  options: ThemeDesignOptions
  current: { palette?: string; fontPairing?: string }
  addable: { key: string; label: string }[]
  onAddSection: (key: string) => void
}) {
  const [palette, setPalette] = useState(current.palette ?? options.palettes[0]?.id)
  const [pairing, setPairing] = useState(current.fontPairing ?? options.fontPairings?.[0]?.id)
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [err, setErr] = useState<string | null>(null)

  const save = async (patch: { palette?: string; fontPairing?: string }) => {
    setState('saving'); setErr(null)
    try {
      const res = await fetch('/api/portal/design', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErr(json.error ?? 'Gagal menyimpan')
        setState('error')
        return
      }
      setState('saved')
      window.dispatchEvent(new Event('portal:saved')) // refresh live preview
    } catch {
      setErr('Error koneksi')
      setState('error')
    }
  }

  const pickPalette = (id: string) => {
    if (id === palette) return
    setPalette(id)
    save({ palette: id })
  }
  const pickPairing = (id: string) => {
    if (id === pairing) return
    setPairing(id)
    save({ fontPairing: id })
  }

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-gray-900">Gaya Tema</h2>
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
        Pilihan gaya yang sudah dikurasi agar tetap serasi dengan tema website Anda. Perubahan langsung tampil di Pratinjau.
      </p>
      {err && <p className="text-xs text-red-500 font-medium mb-3">{err}</p>}

      <div className="space-y-6 max-w-xl">
        <div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Palette size={12} /> Palet Warna</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {options.palettes.map((p) => (
              <button
                key={p.id}
                onClick={() => pickPalette(p.id)}
                aria-pressed={palette === p.id}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                  palette === p.id ? 'border-apple-blue bg-blue-50/60 text-gray-900' : 'border-black/10 text-gray-600 hover:border-black/25'
                }`}
              >
                <span className="inline-block h-4 w-4 rounded-full border border-black/10" style={{ background: p.swatch }} aria-hidden />
                {p.label}
                {palette === p.id && <Check size={14} className="text-apple-blue" />}
              </button>
            ))}
          </div>
        </div>

        {(options.fontPairings?.length ?? 0) > 1 && (
          <div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Type size={12} /> Gaya Huruf</span>
            <div className="space-y-1.5 mt-2">
              {options.fontPairings!.map((fp) => (
                <button
                  key={fp.id}
                  onClick={() => pickPairing(fp.id)}
                  aria-pressed={pairing === fp.id}
                  className={`w-full flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                    pairing === fp.id ? 'border-apple-blue bg-blue-50/60' : 'border-black/10 hover:border-black/25'
                  }`}
                >
                  <span>
                    <span className="block text-sm font-semibold text-gray-900">{fp.label}</span>
                    <span className="block text-[11px] text-gray-400 mt-0.5">
                      {fp.display.split(',')[0].replace(/"/g, '')} + {fp.body.split(',')[0].replace(/"/g, '')}
                    </span>
                  </span>
                  {pairing === fp.id && <Check size={15} className="text-apple-blue shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {addable.length > 0 && (
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tambah Bagian</span>
            <p className="text-xs text-gray-400 mt-1 mb-2">
              Bagian yang didukung tema Anda tapi belum berisi — isi datanya, bagian langsung tampil di website.
            </p>
            <div className="flex flex-wrap gap-2">
              {addable.map((a) => (
                <button
                  key={a.key}
                  onClick={() => onAddSection(a.key)}
                  className="flex items-center gap-1.5 rounded-xl border border-dashed border-black/15 px-3 py-2 text-sm font-semibold text-gray-600 hover:border-apple-blue hover:text-apple-blue transition-colors"
                >
                  <Plus size={14} /> {a.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
