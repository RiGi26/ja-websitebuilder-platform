'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Copy, Check, Loader2, AlertCircle, UserPlus, Banknote,
  ShieldOff, ShieldCheck, KeyRound, XCircle, CheckCircle2,
} from 'lucide-react'

export interface AdminReferrer {
  id: string
  nama: string
  email: string
  nomorWa: string
  commissionPercent: number
  buyerDiscountPercent: number
  status: 'active' | 'suspended'
  createdAt: string | null
  code: string | null
  stats: { orders: number; pendingRp: number; payableRp: number; paidRp: number }
}

export interface AdminPayout {
  id: string
  amount: number
  status: 'requested' | 'paid' | 'rejected'
  bankLabel: string
  requestedAt: string | null
  paidAt: string | null
  adminNote: string | null
  referrerName: string
}

export interface AdminEarning {
  id: string
  amount: number
  orderTotal: number
  pct: number
  status: 'pending' | 'confirmed' | 'paid' | 'void'
  claimed: boolean
  createdAt: string | null
  referrerName: string
  displayId: string
  customerName: string
}

const rp = (n: number) => `Rp ${Math.round(n).toLocaleString('id-ID')}`
const tgl = (s: string | null) =>
  s ? new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

const EARNING_BADGE: Record<AdminEarning['status'], { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 border-amber-100' },
  confirmed: { label: 'Confirmed', cls: 'bg-green-50 text-green-700 border-green-100' },
  paid: { label: 'Paid', cls: 'bg-blue-50 text-[#0071E3] border-blue-100' },
  void: { label: 'Void', cls: 'bg-gray-100 text-gray-500 border-gray-200' },
}

const PAYOUT_BADGE: Record<AdminPayout['status'], { label: string; cls: string }> = {
  requested: { label: 'Menunggu Transfer', cls: 'bg-amber-50 text-amber-700 border-amber-100' },
  paid: { label: 'Dibayar', cls: 'bg-green-50 text-green-700 border-green-100' },
  rejected: { label: 'Ditolak', cls: 'bg-red-50 text-red-600 border-red-100' },
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-apple-blue px-3 py-1 bg-blue-50 rounded-lg inline-block mb-4">
      {children}
    </p>
  )
}

// Kredensial mitra — tampil SEKALI setelah create/reset. Salin per-field +
// blok siap-kirim WA (URL login /mitra/login, bukan /portal).
function MitraCredentialBox({ email, password, code, refLink }: {
  email: string; password: string; code?: string; refLink?: string
}) {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (key: string, text: string) => {
    try { await navigator.clipboard.writeText(text) } catch { return }
    setCopied(key)
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000)
  }
  const allText = () => [
    `Login Dashboard Mitra Japan Arena:`,
    `URL: ${location.origin}/mitra/login`,
    `Email: ${email}`,
    `Password: ${password}`,
    ...(code ? [``, `Kode referral: ${code}`, `Link: ${refLink ?? `${location.origin}/r/${code}`}`] : []),
  ].join('\n')

  const row = (key: string, label: string, value: string) => (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <span className="text-gray-400 text-[10px] uppercase tracking-widest font-sans">{label}</span>
        <p className="truncate">{value}</p>
      </div>
      <button onClick={() => copy(key, value)} title={`Salin ${label}`} aria-label={`Salin ${label}`}
        className="shrink-0 p-2 rounded-lg hover:bg-white text-gray-500 border border-black/10 transition-colors">
        {copied === key ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
      </button>
    </div>
  )

  return (
    <div className="mt-4">
      <div className="bg-gray-50 rounded-2xl p-4 border border-black/5 space-y-3 text-sm font-mono">
        {row('email', 'Email', email)}
        <div className="border-t border-black/5 pt-3">{row('password', 'Password', password)}</div>
        {code && <div className="border-t border-black/5 pt-3">{row('code', 'Kode', code)}</div>}
      </div>
      <button onClick={() => copy('all', allText())}
        className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl text-[11px] font-bold uppercase hover:bg-gray-800">
        {copied === 'all' ? <Check size={14} /> : <Copy size={14} />} {copied === 'all' ? 'Tersalin' : 'Salin Semua'}
      </button>
      <p className="text-[11px] text-gray-400 mt-2">Password hanya tampil sekali — salin sekarang. Kredensial juga dikirim otomatis via WA + email.</p>
    </div>
  )
}

export default function AdminMitraClient({ referrers, payouts, earnings }: {
  referrers: AdminReferrer[]
  payouts: AdminPayout[]
  earnings: AdminEarning[]
}) {
  const router = useRouter()
  const [form, setForm] = useState({ nama: '', email: '', wa: '', komisi: '10', diskon: '5' })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createdCred, setCreatedCred] = useState<{ email: string; password: string; code: string; refLink: string } | null>(null)
  const [resetCred, setResetCred] = useState<{ id: string; email: string; password: string } | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({})

  const createReferrer = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setCreateError('')
    setCreatedCred(null)
    try {
      const res = await fetch('/api/admin/referrers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: form.nama,
          email: form.email,
          nomor_wa: form.wa,
          commission_percent: Number(form.komisi) || 10,
          buyer_discount_percent: Number(form.diskon) || 5,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Gagal membuat mitra.')
      setCreatedCred(data.referrer)
      setForm({ nama: '', email: '', wa: '', komisi: '10', diskon: '5' })
      router.refresh()
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Gagal membuat mitra.')
    } finally {
      setCreating(false)
    }
  }

  const patch = async (url: string, body: Record<string, unknown>, key: string) => {
    setBusy(key)
    setActionError('')
    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Aksi gagal.')
      router.refresh()
      return data
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Aksi gagal.')
      return null
    } finally {
      setBusy(null)
    }
  }

  const resetPassword = async (r: AdminReferrer) => {
    const data = await patch('/api/admin/referrers', { id: r.id, action: 'reset_password' }, `reset:${r.id}`)
    if (data?.account) setResetCred({ id: r.id, email: data.account.email, password: data.account.password })
  }

  const inputCls =
    'w-full px-4 py-3 bg-gray-50 border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:bg-white transition-all'
  const requested = payouts.filter((p) => p.status === 'requested')
  const payoutHistory = payouts.filter((p) => p.status !== 'requested')

  return (
    <div className="space-y-12">
      {actionError && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100">
          <AlertCircle size={16} /> {actionError}
        </div>
      )}

      {/* ── Buat mitra baru ─────────────────────────────────────────── */}
      <section>
        <SectionLabel>Tambah Mitra</SectionLabel>
        <div className="bg-white rounded-[32px] p-6 sm:p-8 apple-shadow border border-black/[0.03]">
          <form onSubmit={createReferrer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="m-nama" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama</label>
              <input id="m-nama" value={form.nama} onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                placeholder="Budi Santoso" required className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="m-email" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <input id="m-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="budi@email.com" required className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="m-wa" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nomor WA</label>
              <input id="m-wa" value={form.wa} onChange={(e) => setForm((f) => ({ ...f, wa: e.target.value }))}
                placeholder="08123456789" required className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="m-komisi" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Komisi %</label>
              <input id="m-komisi" type="number" min="0" max="50" step="0.5" value={form.komisi}
                onChange={(e) => setForm((f) => ({ ...f, komisi: e.target.value }))} required className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="m-diskon" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Diskon Buyer %</label>
              <input id="m-diskon" type="number" min="0" max="50" step="0.5" value={form.diskon}
                onChange={(e) => setForm((f) => ({ ...f, diskon: e.target.value }))} required className={inputCls} />
            </div>
            <div className="md:col-span-2 lg:col-span-5">
              <button type="submit" disabled={creating}
                className="flex items-center gap-2 px-7 h-12 bg-apple-blue hover:bg-blue-600 text-white text-sm font-bold rounded-2xl transition-all shadow-lg disabled:opacity-50 active:scale-[0.96]">
                {creating ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
                Buat Akun Mitra
              </button>
            </div>
          </form>
          {createError && (
            <p className="flex items-center gap-1.5 text-xs font-bold text-red-600 mt-4">
              <AlertCircle size={14} /> {createError}
            </p>
          )}
          {createdCred && (
            <MitraCredentialBox
              email={createdCred.email} password={createdCred.password}
              code={createdCred.code} refLink={createdCred.refLink}
            />
          )}
        </div>
      </section>

      {/* ── Antrean pencairan ───────────────────────────────────────── */}
      <section>
        <SectionLabel>Antrean Pencairan ({requested.length})</SectionLabel>
        <div className="bg-white rounded-[32px] p-6 sm:p-8 apple-shadow border border-black/[0.03]">
          {requested.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-6">Tidak ada pengajuan pencairan.</p>
          ) : (
            <div className="space-y-4">
              {requested.map((p) => (
                <div key={p.id} className="border border-amber-100 bg-amber-50/40 rounded-2xl p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900">{p.referrerName} · <span className="tabular-nums">{rp(p.amount)}</span></p>
                      <p className="text-xs text-gray-500 mt-1">{p.bankLabel}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Diajukan {tgl(p.requestedAt)}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                      <input
                        value={noteDraft[p.id] ?? ''}
                        onChange={(e) => setNoteDraft((d) => ({ ...d, [p.id]: e.target.value }))}
                        placeholder="Catatan / no. ref transfer (opsional)"
                        className="px-3 py-2 bg-white border border-black/5 rounded-xl text-xs w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-apple-blue/20"
                      />
                      <button
                        onClick={() => patch('/api/admin/referral-payouts', { id: p.id, action: 'paid', admin_note: noteDraft[p.id] || null }, `pay:${p.id}`)}
                        disabled={busy === `pay:${p.id}`}
                        className="flex items-center justify-center gap-1.5 px-4 h-10 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 active:scale-[0.96]">
                        {busy === `pay:${p.id}` ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                        Tandai Dibayar
                      </button>
                      <button
                        onClick={() => patch('/api/admin/referral-payouts', { id: p.id, action: 'rejected', admin_note: noteDraft[p.id] || null }, `rej:${p.id}`)}
                        disabled={busy === `rej:${p.id}`}
                        className="flex items-center justify-center gap-1.5 px-4 h-10 bg-white border border-black/10 text-gray-600 hover:text-red-600 text-xs font-bold rounded-xl transition-all disabled:opacity-50 active:scale-[0.96]">
                        <XCircle size={13} /> Tolak
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {payoutHistory.length > 0 && (
            <div className="mt-6 pt-6 border-t border-black/[0.05] space-y-2">
              {payoutHistory.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 text-sm py-2">
                  <div className="min-w-0">
                    <span className="font-semibold text-gray-700">{p.referrerName}</span>
                    <span className="text-gray-500"> · {rp(p.amount)} · {tgl(p.status === 'paid' ? p.paidAt : p.requestedAt)}</span>
                    {p.adminNote && <span className="text-gray-400"> · {p.adminNote}</span>}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 ${PAYOUT_BADGE[p.status].cls}`}>
                    {PAYOUT_BADGE[p.status].label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Daftar mitra ────────────────────────────────────────────── */}
      <section>
        <SectionLabel>Daftar Mitra ({referrers.length})</SectionLabel>
        <div className="bg-white rounded-[32px] p-4 sm:p-6 apple-shadow border border-black/[0.03]">
          {referrers.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-6">Belum ada mitra. Buat akun mitra pertama di atas.</p>
          ) : (
            <div className="divide-y divide-black/[0.05]">
              {referrers.map((r) => (
                <div key={r.id} className="py-5 px-2">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <p className="font-bold text-gray-900">{r.nama}</p>
                        {r.code && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#0071E3] border border-blue-100">
                            {r.code}
                          </span>
                        )}
                        {r.status === 'suspended' && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                            Suspended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {r.email} · {r.nomorWa} · komisi {r.commissionPercent}% · diskon buyer {r.buyerDiscountPercent}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1 tabular-nums">
                        {r.stats.orders} order · pending {rp(r.stats.pendingRp)} · payable{' '}
                        <span className="font-bold text-green-600">{rp(r.stats.payableRp)}</span> · dibayar {rp(r.stats.paidRp)}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => resetPassword(r)}
                        disabled={busy === `reset:${r.id}`}
                        title="Reset password" aria-label={`Reset password ${r.nama}`}
                        className="flex items-center gap-1.5 px-3.5 h-10 bg-gray-50 border border-black/5 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50">
                        {busy === `reset:${r.id}` ? <Loader2 size={13} className="animate-spin" /> : <KeyRound size={13} />}
                        Reset
                      </button>
                      <button
                        onClick={() => patch('/api/admin/referrers', { id: r.id, action: r.status === 'active' ? 'suspend' : 'activate' }, `sus:${r.id}`)}
                        disabled={busy === `sus:${r.id}`}
                        className={`flex items-center gap-1.5 px-3.5 h-10 text-xs font-bold rounded-xl border transition-all disabled:opacity-50 ${
                          r.status === 'active'
                            ? 'bg-gray-50 border-black/5 text-gray-600 hover:text-red-600'
                            : 'bg-green-50 border-green-100 text-green-700'
                        }`}>
                        {busy === `sus:${r.id}` ? <Loader2 size={13} className="animate-spin" />
                          : r.status === 'active' ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                        {r.status === 'active' ? 'Suspend' : 'Aktifkan'}
                      </button>
                    </div>
                  </div>
                  {resetCred?.id === r.id && (
                    <MitraCredentialBox email={resetCred.email} password={resetCred.password} code={r.code ?? undefined} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Semua komisi ────────────────────────────────────────────── */}
      <section>
        <SectionLabel>Semua Komisi ({earnings.length})</SectionLabel>
        <div className="bg-white rounded-[32px] p-6 sm:p-8 apple-shadow border border-black/[0.03]">
          {earnings.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-6">Belum ada komisi tercatat.</p>
          ) : (
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-black/[0.05]">
                    <th className="py-3 pr-4 font-bold">Tanggal</th>
                    <th className="py-3 pr-4 font-bold">Mitra</th>
                    <th className="py-3 pr-4 font-bold">Order</th>
                    <th className="py-3 pr-4 font-bold">Nilai</th>
                    <th className="py-3 pr-4 font-bold">Komisi</th>
                    <th className="py-3 pr-4 font-bold">Status</th>
                    <th className="py-3 font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((e) => (
                    <tr key={e.id} className="border-b border-black/[0.03] last:border-0">
                      <td className="py-3.5 pr-4 text-gray-500 whitespace-nowrap">{tgl(e.createdAt)}</td>
                      <td className="py-3.5 pr-4 font-semibold text-gray-900 whitespace-nowrap">{e.referrerName}</td>
                      <td className="py-3.5 pr-4">
                        <p className="font-bold text-gray-900 whitespace-nowrap">{e.displayId}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[180px]">{e.customerName}</p>
                      </td>
                      <td className="py-3.5 pr-4 text-gray-600 tabular-nums whitespace-nowrap">{rp(e.orderTotal)}</td>
                      <td className="py-3.5 pr-4 font-bold text-gray-900 tabular-nums whitespace-nowrap">
                        {rp(e.amount)} <span className="text-[10px] text-gray-400 font-medium">({e.pct}%)</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border whitespace-nowrap ${EARNING_BADGE[e.status].cls}`}>
                          {EARNING_BADGE[e.status].label}{e.claimed && e.status === 'confirmed' ? ' · klaim' : ''}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex gap-1.5">
                          {e.status === 'pending' && (
                            <button
                              onClick={() => patch('/api/admin/referral-earnings', { id: e.id, action: 'confirm' }, `conf:${e.id}`)}
                              disabled={busy === `conf:${e.id}`}
                              title="Konfirmasi (lunas manual)"
                              className="px-3 h-8 bg-green-50 border border-green-100 text-green-700 text-[11px] font-bold rounded-lg hover:bg-green-100 transition-all disabled:opacity-50">
                              {busy === `conf:${e.id}` ? <Loader2 size={12} className="animate-spin" /> : 'Konfirmasi'}
                            </button>
                          )}
                          {(e.status === 'pending' || (e.status === 'confirmed' && !e.claimed)) && (
                            <button
                              onClick={() => patch('/api/admin/referral-earnings', { id: e.id, action: 'void' }, `void:${e.id}`)}
                              disabled={busy === `void:${e.id}`}
                              title="Void komisi"
                              className="px-3 h-8 bg-gray-50 border border-black/5 text-gray-500 text-[11px] font-bold rounded-lg hover:text-red-600 transition-all disabled:opacity-50">
                              {busy === `void:${e.id}` ? <Loader2 size={12} className="animate-spin" /> : 'Void'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-4">
            <Banknote size={12} /> Komisi pending terkonfirmasi otomatis saat order lunas via Midtrans; tombol Konfirmasi untuk pelunasan manual di luar sistem.
          </p>
        </div>
      </section>
    </div>
  )
}
