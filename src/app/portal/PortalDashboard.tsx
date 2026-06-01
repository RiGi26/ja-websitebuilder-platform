'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Plus, Trash2, Loader2, Eye, EyeOff, Pencil, Check, LogOut, ExternalLink, Package,
  CreditCard, ShoppingBag, Receipt, CalendarClock, Briefcase, UtensilsCrossed,
} from 'lucide-react'
import type { Product, Service, MenuItem } from '@/types/websitebuilder'

type PageInfo = { id: string; nama_website: string; slug: string | null; status: string }
type PaymentStatus = { configured: boolean; isActive: boolean; isProduction: boolean; clientKey: string | null }

export type ShopOrderItem = { id: string; nama: string; harga_satuan: number; qty: number; subtotal: number }
export type ShopOrderRow = {
  id: string
  pembeli_nama: string
  pembeli_hp: string | null
  pembeli_email: string | null
  alamat: string | null
  catatan: string | null
  total: number
  status: string
  payment_status: string
  created_at: string
  shop_order_items: ShopOrderItem[]
}

export type BookingRow = {
  id: string
  service_id: string | null
  nama_pemesan: string
  kontak: string | null
  email: string | null
  jadwal: string | null
  catatan: string | null
  total: number
  dp_amount: number
  status: string
  payment_status: string
  created_at: string
  services: { nama: string } | null
}

type Props = {
  tenantId: string
  namaTenant: string
  page: PageInfo | null
  initialProducts: Product[]
  hasShop: boolean
  hasBooking: boolean
  hasMenu: boolean
  paymentStatus: PaymentStatus
  initialOrders: ShopOrderRow[]
  initialServices: Service[]
  initialBookings: BookingRow[]
  initialMenu: MenuItem[]
}

type Draft = { nama: string; harga: string; kategori: string; gambar_url: string; deskripsi: string; stok: string }
const EMPTY: Draft = { nama: '', harga: '', kategori: '', gambar_url: '', deskripsi: '', stok: '' }

export default function PortalDashboard({ tenantId, namaTenant, page, initialProducts, hasShop, hasBooking, hasMenu, paymentStatus, initialOrders, initialServices, initialBookings, initialMenu }: Props) {
  const router = useRouter()
  const supabase = createClient()
  type Tab = 'produk' | 'pesanan' | 'layanan' | 'reservasi' | 'menu' | 'pembayaran'
  const [tab, setTab] = useState<Tab>(hasShop ? 'produk' : hasBooking ? 'layanan' : hasMenu ? 'menu' : 'pembayaran')
  const [items, setItems] = useState<Product[]>(initialProducts)
  const [add, setAdd] = useState<Draft>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [busy, setBusy] = useState<string | null>(null)

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/portal/login')
    router.refresh()
  }

  // ── CRUD lewat anon client + sesi → RLS yang menegakkan isolasi tenant ──
  const create = async () => {
    if (!page) return
    if (!add.nama.trim()) return alert('Nama produk wajib')
    setBusy('add')
    try {
      const { data, error } = await supabase.from('products').insert({
        page_id: page.id,
        tenant_id: tenantId,
        nama: add.nama,
        harga: Number(add.harga) || 0,
        kategori: add.kategori || null,
        gambar_url: add.gambar_url || null,
        deskripsi: add.deskripsi || null,
        stok: add.stok === '' ? null : Number(add.stok),
        is_active: true,
      } as never).select().single()
      if (error) throw error
      setItems((p) => [...p, data as Product])
      setAdd(EMPTY)
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }

  const startEdit = (it: Product) => {
    setEditId(it.id)
    setDraft({
      nama: it.nama ?? '', harga: it.harga != null ? String(it.harga) : '',
      kategori: it.kategori ?? '', gambar_url: it.gambar_url ?? '',
      deskripsi: it.deskripsi ?? '', stok: it.stok != null ? String(it.stok) : '',
    })
  }
  const saveEdit = async (id: string) => {
    if (!draft.nama.trim()) return alert('Nama produk wajib')
    setBusy(id)
    try {
      const { data, error } = await supabase.from('products').update({
        nama: draft.nama, harga: Number(draft.harga) || 0,
        kategori: draft.kategori || null, gambar_url: draft.gambar_url || null,
        deskripsi: draft.deskripsi || null, stok: draft.stok === '' ? null : Number(draft.stok),
      } as never).eq('id', id).select().single()
      if (error) throw error
      setItems((p) => p.map((x) => (x.id === id ? (data as Product) : x)))
      setEditId(null)
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const toggle = async (it: Product) => {
    setBusy(it.id)
    try {
      const { data, error } = await supabase.from('products')
        .update({ is_active: !it.is_active } as never).eq('id', it.id).select().single()
      if (error) throw error
      setItems((p) => p.map((x) => (x.id === it.id ? (data as Product) : x)))
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const remove = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return
    setBusy(id)
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      setItems((p) => p.filter((x) => x.id !== id))
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }

  const inp = 'text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none'

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <header className="bg-white border-b border-black/5 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dashboard Website</p>
            <h1 className="text-lg font-bold text-gray-900">{namaTenant}</h1>
          </div>
          <div className="flex items-center gap-2">
            {page?.status === 'published' && page.slug && (
              <a href={`/${page.slug}`} target="_blank" className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-black/10 text-gray-600 text-[11px] font-bold uppercase hover:border-apple-blue/30 hover:text-apple-blue transition-colors">
                <ExternalLink size={14} /> Lihat Website
              </a>
            )}
            <button onClick={logout} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-red-500 text-[11px] font-bold uppercase hover:bg-red-50 transition-colors">
              <LogOut size={14} /> Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {!page ? (
          <div className="bg-white rounded-3xl p-12 text-center apple-shadow border border-black/5">
            <p className="text-gray-500">Website Anda sedang disiapkan oleh tim. Silakan cek kembali nanti.</p>
          </div>
        ) : !hasShop && !hasBooking && !hasMenu ? (
          <div className="bg-white rounded-3xl p-12 text-center apple-shadow border border-black/5">
            <Package size={40} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-1">Belum ada fitur yang bisa dikelola sendiri</h2>
            <p className="text-sm text-gray-500">Website Anda belum mengaktifkan fitur toko, booking, atau menu. Hubungi tim untuk perubahan konten.</p>
          </div>
        ) : (
        <>
          {/* Tab nav */}
          <div className="flex flex-wrap gap-2 mb-6">
            {hasShop && (
              <button onClick={() => setTab('produk')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'produk' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                <ShoppingBag size={14} /> Produk
              </button>
            )}
            {hasShop && (
              <button onClick={() => setTab('pesanan')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'pesanan' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                <Receipt size={14} /> Pesanan
              </button>
            )}
            {hasBooking && (
              <button onClick={() => setTab('layanan')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'layanan' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                <Briefcase size={14} /> Layanan
              </button>
            )}
            {hasBooking && (
              <button onClick={() => setTab('reservasi')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'reservasi' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                <CalendarClock size={14} /> Reservasi
              </button>
            )}
            {hasMenu && (
              <button onClick={() => setTab('menu')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'menu' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                <UtensilsCrossed size={14} /> Menu
              </button>
            )}
            <button onClick={() => setTab('pembayaran')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'pembayaran' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
              <CreditCard size={14} /> Pembayaran
            </button>
          </div>

          {tab === 'pembayaran' ? (
            <PaymentPanel initial={paymentStatus} />
          ) : tab === 'pesanan' ? (
            <OrdersPanel initial={initialOrders} />
          ) : tab === 'layanan' ? (
            <ServicePanel page={page} tenantId={tenantId} initial={initialServices} />
          ) : tab === 'reservasi' ? (
            <BookingsPanel initial={initialBookings} />
          ) : tab === 'menu' ? (
            <MenuPanel page={page} tenantId={tenantId} initial={initialMenu} />
          ) : (
          <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Produk Toko</h2>
              <span className="text-xs text-gray-400 font-medium">{items.length} produk</span>
            </div>

            {/* form tambah */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-6">
              <input value={add.nama} onChange={(e) => setAdd({ ...add, nama: e.target.value })} placeholder="Nama produk *" className={`${inp} sm:col-span-2`} />
              <input value={add.harga} onChange={(e) => setAdd({ ...add, harga: e.target.value })} placeholder="Harga" inputMode="numeric" className={inp} />
              <input value={add.kategori} onChange={(e) => setAdd({ ...add, kategori: e.target.value })} placeholder="Kategori" className={inp} />
              <input value={add.gambar_url} onChange={(e) => setAdd({ ...add, gambar_url: e.target.value })} placeholder="URL gambar (opsional)" className={`${inp} sm:col-span-3`} />
              <button disabled={busy === 'add'} onClick={create} className="flex items-center justify-center gap-1 py-2.5 bg-apple-blue text-white rounded-lg text-[11px] font-bold uppercase hover:bg-blue-600 disabled:opacity-50">
                {busy === 'add' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Tambah
              </button>
            </div>

            {/* daftar */}
            {items.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Belum ada produk. Tambahkan produk pertama Anda di atas.</p>
            ) : (
              <div className="space-y-2">
                {items.map((it) =>
                  editId === it.id ? (
                    <div key={it.id} className="p-3 bg-blue-50/40 rounded-xl border border-apple-blue/20 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input value={draft.nama} onChange={(e) => setDraft({ ...draft, nama: e.target.value })} placeholder="Nama *" className={`${inp} sm:col-span-2`} />
                        <input value={draft.harga} onChange={(e) => setDraft({ ...draft, harga: e.target.value })} placeholder="Harga" inputMode="numeric" className={inp} />
                        <input value={draft.kategori} onChange={(e) => setDraft({ ...draft, kategori: e.target.value })} placeholder="Kategori" className={inp} />
                        <input value={draft.gambar_url} onChange={(e) => setDraft({ ...draft, gambar_url: e.target.value })} placeholder="URL gambar" className={`${inp} sm:col-span-3`} />
                        <input value={draft.stok} onChange={(e) => setDraft({ ...draft, stok: e.target.value })} placeholder="Stok" inputMode="numeric" className={inp} />
                        <textarea value={draft.deskripsi} onChange={(e) => setDraft({ ...draft, deskripsi: e.target.value })} placeholder="Deskripsi" rows={2} className={`${inp} sm:col-span-4`} />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditId(null)} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-gray-500 hover:bg-white">Batal</button>
                        <button onClick={() => saveEdit(it.id)} disabled={busy === it.id} className="flex items-center gap-1 px-4 py-1.5 bg-apple-blue text-white rounded-lg text-[11px] font-bold uppercase hover:bg-blue-600 disabled:opacity-50">
                          {busy === it.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Simpan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div key={it.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-black/5">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{it.nama} {!it.is_active && <span className="text-[10px] text-gray-400 uppercase">(non-aktif)</span>}</p>
                        <p className="text-xs text-gray-500">Rp {Number(it.harga).toLocaleString('id-ID')}{it.kategori ? ` · ${it.kategori}` : ''}{it.stok != null ? ` · stok ${it.stok}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => startEdit(it)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-white text-gray-500" title="Edit"><Pencil size={14} /></button>
                        <button onClick={() => toggle(it)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-white" title={it.is_active ? 'Sembunyikan' : 'Tampilkan'}>
                          {it.is_active ? <Eye size={14} /> : <EyeOff size={14} className="text-gray-400" />}
                        </button>
                        <button onClick={() => remove(it.id)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Hapus"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          )}
        </>
        )}
      </main>
    </div>
  )
}

// ── Panel konfigurasi pembayaran (Midtrans milik klien) ──────────
function PaymentPanel({ initial }: { initial: PaymentStatus }) {
  const [status, setStatus] = useState<PaymentStatus>(initial)
  const [serverKey, setServerKey] = useState('')
  const [clientKey, setClientKey] = useState(initial.clientKey ?? '')
  const [isProduction, setIsProduction] = useState(initial.isProduction)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const save = async (extra?: Partial<{ isActive: boolean }>) => {
    // Pengaman: cegah key tertukar (Server ⇄ Client) — kesalahan paling umum.
    const sk = serverKey.trim()
    if (sk && /client/i.test(sk)) {
      setMsg('Server Key tampak seperti Client Key (mengandung kata "client"). Periksa kembali — Server Key diawali "Mid-server-" atau "SB-Mid-server-".')
      return
    }
    if (clientKey && /server/i.test(clientKey)) {
      setMsg('Client Key tampak seperti Server Key (mengandung kata "server"). Field ini untuk Client Key yang diawali "Mid-client-".')
      return
    }
    setBusy(true); setMsg(null)
    try {
      const body: Record<string, unknown> = { clientKey: clientKey || null, isProduction, ...extra }
      if (sk) body.serverKey = sk
      const res = await fetch('/api/portal/payment', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) { setMsg(`Gagal: ${json.error}`); return }
      setStatus(json.status)
      setServerKey('') // jangan tahan plaintext di state
      setMsg('Tersimpan.')
    } catch { setMsg('Error koneksi') } finally { setBusy(false) }
  }

  const inp = 'w-full text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none'

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Pembayaran Online (Midtrans)</h2>
      <p className="text-sm text-gray-500 mb-5">
        Hubungkan akun Midtrans Anda agar pembeli bisa bayar online. <strong>Uang masuk langsung ke rekening Anda.</strong>
      </p>

      <div className="flex items-center gap-2 mb-5">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${status.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
          {status.isActive ? 'Aktif' : status.configured ? 'Tersimpan (nonaktif)' : 'Belum dikonfigurasi'}
        </span>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500">
          Mode: {status.isProduction ? 'Production' : 'Sandbox'}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Server Key {status.configured && <span className="text-green-600">(sudah tersimpan — isi untuk ganti)</span>}</label>
          <input type="password" value={serverKey} onChange={(e) => setServerKey(e.target.value)} placeholder={status.configured ? '••••••••••••' : 'Mid-server-xxxxxxxx'} className={inp} autoComplete="off" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client Key</label>
          <input value={clientKey} onChange={(e) => setClientKey(e.target.value)} placeholder="Mid-client-xxxxxxxx" className={inp} autoComplete="off" />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={isProduction} onChange={(e) => setIsProduction(e.target.checked)} />
          Mode Production (matikan untuk uji coba / Sandbox)
        </label>
        {isProduction ? (
          <p className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg p-2.5 leading-relaxed">
            ⚠ <strong>Mode Production aktif</strong> — transaksi memakai <strong>UANG ASLI</strong> dan butuh key produksi.
            Untuk uji coba (key sandbox), matikan centang ini agar memakai <strong>Sandbox</strong>.
          </p>
        ) : (
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Mode <strong>Sandbox</strong> (uji coba) — gunakan key sandbox dari dashboard Midtrans Anda. Tidak ada uang asli berpindah.
          </p>
        )}
      </div>

      {msg && <p className="text-xs mt-3 text-gray-500">{msg}</p>}

      <div className="flex gap-2 mt-5">
        <button onClick={() => save()} disabled={busy} className="flex items-center gap-1 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[11px] font-bold uppercase hover:bg-gray-800 disabled:opacity-50">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Simpan
        </button>
        {status.configured && !status.isActive && (
          <button onClick={() => save({ isActive: true })} disabled={busy} className="px-5 py-2.5 bg-apple-blue text-white rounded-xl text-[11px] font-bold uppercase hover:bg-blue-600 disabled:opacity-50">
            Aktifkan
          </button>
        )}
        {status.isActive && (
          <button onClick={() => save({ isActive: false })} disabled={busy} className="px-5 py-2.5 border border-black/10 text-gray-500 rounded-xl text-[11px] font-bold uppercase hover:bg-gray-50 disabled:opacity-50">
            Nonaktifkan
          </button>
        )}
      </div>

      <p className="text-[11px] text-gray-400 mt-5 leading-relaxed">
        Dapatkan Server Key & Client Key dari dashboard Midtrans Anda (Settings → Access Keys),
        lalu tempel di atas & Aktifkan — pembayaran langsung berfungsi. Gunakan mode Sandbox untuk
        uji coba sebelum Production. Status pesanan diperbarui otomatis (tak perlu setel apa pun
        lagi di Midtrans).
      </p>
    </div>
  )
}

// ── Panel pesanan toko (klien lihat & kelola pesanan masuk) ──────
const FULFILL_STEPS = ['paid', 'processing', 'shipped', 'done'] as const
const STATUS_LABEL: Record<string, string> = {
  pending: 'Belum bayar', paid: 'Dibayar', processing: 'Diproses',
  shipped: 'Dikirim', done: 'Selesai', cancelled: 'Dibatalkan',
}
const PAY_BADGE: Record<string, string> = {
  paid: 'bg-green-50 text-green-600', awaiting_payment: 'bg-amber-50 text-amber-600',
  unpaid: 'bg-gray-100 text-gray-500', failed: 'bg-red-50 text-red-500', expired: 'bg-red-50 text-red-500',
}

function rupiah2(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

function OrdersPanel({ initial }: { initial: ShopOrderRow[] }) {
  const supabase = createClient()
  const [orders, setOrders] = useState<ShopOrderRow[]>(initial)
  const [busy, setBusy] = useState<string | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Saat tab Pesanan dibuka: minta server cek status ke Midtrans (zero-config,
  // tanpa webhook). Kalau ada yang berubah, muat ulang daftar dari DB.
  const reload = async () => {
    const { data } = await supabase
      .from('shop_orders').select('*, shop_order_items(*)')
      .order('created_at', { ascending: false }).limit(100)
    if (data) setOrders(data as ShopOrderRow[])
  }
  useEffect(() => {
    let alive = true
    ;(async () => {
      setRefreshing(true)
      try {
        const res = await fetch('/api/portal/orders/refresh', { method: 'POST' })
        const json = await res.json().catch(() => ({}))
        if (alive && json?.updated > 0) await reload()
      } catch { /* noop */ } finally { if (alive) setRefreshing(false) }
    })()
    return () => { alive = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setStatus = async (id: string, status: string) => {
    setBusy(id)
    try {
      const { data, error } = await supabase.from('shop_orders')
        .update({ status } as never).eq('id', id).select('*, shop_order_items(*)').single()
      if (error) throw error
      setOrders((p) => p.map((o) => (o.id === id ? (data as ShopOrderRow) : o)))
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }

  const paidOrders = orders.filter((o) => o.payment_status === 'paid')

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Pesanan Masuk</h2>
        <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
          {refreshing && <Loader2 size={12} className="animate-spin" />}
          {paidOrders.length} dibayar · {orders.length} total
        </span>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum ada pesanan. Pesanan dari pembeli akan muncul di sini.</p>
      ) : (
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-black/5 bg-gray-50">
              <button onClick={() => setOpen(open === o.id ? null : o.id)} className="w-full flex items-center justify-between gap-3 p-3 text-left">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{o.pembeli_nama} · {rupiah2(Number(o.total))}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    {' · '}#{o.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${PAY_BADGE[o.payment_status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {o.payment_status === 'paid' ? 'Dibayar' : o.payment_status === 'awaiting_payment' ? 'Menunggu' : o.payment_status}
                  </span>
                </div>
              </button>

              {open === o.id && (
                <div className="px-3 pb-3 space-y-3 border-t border-black/5 pt-3">
                  {/* item */}
                  <div className="space-y-1">
                    {o.shop_order_items?.map((it) => (
                      <div key={it.id} className="flex justify-between text-xs text-gray-600">
                        <span>{it.nama} ×{it.qty}</span><span>{rupiah2(Number(it.subtotal))}</span>
                      </div>
                    ))}
                  </div>
                  {/* kontak */}
                  <div className="text-xs text-gray-500 space-y-0.5">
                    {o.pembeli_hp && <p>WA: <a href={`https://wa.me/${o.pembeli_hp}`} target="_blank" className="text-apple-blue font-bold">{o.pembeli_hp}</a></p>}
                    {o.alamat && <p>Alamat: {o.alamat}</p>}
                    {o.catatan && <p>Catatan: {o.catatan}</p>}
                  </div>
                  {/* aksi status fulfilment (hanya kalau sudah dibayar) */}
                  {o.payment_status === 'paid' && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {FULFILL_STEPS.map((s) => (
                        <button key={s} onClick={() => setStatus(o.id, s)} disabled={busy === o.id || o.status === s}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${o.status === s ? 'bg-apple-blue text-white' : 'border border-black/10 text-gray-500 hover:text-apple-blue'}`}>
                          {STATUS_LABEL[s]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Panel layanan (booking) — klien kelola daftar layanannya ─────
type SvcDraft = { nama: string; harga: string; dp_amount: string; durasi_menit: string; kategori: string; gambar_url: string; deskripsi: string }
const SVC_EMPTY: SvcDraft = { nama: '', harga: '', dp_amount: '', durasi_menit: '', kategori: '', gambar_url: '', deskripsi: '' }

function ServicePanel({ page, tenantId, initial }: { page: PageInfo | null; tenantId: string; initial: Service[] }) {
  const supabase = createClient()
  const [items, setItems] = useState<Service[]>(initial)
  const [add, setAdd] = useState<SvcDraft>(SVC_EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [draft, setDraft] = useState<SvcDraft>(SVC_EMPTY)
  const [busy, setBusy] = useState<string | null>(null)
  const inp = 'text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none'

  const payload = (d: SvcDraft) => ({
    nama: d.nama,
    harga: Number(d.harga) || 0,
    dp_amount: Number(d.dp_amount) || 0,
    durasi_menit: d.durasi_menit === '' ? null : Number(d.durasi_menit),
    kategori: d.kategori || null,
    gambar_url: d.gambar_url || null,
    deskripsi: d.deskripsi || null,
  })

  const create = async () => {
    if (!page) return
    if (!add.nama.trim()) return alert('Nama layanan wajib')
    setBusy('add')
    try {
      const { data, error } = await supabase.from('services')
        .insert({ page_id: page.id, tenant_id: tenantId, is_active: true, ...payload(add) } as never)
        .select().single()
      if (error) throw error
      setItems((p) => [...p, data as Service])
      setAdd(SVC_EMPTY)
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const startEdit = (s: Service) => {
    setEditId(s.id)
    setDraft({
      nama: s.nama ?? '', harga: s.harga != null ? String(s.harga) : '',
      dp_amount: s.dp_amount != null ? String(s.dp_amount) : '',
      durasi_menit: s.durasi_menit != null ? String(s.durasi_menit) : '',
      kategori: s.kategori ?? '', gambar_url: s.gambar_url ?? '', deskripsi: s.deskripsi ?? '',
    })
  }
  const saveEdit = async (id: string) => {
    if (!draft.nama.trim()) return alert('Nama layanan wajib')
    setBusy(id)
    try {
      const { data, error } = await supabase.from('services')
        .update(payload(draft) as never).eq('id', id).select().single()
      if (error) throw error
      setItems((p) => p.map((x) => (x.id === id ? (data as Service) : x)))
      setEditId(null)
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const toggle = async (s: Service) => {
    setBusy(s.id)
    try {
      const { data, error } = await supabase.from('services')
        .update({ is_active: !s.is_active } as never).eq('id', s.id).select().single()
      if (error) throw error
      setItems((p) => p.map((x) => (x.id === s.id ? (data as Service) : x)))
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const remove = async (id: string) => {
    if (!confirm('Hapus layanan ini?')) return
    setBusy(id)
    try {
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) throw error
      setItems((p) => p.filter((x) => x.id !== id))
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Layanan</h2>
        <span className="text-xs text-gray-400 font-medium">{items.length} layanan</span>
      </div>

      {/* form tambah */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
        <input value={add.nama} onChange={(e) => setAdd({ ...add, nama: e.target.value })} placeholder="Nama layanan *" className={`${inp} sm:col-span-2`} />
        <input value={add.harga} onChange={(e) => setAdd({ ...add, harga: e.target.value })} placeholder="Harga penuh" inputMode="numeric" className={inp} />
        <input value={add.dp_amount} onChange={(e) => setAdd({ ...add, dp_amount: e.target.value })} placeholder="DP/booking fee (0=tanpa)" inputMode="numeric" className={inp} />
        <input value={add.durasi_menit} onChange={(e) => setAdd({ ...add, durasi_menit: e.target.value })} placeholder="Durasi (menit)" inputMode="numeric" className={inp} />
        <input value={add.kategori} onChange={(e) => setAdd({ ...add, kategori: e.target.value })} placeholder="Kategori" className={inp} />
        <input value={add.gambar_url} onChange={(e) => setAdd({ ...add, gambar_url: e.target.value })} placeholder="URL gambar (opsional)" className={`${inp} sm:col-span-2`} />
      </div>
      <div className="flex justify-end mb-6">
        <button disabled={busy === 'add'} onClick={create} className="flex items-center justify-center gap-1 px-5 py-2.5 bg-apple-blue text-white rounded-lg text-[11px] font-bold uppercase hover:bg-blue-600 disabled:opacity-50">
          {busy === 'add' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Tambah Layanan
        </button>
      </div>
      <p className="text-[11px] text-gray-400 mb-5 -mt-4">DP/booking fee = nominal yang dibayar online saat booking. Isi 0 jika reservasi tanpa pembayaran online (bayar di tempat).</p>

      {/* daftar */}
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum ada layanan. Tambahkan layanan pertama Anda di atas.</p>
      ) : (
        <div className="space-y-2">
          {items.map((it) =>
            editId === it.id ? (
              <div key={it.id} className="p-3 bg-blue-50/40 rounded-xl border border-apple-blue/20 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input value={draft.nama} onChange={(e) => setDraft({ ...draft, nama: e.target.value })} placeholder="Nama *" className={`${inp} sm:col-span-2`} />
                  <input value={draft.harga} onChange={(e) => setDraft({ ...draft, harga: e.target.value })} placeholder="Harga penuh" inputMode="numeric" className={inp} />
                  <input value={draft.dp_amount} onChange={(e) => setDraft({ ...draft, dp_amount: e.target.value })} placeholder="DP" inputMode="numeric" className={inp} />
                  <input value={draft.durasi_menit} onChange={(e) => setDraft({ ...draft, durasi_menit: e.target.value })} placeholder="Durasi (menit)" inputMode="numeric" className={inp} />
                  <input value={draft.kategori} onChange={(e) => setDraft({ ...draft, kategori: e.target.value })} placeholder="Kategori" className={inp} />
                  <input value={draft.gambar_url} onChange={(e) => setDraft({ ...draft, gambar_url: e.target.value })} placeholder="URL gambar" className={`${inp} sm:col-span-2`} />
                  <textarea value={draft.deskripsi} onChange={(e) => setDraft({ ...draft, deskripsi: e.target.value })} placeholder="Deskripsi" rows={2} className={`${inp} sm:col-span-4`} />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditId(null)} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-gray-500 hover:bg-white">Batal</button>
                  <button onClick={() => saveEdit(it.id)} disabled={busy === it.id} className="flex items-center gap-1 px-4 py-1.5 bg-apple-blue text-white rounded-lg text-[11px] font-bold uppercase hover:bg-blue-600 disabled:opacity-50">
                    {busy === it.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Simpan
                  </button>
                </div>
              </div>
            ) : (
              <div key={it.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-black/5">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{it.nama} {!it.is_active && <span className="text-[10px] text-gray-400 uppercase">(non-aktif)</span>}</p>
                  <p className="text-xs text-gray-500">
                    Rp {Number(it.harga).toLocaleString('id-ID')}
                    {it.dp_amount > 0 ? ` · DP Rp ${Number(it.dp_amount).toLocaleString('id-ID')}` : ' · tanpa DP'}
                    {it.durasi_menit ? ` · ${it.durasi_menit} mnt` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(it)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-white text-gray-500" title="Edit"><Pencil size={14} /></button>
                  <button onClick={() => toggle(it)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-white" title={it.is_active ? 'Sembunyikan' : 'Tampilkan'}>
                    {it.is_active ? <Eye size={14} /> : <EyeOff size={14} className="text-gray-400" />}
                  </button>
                  <button onClick={() => remove(it.id)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Hapus"><Trash2 size={14} /></button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

// ── Panel reservasi (booking) — klien lihat & kelola reservasi ───
const BOOK_STEPS = ['confirmed', 'done', 'cancelled'] as const
const BOOK_STATUS_LABEL: Record<string, string> = {
  pending: 'Baru', confirmed: 'Dikonfirmasi', done: 'Selesai', cancelled: 'Dibatalkan',
}

function BookingsPanel({ initial }: { initial: BookingRow[] }) {
  const supabase = createClient()
  const [bookings, setBookings] = useState<BookingRow[]>(initial)
  const [busy, setBusy] = useState<string | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const reload = async () => {
    const { data } = await supabase
      .from('bookings').select('*, services(nama)')
      .order('created_at', { ascending: false }).limit(100)
    if (data) setBookings(data as BookingRow[])
  }
  useEffect(() => {
    let alive = true
    ;(async () => {
      setRefreshing(true)
      try {
        const res = await fetch('/api/portal/bookings/refresh', { method: 'POST' })
        const json = await res.json().catch(() => ({}))
        if (alive && json?.updated > 0) await reload()
      } catch { /* noop */ } finally { if (alive) setRefreshing(false) }
    })()
    return () => { alive = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setStatus = async (id: string, status: string) => {
    setBusy(id)
    try {
      const { data, error } = await supabase.from('bookings')
        .update({ status } as never).eq('id', id).select('*, services(nama)').single()
      if (error) throw error
      setBookings((p) => p.map((b) => (b.id === id ? (data as BookingRow) : b)))
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Reservasi Masuk</h2>
        <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
          {refreshing && <Loader2 size={12} className="animate-spin" />}
          {bookings.length} total
        </span>
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum ada reservasi. Booking dari pelanggan akan muncul di sini.</p>
      ) : (
        <div className="space-y-2">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-xl border border-black/5 bg-gray-50">
              <button onClick={() => setOpen(open === b.id ? null : b.id)} className="w-full flex items-center justify-between gap-3 p-3 text-left">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{b.nama_pemesan} · {b.services?.nama ?? 'Layanan'}</p>
                  <p className="text-xs text-gray-500">
                    {b.jadwal ? new Date(b.jadwal).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Jadwal belum ditentukan'}
                    {' · '}#{b.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {b.dp_amount > 0 && (
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${PAY_BADGE[b.payment_status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {b.payment_status === 'paid' ? 'DP Lunas' : b.payment_status === 'awaiting_payment' ? 'Menunggu' : b.payment_status}
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500">
                    {BOOK_STATUS_LABEL[b.status] ?? b.status}
                  </span>
                </div>
              </button>

              {open === b.id && (
                <div className="px-3 pb-3 space-y-3 border-t border-black/5 pt-3">
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <p>Layanan: <span className="text-gray-900 font-medium">{b.services?.nama ?? '-'}</span>{b.total > 0 ? ` (${rupiah2(Number(b.total))})` : ''}</p>
                    {b.dp_amount > 0 && <p>DP: {rupiah2(Number(b.dp_amount))}</p>}
                    {b.kontak && <p>Kontak: <a href={`https://wa.me/${b.kontak}`} target="_blank" className="text-apple-blue font-bold">{b.kontak}</a></p>}
                    {b.email && <p>Email: {b.email}</p>}
                    {b.catatan && <p>Catatan: {b.catatan}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {BOOK_STEPS.map((s) => (
                      <button key={s} onClick={() => setStatus(b.id, s)} disabled={busy === b.id || b.status === s}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${b.status === s ? 'bg-apple-blue text-white' : 'border border-black/10 text-gray-500 hover:text-apple-blue'}`}>
                        {BOOK_STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Panel menu (resto) — pemilik kelola daftar menu sendiri ──────
type MenuDraft = { nama: string; harga: string; kategori: string; deskripsi: string; gambar_url: string }
const MENU_EMPTY: MenuDraft = { nama: '', harga: '', kategori: '', deskripsi: '', gambar_url: '' }

function MenuPanel({ page, tenantId, initial }: { page: PageInfo | null; tenantId: string; initial: MenuItem[] }) {
  const supabase = createClient()
  const [items, setItems] = useState<MenuItem[]>(initial)
  const [add, setAdd] = useState<MenuDraft>(MENU_EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [draft, setDraft] = useState<MenuDraft>(MENU_EMPTY)
  const [busy, setBusy] = useState<string | null>(null)
  const inp = 'text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none'

  const payload = (d: MenuDraft) => ({
    nama: d.nama,
    harga: Number(d.harga) || 0,
    kategori: d.kategori || null,
    deskripsi: d.deskripsi || null,
    gambar_url: d.gambar_url || null,
  })

  const create = async () => {
    if (!page) return
    if (!add.nama.trim()) return alert('Nama menu wajib')
    setBusy('add')
    try {
      const { data, error } = await supabase.from('menu_items')
        .insert({ page_id: page.id, tenant_id: tenantId, is_active: true, ...payload(add) } as never)
        .select().single()
      if (error) throw error
      setItems((p) => [...p, data as MenuItem])
      setAdd(MENU_EMPTY)
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const startEdit = (m: MenuItem) => {
    setEditId(m.id)
    setDraft({
      nama: m.nama ?? '', harga: m.harga != null ? String(m.harga) : '',
      kategori: m.kategori ?? '', deskripsi: m.deskripsi ?? '', gambar_url: m.gambar_url ?? '',
    })
  }
  const saveEdit = async (id: string) => {
    if (!draft.nama.trim()) return alert('Nama menu wajib')
    setBusy(id)
    try {
      const { data, error } = await supabase.from('menu_items')
        .update(payload(draft) as never).eq('id', id).select().single()
      if (error) throw error
      setItems((p) => p.map((x) => (x.id === id ? (data as MenuItem) : x)))
      setEditId(null)
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const toggle = async (m: MenuItem) => {
    setBusy(m.id)
    try {
      const { data, error } = await supabase.from('menu_items')
        .update({ is_active: !m.is_active } as never).eq('id', m.id).select().single()
      if (error) throw error
      setItems((p) => p.map((x) => (x.id === m.id ? (data as MenuItem) : x)))
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const remove = async (id: string) => {
    if (!confirm('Hapus menu ini?')) return
    setBusy(id)
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id)
      if (error) throw error
      setItems((p) => p.filter((x) => x.id !== id))
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Menu</h2>
        <span className="text-xs text-gray-400 font-medium">{items.length} item</span>
      </div>

      {/* form tambah */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
        <input value={add.nama} onChange={(e) => setAdd({ ...add, nama: e.target.value })} placeholder="Nama menu *" className={`${inp} sm:col-span-2`} />
        <input value={add.harga} onChange={(e) => setAdd({ ...add, harga: e.target.value })} placeholder="Harga" inputMode="numeric" className={inp} />
        <input value={add.kategori} onChange={(e) => setAdd({ ...add, kategori: e.target.value })} placeholder="Kategori (mis. Pembuka)" className={inp} />
        <input value={add.gambar_url} onChange={(e) => setAdd({ ...add, gambar_url: e.target.value })} placeholder="URL gambar (opsional)" className={`${inp} sm:col-span-2`} />
        <input value={add.deskripsi} onChange={(e) => setAdd({ ...add, deskripsi: e.target.value })} placeholder="Deskripsi (opsional)" className={`${inp} sm:col-span-2`} />
      </div>
      <div className="flex justify-end mb-6">
        <button disabled={busy === 'add'} onClick={create} className="flex items-center justify-center gap-1 px-5 py-2.5 bg-apple-blue text-white rounded-lg text-[11px] font-bold uppercase hover:bg-blue-600 disabled:opacity-50">
          {busy === 'add' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Tambah Menu
        </button>
      </div>

      {/* daftar */}
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum ada menu. Tambahkan item pertama Anda di atas.</p>
      ) : (
        <div className="space-y-2">
          {items.map((it) =>
            editId === it.id ? (
              <div key={it.id} className="p-3 bg-blue-50/40 rounded-xl border border-apple-blue/20 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input value={draft.nama} onChange={(e) => setDraft({ ...draft, nama: e.target.value })} placeholder="Nama *" className={`${inp} sm:col-span-2`} />
                  <input value={draft.harga} onChange={(e) => setDraft({ ...draft, harga: e.target.value })} placeholder="Harga" inputMode="numeric" className={inp} />
                  <input value={draft.kategori} onChange={(e) => setDraft({ ...draft, kategori: e.target.value })} placeholder="Kategori" className={inp} />
                  <input value={draft.gambar_url} onChange={(e) => setDraft({ ...draft, gambar_url: e.target.value })} placeholder="URL gambar" className={`${inp} sm:col-span-2`} />
                  <input value={draft.deskripsi} onChange={(e) => setDraft({ ...draft, deskripsi: e.target.value })} placeholder="Deskripsi" className={`${inp} sm:col-span-2`} />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditId(null)} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-gray-500 hover:bg-white">Batal</button>
                  <button onClick={() => saveEdit(it.id)} disabled={busy === it.id} className="flex items-center gap-1 px-4 py-1.5 bg-apple-blue text-white rounded-lg text-[11px] font-bold uppercase hover:bg-blue-600 disabled:opacity-50">
                    {busy === it.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Simpan
                  </button>
                </div>
              </div>
            ) : (
              <div key={it.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-black/5">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{it.nama} {!it.is_active && <span className="text-[10px] text-gray-400 uppercase">(non-aktif)</span>}</p>
                  <p className="text-xs text-gray-500">Rp {Number(it.harga).toLocaleString('id-ID')}{it.kategori ? ` · ${it.kategori}` : ''}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(it)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-white text-gray-500" title="Edit"><Pencil size={14} /></button>
                  <button onClick={() => toggle(it)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-white" title={it.is_active ? 'Sembunyikan' : 'Tampilkan'}>
                    {it.is_active ? <Eye size={14} /> : <EyeOff size={14} className="text-gray-400" />}
                  </button>
                  <button onClick={() => remove(it.id)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Hapus"><Trash2 size={14} /></button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
