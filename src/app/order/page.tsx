'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '@/lib/ux-utils'
import {
  Check, Building2, User, ChevronRight, ChevronLeft,
  Loader2, Sparkles, AlertCircle, Rocket, ShieldCheck, Search
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
  { id: 'blog', name: 'Blog / Artikel', price: 200000, yearlyMaint: 100000 },
  { id: 'shop', name: 'Online Shop (Basic)', price: 450000, yearlyMaint: 300000 },
  { id: 'admin', name: 'Dashboard Admin', price: 250000, yearlyMaint: 150000 },
  { id: 'member', name: 'Membership System', price: 500000, yearlyMaint: 200000 },
  { id: 'lms', name: 'Sistem E-learning / LMS', price: 400000, yearlyMaint: 300000 },
  { id: 'quiz', name: 'Sistem Kuis Online', price: 450000, yearlyMaint: 200000 },
  { id: 'portal', name: 'Portal Siswa / Member', price: 300000, yearlyMaint: 150000 },
  { id: 'gsheets', name: 'Integrasi Google Sheets', price: 150000, yearlyMaint: 75000 },
  { id: 'midtrans', name: 'Midtrans Payment Gateway', price: 400000, yearlyMaint: 150000 },
  { id: 'wa', name: 'Otomasi WhatsApp', price: 300000, yearlyMaint: 150000 },
  { id: 'invoice', name: 'Otomasi Invoice', price: 200000, yearlyMaint: 100000 },
  { id: 'seo', name: 'Optimasi Google (SEO)', price: 150000, yearlyMaint: 75000 },
  { id: 'booking', name: 'Sistem Booking Online', price: 300000, yearlyMaint: 150000 },
  { id: 'chat', name: 'Live Chat Support', price: 100000, yearlyMaint: 50000 },
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
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [orderResult, setOrderResult] = useState<any>(null)
  const [paymentPending, setPaymentPending] = useState(false)

  // Pre-fill dari kalkulator ja-corp-landing
  const kalkulatorIndustri = searchParams.get('industri') ?? ''
  const kalkulatorEstimasi = searchParams.get('estimasi') ? Number(searchParams.get('estimasi')) : null
  const kalkulatorPaket = searchParams.get('paket') ?? ''
  const kalkulatorAddons = searchParams.get('addons') ?? ''

  useEffect(() => {
    const tid = searchParams.get('template')
    if (tid && templatesData[tid]) setForm(f => ({ ...f, templateId: tid }))
    if (kalkulatorIndustri) setForm(f => ({ ...f, industri: kalkulatorIndustri }))
    if (kalkulatorAddons) setForm(f => ({ ...f, referensiManual: `Dari kalkulator:\nPaket: ${kalkulatorPaket}\nFitur: ${kalkulatorAddons}` }))
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key: keyof FormData, val: any) => setForm(f => ({ ...f, [key]: val }))

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

  const handleNext = () => setStep(s => s + 1)
  const handlePrev = () => setStep(s => s - 1)

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

      // Redirect ke halaman pembayaran Midtrans — tidak ada SSL popup issue
      window.location.href = redirect_url
    } catch (err: any) {
      console.error('Submission error:', err)
      setSubmitError(err.message || 'Terjadi kesalahan koneksi. Silakan hubungi tim kami via WhatsApp.')
      setIsSubmitting(false)
    }
  }

  const totalSteps = 3
  const progress = step === 0 ? 0 : Math.round((step / totalSteps) * 100)

  if (submitted && orderResult) {
    const displayId = orderResult.display_id
    const dpAmount = orderResult.dp_amount
    const remaining = finalPrice - dpAmount
    const clientName = form.clientType === 'perusahaan' ? form.namaPerusahaan : form.namaUsaha
    const waMsg = encodeURIComponent(
      `Halo Japan Arena Corp! 👋\n\nSaya sudah bayar DP untuk order website.\n\n` +
      `📋 Order ID: *${displayId}*\n` +
      `🏢 Nama: ${clientName}\n` +
      `💰 DP Dibayar: Rp ${dpAmount.toLocaleString('id-ID')}\n\n` +
      `Mohon konfirmasi penerimaan DP saya ya. Terima kasih!`
    )
    const trackUrl = `/track?id=${orderResult.id}`

    return (
      <div className="max-w-xl mx-auto py-12 px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] apple-shadow p-10 border border-black/[0.03]">

          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ${paymentPending ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'}`}>
            {paymentPending ? <Loader2 size={36} /> : <Check size={40} strokeWidth={3} />}
          </div>

          <h1 className="text-3xl sf-display-heavy text-gray-900 mb-2 tracking-tight text-center">
            {paymentPending ? 'Menunggu Konfirmasi Pembayaran' : 'DP Berhasil! 🎉'}
          </h1>
          <p className="text-gray-500 text-sm text-center mb-8 leading-relaxed">
            {paymentPending
              ? 'Pembayaran Anda sedang diproses. Kami akan mulai pengerjaan setelah pembayaran terkonfirmasi.'
              : <>Tim kami akan menghubungi Anda dalam <strong>1×24 jam</strong> untuk sesi Onboarding.</>
            }
          </p>

          {/* Order ID Card */}
          <div className="bg-gradient-to-br from-[#1D1D1F] to-gray-800 rounded-[28px] p-7 text-white mb-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0071E3]/20 blur-3xl" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Order ID</p>
              <p className="text-2xl font-black tracking-wider text-white mb-1">{displayId}</p>
              <p className="text-gray-400 text-xs font-medium">Simpan ID ini untuk lacak progress pengerjaan</p>
            </div>
          </div>

          {/* Payment breakdown */}
          <div className="bg-[#F9F9FB] rounded-[24px] p-5 mb-6 border border-black/[0.04] space-y-3">
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500 flex-1">DP 50% {paymentPending ? '(menunggu konfirmasi)' : 'Dibayar'}</p>
              <p className={`font-black text-sm shrink-0 ${paymentPending ? 'text-amber-500' : 'text-green-600'}`}>
                {formatPrice(dpAmount)}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-black/[0.04]">
              <p className="text-sm text-gray-400 flex-1">Pelunasan (dibayar sebelum go-live)</p>
              <p className="font-black text-sm text-gray-500 shrink-0">{formatPrice(remaining)}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 mb-8">
            <Button asChild className="w-full py-6 rounded-2xl bg-[#0071E3] hover:bg-blue-600 text-white font-bold text-sm shadow-lg flex items-center gap-2">
              <Link href={trackUrl}>
                <Search size={18} /> Lacak Progress Sekarang
              </Link>
            </Button>
            <a
              href={`https://wa.me/6281296917963?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all"
            >
              <span className="text-base">💬</span> Konfirmasi DP via WhatsApp
            </a>
          </div>

          {/* Next steps */}
          <div className="bg-[#F5F5F7] rounded-3xl p-6 space-y-4 border border-black/[0.02]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alur Selanjutnya</p>
            {[
              { t: 'Konfirmasi DP', c: 'Admin verifikasi pembayaran DP dalam 1×24 jam.' },
              { t: 'Video Call Onboarding', c: 'Brief detail & kunci scope pengerjaan bersama.' },
              { t: 'Pengerjaan & Launch', c: 'Website live dalam 7–14 hari kerja. Pelunasan sebelum go-live.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-[#0071E3] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-none mb-0.5">{item.t}</p>
                  <p className="text-xs text-gray-500">{item.c}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  const selectedTemplateDetails = form.templateId ? templatesData[form.templateId] : null

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header (Apple Style) */}
      <div className="text-center mb-12 animate-fade-in px-4">
          <div className="flex items-center justify-center gap-3 mb-6">
              {[1,2,3].map((s) => (
                  <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s-1 ? 'w-8 bg-[#0071E3]' : 'w-4 bg-gray-200'}`} />
              ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2 sf-display-heavy">Detail Order & Briefing</h1>
          <p className="text-gray-500 font-medium">Bantu kami memahami visi digital bisnis Anda.</p>
      </div>

      {/* Banner dari kalkulator */}
      {kalkulatorEstimasi && (
        <div className="bg-blue-50 border border-blue-100 rounded-[28px] p-5 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-[#0071E3] rounded-2xl flex items-center justify-center text-white shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-blue-900 mb-1">Melanjutkan dari Kalkulator</p>
            <p className="text-xs text-blue-700 font-medium leading-relaxed">
              Industri: <strong>{kalkulatorIndustri}</strong> · Paket: <strong>{kalkulatorPaket}</strong>
              {kalkulatorAddons && <> · Fitur: <strong>{kalkulatorAddons}</strong></>}
            </p>
            <p className="text-xs text-blue-600 mt-1">Estimasi Setup: <strong>Rp {kalkulatorEstimasi.toLocaleString('id-ID')}</strong></p>
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
                <Button disabled={!form.nomorWa || (form.clientType === 'individu' ? !form.namaUsaha : !form.namaPerusahaan)} onClick={handleNext} className="w-full md:w-auto rounded-2xl px-12 h-14 bg-[#0071E3] hover:bg-blue-600 text-white font-bold shadow-lg">Lanjut ke Konfirmasi <ChevronRight className="ml-2" size={18} /></Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
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
                              Saya mengonfirmasi bahwa data pesanan yang dimasukkan sudah benar. Saya memahami bahwa pesanan ini akan diproses setelah pembayaran DP berhasil dilakukan.
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
                                <Rocket size={20} /> Selesaikan Pesanan & Bayar DP
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
