'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '@/lib/ux-utils'
import {
  Check, Building2, User, ChevronRight, ChevronLeft,
  Loader2, Sparkles, AlertCircle, Rocket, ShieldCheck,
  Copy, Shield, Lock, MessageCircle, X
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { templatesData } from '@/data/templates'
import { orderAddons, aliasToId } from '@/lib/addons/catalog'
import { industriToTipe } from '@/lib/websitebuilder-mapping'
import { BESPOKE_VARIANTS } from '@/app/components/themes/toko-bespoke/variants'
import { THEMES } from '@/lib/theme-system/taxonomy'
import { referralDiscountFor, isFlatTier, FLAT_BUYER_DISCOUNT } from '@/lib/referral-tier'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

// ── Types & Constants ─────────────────────────────────────────────────────────
interface FormData {
  clientType: 'individu' | 'perusahaan' | null
  namaUsaha: string
  nomorWa: string
  namaPerusahaan: string
  namapic: string
  jabatan: string
  email: string
  industri: string
  templateId: string | null
  referensiManual: string
  selectedAddons: string[]
  agreedToTerms: boolean
}

const INIT: FormData = {
  clientType: null,
  namaUsaha: '', nomorWa: '',
  namaPerusahaan: '', namapic: '', jabatan: '', email: '', industri: '',
  templateId: null,
  referensiManual: '',
  selectedAddons: [],
  agreedToTerms: false,
}

// Add-on diturunkan dari SSOT katalog (src/lib/addons/catalog.ts). SKU yang
// di-drop/hide (triage A3) otomatis tak tampil via orderAddons().
const ADDONS = orderAddons()

// Draft autosave (anti-kehilangan data saat tab ditutup) — pola seperti BriefingForm.
const DRAFT_KEY = 'ja_order_draft'

// Nomor WhatsApp tim (sama dengan corp landing) untuk human-fallback tiap langkah.
const WA_NUMBER = '6281296917963'

// Pilihan industri sebagai chip — tiap label dipetakan akurat oleh industriToTipe()
// (mis. "Restoran & Kuliner" → restaurant). Hilangkan free-text yang rawan salah-petakan.
const INDUSTRI_OPTIONS = [
  'Toko Online', 'Restoran & Kuliner', 'Klinik & Kesehatan', 'Sekolah & Kursus',
  'Travel & Rental', 'Perusahaan & Jasa', 'Personal & Kreatif', 'Blog & Media',
  'Jastip', 'Lainnya',
]

// Tipe industri → label chip WB. Dipakai menormalkan param `industri` dari corp
// (mis. tile "Website Klinik & Spa") ke label chip yang sama persis ("Klinik &
// Kesehatan") via industriToTipe, supaya pilihan dari kalkulator LANGSUNG
// ter-highlight — bukan terkesan "harus pilih ulang" karena label tak cocok.
const TIPE_TO_INDUSTRI_LABEL: Record<string, string> = {
  toko_online: 'Toko Online',
  restaurant: 'Restoran & Kuliner',
  klinik: 'Klinik & Kesehatan',
  sekolah: 'Sekolah & Kursus',
  travel: 'Travel & Rental',
  corporate: 'Perusahaan & Jasa',
  personal: 'Personal & Kreatif',
  blog: 'Blog & Media',
  jastip: 'Jastip',
  custom: 'Lainnya',
}
function normalizeIndustriLabel(raw: string): string {
  if (INDUSTRI_OPTIONS.includes(raw)) return raw
  return TIPE_TO_INDUSTRI_LABEL[industriToTipe(raw)] ?? raw
}

// ── Reusable components ────────────────────────────────────────────────────────
function StepHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 sf-display-heavy tracking-tight">{title}</h2>
      <p className="text-gray-500 text-sm font-medium">{desc}</p>
    </div>
  )
}

// Guided progress bar (tipis + momentum); langkah lampau bisa diklik untuk mundur.
function GuidedProgressBar({ labels, current, total, onJump }: { labels: string[]; current: number; total: number; onJump: (i: number) => void }) {
  const pct = current === 0 ? 0 : Math.round((current / (total - 1)) * 100)
  const momentum = current >= total - 1 ? 'Langkah terakhir!' : current === 0 ? 'Ayo mulai' : 'Tinggal sedikit lagi'
  return (
    <div className="max-w-xl mx-auto mb-8 text-left">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-0.5 sm:gap-1.5 min-w-0">
          {labels.map((label, i) => {
            const active = current === i
            const passed = current > i
            const clickable = i < current
            return (
              <button
                key={label}
                type="button"
                onClick={() => clickable && onJump(i)}
                disabled={!clickable}
                aria-current={active ? 'step' : undefined}
                className={`flex items-center gap-1.5 rounded-full pl-1 pr-1.5 sm:pr-2.5 py-1 transition-all ${active ? 'bg-blue-50' : clickable ? 'hover:bg-gray-50 active:scale-[0.97]' : 'cursor-default'}`}
              >
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-black tabular-nums shrink-0 ${active ? 'bg-[#0071E3] text-white' : passed ? 'bg-blue-100 text-[#0071E3]' : 'bg-gray-100 text-gray-400'}`}>
                  {passed ? <Check size={12} strokeWidth={3.5} /> : i + 1}
                </span>
                <span className={`text-xs font-bold whitespace-nowrap hidden sm:block ${active ? 'text-[#0071E3]' : passed ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
              </button>
            )
          })}
        </div>
        <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap shrink-0">
          <span className="tabular-nums">Langkah {current + 1}/{total}</span> · <span className="text-[#0071E3]">{momentum}</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div className="h-full rounded-full bg-[#0071E3] transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// WhatsApp human-fallback — selalu tampak di tiap langkah.
function WaFallbackLine({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#0071E3] transition-colors py-3">
      <MessageCircle size={14} className="text-[#25D366]" aria-hidden="true" />
      Bingung pilih? Chat tim kami — kami bantu pilihkan
      <ChevronRight size={13} aria-hidden="true" />
    </a>
  )
}

// Proof strip: klaim proses yang verifiable saja (bukan social-proof tak bersumber).
function ProofStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-gray-500 mt-5">
      <span className="inline-flex items-center gap-1.5"><Rocket size={13} className="text-[#0071E3]" /> Live 3–5 hari kerja</span>
      <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-500" /> Revisi sampai puas sebelum go-live</span>
      <span className="inline-flex items-center gap-1.5"><Lock size={13} className="text-gray-400" /> Pembayaran aman via Midtrans</span>
    </div>
  )
}

// Sheet rincian biaya (DP & perpanjangan) — read-only, diturunkan dari nilai yang sudah dihitung.
function MobileReceiptSheet({
  open, onClose, baseLabel, basePrice, addons, referralDiscount, discountSuffix,
  finalPrice, payableTotal, isDP, dpAmount, pelunasan, totalYearlyMaint,
}: {
  open: boolean; onClose: () => void
  baseLabel: string; basePrice: number
  addons: { name: string; price: number; included: boolean }[]
  referralDiscount: number; discountSuffix: string
  finalPrice: number; payableTotal: number; isDP: boolean
  dpAmount: number; pelunasan: number; totalYearlyMaint: number
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} />
      <div role="dialog" aria-label="Ringkasan Biaya" className={`absolute left-0 bottom-0 w-full sm:max-w-md sm:left-1/2 sm:-translate-x-1/2 sm:bottom-6 bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl max-h-[85vh] overflow-y-auto transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'translate-y-0' : 'translate-y-full sm:translate-y-[120%]'}`}>
        <div className="sticky top-0 bg-white pt-3 pb-2 flex flex-col items-center sm:hidden"><span className="w-10 h-1.5 rounded-full bg-gray-200" /></div>
        <div className="px-5 pt-2 sm:pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900 sf-display-heavy">Ringkasan Biaya</h2>
            <button onClick={onClose} aria-label="Tutup" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:scale-90 transition-transform shrink-0"><X size={16} /></button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-500 font-semibold flex-1">{baseLabel}</span>
              <span className="text-sm font-bold text-gray-900 tabular-nums shrink-0">{formatPrice(basePrice)}</span>
            </div>
            {addons.map((a, i) => (
              <div key={i} className="flex items-center justify-between gap-3 text-[#0071E3]">
                <span className="text-sm font-medium flex-1">+ {a.name}</span>
                <span className="text-sm font-bold shrink-0 tabular-nums">{a.included ? <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Termasuk</span> : formatPrice(a.price)}</span>
              </div>
            ))}
            {referralDiscount > 0 && (
              <div className="flex items-center justify-between gap-3 text-green-600">
                <span className="text-sm font-medium flex-1">Diskon Referral{discountSuffix}</span>
                <span className="text-sm font-bold shrink-0 tabular-nums">− {formatPrice(referralDiscount)}</span>
              </div>
            )}
            <div className="pt-3 mt-1 border-t-2 border-black/5 flex items-center justify-between gap-3">
              <span className="text-base font-black text-gray-900 uppercase tracking-tight flex-1">Total</span>
              <span className="text-xl font-black text-[#0071E3] shrink-0 tabular-nums">
                {referralDiscount > 0 && <span className="text-sm text-gray-300 line-through mr-2">{formatPrice(finalPrice)}</span>}
                {formatPrice(payableTotal)}
              </span>
            </div>

            <div className="bg-green-50 rounded-2xl p-4 border border-green-100 mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Dibayar Sekarang</span>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-green-100 text-green-700">{isDP ? 'DP 50%' : 'Lunas'}</span>
              </div>
              <p className="text-2xl font-black text-green-700 tabular-nums">{formatPrice(dpAmount)}</p>
              {isDP && <p className="text-xs text-gray-500 mt-1">Pelunasan sebelum go-live: <span className="font-bold tabular-nums">{formatPrice(pelunasan)}</span></p>}
            </div>

            {totalYearlyMaint > 0 && (
              <div className="flex items-start justify-between gap-3 pt-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Perpanjangan tahunan <span className="text-gray-400 font-normal">(mulai tahun ke-2)</span></p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Hosting &amp; maintenance — ditagih tiap tahun, bukan sekarang</p>
                </div>
                <span className="text-sm font-bold text-gray-600 tabular-nums shrink-0">± {formatPrice(totalYearlyMaint)}/th</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FieldRow({ label, required, htmlFor, error, children }: { label: string; required?: boolean; htmlFor?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} className="text-xs font-medium text-red-500 mt-1.5 ml-1">
          {error}
        </p>
      )}
    </div>
  )
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

export default function OrderPage() {
  return (
    <div className="pt-32 pb-24 px-4 bg-[#F5F5F7] min-h-screen font-sans">
      <Navbar />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="animate-spin text-[#0071E3]" size={32} />
        </div>
      }>
        <OrderFormContent />
      </Suspense>
      <Footer />
    </div>
  )
}

function OrderFormContent() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INIT)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [pendingPayment, setPendingPayment] = useState<{
    displayId: string; dpAmount: number; redirectUrl: string
  } | null>(null)
  const hydratedRef = useRef(false)
  // Validasi inline: tandai field yang sudah disentuh, tampilkan error saat blur
  // (ganti "tombol mati senyap" jadi pesan jelas) — tombol Lanjut tetap di-gate.
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const touch = (k: string) => setTouched(t => (t[k] ? t : { ...t, [k]: true }))

  // ── Program Mitra: kode referral ─────────────────────────────────────────
  const [referralCode, setReferralCode] = useState('')
  const [refStatus, setRefStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')
  const [refInfo, setRefInfo] = useState<{ discountPercent: number; referrerName: string } | null>(null)

  // Pre-fill dari kalkulator ja-corp-landing
  const kalkulatorIndustri = searchParams.get('industri') ?? ''
  const kalkulatorEstimasi = searchParams.get('estimasi') ? Number(searchParams.get('estimasi')) : null
  const kalkulatorMaintain = searchParams.get('maintain') ? Number(searchParams.get('maintain')) : null
  const kalkulatorPaket = searchParams.get('paket') ?? ''
  const kalkulatorAddons = searchParams.get('addons') ?? ''
  const kalkulatorBundle = searchParams.get('bundle') ?? ''

  // Handoff tema dari galeri preview corp (Fase 3): ?subkat=&theme=. Hanya tema
  // bespoke terdaftar yang dihormati (server payment/create validasi ulang).
  // Disimpan ke order → jadi default brief form (sub-kat + varian) pasca-bayar.
  const handoffSubkat = searchParams.get('subkat') ?? ''
  const handoffTheme = searchParams.get('theme') ?? ''
  const validHandoffTheme = handoffTheme && BESPOKE_VARIANTS[handoffTheme] ? handoffTheme : ''
  const handoffThemeNama = validHandoffTheme
    ? (Object.values(THEMES)
        .flatMap((byKat) => Object.values(byKat ?? {}).flat())
        .find((t) => t.id === validHandoffTheme)?.nama ?? validHandoffTheme)
    : ''

  // Mapping corp-landing addon IDs → order form addon IDs
  // Alias id corp-landing → id kanonik, diturunkan dari SSOT (.aliases).
  // Gantikan mapping hardcode lama yang korup (blog→newsletter, track-pack→
  // ads-tracking, g-sheets→admin). Hanya alias benar-semantik yang dihormati;
  // id corp tanpa alias (track-pack/email-auto/g-sheets/dll) jatuh & tersaring
  // oleh filter validIds di bawah — lebih baik hilang daripada salah-petakan.
  const CORP_TO_ORDER_ID: Record<string, string> = aliasToId()

  useEffect(() => {
    const tid = searchParams.get('template')
    if (tid && templatesData[tid]) setForm(f => ({ ...f, templateId: tid }))
    if (kalkulatorIndustri) setForm(f => ({ ...f, industri: normalizeIndustriLabel(kalkulatorIndustri) }))

    if (kalkulatorAddons) {
      const rawIds = kalkulatorAddons.split(',').map(s => s.trim()).filter(Boolean)
      const mappedIds = rawIds.map(id => CORP_TO_ORDER_ID[id] ?? id)
      let validIds = [...new Set(mappedIds)].filter(id => ADDONS.some(a => a.id === id))
      // A2: buang pre-selection yang dependency (requires)-nya tak ikut terpilih
      // (cegah orphan dari kalkulator, mis. 'variant' tanpa 'shop'). Cascade.
      for (let changed = true; changed;) {
        changed = false
        const present = new Set(validIds)
        const next = validIds.filter(id => (ADDONS.find(a => a.id === id)?.requires ?? []).every(r => present.has(r)))
        if (next.length !== validIds.length) { validIds = next; changed = true }
      }
      if (validIds.length > 0) {
        setForm(f => ({ ...f, selectedAddons: validIds }))
      }
    }
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Autosave draft: restore saat mount (hanya kalau BUKAN dari kalkulator /
  // param otoritatif, supaya prefill URL tetap menang), lalu persist tiap ubah.
  // Cegah "tutup tab = semua isian hilang" (penyebab abandonment klasik).
  useEffect(() => {
    const hasOrderQuery = !!(searchParams.get('template') || kalkulatorIndustri || kalkulatorPaket || kalkulatorEstimasi || kalkulatorAddons)
    if (!hasOrderQuery) {
      try {
        const raw = localStorage.getItem(DRAFT_KEY)
        if (raw) {
          const d = JSON.parse(raw)
          if (d.form) setForm(f => ({ ...f, ...d.form, agreedToTerms: false }))
          if (typeof d.step === 'number' && d.step >= 0 && d.step <= 3) setStep(d.step)
          if (typeof d.referralCode === 'string' && d.referralCode) setReferralCode(d.referralCode)
        }
      } catch { /* draft korup — abaikan */ }
    }
    hydratedRef.current = true
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!hydratedRef.current) return
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form: { ...form, agreedToTerms: false }, step, referralCode }))
    } catch { /* kuota penuh — abaikan */ }
  }, [form, step, referralCode])

  // Prefill kode referral: ?ref= (link mitra / corp landing) → fallback
  // cookie ja_ref (di-set short link /r/KODE, umur 30 hari).
  useEffect(() => {
    const fromParam = searchParams.get('ref')
    if (fromParam) { setReferralCode(fromParam.toUpperCase()); return }
    const m = document.cookie.match(/(?:^|;\s*)ja_ref=([A-Za-z0-9]+)/)
    if (m) setReferralCode(m[1].toUpperCase())
  }, [searchParams])

  // Validasi kode (debounced). Invalid TIDAK memblokir submit — order
  // tetap jalan tanpa diskon; server memvalidasi ulang secara otoritatif.
  useEffect(() => {
    const code = referralCode.trim().toUpperCase()
    if (!code) { setRefStatus('idle'); setRefInfo(null); return }
    if (!/^[A-Z0-9]{4,16}$/.test(code)) { setRefStatus('invalid'); setRefInfo(null); return }
    setRefStatus('checking')
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/referral/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })
        const data = await res.json()
        if (data?.valid) {
          setRefInfo({ discountPercent: data.discountPercent, referrerName: data.referrerName })
          setRefStatus('valid')
        } else {
          setRefInfo(null); setRefStatus('invalid')
        }
      } catch {
        setRefInfo(null); setRefStatus('invalid')
      }
    }, 450)
    return () => clearTimeout(t)
  }, [referralCode])

  // Dari kalkulator → skip step addon (sudah dipilih di sana)
  const fromKalkulator = !!(kalkulatorPaket || kalkulatorEstimasi)

  const set = (key: keyof FormData, val: any) => setForm(f => ({ ...f, [key]: val }))

  // Pesan error per-field (hanya muncul setelah field disentuh).
  const fieldError = (k: string): string => {
    if (!touched[k]) return ''
    switch (k) {
      case 'namaUsaha': return form.namaUsaha.trim() ? '' : 'Nama usaha wajib diisi'
      case 'namaPerusahaan': return form.namaPerusahaan.trim() ? '' : 'Nama perusahaan wajib diisi'
      case 'namapic': return form.namapic.trim() ? '' : 'Nama PIC wajib diisi'
      case 'nomorWa':
        if (!form.nomorWa.trim()) return 'Nomor WhatsApp wajib diisi'
        return form.nomorWa.replace(/\D/g, '').length >= 8 ? '' : 'Nomor WhatsApp belum lengkap'
      case 'email':
        if (!form.email.trim()) return 'Email wajib diisi'
        return /^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Format email belum benar (contoh: nama@email.com)'
      default: return ''
    }
  }

  const handleNext = () => {
    if (fromKalkulator && step === 1) {
      setStep(3) // lompat langsung ke konfirmasi
    } else {
      setStep(s => s + 1)
    }
  }
  const handlePrev = () => {
    if (fromKalkulator && step === 3) {
      setStep(1) // balik ke identitas, skip addon
    } else {
      setStep(s => s - 1)
    }
  }

  // Kalau dari kalkulator, addon sudah termasuk dalam kalkulatorEstimasi — jangan double count
  const totalAddons = fromKalkulator
    ? 0
    : form.selectedAddons.reduce((acc, id) => {
        const addon = ADDONS.find(a => a.id === id)
        return acc + (addon?.price || 0)
      }, 0)

  // DYNAMIC PRICING LOGIC
  const selectedTemplate = form.templateId ? templatesData[form.templateId] : null
  const currentBasePrice = selectedTemplate?.price_numeric || kalkulatorEstimasi || 499000
  const currentBaseRenewal = selectedTemplate?.renewal_price || 699000

  const totalAddonYearly = fromKalkulator
    ? 0
    : form.selectedAddons.reduce((acc, id) => {
        const addon = ADDONS.find(a => a.id === id)
        return acc + (addon?.yearlyMaint || 0)
      }, 0)

  const finalPrice = currentBasePrice + totalAddons
  // Kalau dari kalkulator, pakai maintainTotal dari URL supaya inline dengan yang ditampilkan
  const totalYearlyMaint = fromKalkulator
    ? (kalkulatorMaintain ?? currentBaseRenewal)
    : currentBaseRenewal + totalAddonYearly

  // Diskon referral — formula identik dengan server lewat modul bersama
  // referral-tier (flat < Rp 1jt / persen ≥ Rp 1jt); math DP/pelunasan pakai NET.
  const referralDiscount = refStatus === 'valid' && refInfo
    ? referralDiscountFor(finalPrice, refInfo.discountPercent)
    : 0
  const payableTotal = finalPrice - referralDiscount

  const DP_THRESHOLD = 4_000_000
  const isDP = payableTotal >= DP_THRESHOLD
  const dpAmount = isDP ? Math.ceil(payableTotal * 0.5) : payableTotal
  const pelunasan = isDP ? payableTotal - dpAmount : 0



  // ── A2 gating: dependency (hard) + relevansi industri (soft) ──
  const addonTipe = industriToTipe(form.industri)
  const unmetDeps = (id: string): string[] =>
    (ADDONS.find(a => a.id === id)?.requires ?? []).filter(r => !form.selectedAddons.includes(r))
  const nameOf = (id: string): string => ADDONS.find(a => a.id === id)?.name ?? id

  const toggleAddon = (id: string) => {
    if (form.selectedAddons.includes(id)) {
      // Lepas + cascade: buang juga add-on lain yang dependency (requires)-nya menunjuk id ini.
      const remove = new Set<string>([id])
      let changed = true
      while (changed) {
        changed = false
        for (const a of ADDONS) {
          if (form.selectedAddons.includes(a.id) && !remove.has(a.id) && (a.requires ?? []).some(r => remove.has(r))) {
            remove.add(a.id); changed = true
          }
        }
      }
      set('selectedAddons', form.selectedAddons.filter(a => !remove.has(a)))
    } else {
      if (unmetDeps(id).length > 0) return // terkunci sampai dependency dipilih (no-op)
      set('selectedAddons', [...form.selectedAddons, id])
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // 1. Create order + get Snap token from server
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_type: form.clientType,
          nama_usaha: form.namaUsaha,
          nama_perusahaan: form.namaPerusahaan,
          nama_pic: form.namapic,
          jabatan: form.jabatan,
          nomor_wa: form.nomorWa,
          email: form.email,
          industri: form.industri,
          template_id: form.templateId,
          referensi_manual: form.referensiManual,
          selected_addons: form.selectedAddons,
          total_estimasi: finalPrice,
          total_maintenance: totalYearlyMaint,
          referral_code: refStatus === 'valid' ? referralCode.trim().toUpperCase() : null,
          // Konteks kalkulator corp → server hitung ulang harga otoritatif
          // (total_estimasi di atas hanya utk tampilan, tak dipakai menagih).
          from_kalkulator: fromKalkulator,
          paket: kalkulatorPaket || null,
          kalkulator_addons: fromKalkulator ? kalkulatorAddons : null,
          bundle: kalkulatorBundle || null,
          // Handoff tema (Fase 3) → disimpan sbg default brief; server validasi ulang.
          preselect_subkat: validHandoffTheme ? (handoffSubkat || null) : null,
          preselect_theme: validHandoffTheme || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal membuat transaksi')

      const { redirect_url, order_id, display_id, dp_amount, tracking_token } = data

      // Simpan ke sessionStorage (fallback GoPay deep link). tracking_token =
      // kunci form briefing, dibawa ke halaman thank-you supaya bisa langsung
      // menautkan ke /order/briefing/<token> tanpa bergantung WA.
      sessionStorage.setItem('ja_pending_order', JSON.stringify({ order_id, display_id, dp_amount, tracking_token }))

      // Simpan ke localStorage (fallback permanen kalau browser ditutup)
      localStorage.setItem('ja_last_order', JSON.stringify({
        order_id, display_id, dp_amount, tracking_token,
        redirect_url, created_at: new Date().toISOString(),
      }))
      localStorage.removeItem(DRAFT_KEY) // order sukses — buang draft autosave

      // Tampilkan interstitial page (bukan langsung redirect)
      setPendingPayment({ displayId: display_id, dpAmount: dp_amount, redirectUrl: redirect_url })
      setIsSubmitting(false)
    } catch (err: any) {
      console.error('Submission error:', err)
      setSubmitError(err.message || 'Terjadi kesalahan koneksi. Silakan hubungi tim kami via WhatsApp.')
      setIsSubmitting(false)
    }
  }

  const totalSteps = fromKalkulator ? 3 : 4
  const displayStep = fromKalkulator && step === 3 ? 2 : step
  const progress = displayStep === 0 ? 0 : Math.round((displayStep / (totalSteps - 1)) * 100)
  const stepLabels = fromKalkulator
    ? ['Kategori', 'Identitas', 'Konfirmasi']
    : ['Kategori', 'Identitas', 'Fitur', 'Konfirmasi']
  // Jump hanya MUNDUR (display 0/1 == real step 0/1) — maju tetap lewat tombol Lanjut
  // supaya validasi Step 1 tak terlewati.
  const jumpToDisplay = (target: number) => { if (target < displayStep) setStep(target) }
  // Link WA pre-filled untuk human-fallback (rekomputasi tiap render, murah).
  const waOrderHref = (() => {
    const nama = form.clientType === 'perusahaan' ? form.namaPerusahaan : form.namaUsaha
    const lines = [
      'Halo Webzoka, saya sedang mengisi order website dan butuh bantuan memilih.',
      nama ? `Bisnis: ${nama}` : '',
      form.industri ? `Industri: ${form.industri}` : '',
      form.selectedAddons.length ? `Fitur: ${form.selectedAddons.map(id => ADDONS.find(a => a.id === id)?.name ?? id).join(', ')}` : '',
    ].filter(Boolean)
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
  })()

  // ── Interstitial page setelah order dibuat ─────────────────────────────────
  if (pendingPayment) {
    return <InterstitialPage
      displayId={pendingPayment.displayId}
      dpAmount={pendingPayment.dpAmount}
      redirectUrl={pendingPayment.redirectUrl}
      isDP={isDP}
    />
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header (Apple Style) */}
      <div className="text-center mb-12 animate-fade-in px-4">
          <GuidedProgressBar labels={stepLabels} current={displayStep} total={totalSteps} onJump={jumpToDisplay} />
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2 sf-display-heavy">Detail Pesanan</h1>
          <p className="text-gray-500 font-medium">Lengkapi data diri dan pilih fitur yang Anda butuhkan.</p>
          {!fromKalkulator && (
            <p className="text-xs text-gray-400 font-medium mt-2 inline-flex items-center gap-1.5">
              <Check size={12} className="text-green-500" /> Progres tersimpan otomatis di perangkat ini — aman ditinggal
            </p>
          )}
          <ProofStrip />
      </div>

      {/* Banner dari kalkulator */}
      {(kalkulatorEstimasi || kalkulatorAddons || handoffThemeNama) && (
        <div className="bg-blue-50 border border-blue-100 rounded-[28px] p-5 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-[#0071E3] rounded-2xl flex items-center justify-center text-white shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-blue-900 mb-1">Melanjutkan dari Kalkulator</p>
            <p className="text-xs text-blue-700 font-medium leading-relaxed">
              {kalkulatorIndustri && <>Industri: <strong>{kalkulatorIndustri}</strong></>}
              {kalkulatorPaket && <> · Paket: <strong>{kalkulatorPaket}</strong></>}
            </p>
            {handoffThemeNama && (
              <p className="text-xs text-blue-600 mt-1">Tema pilihan: <strong>{handoffThemeNama}</strong> · bisa diubah saat isi brief</p>
            )}
            {form.selectedAddons.length > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                Fitur pre-selected: <strong>{form.selectedAddons.map(id => ADDONS.find(a => a.id === id)?.name ?? id).join(', ')}</strong>
              </p>
            )}
            {kalkulatorEstimasi && (
              <p className="text-xs text-blue-600 mt-1">Estimasi Setup: <strong>Rp {kalkulatorEstimasi.toLocaleString('id-ID')}</strong></p>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 sm:p-8 md:p-12 apple-shadow border border-black/[0.03] relative">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <StepHeader title="Website ini untuk siapa?" desc="Pilih jenis identitas untuk website Anda." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[
                  { id: 'individu', title: 'Individu / UMKM', desc: 'Cocok untuk portfolio, blog, atau usaha mikro.', icon: User },
                  { id: 'perusahaan', title: 'Perusahaan / PT / CV', desc: 'Cocok untuk branding korporat dan skala bisnis menengah.', icon: Building2 },
                ].map(opt => (
                  <button key={opt.id} onClick={() => { set('clientType', opt.id); handleNext(); triggerHaptic(); }}
                    className={`p-6 md:p-8 rounded-[24px] md:rounded-[32px] border-2 text-left transition-all hover:translate-y-[-4px] active:scale-[0.98] ${form.clientType === opt.id ? 'border-[#0071E3] bg-blue-50/50 shadow-md' : 'border-gray-100 hover:border-[#0071E3]/20 bg-gray-50/50'}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${form.clientType === opt.id ? 'bg-[#0071E3] text-white' : 'bg-white text-gray-400'}`}>
                      <opt.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{opt.title}</h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <StepHeader title="Kenalan dulu, yuk." desc="Lengkapi detail kontak dan nama bisnis Anda." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                {form.clientType === 'individu' ? (
                  <FieldRow label="Nama Usaha / Brand" htmlFor="order-nama-usaha" required error={fieldError('namaUsaha')}>
                    <Input id="order-nama-usaha" placeholder="Contoh: Kedai Kopi Mulyo" value={form.namaUsaha} onChange={e => set('namaUsaha', e.target.value)} onBlur={() => touch('namaUsaha')} aria-invalid={!!fieldError('namaUsaha')} className="apple-input" />
                  </FieldRow>
                ) : (
                  <>
                    <FieldRow label="Nama Perusahaan" htmlFor="order-nama-perusahaan" required error={fieldError('namaPerusahaan')}>
                      <Input id="order-nama-perusahaan" placeholder="Contoh: PT Webzoka Indonesia" value={form.namaPerusahaan} onChange={e => set('namaPerusahaan', e.target.value)} onBlur={() => touch('namaPerusahaan')} aria-invalid={!!fieldError('namaPerusahaan')} className="apple-input" />
                    </FieldRow>
                    <FieldRow label="Nama PIC" htmlFor="order-nama-pic" required error={fieldError('namapic')}>
                      <Input id="order-nama-pic" placeholder="Nama lengkap Anda" value={form.namapic} onChange={e => set('namapic', e.target.value)} onBlur={() => touch('namapic')} aria-invalid={!!fieldError('namapic')} className="apple-input" />
                    </FieldRow>
                  </>
                )}
                <FieldRow label="Nomor WhatsApp" htmlFor="order-wa" required error={fieldError('nomorWa')}>
                  <Input id="order-wa" type="tel" inputMode="numeric" autoComplete="tel" placeholder="Contoh: 08123456789" value={form.nomorWa} onChange={e => set('nomorWa', e.target.value)} onBlur={() => touch('nomorWa')} aria-invalid={!!fieldError('nomorWa')} className="apple-input" />
                </FieldRow>
                <FieldRow label="Email" htmlFor="order-email" required error={fieldError('email')}>
                  <Input id="order-email" type="email" autoComplete="email" placeholder="Alamat email aktif (untuk kirim akses dashboard)" value={form.email} onChange={e => set('email', e.target.value)} onBlur={() => touch('email')} aria-invalid={!!fieldError('email')} className="apple-input" />
                </FieldRow>
                <div className="md:col-span-2">
                  <FieldRow label="Bidang Industri" required>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {INDUSTRI_OPTIONS.map(opt => {
                        const active = form.industri === opt
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => { set('industri', active ? '' : opt); triggerHaptic() }}
                            aria-pressed={active}
                            className={`min-h-[44px] px-4 rounded-full text-sm font-semibold border transition-all active:scale-[0.97] ${
                              active
                                ? 'bg-[#0071E3] text-white border-[#0071E3] shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#0071E3]/40'
                            }`}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </FieldRow>
                </div>
              </div>
              <div className="flex flex-col-reverse md:flex-row justify-between mt-10 md:mt-12 pt-6 md:pt-8 border-t border-gray-100 gap-4">
                <Button variant="ghost" onClick={handlePrev} className="w-full md:w-auto rounded-xl px-8 h-14 font-bold text-gray-400"><ChevronLeft className="mr-2" size={18} /> Kembali</Button>
                <Button disabled={!form.nomorWa || !/^\S+@\S+\.\S+$/.test(form.email) || !form.industri || (form.clientType === 'individu' ? !form.namaUsaha : (!form.namaPerusahaan || !form.namapic))} onClick={handleNext} className="w-full md:w-auto rounded-2xl px-12 h-14 bg-[#0071E3] hover:bg-blue-600 text-white font-bold shadow-lg glow-button">{fromKalkulator ? 'Lanjut ke Konfirmasi' : 'Lanjut ke Fitur Tambahan'} <ChevronRight className="ml-2" size={18} /></Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <StepHeader title="Mau tambah fitur apa?" desc="Personalisasi website Anda dengan fitur pendukung bisnis. Semua opsional." />

              <div className="mb-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700">
                <ShieldCheck size={14} /> Revisi sampai puas sebelum go-live
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar pb-6">
                {ADDONS.map(addon => {
                  const isSelected = form.selectedAddons.includes(addon.id)
                  const deps = addon.requires ?? []
                  const locked = !isSelected && deps.some(r => !form.selectedAddons.includes(r))
                  const relevant = !addon.industries || addon.industries.length === 0 || addonTipe === 'custom' || addon.industries.includes(addonTipe)

                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      disabled={locked}
                      title={locked ? `Butuh: ${deps.map(nameOf).join(', ')}` : undefined}
                      className={`p-5 rounded-3xl border-2 text-left transition-all relative flex flex-col h-full ${
                        isSelected
                          ? 'border-[#0071E3] bg-blue-50/30 ring-2 ring-blue-100 active:scale-[0.98]'
                          : locked
                            ? 'border-gray-100 bg-gray-50/60 opacity-60 cursor-not-allowed'
                            : `border-gray-100 bg-white hover:border-gray-200 active:scale-[0.98] ${!relevant ? 'opacity-70' : ''}`
                      }`}
                    >
                      <h4 className={`text-sm font-bold mb-1 pr-16 ${isSelected ? 'text-[#0071E3]' : 'text-gray-900'}`}>{addon.name}</h4>
                      <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2">{addon.desc}</p>

                      {locked ? (
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-3 inline-flex items-center gap-1">
                          <Lock size={11} /> Butuh: {deps.map(nameOf).join(', ')}
                        </span>
                      ) : !relevant && !isSelected ? (
                        <span className="text-[10px] font-medium text-gray-400 mb-3">Kurang umum untuk industri Anda</span>
                      ) : null}

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-black/[0.03] w-full">
                        <span className="text-sm font-black text-gray-900">{formatPrice(addon.price)}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[#0071E3] border-[#0071E3] text-white' : 'border-gray-200'
                        }`}>
                          {isSelected ? <Check size={12} strokeWidth={4} /> : locked ? <Lock size={10} className="text-gray-300" /> : null}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Fitur Terpilih</p>
                  <p className="text-lg font-black text-[#0071E3] tabular-nums">{formatPrice(totalAddons)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Investasi</p>
                  <p className="text-lg font-black text-gray-900 tabular-nums">{formatPrice(finalPrice)}</p>
                </div>
              </div>

              <button type="button" onClick={() => setSheetOpen(true)} className="mt-3 w-full flex items-center justify-center gap-2 text-xs font-bold text-[#0071E3] py-2.5 rounded-xl border border-blue-100 bg-blue-50/40 hover:bg-blue-50 active:scale-[0.99] transition-all">
                <Sparkles size={13} /> Lihat rincian lengkap (DP &amp; perpanjangan)
              </button>

              <div className="flex flex-col-reverse md:flex-row justify-between mt-10 pt-8 border-t border-gray-100 gap-4">
                <Button variant="ghost" onClick={handlePrev} className="w-full md:w-auto rounded-xl px-8 h-14 font-bold text-gray-400"><ChevronLeft className="mr-2" size={18} /> Kembali</Button>
                <Button onClick={handleNext} className="w-full md:w-auto rounded-2xl px-12 h-14 bg-[#0071E3] hover:bg-blue-600 text-white font-bold shadow-lg glow-button">Lanjut ke Konfirmasi <ChevronRight className="ml-2" size={18} /></Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <StepHeader title="Cek sekali lagi sebelum bayar." desc="Pastikan rincian brief Anda sudah sesuai sebelum dikirim ke tim konsultan kami." />
                    <div className="hidden md:block w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#0071E3]"><ShieldCheck size={32} /></div>
                  </div>

                  {submitError && (
                      <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-3">
                          <AlertCircle size={20} /> {submitError}
                      </div>
                  )}

                  <div className="bg-[#F9F9FB] rounded-[24px] md:rounded-[32px] p-6 md:p-12 space-y-8 md:space-y-10 border border-black/[0.03] apple-shadow">
                      
                      {/* Header Table style */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8">
                          <div className="space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kategori Client</p>
                              <p className="text-lg font-bold text-gray-900 sf-display capitalize">{form.clientType}</p>
                          </div>
                          <div className="space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kontak WhatsApp</p>
                              <p className="text-lg font-bold text-[#0071E3] font-mono">{form.nomorWa}</p>
                          </div>
                          <div className="col-span-full h-px bg-black/[0.03]" />
                          <div className="col-span-full">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Subjek Pengerjaan</p>
                              <p className="text-xl font-bold text-gray-900 sf-display">{form.clientType === 'perusahaan' ? form.namaPerusahaan : form.namaUsaha}</p>
                          </div>
                      </div>

                      {/* Breakdown Cost */}
                      <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-black/5 shadow-sm">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 pb-4 border-b border-black/[0.03]">Ringkasan Investasi Digital</p>
                          <div className="space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                  <p className="text-gray-500 font-semibold flex-1">
                                    Paket {kalkulatorPaket || selectedTemplate?.title || 'Website Studio'}
                                    {kalkulatorIndustri && <span className="text-gray-400 font-normal"> · {kalkulatorIndustri}</span>}
                                  </p>
                                  <span className="font-bold text-gray-900 shrink-0 text-left sm:text-right">{formatPrice(currentBasePrice)}</span>
                              </div>
                              {form.selectedAddons.map(id => {
                                  const addon = ADDONS.find(a => a.id === id)
                                  return addon ? (
                                  <div key={id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[#0071E3]">
                                      <span className="font-medium text-sm flex-1">+ {addon.name}</span>
                                      <span className="font-bold shrink-0 text-left sm:text-right">
                                        {fromKalkulator ? (
                                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Termasuk</span>
                                        ) : formatPrice(addon.price)}
                                      </span>
                                  </div>
                                  ) : null
                              })}
                              {/* Kode Referral (Program Mitra) */}
                              <div className="pt-4 mt-2 border-t border-black/[0.03]">
                                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kode Referral (Opsional)</Label>
                                  <div className="mt-2">
                                      <Input
                                        placeholder="Punya kode dari mitra kami? Masukkan di sini"
                                        value={referralCode}
                                        onChange={e => setReferralCode(e.target.value.toUpperCase())}
                                        maxLength={16}
                                        className="apple-input uppercase"
                                      />
                                  </div>
                                  {refStatus === 'checking' && (
                                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                                          <Loader2 size={12} className="animate-spin" /> Memeriksa kode…
                                      </p>
                                  )}
                                  {refStatus === 'valid' && refInfo && (
                                      <p className="text-xs font-semibold text-green-600 mt-2 flex items-center gap-1.5">
                                          <Check size={12} strokeWidth={3} /> Kode valid — diskon {isFlatTier(finalPrice) ? formatPrice(FLAT_BUYER_DISCOUNT) : `${refInfo.discountPercent}%`} dari {refInfo.referrerName}
                                      </p>
                                  )}
                                  {refStatus === 'invalid' && referralCode.trim() !== '' && (
                                      <p className="text-xs text-gray-400 mt-2">Kode tidak ditemukan — order tetap bisa dilanjutkan tanpa diskon.</p>
                                  )}
                              </div>
                              {referralDiscount > 0 && (
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-green-600">
                                      <span className="font-medium text-sm flex-1">Diskon Referral{isFlatTier(finalPrice) ? '' : ` (${refInfo?.discountPercent}%)`}</span>
                                      <span className="font-bold shrink-0 text-left sm:text-right">− {formatPrice(referralDiscount)}</span>
                                  </div>
                              )}
                              <div className="pt-6 mt-6 border-t-2 border-black/5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                  <span className="text-lg sm:text-xl sf-display-heavy text-gray-900 uppercase tracking-tighter flex-1">Total Estimasi</span>
                                  <span className="text-2xl md:text-3xl sf-display-heavy text-[#0071E3] shrink-0 text-left sm:text-right tabular-nums">
                                      {referralDiscount > 0 && (
                                          <span className="text-base text-gray-300 line-through mr-2 align-middle">{formatPrice(finalPrice)}</span>
                                      )}
                                      {formatPrice(payableTotal)}
                                  </span>
                              </div>

                              {/* DP Breakdown — distinct payment card */}
                              <div className="mt-4 pt-4 border-t border-black/5">
                                <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Dibayar Sekarang</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                                      {isDP ? 'DP 50%' : 'Lunas'}
                                    </span>
                                  </div>
                                  <p className="text-2xl font-black text-green-700 tabular-nums">{formatPrice(dpAmount)}</p>
                                  {!isDP && <p className="text-xs text-gray-500 mt-1.5">Pembayaran lunas — order di bawah Rp 4 juta</p>}
                                </div>
                                {isDP && (
                                  <div className="flex items-center justify-between gap-3 mt-2 px-1">
                                    <span className="text-sm text-gray-500 flex-1">Pelunasan sebelum go-live</span>
                                    <span className="text-sm font-bold text-gray-700 tabular-nums shrink-0">{formatPrice(pelunasan)}</span>
                                  </div>
                                )}
                              </div>

                              {/* Biaya perpanjangan tahunan — transparan, tidak ditagih sekarang */}
                              {totalYearlyMaint > 0 && (
                                <div className="mt-3 pt-3 border-t border-black/5 flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-600">
                                      Perpanjangan tahunan <span className="text-gray-400 font-normal">(mulai tahun ke-2)</span>
                                    </p>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Hosting dan maintenance · ditagih tiap tahun, bukan sekarang</p>
                                  </div>
                                  <span className="text-sm font-bold text-gray-600 tabular-nums shrink-0">± {formatPrice(totalYearlyMaint)}/th</span>
                                </div>
                              )}
                          </div>
                      </div>
                  </div>

                  {/* Apple-style Agreement */}
                  <button type="button" onClick={() => set('agreedToTerms', !form.agreedToTerms)}
                      className={`flex items-start gap-4 md:gap-5 w-full text-left p-5 md:p-6 rounded-[24px] border transition-all duration-300 ${
                          form.agreedToTerms ? 'bg-blue-50 border-[#0071E3] shadow-sm' : 'bg-white border-black/[0.05] hover:border-[#0071E3]/30'
                      }`}>
                      <div className={`w-7 h-7 rounded-lg flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-all duration-300 ${
                          form.agreedToTerms ? 'bg-[#0071E3] border-[#0071E3] text-white' : 'border-gray-200'
                      }`}>
                          {form.agreedToTerms && <Check size={16} strokeWidth={4} />}
                      </div>
                      <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-900">
                            Saya menyetujui{' '}
                            <a href="/terms" target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-[#0071E3] underline underline-offset-2 hover:text-blue-700">
                              Syarat & Ketentuan Layanan
                            </a>
                          </p>
                          <p className="text-xs text-gray-500 leading-relaxed">
                              Saya mengonfirmasi bahwa data pesanan yang dimasukkan sudah benar. Saya memahami bahwa pesanan ini akan diproses setelah {isDP ? `pembayaran DP 50% (Rp ${dpAmount.toLocaleString('id-ID')}) berhasil dilakukan. Pelunasan dibayar sebelum website go-live.` : `pembayaran lunas (Rp ${dpAmount.toLocaleString('id-ID')}) berhasil dilakukan.`}{totalYearlyMaint > 0 && ` Mulai tahun ke-2 ada biaya perpanjangan ±Rp ${totalYearlyMaint.toLocaleString('id-ID')}/tahun untuk hosting dan maintenance.`}
                          </p>
                      </div>
                  </button>

                  {/* Trust strip tepat sebelum tombol bayar — turunkan persepsi risiko di titik komit tertinggi */}
                  <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-500 font-medium">
                    <span className="inline-flex items-center gap-1.5"><Lock size={13} className="text-gray-400" /> Pembayaran aman via Midtrans</span>
                    <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} className="text-gray-400" /> Revisi sampai puas sebelum go-live</span>
                    <span className="inline-flex items-center gap-1.5"><Check size={13} strokeWidth={3} className="text-gray-400" /> Data dikirim ke tim konsultan</span>
                  </div>

                  <div className="flex flex-col-reverse md:flex-row justify-between mt-10 md:mt-12 pt-6 md:pt-8 border-t border-gray-100 gap-4">
                    <Button variant="ghost" onClick={handlePrev} className="w-full md:w-auto rounded-xl px-8 h-14 font-bold text-gray-400">Kembali</Button>
                    <Button disabled={!form.agreedToTerms || isSubmitting} onClick={handleSubmit} 
                        className="w-full md:w-auto rounded-2xl flex-1 h-14 bg-[#0071E3] hover:bg-blue-600 text-white font-bold shadow-xl glow-button flex items-center justify-center gap-3">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Memproses Pesanan...
                            </>
                        ) : (
                            <>
                                <Rocket size={20} /> {isDP ? 'Bayar DP & Mulai Project' : 'Bayar & Mulai Project'}
                            </>
                        )}
                    </Button>
                  </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* WhatsApp human-fallback — selalu tampak di tiap langkah */}
      <WaFallbackLine href={waOrderHref} />

      {/* Sheet rincian biaya — dipicu dari ringkasan Step 2 */}
      <MobileReceiptSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        baseLabel={kalkulatorPaket || selectedTemplate?.title || 'Website Studio'}
        basePrice={currentBasePrice}
        addons={form.selectedAddons.map(id => { const a = ADDONS.find(x => x.id === id); return a ? { name: a.name, price: a.price, included: fromKalkulator } : null }).filter(Boolean) as { name: string; price: number; included: boolean }[]}
        referralDiscount={referralDiscount}
        discountSuffix={isFlatTier(finalPrice) ? '' : (refInfo ? ` (${refInfo.discountPercent}%)` : '')}
        finalPrice={finalPrice}
        payableTotal={payableTotal}
        isDP={isDP}
        dpAmount={dpAmount}
        pelunasan={pelunasan}
        totalYearlyMaint={totalYearlyMaint}
      />
    </div>
  )
}

// ── Interstitial Page ──────────────────────────────────────────────────────────
function InterstitialPage({
  displayId, dpAmount, redirectUrl, isDP,
}: {
  displayId: string; dpAmount: number; redirectUrl: string; isDP: boolean
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Auto-copy Order ID ke clipboard saat halaman muncul
    navigator.clipboard?.writeText(displayId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }).catch(() => {})
  }, [displayId])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto py-8 px-4"
    >
      <div className="bg-white rounded-[40px] apple-shadow p-8 md:p-10 border border-black/[0.03] text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-green-500" strokeWidth={3} />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
          Pesanan Berhasil Dibuat!
        </h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Simpan Order ID berikut — gunakan kapan saja untuk lacak progress dan akses form briefing.
        </p>

        {/* Order ID card */}
        <div className="bg-[#1D1D1F] rounded-[24px] p-6 mb-2 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl" />
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Order ID</p>
          <p className="text-2xl font-black text-white tracking-wider mb-3">{displayId}</p>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
          >
            {copied
              ? <><Check size={13} className="text-green-400" /> Disalin ke clipboard!</>
              : <><Copy size={13} /> Salin Order ID</>
            }
          </button>
        </div>

        {/* localStorage indicator */}
        <p className="text-[11px] text-gray-400 mb-6 flex items-center justify-center gap-1.5">
          <Shield size={11} className="text-green-500" />
          Tersimpan otomatis di browser Anda sebagai backup
        </p>

        {/* Payment info */}
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100 mb-6 text-left">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            {isDP ? 'Bayar Sekarang (DP 50%)' : 'Bayar Sekarang (Lunas)'}
          </p>
          <p className="text-xl font-black text-green-700 tabular-nums">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(dpAmount)}
          </p>
        </div>

        <p className="text-[11px] text-gray-400 mb-4">
          WA konfirmasi + link pembayaran sudah dikirim ke nomor Anda
        </p>

        <Button
          onClick={() => { window.location.href = redirectUrl }}
          className="w-full h-14 rounded-2xl bg-[#0071E3] hover:bg-blue-600 text-white font-bold shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
        >
          <Rocket size={18} /> Lanjut ke Pembayaran
        </Button>

        <a
          href={`/track?id=${displayId.split('-').slice(2).join('-').toLowerCase()}`}
          className="block text-center text-xs text-gray-400 hover:text-gray-600 mt-4 font-medium"
        >
          Bayar nanti? Lacak pesanan via Order ID →
        </a>
      </div>
    </motion.div>
  )
}
