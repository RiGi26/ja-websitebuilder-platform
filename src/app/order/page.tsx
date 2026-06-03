'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '@/lib/ux-utils'
import {
  Check, Building2, User, ChevronRight, ChevronLeft,
  Loader2, Sparkles, AlertCircle, Rocket, ShieldCheck
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { templatesData } from '@/data/templates'
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

const ADDONS = [
  // Core & Operational
  { id: 'admin', name: 'Dashboard Admin (CMS)', price: 250000, yearlyMaint: 150000, desc: 'Kelola konten website sendiri tanpa coding.' },
  { id: 'client-portal', name: 'Client Portal Dashboard', price: 500000, yearlyMaint: 250000, desc: 'Area khusus klien untuk progres & invoice.' },
  
  // E-Commerce Specific
  { id: 'shop', name: 'Sistem Toko Online', price: 450000, yearlyMaint: 300000, desc: 'Katalog, keranjang, dan manajemen order.' },
  { id: 'midtrans', name: 'Payment Gateway (Midtrans)', price: 400000, yearlyMaint: 150000, desc: 'Terima bayar otomatis via QRIS & Bank.' },
  { id: 'ongkir', name: 'Integrasi Ongkir Otomatis', price: 250000, yearlyMaint: 100000, desc: 'Cek ongkir real-time (JNE/J&T/dll).' },
  { id: 'katalog-pro', name: 'Katalog & Stok Pro', price: 350000, yearlyMaint: 150000, desc: 'Manajemen inventori & stok otomatis.' },
  { id: 'variant', name: 'Varian Produk (Size/Warna)', price: 150000, yearlyMaint: 50000, desc: 'Pilihan variasi untuk tiap produk.' },
  
  // F&B Specific
  { id: 'qr-menu', name: 'Menu Digital QR-Code', price: 200000, yearlyMaint: 100000, desc: 'Pelanggan scan meja untuk lihat menu.' },
  { id: 'delivery', name: 'Integrasi Delivery', price: 300000, yearlyMaint: 150000, desc: 'Tombol pesan via GrabFood/GoFood.' },
  
  // Medical & Service
  { id: 'booking', name: 'Sistem Booking & Kalender', price: 300000, yearlyMaint: 150000, desc: 'Jadwal temu & janji temu real-time.' },
  { id: 'telemedicine', name: 'Integrasi Telemedicine', price: 400000, yearlyMaint: 200000, desc: 'Konsultasi online via Zoom/Meet.' },
  
  // LMS & Education
  { id: 'membership', name: 'Sistem Membership', price: 500000, yearlyMaint: 200000, desc: 'Area login khusus member/siswa.' },
  { id: 'lms', name: 'LMS / Video Course', price: 400000, yearlyMaint: 300000, desc: 'Sistem pembelajaran & progres video.' },
  { id: 'cert-auto', name: 'Sertifikat Otomatis', price: 350000, yearlyMaint: 150000, desc: 'Generate PDF sertifikat otomatis.' },
  { id: 'live-session', name: 'Integrasi Live Class', price: 450000, yearlyMaint: 250000, desc: 'Penjadwalan kelas Zoom otomatis.' },

  // Marketing & General
  { id: 'email-biz', name: 'Email Bisnis (nama@brand.com)', price: 150000, yearlyMaint: 300000, desc: 'Email profesional untuk kredibilitas.' },
  { id: 'lang-multi', name: 'Multi-Language (ID/EN/JP)', price: 400000, yearlyMaint: 200000, desc: 'Website dalam 2-3 bahasa sekaligus.' },
  { id: 'wa', name: 'Otomasi WhatsApp', price: 300000, yearlyMaint: 150000, desc: 'Notifikasi order otomatis ke WA.' },
  { id: 'seo', name: 'SEO Optimization', price: 200000, yearlyMaint: 100000, desc: 'Optimasi agar muncul di halaman 1 Google.' },
  { id: 'ads-tracking', name: 'Ads Tracking (Pixel/GA)', price: 150000, yearlyMaint: 0, desc: 'Pantau efektivitas iklan FB/Google.' },
  { id: 'protection', name: 'Proteksi Gambar (Anti-Copy)', price: 100000, yearlyMaint: 0, desc: 'Cegah download gambar ilegal.' },
  { id: 'career', name: 'Portal Lowongan Kerja', price: 300000, yearlyMaint: 100000, desc: 'Halaman karir & lamaran online.' },
  { id: 'newsletter', name: 'Newsletter System', price: 200000, yearlyMaint: 100000, desc: 'Kumpulkan email database pelanggan.' },
  { id: 'chat', name: 'Live Chat Support', price: 100000, yearlyMaint: 50000, desc: 'Chat langsung di website (Tawk.to).' },
]

// ── Reusable components ────────────────────────────────────────────────────────
function StepHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
      <p className="text-gray-500 text-sm font-medium">{desc}</p>
    </div>
  )
}

function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
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

  // Pre-fill dari kalkulator ja-corp-landing
  const kalkulatorIndustri = searchParams.get('industri') ?? ''
  const kalkulatorEstimasi = searchParams.get('estimasi') ? Number(searchParams.get('estimasi')) : null
  const kalkulatorPaket = searchParams.get('paket') ?? ''
  const kalkulatorAddons = searchParams.get('addons') ?? ''

  // Mapping corp-landing addon IDs → order form addon IDs
  const CORP_TO_ORDER_ID: Record<string, string> = {
    'admin-dash': 'admin',
    'wa-auto': 'wa',
    'live-chat': 'chat',
    'cart': 'shop',
    'checkout': 'shop',
    'track-pack': 'ads-tracking',
    'blog': 'newsletter',
    'email-auto': 'newsletter',
    'zoom': 'lms',
    'cert': 'cert-auto',
    'vendor': 'shop',
    'stock': 'katalog-pro',
    'g-sheets': 'admin',
  }

  useEffect(() => {
    const tid = searchParams.get('template')
    if (tid && templatesData[tid]) setForm(f => ({ ...f, templateId: tid }))
    if (kalkulatorIndustri) setForm(f => ({ ...f, industri: kalkulatorIndustri }))

    if (kalkulatorAddons) {
      const rawIds = kalkulatorAddons.split(',').map(s => s.trim()).filter(Boolean)
      const mappedIds = rawIds.map(id => CORP_TO_ORDER_ID[id] ?? id)
      const validIds = [...new Set(mappedIds)].filter(id => ADDONS.some(a => a.id === id))
      if (validIds.length > 0) {
        setForm(f => ({ ...f, selectedAddons: validIds }))
      }
    }
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  // Dari kalkulator → skip step addon (sudah dipilih di sana)
  const fromKalkulator = !!(kalkulatorPaket || kalkulatorEstimasi)

  const set = (key: keyof FormData, val: any) => setForm(f => ({ ...f, [key]: val }))

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

  const totalAddons = form.selectedAddons.reduce((acc, id) => {
    const addon = ADDONS.find(a => a.id === id)
    return acc + (addon?.price || 0)
  }, 0)

  // DYNAMIC PRICING LOGIC
  const selectedTemplate = form.templateId ? templatesData[form.templateId] : null
  const currentBasePrice = selectedTemplate?.price_numeric || kalkulatorEstimasi || 499000
  const currentBaseRenewal = selectedTemplate?.renewal_price || 699000

  const totalAddonYearly = form.selectedAddons.reduce((acc, id) => {
    const addon = ADDONS.find(a => a.id === id)
    return acc + (addon?.yearlyMaint || 0)
  }, 0)

  const finalPrice = currentBasePrice + totalAddons
  const totalYearlyMaint = currentBaseRenewal + totalAddonYearly

  const DP_THRESHOLD = 3_000_000
  const isDP = finalPrice > DP_THRESHOLD
  const dpAmount = isDP ? Math.ceil(finalPrice * 0.5) : finalPrice
  const pelunasan = isDP ? finalPrice - dpAmount : 0



  const toggleAddon = (id: string) => {
    if (form.selectedAddons.includes(id)) {
      set('selectedAddons', form.selectedAddons.filter(a => a !== id))
    } else {
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
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal membuat transaksi')

      const { redirect_url, order_id, display_id, dp_amount } = data

      // Simpan info order ke sessionStorage supaya halaman /track bisa tampilkan success state
      sessionStorage.setItem('ja_pending_order', JSON.stringify({ order_id, display_id, dp_amount }))

      // Redirect ke halaman pembayaran Midtrans
      window.location.href = redirect_url
    } catch (err: any) {
      console.error('Submission error:', err)
      setSubmitError(err.message || 'Terjadi kesalahan koneksi. Silakan hubungi tim kami via WhatsApp.')
      setIsSubmitting(false)
    }
  }

  const totalSteps = fromKalkulator ? 3 : 4
  const displayStep = fromKalkulator && step === 3 ? 2 : step
  const progress = displayStep === 0 ? 0 : Math.round((displayStep / (totalSteps - 1)) * 100)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header (Apple Style) */}
      <div className="text-center mb-12 animate-fade-in px-4">
          <div className="flex items-center justify-center gap-3 mb-6">
              {(fromKalkulator ? [1,2,3] : [1,2,3,4]).map((s) => (
                  <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${displayStep >= s-1 ? 'w-8 bg-[#0071E3]' : 'w-4 bg-gray-200'}`} />
              ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2 sf-display-heavy">Detail Pesanan</h1>
          <p className="text-gray-500 font-medium">Lengkapi data diri dan pilih fitur yang Anda butuhkan.</p>
      </div>

      {/* Banner dari kalkulator */}
      {(kalkulatorEstimasi || kalkulatorAddons) && (
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
              <StepHeader title="Kategori Client" desc="Pilih jenis identitas untuk website Anda." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[
                  { id: 'individu', title: 'Individu / UMKM', desc: 'Cocok untuk portfolio, blog, atau usaha mikro.', icon: User },
                  { id: 'perusahaan', title: 'Perusahaan / PT / CV', desc: 'Cocok untuk branding korporat dan skala bisnis menengah.', icon: Building2 },
                ].map(opt => (
                  <button key={opt.id} onClick={() => { set('clientType', opt.id); handleNext(); triggerHaptic(); }}
                    className={`p-6 md:p-8 rounded-[24px] md:rounded-[32px] border-2 text-left transition-all hover:translate-y-[-4px] ${form.clientType === opt.id ? 'border-[#0071E3] bg-blue-50/50 shadow-md' : 'border-gray-100 hover:border-[#0071E3]/20 bg-gray-50/50'}`}>
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
              <StepHeader title="Informasi Identitas" desc="Lengkapi detail kontak dan nama bisnis Anda." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                {form.clientType === 'individu' ? (
                  <FieldRow label="Nama Usaha / Brand" required>
                    <Input placeholder="Contoh: Kedai Kopi Mulyo" value={form.namaUsaha} onChange={e => set('namaUsaha', e.target.value)} className="apple-input" />
                  </FieldRow>
                ) : (
                  <>
                    <FieldRow label="Nama Perusahaan" required>
                      <Input placeholder="Contoh: PT Japan Arena Indonesia" value={form.namaPerusahaan} onChange={e => set('namaPerusahaan', e.target.value)} className="apple-input" />
                    </FieldRow>
                    <FieldRow label="Nama PIC" required>
                      <Input placeholder="Nama lengkap Anda" value={form.namapic} onChange={e => set('namapic', e.target.value)} className="apple-input" />
                    </FieldRow>
                  </>
                )}
                <FieldRow label="Nomor WhatsApp" required>
                  <Input placeholder="Contoh: 08123456789" value={form.nomorWa} onChange={e => set('nomorWa', e.target.value)} className="apple-input" />
                </FieldRow>
                <FieldRow label="Email">
                  <Input placeholder="Alamat email aktif" value={form.email} onChange={e => set('email', e.target.value)} className="apple-input" />
                </FieldRow>
                <div className="md:col-span-2">
                  <FieldRow label="Bidang Industri">
                    <Input placeholder="Contoh: Food & Beverage, Fashion, Pendidikan" value={form.industri} onChange={e => set('industri', e.target.value)} className="apple-input" />
                  </FieldRow>
                </div>
              </div>
              <div className="flex flex-col-reverse md:flex-row justify-between mt-10 md:mt-12 pt-6 md:pt-8 border-t border-gray-100 gap-4">
                <Button variant="ghost" onClick={handlePrev} className="w-full md:w-auto rounded-xl px-8 h-14 font-bold text-gray-400"><ChevronLeft className="mr-2" size={18} /> Kembali</Button>
                <Button disabled={!form.nomorWa || (form.clientType === 'individu' ? !form.namaUsaha : !form.namaPerusahaan)} onClick={handleNext} className="w-full md:w-auto rounded-2xl px-12 h-14 bg-[#0071E3] hover:bg-blue-600 text-white font-bold shadow-lg">Lanjut Pembayaran <ChevronRight className="ml-2" size={18} /></Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <StepHeader title="Fitur Tambahan (Addons)" desc="Personalisasi website Anda dengan fitur pendukung bisnis." />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar pb-6">
                {ADDONS.map(addon => {
                  const isSelected = form.selectedAddons.includes(addon.id)

                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-5 rounded-3xl border-2 text-left transition-all relative flex flex-col h-full ${
                        isSelected ? 'border-[#0071E3] bg-blue-50/30' : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <h4 className={`text-sm font-bold mb-1 pr-16 ${isSelected ? 'text-[#0071E3]' : 'text-gray-900'}`}>{addon.name}</h4>
                      <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">{addon.desc}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-black/[0.03] w-full">
                        <span className="text-sm font-black text-gray-900">{formatPrice(addon.price)}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[#0071E3] border-[#0071E3] text-white' : 'border-gray-200'
                        }`}>
                          {isSelected && <Check size={12} strokeWidth={4} />}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Fitur Terpilih</p>
                  <p className="text-lg font-black text-[#0071E3]">{formatPrice(totalAddons)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Investasi</p>
                  <p className="text-lg font-black text-gray-900">{formatPrice(finalPrice)}</p>
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row justify-between mt-10 pt-8 border-t border-gray-100 gap-4">
                <Button variant="ghost" onClick={handlePrev} className="w-full md:w-auto rounded-xl px-8 h-14 font-bold text-gray-400"><ChevronLeft className="mr-2" size={18} /> Kembali</Button>
                <Button onClick={handleNext} className="w-full md:w-auto rounded-2xl px-12 h-14 bg-[#0071E3] hover:bg-blue-600 text-white font-bold shadow-lg">Lanjut ke Konfirmasi <ChevronRight className="ml-2" size={18} /></Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <StepHeader title="Konfirmasi & Finalisasi" desc="Pastikan rincian brief Anda sudah sesuai sebelum dikirim ke tim konsultan kami." />
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
                                      <span className="font-bold shrink-0 text-left sm:text-right">{formatPrice(addon.price)}</span>
                                  </div>
                                  ) : null
                              })}
                              <div className="pt-6 mt-6 border-t-2 border-black/5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                  <span className="text-lg sm:text-xl sf-display-heavy text-gray-900 uppercase tracking-tighter flex-1">Total Estimasi</span>
                                  <span className="text-2xl md:text-3xl sf-display-heavy text-[#0071E3] shrink-0 text-left sm:text-right">{formatPrice(finalPrice)}</span>
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
                                  {!isDP && <p className="text-xs text-gray-500 mt-1.5">Pembayaran lunas — order di bawah Rp 3 juta</p>}
                                </div>
                                {isDP && (
                                  <div className="flex items-center justify-between gap-3 mt-2 px-1">
                                    <span className="text-sm text-gray-500 flex-1">Pelunasan sebelum go-live</span>
                                    <span className="text-sm font-bold text-gray-700 tabular-nums shrink-0">{formatPrice(pelunasan)}</span>
                                  </div>
                                )}
                              </div>
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
                              Saya mengonfirmasi bahwa data pesanan yang dimasukkan sudah benar. Saya memahami bahwa pesanan ini akan diproses setelah {isDP ? `pembayaran DP 50% (Rp ${dpAmount.toLocaleString('id-ID')}) berhasil dilakukan. Pelunasan dibayar sebelum website go-live.` : `pembayaran lunas (Rp ${dpAmount.toLocaleString('id-ID')}) berhasil dilakukan.`}
                          </p>
                      </div>
                  </button>

                  <div className="flex flex-col-reverse md:flex-row justify-between mt-10 md:mt-12 pt-6 md:pt-8 border-t border-gray-100 gap-4">
                    <Button variant="ghost" onClick={handlePrev} className="w-full md:w-auto rounded-xl px-8 h-14 font-bold text-gray-400">Kembali</Button>
                    <Button disabled={!form.agreedToTerms || isSubmitting} onClick={handleSubmit} 
                        className="w-full md:w-auto rounded-2xl flex-1 h-14 bg-[#0071E3] hover:bg-blue-600 text-white font-bold shadow-xl flex items-center justify-center gap-3">
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
    </div>
  )
}
