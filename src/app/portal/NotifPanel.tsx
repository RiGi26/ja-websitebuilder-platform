'use client'

// ============================================================
// Tab portal "Notifikasi WhatsApp" — self-service per-tenant.
// (1) Koneksi: token Fonnte sendiri (hybrid; kosong = nomor platform) + test-kirim.
// (2) Template: editor free-text per-event + chip placeholder + validasi inline
//     + live preview gaya gelembung WA (selalu koheren — anti-rusak engine).
// Server tetap gerbang akhir (validateTemplate di /api/portal/notifications).
// JA Chrome track (/ui-design): mirror PaymentPanel, token Apple existing.
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Loader2, Check, Send, Sparkles, AlertTriangle, Link2 } from 'lucide-react'
import { NOTIF_EVENTS, validateTemplate, renderTemplate, type NotifEventKey, type NotifVars } from '@/lib/notif/template'
import { normalizeWa } from '@/lib/wa-normalize'

type Status = {
  configured: boolean
  isActive: boolean
  tokenMask: string | null
  templates: Partial<Record<NotifEventKey, string>>
}

const EVENT_ORDER: NotifEventKey[] = ['order_receipt', 'order_admin']
const RECIPIENT_LABEL: Record<'buyer' | 'admin', string> = {
  buyer: 'Ke pembeli', admin: 'Ke admin (Anda)',
}
const VAR_HINT: Record<string, string> = {
  nama: 'nama pembeli', bisnis: 'nama bisnis', kode: 'kode pesanan', items: 'daftar item',
  total: 'total bayar', bayar: 'metode bayar', lacak: 'link lacak', alamat: 'alamat',
  catatan: 'catatan', tanggal: 'tanggal kirim',
}

function sampleVars(bisnis: string): NotifVars {
  return {
    nama: 'Budi Santoso', bisnis, kode: 'BT-2606-0042',
    items: 'Bakso Campur ×2, Es Teh ×1', total: '¥1.800', bayar: 'Transfer Bank',
    lacak: 'https://situsanda.com/lacak/abc123', alamat: 'Shibuya 1-2-3, Tokyo',
    catatan: 'pedas sedang', tanggal: '2026-06-25',
  }
}

const card = 'bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]'
const inp = 'w-full text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none'
const labelCls = 'text-[10px] font-bold text-gray-400 uppercase tracking-widest'

export default function NotifPanel({ businessName, phoneCc }: { businessName: string; phoneCc?: string }) {
  const [status, setStatus] = useState<Status | null>(null)
  const [loadErr, setLoadErr] = useState<string | null>(null)

  // Koneksi
  const [token, setToken] = useState('')
  const [busyConn, setBusyConn] = useState(false)
  const [connMsg, setConnMsg] = useState<string | null>(null)

  // Test-kirim
  const [testPhone, setTestPhone] = useState('')
  const [testEvent, setTestEvent] = useState<NotifEventKey>('order_receipt')
  const [busyTest, setBusyTest] = useState(false)
  const [testMsg, setTestMsg] = useState<string | null>(null)

  // Template
  const [tpl, setTpl] = useState<Record<NotifEventKey, string>>({ order_receipt: '', order_admin: '' })
  const [busyTpl, setBusyTpl] = useState(false)
  const [tplMsg, setTplMsg] = useState<string | null>(null)
  const refs = useRef<Record<NotifEventKey, HTMLTextAreaElement | null>>({ order_receipt: null, order_admin: null })

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch('/api/portal/notifications')
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'gagal memuat')
        if (!alive) return
        setStatus(json.status)
        setTpl({
          order_receipt: json.status.templates?.order_receipt ?? '',
          order_admin: json.status.templates?.order_admin ?? '',
        })
      } catch (e) { if (alive) setLoadErr((e as Error).message) }
    })()
    return () => { alive = false }
  }, [])

  const sample = sampleVars(businessName || 'Bisnis Anda')

  const insertChip = (ev: NotifEventKey, key: string) => {
    const el = refs.current[ev]
    const ins = `{${key}}`
    if (el && typeof el.selectionStart === 'number') {
      const s = el.selectionStart, e = el.selectionEnd
      const next = tpl[ev].slice(0, s) + ins + tpl[ev].slice(e)
      setTpl((p) => ({ ...p, [ev]: next }))
      requestAnimationFrame(() => { el.focus(); el.selectionStart = el.selectionEnd = s + ins.length })
    } else {
      setTpl((p) => ({ ...p, [ev]: (p[ev] ? `${p[ev]} ` : '') + ins }))
    }
  }

  const saveConn = async (extra?: { isActive?: boolean }) => {
    setBusyConn(true); setConnMsg(null)
    try {
      const body: Record<string, unknown> = { ...extra }
      if (token.trim()) body.token = token.trim()
      const res = await fetch('/api/portal/notifications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) { setConnMsg(`Gagal: ${json.error}`); return }
      setStatus(json.status); setToken(''); setConnMsg('Tersimpan.')
    } catch { setConnMsg('Error koneksi.') } finally { setBusyConn(false) }
  }

  const saveTpl = async () => {
    setBusyTpl(true); setTplMsg(null)
    try {
      const res = await fetch('/api/portal/notifications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templates: { order_receipt: tpl.order_receipt, order_admin: tpl.order_admin } }),
      })
      const json = await res.json()
      if (!res.ok) {
        if (json.error === 'template_invalid' && json.errors) {
          const first = (Object.values(json.errors)[0] as string[] | undefined)?.[0]
          setTplMsg(`Gagal: ${first ?? 'template tidak valid'}`)
        } else setTplMsg(`Gagal: ${json.error}`)
        return
      }
      setStatus(json.status); setTplMsg('Template tersimpan.')
    } catch { setTplMsg('Error koneksi.') } finally { setBusyTpl(false) }
  }

  const sendTest = async () => {
    if (!testPhone.trim()) { setTestMsg('Isi nomor tujuan dulu.'); return }
    setBusyTest(true); setTestMsg(null)
    try {
      const res = await fetch('/api/portal/notifications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test', phone: testPhone.trim(), event: testEvent }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) { setTestMsg(`Gagal kirim: ${json.error ?? 'coba lagi'}`); return }
      setTestMsg('Pesan uji terkirim — cek WhatsApp tujuan.')
    } catch { setTestMsg('Error koneksi.') } finally { setBusyTest(false) }
  }

  if (loadErr) return <div className={card}><p className="text-sm text-red-600">Gagal memuat: {loadErr}</p></div>
  if (!status) return <div className={card}><p className="flex items-center gap-2 text-sm text-gray-400"><Loader2 size={16} className="animate-spin" /> Memuat…</p></div>

  const connBadge = status.isActive
    ? { t: 'Pakai nomor sendiri (aktif)', c: 'bg-green-50 text-green-600' }
    : status.configured
      ? { t: 'Token tersimpan · nonaktif', c: 'bg-gray-100 text-gray-500' }
      : { t: 'Pakai nomor platform', c: 'bg-gray-100 text-gray-500' }

  // Pratinjau "nomor yang akan dikirim" — pakai resolusi yang SAMA dengan server
  // (route notifications memakai phone_cc tenant, fallback '62'), jadi yang dilihat
  // owner persis = target yang muncul di log Fonnte. Mencegah salah kode negara.
  const testTrimmed = testPhone.trim()
  const testResolved = testTrimmed ? normalizeWa(testTrimmed, phoneCc || '62') : ''
  const testTooShort = !!testResolved && testResolved.length < 10

  return (
    <div className="space-y-6">
      {/* ── Kartu 1: Koneksi WhatsApp ── */}
      <div className={card}>
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle size={18} className="text-apple-blue" />
          <h2 className="text-lg font-bold text-gray-900">Koneksi WhatsApp</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Secara default, notifikasi order dikirim dari <strong>nomor WhatsApp platform Japan Arena</strong> — langsung jalan, gratis.
          Mau WA keluar dari <strong>nomor bisnis Anda sendiri</strong>? Hubungkan token Fonnte Anda di bawah, lalu aktifkan.
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${connBadge.c}`}>{connBadge.t}</span>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="notif-token" className={labelCls}>
              Token Fonnte {status.configured && <span className="text-green-600 normal-case tracking-normal font-medium">(tersimpan {status.tokenMask} — isi untuk ganti)</span>}
            </label>
            <input id="notif-token" type="password" value={token} onChange={(e) => setToken(e.target.value)}
              placeholder={status.configured ? '••••••••••••' : 'Token device dari dashboard Fonnte'} className={inp} autoComplete="off" />
            <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
              Dapatkan di <span className="font-semibold">md.fonnte.com → Device → Token</span>. Nomor pengirim = nomor WhatsApp yang terhubung di device Fonnte itu.
            </p>
          </div>
        </div>

        {connMsg && <p className="text-xs mt-3 text-gray-500">{connMsg}</p>}

        <div className="flex flex-wrap gap-2 mt-5">
          <button onClick={() => saveConn()} disabled={busyConn} className="flex items-center gap-1 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[11px] font-bold uppercase hover:bg-gray-800 disabled:opacity-50">
            {busyConn ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Simpan
          </button>
          {status.configured && !status.isActive && (
            <button onClick={() => saveConn({ isActive: true })} disabled={busyConn} className="flex items-center gap-1 px-5 py-2.5 bg-apple-blue text-white rounded-xl text-[11px] font-bold uppercase hover:bg-blue-600 disabled:opacity-50">
              <Link2 size={14} /> Aktifkan nomor sendiri
            </button>
          )}
          {status.isActive && (
            <button onClick={() => saveConn({ isActive: false })} disabled={busyConn} className="px-5 py-2.5 border border-black/10 text-gray-500 rounded-xl text-[11px] font-bold uppercase hover:bg-gray-50 disabled:opacity-50">
              Nonaktifkan (balik ke platform)
            </button>
          )}
        </div>

        {/* Test-kirim */}
        <div className="mt-6 pt-6 border-t border-black/5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tes kirim</p>
          <p className="text-[13px] text-gray-500 mb-3">Kirim 1 pesan uji ke nomor WhatsApp untuk memastikan koneksi & template Anda bekerja.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input value={testPhone} onChange={(e) => setTestPhone(e.target.value)} inputMode="tel" placeholder="Nomor tujuan uji (mis. nomor Anda)" className={`${inp} sm:flex-1`} aria-label="Nomor WhatsApp tujuan uji" />
            <select value={testEvent} onChange={(e) => setTestEvent(e.target.value as NotifEventKey)} className={`${inp} sm:w-52`} aria-label="Jenis pesan uji">
              {EVENT_ORDER.map((ev) => <option key={ev} value={ev}>{NOTIF_EVENTS[ev].label}</option>)}
            </select>
            <button onClick={sendTest} disabled={busyTest} className="flex items-center justify-center gap-1 px-5 py-2.5 bg-apple-blue text-white rounded-xl text-[11px] font-bold uppercase hover:bg-blue-600 disabled:opacity-50 shrink-0">
              {busyTest ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Kirim uji
            </button>
          </div>
          {testResolved && (
            <p className="text-[12px] mt-2 text-gray-600">
              Akan dikirim ke nomor: <span className="font-mono font-semibold text-gray-800">{testResolved}</span>
              {testTooShort && <span className="text-amber-600"> — sepertinya kurang lengkap, periksa lagi.</span>}
            </p>
          )}
          <p className="text-[11px] mt-1.5 text-gray-500 leading-relaxed">
            Nomor luar negeri? Tulis kode negara di depan pakai tanda <span className="font-semibold">+</span> — mis. <span className="font-mono">+8190…</span> untuk Jepang, <span className="font-mono">+62812…</span> untuk Indonesia.
          </p>
          {testMsg && <p className="text-xs mt-2.5 text-gray-500">{testMsg}</p>}
        </div>
      </div>

      {/* ── Kartu 2: Template Pesan ── */}
      <div className={card}>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Template Pesan</h2>
        <p className="text-sm text-gray-500 mb-5">
          Tulis isi pesan WhatsApp dengan gaya Anda sendiri. <strong>Kosongkan untuk pakai template bawaan.</strong>{' '}
          Sisipkan data pesanan lewat tombol kuning di bawah tiap kotak — preview di kanan menunjukkan hasil persis yang diterima.
        </p>

        <div className="space-y-8">
          {EVENT_ORDER.map((ev) => {
            const def = NOTIF_EVENTS[ev]
            const text = tpl[ev]
            const check = text.trim() ? validateTemplate(ev, text) : null
            const invalid = !!check && !check.ok
            const preview = renderTemplate(ev, text, sample)
            return (
              <div key={ev}>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-sm font-bold text-gray-900">{def.label}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-apple-blue">{RECIPIENT_LABEL[def.recipient]}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Editor */}
                  <div>
                    <textarea
                      ref={(el) => { refs.current[ev] = el }}
                      value={text}
                      onChange={(e) => setTpl((p) => ({ ...p, [ev]: e.target.value }))}
                      rows={9}
                      placeholder={`Kosongkan = pakai template bawaan.\n\nContoh:\n${def.default}`}
                      className="w-full text-sm rounded-xl border border-black/10 p-3 focus:border-apple-blue focus:outline-none font-mono leading-relaxed resize-y"
                      aria-label={`Template ${def.label}`}
                    />
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <button type="button" onClick={() => setTpl((p) => ({ ...p, [ev]: def.default }))}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-apple-blue bg-blue-50 hover:bg-blue-100 transition-colors">
                        <Sparkles size={12} /> Mulai dari contoh
                      </button>
                      <span className="w-px h-4 bg-black/10 mx-0.5" />
                      {def.vars.map((v) => (
                        <button key={v} type="button" onClick={() => insertChip(ev, v)} title={VAR_HINT[v] ?? v}
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-gray-600 bg-gray-100 hover:bg-apple-blue hover:text-white transition-colors">
                          {`{${v}}`}
                        </button>
                      ))}
                    </div>
                    {check && check.errors.map((er, i) => (
                      <p key={`e${i}`} className="flex items-start gap-1.5 text-[12px] text-red-600 mt-2"><AlertTriangle size={13} className="mt-0.5 shrink-0" />{er}</p>
                    ))}
                    {check && check.ok && check.warnings.map((w, i) => (
                      <p key={`w${i}`} className="text-[12px] text-amber-600 mt-2">{w}</p>
                    ))}
                  </div>

                  {/* Live preview — gelembung WA */}
                  <div>
                    <p className={`${labelCls} mb-2`}>Preview WhatsApp</p>
                    <div className="rounded-2xl bg-[#ECE5DD] p-3.5">
                      <div className="rounded-xl rounded-tl-sm bg-[#DCF8C6] px-3.5 py-2.5 shadow-sm max-w-[92%]">
                        <p className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-gray-800">{preview}</p>
                      </div>
                    </div>
                    {invalid && (
                      <p className="text-[11px] text-amber-600 mt-2 leading-relaxed">
                        Template belum valid → preview & pengiriman <strong>pakai bawaan</strong> sampai diperbaiki. Pesan tak akan pernah rusak.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {tplMsg && <p className="text-xs mt-4 text-gray-500">{tplMsg}</p>}

        <div className="mt-5">
          <button onClick={saveTpl} disabled={busyTpl} className="flex items-center gap-1 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[11px] font-bold uppercase hover:bg-gray-800 disabled:opacity-50">
            {busyTpl ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Simpan Template
          </button>
        </div>
      </div>
    </div>
  )
}
