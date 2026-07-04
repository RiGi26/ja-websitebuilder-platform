'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { rupiah, type PortalVehicle } from './tokens'

// ============================================================
// Wizard booking mobil (SetirYuk) — modal 5 langkah di atas situs:
// mobil → tanggal (kalender rentang; tanggal tersewa disabled) → mode →
// data diri → ringkasan → bayar penuh via Midtrans (redirect_url dari portal).
// Semua fetch lewat proxy same-origin /api/rental-proxy/{slug}/… (tanpa CORS).
// Desain mengikuti mockup Asphalt Editorial (pakai var --ra-* dari .ra-root).
// ============================================================

type BookedRange = { start_date: string; end_date: string }

const MODES = [
  { id: 'self_drive', label: 'Lepas Kunci', desc: 'Setir sendiri. KTP + SIM A ditunjukkan saat serah terima.' },
  { id: 'with_driver', label: 'Dengan Sopir', desc: 'Duduk manis, sopir kami yang bawa.' },
] as const

const DOW = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const MAX_DAYS = 30

function pad(n: number): string { return String(n).padStart(2, '0') }
function ymd(y: number, m: number, d: number): string { return `${y}-${pad(m + 1)}-${pad(d)}` }
function todayStr(): string {
  const t = new Date()
  return ymd(t.getFullYear(), t.getMonth(), t.getDate())
}
function addDaysStr(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  return ymd(d.getFullYear(), d.getMonth(), d.getDate())
}
function diffDays(a: string, b: string): number {
  return Math.round((new Date(`${b}T00:00:00`).getTime() - new Date(`${a}T00:00:00`).getTime()) / 86_400_000)
}
function fmtShort(iso: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${iso}T00:00:00`))
}

const CSS = `
.rbw-overlay{position:fixed;inset:0;z-index:1000;background:rgba(10,12,16,.62);backdrop-filter:blur(3px);display:flex;align-items:flex-end;justify-content:center;padding:0}
@media(min-width:640px){.rbw-overlay{align-items:center;padding:24px}}
.rbw{width:100%;max-width:620px;max-height:92dvh;display:flex;flex-direction:column;background:#fff;color:var(--ra-ink,#1A1D23);border-radius:22px 22px 0 0;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.4);font-family:inherit}
@media(min-width:640px){.rbw{border-radius:24px}}
.rbw-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 22px;background:var(--ra-asphalt,#14171C);color:#fff;flex:none}
.rbw-head h3{font-family:var(--ra-display);font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;margin:0}
.rbw-close{width:44px;height:44px;border-radius:12px;border:0;background:rgba(255,255,255,.08);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s}
.rbw-close:hover{background:rgba(255,255,255,.16)}
.rbw-prog{display:flex;gap:6px;padding:14px 22px 0;flex:none}
.rbw-prog span{flex:1;height:5px;border-radius:3px;background:#E8E5DE}
.rbw-prog span.on{background:var(--ra-accent)}
.rbw-steps{display:flex;justify-content:space-between;padding:8px 22px 0;font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--ra-ink-soft,#49525F);flex:none}
.rbw-body{padding:16px 22px 22px;overflow-y:auto;flex:1}
.rbw-h4{font-family:var(--ra-display);font-size:21px;font-weight:700;text-transform:uppercase;margin:0 0 12px}
.rbw-err{margin:0 0 12px;padding:11px 14px;border-radius:12px;background:#FEE2E2;color:#B91C1C;font-size:13.5px;font-weight:600}
.rbw-pick{display:flex;align-items:center;gap:13px;width:100%;text-align:left;padding:12px 14px;border-radius:16px;border:1.5px solid rgba(16,20,26,.1);background:#fff;cursor:pointer;transition:border-color .2s,box-shadow .2s;margin-bottom:10px;font-family:inherit}
.rbw-pick:hover{border-color:rgba(16,20,26,.24)}
.rbw-pick.sel{border-color:var(--ra-accent);box-shadow:0 0 0 4px var(--ra-accent-soft)}
.rbw-pick-th{width:60px;height:44px;flex:none;border-radius:10px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#ECEAE4,#DFDCD4);color:rgba(20,23,28,.35);overflow:hidden}
.rbw-pick-th img{width:100%;height:100%;object-fit:cover}
.rbw-pick-nm{font-family:var(--ra-display);font-size:18px;font-weight:700;text-transform:uppercase;line-height:1.15}
.rbw-pick-sp{font-size:12px;color:var(--ra-ink-soft,#49525F)}
.rbw-pick-pr{margin-left:auto;font-family:var(--ra-display);font-size:17px;font-weight:800;font-variant-numeric:tabular-nums;white-space:nowrap;text-align:right}
.rbw-pick-pr small{display:block;font-family:inherit;font-size:10.5px;font-weight:600;color:var(--ra-ink-soft,#49525F)}
.rbw-cal{border:1.5px solid rgba(16,20,26,.1);border-radius:16px;padding:14px;background:#fff}
.rbw-cal-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.rbw-cal-t{font-family:var(--ra-display);font-size:17px;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
.rbw-cal-nav{display:flex;gap:6px}
.rbw-cal-nav button{width:36px;height:36px;border-radius:10px;border:1.5px solid rgba(16,20,26,.12);background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px}
.rbw-cal-nav button:disabled{opacity:.35;cursor:not-allowed}
.rbw-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center}
.rbw-dow{font-size:10px;font-weight:700;letter-spacing:.07em;color:var(--ra-ink-soft,#49525F);padding:5px 0;text-transform:uppercase}
.rbw-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:10px;font-size:13.5px;font-weight:600;font-variant-numeric:tabular-nums;border:0;background:transparent;color:var(--ra-ink,#1A1D23);cursor:pointer;font-family:inherit}
.rbw-day:hover{background:#F1EFE9}
.rbw-day:disabled{color:#B9B4A9;cursor:not-allowed;background:transparent}
.rbw-day.blocked{text-decoration:line-through;background:#F1EFE9}
.rbw-day.start,.rbw-day.end{background:var(--ra-accent);color:#16130F;font-weight:800}
.rbw-day.mid{background:var(--ra-accent-soft);color:var(--ra-accent-ink)}
.rbw-legend{display:flex;gap:12px;flex-wrap:wrap;margin-top:10px;font-size:11.5px;color:var(--ra-ink-soft,#49525F)}
.rbw-legend i{width:11px;height:11px;border-radius:4px;display:inline-block;vertical-align:-1px;margin-right:4px}
.rbw-calc{margin-top:12px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:var(--ra-paper,#F7F5F0);border-radius:13px;padding:12px 16px;font-weight:600;font-size:14px}
.rbw-calc b{font-family:var(--ra-display);font-size:21px;font-weight:800;font-variant-numeric:tabular-nums}
.rbw-calc small{display:block;font-size:11.5px;color:var(--ra-ink-soft,#49525F);font-weight:500}
.rbw-mode{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:520px){.rbw-mode{grid-template-columns:1fr}}
.rbw-mode button{padding:15px;border-radius:15px;border:1.5px solid rgba(16,20,26,.1);background:#fff;text-align:left;cursor:pointer;font-family:inherit;transition:border-color .2s,box-shadow .2s}
.rbw-mode button.sel{border-color:var(--ra-accent);box-shadow:0 0 0 4px var(--ra-accent-soft)}
.rbw-mode h5{font-family:var(--ra-display);font-size:17px;font-weight:700;text-transform:uppercase;margin:0 0 3px}
.rbw-mode p{font-size:12.5px;color:var(--ra-ink-soft,#49525F);margin:0}
.rbw-note{margin-top:11px;padding:11px 13px;border-radius:12px;background:#FEF3C7;color:#92400E;font-size:13px;line-height:1.5}
.rbw-field{margin-bottom:13px}
.rbw-field label{display:block;font-size:12.5px;font-weight:700;margin-bottom:5px}
.rbw-field label i{color:#B91C1C;font-style:normal}
.rbw-field input,.rbw-field textarea{width:100%;min-height:47px;padding:11px 13px;border-radius:12px;border:1.5px solid rgba(16,20,26,.14);font:inherit;font-size:15px;background:#fff;color:var(--ra-ink,#1A1D23);box-sizing:border-box}
.rbw-field textarea{min-height:76px;resize:vertical}
.rbw-field input:focus,.rbw-field textarea:focus{outline:none;border-color:var(--ra-accent);box-shadow:0 0 0 4px var(--ra-accent-soft)}
.rbw-field .hp{font-size:11.5px;color:var(--ra-ink-soft,#49525F);margin-top:4px}
.rbw-hpot{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.rbw-sum{border:1.5px solid rgba(16,20,26,.1);border-radius:15px;overflow:hidden}
.rbw-sum-r{display:flex;justify-content:space-between;gap:14px;padding:11px 16px;font-size:13.5px;border-bottom:1px solid rgba(16,20,26,.07)}
.rbw-sum-r span{color:var(--ra-ink-soft,#49525F)}
.rbw-sum-r b{font-weight:600;text-align:right}
.rbw-sum-t{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:var(--ra-asphalt,#14171C);color:#fff}
.rbw-sum-t span{font-size:11.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--ra-on-dark-muted,#A6AFBD)}
.rbw-sum-t b{font-family:var(--ra-display);font-size:25px;font-weight:800;font-variant-numeric:tabular-nums}
.rbw-pay{display:flex;gap:8px;font-size:12.5px;color:var(--ra-ink-soft,#49525F);margin-top:12px;line-height:1.55}
.rbw-foot{display:flex;gap:10px;padding:14px 22px 18px;border-top:1px solid rgba(16,20,26,.08);background:#fff;flex:none}
.rbw-btn{flex:1;min-height:50px;border-radius:13px;border:0;font-family:var(--ra-display);font-size:17.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .18s,box-shadow .18s,background .18s}
.rbw-btn:disabled{opacity:.45;cursor:not-allowed}
.rbw-btn-back{flex:0 0 auto;padding:0 18px;background:transparent;color:var(--ra-ink,#1A1D23);border:1.5px solid rgba(16,20,26,.16)}
.rbw-btn-next{background:var(--ra-accent);color:#16130F;box-shadow:0 8px 22px var(--ra-accent-glow)}
.rbw-btn-next:hover:not(:disabled){background:var(--ra-accent-hover);transform:translateY(-1px)}
.rbw-btn-next:active:not(:disabled){transform:scale(.97)}
.rbw-spin{width:17px;height:17px;border:2px solid rgba(0,0,0,.3);border-top-color:transparent;border-radius:50%;animation:rbwspin .7s linear infinite}
@keyframes rbwspin{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){.rbw-btn{transition:none}.rbw-spin{animation-duration:1.5s}}
`

const STEP_LABELS = ['Mobil', 'Tanggal', 'Mode', 'Data', 'Bayar']

export default function RentalBookingWizard({
  bookingSlug,
  vehicles,
  initialVehicleId,
  onClose,
}: {
  bookingSlug: string
  vehicles: PortalVehicle[]
  initialVehicleId?: string
  onClose: () => void
}) {
  const today = todayStr()
  const [step, setStep] = useState(1)
  const [vehicleId, setVehicleId] = useState(initialVehicleId ?? vehicles[0]?.id ?? '')
  const [booked, setBooked] = useState<BookedRange[]>([])
  const [bookedLoading, setBookedLoading] = useState(false)
  const [cursor, setCursor] = useState(() => {
    const t = new Date()
    return { y: t.getFullYear(), m: t.getMonth() }
  })
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [mode, setMode] = useState<'self_drive' | 'with_driver'>('self_drive')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? null
  const vehicleLabel = vehicle ? `${vehicle.brand ?? ''} ${vehicle.model ?? ''}`.trim() || 'Mobil' : ''
  const days = start && end ? Math.max(1, diffDays(start, end)) : 0
  const total = vehicle ? days * vehicle.price_per_day : 0

  // Scroll-lock halaman selama modal terbuka + tutup via Escape.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  // Rentang tersewa per unit (utk disable tanggal) — refetch saat ganti mobil.
  const loadBooked = useCallback(() => {
    if (!vehicleId) return
    setBookedLoading(true)
    const to = addDaysStr(today, 90)
    fetch(`/api/rental-proxy/${bookingSlug}/availability?vehicle_id=${vehicleId}&from=${today}&to=${to}`)
      .then((r) => r.json())
      .then((d) => setBooked(Array.isArray(d.booked) ? d.booked : []))
      .catch(() => setBooked([]))
      .finally(() => setBookedLoading(false))
  }, [bookingSlug, vehicleId, today])

  useEffect(() => {
    loadBooked()
    setStart(''); setEnd('')
  }, [loadBooked])

  const inBooked = useCallback(
    (d: string) => booked.some((r) => r.start_date <= d && d <= r.end_date),
    [booked],
  )
  const rangeBlocked = useCallback(
    (s: string, e: string) => booked.some((r) => r.start_date <= e && r.end_date >= s),
    [booked],
  )

  const pickDay = (d: string) => {
    setErr('')
    if (!start || (start && end)) { setStart(d); setEnd(''); return }
    if (d < start) { setStart(d); return }
    if (diffDays(start, d) > MAX_DAYS) { setErr(`Durasi sewa maksimal ${MAX_DAYS} hari.`); return }
    if (rangeBlocked(start, d)) { setErr('Rentang itu menabrak tanggal yang sudah tersewa. Pilih rentang lain.'); return }
    setEnd(d)
  }

  const calendar = useMemo(() => {
    const { y, m } = cursor
    const firstDow = (new Date(y, m, 1).getDay() + 6) % 7 // Senin=0
    const total = new Date(y, m + 1, 0).getDate()
    const cells: (string | null)[] = Array.from({ length: firstDow }, () => null)
    for (let d = 1; d <= total; d++) cells.push(ymd(y, m, d))
    return cells
  }, [cursor])

  const monthIndex = cursor.y * 12 + cursor.m
  const nowIndex = new Date().getFullYear() * 12 + new Date().getMonth()

  const canNext =
    step === 1 ? !!vehicle
      : step === 2 ? !!start && !!end
        : step === 3 ? true
          : step === 4 ? name.trim().length >= 3 && phone.replace(/\D/g, '').length >= 9
            : true

  const submit = async () => {
    if (!vehicle || submitting) return
    setSubmitting(true)
    setErr('')
    try {
      const res = await fetch(`/api/rental-proxy/${bookingSlug}/submit`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: vehicle.id,
          mode,
          start_date: start,
          end_date: end,
          renter_name: name.trim(),
          renter_phone: phone.trim(),
          notes: notes.trim() || undefined,
          website,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 201 && data.booking_code && data.redirect_url) {
        try {
          sessionStorage.setItem(`sewa:${data.booking_code}`, JSON.stringify({
            vehicle: vehicleLabel, type: vehicle.type, start, end,
            days: data.days ?? days, total: data.total ?? total, mode, name: name.trim(),
          }))
        } catch { /* storage penuh/di-block — halaman status tetap jalan minimal */ }
        window.location.assign(data.redirect_url as string)
        return
      }
      if (res.status === 409) {
        setErr('Yah, tanggal itu barusan terisi orang lain. Kalender sudah diperbarui — pilih tanggal lain.')
        loadBooked()
        setStart(''); setEnd('')
        setStep(2)
      } else {
        setErr(typeof data.error === 'string' ? data.error : 'Gagal membuat booking. Coba lagi.')
      }
    } catch {
      setErr('Koneksi bermasalah. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rbw-overlay" role="presentation">
      <style>{CSS}</style>
      <div className="rbw" role="dialog" aria-modal="true" aria-label="Booking mobil">
        <div className="rbw-head">
          <h3>Booking Mobil</h3>
          <button className="rbw-close" type="button" aria-label="Tutup" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="rbw-prog" aria-hidden="true">
          {STEP_LABELS.map((_, i) => <span key={i} className={i < step ? 'on' : ''} />)}
        </div>
        <div className="rbw-steps" aria-hidden="true">
          {STEP_LABELS.map((s) => <span key={s}>{s}</span>)}
        </div>

        <div className="rbw-body">
          {err && <p className="rbw-err" role="alert">{err}</p>}

          {step === 1 && (
            <div>
              <h4 className="rbw-h4">Pilih mobil</h4>
              {vehicles.map((v) => {
                const sel = v.id === vehicleId
                const label = `${v.brand ?? ''} ${v.model ?? ''}`.trim() || 'Mobil'
                const spec = [v.type, v.capacity ? `${v.capacity} kursi` : null, v.transmission, v.fuel_type].filter(Boolean).join(' · ')
                return (
                  <button key={v.id} type="button" className={`rbw-pick${sel ? ' sel' : ''}`} onClick={() => setVehicleId(v.id)} aria-pressed={sel}>
                    <span className="rbw-pick-th">
                      {v.photos?.[0]
                        ? <img src={v.photos[0]} alt="" loading="lazy" />
                        : <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 11 6.5 6.7A2 2 0 0 1 8.4 5.3h7.2a2 2 0 0 1 1.9 1.4L19 11m-14 0h14m-14 0a2 2 0 0 0-2 2v3.5h2M19 11a2 2 0 0 1 2 2v3.5h-2m-12 0h8m-8 0a2 2 0 1 1-4 0m16 0a2 2 0 1 1-4 0" /></svg>}
                    </span>
                    <span>
                      <span className="rbw-pick-nm">{label}</span><br />
                      <span className="rbw-pick-sp">{spec}</span>
                    </span>
                    <span className="rbw-pick-pr">{rupiah(v.price_per_day)}<small>/hari</small></span>
                  </button>
                )
              })}
            </div>
          )}

          {step === 2 && (
            <div>
              <h4 className="rbw-h4">Pilih tanggal</h4>
              <div className="rbw-cal">
                <div className="rbw-cal-hd">
                  <span className="rbw-cal-t">{MONTHS[cursor.m]} {cursor.y}</span>
                  <span className="rbw-cal-nav">
                    <button type="button" aria-label="Bulan sebelumnya" disabled={monthIndex <= nowIndex}
                      onClick={() => setCursor(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }))}>‹</button>
                    <button type="button" aria-label="Bulan berikutnya" disabled={monthIndex >= nowIndex + 3}
                      onClick={() => setCursor(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }))}>›</button>
                  </span>
                </div>
                <div className="rbw-grid">
                  {DOW.map((d) => <span key={d} className="rbw-dow">{d}</span>)}
                  {calendar.map((d, i) => {
                    if (!d) return <span key={`b${i}`} />
                    const past = d < today
                    const blocked = inBooked(d)
                    const cls = d === start ? ' start' : d === end ? ' end' : start && end && d > start && d < end ? ' mid' : blocked ? ' blocked' : ''
                    return (
                      <button key={d} type="button" disabled={past || blocked}
                        className={`rbw-day${cls}`} onClick={() => pickDay(d)}
                        aria-label={`${d}${blocked ? ' — sudah tersewa' : ''}`}>
                        {Number(d.slice(8))}
                      </button>
                    )
                  })}
                </div>
                <div className="rbw-legend">
                  <span><i style={{ background: 'var(--ra-accent)' }} />Dipilih</span>
                  <span><i style={{ background: '#F1EFE9', outline: '1px solid #D8D4CA' }} />Sudah tersewa</span>
                  <span><i style={{ background: '#fff', outline: '1px solid #D8D4CA' }} />Tersedia</span>
                </div>
              </div>
              <div className="rbw-calc">
                <span>
                  {bookedLoading ? 'Memuat kalender…'
                    : start && end ? `${days} hari × ${vehicle ? rupiah(vehicle.price_per_day) : ''}`
                      : start ? `Ambil ${fmtShort(start)} — pilih tanggal kembali`
                        : 'Pilih tanggal ambil'}
                  <small>Durasi dihitung per 24 jam sejak jam ambil</small>
                </span>
                <b>{start && end ? rupiah(total) : '—'}</b>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h4 className="rbw-h4">Mode sewa</h4>
              <div className="rbw-mode" role="radiogroup" aria-label="Mode sewa">
                {MODES.map((m) => (
                  <button key={m.id} type="button" role="radio" aria-checked={mode === m.id}
                    className={mode === m.id ? 'sel' : ''} onClick={() => setMode(m.id)}>
                    <h5>{m.label}</h5>
                    <p>{m.desc}</p>
                  </button>
                ))}
              </div>
              {mode === 'with_driver' && (
                <p className="rbw-note">Biaya sopir belum termasuk harga sewa — admin konfirmasi nominalnya via WhatsApp setelah booking dibayar.</p>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <h4 className="rbw-h4">Data penyewa</h4>
              <div className="rbw-field">
                <label htmlFor="rbw-name">Nama lengkap <i>*</i></label>
                <input id="rbw-name" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </div>
              <div className="rbw-field">
                <label htmlFor="rbw-phone">No. WhatsApp <i>*</i></label>
                <input id="rbw-phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="08xxxxxxxxxx" />
                <p className="hp">Kode booking &amp; konfirmasi dikirim lewat nomor ini.</p>
              </div>
              <div className="rbw-field">
                <label htmlFor="rbw-notes">Catatan (opsional)</label>
                <textarea id="rbw-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Jam ambil, permintaan antar, dll." />
              </div>
              <div className="rbw-hpot" aria-hidden="true">
                <label htmlFor="rbw-web">Website</label>
                <input id="rbw-web" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
            </div>
          )}

          {step === 5 && vehicle && (
            <div>
              <h4 className="rbw-h4">Ringkasan &amp; bayar</h4>
              <div className="rbw-sum">
                <div className="rbw-sum-r"><span>Mobil</span><b>{vehicleLabel}{vehicle.type ? ` — ${vehicle.type.toUpperCase()}` : ''}</b></div>
                <div className="rbw-sum-r"><span>Tanggal</span><b>{fmtShort(start)} → {fmtShort(end)}</b></div>
                <div className="rbw-sum-r"><span>Durasi</span><b>{days} hari × {rupiah(vehicle.price_per_day)}</b></div>
                <div className="rbw-sum-r"><span>Mode</span><b>{mode === 'self_drive' ? 'Lepas Kunci' : 'Dengan Sopir'}</b></div>
                <div className="rbw-sum-r"><span>Penyewa</span><b>{name.trim()} · {phone.trim()}</b></div>
                <div className="rbw-sum-t"><span>Total Bayar</span><b>{rupiah(total)}</b></div>
              </div>
              <p className="rbw-pay">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flex: 'none', marginTop: 2, color: 'var(--ra-accent-ink)' }} aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.7 9a.6.6 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
                <span>Kamu akan diarahkan ke halaman pembayaran aman <b>Midtrans</b> (transfer bank, e-wallet, kartu). Booking hangus otomatis jika tidak dibayar dalam <b>2 jam</b>.</span>
              </p>
            </div>
          )}
        </div>

        <div className="rbw-foot">
          {step > 1 && (
            <button className="rbw-btn rbw-btn-back" type="button" onClick={() => { setErr(''); setStep(step - 1) }} disabled={submitting}>
              Kembali
            </button>
          )}
          {step < 5 ? (
            <button className="rbw-btn rbw-btn-next" type="button" disabled={!canNext} onClick={() => { setErr(''); setStep(step + 1) }}>
              Lanjut
            </button>
          ) : (
            <button className="rbw-btn rbw-btn-next" type="button" disabled={submitting} onClick={submit}>
              {submitting ? <span className="rbw-spin" aria-hidden="true" /> : null}
              {submitting ? 'Memproses…' : `Bayar Sekarang · ${rupiah(total)}`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
