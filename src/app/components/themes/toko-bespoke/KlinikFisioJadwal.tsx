'use client'
import { useState, useEffect } from 'react'

// ============================================================
// JADWAL REALTIME (klinik-fisio) — papan "Tersedia Hari Ini" + jadwal praktik
// mingguan per terapis + kartu cabang, semua dari Portal Klinik via proxy WB
// (/api/booking-proxy/{slug}/schedule — read-only, tanpa data pasien).
// Signature band GELAP satu-satunya di halaman (mockup 2026-07-11): papan skor.
// Namespace kfj-; warna dari var --kf-* warisan .kf-root (dark/dark2/pop).
// LiveCard (hero) & papan berbagi SATU fetch per slug via cache modul.
// ============================================================

type WeeklyRow = { day_of_week: number; start: string; end: string }
type ScheduleDoctor = {
  id: string; full_name: string; specialty: string
  location_id: string | null; location_name: string | null
  weekly: WeeklyRow[]
  today: null | { start: string; end: string; free: number; next: string[] }
}
type ScheduleLocation = { id: string; name: string; address: string | null }
type ScheduleData = { date: string; day_of_week: number; doctors: ScheduleDoctor[]; locations: ScheduleLocation[] }

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

// Satu fetch per slug per pageview — LiveCard & papan memakai promise yang sama.
const scheduleCache = new Map<string, Promise<ScheduleData | null>>()
function fetchSchedule(slug: string): Promise<ScheduleData | null> {
  if (!scheduleCache.has(slug)) {
    scheduleCache.set(
      slug,
      fetch(`/api/booking-proxy/${slug}/schedule`)
        .then((r) => (r.ok ? (r.json() as Promise<ScheduleData>) : null))
        .catch(() => null),
    )
  }
  return scheduleCache.get(slug)!
}

// undefined = memuat · null = gagal · ScheduleData = siap
function useSchedule(slug: string): ScheduleData | null | undefined {
  const [data, setData] = useState<ScheduleData | null | undefined>(undefined)
  useEffect(() => {
    let on = true
    fetchSchedule(slug).then((d) => { if (on) setData(d) })
    return () => { on = false }
  }, [slug])
  return data
}

const AV_COLORS = ['#1B9CD8', '#F39C12', '#0B6E96']
function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || 'T'
}
// Hari praktik berikutnya setelah hari ini (wrap ke minggu depan).
function nextPracticeDay(weekly: WeeklyRow[], today: number): WeeklyRow | null {
  if (weekly.length === 0) return null
  const sorted = [...weekly].sort((a, b) => a.day_of_week - b.day_of_week)
  return sorted.find((w) => w.day_of_week > today) ?? sorted[0]
}

// ── Kartu LIVE di hero (menggantikan badge jam saat booking aktif) ──
const LIVE_CSS = `
.kfj-hero-live{position:absolute;right:-1rem;top:1.9rem;z-index:3;background:var(--kf-surface);border-radius:16px;padding:.85rem 1.05rem;box-shadow:0 16px 40px -18px var(--kf-shadowDeep);text-decoration:none;display:block;min-width:200px;transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s}
.kfj-hero-live:hover{transform:translateY(-3px)}
.kfj-live-head{display:flex;align-items:center;gap:.45rem;margin-bottom:.35rem}
.kfj-live-label{font-size:.66rem;font-weight:800;letter-spacing:.13em;color:#16A34A;text-transform:uppercase}
.kfj-dot{width:8px;height:8px;border-radius:50%;background:#16A34A;position:relative;flex:none}
.kfj-dot::after{content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(22,163,74,.4)}
@media(prefers-reduced-motion:no-preference){.kfj-dot::after{animation:kfjPulse 1.8s cubic-bezier(.16,1,.3,1) infinite}}
@keyframes kfjPulse{0%{transform:scale(.6);opacity:1}100%{transform:scale(1.4);opacity:0}}
.kfj-hero-live b{display:block;font-size:.9rem;color:var(--kf-ink);line-height:1.3}
.kfj-hero-live small{font-size:.74rem;color:var(--kf-muted);display:block;margin-top:.1rem;font-variant-numeric:tabular-nums}
.kfj-hero-live .kfj-go{display:inline-flex;align-items:center;gap:.3rem;font-size:.76rem;font-weight:700;color:var(--kf-accentDeep);margin-top:.4rem}
@media(max-width:560px){.kfj-hero-live{right:0}}
`

export function KlinikFisioLiveCard({ slug }: { slug: string }) {
  const data = useSchedule(slug)
  if (data === null) return null // portal tak terjangkau → hero tanpa kartu, sisanya normal

  const avail = data?.doctors.filter((d) => d.today && d.today.free > 0) ?? []
  const earliest = avail.map((d) => d.today!.next[0]).filter(Boolean).sort()[0]

  let title = 'Memuat jadwal…'
  let sub = ''
  if (data) {
    if (avail.length > 0) {
      title = `${avail.length} terapis tersedia hari ini`
      sub = earliest ? `Slot terdekat ${earliest}` : 'Pilih jam di bawah'
      if (data.locations.length > 1) sub += ` · ${data.locations.length} cabang`
    } else if (data.day_of_week === 0) {
      title = 'Hari ini klinik libur'
      sub = 'Lihat jadwal minggu ini'
    } else {
      title = 'Slot hari ini penuh'
      sub = 'Masih ada slot di hari lain'
    }
  }

  return (
    <a className="kfj-hero-live" href="#jadwal">
      <style dangerouslySetInnerHTML={{ __html: LIVE_CSS }} />
      <span className="kfj-live-head"><span className="kfj-dot" aria-hidden /><span className="kfj-live-label">Live hari ini</span></span>
      <b>{title}</b>
      {sub && <small>{sub}</small>}
      <span className="kfj-go">Lihat jadwal →</span>
    </a>
  )
}

// ── Papan jadwal (seksi #jadwal) ──
const CSS = `
.kf-board{position:relative;background:radial-gradient(ellipse 60% 40% at 90% 0%,rgba(27,156,216,.22),transparent 60%),radial-gradient(ellipse 50% 40% at 0% 100%,rgba(243,156,18,.10),transparent 55%),linear-gradient(180deg,var(--kf-dark),var(--kf-dark2))}
.kf-board::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--kf-accent),var(--kf-pop))}
.kf-board .kf-eyebrow{color:var(--kf-pop)}
.kf-board .kf-heading{color:#fff}
.kf-board .kf-subtext{color:#AFC5D1}
.kfj-head{display:flex;align-items:flex-end;justify-content:space-between;gap:1.4rem;flex-wrap:wrap;margin-bottom:2.4rem}
.kfj-head .kf-sec-hdr{margin-bottom:0}
.kfj-badge{display:inline-flex;align-items:center;gap:.55rem;background:rgba(22,163,74,.14);border:1px solid rgba(22,163,74,.35);color:#6EE7A0;border-radius:999px;padding:.55rem 1.05rem;font-size:.8rem;font-weight:700;white-space:nowrap}
.kfj-badge .kfj-dot{background:#4ADE80}
.kfj-badge .kfj-dot::after{border-color:rgba(74,222,128,.4)}
.kfj-badge time{color:#7E99A8;font-weight:600;font-variant-numeric:tabular-nums}
.kfj-libur{background:rgba(243,156,18,.12);border:1px solid rgba(243,156,18,.35);color:#FBD38D;border-radius:14px;padding:.8rem 1.1rem;font-size:.9rem;font-weight:600;margin-bottom:1.4rem}
.kfj-today{display:grid;grid-template-columns:repeat(3,1fr);gap:1.1rem;margin-bottom:3rem}
.kfj-tcard{background:rgba(255,255,255,.05);border:1px solid rgba(234,243,248,.1);border-radius:20px;padding:1.35rem;transition:transform .3s cubic-bezier(.16,1,.3,1),background .3s,border-color .3s}
.kfj-tcard:hover{transform:translateY(-4px);background:rgba(255,255,255,.075);border-color:rgba(234,243,248,.2)}
.kfj-tcard-top{display:flex;gap:.85rem;align-items:center;margin-bottom:.95rem}
.kfj-av{width:48px;height:48px;border-radius:15px;flex:none;display:grid;place-items:center;font-weight:800;font-size:1.02rem;color:#fff}
.kfj-tcard h3{font-size:1rem;font-weight:700;color:#fff;line-height:1.25}
.kfj-spec{font-size:.76rem;color:#7E99A8;font-weight:600}
.kfj-chips{display:flex;align-items:center;gap:.45rem;flex-wrap:wrap;margin-bottom:.95rem}
.kfj-chip{display:inline-flex;align-items:center;gap:.35rem;font-size:.72rem;font-weight:700;padding:.28rem .7rem;border-radius:999px;background:rgba(14,124,176,.22);color:#8FD4F5;border:1px solid rgba(14,124,176,.4)}
.kfj-chip.ok{background:rgba(22,163,74,.16);color:#6EE7A0;border-color:rgba(22,163,74,.35)}
.kfj-chip.off{background:rgba(234,243,248,.07);color:#7E99A8;border-color:rgba(234,243,248,.1)}
.kfj-slots{display:flex;gap:.45rem;flex-wrap:wrap;margin-bottom:1.05rem;min-height:2.5rem}
.kfj-slot{min-height:40px;min-width:58px;display:inline-flex;align-items:center;justify-content:center;padding:.4rem .7rem;border-radius:11px;border:1px solid rgba(234,243,248,.18);background:rgba(234,243,248,.06);color:#EAF3F8;font-weight:700;font-size:.82rem;font-variant-numeric:tabular-nums;text-decoration:none;transition:background .2s,border-color .2s,transform .2s}
.kfj-slot:hover{background:rgba(14,124,176,.35);border-color:var(--kf-accentLight)}
.kfj-slot:active{transform:scale(.96)}
.kfj-empty{color:#7E99A8;font-size:.84rem;align-self:center}
.kfj-btn{display:flex;align-items:center;justify-content:center;width:100%;min-height:44px;border-radius:999px;background:var(--kf-pop);color:var(--kf-ink);font-weight:800;font-size:.88rem;text-decoration:none;transition:background .2s,transform .25s cubic-bezier(.34,1.56,.64,1);box-shadow:0 10px 22px -10px rgba(243,156,18,.7)}
.kfj-btn:hover{background:var(--kf-popDeep);transform:translateY(-2px)}
.kfj-btn.soft{background:rgba(234,243,248,.08);color:#AFC5D1;box-shadow:none;border:1px solid rgba(234,243,248,.1)}
.kfj-btn.soft:hover{background:rgba(234,243,248,.14);transform:none}
.kf-root .kfj-week-h{font-size:1.2rem;font-weight:800;color:#fff;margin-bottom:1rem}
.kfj-scroll{overflow-x:auto;border-radius:18px;border:1px solid rgba(234,243,248,.1);background:rgba(255,255,255,.035)}
.kfj-table{width:100%;border-collapse:collapse;min-width:680px}
.kfj-table th,.kfj-table td{padding:.9rem .85rem;text-align:left;font-size:.84rem;border-bottom:1px solid rgba(234,243,248,.1)}
.kfj-table thead th{font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#7E99A8;border-bottom:1px solid rgba(234,243,248,.16)}
.kfj-table tbody tr:last-child td{border-bottom:0}
.kfj-table .kfj-nm{font-weight:700;color:#fff;white-space:nowrap}
.kfj-table .kfj-nm small{display:block;font-weight:600;font-size:.7rem;color:#7E99A8}
.kfj-table .kfj-hours{font-variant-numeric:tabular-nums;font-weight:600;color:#EAF3F8;white-space:nowrap}
.kfj-table .kfj-off{color:rgba(234,243,248,.28)}
.kfj-table .kfj-now{background:rgba(243,156,18,.09);box-shadow:inset 0 0 0 1px rgba(243,156,18,.25)}
.kfj-table thead .kfj-now{color:var(--kf-pop)}
.kfj-cabang{display:grid;grid-template-columns:repeat(4,1fr);gap:.9rem;margin-top:2.6rem}
.kfj-branch{background:rgba(255,255,255,.05);border:1px solid rgba(234,243,248,.1);border-radius:16px;padding:1.05rem 1.15rem}
.kfj-branch b{display:block;font-size:.9rem;color:#fff;margin-bottom:.25rem}
.kfj-branch p{font-size:.78rem;color:#AFC5D1;line-height:1.55}
.kfj-note{margin-top:1.4rem;font-size:.8rem;color:#7E99A8}
.kfj-note b{color:#AFC5D1}
.kfj-load{display:flex;align-items:center;justify-content:center;gap:.6rem;color:#AFC5D1;padding:2.5rem 0;font-size:.9rem}
.kfj-spin{width:20px;height:20px;border:2px solid rgba(234,243,248,.25);border-top-color:var(--kf-pop);border-radius:50%;animation:kfjspin .7s linear infinite}
@keyframes kfjspin{to{transform:rotate(360deg)}}
@media(max-width:940px){.kfj-today{grid-template-columns:1fr}.kfj-cabang{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.kfj-cabang{grid-template-columns:1fr}}
`

type JadwalCopy = { eyebrow: string; title: string; sub: string; weekTitle: string; note: string }

export default function KlinikFisioJadwal({ slug, copy }: { slug: string; copy: JadwalCopy }) {
  const data = useSchedule(slug)
  // Detik sejak data tiba — bukti "live" di badge, tanpa polling ulang.
  const [secs, setSecs] = useState(0)
  useEffect(() => {
    if (!data) return
    setSecs(0)
    const t = setInterval(() => setSecs((s) => s + 5), 5000)
    return () => clearInterval(t)
  }, [data])

  const days = [1, 2, 3, 4, 5, 6]
  const today = data?.day_of_week ?? -1

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="kfj-head">
        <div className="kf-sec-hdr">
          <span className="kf-eyebrow" data-edit="copy.jadwal_eyebrow">{copy.eyebrow}</span>
          <h2 className="kf-heading" data-edit="copy.jadwal_title">{copy.title}</h2>
          <p className="kf-subtext" data-edit="copy.jadwal_sub">{copy.sub}</p>
        </div>
        <span className="kfj-badge">
          <span className="kfj-dot" aria-hidden /> LIVE{' '}
          <time>{secs === 0 ? 'diperbarui barusan' : secs < 60 ? `diperbarui ${secs} dtk lalu` : `diperbarui ${Math.floor(secs / 60)} mnt lalu`}</time>
        </span>
      </div>

      {data === undefined && (
        <div className="kfj-load"><span className="kfj-spin" aria-hidden /> Memuat jadwal terapis…</div>
      )}
      {data === null && (
        <div className="kfj-load">Jadwal realtime sedang tidak bisa dimuat — hubungi kami via WhatsApp.</div>
      )}

      {data && (
        <>
          {today === 0 && <p className="kfj-libur">Hari ini Minggu — klinik libur. Jadwal di bawah untuk minggu ini; booking tetap bisa dari sekarang.</p>}

          <div className="kfj-today" aria-label="Ketersediaan terapis hari ini">
            {data.doctors.map((doc, i) => {
              const t = doc.today
              const full = t !== null && t.free === 0
              const off = t === null
              const next = off ? nextPracticeDay(doc.weekly, today) : null
              return (
                <article key={doc.id} className="kfj-tcard">
                  <div className="kfj-tcard-top">
                    <span className="kfj-av" style={{ background: AV_COLORS[i % AV_COLORS.length] }} aria-hidden>{initials(doc.full_name)}</span>
                    <div>
                      <h3>{doc.full_name}</h3>
                      <span className="kfj-spec">{doc.specialty}</span>
                    </div>
                  </div>
                  <div className="kfj-chips">
                    {off
                      ? <span className="kfj-chip off">Tidak praktik hari ini</span>
                      : full
                        ? <span className="kfj-chip off">Penuh hari ini</span>
                        : <span className="kfj-chip ok">● {t!.free} slot tersedia</span>}
                    {doc.location_name && <span className="kfj-chip">{doc.location_name}</span>}
                  </div>
                  <div className="kfj-slots">
                    {off
                      ? <span className="kfj-empty">{next ? `Praktik lagi ${HARI[next.day_of_week]} ${next.start}–${next.end}` : 'Jadwal menyusul'}</span>
                      : full
                        ? <span className="kfj-empty">Semua slot terisi — cek hari lain di bawah</span>
                        : t!.next.map((time) => (
                            <a key={time} className="kfj-slot" href="#booking" aria-label={`Booking ${doc.full_name} jam ${time}`}>{time}</a>
                          ))}
                  </div>
                  {off || full
                    ? <a className="kfj-btn soft" href="#booking">Lihat hari lain</a>
                    : <a className="kfj-btn" href="#booking">Booking {doc.full_name.replace(/^Fisioterapis\s+|^Dr\.?\s+/i, '')} →</a>}
                </article>
              )
            })}
          </div>

          <h3 className="kfj-week-h" data-edit="copy.jadwal_week_title">{copy.weekTitle}</h3>
          <div className="kfj-scroll">
            <table className="kfj-table">
              <thead>
                <tr>
                  <th scope="col">Terapis</th>
                  {days.map((d) => (
                    <th key={d} scope="col" className={d === today ? 'kfj-now' : undefined}>
                      {HARI[d].slice(0, 3)}{d === today ? ' · hari ini' : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.doctors.map((doc) => (
                  <tr key={doc.id}>
                    <td className="kfj-nm">
                      {doc.full_name}
                      <small>{doc.location_name ?? doc.specialty}</small>
                    </td>
                    {days.map((d) => {
                      const row = doc.weekly.find((w) => w.day_of_week === d)
                      return (
                        <td key={d} className={`${d === today ? 'kfj-now ' : ''}${row ? 'kfj-hours' : 'kfj-off'}`}>
                          {row ? `${row.start}–${row.end}` : '—'}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.locations.length > 1 && (
            <div className="kfj-cabang" aria-label="Daftar cabang">
              {data.locations.map((loc) => (
                <div key={loc.id} className="kfj-branch">
                  <b>{loc.name}</b>
                  {loc.address && <p>{loc.address}</p>}
                </div>
              ))}
            </div>
          )}

          <p className="kfj-note" data-edit="copy.jadwal_note">{copy.note}</p>
        </>
      )}
    </>
  )
}
