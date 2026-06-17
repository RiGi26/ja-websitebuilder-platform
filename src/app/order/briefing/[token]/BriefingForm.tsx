'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { industriToTipe } from '@/lib/websitebuilder-mapping'
import type { TipeIndustri } from '@/types/websitebuilder'
import { getVariants } from '@/lib/website-variants'
import { ChevronLeft, ChevronRight, Plus, Trash2, Check, Loader2, Clock, Sparkles } from 'lucide-react'
import BrandingPreview from './BrandingPreview'
import SubKategoriPicker from './SubKategoriPicker'
import ThemePicker from './ThemePicker'
import { getReadySubKategori, getThemes } from '@/lib/theme-system/taxonomy'
import { BESPOKE_VARIANTS } from '@/app/components/themes/toko-bespoke/variants'
import ImageUploadField from '@/app/portal/ImageUploadField'
import HeroImageField from '@/app/portal/HeroImageField'
import { composeDeskripsi } from '@/lib/build/composeNarasi'

// ── Types ─────────────────────────────────────────────────────
interface FleetRow { nama: string; kategori: string; kapasitas: string; transmisi: string; harga: string; foto_url: string }
interface MenuRow { nama: string; kategori: string; harga: string; deskripsi: string; foto_url: string }
interface LayananRow { nama: string; deskripsi: string; foto_url: string }
interface DokterRow { nama: string; spesialis: string; jadwal: string; foto_url: string }
interface ProgramRow { nama: string; deskripsi: string; biaya: string; foto_url: string }
interface ProdukRow { nama: string; harga: string; foto_url: string }

interface FormState {
  // Step 0 — Identitas
  nama_usaha: string
  tagline: string
  // Pertanyaan terpandu (jantung Step 0) — digabung jadi deskripsi situs.
  tawaran: string
  pelanggan: string
  deskripsi: string // diisi otomatis dari komposisi narasi; freeform legacy/fallback.
  wa: string
  email: string
  alamat: string
  jam_operasional: string
  kota_layanan: string
  // Step 1 — Konten spesifik (per industri)
  fleet: FleetRow[]
  menu: MenuRow[]
  layanan: LayananRow[]
  bidang_usaha: string
  tahun_berdiri: string
  klien_unggulan: string
  dokter: DokterRow[]
  fasilitas: string
  asuransi: string
  program: ProgramRow[]
  akreditasi: string
  visi: string
  ppdb_aktif: boolean
  kategori_produk: string
  produk_unggulan: ProdukRow[]
  sosmed_marketplace: string
  bio: string
  topik: string
  // Universal — Keunggulan & Syarat
  keunggulan: [string, string, string]
  syarat_sewa: string
  // Step 2 — Branding
  sub_kategori: string // Theme System: jenis toko (mem-filter tema). Kosong = jalur lama.
  variant: string
  primary_color: string
  logo_url: string
  foto_hero: string
  foto_hero_focus: string
  referensi_website: string
  instagram: string
  tiktok: string
  shopee: string
}

const INIT: FormState = {
  nama_usaha: '', tagline: '', tawaran: '', pelanggan: '', deskripsi: '', wa: '', email: '',
  alamat: '', jam_operasional: '', kota_layanan: '',
  fleet: [{ nama: '', kategori: '', kapasitas: '', transmisi: '', harga: '', foto_url: '' }],
  menu: [{ nama: '', kategori: '', harga: '', deskripsi: '', foto_url: '' }],
  layanan: [{ nama: '', deskripsi: '', foto_url: '' }],
  bidang_usaha: '', tahun_berdiri: '', klien_unggulan: '',
  dokter: [{ nama: '', spesialis: '', jadwal: '', foto_url: '' }],
  fasilitas: '', asuransi: '',
  program: [{ nama: '', deskripsi: '', biaya: '', foto_url: '' }],
  akreditasi: '', visi: '', ppdb_aktif: false,
  kategori_produk: '', produk_unggulan: [{ nama: '', harga: '', foto_url: '' }], sosmed_marketplace: '',
  bio: '', topik: '',
  keunggulan: ['', '', ''],
  syarat_sewa: '',
  sub_kategori: '',
  variant: '',
  primary_color: '#0071E3', logo_url: '', foto_hero: '', foto_hero_focus: '', referensi_website: '',
  instagram: '', tiktok: '', shopee: '',
}

// ── Theme default color per industri ──────────────────────────
const INDUSTRY_COLOR: Record<string, string> = {
  travel: '#EA580C',
  restaurant: '#B45309',
  corporate: '#1D4ED8',
  klinik: '#059669',
  sekolah: '#7C3AED',
  toko_online: '#DC2626',
  personal: '#DB2777',
  blog: '#0EA5E9',
  jastip: '#D97706',
}

// ── Contoh jawaban "pertanyaan terpandu" per industri (placeholder, bukan default) ──
const NARASI_PH: Record<string, { tawaran: string; pelanggan: string; pembeda: string }> = {
  travel: { tawaran: 'Sewa mobil harian & lepas kunci', pelanggan: 'Keluarga & wisatawan di Bali', pembeda: 'Antar-jemput bandara 24 jam' },
  restaurant: { tawaran: 'Masakan Sunda rumahan, dimasak saat dipesan', pelanggan: 'Keluarga & karyawan kantor sekitar', pembeda: 'Resep warisan, bumbu diulek sendiri' },
  corporate: { tawaran: 'Jasa konsultan pajak & pembukuan', pelanggan: 'Pemilik UMKM tanpa tim finance', pembeda: 'Pendampingan langsung tiap bulan' },
  klinik: { tawaran: 'Klinik gigi keluarga & perawatan estetik', pelanggan: 'Keluarga muda di Bekasi', pembeda: 'Dokter berpengalaman 10+ tahun' },
  sekolah: { tawaran: 'Sekolah Islam terpadu jenjang SD', pelanggan: 'Orang tua yang ingin anak hafal Quran', pembeda: 'Kelas kecil, maksimal 15 siswa' },
  toko_online: { tawaran: 'Batik tulis Pekalongan handmade', pelanggan: 'Pencinta wastra Nusantara', pembeda: 'Motif eksklusif, jumlah terbatas' },
}
const NARASI_PH_DEFAULT = { tawaran: 'Jasa fotografi pernikahan & prewedding', pelanggan: 'Pasangan yang menikah tahun ini', pembeda: 'Gaya candid natural, file lengkap' }

// ── Helpers ───────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-4 py-3 rounded-[14px] border border-black/[0.08] text-sm font-medium focus:outline-none focus:border-[#0071E3] bg-white transition-colors"
const textareaCls = `${inputCls} resize-none`

// ── Props ─────────────────────────────────────────────────────
interface Props {
  token: string
  orderId: string
  namaKlien: string
  nomorWa: string
  email: string
  industri: string
  selectedAddons: string[]
  // Handoff tema dari galeri preview corp (Fase 3) → default sub-kat + varian.
  preselect?: { sub_kategori?: string | null; variant?: string }
}

// Tipe industri dari tema bespoke (handoff). Label industri corp bisa salah-petak
// (mis. "Kuliner & Makanan" → restaurant via industriToTipe), padahal tema
// kuliner-tungku itu toko_online. Tema yang dipilih = sumber kebenaran tipe.
function tipeFromVariant(variant?: string): TipeIndustri | null {
  if (!variant) return null
  const themeKey = BESPOKE_VARIANTS[variant]?.theme
  if (!themeKey) return null
  // Restoran: 'restaurant-lux' (finedining) + 'restaurant-warung' (Wave 2) → restaurant.
  if (themeKey === 'restaurant-lux' || themeKey.startsWith('restaurant-')) return 'restaurant'
  if (themeKey.startsWith('toko-')) return 'toko_online'
  // Wave 2 jasa: tema bespoke industri-jasa diberi key `<tipe>-<subcat>` (mis.
  // 'klinik-umum'). Bila handoff corp salah-petak industri (mis. "Bisnis Jasa" →
  // corporate), tema terpilih tetap memulihkan tipe yang benar.
  if (themeKey.startsWith('klinik-')) return 'klinik'
  if (themeKey.startsWith('sekolah-')) return 'sekolah'
  return null
}

export default function BriefingForm({ token, orderId, namaKlien, nomorWa, email, industri, preselect }: Props) {
  const router = useRouter()
  // Tema preselect (handoff) menentukan tipe bila ada — override label industri
  // yang mungkin salah-petak. Tanpa preselect → perilaku lama (dari industri).
  const tipe = tipeFromVariant(preselect?.variant) ?? industriToTipe(industri)
  const defaultColor = INDUSTRY_COLOR[tipe] ?? '#0071E3'
  const ph = NARASI_PH[tipe] ?? NARASI_PH_DEFAULT
  const variants = getVariants(tipe)
  const defaultVariant = variants[0]?.id ?? ''

  // Validasi preselect untuk tipe ini: tema bespoke sub-kat ATAU varian generik.
  // Tak valid → null → brief pakai default (degradasi aman).
  const preselected = (() => {
    const v = preselect?.variant
    if (!v) return null
    const sk = preselect?.sub_kategori ?? ''
    if (sk && getThemes(tipe, sk).some((t) => t.id === v)) return { sub_kategori: sk, variant: v }
    if (variants.some((x) => x.id === v)) return { sub_kategori: '', variant: v }
    return null
  })()
  // Unggah gambar via token briefing (pra-akun) — bukan sesi portal.
  const uploadProps = { uploadUrl: '/api/briefing/upload', extraFields: { token } }

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>({
    ...INIT,
    nama_usaha: namaKlien,
    wa: nomorWa,
    email,
    sub_kategori: preselected?.sub_kategori ?? '',
    variant: preselected?.variant ?? defaultVariant,
    primary_color: defaultColor,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editKontak, setEditKontak] = useState(false)
  const [showSoftGate, setShowSoftGate] = useState(false)

  const selectedVariant = variants.find(v => v.id === form.variant) ?? variants[0]

  // Theme System (S0-3): saat sub-kategori dipilih, selector tema menggantikan
  // grid variant lama. Dormant sampai ada sub-kategori `ready` (lihat picker).
  const themeMode = !!form.sub_kategori && getThemes(tipe, form.sub_kategori).length > 0
  const selectedTheme = themeMode
    ? getThemes(tipe, form.sub_kategori).find(t => t.id === form.variant)
    : undefined
  const previewBg = selectedTheme?.bg ?? selectedVariant?.bg ?? 'light'
  const previewNama = selectedTheme?.nama ?? selectedVariant?.nama ?? ''

  const set = (key: keyof FormState, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  // Opsi C: item inti showcase per industri → chip kelengkapan LEMBUT (nudge, bukan
  // blokir; form tetap bisa diteruskan lewat nav "Lanjut ke Branding").
  const CORE_NOUN: Partial<Record<string, string>> = {
    travel: 'armada', restaurant: 'menu', corporate: 'layanan',
    klinik: 'dokter', sekolah: 'program', toko_online: 'produk',
  }
  const coreNoun = CORE_NOUN[tipe]
  const coreList: { nama: string }[] | null =
    tipe === 'travel' ? form.fleet
      : tipe === 'restaurant' ? form.menu
        : tipe === 'corporate' ? form.layanan
          : tipe === 'klinik' ? form.dokter
            : tipe === 'sekolah' ? form.program
              : tipe === 'toko_online' ? form.produk_unggulan
                : null
  const coreCount = coreList ? coreList.filter((r) => (r.nama ?? '').trim()).length : 0

  // ── Draft auto-save (P0) — tab ketutup tidak hilang ───────────
  const DRAFT_KEY = `ja_briefing_draft_${token}`

  // Pulihkan draft saat mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) setForm(f => ({ ...f, ...JSON.parse(raw) }))
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Simpan otomatis tiap perubahan
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
    } catch { /* ignore */ }
  }, [DRAFT_KEY, form])

  // ── Dynamic row helpers ───────────────────────────────────────
  function addRow<T>(key: keyof FormState, empty: T) {
    setForm(f => ({ ...f, [key]: [...(f[key] as T[]), empty] }))
  }
  function removeRow<T>(key: keyof FormState, idx: number) {
    setForm(f => ({ ...f, [key]: (f[key] as T[]).filter((_, i) => i !== idx) }))
  }
  function updateRow(key: keyof FormState, idx: number, field: string, val: string) {
    setForm(f => {
      const arr = [...(f[key] as unknown as Record<string, string>[])]
      arr[idx] = { ...arr[idx], [field]: val }
      return { ...f, [key]: arr as unknown as FormState[typeof key] }
    })
  }

  const STEPS = ['Identitas', 'Konten Website', 'Branding', 'Konfirmasi']

  // ── Submit ────────────────────────────────────────────────────
  // Soft-gate: kalau "Apa yang Anda tawarkan?" (bahan utama copy) kosong, tahan
  // sekali dengan kartu ramah — bukan blokir. "Lanjut saja" memanggil doSubmit.
  const handleSubmit = () => {
    if (!form.tawaran.trim()) {
      setShowSoftGate(true)
      return
    }
    doSubmit()
  }

  const doSubmit = async () => {
    setShowSoftGate(false)
    setSubmitting(true)
    setError(null)
    try {
      const briefing_data = buildBriefingData()
      const res = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, briefing_data }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Gagal submit')
      try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
      setSubmitted(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  function buildBriefingData() {
    // Pembeda (Q3) = keunggulan. Deskripsi disusun dari jawaban terpandu; freeform
    // legacy dipakai bila komposisi kosong (mis. draft lama). Narasi mentah ikut
    // disimpan terstruktur untuk pemakaian lanjutan (mis. enhance AI ke depan).
    const pembeda = form.keunggulan.filter((k) => k.trim())
    const deskripsiKomposit =
      composeDeskripsi({ tawaran: form.tawaran, pelanggan: form.pelanggan, pembeda }) || form.deskripsi
    const base = {
      industri_tipe: tipe,
      identitas: {
        nama_usaha: form.nama_usaha,
        tagline: form.tagline,
        deskripsi: deskripsiKomposit,
        narasi: { tawaran: form.tawaran, pelanggan: form.pelanggan, pembeda },
        wa: form.wa,
        email: form.email,
        alamat: form.alamat,
        jam_operasional: form.jam_operasional,
        kota_layanan: form.kota_layanan.split(',').map(s => s.trim()).filter(Boolean),
      },
      branding: {
        sub_kategori: form.sub_kategori,
        variant: form.variant,
        primary_color: form.primary_color,
        logo_url: form.logo_url,
        foto_hero: form.foto_hero,
        foto_hero_focus: form.foto_hero_focus,
        referensi_website: form.referensi_website,
      },
      sosial_media: {
        instagram: form.instagram,
        tiktok: form.tiktok,
        shopee: form.shopee,
      },
    }

    const konten: Record<string, unknown> = {}
    // Keunggulan universal (semua industri)
    konten.keunggulan = form.keunggulan.filter(k => k.trim())
    if (tipe === 'travel') {
      konten.fleet = form.fleet.filter(r => r.nama.trim())
      if (form.syarat_sewa.trim()) konten.syarat_sewa = form.syarat_sewa
    } else if (tipe === 'restaurant') {
      konten.menu = form.menu.filter(r => r.nama.trim())
    } else if (tipe === 'corporate') {
      konten.layanan = form.layanan.filter(r => r.nama.trim())
      konten.bidang_usaha = form.bidang_usaha
      konten.tahun_berdiri = form.tahun_berdiri ? parseInt(form.tahun_berdiri) : null
      konten.klien_unggulan = form.klien_unggulan.split(',').map(s => s.trim()).filter(Boolean)
    } else if (tipe === 'klinik') {
      konten.dokter = form.dokter.filter(r => r.nama.trim())
      konten.fasilitas = form.fasilitas.split(',').map(s => s.trim()).filter(Boolean)
      konten.asuransi = form.asuransi.split(',').map(s => s.trim()).filter(Boolean)
    } else if (tipe === 'sekolah') {
      konten.program = form.program.filter(r => r.nama.trim())
      konten.akreditasi = form.akreditasi
      konten.visi = form.visi
      konten.ppdb_aktif = form.ppdb_aktif
    } else if (tipe === 'toko_online') {
      konten.kategori_produk = form.kategori_produk.split(',').map(s => s.trim()).filter(Boolean)
      konten.produk_unggulan = form.produk_unggulan.filter(r => r.nama.trim())
      konten.sosmed_marketplace = form.sosmed_marketplace
    } else {
      konten.bio = form.bio
      konten.topik = form.topik
    }

    return { ...base, konten }
  }

  // ── Success screen ────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="bg-white rounded-[32px] p-10 shadow-sm border border-black/[0.04]">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-green-600" strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
            Briefing Terkirim!
          </h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Terima kasih {namaKlien}! Tim kami akan segera review dan menghubungi Anda via WhatsApp dalam 1×24 jam.
          </p>
          <a
            href={`/track?id=${orderId}`}
            className="inline-flex items-center gap-2 py-3 px-6 bg-[#0071E3] text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors text-sm"
          >
            Lacak Progress Project
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-[#0071E3]' : 'w-4 bg-gray-200'}`} />
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
          Form Briefing Website
        </h1>
        <p className="text-gray-500 font-medium text-sm">
          Halo <strong>{namaKlien}</strong>! Isi detail di bawah agar tim kami bisa membangun website yang tepat untuk Anda.
        </p>
        <div className="flex items-center justify-center gap-x-5 gap-y-2 flex-wrap mt-4 text-xs font-medium text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} /> Sekitar 5 menit
          </span>
          <span className="inline-flex items-center gap-1.5 text-green-600">
            <Check size={13} strokeWidth={3} /> Progres tersimpan otomatis — boleh ditinggal
          </span>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 sm:p-8 md:p-10 shadow-sm border border-black/[0.03]">

        {/* ── STEP 0: IDENTITAS ──────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Identitas Bisnis</h2>
              <p className="text-sm text-gray-400 font-medium">Informasi dasar yang akan tampil di website Anda.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Nama Usaha / Brand" required>
                <input className={inputCls} value={form.nama_usaha} onChange={e => set('nama_usaha', e.target.value)} placeholder="Nusantara Drive" />
              </Field>
              <Field label="Tagline">
                <input className={inputCls} value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Perjalanan Lebih Nyaman, Harga Lebih Hemat" />
              </Field>
            </div>
            {/* INTI WEBSITE — pertanyaan terpandu (jantung Step 0). Jawaban digabung
                jadi deskripsi + keunggulan: bahan utama copy situs. Panel ber-surface
                beda agar menonjol dari field biasa. */}
            <div className="rounded-[24px] bg-blue-50/50 border border-blue-100 p-5 sm:p-6 space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0071E3]/10 flex items-center justify-center shrink-0">
                  <Sparkles size={18} className="text-[#0071E3]" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#0071E3]">Inti Website Anda</p>
                  <p className="text-base font-bold text-gray-900 mt-0.5">Ceritakan bisnis Anda, singkat saja</p>
                  <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                    Jawaban Anda kami pakai untuk menulis paragraf pembuka dan alasan orang memilih Anda. Makin spesifik, makin website terasa milik Anda sendiri.
                  </p>
                </div>
              </div>
              <Field label="Apa yang Anda tawarkan?">
                <input className={inputCls} value={form.tawaran} onChange={e => set('tawaran', e.target.value)} placeholder={ph.tawaran} />
              </Field>
              <Field label="Siapa pelanggan utama Anda?">
                <input className={inputCls} value={form.pelanggan} onChange={e => set('pelanggan', e.target.value)} placeholder={ph.pelanggan} />
              </Field>
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400">
                  Apa yang membuat Anda beda? <span className="text-gray-300 normal-case tracking-normal font-bold">(1–3 hal)</span>
                </label>
                {([0,1,2] as const).map(i => (
                  <input key={i} className={inputCls}
                    aria-label={`Hal yang membuat beda ${i + 1}`}
                    placeholder={i === 0 ? ph.pembeda : 'Hal lain yang bikin beda (opsional)'}
                    value={form.keunggulan[i]}
                    onChange={e => {
                      const arr: [string,string,string] = [...form.keunggulan] as [string,string,string]
                      arr[i] = e.target.value
                      set('keunggulan', arr)
                    }}
                  />
                ))}
              </div>
            </div>
            {!editKontak ? (
              <div className="flex items-center justify-between gap-4 p-4 rounded-[16px] bg-gray-50 border border-black/[0.05]">
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Kontak Anda</p>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {form.wa || 'Nomor belum diisi'}{form.email ? ` · ${form.email}` : ''}
                  </p>
                </div>
                <button type="button" onClick={() => setEditKontak(true)}
                  className="text-[#0071E3] text-sm font-bold shrink-0 hover:underline">
                  Ubah
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Nomor WhatsApp" required>
                  <input type="tel" inputMode="numeric" autoComplete="tel" className={inputCls} value={form.wa} onChange={e => set('wa', e.target.value)} placeholder="628123456789" />
                </Field>
                <Field label="Email Bisnis" required>
                  <input type="email" className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} placeholder="halo@bisnis.com" />
                  <p className="text-[11px] text-gray-400 font-medium">Dipakai untuk login dashboard pengelolaan website Anda.</p>
                </Field>
              </div>
            )}
            <Field label="Alamat Operasional">
              <input className={inputCls} value={form.alamat} onChange={e => set('alamat', e.target.value)} placeholder="Jl. Sudirman No. 1, Jakarta Pusat" />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Jam Operasional">
                <input className={inputCls} value={form.jam_operasional} onChange={e => set('jam_operasional', e.target.value)} placeholder="Senin–Minggu 08.00–22.00" />
              </Field>
              <Field label="Kota / Wilayah Layanan">
                <input className={inputCls} value={form.kota_layanan} onChange={e => set('kota_layanan', e.target.value)} placeholder="Jakarta, Bandung, Depok" />
              </Field>
            </div>
          </div>
        )}

        {/* ── STEP 1: KONTEN SPESIFIK ────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Konten Website</h2>
              <p className="text-sm text-gray-400 font-medium">
                Ini yang tampil di website Anda. Isi minimal beberapa agar situs langsung terasa milik Anda. Yang kosong kami isi dengan contoh yang bisa diganti kapan saja.
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-[16px] bg-blue-50/60 border border-blue-100">
              <Sparkles size={18} className="text-[#0071E3] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-gray-900">Makin banyak diisi sekarang, makin sedikit revisi nanti.</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Isi yang sudah siap saja. Yang kosong kami isi dengan contoh dulu, bisa Anda ganti kapan saja dari dashboard.
                </p>
              </div>
            </div>

            {coreNoun && (
              <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border ${coreCount >= 3 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-black/[0.06] text-gray-500'}`}>
                {coreCount >= 3 && <Check size={13} strokeWidth={3} />}
                {coreCount}/3 {coreNoun} terisi
                <span className="font-medium text-gray-400">· disarankan min. 3</span>
              </div>
            )}

            {/* TRAVEL / RENTAL */}
            {tipe === 'travel' && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-700">Daftar Armada Kendaraan</p>
                {form.fleet.map((row, i) => (
                  <div key={i} className="bg-gray-50 rounded-[16px] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Kendaraan {i + 1}</span>
                      {form.fleet.length > 1 && (
                        <button onClick={() => removeRow('fleet', i)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <input className={inputCls} placeholder="Nama (Toyota Avanza)" value={row.nama} onChange={e => updateRow('fleet', i, 'nama', e.target.value)} />
                      <input className={inputCls} placeholder="Kategori (MPV/SUV/Motor)" value={row.kategori} onChange={e => updateRow('fleet', i, 'kategori', e.target.value)} />
                      <input className={inputCls} placeholder="Kapasitas (7 Kursi)" value={row.kapasitas} onChange={e => updateRow('fleet', i, 'kapasitas', e.target.value)} />
                      <input className={inputCls} placeholder="Transmisi (Manual/Otomatis)" value={row.transmisi} onChange={e => updateRow('fleet', i, 'transmisi', e.target.value)} />
                      <input inputMode="numeric" className={inputCls} placeholder="Harga/hari (350000)" value={row.harga} onChange={e => updateRow('fleet', i, 'harga', e.target.value)} />
                      <div className="md:col-span-3">
                        <ImageUploadField value={row.foto_url} onChange={(url) => updateRow('fleet', i, 'foto_url', url)} label="Foto kendaraan (opsional)" compact {...uploadProps} />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => addRow('fleet', { nama: '', kategori: '', kapasitas: '', transmisi: '', harga: '', foto_url: '' })}
                  className="flex items-center gap-2 text-[#0071E3] text-sm font-bold hover:underline">
                  <Plus size={16} /> Tambah Kendaraan
                </button>

                {/* Syarat Sewa — khusus rental. (Keunggulan kini ditanya di Step 0
                    "Apa yang membuat Anda beda?", tak diulang di sini.) */}
                <div className="pt-4 border-t border-black/[0.05]">
                  <Field label="Syarat Sewa (opsional)">
                    <textarea className={textareaCls} rows={2} value={form.syarat_sewa}
                      onChange={e => set('syarat_sewa', e.target.value)}
                      placeholder="Contoh: KTP asli + SIM A/C, deposit Rp 500.000, minimal sewa 12 jam" />
                  </Field>
                </div>
              </div>
            )}

            {/* RESTAURANT */}
            {tipe === 'restaurant' && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-700">Menu Unggulan</p>
                {form.menu.map((row, i) => (
                  <div key={i} className="bg-gray-50 rounded-[16px] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Menu {i + 1}</span>
                      {form.menu.length > 1 && (
                        <button onClick={() => removeRow('menu', i)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <input className={inputCls} placeholder="Nama menu" value={row.nama} onChange={e => updateRow('menu', i, 'nama', e.target.value)} />
                      <input className={inputCls} placeholder="Kategori (Main, Appetizer)" value={row.kategori} onChange={e => updateRow('menu', i, 'kategori', e.target.value)} />
                      <input inputMode="numeric" className={inputCls} placeholder="Harga (35000)" value={row.harga} onChange={e => updateRow('menu', i, 'harga', e.target.value)} />
                      <input className={`${inputCls} col-span-2 md:col-span-3`} placeholder="Deskripsi singkat" value={row.deskripsi} onChange={e => updateRow('menu', i, 'deskripsi', e.target.value)} />
                      <div className="col-span-2 md:col-span-3">
                        <ImageUploadField value={row.foto_url} onChange={(url) => updateRow('menu', i, 'foto_url', url)} label="Foto menu (opsional)" compact {...uploadProps} />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => addRow('menu', { nama: '', kategori: '', harga: '', deskripsi: '', foto_url: '' })}
                  className="flex items-center gap-2 text-[#0071E3] text-sm font-bold hover:underline">
                  <Plus size={16} /> Tambah Menu
                </button>
              </div>
            )}

            {/* CORPORATE */}
            {tipe === 'corporate' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Bidang Usaha">
                    <input className={inputCls} placeholder="Konsultasi IT, Digital Marketing..." value={form.bidang_usaha} onChange={e => set('bidang_usaha', e.target.value)} />
                  </Field>
                  <Field label="Tahun Berdiri">
                    <input type="number" className={inputCls} placeholder="2015" value={form.tahun_berdiri} onChange={e => set('tahun_berdiri', e.target.value)} />
                  </Field>
                </div>
                <Field label="Klien Unggulan (pisahkan koma)">
                  <input className={inputCls} placeholder="Telkom, BNI, Astra..." value={form.klien_unggulan} onChange={e => set('klien_unggulan', e.target.value)} />
                </Field>
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-3">Layanan Utama</p>
                  {form.layanan.map((row, i) => (
                    <div key={i} className="bg-gray-50 rounded-[16px] p-4 mb-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Layanan {i + 1}</span>
                        {form.layanan.length > 1 && (
                          <button onClick={() => removeRow('layanan', i)} className="text-red-400 shrink-0"><Trash2 size={14} /></button>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <input className={inputCls} placeholder="Nama layanan" value={row.nama} onChange={e => updateRow('layanan', i, 'nama', e.target.value)} />
                        <input className={inputCls} placeholder="Deskripsi singkat" value={row.deskripsi} onChange={e => updateRow('layanan', i, 'deskripsi', e.target.value)} />
                      </div>
                      <ImageUploadField value={row.foto_url} onChange={(url) => updateRow('layanan', i, 'foto_url', url)} label="Foto layanan (opsional)" compact {...uploadProps} />
                    </div>
                  ))}
                  <button onClick={() => addRow('layanan', { nama: '', deskripsi: '', foto_url: '' })}
                    className="flex items-center gap-2 text-[#0071E3] text-sm font-bold hover:underline">
                    <Plus size={16} /> Tambah Layanan
                  </button>
                </div>
              </div>
            )}

            {/* KLINIK */}
            {tipe === 'klinik' && (
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-3">Dokter / Tenaga Medis</p>
                  {form.dokter.map((row, i) => (
                    <div key={i} className="bg-gray-50 rounded-[16px] p-4 mb-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Dokter {i + 1}</span>
                        {form.dokter.length > 1 && <button onClick={() => removeRow('dokter', i)} className="text-red-400"><Trash2 size={14} /></button>}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <input className={inputCls} placeholder="Nama dokter" value={row.nama} onChange={e => updateRow('dokter', i, 'nama', e.target.value)} />
                        <input className={inputCls} placeholder="Spesialisasi" value={row.spesialis} onChange={e => updateRow('dokter', i, 'spesialis', e.target.value)} />
                        <input className={`${inputCls} col-span-2 sm:col-span-1`} placeholder="Jadwal praktik" value={row.jadwal} onChange={e => updateRow('dokter', i, 'jadwal', e.target.value)} />
                        <div className="col-span-2 sm:col-span-3">
                          <ImageUploadField value={row.foto_url} onChange={(url) => updateRow('dokter', i, 'foto_url', url)} label="Foto dokter (opsional)" compact {...uploadProps} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addRow('dokter', { nama: '', spesialis: '', jadwal: '', foto_url: '' })}
                    className="flex items-center gap-2 text-[#0071E3] text-sm font-bold hover:underline">
                    <Plus size={16} /> Tambah Dokter
                  </button>
                </div>
                <Field label="Fasilitas (pisahkan koma)">
                  <input className={inputCls} placeholder="Lab, USG, Farmasi, Fisioterapi..." value={form.fasilitas} onChange={e => set('fasilitas', e.target.value)} />
                </Field>
                <Field label="Asuransi Diterima (pisahkan koma)">
                  <input className={inputCls} placeholder="BPJS, Allianz, Prudential..." value={form.asuransi} onChange={e => set('asuransi', e.target.value)} />
                </Field>
              </div>
            )}

            {/* SEKOLAH */}
            {tipe === 'sekolah' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Akreditasi">
                    <input className={inputCls} placeholder="A / B / C" value={form.akreditasi} onChange={e => set('akreditasi', e.target.value)} />
                  </Field>
                  <Field label="PPDB Sedang Buka?">
                    <div className="flex items-center gap-3 pt-3">
                      <input type="checkbox" id="ppdb" checked={form.ppdb_aktif} onChange={e => set('ppdb_aktif', e.target.checked)} className="w-4 h-4 rounded" />
                      <label htmlFor="ppdb" className="text-sm font-medium text-gray-700">Ya, PPDB aktif</label>
                    </div>
                  </Field>
                </div>
                <Field label="Visi Sekolah">
                  <textarea className={textareaCls} rows={2} value={form.visi} onChange={e => set('visi', e.target.value)} placeholder="Visi utama sekolah..." />
                </Field>
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-3">Program / Jurusan</p>
                  {form.program.map((row, i) => (
                    <div key={i} className="bg-gray-50 rounded-[16px] p-4 mb-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Program {i + 1}</span>
                        {form.program.length > 1 && <button onClick={() => removeRow('program', i)} className="text-red-400 shrink-0"><Trash2 size={14} /></button>}
                      </div>
                      <div className="flex gap-3">
                        <input className={inputCls} placeholder="Nama program" value={row.nama} onChange={e => updateRow('program', i, 'nama', e.target.value)} />
                        <input className={inputCls} placeholder="Deskripsi" value={row.deskripsi} onChange={e => updateRow('program', i, 'deskripsi', e.target.value)} />
                        <input className={inputCls} placeholder="Biaya (5000000)" value={row.biaya} onChange={e => updateRow('program', i, 'biaya', e.target.value)} />
                      </div>
                      <ImageUploadField value={row.foto_url} onChange={(url) => updateRow('program', i, 'foto_url', url)} label="Foto program (opsional)" compact {...uploadProps} />
                    </div>
                  ))}
                  <button onClick={() => addRow('program', { nama: '', deskripsi: '', biaya: '', foto_url: '' })}
                    className="flex items-center gap-2 text-[#0071E3] text-sm font-bold hover:underline">
                    <Plus size={16} /> Tambah Program
                  </button>
                </div>
              </div>
            )}

            {/* TOKO ONLINE */}
            {tipe === 'toko_online' && (
              <div className="space-y-5">
                <Field label="Kategori Produk (pisahkan koma)">
                  <input className={inputCls} placeholder="Batik, Aksesoris, Fashion..." value={form.kategori_produk} onChange={e => set('kategori_produk', e.target.value)} />
                </Field>
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-3">Produk Unggulan</p>
                  {form.produk_unggulan.map((row, i) => (
                    <div key={i} className="bg-gray-50 rounded-[16px] p-4 mb-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Produk {i + 1}</span>
                        {form.produk_unggulan.length > 1 && <button onClick={() => removeRow('produk_unggulan', i)} className="text-red-400 shrink-0"><Trash2 size={14} /></button>}
                      </div>
                      <div className="flex gap-3">
                        <input className={inputCls} placeholder="Nama produk" value={row.nama} onChange={e => updateRow('produk_unggulan', i, 'nama', e.target.value)} />
                        <input inputMode="numeric" className={inputCls} placeholder="Harga (250000)" value={row.harga} onChange={e => updateRow('produk_unggulan', i, 'harga', e.target.value)} />
                      </div>
                      <ImageUploadField value={row.foto_url} onChange={(url) => updateRow('produk_unggulan', i, 'foto_url', url)} label="Foto produk (opsional)" compact {...uploadProps} />
                    </div>
                  ))}
                  <button onClick={() => addRow('produk_unggulan', { nama: '', harga: '', foto_url: '' })}
                    className="flex items-center gap-2 text-[#0071E3] text-sm font-bold hover:underline">
                    <Plus size={16} /> Tambah Produk
                  </button>
                </div>
                <Field label="Link Marketplace (Shopee/Tokopedia/dll)">
                  <input className={inputCls} placeholder="https://shopee.co.id/toko..." value={form.sosmed_marketplace} onChange={e => set('sosmed_marketplace', e.target.value)} />
                </Field>
              </div>
            )}

            {/* PERSONAL / BLOG / JASTIP */}
            {(tipe === 'personal' || tipe === 'blog' || tipe === 'jastip' || tipe === 'custom') && (
              <div className="space-y-5">
                <Field label={tipe === 'blog' ? 'Topik / Niche Blog' : 'Bio / Tentang Anda'}>
                  <textarea className={textareaCls} rows={3} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder={tipe === 'blog' ? 'Bisnis, Teknologi, Lifestyle...' : 'Ceritakan tentang Anda atau layanan Anda...'} />
                </Field>
                <Field label="Spesialisasi / Keahlian Utama">
                  <input className={inputCls} placeholder="Fotografi, Web Development, Jastip Jepang..." value={form.topik} onChange={e => set('topik', e.target.value)} />
                </Field>
              </div>
            )}

            {/* Keunggulan kini ditanya di Step 0 ("Apa yang membuat Anda beda?") →
                tak diulang di sini supaya tidak double-ask. Nav "Lanjut ke Branding"
                tetap meneruskan tanpa wajib isi (form tetap bisa dilewati). */}
          </div>
        )}

        {/* ── STEP 2: BRANDING ──────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Gaya & Branding Website</h2>
              <p className="text-sm text-gray-400 font-medium">Pilih gaya yang paling cocok dengan bisnis Anda.</p>
            </div>

            {/* Live Preview */}
            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                Preview Tampilan Website
              </p>
              <BrandingPreview
                bg={previewBg}
                primaryColor={form.primary_color}
                namaUsaha={form.nama_usaha}
                tagline={form.tagline}
                emoji={selectedVariant?.emoji ?? '⚡'}
                variantNama={previewNama}
              />
            </div>

            {/* Theme System (S0-3): mini-step "Tipe Toko" — dormant sampai sub-kategori ready */}
            <SubKategoriPicker
              tipe={tipe}
              value={form.sub_kategori}
              onChange={(id) => {
                set('sub_kategori', id)
                const themes = id ? getThemes(tipe, id) : []
                if (themes.length) {
                  set('variant', themes[0].id)
                  set('primary_color', themes[0].mood)
                } else {
                  // "Lainnya"/umum → gaya umum (variant generik composable).
                  const v = variants[0]
                  if (v) {
                    set('variant', v.id)
                    set('primary_color', v.mood)
                  }
                }
              }}
            />

            {/* Variant / Tema selector */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">
                Gaya Visual Website
              </label>
              {themeMode ? (
                <ThemePicker
                  tipe={tipe}
                  subKategori={form.sub_kategori}
                  value={form.variant}
                  onChange={(id) => {
                    set('variant', id)
                    const t = getThemes(tipe, form.sub_kategori).find(x => x.id === id)
                    if (t) set('primary_color', t.mood)
                  }}
                />
              ) : tipe === 'toko_online' && !form.sub_kategori ? (
                <div className="p-5 rounded-[16px] bg-gray-50 border-2 border-dashed border-gray-200 text-center">
                  <p className="text-sm font-bold text-gray-600">Pilih Tipe Toko dulu</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Gaya visual website akan muncul setelah kamu memilih jenis tokomu di atas.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {variants.map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        set('variant', v.id)
                        set('primary_color', v.mood)
                      }}
                      className={`flex items-center gap-4 p-4 rounded-[16px] border-2 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[0.98] ${
                        form.variant === v.id
                          ? 'border-[#0071E3] bg-blue-50/40'
                          : 'border-black/[0.06] hover:border-blue-200 bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-lg"
                        style={{ backgroundColor: v.mood + '20', border: `2px solid ${v.mood}` }}>
                        {v.emoji}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${form.variant === v.id ? 'text-[#0071E3]' : 'text-gray-900'}`}>
                          {v.nama}
                        </p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{v.deskripsi}</p>
                      </div>
                      {form.variant === v.id && (
                        <Check size={16} className="text-[#0071E3] shrink-0" strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Field label="Logo (jika sudah punya)">
              <ImageUploadField value={form.logo_url} onChange={(url) => set('logo_url', url)} {...uploadProps} />
            </Field>
            <Field label="Foto Hero / Background Website">
              <HeroImageField
                value={form.foto_hero}
                focus={form.foto_hero_focus}
                onChange={(url) => set('foto_hero', url)}
                onFocusChange={(pos) => set('foto_hero_focus', pos)}
                {...uploadProps}
              />
              <p className="text-[11px] text-gray-400 font-medium mt-1">Foto utama yang tampil besar di bagian atas website. Kosongkan untuk pakai contoh.</p>
            </Field>
            <Field label="Referensi Website yang Disukai">
              <input className={inputCls} value={form.referensi_website} onChange={e => set('referensi_website', e.target.value)} placeholder="https://contoh.com" />
              <p className="text-[11px] text-gray-400 font-medium mt-1">Website yang tampilannya Anda suka sebagai inspirasi</p>
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Instagram">
                <input className={inputCls} value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@namaakun" />
              </Field>
              <Field label="TikTok">
                <input className={inputCls} value={form.tiktok} onChange={e => set('tiktok', e.target.value)} placeholder="@namaakun" />
              </Field>
              <Field label="Shopee / Marketplace">
                <input className={inputCls} value={form.shopee} onChange={e => set('shopee', e.target.value)} placeholder="Link toko" />
              </Field>
            </div>
          </div>
        )}

        {/* ── STEP 3: KONFIRMASI ────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Konfirmasi Briefing</h2>
              <p className="text-sm text-gray-400 font-medium">Periksa ringkasan di bawah sebelum mengirim.</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Nama Usaha', val: form.nama_usaha },
                { label: 'Tagline', val: form.tagline || '— (tidak diisi)' },
                { label: 'Cerita Bisnis', val: form.tawaran || '— (belum diisi)' },
                { label: 'WhatsApp', val: form.wa },
                { label: 'Email', val: form.email || '— (tidak diisi)' },
                { label: 'Alamat', val: form.alamat || '— (tidak diisi)' },
                { label: 'Jam Operasional', val: form.jam_operasional || '— (tidak diisi)' },
                { label: 'Warna Utama', val: form.primary_color },
                tipe === 'travel' ? { label: 'Armada', val: `${form.fleet.filter(r => r.nama).length} kendaraan diisi` } : null,
                tipe === 'restaurant' ? { label: 'Menu', val: `${form.menu.filter(r => r.nama).length} menu diisi` } : null,
                tipe === 'corporate' ? { label: 'Layanan', val: `${form.layanan.filter(r => r.nama).length} layanan diisi` } : null,
              ].filter(Boolean).map((item) => (
                <div key={item!.label} className="flex justify-between items-center py-2.5 border-b border-black/[0.04] last:border-0">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{item!.label}</span>
                  <span className="text-sm font-bold text-gray-900 text-right max-w-[60%] truncate flex items-center gap-2">
                    {item!.label === 'Warna Utama' && (
                      <span className="w-4 h-4 rounded-full inline-block shrink-0" style={{ backgroundColor: form.primary_color }} />
                    )}
                    {item!.val}
                  </span>
                </div>
              ))}
            </div>

            {error && (
              <div className="p-4 rounded-[16px] bg-red-50 border border-red-100">
                <p className="text-sm font-bold text-red-700">{error}</p>
              </div>
            )}

            {/* Soft-gate: tahan sekali (ramah, bukan blokir) kalau "Cerita Bisnis"
                kosong. "Isi dulu" lompat ke Step 0; "Lanjut saja" tetap kirim. */}
            {showSoftGate && (
              <div className="p-4 rounded-[16px] bg-amber-50 border border-amber-200 animate-fade-in">
                <p className="text-sm font-bold text-amber-900">Lewati cerita bisnis?</p>
                <p className="text-xs text-amber-800/90 font-medium mt-1 leading-relaxed">
                  Tanpa ini, website Anda memakai kalimat umum yang juga dipakai bisnis lain. Isi satu kalimat saja sudah jauh lebih baik.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => { setShowSoftGate(false); setStep(0) }}
                    className="px-4 py-2 rounded-full bg-[#0071E3] text-white text-xs font-bold hover:bg-blue-600 transition-colors"
                  >
                    Isi dulu
                  </button>
                  <button
                    type="button"
                    onClick={doSubmit}
                    className="px-4 py-2 rounded-full text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors"
                  >
                    Lanjut saja
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting || !form.nama_usaha || !form.wa || !/^\S+@\S+\.\S+$/.test(form.email)}
              className="w-full py-4 rounded-2xl bg-[#0071E3] text-white font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              {submitting ? <><Loader2 size={18} className="animate-spin" /> Mengirim...</> : <><Check size={18} /> Kirim Briefing</>}
            </button>
            {!/^\S+@\S+\.\S+$/.test(form.email) && (
              <p className="text-[11px] text-amber-600 text-center font-semibold">
                Email Bisnis belum lengkap — isi di langkah Identitas. Dipakai untuk login dashboard Anda.
              </p>
            )}
            <p className="text-[11px] text-gray-400 text-center font-medium">
              Setelah submit, tim kami akan menghubungi Anda via WhatsApp dalam 1×24 jam.
            </p>
          </div>
        )}

        {/* ── NAVIGASI ─────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-black/[0.04]">
          <button
            onClick={() => step === 0 ? router.back() : setStep(s => s - 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all text-gray-500 hover:bg-gray-100"
          >
            <ChevronLeft size={16} /> Kembali
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 px-8 py-3 bg-[#0071E3] text-white rounded-full font-bold text-sm hover:bg-blue-600 transition-colors shadow-md shadow-blue-200"
            >
              {step === 1 ? 'Lanjut ke Branding' : step === 2 ? 'Review & Kirim' : 'Lanjut'}
              <ChevronRight size={16} />
            </button>
          ) : null}
        </div>
      </div>

      {/* Step label */}
      <p className="text-center text-xs text-gray-400 font-medium mt-4">
        Langkah {step + 1} dari {STEPS.length} — {STEPS[step]}
      </p>
    </div>
  )
}
