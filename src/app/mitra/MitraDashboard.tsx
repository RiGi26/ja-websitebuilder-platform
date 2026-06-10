'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Copy, Check, Wallet, Clock, CheckCircle2, Banknote,
  LogOut, Loader2, AlertCircle, Landmark, Users, MessageCircle,
} from 'lucide-react'

export interface EarningRow {
  id: string
  displayId: string
  customerLabel: string
  orderTotal: number
  amount: number
  status: 'pending' | 'confirmed' | 'paid' | 'void'
  claimed: boolean
  createdAt: string | null
}

export interface PayoutRow {
  id: string
  amount: number
  status: 'requested' | 'paid' | 'rejected'
  requestedAt: string | null
  paidAt: string | null
  adminNote: string | null
}

interface Props {
  referrerName: string
  code: string
  refLink: string
  discountPercent: number
  commissionPercent: number
  stats: { orders: number; pendingRp: number; payableRp: number; paidRp: number }
  earnings: EarningRow[]
  payouts: PayoutRow[]
  bank: { bankName: string; accountNumber: string; accountName: string }
  hasPendingPayout: boolean
  payoutMin: number
}

const rp = (n: number) => `Rp ${Math.round(n).toLocaleString('id-ID')}`
const tgl = (s: string | null) =>
  s ? new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

function earningBadge(e: EarningRow): { label: string; cls: string } {
  if (e.status === 'paid') return { label: 'Dibayar', cls: 'bg-blue-50 text-[#0071E3] border-blue-100' }
  if (e.status === 'void') return { label: 'Dibatalkan', cls: 'bg-gray-100 text-gray-500 border-gray-200' }
  if (e.status === 'confirmed' && e.claimed)
    return { label: 'Pencairan Diproses', cls: 'bg-blue-50 text-[#0071E3] border-blue-100' }
  if (e.status === 'confirmed')
    return { label: 'Bisa Dicairkan', cls: 'bg-green-50 text-green-700 border-green-100' }
  return { label: 'Menunggu Pelunasan', cls: 'bg-amber-50 text-amber-700 border-amber-100' }
}

const PAYOUT_BADGE: Record<PayoutRow['status'], { label: string; cls: string }> = {
  requested: { label: 'Diproses', cls: 'bg-amber-50 text-amber-700 border-amber-100' },
  paid: { label: 'Ditransfer', cls: 'bg-green-50 text-green-700 border-green-100' },
  rejected: { label: 'Ditolak', cls: 'bg-red-50 text-red-600 border-red-100' },
}

export default function MitraDashboard({
  referrerName, code, refLink, discountPercent, commissionPercent,
  stats, earnings, payouts, bank, hasPendingPayout, payoutMin,
}: Props) {
  const router = useRouter()
  const [copied, setCopied] = useState<'link' | 'code' | null>(null)
  const [payoutStep, setPayoutStep] = useState<'idle' | 'confirm' | 'submitting'>('idle')
  const [payoutError, setPayoutError] = useState('')
  const [bankForm, setBankForm] = useState(bank)
  const [bankSaving, setBankSaving] = useState(false)
  const [bankSaved, setBankSaved] = useState(false)
  const [bankError, setBankError] = useState('')

  const bankComplete = !!(bankForm.bankName.trim() && bankForm.accountNumber.trim() && bankForm.accountName.trim())
  const bankCompleteSaved = !!(bank.bankName && bank.accountNumber && bank.accountName)
  const canRequest = stats.payableRp >= payoutMin && !hasPendingPayout && bankCompleteSaved

  const waShareText = encodeURIComponent(
    `Halo! Mau punya website profesional untuk bisnismu? Pesan di Japan Arena pakai kode referral saya *${code}* — dapat diskon ${discountPercent}%! 🎉\n\n${refLink}`,
  )

  const copyText = async (text: string, which: 'link' | 'code') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(which)
      setTimeout(() => setCopied(null), 2000)
    } catch { /* clipboard tidak tersedia — abaikan */ }
  }

  const handleLogout = async () => {
    await createClient().auth.signOut()
    router.push('/mitra/login')
    router.refresh()
  }

  const submitPayout = async () => {
    setPayoutStep('submitting')
    setPayoutError('')
    try {
      const res = await fetch('/api/mitra/payout', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Gagal mengajukan pencairan.')
      setPayoutStep('idle')
      router.refresh()
    } catch (err) {
      setPayoutError(err instanceof Error ? err.message : 'Gagal mengajukan pencairan.')
      setPayoutStep('confirm')
    }
  }

  const saveBank = async (e: React.FormEvent) => {
    e.preventDefault()
    setBankSaving(true)
    setBankSaved(false)
    setBankError('')
    try {
      const res = await fetch('/api/mitra/bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bank_name: bankForm.bankName.trim(),
          bank_account_number: bankForm.accountNumber.trim(),
          bank_account_name: bankForm.accountName.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Gagal menyimpan rekening.')
      setBankSaved(true)
      setTimeout(() => setBankSaved(false), 2500)
      router.refresh()
    } catch (err) {
      setBankError(err instanceof Error ? err.message : 'Gagal menyimpan rekening.')
    } finally {
      setBankSaving(false)
    }
  }

  const inputCls =
    'w-full px-4 py-3.5 bg-gray-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:bg-white transition-all'

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-8 md:py-12 space-y-6 md:space-y-8">

        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#0071E3]">Program Mitra</p>
            <h1 className="text-2xl md:text-3xl sf-display-heavy text-gray-900 tracking-tight mt-1">
              Halo, {referrerName}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Keluar dari dashboard"
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-600 text-xs font-bold rounded-full border border-black/5 apple-shadow hover:text-gray-900 transition-all active:scale-[0.96]"
          >
            <LogOut size={14} /> Keluar
          </button>
        </header>

        {/* Referral link card */}
        <section className="bg-white rounded-[32px] p-6 md:p-10 apple-shadow border border-black/[0.03]">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Link Referral Anda</p>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex-1 min-w-0">
              <button
                onClick={() => copyText(code, 'code')}
                aria-label="Salin kode referral"
                className="inline-flex items-center gap-2.5 group"
              >
                <span className="text-3xl md:text-4xl sf-display-heavy text-gray-900 tracking-tight">{code || '—'}</span>
                {copied === 'code'
                  ? <Check size={18} className="text-green-600" strokeWidth={3} />
                  : <Copy size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors" />}
              </button>
              <p className="text-sm text-gray-500 mt-2 break-all">{refLink}</p>
              <p className="text-xs font-semibold text-gray-600 mt-3">
                Teman Anda dapat <span className="text-green-600">diskon {discountPercent}%</span> · Anda dapat{' '}
                <span className="text-[#0071E3]">komisi {commissionPercent}%</span> dari setiap order yang dibayar.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <a
                href={`https://wa.me/?text=${waShareText}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 h-12 bg-[#0071E3] hover:bg-[#005BB5] text-white text-sm font-bold rounded-full transition-all shadow-lg active:scale-[0.96]"
              >
                <MessageCircle size={16} /> Bagikan via WhatsApp
              </a>
              <button
                onClick={() => copyText(refLink, 'link')}
                className="flex items-center justify-center gap-2 px-6 h-12 bg-white text-gray-900 text-sm font-bold rounded-full border border-black/5 apple-shadow hover:border-black/10 transition-all active:scale-[0.96]"
              >
                {copied === 'link' ? <Check size={16} className="text-green-600" strokeWidth={3} /> : <Copy size={16} />}
                {copied === 'link' ? 'Tersalin!' : 'Salin Link'}
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section aria-label="Ringkasan komisi" className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: Users, label: 'Order Referral', value: String(stats.orders), accent: 'text-gray-900' },
            { icon: Clock, label: 'Komisi Pending', value: rp(stats.pendingRp), accent: 'text-amber-600' },
            { icon: Wallet, label: 'Bisa Dicairkan', value: rp(stats.payableRp), accent: 'text-green-600' },
            { icon: CheckCircle2, label: 'Sudah Dibayar', value: rp(stats.paidRp), accent: 'text-[#0071E3]' },
          ].map(({ icon: Icon, label, value, accent }) => (
            <div key={label} className="bg-white rounded-[24px] p-5 md:p-6 apple-shadow border border-black/[0.03]">
              <Icon size={18} className="text-gray-300 mb-3" />
              <p className={`text-lg md:text-2xl font-black tabular-nums tracking-tight ${accent}`}>{value}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </section>

        {/* Payout panel */}
        <section className="bg-white rounded-[32px] p-6 md:p-10 apple-shadow border border-black/[0.03]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saldo Bisa Dicairkan</p>
              <p className="text-3xl md:text-4xl font-black text-green-600 tabular-nums tracking-tight mt-1.5">
                {rp(stats.payableRp)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {hasPendingPayout
                  ? 'Masih ada pengajuan pencairan yang sedang diproses.'
                  : !bankCompleteSaved
                    ? 'Lengkapi rekening bank di bawah sebelum mengajukan pencairan.'
                    : stats.payableRp < payoutMin
                      ? `Minimal pencairan ${rp(payoutMin)}.`
                      : 'Dana ditransfer manual ke rekening Anda dalam 1–3 hari kerja.'}
              </p>
            </div>
            <button
              onClick={() => { setPayoutError(''); setPayoutStep('confirm') }}
              disabled={!canRequest || payoutStep !== 'idle'}
              className="px-8 h-14 bg-[#0071E3] hover:bg-[#005BB5] text-white font-bold rounded-2xl transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.96] shrink-0"
            >
              Ajukan Pencairan
            </button>
          </div>

          {payoutStep !== 'idle' && (
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-[24px] p-5 md:p-6">
              <p className="text-sm font-bold text-gray-900">
                Cairkan {rp(stats.payableRp)} ke rekening berikut?
              </p>
              <p className="text-sm text-gray-600 mt-1.5">
                {bank.bankName} · {bank.accountNumber} · a.n. {bank.accountName}
              </p>
              {payoutError && (
                <p className="flex items-center gap-1.5 text-xs font-bold text-red-600 mt-3">
                  <AlertCircle size={14} /> {payoutError}
                </p>
              )}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={submitPayout}
                  disabled={payoutStep === 'submitting'}
                  className="flex items-center gap-2 px-6 h-11 bg-[#0071E3] hover:bg-[#005BB5] text-white text-sm font-bold rounded-full transition-all disabled:opacity-50 active:scale-[0.96]"
                >
                  {payoutStep === 'submitting' && <Loader2 size={14} className="animate-spin" />}
                  Konfirmasi
                </button>
                <button
                  onClick={() => setPayoutStep('idle')}
                  disabled={payoutStep === 'submitting'}
                  className="px-6 h-11 bg-white text-gray-600 text-sm font-bold rounded-full border border-black/5 transition-all active:scale-[0.96]"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Earnings table */}
        <section className="bg-white rounded-[32px] p-6 md:p-10 apple-shadow border border-black/[0.03]">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Riwayat Komisi</h2>
          {earnings.length === 0 ? (
            <div className="text-center py-10">
              <Banknote size={28} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-600">Belum ada order lewat link Anda.</p>
              <p className="text-xs text-gray-500 mt-1">Bagikan link referral untuk mulai mendapatkan komisi.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-black/[0.05]">
                    <th className="py-3 pr-4 font-bold">Tanggal</th>
                    <th className="py-3 pr-4 font-bold">Order</th>
                    <th className="py-3 pr-4 font-bold">Nilai Order</th>
                    <th className="py-3 pr-4 font-bold">Komisi</th>
                    <th className="py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((e) => {
                    const badge = earningBadge(e)
                    return (
                      <tr key={e.id} className="border-b border-black/[0.03] last:border-0">
                        <td className="py-4 pr-4 text-gray-500 whitespace-nowrap">{tgl(e.createdAt)}</td>
                        <td className="py-4 pr-4">
                          <p className="font-bold text-gray-900 whitespace-nowrap">{e.displayId}</p>
                          <p className="text-xs text-gray-500">{e.customerLabel}</p>
                        </td>
                        <td className="py-4 pr-4 text-gray-600 tabular-nums whitespace-nowrap">{rp(e.orderTotal)}</td>
                        <td className="py-4 pr-4 font-bold text-gray-900 tabular-nums whitespace-nowrap">{rp(e.amount)}</td>
                        <td className="py-4">
                          <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border whitespace-nowrap ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Payout history */}
        {payouts.length > 0 && (
          <section className="bg-white rounded-[32px] p-6 md:p-10 apple-shadow border border-black/[0.03]">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Riwayat Pencairan</h2>
            <div className="space-y-3">
              {payouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl border border-black/[0.03]">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 tabular-nums">{rp(p.amount)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Diajukan {tgl(p.requestedAt)}
                      {p.status === 'paid' && p.paidAt ? ` · ditransfer ${tgl(p.paidAt)}` : ''}
                    </p>
                    {p.adminNote && <p className="text-xs text-gray-500 mt-0.5">Catatan: {p.adminNote}</p>}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 ${PAYOUT_BADGE[p.status].cls}`}>
                    {PAYOUT_BADGE[p.status].label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bank settings */}
        <section className="bg-white rounded-[32px] p-6 md:p-10 apple-shadow border border-black/[0.03]">
          <div className="flex items-center gap-2.5 mb-6">
            <Landmark size={16} className="text-gray-300" />
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rekening Pencairan</h2>
          </div>
          <form onSubmit={saveBank} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="bank-name" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Bank</label>
              <input
                id="bank-name" value={bankForm.bankName}
                onChange={(e) => setBankForm((f) => ({ ...f, bankName: e.target.value }))}
                placeholder="BCA / Mandiri / BNI" required className={inputCls}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="bank-number" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nomor Rekening</label>
              <input
                id="bank-number" value={bankForm.accountNumber} inputMode="numeric"
                onChange={(e) => setBankForm((f) => ({ ...f, accountNumber: e.target.value }))}
                placeholder="1234567890" required className={inputCls}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="bank-holder" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Pemilik</label>
              <input
                id="bank-holder" value={bankForm.accountName}
                onChange={(e) => setBankForm((f) => ({ ...f, accountName: e.target.value }))}
                placeholder="Sesuai buku tabungan" required className={inputCls}
              />
            </div>
            <div className="md:col-span-3 flex items-center gap-4">
              <button
                type="submit" disabled={bankSaving || !bankComplete}
                className="flex items-center gap-2 px-8 h-12 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-2xl transition-all disabled:opacity-40 active:scale-[0.96]"
              >
                {bankSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                Simpan Rekening
              </button>
              {bankSaved && (
                <p className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                  <Check size={14} strokeWidth={3} /> Tersimpan
                </p>
              )}
              {bankError && (
                <p className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                  <AlertCircle size={14} /> {bankError}
                </p>
              )}
            </div>
          </form>
        </section>

        <footer className="text-center text-[11px] text-gray-400 pb-4">
          Program Mitra Japan Arena Studio · Komisi terkonfirmasi setelah order dilunasi customer.
        </footer>
      </div>
    </div>
  )
}
