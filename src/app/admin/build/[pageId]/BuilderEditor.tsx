'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Save,
  Rocket,
  Undo2,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import type {
  LandingPage,
  PageSection,
  TipeKomponen,
  FeatureFlags,
  KonfigurasiWebsite,
} from '@/types/websitebuilder'

const KOMPONEN_OPTIONS: TipeKomponen[] = [
  'hero_banner', 'about', 'features', 'pricing_table', 'gallery', 'testimonials',
  'team', 'cta', 'contact_form', 'faq', 'stats', 'blog_list', 'product_list',
  'video_embed', 'map_embed', 'social_feed', 'custom_html',
]

const FEATURE_LABELS: Record<keyof FeatureFlags, string> = {
  hasCart: 'Toko / Keranjang',
  hasBlog: 'Blog',
  hasBooking: 'Booking / Reservasi',
  hasGallery: 'Galeri',
  hasSEO: 'SEO Lanjutan',
  hasContactForm: 'Form Kontak',
  hasMap: 'Peta Lokasi',
  hasAdmin: 'Dashboard Admin / CMS',
  hasClientPortal: 'Client Portal',
  hasPayment: 'Payment Gateway',
  hasShipping: 'Integrasi Ongkir',
  hasMenu: 'Menu Digital QR',
  hasDelivery: 'Integrasi Delivery',
  hasMembership: 'Membership',
  hasLMS: 'LMS / Kelas Online',
  hasMultiLang: 'Multi-Bahasa',
  hasWhatsApp: 'Otomasi WhatsApp',
  hasAnalytics: 'Ads Tracking / Analytics',
  hasNewsletter: 'Newsletter',
  hasLiveChat: 'Live Chat',
  hasCareer: 'Portal Karir',
  hasEmail: 'Email Bisnis',
}

// Skema field untuk tipe section "flat" (key-value) → form isian, bukan JSON.
type FieldDef = { key: string; label: string; type: 'text' | 'textarea' | 'url'; placeholder?: string }
const FIELD_SCHEMA: Partial<Record<TipeKomponen, FieldDef[]>> = {
  hero_banner: [
    { key: 'eyebrow', label: 'Label kecil (eyebrow)', type: 'text', placeholder: 'TOKO ONLINE' },
    { key: 'title', label: 'Judul utama', type: 'text', placeholder: 'Selamat Datang di Toko Kami' },
    { key: 'subtitle', label: 'Subjudul', type: 'text', placeholder: 'Produk terbaik untukmu' },
    { key: 'cta_text', label: 'Teks tombol', type: 'text', placeholder: 'Belanja Sekarang' },
    { key: 'cta_link', label: 'Link tombol', type: 'url', placeholder: 'https://wa.me/62...' },
    { key: 'image_url', label: 'URL gambar (opsional)', type: 'url' },
  ],
  about: [
    { key: 'title', label: 'Judul', type: 'text', placeholder: 'Tentang Kami' },
    { key: 'body', label: 'Isi / deskripsi', type: 'textarea' },
  ],
  cta: [
    { key: 'title', label: 'Judul', type: 'text' },
    { key: 'subtitle', label: 'Subjudul', type: 'text' },
    { key: 'cta_text', label: 'Teks tombol', type: 'text' },
    { key: 'cta_link', label: 'Link tombol', type: 'url' },
  ],
  contact_form: [
    { key: 'title', label: 'Judul', type: 'text', placeholder: 'Hubungi Kami' },
    { key: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
    { key: 'wa', label: 'Nomor WhatsApp (62...)', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
  ],
  product_list: [{ key: 'title', label: 'Judul section', type: 'text', placeholder: 'Produk Kami' }],
  blog_list: [{ key: 'title', label: 'Judul section', type: 'text', placeholder: 'Artikel Terbaru' }],
  video_embed: [{ key: 'url', label: 'URL embed video', type: 'url' }],
  map_embed: [{ key: 'url', label: 'URL embed peta (Google Maps)', type: 'url' }],
  custom_html: [{ key: 'html', label: 'Kode HTML', type: 'textarea' }],
}

// Template JSON untuk tipe "list" (belum berbentuk form) — memudahkan pengisian.
const JSON_TEMPLATE: Partial<Record<TipeKomponen, unknown>> = {
  features: { title: 'Keunggulan', items: [{ title: 'Fitur A', desc: 'Penjelasan singkat' }] },
  stats: { items: [{ value: '100+', label: 'Pelanggan' }] },
  gallery: { title: 'Galeri', images: ['https://contoh.com/foto1.jpg'] },
  testimonials: { title: 'Testimoni', items: [{ quote: 'Pelayanan mantap!', name: 'Budi' }] },
  team: { title: 'Tim Kami', items: [{ nama: 'Nama', jabatan: 'Posisi', foto_url: '' }] },
  pricing_table: { title: 'Paket Harga', plans: [{ nama: 'Basic', harga: 'Rp 500rb', fitur: ['Fitur 1', 'Fitur 2'] }] },
  faq: { title: 'FAQ', items: [{ q: 'Pertanyaan?', a: 'Jawaban.' }] },
}

type Props = {
  page: LandingPage
  initialSections: PageSection[]
}

export default function BuilderEditor({ page, initialSections }: Props) {
  const router = useRouter()
  const [sections, setSections] = useState<PageSection[]>(initialSections)
  const [status, setStatus] = useState(page.status)
  const [features, setFeatures] = useState<FeatureFlags>(
    (page.konfigurasi as KonfigurasiWebsite)?.features ?? {}
  )
  const [dataKontenText, setDataKontenText] = useState(
    JSON.stringify(page.data_konten ?? {}, null, 2)
  )
  const [newKomponen, setNewKomponen] = useState<TipeKomponen>('hero_banner')
  const [busy, setBusy] = useState<string | null>(null)

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ?? ''
  const publicUrl = page.slug ? `${baseUrl}/${page.slug}` : null

  // ── helpers ────────────────────────────────────────────────
  async function call(url: string, method: string, body: unknown): Promise<any> {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json.error ?? `${res.status}`)
    return json
  }

  // ── page-level actions ─────────────────────────────────────
  const savePageConfig = async () => {
    setBusy('config')
    try {
      let parsed: Record<string, unknown>
      try {
        parsed = JSON.parse(dataKontenText)
      } catch {
        alert('data_konten bukan JSON valid')
        return
      }
      await call('/api/admin/pages', 'PATCH', {
        id: page.id,
        konfigurasi: { ...(page.konfigurasi ?? {}), features },
        data_konten: parsed,
      })
      alert('Konfigurasi & konten tersimpan')
      router.refresh()
    } catch (e: any) {
      alert(`Gagal: ${e.message}`)
    } finally {
      setBusy(null)
    }
  }

  const togglePublish = async () => {
    const action = status === 'published' ? 'unpublish' : 'publish'
    setBusy('publish')
    try {
      const { page: updated } = await call('/api/admin/pages', 'PATCH', { id: page.id, action })
      setStatus(updated.status)
      router.refresh()
    } catch (e: any) {
      alert(`Gagal: ${e.message}`)
    } finally {
      setBusy(null)
    }
  }

  // ── section actions ────────────────────────────────────────
  const addSection = async () => {
    setBusy('add')
    try {
      const nextUrutan = sections.length
        ? Math.max(...sections.map((s) => s.urutan)) + 1
        : 0
      const { section } = await call('/api/admin/sections', 'POST', {
        page_id: page.id,
        tenant_id: page.tenant_id,
        urutan: nextUrutan,
        tipe_komponen: newKomponen,
        isi_komponen: {},
        is_visible: true,
      })
      setSections((prev) => [...prev, section])
    } catch (e: any) {
      alert(`Gagal tambah section: ${e.message}`)
    } finally {
      setBusy(null)
    }
  }

  const saveSectionContent = async (id: string, text: string) => {
    setBusy(`content-${id}`)
    try {
      let parsed: Record<string, unknown>
      try {
        parsed = JSON.parse(text)
      } catch {
        alert('isi_komponen bukan JSON valid')
        return
      }
      const { section } = await call('/api/admin/sections', 'PATCH', {
        action: 'content',
        sectionId: id,
        isi_komponen: parsed,
      })
      setSections((prev) => prev.map((s) => (s.id === id ? section : s)))
    } catch (e: any) {
      alert(`Gagal: ${e.message}`)
    } finally {
      setBusy(null)
    }
  }

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    setBusy(`vis-${id}`)
    try {
      const { section } = await call('/api/admin/sections', 'PATCH', {
        action: 'visibility',
        sectionId: id,
        is_visible: isVisible,
      })
      setSections((prev) => prev.map((s) => (s.id === id ? section : s)))
    } catch (e: any) {
      alert(`Gagal: ${e.message}`)
    } finally {
      setBusy(null)
    }
  }

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= sections.length) return
    const a = sections[index]
    const b = sections[target]
    setBusy('reorder')
    try {
      await call('/api/admin/sections', 'PATCH', {
        action: 'reorder',
        updates: [
          { id: a.id, urutan: b.urutan },
          { id: b.id, urutan: a.urutan },
        ],
      })
      // tukar di state + sort
      const swapped = sections.map((s) => {
        if (s.id === a.id) return { ...s, urutan: b.urutan }
        if (s.id === b.id) return { ...s, urutan: a.urutan }
        return s
      })
      swapped.sort((x, y) => x.urutan - y.urutan)
      setSections(swapped)
    } catch (e: any) {
      alert(`Gagal reorder: ${e.message}`)
    } finally {
      setBusy(null)
    }
  }

  const removeSection = async (id: string) => {
    if (!confirm('Hapus section ini?')) return
    setBusy(`del-${id}`)
    try {
      await call('/api/admin/sections', 'DELETE', { pageId: page.id, sectionIds: [id] })
      setSections((prev) => prev.filter((s) => s.id !== id))
    } catch (e: any) {
      alert(`Gagal hapus: ${e.message}`)
    } finally {
      setBusy(null)
    }
  }

  // ── render ─────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Website Builder · {page.tipe_industri}
            </p>
            <h1 className="text-3xl sf-display-heavy text-[#1D1D1F] tracking-tight">
              {page.nama_website}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  status === 'published'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-orange-50 text-orange-600'
                }`}
              >
                {status}
              </span>
              {publicUrl && (
                <a
                  href={publicUrl}
                  target="_blank"
                  className="text-xs font-bold text-apple-blue hover:underline flex items-center gap-1"
                >
                  /{page.slug} <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
          <button
            disabled={busy === 'publish'}
            onClick={togglePublish}
            className={`flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-xs font-bold uppercase tracking-widest text-white transition-colors disabled:opacity-50 ${
              status === 'published'
                ? 'bg-gray-700 hover:bg-gray-800'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {busy === 'publish' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : status === 'published' ? (
              <Undo2 size={16} />
            ) : (
              <Rocket size={16} />
            )}
            {status === 'published' ? 'Tarik (Draft)' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Feature flags + data_konten */}
      <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03] space-y-6">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Add-on (Feature Flags)
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(FEATURE_LABELS) as (keyof FeatureFlags)[]).map((key) => {
              const on = !!features[key]
              return (
                <button
                  key={key}
                  onClick={() => setFeatures((f) => ({ ...f, [key]: !on }))}
                  className={`px-4 py-2 rounded-full text-[11px] font-bold border transition-colors ${
                    on
                      ? 'bg-apple-blue text-white border-apple-blue'
                      : 'bg-gray-50 text-gray-500 border-black/5 hover:border-apple-blue/40'
                  }`}
                >
                  {FEATURE_LABELS[key]}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Pengaturan Halaman — SEO / Meta (JSON)
          </p>
          <p className="text-[11px] text-gray-400 mb-2">
            Ini untuk judul/deskripsi SEO halaman, mis. <code>{'{ "meta_title": "...", "meta_description": "..." }'}</code>.
            <strong className="text-gray-500"> Bukan</strong> tempat isi konten — isi konten diatur di tiap <em>Section</em> di bawah.
          </p>
          <textarea
            value={dataKontenText}
            onChange={(e) => setDataKontenText(e.target.value)}
            rows={5}
            spellCheck={false}
            className="w-full text-xs font-mono rounded-xl border border-black/10 p-3 focus:border-apple-blue focus:outline-none"
          />
        </div>

        <button
          disabled={busy === 'config'}
          onClick={savePageConfig}
          className="flex items-center gap-2 py-2.5 px-5 bg-apple-blue text-white rounded-xl text-[11px] font-bold hover:bg-blue-600 transition-colors uppercase tracking-widest disabled:opacity-50"
        >
          {busy === 'config' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Simpan Pengaturan Halaman
        </button>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03] space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Section Halaman ({sections.length})
          </p>
          <div className="flex items-center gap-2">
            <select
              value={newKomponen}
              onChange={(e) => setNewKomponen(e.target.value as TipeKomponen)}
              className="text-xs rounded-xl border border-black/10 px-3 py-2 focus:border-apple-blue focus:outline-none"
            >
              {KOMPONEN_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <button
              disabled={busy === 'add'}
              onClick={addSection}
              className="flex items-center gap-1 py-2 px-4 bg-gray-900 text-white rounded-xl text-[11px] font-bold hover:bg-black transition-colors uppercase disabled:opacity-50"
            >
              {busy === 'add' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Tambah
            </button>
          </div>
        </div>

        {sections.length === 0 ? (
          <p className="text-sm text-gray-400 italic py-8 text-center">
            Belum ada section. Tambahkan komponen di atas.
          </p>
        ) : (
          <div className="space-y-4">
            {sections.map((s, i) => (
              <SectionRow
                key={s.id}
                section={s}
                index={i}
                total={sections.length}
                busy={busy}
                onMove={move}
                onToggle={toggleVisibility}
                onDelete={removeSection}
                onSaveContent={saveSectionContent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Section row (kelola 1 section) ───────────────────────────
function SectionRow({
  section,
  index,
  total,
  busy,
  onMove,
  onToggle,
  onDelete,
  onSaveContent,
}: {
  section: PageSection
  index: number
  total: number
  busy: string | null
  onMove: (index: number, dir: -1 | 1) => void
  onToggle: (id: string, isVisible: boolean) => void
  onDelete: (id: string) => void
  onSaveContent: (id: string, text: string) => void
}) {
  const schema = FIELD_SCHEMA[section.tipe_komponen]
  const isi = (section.isi_komponen ?? {}) as Record<string, any>

  // Mode form (tipe ber-skema): state per field.
  const [vals, setVals] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    if (schema) for (const f of schema) init[f.key] = isi[f.key] ?? ''
    return init
  })
  // Mode JSON (tipe list / lainnya): prefilled template kalau kosong.
  const [text, setText] = useState(() => {
    if (Object.keys(isi).length) return JSON.stringify(isi, null, 2)
    const tmpl = JSON_TEMPLATE[section.tipe_komponen]
    return tmpl ? JSON.stringify(tmpl, null, 2) : '{}'
  })

  const save = () => {
    if (schema) {
      const obj: Record<string, string> = {}
      for (const f of schema) {
        const v = vals[f.key]?.trim()
        if (v) obj[f.key] = v
      }
      onSaveContent(section.id, JSON.stringify(obj))
    } else {
      onSaveContent(section.id, text)
    }
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-[#F9F9FB] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400">#{section.urutan}</span>
          <span className="text-xs font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-black/5">
            {section.tipe_komponen}
          </span>
          {!section.is_visible && (
            <span className="text-[10px] font-bold text-gray-400 uppercase">tersembunyi</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            disabled={index === 0 || busy === 'reorder'}
            onClick={() => onMove(index, -1)}
            className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30"
            title="Naik"
          >
            <ArrowUp size={14} />
          </button>
          <button
            disabled={index === total - 1 || busy === 'reorder'}
            onClick={() => onMove(index, 1)}
            className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30"
            title="Turun"
          >
            <ArrowDown size={14} />
          </button>
          <button
            onClick={() => onToggle(section.id, !section.is_visible)}
            className="p-1.5 rounded-lg hover:bg-white"
            title={section.is_visible ? 'Sembunyikan' : 'Tampilkan'}
          >
            {section.is_visible ? <Eye size={14} /> : <EyeOff size={14} className="text-gray-400" />}
          </button>
          <button
            onClick={() => onDelete(section.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
            title="Hapus"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {schema ? (
        // ── Form isian (tipe umum) ──
        <div className="space-y-3 bg-white rounded-xl border border-black/5 p-4">
          {schema.map((f) => (
            <div key={f.key}>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                {f.label}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  value={vals[f.key] ?? ''}
                  onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))}
                  rows={3}
                  placeholder={f.placeholder}
                  className="w-full text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none"
                />
              ) : (
                <input
                  type={f.type === 'url' ? 'url' : 'text'}
                  value={vals[f.key] ?? ''}
                  onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none"
                />
              )}
            </div>
          ))}
          {(section.tipe_komponen === 'product_list' || section.tipe_komponen === 'blog_list') && (
            <p className="text-[11px] text-gray-400">
              Daftar {section.tipe_komponen === 'product_list' ? 'produk' : 'artikel'} diisi di panel
              {section.tipe_komponen === 'product_list' ? ' Produk' : ' Blog'} (bawah halaman ini).
            </p>
          )}
        </div>
      ) : (
        // ── Mode JSON (tipe list/lanjutan) ──
        <div>
          <p className="text-[11px] text-gray-400 mb-1">
            Tipe ini diisi via JSON (template sudah disediakan — sesuaikan nilainya):
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            spellCheck={false}
            className="w-full text-xs font-mono rounded-xl border border-black/10 p-3 focus:border-apple-blue focus:outline-none bg-white"
          />
        </div>
      )}

      <button
        disabled={busy === `content-${section.id}`}
        onClick={save}
        className="mt-3 flex items-center gap-1.5 py-2.5 px-5 bg-apple-blue text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors uppercase tracking-widest disabled:opacity-50 shadow-sm"
      >
        {busy === `content-${section.id}` ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Save size={14} />
        )}
        Simpan Isi Section
      </button>
    </div>
  )
}
