'use client'
// ============================================================
// Storefront keranjang + checkout untuk tenant cutover Portal (Bakso Fase 1).
// Menu-source (catalog_mirror), bayar MANUAL + COD (5 metode §7), order → /api/orders
// (Portal SoR satu-arah). BEDA dari CartProvider toko (products + Midtrans) — sengaja
// terpisah: line key = pack_id, total & instruksi_bayar dari response Portal (BUKAN
// estimasi browser, §4.1), 409 stock_conflict ditangani.
//
// Provider membungkus renderer dari SiteRenderer (di luar .wr-root) → floating cart +
// drawer + checkout pakai style sendiri (pcart-*), tema via `primary`. Menu cards
// memanggil useCart() (PortalMenuSection, di dalam .wr-root).
// ============================================================
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { ShoppingBag, Plus, Minus, X, ArrowLeft, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import { formatMoney, moneyFromConfig } from '@/lib/format-money'
import { METODE_BAYAR, type MetodeBayar, type CartLine, type PortalOrderResponse, type StockConflictEntry } from '@/lib/portal/types'
import type { LocaleConfig } from '@/types/websitebuilder'

type AddItem = { pack_id: string; nama: string; harga: number; kategori?: string | null; gambar?: string | null }

interface CartCtx {
  items: CartLine[]
  count: number
  subtotal: number
  qtyOf: (packId: string) => number
  add: (item: AddItem, qty?: number) => void
  inc: (packId: string) => void
  dec: (packId: string) => void
  remove: (packId: string) => void
  openCart: () => void
}
const Ctx = createContext<CartCtx | null>(null)
export function usePortalCart(): CartCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('usePortalCart harus di dalam <PortalCartProvider>')
  return v
}

const METODE_OPSI: { v: MetodeBayar; label: string; sub: string }[] = [
  { v: 'transfer_jp', label: 'Transfer Bank · 銀行振込', sub: 'Japan Post Bank — bayar penuh online' },
  { v: 'transfer_id', label: 'Transfer Bank Indonesia', sub: 'Bayar penuh (kurs ¥→Rp saat konfirmasi)' },
  { v: 'paypay', label: 'PayPay', sub: 'Bayar penuh via PayPay for Business' },
  { v: 'cod_full', label: '代引き · COD penuh', sub: 'Bayar semua ke kurir saat barang tiba' },
  { v: 'cod_ongkir', label: '着払い · ongkir di kurir', sub: 'Barang dibayar online, ongkir ke kurir' },
]

const METODE_LABEL: Record<MetodeBayar, string> = Object.fromEntries(
  METODE_OPSI.map((o) => [o.v, o.label]),
) as Record<MetodeBayar, string>

type View = 'closed' | 'cart' | 'checkout' | 'done'
type DoneState = { res: PortalOrderResponse; trackUrl: string }

export default function PortalCartProvider({
  slug,
  primary = '#C0432E',
  localeConfig,
  businessName,
  children,
}: {
  slug: string
  primary?: string
  localeConfig?: LocaleConfig
  businessName: string
  children: React.ReactNode
}) {
  const [items, setItems] = useState<CartLine[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [view, setView] = useState<View>('closed')
  const [done, setDoneState] = useState<DoneState | null>(null)
  const storageKey = `ja_portal_cart:${slug}`
  const { locale, currency } = moneyFromConfig(localeConfig)
  const fmt = useCallback((n: number) => formatMoney(n, locale, currency), [locale, currency])

  // Persist per-slug (pola CartProvider).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setItems(JSON.parse(raw))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [storageKey])
  useEffect(() => {
    if (hydrated) localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items, hydrated, storageKey])

  const add = useCallback((item: AddItem, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((l) => l.pack_id === item.pack_id)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], qty: next[i].qty + qty }
        return next
      }
      return [...prev, { pack_id: item.pack_id, nama: item.nama, harga: item.harga, qty, kategori: item.kategori, gambar: item.gambar }]
    })
  }, [])
  const setQty = useCallback((packId: string, qty: number) => {
    setItems((prev) => (qty <= 0 ? prev.filter((l) => l.pack_id !== packId) : prev.map((l) => (l.pack_id === packId ? { ...l, qty } : l))))
  }, [])
  const inc = useCallback((packId: string) => setItems((prev) => prev.map((l) => (l.pack_id === packId ? { ...l, qty: l.qty + 1 } : l))), [])
  const dec = useCallback((packId: string) => setItems((prev) => prev.flatMap((l) => (l.pack_id === packId ? (l.qty <= 1 ? [] : [{ ...l, qty: l.qty - 1 }]) : [l]))), [])
  const remove = useCallback((packId: string) => setItems((prev) => prev.filter((l) => l.pack_id !== packId)), [])
  const clear = useCallback(() => setItems([]), [])

  const count = useMemo(() => items.reduce((a, b) => a + b.qty, 0), [items])
  const subtotal = useMemo(() => items.reduce((a, b) => a + b.harga * b.qty, 0), [items])
  const qtyOf = useCallback((packId: string) => items.find((l) => l.pack_id === packId)?.qty ?? 0, [items])

  const ctx: CartCtx = { items, count, subtotal, qtyOf, add, inc, dec, remove, openCart: () => setView('cart') }

  return (
    <Ctx.Provider value={ctx}>
      {children}
      <style dangerouslySetInnerHTML={{ __html: pcartCss(primary) }} />

      {/* Floating cart button */}
      {hydrated && count > 0 && view === 'closed' && (
        <button className="pcart-fab" onClick={() => setView('cart')} aria-label={`Buka keranjang (${count} item)`}>
          <ShoppingBag size={20} aria-hidden />
          <span className="pcart-fab-count">{count}</span>
          <span className="pcart-fab-total">{fmt(subtotal)}</span>
        </button>
      )}

      {view !== 'closed' && (
        <div className="pcart-overlay" role="dialog" aria-modal="true" aria-label="Keranjang & pemesanan">
          <button className="pcart-scrim" aria-label="Tutup" onClick={() => setView('closed')} />
          <div className="pcart-panel">
            {view === 'cart' && (
              <CartView items={items} fmt={fmt} subtotal={subtotal} inc={inc} dec={dec} remove={remove}
                onClose={() => setView('closed')} onCheckout={() => setView('checkout')} />
            )}
            {view === 'checkout' && (
              <CheckoutView slug={slug} items={items} fmt={fmt} subtotal={subtotal} phoneCc={localeConfig?.phone_cc || '62'}
                onBack={() => setView('cart')} onClose={() => setView('closed')}
                onDone={(d) => { clear(); setDoneState(d); setView('done') }} onAdjust={setQty} />
            )}
            {view === 'done' && done && (
              <DoneView fmt={fmt} done={done} businessName={businessName} onClose={() => setView('closed')} />
            )}
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}

// ── Cart list view ──────────────────────────────────────────
function CartView({ items, fmt, subtotal, inc, dec, remove, onClose, onCheckout }: {
  items: CartLine[]; fmt: (n: number) => string; subtotal: number
  inc: (id: string) => void; dec: (id: string) => void; remove: (id: string) => void
  onClose: () => void; onCheckout: () => void
}) {
  return (
    <>
      <header className="pcart-head">
        <h2>Keranjang</h2>
        <button className="pcart-x" onClick={onClose} aria-label="Tutup keranjang"><X size={20} /></button>
      </header>
      <div className="pcart-body">
        {items.length === 0 ? (
          <p className="pcart-empty">Keranjang masih kosong.</p>
        ) : (
          <ul className="pcart-list">
            {items.map((l) => (
              <li key={l.pack_id} className="pcart-line">
                <div className="pcart-line-info">
                  <span className="pcart-line-name">{l.nama}</span>
                  <span className="pcart-line-price">{fmt(l.harga)}</span>
                </div>
                <div className="pcart-stepper">
                  <button onClick={() => dec(l.pack_id)} aria-label={`Kurangi ${l.nama}`}><Minus size={15} /></button>
                  <span aria-live="polite">{l.qty}</span>
                  <button onClick={() => inc(l.pack_id)} aria-label={`Tambah ${l.nama}`}><Plus size={15} /></button>
                </div>
                <button className="pcart-rm" onClick={() => remove(l.pack_id)} aria-label={`Hapus ${l.nama}`}>Hapus</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <footer className="pcart-foot">
        <div className="pcart-subtotal"><span>Subtotal</span><strong>{fmt(subtotal)}</strong></div>
        <button className="pcart-cta" disabled={items.length === 0} onClick={onCheckout}>Lanjut ke Pembayaran</button>
        <p className="pcart-note">Ongkir & instruksi bayar tampil setelah pesanan dibuat.</p>
      </footer>
    </>
  )
}

// ── Checkout view ───────────────────────────────────────────
function CheckoutView({ slug, items, fmt, subtotal, phoneCc, onBack, onClose, onDone, onAdjust }: {
  slug: string; items: CartLine[]; fmt: (n: number) => string; subtotal: number; phoneCc: string
  onBack: () => void; onClose: () => void; onDone: (d: DoneState) => void; onAdjust: (id: string, qty: number) => void
}) {
  const [form, setForm] = useState({ nama: '', telp: '', email: '', ig: '', kode_pos: '', alamat: '', catatan: '' })
  const [metode, setMetode] = useState<MetodeBayar | ''>('')
  const [tglKirim, setTglKirim] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [conflicts, setConflicts] = useState<StockConflictEntry[] | null>(null)
  // Idempotency-Key per sesi checkout (tahan retry; ganti saat keranjang berubah).
  const [idemKey] = useState(() => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.round(Math.random() * 1e9)}`))

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit() {
    setErr(null); setConflicts(null)
    if (!form.nama.trim() || !form.telp.trim()) { setErr('Nama & nomor WhatsApp wajib diisi.'); return }
    if (!metode) { setErr('Pilih metode pembayaran.'); return }
    setBusy(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug,
          pembeli: {
            nama: form.nama, telp: form.telp, email: form.email, ig: form.ig,
            kode_pos: form.kode_pos, alamat: form.alamat, catatan: form.catatan,
          },
          metode_bayar: metode,
          fulfillment_mode: 'IMMEDIATE',
          tgl_kirim: tglKirim || null,
          items: items.map((l) => ({ product_pack_id: l.pack_id, qty: l.qty })),
          idempotency_key: idemKey,
        }),
      })
      const json = await res.json().catch(() => null)
      if (res.ok && json?.ok) {
        const trackUrl = `/lacak/${json.tracking_token}`
        onDone({ res: json as PortalOrderResponse, trackUrl })
        return
      }
      if (res.status === 409 && json?.error === 'stock_conflict' && Array.isArray(json.conflicts)) {
        setConflicts(json.conflicts as StockConflictEntry[])
        setErr('Sebagian menu baru saja habis/berkurang. Sesuaikan keranjang lalu coba lagi.')
        return
      }
      setErr(json?.message || 'Gagal membuat pesanan. Coba lagi.')
    } catch {
      setErr('Koneksi bermasalah. Coba lagi.')
    } finally {
      setBusy(false)
    }
  }

  function applyAdjust() {
    if (!conflicts) return
    for (const c of conflicts) onAdjust(c.ref_id, Math.max(0, c.tersedia))
    setConflicts(null); setErr(null); onBack()
  }

  return (
    <>
      <header className="pcart-head">
        <button className="pcart-back" onClick={onBack} aria-label="Kembali ke keranjang"><ArrowLeft size={18} /></button>
        <h2>Pembayaran</h2>
        <button className="pcart-x" onClick={onClose} aria-label="Tutup"><X size={20} /></button>
      </header>
      <div className="pcart-body">
        <ul className="pcart-mini">
          {items.map((l) => (
            <li key={l.pack_id}><span>{l.nama} ×{l.qty}</span><span>{fmt(l.harga * l.qty)}</span></li>
          ))}
          <li className="pcart-mini-sub"><span>Subtotal</span><strong>{fmt(subtotal)}</strong></li>
        </ul>

        <h3 className="pcart-h3">Data Pemesan</h3>
        <div className="pcart-field"><label htmlFor="pc-nama">Nama *</label><input id="pc-nama" value={form.nama} onChange={set('nama')} autoComplete="name" /></div>
        <div className="pcart-field"><label htmlFor="pc-telp">WhatsApp * <span className="pcart-hint">(+{phoneCc})</span></label><input id="pc-telp" value={form.telp} onChange={set('telp')} inputMode="tel" autoComplete="tel" placeholder={phoneCc === '81' ? '090-1234-5678' : '0812...'} /></div>
        <div className="pcart-row">
          <div className="pcart-field"><label htmlFor="pc-email">Email</label><input id="pc-email" value={form.email} onChange={set('email')} inputMode="email" autoComplete="email" /></div>
          <div className="pcart-field"><label htmlFor="pc-ig">Instagram</label><input id="pc-ig" value={form.ig} onChange={set('ig')} placeholder="@akun" /></div>
        </div>
        <div className="pcart-row">
          <div className="pcart-field"><label htmlFor="pc-pos">Kode Pos 〒</label><input id="pc-pos" value={form.kode_pos} onChange={set('kode_pos')} inputMode="numeric" placeholder="160-0023" /></div>
          <div className="pcart-field"><label htmlFor="pc-kirim">Tanggal kirim</label><input id="pc-kirim" type="date" value={tglKirim} onChange={(e) => setTglKirim(e.target.value)} /></div>
        </div>
        <div className="pcart-field"><label htmlFor="pc-alamat">Alamat</label><textarea id="pc-alamat" value={form.alamat} onChange={set('alamat')} rows={2} placeholder="Prefektur · kota · banchi" /></div>
        <div className="pcart-field"><label htmlFor="pc-catatan">Catatan</label><textarea id="pc-catatan" value={form.catatan} onChange={set('catatan')} rows={2} /></div>

        <h3 className="pcart-h3">Metode Pembayaran *</h3>
        <div className="pcart-metode">
          {METODE_OPSI.map((o) => (
            <button key={o.v} type="button" className={`pcart-metode-opt${metode === o.v ? ' is-sel' : ''}`} onClick={() => setMetode(o.v)} aria-pressed={metode === o.v}>
              <span className="pcart-metode-label">{o.label}</span>
              <span className="pcart-metode-sub">{o.sub}</span>
            </button>
          ))}
        </div>

        {conflicts && (
          <div className="pcart-alert" role="alert">
            <AlertTriangle size={16} aria-hidden />
            <div>
              <strong>Stok berubah:</strong>
              <ul>{conflicts.map((c) => <li key={c.ref_id}>{c.nama} — tersedia {c.tersedia}, diminta {c.diminta}</li>)}</ul>
              <button className="pcart-link" onClick={applyAdjust}>Sesuaikan keranjang otomatis</button>
            </div>
          </div>
        )}
        {err && !conflicts && <p className="pcart-err" role="alert">{err}</p>}
      </div>
      <footer className="pcart-foot">
        <button className="pcart-cta" disabled={busy} onClick={submit}>
          {busy ? <><Loader2 size={16} className="pcart-spin" aria-hidden /> Memproses…</> : 'Buat Pesanan'}
        </button>
        <p className="pcart-note">Pembayaran manual / COD — instruksi tampil setelah pesanan dibuat.</p>
      </footer>
    </>
  )
}

// ── Confirmation view ───────────────────────────────────────
function DoneView({ fmt, done, businessName, onClose }: { fmt: (n: number) => string; done: DoneState; businessName: string; onClose: () => void }) {
  const r = done.res
  const ib = r.instruksi_bayar
  return (
    <>
      <header className="pcart-head">
        <h2>Pesanan Dibuat</h2>
        <button className="pcart-x" onClick={onClose} aria-label="Tutup"><X size={20} /></button>
      </header>
      <div className="pcart-body pcart-done">
        <div className="pcart-done-icon"><CheckCircle2 size={44} aria-hidden /></div>
        <p className="pcart-done-lead">Terima kasih! Pesanan <strong>{r.order_code}</strong> di {businessName} sudah masuk.</p>

        <div className="pcart-instr">
          <h3>{METODE_LABEL[r.metode_bayar]}</h3>
          {r.metode_bayar === 'cod_full' ? (
            <p>Bayar <strong>{fmt(r.total_courier)}</strong> ke kurir saat barang tiba.</p>
          ) : (
            <p>Transfer <strong>{fmt(ib.nominal)}</strong>{ib.rekening ? <> ke <span className="pcart-rek">{ib.rekening}</span></> : null}, lalu kirim bukti via WhatsApp.</p>
          )}
          {ib.catatan && <p className="pcart-instr-note">{ib.catatan}</p>}
          <dl className="pcart-totals">
            <div><dt>Total barang + ongkir</dt><dd>{fmt(r.total_gross)}</dd></div>
            {r.total_online > 0 && <div><dt>Dibayar online</dt><dd>{fmt(r.total_online)}</dd></div>}
            {r.total_courier > 0 && <div><dt>Dibayar ke kurir</dt><dd>{fmt(r.total_courier)}</dd></div>}
          </dl>
        </div>

        <a className="pcart-cta pcart-cta-link" href={done.trackUrl}>Lacak Pesanan</a>
        <button className="pcart-link" onClick={onClose}>Tutup</button>
      </div>
    </>
  )
}

function pcartCss(primary: string): string {
  return `
.pcart-fab{position:fixed;right:1.1rem;bottom:1.1rem;z-index:900;display:inline-flex;align-items:center;gap:.5rem;padding:.7rem 1.1rem;border:none;border-radius:999px;background:${primary};color:#fff;font:600 .9rem/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 10px 28px rgba(0,0,0,.22);transition:transform .2s}
.pcart-fab:hover{transform:translateY(-2px)}
.pcart-fab-count{background:rgba(255,255,255,.25);border-radius:999px;padding:.1rem .5rem;font-size:.78rem}
.pcart-fab-total{font-variant-numeric:tabular-nums}
.pcart-overlay{position:fixed;inset:0;z-index:950;display:flex;justify-content:flex-end}
.pcart-scrim{position:absolute;inset:0;background:rgba(20,12,8,.5);border:none;cursor:pointer;backdrop-filter:blur(2px)}
.pcart-panel{position:relative;z-index:1;width:min(440px,100%);max-height:100dvh;background:#FFFBF2;color:#2B1A12;display:flex;flex-direction:column;box-shadow:-8px 0 40px rgba(0,0,0,.25);animation:pcart-in .28s cubic-bezier(.22,1,.36,1)}
@keyframes pcart-in{from{transform:translateX(24px);opacity:.6}to{transform:none;opacity:1}}
.pcart-head{display:flex;align-items:center;gap:.6rem;padding:1rem 1.2rem;border-bottom:1px solid rgba(43,26,18,.1)}
.pcart-head h2{font:700 1.15rem/1.2 system-ui,sans-serif;margin:0;flex:1}
.pcart-x,.pcart-back{background:none;border:none;color:#6E5240;cursor:pointer;padding:.3rem;border-radius:8px;display:inline-flex}
.pcart-x:hover,.pcart-back:hover{background:rgba(43,26,18,.06)}
.pcart-body{flex:1;overflow-y:auto;padding:1.1rem 1.2rem}
.pcart-empty{color:#6E5240;text-align:center;padding:2rem 0}
.pcart-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.8rem}
.pcart-line{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:.7rem}
.pcart-line-info{display:flex;flex-direction:column;gap:.15rem;min-width:0}
.pcart-line-name{font-weight:600;font-size:.95rem}
.pcart-line-price{font-size:.82rem;color:#6E5240}
.pcart-stepper{display:inline-flex;align-items:center;gap:.5rem;border:1px solid rgba(43,26,18,.18);border-radius:999px;padding:.2rem .4rem}
.pcart-stepper button{width:30px;height:30px;border:none;background:rgba(43,26,18,.05);border-radius:50%;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;color:#2B1A12}
.pcart-stepper button:hover{background:${primary};color:#fff}
.pcart-stepper span{min-width:1.3ch;text-align:center;font-variant-numeric:tabular-nums;font-weight:600}
.pcart-rm{background:none;border:none;color:#9A3322;font-size:.78rem;cursor:pointer;padding:.2rem}
.pcart-rm:hover{text-decoration:underline}
.pcart-foot{border-top:1px solid rgba(43,26,18,.1);padding:1rem 1.2rem;padding-bottom:max(1rem,env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:.6rem}
.pcart-subtotal{display:flex;justify-content:space-between;align-items:baseline;font-size:.95rem}
.pcart-subtotal strong{font-size:1.15rem;font-variant-numeric:tabular-nums}
.pcart-cta{width:100%;padding:.85rem 1rem;border:none;border-radius:14px;background:${primary};color:#fff;font:700 .98rem/1 system-ui,sans-serif;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;transition:filter .2s}
.pcart-cta:hover:not(:disabled){filter:brightness(.93)}
.pcart-cta:disabled{opacity:.5;cursor:not-allowed}
.pcart-cta-link{text-decoration:none}
.pcart-note{font-size:.76rem;color:#6E5240;text-align:center;margin:0}
.pcart-mini{list-style:none;margin:0 0 1.2rem;padding:.8rem 1rem;background:rgba(43,26,18,.04);border-radius:12px;display:flex;flex-direction:column;gap:.35rem;font-size:.86rem}
.pcart-mini li{display:flex;justify-content:space-between;gap:1rem}
.pcart-mini-sub{border-top:1px dashed rgba(43,26,18,.2);padding-top:.4rem;margin-top:.2rem}
.pcart-h3{font:700 .95rem/1.2 system-ui,sans-serif;margin:1.4rem 0 .7rem}
.pcart-field{display:flex;flex-direction:column;gap:.3rem;margin-bottom:.7rem}
.pcart-field label{font-size:.8rem;font-weight:600;color:#4A3326}
.pcart-hint{font-weight:400;color:#6E5240}
.pcart-field input,.pcart-field textarea{border:1px solid rgba(43,26,18,.2);border-radius:10px;padding:.6rem .7rem;font:400 .92rem/1.4 system-ui,sans-serif;background:#fff;color:#2B1A12;width:100%}
.pcart-field input:focus,.pcart-field textarea:focus{outline:2px solid ${primary};outline-offset:0;border-color:transparent}
.pcart-row{display:grid;grid-template-columns:1fr 1fr;gap:.7rem}
.pcart-metode{display:flex;flex-direction:column;gap:.5rem}
.pcart-metode-opt{text-align:left;border:1.5px solid rgba(43,26,18,.16);background:#fff;border-radius:12px;padding:.7rem .85rem;cursor:pointer;display:flex;flex-direction:column;gap:.15rem;transition:border-color .15s,background .15s}
.pcart-metode-opt:hover{border-color:${primary}}
.pcart-metode-opt.is-sel{border-color:${primary};background:${primary}0F;box-shadow:inset 0 0 0 1px ${primary}}
.pcart-metode-label{font-weight:600;font-size:.9rem}
.pcart-metode-sub{font-size:.78rem;color:#6E5240}
.pcart-alert{display:flex;gap:.6rem;background:#FBEAE6;border:1px solid #E8B4A8;border-radius:12px;padding:.8rem;margin-top:1rem;color:#7A2A1B;font-size:.85rem}
.pcart-alert ul{margin:.3rem 0;padding-left:1.1rem}
.pcart-link{background:none;border:none;color:${primary};font-weight:600;cursor:pointer;font-size:.85rem;padding:.3rem 0;text-decoration:underline}
.pcart-err{color:#9A3322;font-size:.85rem;margin-top:.8rem}
.pcart-done{text-align:center}
.pcart-done-icon{color:#2e7d32;display:flex;justify-content:center;margin:.5rem 0 1rem}
.pcart-done-lead{font-size:.98rem;margin-bottom:1.2rem}
.pcart-instr{text-align:left;background:rgba(43,26,18,.04);border-radius:14px;padding:1rem 1.1rem;margin-bottom:1.2rem}
.pcart-instr h3{font:700 1rem/1.2 system-ui,sans-serif;margin:0 0 .5rem}
.pcart-instr p{font-size:.9rem;line-height:1.6;margin:0 0 .5rem}
.pcart-rek{font-weight:600;word-break:break-word}
.pcart-instr-note{font-size:.82rem;color:#6E5240}
.pcart-totals{margin:.6rem 0 0;display:flex;flex-direction:column;gap:.25rem}
.pcart-totals div{display:flex;justify-content:space-between;font-size:.85rem}
.pcart-totals dt{color:#6E5240}
.pcart-totals dd{margin:0;font-variant-numeric:tabular-nums;font-weight:600}
.pcart-spin{animation:pcart-rot 1s linear infinite}
@keyframes pcart-rot{to{transform:rotate(360deg)}}
@media(max-width:480px){.pcart-panel{width:100%}.pcart-row{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.pcart-panel,.pcart-spin{animation:none}}
`
}
