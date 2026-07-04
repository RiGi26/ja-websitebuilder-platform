'use client'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { rupiah } from '@/app/components/themes/rental/asphalt/tokens'

// ============================================================
// Halaman status booking sewa (client) — /{slug}/sewa/{code}, finish URL Midtrans.
// Poll status via proxy (/api/rental-proxy/{bookingSlug}/status?code=) tiap 5 dtk
// (maks ~2 menit, lalu tombol cek manual). Detail booking dibaca dari sessionStorage
// yang diisi wizard sebelum redirect (fallback: tampilan minimal kode + status).
// Desain mengikuti mockup Asphalt Editorial (kartu status + chip kode gaya plat).
// ============================================================

type Status = 'pending' | 'paid' | 'expired' | 'notfound'
type Detail = { vehicle?: string; type?: string; start?: string; end?: string; days?: number; total?: number; mode?: string; name?: string }

const MAX_AUTO_POLLS = 24

const CSS = `
.sst{min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:32px 20px;background:linear-gradient(160deg,#1A1F27 0%,#14171C 55%,#101318 100%);font-family:var(--sst-body);color:#F4F6F9}
.sst *{box-sizing:border-box}
.sst-brand{font-family:var(--sst-display);font-size:22px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:#fff;text-decoration:none}
.sst-brand em{font-style:italic;color:var(--ra-accent)}
.sst-card{width:100%;max-width:460px;background:#fff;color:#1A1D23;border-radius:22px;box-shadow:0 24px 64px rgba(0,0,0,.45);overflow:hidden}
.sst-head{padding:28px 24px 20px;text-align:center}
.sst-ic{width:58px;height:58px;border-radius:50%;margin:0 auto 14px;display:flex;align-items:center;justify-content:center}
.sst--ok .sst-ic{background:#DCFCE7;color:#166534}
.sst--warn .sst-ic{background:#FEF3C7;color:#92400E}
.sst--err .sst-ic{background:#FEE2E2;color:#B91C1C}
.sst-h{font-family:var(--sst-display);font-size:25px;font-weight:700;text-transform:uppercase;margin:0;line-height:1.1}
.sst-p{font-size:14px;color:#49525F;margin:6px 0 0}
.sst-plate{display:inline-block;margin:16px auto 0;padding:8px 20px;border-radius:10px;background:#0B0D10;color:#fff;border:2px solid #fff;box-shadow:0 0 0 2px #0B0D10;font-family:var(--sst-display);font-size:23px;font-weight:700;letter-spacing:.14em;font-variant-numeric:tabular-nums}
.sst-body{padding:0 24px 26px;display:flex;flex-direction:column;gap:14px}
.sst-rows{border-top:1px solid rgba(16,20,26,.07)}
.sst-row{display:flex;justify-content:space-between;gap:14px;padding:10px 2px;font-size:13.5px;border-bottom:1px solid rgba(16,20,26,.07)}
.sst-row span{color:#49525F}
.sst-row b{font-weight:600;text-align:right;font-variant-numeric:tabular-nums}
.sst-tip{font-size:13px;color:#49525F;display:flex;gap:8px;line-height:1.55;margin:0}
.sst-tip svg{flex:none;margin-top:2px;color:var(--ra-accent-ink)}
.sst-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:48px;padding:0 20px;border-radius:13px;border:0;font-family:var(--sst-display);font-size:17px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;text-decoration:none;cursor:pointer;transition:transform .18s,box-shadow .18s;width:100%}
.sst-btn:hover{transform:translateY(-1px)}
.sst-btn:active{transform:scale(.97)}
.sst-btn-wa{background:linear-gradient(135deg,#1FAB55,#128C4B);color:#fff;box-shadow:0 8px 22px rgba(31,171,85,.32)}
.sst-btn-primary{background:var(--ra-accent);color:#16130F;box-shadow:0 8px 22px var(--ra-accent-glow)}
.sst-btn-ghost{background:#fff;color:#1A1D23;border:1.5px solid rgba(16,20,26,.16)}
.sst-btn:disabled{opacity:.5;cursor:not-allowed}
.sst-spin{width:16px;height:16px;border:2px solid rgba(0,0,0,.25);border-top-color:transparent;border-radius:50%;animation:sstspin .7s linear infinite}
.sst--warn .sst-ic .sst-spin{width:24px;height:24px;border-color:rgba(146,64,14,.35);border-top-color:#92400E}
@keyframes sstspin{to{transform:rotate(360deg)}}
.sst-foot{font-size:12px;color:#A6AFBD}
@media(prefers-reduced-motion:reduce){.sst-spin{animation-duration:1.5s}.sst-btn{transition:none}}
`

const ICONS = {
  check: <path d="m5 13 4 4L19 7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5h.01" /></>,
}
function Ic({ d, size = 26, sw = 2.4 }: { d: ReactNode; size?: number; sw?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} aria-hidden="true">{d}</svg>
}

function fmtShort(iso?: string): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${iso}T00:00:00`))
}

export default function SewaStatusClient({
  code,
  nama,
  bookingSlug,
  waHref,
}: {
  code: string
  nama: string
  bookingSlug: string
  waHref: string | null
}) {
  const [status, setStatus] = useState<Status>('pending')
  const [checking, setChecking] = useState(false)
  const [detail, setDetail] = useState<Detail>({})
  const [autoDone, setAutoDone] = useState(false)
  const polls = useRef(0)
  const [basePath, setBasePath] = useState('/')

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`sewa:${code}`)
      if (raw) setDetail(JSON.parse(raw) as Detail)
    } catch { /* abaikan */ }
    setBasePath(window.location.pathname.replace(/\/sewa\/.*$/i, '') || '/')
  }, [code])

  const check = useCallback(async (): Promise<Status> => {
    setChecking(true)
    try {
      const res = await fetch(`/api/rental-proxy/${bookingSlug}/status?code=${encodeURIComponent(code)}`, { cache: 'no-store' })
      if (res.status === 404) return 'notfound'
      const d = await res.json().catch(() => ({}))
      if (d.status === 'paid') return 'paid'
      if (d.status === 'expired') return 'expired'
      return 'pending'
    } catch {
      return 'pending'
    } finally {
      setChecking(false)
    }
  }, [bookingSlug, code])

  // Auto-poll selama pending (5 dtk × 24 ≈ 2 menit), lalu serahkan ke tombol manual.
  useEffect(() => {
    let stop = false
    let timer: ReturnType<typeof setTimeout>
    const tick = async () => {
      const s = await check()
      if (stop) return
      setStatus(s)
      if (s === 'pending' && polls.current < MAX_AUTO_POLLS) {
        polls.current += 1
        timer = setTimeout(tick, 5000)
      } else if (s === 'pending') {
        setAutoDone(true)
      }
    }
    tick()
    return () => { stop = true; clearTimeout(timer) }
  }, [check])

  const manualCheck = async () => {
    const s = await check()
    setStatus(s)
    if (s === 'pending') setAutoDone(true)
  }

  const stateCls = status === 'paid' ? 'sst--ok' : status === 'expired' || status === 'notfound' ? 'sst--err' : 'sst--warn'
  const modeLabel = detail.mode === 'with_driver' ? 'Dengan Sopir' : detail.mode === 'self_drive' ? 'Lepas Kunci' : null

  return (
    <div className={`sst ${stateCls}`}>
      <style>{CSS}</style>
      <a className="sst-brand" href={basePath || '/'}>{nama}</a>

      <div className="sst-card">
        <div className="sst-head">
          <span className="sst-ic">
            {status === 'paid' ? <Ic d={ICONS.check} />
              : status === 'pending' ? <span className="sst-spin" aria-hidden="true" />
                : <Ic d={ICONS.x} />}
          </span>
          <h1 className="sst-h">
            {status === 'paid' ? 'Booking terkonfirmasi'
              : status === 'pending' ? 'Menunggu pembayaran'
                : status === 'expired' ? 'Booking hangus'
                  : 'Kode tidak ditemukan'}
          </h1>
          <p className="sst-p">
            {status === 'paid' ? 'Pembayaran diterima. Sampai jumpa di hari ambil!'
              : status === 'pending' ? 'Selesaikan pembayaran di tab Midtrans yang tadi terbuka — halaman ini memperbarui status otomatis.'
                : status === 'expired' ? 'Batas waktu pembayaran terlewat — tanggalnya sudah dibuka lagi untuk umum. Belum ada dana yang terpotong.'
                  : 'Periksa lagi tautan dari halaman booking kamu.'}
          </p>
          {status !== 'notfound' && <span className="sst-plate">{code}</span>}
        </div>

        <div className="sst-body">
          {(detail.vehicle || detail.start) && status !== 'notfound' && (
            <div className="sst-rows">
              {detail.vehicle && <div className="sst-row"><span>Mobil</span><b>{detail.vehicle}</b></div>}
              {detail.start && detail.end && (
                <div className="sst-row"><span>Tanggal</span><b>{fmtShort(detail.start)} → {fmtShort(detail.end)}{detail.days ? ` (${detail.days} hari)` : ''}</b></div>
              )}
              {modeLabel && <div className="sst-row"><span>Mode</span><b>{modeLabel}</b></div>}
              {typeof detail.total === 'number' && detail.total > 0 && (
                <div className="sst-row"><span>{status === 'paid' ? 'Dibayar' : 'Tagihan'}</span><b>{rupiah(detail.total)}{status === 'paid' ? ' ✓' : ''}</b></div>
              )}
            </div>
          )}

          {status === 'paid' && (
            <>
              <p className="sst-tip"><Ic d={ICONS.info} size={16} sw={2} /><span>Simpan kode ini. Tunjukkan bersama KTP &amp; SIM saat serah terima.</span></p>
              {waHref && <a className="sst-btn sst-btn-wa" href={waHref} target="_blank" rel="noopener noreferrer">Hubungi Admin via WA</a>}
            </>
          )}

          {status === 'pending' && (
            <button className="sst-btn sst-btn-ghost" type="button" onClick={manualCheck} disabled={checking}>
              {checking ? <span className="sst-spin" aria-hidden="true" /> : null}
              {autoDone ? 'Cek Status Pembayaran' : 'Cek Sekarang'}
            </button>
          )}

          {(status === 'expired' || status === 'notfound') && (
            <a className="sst-btn sst-btn-primary" href={`${basePath || '/'}#armada`}>Booking Ulang</a>
          )}
        </div>
      </div>

      <p className="sst-foot">Pembayaran diproses aman oleh Midtrans.</p>
    </div>
  )
}
