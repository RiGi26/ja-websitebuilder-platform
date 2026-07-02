'use client'
import { useState, useEffect, useCallback } from 'react'

// ============================================================
// B5 (Kamy) — Flow booking NATIVE realtime di dalam situs klinik-fisio.
// Replika alur booking Portal (cabang→dokter→tanggal→slot→data→konfirmasi→sukses)
// tapi bertema klinik-fisio (namespace kfb-, pakai var --kf-* warisan .kf-root).
// Semua fetch lewat proxy server WB (/api/booking-proxy/{slug}/…) → tanpa CORS.
// Slot realtime: available=false (terisi/kuota penuh/lewat) → tombol disabled.
// ============================================================

type Doctor = { id: string; full_name: string; specialty: string; location_id: string | null }
type Branch = { id: string; name: string; address: string | null }
type Slot = { time: string; available: boolean }
type Form = { no_hp: string; nama_lengkap: string; tanggal_lahir: string; jenis_kelamin: string; keluhan: string }

function getDates() {
  const out: { date: string; dayName: string; dayNum: number; month: string }[] = []
  const base = new Date(); base.setDate(base.getDate() + 1)
  let n = 0
  while (n < 14) {
    if (base.getDay() !== 0) {
      out.push({
        date: base.toISOString().split('T')[0],
        dayName: new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(base),
        dayNum: base.getDate(),
        month: new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(base),
      })
      n++
    }
    base.setDate(base.getDate() + 1)
  }
  return out
}
function fmtDate(s: string) {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(s + 'T00:00:00'))
}

const CSS = `
.kfb{max-width:560px;margin:0 auto;background:var(--kf-surface);border:1px solid var(--kf-line);border-radius:24px;box-shadow:0 24px 56px -30px var(--kf-shadowDeep);overflow:hidden;font-family:inherit}
.kfb-prog{display:flex;align-items:center;gap:.4rem;padding:1.1rem 1.4rem 0}
.kfb-prog-bar{height:6px;border-radius:999px;flex:1;background:var(--kf-line);transition:background .3s}
.kfb-prog-bar.on{background:var(--kf-accent)}
.kfb-prog-n{font-size:.72rem;font-weight:700;color:var(--kf-muted);margin-left:.4rem;flex:none;font-variant-numeric:tabular-nums}
.kfb-body{padding:1.4rem}
.kfb-h{font-family:inherit;font-size:1.15rem;font-weight:800;color:var(--kf-ink);margin-bottom:.3rem}
.kfb-sub{font-size:.86rem;color:var(--kf-muted);margin-bottom:1.1rem}
.kfb-back{display:inline-flex;align-items:center;gap:.3rem;font-size:.82rem;font-weight:700;color:var(--kf-muted);background:none;border:none;cursor:pointer;margin-bottom:.9rem;padding:0}
.kfb-back:hover{color:var(--kf-ink)}
.kfb-opts{display:flex;flex-direction:column;gap:.6rem}
.kfb-opt{display:flex;align-items:center;gap:.9rem;width:100%;text-align:left;padding:.95rem 1rem;border-radius:16px;border:2px solid var(--kf-line);background:var(--kf-surface);cursor:pointer;transition:border-color .2s,background .2s}
.kfb-opt:hover{border-color:var(--kf-accentLight)}
.kfb-opt.sel{border-color:var(--kf-accent);background:var(--kf-bg2)}
.kfb-opt-ic{width:44px;height:44px;border-radius:13px;flex:none;display:grid;place-items:center;color:#fff;font-weight:800;font-family:inherit;background:linear-gradient(135deg,var(--kf-accentLight),var(--kf-accent))}
.kfb-opt-nm{font-weight:700;color:var(--kf-ink);font-size:.96rem}
.kfb-opt-meta{font-size:.8rem;color:var(--kf-muted)}
.kfb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.55rem}
.kfb-date{padding:.7rem .3rem;border-radius:14px;border:2px solid var(--kf-line);background:var(--kf-surface);color:var(--kf-ink);cursor:pointer;text-align:center;transition:all .2s}
.kfb-date:hover{border-color:var(--kf-accentLight)}
.kfb-date.sel{border-color:var(--kf-accent);background:var(--kf-accent);color:#fff}
.kfb-date .d1{font-size:.68rem;font-weight:700;opacity:.75}
.kfb-date .d2{font-size:1.25rem;font-weight:800;line-height:1.1}
.kfb-slot{padding:.7rem .2rem;border-radius:13px;border:2px solid var(--kf-line);background:var(--kf-surface);color:var(--kf-ink);font-weight:700;font-size:.86rem;cursor:pointer;transition:all .2s;font-variant-numeric:tabular-nums}
.kfb-slot:hover:not(:disabled){border-color:var(--kf-accentLight)}
.kfb-slot.sel{border-color:var(--kf-accent);background:var(--kf-accent);color:#fff}
.kfb-slot:disabled{background:var(--kf-bg2);color:var(--kf-muted);opacity:.5;cursor:not-allowed;text-decoration:line-through}
.kfb-field{margin-bottom:.9rem}
.kfb-label{display:block;font-size:.8rem;font-weight:700;color:var(--kf-inkDim);margin-bottom:.4rem}
.kfb-input{width:100%;padding:.8rem 1rem;border:1px solid var(--kf-line);border-radius:13px;font-size:.95rem;background:var(--kf-surface);color:var(--kf-ink);font-family:inherit}
.kfb-input:focus{outline:2px solid var(--kf-accentLight);outline-offset:-1px;border-color:transparent}
.kfb-row{display:grid;grid-template-columns:1fr 1fr;gap:.7rem}
.kfb-foot{padding:1.1rem 1.4rem 1.4rem;border-top:1px solid var(--kf-line);background:var(--kf-surface)}
.kfb-btn{width:100%;padding:.95rem;border:none;border-radius:16px;background:var(--kf-pop);color:var(--kf-ink);font-family:inherit;font-weight:800;font-size:.98rem;cursor:pointer;transition:background .2s,transform .15s;display:flex;align-items:center;justify-content:center;gap:.5rem}
.kfb-btn:hover:not(:disabled){background:var(--kf-popDeep)}
.kfb-btn:active:not(:disabled){transform:scale(.98)}
.kfb-btn:disabled{opacity:.4;cursor:not-allowed}
.kfb-note{font-size:.72rem;color:var(--kf-muted);text-align:center;margin-top:.7rem;line-height:1.5}
.kfb-review{background:var(--kf-bg2);border-radius:16px;padding:1.1rem;display:flex;flex-direction:column;gap:.6rem}
.kfb-rev-row{display:flex;gap:.8rem;font-size:.88rem}
.kfb-rev-row .k{color:var(--kf-muted);width:82px;flex:none}
.kfb-rev-row .v{color:var(--kf-ink);font-weight:700;flex:1}
.kfb-center{text-align:center;padding:2rem 1.4rem}
.kfb-ok{width:64px;height:64px;border-radius:50%;background:var(--kf-bg2);color:var(--kf-accent);display:grid;place-items:center;margin:0 auto 1rem}
.kfb-ok svg{width:32px;height:32px}
.kfb-code{display:inline-block;font-family:inherit;font-weight:800;font-size:1.15rem;letter-spacing:.05em;color:var(--kf-accentDeep);background:var(--kf-bg2);padding:.5rem 1rem;border-radius:12px;margin:.6rem 0}
.kfb-spin{width:18px;height:18px;border:2px solid rgba(0,0,0,.25);border-top-color:currentColor;border-radius:50%;animation:kfbspin .7s linear infinite;display:inline-block}
@keyframes kfbspin{to{transform:rotate(360deg)}}
.kfb-empty{text-align:center;color:var(--kf-muted);font-size:.9rem;padding:1.5rem 0}
@media(max-width:560px){.kfb-grid{grid-template-columns:repeat(3,1fr)}.kfb-row{grid-template-columns:1fr}}
`

export default function KlinikFisioBooking({ slug }: { slug: string }) {
  const api = (action: string) => `/api/booking-proxy/${slug}/${action}`

  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  const [selBranch, setSelBranch] = useState<Branch | null>(null)
  const [selDoctor, setSelDoctor] = useState<Doctor | null>(null)
  const [selDate, setSelDate] = useState('')
  const [selTime, setSelTime] = useState('')
  const [form, setForm] = useState<Form>({ no_hp: '', nama_lengkap: '', tanggal_lahir: '', jenis_kelamin: '', keluhan: '' })
  const [existing, setExisting] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [done, setDone] = useState<{ code: string; doctor: string; date: string; time: string } | null>(null)

  const dates = getDates()
  const multiBranch = branches.length > 1
  const stepKeys = multiBranch ? ['branch', 'doctor', 'date', 'time', 'data', 'confirm'] : ['doctor', 'date', 'time', 'data', 'confirm']
  const TOTAL = stepKeys.length
  const key = stepKeys[step - 1]
  const visibleDoctors = multiBranch && selBranch ? doctors.filter(d => d.location_id === selBranch.id) : doctors

  useEffect(() => {
    fetch(api('info')).then(r => r.json()).then(d => {
      if (d.error) setErr(d.error)
      else { setDoctors(d.doctors ?? []); setBranches(d.locations ?? []) }
    }).catch(() => setErr('Gagal memuat data booking')).finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const loadSlots = useCallback(async () => {
    if (!selDoctor || !selDate) return
    setSlotsLoading(true)
    try {
      const r = await fetch(api('slots') + `?doctor_id=${selDoctor.id}&date=${selDate}`)
      const d = await r.json() as { slots?: Slot[] }
      setSlots(d.slots ?? [])
    } catch { setSlots([]) }
    setSlotsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selDoctor, selDate, slug])
  useEffect(() => { loadSlots() }, [loadSlots])

  const checkPatient = useCallback(async (phone: string) => {
    if (phone.length < 9) { setExisting(null); return }
    setChecking(true)
    try {
      const r = await fetch(api('check-patient') + `?phone=${encodeURIComponent(phone)}`)
      const d = await r.json() as { found?: boolean; name?: string }
      if (d.found && d.name) { setExisting(d.name); setForm(f => ({ ...f, nama_lengkap: d.name! })) }
      else setExisting(null)
    } catch { /* ignore */ }
    setChecking(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])
  useEffect(() => {
    const t = setTimeout(() => checkPatient(form.no_hp), 600)
    return () => clearTimeout(t)
  }, [form.no_hp, checkPatient])

  async function submit() {
    if (!selDoctor) return
    setSubmitting(true)
    try {
      const r = await fetch(api('submit'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor_id: selDoctor.id, date: selDate, time: selTime, ...form }),
      })
      const d = await r.json() as { booking_code?: string; doctor_name?: string; date?: string; time?: string; error?: string }
      if (r.ok && d.booking_code) setDone({ code: d.booking_code, doctor: d.doctor_name ?? selDoctor.full_name, date: d.date ?? selDate, time: d.time ?? selTime })
      else { setErr(d.error ?? 'Booking gagal, coba lagi'); setSubmitting(false) }
    } catch { setErr('Booking gagal, coba lagi'); setSubmitting(false) }
  }

  const prog = (
    <div className="kfb-prog">
      {Array.from({ length: TOTAL }, (_, i) => <div key={i} className={`kfb-prog-bar${i + 1 <= step ? ' on' : ''}`} />)}
      <span className="kfb-prog-n">{step}/{TOTAL}</span>
    </div>
  )
  const back = step > 1 && !done && (
    <button className="kfb-back" onClick={() => setStep(s => s - 1)}>‹ Kembali</button>
  )

  // ── Success ──
  if (done) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="kfb">
        <div className="kfb-center">
          <div className="kfb-ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 5 5L20 7" /></svg></div>
          <div className="kfb-h" style={{ marginBottom: '.2rem' }}>Booking berhasil!</div>
          <p className="kfb-sub">Kode booking kamu:</p>
          <div className="kfb-code">{done.code}</div>
          <div className="kfb-review" style={{ textAlign: 'left', marginTop: '.6rem' }}>
            <div className="kfb-rev-row"><span className="k">Dokter</span><span className="v">dr. {done.doctor}</span></div>
            <div className="kfb-rev-row"><span className="k">Tanggal</span><span className="v">{fmtDate(done.date)}</span></div>
            <div className="kfb-rev-row"><span className="k">Jam</span><span className="v">{done.time} WIB</span></div>
          </div>
          <p className="kfb-note">Kode & detail juga dikirim via WhatsApp. Tunjukkan kode ini saat tiba di klinik.</p>
        </div>
      </div>
    </>
  )

  if (loading) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="kfb"><div className="kfb-center"><span className="kfb-spin" style={{ borderTopColor: 'var(--kf-accent)' }} /></div></div>
    </>
  )
  if (err && doctors.length === 0) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="kfb"><div className="kfb-empty">{err}</div></div>
    </>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="kfb">
        {prog}
        <div className="kfb-body">
          {back}

          {key === 'branch' && (
            <>
              <div className="kfb-h">Pilih Cabang</div>
              <div className="kfb-opts">
                {branches.map(b => (
                  <button key={b.id} className={`kfb-opt${selBranch?.id === b.id ? ' sel' : ''}`}
                    onClick={() => { setSelBranch(b); if (selBranch?.id !== b.id) setSelDoctor(null) }}>
                    <span className="kfb-opt-ic"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg></span>
                    <span><span className="kfb-opt-nm">{b.name}</span>{b.address && <span className="kfb-opt-meta" style={{ display: 'block' }}>{b.address}</span>}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {key === 'doctor' && (
            <>
              <div className="kfb-h">Pilih Terapis</div>
              {visibleDoctors.length === 0 ? <div className="kfb-empty">Tidak ada terapis tersedia{multiBranch ? ' di cabang ini' : ''}.</div> : (
                <div className="kfb-opts">
                  {visibleDoctors.map(d => (
                    <button key={d.id} className={`kfb-opt${selDoctor?.id === d.id ? ' sel' : ''}`} onClick={() => setSelDoctor(d)}>
                      <span className="kfb-opt-ic">{d.full_name.split(' ').filter(w => !/^dr\.?$/i.test(w)).map(w => w[0]).slice(0, 2).join('')}</span>
                      <span><span className="kfb-opt-nm">dr. {d.full_name}</span><span className="kfb-opt-meta" style={{ display: 'block' }}>{d.specialty}</span></span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {key === 'date' && (
            <>
              <div className="kfb-h">Pilih Tanggal</div>
              <div className="kfb-grid">
                {dates.map(d => (
                  <button key={d.date} className={`kfb-date${selDate === d.date ? ' sel' : ''}`} onClick={() => { setSelDate(d.date); setSelTime('') }}>
                    <div className="d1">{d.dayName}</div><div className="d2">{d.dayNum}</div><div className="d1">{d.month}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {key === 'time' && (
            <>
              <div className="kfb-h">Pilih Jam</div>
              {selDate && <p className="kfb-sub">{fmtDate(selDate)}</p>}
              {slotsLoading ? <div className="kfb-empty"><span className="kfb-spin" style={{ borderTopColor: 'var(--kf-accent)' }} /></div>
                : slots.length === 0 ? <div className="kfb-empty">Tidak ada jam tersedia di tanggal ini.</div>
                : <div className="kfb-grid">
                    {slots.map(s => (
                      <button key={s.time} disabled={!s.available} className={`kfb-slot${selTime === s.time ? ' sel' : ''}`} onClick={() => setSelTime(s.time)}>{s.time}</button>
                    ))}
                  </div>}
            </>
          )}

          {key === 'data' && (
            <>
              <div className="kfb-h">Data Diri</div>
              <div className="kfb-field">
                <label className="kfb-label">No. HP / WhatsApp *</label>
                <input className="kfb-input" type="tel" value={form.no_hp} placeholder="08xxxxxxxxxx" onChange={e => setForm(f => ({ ...f, no_hp: e.target.value }))} />
                {checking && <p className="kfb-note" style={{ textAlign: 'left' }}>Mengecek…</p>}
                {existing && <p className="kfb-note" style={{ textAlign: 'left', color: 'var(--kf-accentDeep)' }}>✓ Pasien ditemukan: {existing}</p>}
              </div>
              <div className="kfb-field">
                <label className="kfb-label">Nama Lengkap *</label>
                <input className="kfb-input" value={form.nama_lengkap} placeholder="Nama sesuai identitas" onChange={e => setForm(f => ({ ...f, nama_lengkap: e.target.value }))} />
              </div>
              {!existing && (
                <div className="kfb-row">
                  <div className="kfb-field">
                    <label className="kfb-label">Tanggal Lahir</label>
                    <input className="kfb-input" type="date" value={form.tanggal_lahir} onChange={e => setForm(f => ({ ...f, tanggal_lahir: e.target.value }))} />
                  </div>
                  <div className="kfb-field">
                    <label className="kfb-label">Jenis Kelamin</label>
                    <select className="kfb-input" value={form.jenis_kelamin} onChange={e => setForm(f => ({ ...f, jenis_kelamin: e.target.value }))}>
                      <option value="">Pilih…</option><option value="male">Laki-laki</option><option value="female">Perempuan</option>
                    </select>
                  </div>
                </div>
              )}
              <div className="kfb-field">
                <label className="kfb-label">Keluhan Utama *</label>
                <textarea className="kfb-input" rows={3} style={{ resize: 'none' }} value={form.keluhan} placeholder="Ceritakan keluhanmu…" onChange={e => setForm(f => ({ ...f, keluhan: e.target.value }))} />
              </div>
            </>
          )}

          {key === 'confirm' && (
            <>
              <div className="kfb-h">Konfirmasi Booking</div>
              <div className="kfb-review">
                {selBranch && <div className="kfb-rev-row"><span className="k">Cabang</span><span className="v">{selBranch.name}</span></div>}
                <div className="kfb-rev-row"><span className="k">Terapis</span><span className="v">dr. {selDoctor?.full_name}</span></div>
                <div className="kfb-rev-row"><span className="k">Tanggal</span><span className="v">{fmtDate(selDate)}</span></div>
                <div className="kfb-rev-row"><span className="k">Jam</span><span className="v">{selTime} WIB</span></div>
                <div className="kfb-rev-row"><span className="k">Pasien</span><span className="v">{form.nama_lengkap}</span></div>
                <div className="kfb-rev-row"><span className="k">Keluhan</span><span className="v">{form.keluhan}</span></div>
              </div>
              {err && <p className="kfb-note" style={{ color: '#DC2626' }}>{err}</p>}
            </>
          )}
        </div>

        <div className="kfb-foot">
          {key === 'branch' && <button className="kfb-btn" disabled={!selBranch} onClick={() => setStep(s => s + 1)}>Pilih Terapis →</button>}
          {key === 'doctor' && <button className="kfb-btn" disabled={!selDoctor} onClick={() => setStep(s => s + 1)}>Pilih Tanggal →</button>}
          {key === 'date' && <button className="kfb-btn" disabled={!selDate} onClick={() => setStep(s => s + 1)}>Pilih Jam →</button>}
          {key === 'time' && <button className="kfb-btn" disabled={!selTime} onClick={() => setStep(s => s + 1)}>Isi Data →</button>}
          {key === 'data' && <button className="kfb-btn" disabled={!form.no_hp || !form.nama_lengkap || !form.keluhan} onClick={() => { setErr(''); setStep(s => s + 1) }}>Konfirmasi →</button>}
          {key === 'confirm' && <button className="kfb-btn" disabled={submitting} onClick={submit}>{submitting ? <><span className="kfb-spin" /> Memproses…</> : '✓ Konfirmasi Booking'}</button>}
          {key === 'confirm' && <p className="kfb-note">Kode booking dikirim via WhatsApp. Dengan konfirmasi, kamu menyetujui jadwal di atas.</p>}
        </div>
      </div>
    </>
  )
}
