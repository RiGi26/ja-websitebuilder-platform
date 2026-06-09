'use client'

import { useState } from 'react'
import { Loader2, Check, ChevronDown, ChevronRight } from 'lucide-react'
import ImageUploadField from './ImageUploadField'

export type EditableSection = {
  id: string
  tipe_komponen: string
  urutan: number
  is_visible: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isi_komponen: Record<string, any>
}

// Label section yang ramah klien.
const SECTION_LABEL: Record<string, string> = {
  hero_banner: 'Hero / Banner Utama',
  about: 'Tentang',
  features: 'Keunggulan',
  pricing_table: 'Daftar Harga',
  gallery: 'Galeri',
  testimonials: 'Testimoni',
  team: 'Tim',
  cta: 'Ajakan (CTA)',
  contact_form: 'Kontak',
  faq: 'FAQ',
  stats: 'Statistik',
  blog_list: 'Daftar Blog',
  product_list: 'Daftar Produk',
  service_list: 'Daftar Layanan',
  video_embed: 'Video',
  map_embed: 'Peta',
  social_feed: 'Sosial Media',
  custom_html: 'HTML Kustom',
}

// Label field yang ramah klien.
const FIELD_LABEL: Record<string, string> = {
  title: 'Judul',
  subtitle: 'Subjudul',
  eyebrow: 'Label Kecil',
  deskripsi: 'Deskripsi',
  description: 'Deskripsi',
  teks: 'Teks',
  text: 'Teks',
  cta_text: 'Teks Tombol',
  cta_link: 'Link Tombol',
  image_url: 'Gambar (URL)',
  gambar_url: 'Gambar (URL)',
  wa: 'WhatsApp',
  email: 'Email',
  nama: 'Nama',
  jabatan: 'Jabatan',
  role: 'Jabatan',
  pertanyaan: 'Pertanyaan',
  jawaban: 'Jawaban',
  label: 'Label',
  value: 'Nilai',
}

function fieldLabel(key: string): string {
  return FIELD_LABEL[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function isImageKey(key: string): boolean {
  return /(image|gambar|foto|logo|avatar|thumbnail|cover)/i.test(key) && !/alt|caption/i.test(key)
}
function isLinkKey(key: string): boolean {
  return /(link|url|href)/i.test(key) && !isImageKey(key)
}
function isLongText(key: string, val: string): boolean {
  return /(deskripsi|description|teks|text|subtitle|jawaban|bio|about|isi|content|quote)/i.test(key) || val.length > 70
}

type DraftMap = Record<string, Record<string, unknown>>

export default function ContentPanel({ initial }: { initial: EditableSection[] }) {
  const sorted = [...initial].sort((a, b) => a.urutan - b.urutan)
  const [drafts, setDrafts] = useState<DraftMap>(() =>
    Object.fromEntries(sorted.map((s) => [s.id, structuredClone(s.isi_komponen ?? {})])),
  )
  const [saved, setSaved] = useState<Record<string, Record<string, unknown>>>(() =>
    Object.fromEntries(sorted.map((s) => [s.id, structuredClone(s.isi_komponen ?? {})])),
  )
  const [busy, setBusy] = useState<string | null>(null)
  const [open, setOpen] = useState<string | null>(sorted[0]?.id ?? null)

  const setField = (sectionId: string, key: string, value: string) => {
    setDrafts((d) => ({ ...d, [sectionId]: { ...d[sectionId], [key]: value } }))
  }
  const setItemField = (sectionId: string, arrKey: string, idx: number, key: string, value: string) => {
    setDrafts((d) => {
      const arr = [...((d[sectionId][arrKey] as Record<string, unknown>[]) ?? [])]
      arr[idx] = { ...arr[idx], [key]: value }
      return { ...d, [sectionId]: { ...d[sectionId], [arrKey]: arr } }
    })
  }

  const isDirty = (sectionId: string): boolean =>
    JSON.stringify(drafts[sectionId]) !== JSON.stringify(saved[sectionId])

  const save = async (sectionId: string) => {
    setBusy(sectionId)
    try {
      const res = await fetch('/api/portal/sections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, isi_komponen: drafts[sectionId] }),
      })
      const json = await res.json()
      if (!res.ok) {
        alert(`Gagal menyimpan: ${json.error ?? 'unknown'}`)
        return
      }
      setSaved((s) => ({ ...s, [sectionId]: structuredClone(drafts[sectionId]) }))
    } catch {
      alert('Error koneksi')
    } finally {
      setBusy(null)
    }
  }

  const inp = 'w-full text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none'

  // Render satu field string (input / textarea / gambar).
  const renderStringField = (sectionId: string, key: string, value: string, onChange: (v: string) => void) => {
    if (isImageKey(key)) {
      return <ImageUploadField key={key} label={fieldLabel(key)} value={value} onChange={onChange} />
    }
    return (
      <div key={key}>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{fieldLabel(key)}</label>
        {isLongText(key, value) && !isLinkKey(key) ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${inp} mt-1`} />
        ) : (
          <input value={value} onChange={(e) => onChange(e.target.value)} className={`${inp} mt-1`} />
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">Konten Halaman</h2>
        <p className="text-sm text-gray-500 mt-1">
          Ubah teks & gambar di tiap bagian website Anda. Perubahan langsung tampil di website setelah disimpan.
        </p>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum ada konten halaman. Tim sedang menyiapkan website Anda.</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((s) => {
            const draft = drafts[s.id] ?? {}
            const isOpen = open === s.id
            const stringKeys = Object.keys(draft).filter((k) => typeof draft[k] === 'string')
            const arrayKeys = Object.keys(draft).filter(
              (k) => Array.isArray(draft[k]) && (draft[k] as unknown[]).every((it) => it && typeof it === 'object' && !Array.isArray(it)),
            )
            const editableCount = stringKeys.length + arrayKeys.length

            return (
              <div key={s.id} className="rounded-2xl border border-black/5 overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : s.id)}
                  className="w-full flex items-center justify-between gap-3 p-4 bg-gray-50 text-left hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                    <span className="text-sm font-bold text-gray-900">{SECTION_LABEL[s.tipe_komponen] ?? s.tipe_komponen}</span>
                    {!s.is_visible && <span className="text-[10px] text-gray-400 uppercase">(disembunyikan)</span>}
                  </div>
                  {isDirty(s.id) && <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Belum disimpan</span>}
                </button>

                {isOpen && (
                  <div className="p-4 space-y-4">
                    {editableCount === 0 ? (
                      <p className="text-sm text-gray-400 italic">
                        Bagian ini diisi otomatis dari data lain (mis. produk/layanan/menu). Edit di tab terkait.
                      </p>
                    ) : (
                      <>
                        {/* field string top-level */}
                        {stringKeys.map((key) =>
                          renderStringField(s.id, key, draft[key] as string, (v) => setField(s.id, key, v)),
                        )}

                        {/* array of objects (items: features/testimonials/faq/stats) */}
                        {arrayKeys.map((arrKey) => (
                          <div key={arrKey} className="space-y-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{fieldLabel(arrKey)}</p>
                            {(draft[arrKey] as Record<string, unknown>[]).map((item, idx) => (
                              <div key={idx} className="rounded-xl border border-black/5 bg-gray-50/60 p-3 space-y-2">
                                {Object.keys(item)
                                  .filter((k) => typeof item[k] === 'string')
                                  .map((k) =>
                                    renderStringField(s.id, k, item[k] as string, (v) => setItemField(s.id, arrKey, idx, k, v)),
                                  )}
                              </div>
                            ))}
                          </div>
                        ))}

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => save(s.id)}
                            disabled={busy === s.id || !isDirty(s.id)}
                            className="flex items-center gap-1.5 px-5 py-2.5 bg-apple-blue text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 disabled:opacity-50"
                          >
                            {busy === s.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Simpan
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
