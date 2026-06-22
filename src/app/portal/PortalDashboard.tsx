'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Plus, Trash2, Loader2, Eye, EyeOff, Pencil, Check, LogOut, ExternalLink,
  CreditCard, ShoppingBag, Receipt, CalendarClock, Briefcase, UtensilsCrossed,
  FileText, Image as ImageIcon, Store, LayoutTemplate, Monitor, Palette, Lock,
  ClipboardList, BarChart3, Settings, Bike, ChevronUp, ChevronDown, HelpCircle, Quote, MessageCircle,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { getAddon } from '@/lib/addons/catalog'
import { formatMoney, moneyFromConfig } from '@/lib/format-money'
import type { Product, Service, MenuItem, BlogPost, GalleryImage, TenantProfile, PreorderConfig, LocaleConfig } from '@/types/websitebuilder'
import ContentPanel, { type EditableSection } from './ContentPanel'
import ImageUploadField from './ImageUploadField'
import KontenBrandPanel, { type KontenBrandData } from './KontenBrandPanel'
import LivePreview from './LivePreview'
import SampleContentBanner from './SampleContentBanner'
import TampilanPanel, { type TampilanData } from './TampilanPanel'
import NotifPanel from './NotifPanel'
import { HIDEABLE_SECTION_LABEL, type HideableSectionKey } from '@/lib/portal/section-visibility'

type PageInfo = { id: string; nama_website: string; slug: string | null; status: string }
type PaymentStatus = { configured: boolean; isActive: boolean; isProduction: boolean; clientKey: string | null }

export type ShopOrderItem = { id: string; nama: string; harga_satuan: number; qty: number; subtotal: number; hpp_satuan?: number; menu_item_id?: string | null }
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
  // F&B pre-order (null/'shop' = order toko biasa)
  order_kind?: string | null
  fulfillment_type?: string | null
  fulfillment_date?: string | null
  fulfillment_time?: string | null
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
  // Tab etalase (Produk/Layanan) terbuka bila tema merender datanya ATAU
  // add-on aktif — dihitung server (themeContentTabs). hasShop/hasBooking
  // tetap menggate tab transaksi (Pesanan/Reservasi).
  showProduk: boolean
  showLayanan: boolean
  hasMenu: boolean
  hasBlog: boolean
  hasGallery: boolean
  hasPreorder: boolean
  preorder: PreorderConfig
  localeConfig?: LocaleConfig
  contentIsSample: boolean
  kontenBrand: KontenBrandData
  paymentStatus: PaymentStatus
  paymentEntitled: boolean
  initialOrders: ShopOrderRow[]
  initialServices: Service[]
  initialBookings: BookingRow[]
  initialMenu: MenuItem[]
  initialBlog: BlogPost[]
  initialGallery: GalleryImage[]
  initialProfile: TenantProfile | null
  initialSections: EditableSection[]
  initialTampilan: TampilanData
  // Susunan Halaman (di tab Tampilan): bagian pengayaan yang bisa disembunyikan
  // + yang sedang disembunyikan. Kosong → panel tak dirender (tema non-bespoke).
  susunanSections: HideableSectionKey[]
  hiddenSections: HideableSectionKey[]
  // Tenant cutover Portal (source_of_truth='portal'): sembunyikan tab commerce
  // WB-native (Pesanan/PO/Laporan/Setelan PO/Produk/Menu/Pembayaran) + tampilkan
  // banner pengalih ke Portal Operasi. Default false → tenant WB biasa nol regresi.
  portalManaged?: boolean
  portalAdminUrl?: string
}

type Draft = { nama: string; harga: string; kategori: string; gambar_url: string; deskripsi: string; stok: string }
const EMPTY: Draft = { nama: '', harga: '', kategori: '', gambar_url: '', deskripsi: '', stok: '' }

// Geser item index `idx` ke arah `dir` (-1 naik / +1 turun) lalu tetapkan
// `urutan = posisi baru` untuk seluruh list. Kembalikan list baru + hanya baris
// yang urutannya berubah (umumnya 2 untuk satu tukar — minim write). null bila
// gerakan keluar batas. Dipakai semua panel etalase + galeri.
function reorderList<T extends { id: string; urutan: number }>(items: T[], idx: number, dir: -1 | 1) {
  const j = idx + dir
  if (j < 0 || j >= items.length) return null
  const arr = [...items]
  ;[arr[idx], arr[j]] = [arr[j], arr[idx]]
  const updates: { id: string; urutan: number }[] = []
  const next = arr.map((it, i) => {
    if (it.urutan !== i) updates.push({ id: it.id, urutan: i })
    return { ...it, urutan: i }
  })
  return { next, updates }
}

export default function PortalDashboard({ tenantId, namaTenant, page, initialProducts, hasShop, hasBooking, showProduk, showLayanan, hasMenu, hasBlog, hasGallery, hasPreorder, preorder, localeConfig, contentIsSample, kontenBrand, paymentStatus, paymentEntitled, initialOrders, initialServices, initialBookings, initialMenu, initialBlog, initialGallery, initialProfile, initialSections, initialTampilan, susunanSections, hiddenSections, portalManaged, portalAdminUrl }: Props) {
  const router = useRouter()
  const supabase = createClient()
  type Tab = 'konten' | 'tampilan' | 'produk' | 'pesanan' | 'pesanan-po' | 'laporan' | 'po-settings' | 'layanan' | 'reservasi' | 'menu' | 'blog' | 'galeri' | 'profil' | 'pembayaran' | 'notif'
  const hasBrand = kontenBrand.flags.stats || kontenBrand.flags.faq || kontenBrand.flags.statement
  const hasContent = initialSections.length > 0 || hasBrand
  const [tab, setTab] = useState<Tab>(hasContent ? 'konten' : showProduk ? 'produk' : showLayanan ? 'layanan' : hasMenu ? 'menu' : hasBlog ? 'blog' : 'profil')
  const [items, setItems] = useState<Product[]>(initialProducts)
  const [add, setAdd] = useState<Draft>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [busy, setBusy] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

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
  const move = async (idx: number, dir: -1 | 1) => {
    const res = reorderList(items, idx, dir)
    if (!res) return
    const prev = items
    setItems(res.next)
    setBusy('reorder')
    try {
      await Promise.all(res.updates.map((u) =>
        supabase.from('products').update({ urutan: u.urutan } as never).eq('id', u.id)))
    } catch (e: any) { alert(`Gagal mengurutkan: ${e.message}`); setItems(prev) } finally { setBusy(null) }
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
            {page && (
              <button onClick={() => setShowPreview((v) => !v)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-[11px] font-bold uppercase transition-colors ${showPreview ? 'border-apple-blue/40 text-apple-blue bg-blue-50/40' : 'border-black/10 text-gray-600 hover:border-apple-blue/30 hover:text-apple-blue'}`}>
                <Monitor size={14} /> Preview
              </button>
            )}
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
        ) : (
        <>
          {showPreview && (
            <LivePreview slug={page.slug} published={page.status === 'published'} onClose={() => setShowPreview(false)} />
          )}

          {/* Banner cutover Portal: order/katalog/bayar dikelola di Portal Operasi eksternal. */}
          {portalManaged && (
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-apple-blue/20 bg-apple-blue/5 px-5 py-4 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-start gap-3">
                <Store size={18} className="mt-0.5 shrink-0 text-apple-blue" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Pesanan, katalog &amp; pembayaran dikelola di Portal Operasi</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-gray-500">
                    {`Stok, menu, pesanan masuk, dan pembayaran ${namaTenant} diatur di Portal Operasi — bukan di sini. Halaman ini untuk mengelola tampilan & isi website Anda.`}
                  </p>
                </div>
              </div>
              <a
                href={portalAdminUrl || 'https://stock.japanarena.id'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl bg-apple-blue px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white transition hover:brightness-110 sm:self-auto"
              >
                <ExternalLink size={14} /> Buka Portal Operasi
              </a>
            </div>
          )}

          {/* Tab nav */}
          <div className="flex flex-wrap gap-2 mb-6">
            {hasContent && (
              <button onClick={() => setTab('konten')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'konten' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                <LayoutTemplate size={14} /> Konten
              </button>
            )}
            <button onClick={() => setTab('tampilan')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'tampilan' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
              <Palette size={14} /> Tampilan
            </button>
            {showProduk && (
              <button onClick={() => setTab('produk')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'produk' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                <ShoppingBag size={14} /> Produk
              </button>
            )}
            {hasShop && (
              <button onClick={() => setTab('pesanan')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'pesanan' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                <Receipt size={14} /> Pesanan
              </button>
            )}
            {hasPreorder && (
              <button onClick={() => setTab('pesanan-po')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'pesanan-po' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                <ClipboardList size={14} /> Pesanan PO
              </button>
            )}
            {hasPreorder && (
              <button onClick={() => setTab('laporan')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'laporan' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                <BarChart3 size={14} /> Laporan
              </button>
            )}
            {hasPreorder && (
              <button onClick={() => setTab('po-settings')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'po-settings' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                <Settings size={14} /> Setelan PO
              </button>
            )}
            {showLayanan && (
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
            {hasBlog && (
              <button onClick={() => setTab('blog')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'blog' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                <FileText size={14} /> Blog
              </button>
            )}
            {hasGallery && (
              <button onClick={() => setTab('galeri')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'galeri' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                <ImageIcon size={14} /> Galeri
              </button>
            )}
            <button onClick={() => setTab('profil')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'profil' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
              <Store size={14} /> Profil
            </button>
            {!portalManaged && (
              <button onClick={() => setTab('pembayaran')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'pembayaran' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                {paymentEntitled ? <CreditCard size={14} /> : <Lock size={14} />} Pembayaran
              </button>
            )}
            {portalManaged && (
              <button onClick={() => setTab('notif')} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors ${tab === 'notif' ? 'bg-apple-blue text-white' : 'bg-white text-gray-500 border border-black/10 hover:text-apple-blue'}`}>
                <MessageCircle size={14} /> Notifikasi WA
              </button>
            )}
          </div>

          {contentIsSample && (
            <SampleContentBanner tenantId={tenantId} onEdit={() => setTab('konten')} />
          )}

          {tab === 'konten' ? (
            <div className="space-y-6">
              {initialSections.length > 0 && <ContentPanel initial={initialSections} />}
              {hasBrand && <KontenBrandPanel initial={kontenBrand} />}
            </div>
          ) : tab === 'tampilan' ? (
            <div className="space-y-6">
              <TampilanPanel initial={initialTampilan} />
              {susunanSections.length > 0 && <SusunanPanel available={susunanSections} initialHidden={hiddenSections} />}
            </div>
          ) : tab === 'pembayaran' ? (
            paymentEntitled ? <PaymentPanel initial={paymentStatus} /> : <PaymentLockedPanel namaTenant={namaTenant} />
          ) : tab === 'pesanan' ? (
            <OrdersPanel initial={initialOrders} />
          ) : tab === 'pesanan-po' ? (
            <PreorderPanel initial={initialOrders} tenantId={tenantId} localeConfig={localeConfig} />
          ) : tab === 'laporan' ? (
            <ReportsPanel orders={initialOrders} localeConfig={localeConfig} />
          ) : tab === 'po-settings' ? (
            <PoSettingsPanel initial={preorder} />
          ) : tab === 'layanan' ? (
            <ServicePanel page={page} tenantId={tenantId} initial={initialServices} />
          ) : tab === 'reservasi' ? (
            <BookingsPanel initial={initialBookings} />
          ) : tab === 'menu' ? (
            <MenuPanel page={page} tenantId={tenantId} initial={initialMenu} />
          ) : tab === 'blog' ? (
            <BlogPanel page={page} tenantId={tenantId} initial={initialBlog} />
          ) : tab === 'galeri' ? (
            <GalleryPanel page={page} tenantId={tenantId} initial={initialGallery} />
          ) : tab === 'profil' ? (
            <ProfilePanel page={page} tenantId={tenantId} initial={initialProfile} />
          ) : tab === 'notif' ? (
            <NotifPanel businessName={namaTenant} />
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
              <div className="sm:col-span-4"><ImageUploadField compact value={add.gambar_url} onChange={(url) => setAdd({ ...add, gambar_url: url })} /></div>
              <button disabled={busy === 'add'} onClick={create} className="flex items-center justify-center gap-1 py-2.5 bg-apple-blue text-white rounded-lg text-[11px] font-bold uppercase hover:bg-blue-600 disabled:opacity-50">
                {busy === 'add' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Tambah
              </button>
            </div>

            {/* daftar */}
            {items.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Belum ada produk. Tambahkan produk pertama Anda di atas.</p>
            ) : (
              <div className="space-y-2">
                {items.map((it, idx) =>
                  editId === it.id ? (
                    <div key={it.id} className="p-3 bg-blue-50/40 rounded-xl border border-apple-blue/20 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input value={draft.nama} onChange={(e) => setDraft({ ...draft, nama: e.target.value })} placeholder="Nama *" className={`${inp} sm:col-span-2`} />
                        <input value={draft.harga} onChange={(e) => setDraft({ ...draft, harga: e.target.value })} placeholder="Harga" inputMode="numeric" className={inp} />
                        <input value={draft.kategori} onChange={(e) => setDraft({ ...draft, kategori: e.target.value })} placeholder="Kategori" className={inp} />
                        <div className="sm:col-span-4"><ImageUploadField compact value={draft.gambar_url} onChange={(url) => setDraft({ ...draft, gambar_url: url })} /></div>
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
                        <button onClick={() => move(idx, -1)} disabled={idx === 0 || !!busy} className="p-1.5 rounded-lg hover:bg-white text-gray-500 disabled:opacity-30" title="Naikkan" aria-label="Naikkan urutan"><ChevronUp size={14} /></button>
                        <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1 || !!busy} className="p-1.5 rounded-lg hover:bg-white text-gray-500 disabled:opacity-30" title="Turunkan" aria-label="Turunkan urutan"><ChevronDown size={14} /></button>
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

// ── Panel Susunan Halaman — sembunyikan/tampilkan bagian pengayaan ──
// Hanya untuk tema bespoke/lux yang merender blok ini dari data_konten.
// Toggle = visible (hijau) / hidden (abu). Simpan ke data_konten.hidden_sections
// via /api/portal/landing-page; renderer null-kan blok yang dimatikan.
const SUSUNAN_ICON: Record<HideableSectionKey, ReactNode> = {
  stats: <BarChart3 size={16} />,
  faq: <HelpCircle size={16} />,
  statement: <Quote size={16} />,
  gallery: <ImageIcon size={16} />,
}
const SUSUNAN_HELP: Record<HideableSectionKey, string> = {
  stats: 'Strip angka & pencapaian',
  faq: 'Tanya-jawab singkat',
  statement: 'Kutipan filosofi brand',
  gallery: 'Galeri foto',
}

function SusunanPanel({ available, initialHidden }: { available: HideableSectionKey[]; initialHidden: HideableSectionKey[] }) {
  const [hidden, setHidden] = useState<HideableSectionKey[]>(initialHidden)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const toggle = async (key: HideableSectionKey) => {
    const prev = hidden
    const next = hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key]
    setHidden(next)
    setBusy(true); setMsg(null)
    try {
      const res = await fetch('/api/portal/landing-page', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hidden_sections: next }),
      })
      if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error ?? 'gagal') }
      setMsg('Tersimpan.')
      window.dispatchEvent(new Event('portal:saved')) // refresh live preview bila terbuka
    } catch (e: any) { setMsg(`Gagal: ${e.message}`); setHidden(prev) } finally { setBusy(false) }
  }

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Susunan Halaman</h2>
      <p className="text-sm text-gray-500 mb-5">Pilih bagian yang tampil di situs Anda. Mematikan tidak menghapus isinya — hanya menyembunyikannya dari halaman.</p>
      <div className="space-y-3">
        {available.map((key) => {
          const visible = !hidden.includes(key)
          return (
            <div key={key} className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-gray-50 border border-black/5">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-xl bg-white border border-black/5 flex items-center justify-center text-gray-500 shrink-0">{SUSUNAN_ICON[key]}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">{HIDEABLE_SECTION_LABEL[key]}</p>
                  <p className="text-[11px] text-gray-400">{SUSUNAN_HELP[key]}{visible ? '' : ' · disembunyikan'}</p>
                </div>
              </div>
              <button onClick={() => toggle(key)} disabled={busy} role="switch" aria-checked={visible} aria-label={`Tampilkan bagian ${HIDEABLE_SECTION_LABEL[key]}`}
                className={`relative w-14 h-8 rounded-full transition-colors shrink-0 disabled:opacity-50 ${visible ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${visible ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          )
        })}
      </div>
      {msg && <p className="text-xs mt-4 text-gray-500">{msg}</p>}
    </div>
  )
}

// ── Panel konfigurasi pembayaran (Midtrans milik klien) ──────────
// Tab Pembayaran TANPA add-on `midtrans` → panel terkunci + ajakan upgrade
// (keputusan owner: terlihat tapi terkunci, bukan disembunyikan — jadi
// channel upsell). API /api/portal/payment ikut menolak (403) — gate UI
// ini bukan satu-satunya pagar.
function PaymentLockedPanel({ namaTenant }: { namaTenant: string }) {
  const addon = getAddon('midtrans')
  const harga = `Rp ${(addon?.price ?? 400000).toLocaleString('id-ID')}`
  const maint = `Rp ${(addon?.yearlyMaint ?? 150000).toLocaleString('id-ID')}`
  const adminWa = process.env.NEXT_PUBLIC_WA_NUMBER ?? '6281296917963'
  const waText = encodeURIComponent(
    `Halo Admin Japan Arena, saya ingin mengaktifkan add-on Payment Gateway (Midtrans) untuk website saya (${namaTenant}).`,
  )
  return (
    <div className="bg-white rounded-[32px] p-10 apple-shadow border border-black/[0.03] text-center">
      <div className="w-14 h-14 rounded-full bg-blue-50 text-apple-blue flex items-center justify-center mx-auto mb-5">
        <Lock size={22} />
      </div>
      <p className="text-[11px] font-black uppercase tracking-widest text-apple-blue mb-2">Add-on Berbayar</p>
      <h2 className="text-lg font-bold text-gray-900 mb-2">{addon?.name ?? 'Payment Gateway (Midtrans)'}</h2>
      <p className="text-sm text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
        Terima pembayaran otomatis langsung di website Anda — QRIS, transfer bank, dan e-wallet.
        Pembeli bayar, status pesanan terupdate sendiri, dana masuk ke rekening Anda.
      </p>
      <p className="text-sm font-bold text-gray-900 mt-4">
        {harga}<span className="text-gray-400 font-medium"> aktivasi · {maint}/thn maintenance</span>
      </p>
      <a
        href={`https://wa.me/${adminWa}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-6 px-8 h-12 rounded-full bg-[#0071E3] hover:bg-[#005BB5] text-white text-sm font-bold transition-colors active:scale-[0.96]"
      >
        Aktifkan via WhatsApp
      </a>
      <p className="text-[11px] text-gray-400 font-medium mt-4">
        Fitur ini belum termasuk dalam paket Anda. Tim kami siap membantu aktivasi.
      </p>
    </div>
  )
}

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

// ── Panel Pesanan PO (F&B pre-order) — antrian + realtime + status ──
const PO_STEPS = ['pending', 'processing', 'done'] as const
const PO_STATUS_LABEL: Record<string, string> = {
  pending: 'Pending', processing: 'Diproses', done: 'Selesai', cancelled: 'Dibatalkan',
}
const PO_STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700', processing: 'bg-blue-50 text-blue-700',
  done: 'bg-green-50 text-green-700', cancelled: 'bg-gray-100 text-gray-500',
}

function PreorderPanel({ initial, tenantId, localeConfig }: { initial: ShopOrderRow[]; tenantId: string; localeConfig?: LocaleConfig }) {
  const supabase = createClient()
  const { locale, currency } = moneyFromConfig(localeConfig)
  const money = (n: number) => formatMoney(n, locale, currency)
  const onlyPo = (list: ShopOrderRow[]) => list.filter((o) => (o.order_kind ?? 'shop') === 'preorder')
  const [orders, setOrders] = useState<ShopOrderRow[]>(onlyPo(initial))
  const [busy, setBusy] = useState<string | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [flashId, setFlashId] = useState<string | null>(null)

  // Realtime: order PO baru → muat barisnya, highlight + confetti (efek demo dramatis).
  useEffect(() => {
    const ch = supabase
      .channel('po-orders')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'shop_orders', filter: `tenant_id=eq.${tenantId}` },
        async (payload: { new?: { id?: string } }) => {
          const id = payload?.new?.id
          if (!id) return
          const { data } = await supabase.from('shop_orders').select('*, shop_order_items(*)').eq('id', id).single()
          const row = data as ShopOrderRow | null
          if (!row || (row.order_kind ?? 'shop') !== 'preorder') return
          setOrders((p) => (p.some((o) => o.id === id) ? p : [row, ...p]))
          setFlashId(id); setTimeout(() => setFlashId(null), 3000)
          try { confetti({ particleCount: 90, spread: 70, origin: { y: 0.3 }, disableForReducedMotion: true }) } catch { /* noop */ }
        })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId])

  const setStatus = async (id: string, status: string) => {
    setBusy(id)
    try {
      const { data, error } = await supabase.from('shop_orders')
        .update({ status } as never).eq('id', id).select('*, shop_order_items(*)').single()
      if (error) throw error
      setOrders((p) => p.map((o) => (o.id === id ? (data as ShopOrderRow) : o)))
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }

  const aktif = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Pesanan PO</h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Pembaruan langsung saat pesanan baru masuk</p>
        </div>
        <span className="text-xs text-gray-400 font-medium">{aktif} aktif · {orders.length} total</span>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum ada pesanan. Pesanan PO dari pelanggan akan muncul di sini secara langsung.</p>
      ) : (
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o.id} className={`rounded-xl border bg-gray-50 transition-shadow ${flashId === o.id ? 'border-apple-blue ring-2 ring-apple-blue/30' : 'border-black/5'}`}>
              <button onClick={() => setOpen(open === o.id ? null : o.id)} className="w-full flex items-center justify-between gap-3 p-3 text-left">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{o.pembeli_nama} · {money(Number(o.total))}</p>
                  <p className="text-xs text-gray-500">
                    {o.fulfillment_type === 'delivery' ? 'Diantar' : 'Ambil'}{o.fulfillment_date ? ` · ${o.fulfillment_date}` : ''}{o.fulfillment_time ? ` ${o.fulfillment_time}` : ''}
                    {' · '}#{o.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 ${PO_STATUS_BADGE[o.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {PO_STATUS_LABEL[o.status] ?? o.status}
                </span>
              </button>

              {open === o.id && (
                <div className="px-3 pb-3 space-y-3 border-t border-black/5 pt-3">
                  <div className="space-y-1">
                    {o.shop_order_items?.map((it) => (
                      <div key={it.id} className="flex justify-between text-xs text-gray-600">
                        <span>{it.nama} ×{it.qty}</span><span>{money(Number(it.subtotal))}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 space-y-0.5">
                    {o.pembeli_hp && <p>WA: <a href={`https://wa.me/${o.pembeli_hp.replace(/\D/g, '')}`} target="_blank" className="text-apple-blue font-bold">{o.pembeli_hp}</a></p>}
                    {o.alamat && <p>Alamat: {o.alamat}</p>}
                    {o.catatan && <p>Catatan: {o.catatan}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {PO_STEPS.map((s) => (
                      <button key={s} onClick={() => setStatus(o.id, s)} disabled={busy === o.id || o.status === s}
                        className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-colors ${o.status === s ? 'bg-apple-blue text-white' : 'border border-black/10 text-gray-500 hover:text-apple-blue'}`}>
                        {PO_STATUS_LABEL[s]}
                      </button>
                    ))}
                    {o.status !== 'cancelled' && o.status !== 'done' && (
                      <button onClick={() => setStatus(o.id, 'cancelled')} disabled={busy === o.id}
                        className="px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                        Batalkan
                      </button>
                    )}
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

// ── Panel Laporan (omzet/profit/menu terlaris PO) ───────────────
function ReportsPanel({ orders, localeConfig }: { orders: ShopOrderRow[]; localeConfig?: LocaleConfig }) {
  const { locale, currency } = moneyFromConfig(localeConfig)
  const money = (n: number) => formatMoney(n, locale, currency)
  const po = orders.filter((o) => (o.order_kind ?? 'shop') === 'preorder' && o.status !== 'cancelled')

  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)
  const ym = todayStr.slice(0, 7)
  const omzetHari = po.filter((o) => (o.created_at ?? '').slice(0, 10) === todayStr).reduce((a, b) => a + Number(b.total), 0)
  const omzetBulan = po.filter((o) => (o.created_at ?? '').slice(0, 7) === ym).reduce((a, b) => a + Number(b.total), 0)
  const omzetTotal = po.reduce((a, b) => a + Number(b.total), 0)
  const profit = po.reduce((a, o) => a + (o.shop_order_items ?? []).reduce((s, it) => s + (Number(it.subtotal) - Number(it.hpp_satuan ?? 0) * it.qty), 0), 0)
  const margin = omzetTotal > 0 ? Math.round((profit / omzetTotal) * 100) : 0

  const byStatus: Record<string, number> = { pending: 0, processing: 0, done: 0 }
  for (const o of po) byStatus[o.status] = (byStatus[o.status] ?? 0) + 1

  const tally = new Map<string, { qty: number; omzet: number }>()
  for (const o of po) for (const it of o.shop_order_items ?? []) {
    const t = tally.get(it.nama) ?? { qty: 0, omzet: 0 }
    t.qty += it.qty; t.omzet += Number(it.subtotal); tally.set(it.nama, t)
  }
  const top = [...tally.entries()].sort((a, b) => b[1].qty - a[1].qty).slice(0, 5)
  const maxQty = top.length ? top[0][1].qty : 1

  const Kpi = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="bg-gray-50 rounded-2xl p-4 border border-black/5">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-extrabold text-gray-900 mt-1 tabular-nums">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Ringkasan</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi label="Omzet Hari Ini" value={money(omzetHari)} />
          <Kpi label="Omzet Bulan Ini" value={money(omzetBulan)} />
          <Kpi label="Total Pesanan" value={String(po.length)} sub={`${byStatus.pending ?? 0} pending · ${byStatus.processing ?? 0} diproses · ${byStatus.done ?? 0} selesai`} />
          <Kpi label="Profit (estimasi)" value={money(profit)} sub={`Margin ${margin}% · omzet total ${money(omzetTotal)}`} />
        </div>
        <p className="text-[11px] text-gray-400 mt-4">Profit = harga jual − HPP (biaya) tiap item. Atur HPP per menu di tab Menu agar akurat. Pesanan dibatalkan tidak dihitung.</p>
      </div>

      <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Menu Terlaris</h2>
        {top.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Belum ada data penjualan.</p>
        ) : (
          <div className="space-y-3">
            {top.map(([nama, t]) => (
              <div key={nama}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-gray-900 truncate pr-2">{nama}</span>
                  <span className="text-gray-500 shrink-0 tabular-nums">{t.qty} terjual · {money(t.omzet)}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-apple-blue" style={{ width: `${Math.round((t.qty / maxQty) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Panel Setelan PO (Buka/Tutup ronde + WA admin + pemenuhan) ───
function PoSettingsPanel({ initial }: { initial: PreorderConfig }) {
  const [open, setOpen] = useState(!!initial.open)
  const [label, setLabel] = useState(initial.open_label ?? '')
  const [wa, setWa] = useState(initial.wa_admin ?? '')
  const fulInit = initial.fulfillment
  const [pickup, setPickup] = useState(!fulInit || fulInit.includes('pickup'))
  const [delivery, setDelivery] = useState(!fulInit || fulInit.includes('delivery'))
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const inp = 'w-full text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none'

  const save = async () => {
    setBusy(true); setMsg(null)
    const fulfillment = [...(pickup ? ['pickup'] : []), ...(delivery ? ['delivery'] : [])]
    try {
      const res = await fetch('/api/portal/preorder-settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ open, open_label: label, wa_admin: wa, fulfillment }),
      })
      const json = await res.json()
      if (!res.ok) { setMsg(`Gagal: ${json.error}`); return }
      setMsg('Tersimpan.')
    } catch { setMsg('Error koneksi') } finally { setBusy(false) }
  }

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Setelan Pre-Order</h2>
      <p className="text-sm text-gray-500 mb-5">Atur ronde PO, notifikasi WhatsApp, dan cara pemenuhan.</p>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-gray-50 border border-black/5">
          <div>
            <p className="text-sm font-bold text-gray-900">{open ? 'PO sedang DIBUKA' : 'PO sedang DITUTUP'}</p>
            <p className="text-[11px] text-gray-400">Saat ditutup, pelanggan tidak bisa mengirim pesanan baru.</p>
          </div>
          <button onClick={() => setOpen((v) => !v)} role="switch" aria-checked={open} aria-label="Buka atau tutup pre-order"
            className={`relative w-14 h-8 rounded-full transition-colors shrink-0 ${open ? 'bg-green-500' : 'bg-gray-300'}`}>
            <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${open ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Keterangan ronde (opsional)</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="mis. PO dibuka s/d Jumat, ambil Sabtu" className={inp} />
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nomor WhatsApp admin (notifikasi order baru)</label>
          <input value={wa} onChange={(e) => setWa(e.target.value)} placeholder="mis. 09012345678" inputMode="tel" className={inp} />
          <p className="text-[11px] text-gray-400 mt-1">Setiap pesanan baru dikirim ke nomor ini lewat WhatsApp.</p>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Cara pemenuhan</label>
          <div className="flex gap-2">
            <button onClick={() => setPickup((v) => !v)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-colors ${pickup ? 'border-gray-900 bg-gray-50 text-gray-900' : 'border-black/10 text-gray-400'}`}>
              <Store size={16} /> Ambil sendiri
            </button>
            <button onClick={() => setDelivery((v) => !v)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-colors ${delivery ? 'border-gray-900 bg-gray-50 text-gray-900' : 'border-black/10 text-gray-400'}`}>
              <Bike size={16} /> Diantar
            </button>
          </div>
        </div>
      </div>

      {msg && <p className="text-xs mt-4 text-gray-500">{msg}</p>}
      <div className="mt-5">
        <button onClick={save} disabled={busy} className="flex items-center gap-1 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[11px] font-bold uppercase hover:bg-gray-800 disabled:opacity-50">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Simpan
        </button>
      </div>
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
  const move = async (idx: number, dir: -1 | 1) => {
    const res = reorderList(items, idx, dir)
    if (!res) return
    const prev = items
    setItems(res.next)
    setBusy('reorder')
    try {
      await Promise.all(res.updates.map((u) =>
        supabase.from('services').update({ urutan: u.urutan } as never).eq('id', u.id)))
    } catch (e: any) { alert(`Gagal mengurutkan: ${e.message}`); setItems(prev) } finally { setBusy(null) }
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
        <div className="sm:col-span-4"><ImageUploadField compact value={add.gambar_url} onChange={(url) => setAdd({ ...add, gambar_url: url })} /></div>
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
          {items.map((it, idx) =>
            editId === it.id ? (
              <div key={it.id} className="p-3 bg-blue-50/40 rounded-xl border border-apple-blue/20 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input value={draft.nama} onChange={(e) => setDraft({ ...draft, nama: e.target.value })} placeholder="Nama *" className={`${inp} sm:col-span-2`} />
                  <input value={draft.harga} onChange={(e) => setDraft({ ...draft, harga: e.target.value })} placeholder="Harga penuh" inputMode="numeric" className={inp} />
                  <input value={draft.dp_amount} onChange={(e) => setDraft({ ...draft, dp_amount: e.target.value })} placeholder="DP" inputMode="numeric" className={inp} />
                  <input value={draft.durasi_menit} onChange={(e) => setDraft({ ...draft, durasi_menit: e.target.value })} placeholder="Durasi (menit)" inputMode="numeric" className={inp} />
                  <input value={draft.kategori} onChange={(e) => setDraft({ ...draft, kategori: e.target.value })} placeholder="Kategori" className={inp} />
                  <div className="sm:col-span-4"><ImageUploadField compact value={draft.gambar_url} onChange={(url) => setDraft({ ...draft, gambar_url: url })} /></div>
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
                  <button onClick={() => move(idx, -1)} disabled={idx === 0 || !!busy} className="p-1.5 rounded-lg hover:bg-white text-gray-500 disabled:opacity-30" title="Naikkan" aria-label="Naikkan urutan"><ChevronUp size={14} /></button>
                  <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1 || !!busy} className="p-1.5 rounded-lg hover:bg-white text-gray-500 disabled:opacity-30" title="Turunkan" aria-label="Turunkan urutan"><ChevronDown size={14} /></button>
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
  const move = async (idx: number, dir: -1 | 1) => {
    const res = reorderList(items, idx, dir)
    if (!res) return
    const prev = items
    setItems(res.next)
    setBusy('reorder')
    try {
      await Promise.all(res.updates.map((u) =>
        supabase.from('menu_items').update({ urutan: u.urutan } as never).eq('id', u.id)))
    } catch (e: any) { alert(`Gagal mengurutkan: ${e.message}`); setItems(prev) } finally { setBusy(null) }
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
        <div className="sm:col-span-4"><ImageUploadField compact value={add.gambar_url} onChange={(url) => setAdd({ ...add, gambar_url: url })} /></div>
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
          {items.map((it, idx) =>
            editId === it.id ? (
              <div key={it.id} className="p-3 bg-blue-50/40 rounded-xl border border-apple-blue/20 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input value={draft.nama} onChange={(e) => setDraft({ ...draft, nama: e.target.value })} placeholder="Nama *" className={`${inp} sm:col-span-2`} />
                  <input value={draft.harga} onChange={(e) => setDraft({ ...draft, harga: e.target.value })} placeholder="Harga" inputMode="numeric" className={inp} />
                  <input value={draft.kategori} onChange={(e) => setDraft({ ...draft, kategori: e.target.value })} placeholder="Kategori" className={inp} />
                  <div className="sm:col-span-4"><ImageUploadField compact value={draft.gambar_url} onChange={(url) => setDraft({ ...draft, gambar_url: url })} /></div>
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
                  <button onClick={() => move(idx, -1)} disabled={idx === 0 || !!busy} className="p-1.5 rounded-lg hover:bg-white text-gray-500 disabled:opacity-30" title="Naikkan" aria-label="Naikkan urutan"><ChevronUp size={14} /></button>
                  <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1 || !!busy} className="p-1.5 rounded-lg hover:bg-white text-gray-500 disabled:opacity-30" title="Turunkan" aria-label="Turunkan urutan"><ChevronDown size={14} /></button>
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

// ── Panel Blog (artikel) — customer kelola sendiri ──────────────
type BlogDraft = { judul: string; ringkasan: string; konten: string; cover_url: string; penulis: string }
const BLOG_EMPTY: BlogDraft = { judul: '', ringkasan: '', konten: '', cover_url: '', penulis: '' }

function BlogPanel({ page, tenantId, initial }: { page: PageInfo | null; tenantId: string; initial: BlogPost[] }) {
  const supabase = createClient()
  const [items, setItems] = useState<BlogPost[]>(initial)
  const [add, setAdd] = useState<BlogDraft>(BLOG_EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [draft, setDraft] = useState<BlogDraft>(BLOG_EMPTY)
  const [busy, setBusy] = useState<string | null>(null)
  const inp = 'text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none w-full'

  const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const payload = (d: BlogDraft) => ({
    judul: d.judul, slug: slugify(d.judul) || null,
    ringkasan: d.ringkasan || null, konten: d.konten || null,
    cover_url: d.cover_url || null, penulis: d.penulis || null,
  })

  const create = async () => {
    if (!page) return
    if (!add.judul.trim()) return alert('Judul wajib')
    setBusy('add')
    try {
      const { data, error } = await supabase.from('blog_posts')
        .insert({ page_id: page.id, tenant_id: tenantId, is_published: false, ...payload(add) } as never)
        .select().single()
      if (error) throw error
      setItems((p) => [data as BlogPost, ...p])
      setAdd(BLOG_EMPTY)
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const startEdit = (b: BlogPost) => {
    setEditId(b.id)
    setDraft({ judul: b.judul ?? '', ringkasan: b.ringkasan ?? '', konten: b.konten ?? '', cover_url: b.cover_url ?? '', penulis: b.penulis ?? '' })
  }
  const saveEdit = async (id: string) => {
    if (!draft.judul.trim()) return alert('Judul wajib')
    setBusy(id)
    try {
      const { data, error } = await supabase.from('blog_posts').update(payload(draft) as never).eq('id', id).select().single()
      if (error) throw error
      setItems((p) => p.map((x) => (x.id === id ? (data as BlogPost) : x)))
      setEditId(null)
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const togglePublish = async (b: BlogPost) => {
    setBusy(b.id)
    try {
      const willPublish = !b.is_published
      const { data, error } = await supabase.from('blog_posts')
        .update({ is_published: willPublish, published_at: willPublish ? new Date().toISOString() : null } as never)
        .eq('id', b.id).select().single()
      if (error) throw error
      setItems((p) => p.map((x) => (x.id === b.id ? (data as BlogPost) : x)))
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const remove = async (id: string) => {
    if (!confirm('Hapus artikel ini?')) return
    setBusy(id)
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) throw error
      setItems((p) => p.filter((x) => x.id !== id))
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Blog / Artikel</h2>
        <span className="text-xs text-gray-400 font-medium">{items.length} artikel</span>
      </div>
      <div className="space-y-2 mb-3">
        <input value={add.judul} onChange={(e) => setAdd({ ...add, judul: e.target.value })} placeholder="Judul artikel *" className={inp} />
        <input value={add.ringkasan} onChange={(e) => setAdd({ ...add, ringkasan: e.target.value })} placeholder="Ringkasan singkat" className={inp} />
        <textarea value={add.konten} onChange={(e) => setAdd({ ...add, konten: e.target.value })} placeholder="Isi artikel" rows={4} className={inp} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <ImageUploadField compact value={add.cover_url} onChange={(url) => setAdd({ ...add, cover_url: url })} />
          <input value={add.penulis} onChange={(e) => setAdd({ ...add, penulis: e.target.value })} placeholder="Penulis (opsional)" className={inp} />
        </div>
      </div>
      <div className="flex justify-end mb-6">
        <button disabled={busy === 'add'} onClick={create} className="flex items-center justify-center gap-1 px-5 py-2.5 bg-apple-blue text-white rounded-lg text-[11px] font-bold uppercase hover:bg-blue-600 disabled:opacity-50">
          {busy === 'add' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Tambah Artikel
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum ada artikel.</p>
      ) : (
        <div className="space-y-2">
          {items.map((it) =>
            editId === it.id ? (
              <div key={it.id} className="p-3 bg-blue-50/40 rounded-xl border border-apple-blue/20 space-y-2">
                <input value={draft.judul} onChange={(e) => setDraft({ ...draft, judul: e.target.value })} placeholder="Judul *" className={inp} />
                <input value={draft.ringkasan} onChange={(e) => setDraft({ ...draft, ringkasan: e.target.value })} placeholder="Ringkasan" className={inp} />
                <textarea value={draft.konten} onChange={(e) => setDraft({ ...draft, konten: e.target.value })} placeholder="Isi artikel" rows={4} className={inp} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ImageUploadField compact value={draft.cover_url} onChange={(url) => setDraft({ ...draft, cover_url: url })} />
                  <input value={draft.penulis} onChange={(e) => setDraft({ ...draft, penulis: e.target.value })} placeholder="Penulis" className={inp} />
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
                  <p className="text-sm font-bold text-gray-900 truncate">{it.judul} {!it.is_published && <span className="text-[10px] text-gray-400 uppercase">(draft)</span>}</p>
                  {it.ringkasan && <p className="text-xs text-gray-500 truncate">{it.ringkasan}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(it)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-white text-gray-500" title="Edit"><Pencil size={14} /></button>
                  <button onClick={() => togglePublish(it)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-white" title={it.is_published ? 'Jadikan draft' : 'Terbitkan'}>
                    {it.is_published ? <Eye size={14} /> : <EyeOff size={14} className="text-gray-400" />}
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

// ── Panel Galeri foto — customer kelola sendiri ─────────────────
function GalleryPanel({ page, tenantId, initial }: { page: PageInfo | null; tenantId: string; initial: GalleryImage[] }) {
  const supabase = createClient()
  const [items, setItems] = useState<GalleryImage[]>(initial)
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const inp = 'text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none'

  const add = async () => {
    if (!page) return
    if (!url.trim()) return alert('URL gambar wajib')
    setBusy('add')
    try {
      const { data, error } = await supabase.from('gallery_images')
        .insert({ page_id: page.id, tenant_id: tenantId, url: url.trim(), caption: caption || null, is_active: true, urutan: items.length } as never)
        .select().single()
      if (error) throw error
      setItems((p) => [...p, data as GalleryImage])
      setUrl(''); setCaption('')
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const remove = async (id: string) => {
    if (!confirm('Hapus foto ini?')) return
    setBusy(id)
    try {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id)
      if (error) throw error
      setItems((p) => p.filter((x) => x.id !== id))
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const move = async (idx: number, dir: -1 | 1) => {
    const res = reorderList(items, idx, dir)
    if (!res) return
    const prev = items
    setItems(res.next)
    setBusy('reorder')
    try {
      await Promise.all(res.updates.map((u) =>
        supabase.from('gallery_images').update({ urutan: u.urutan } as never).eq('id', u.id)))
    } catch (e: any) { alert(`Gagal mengurutkan: ${e.message}`); setItems(prev) } finally { setBusy(null) }
  }

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Galeri Foto</h2>
        <span className="text-xs text-gray-400 font-medium">{items.length} foto</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
        <div className="sm:col-span-2"><ImageUploadField compact value={url} onChange={setUrl} /></div>
        <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (opsional)" className={inp} />
        <button disabled={busy === 'add'} onClick={add} className="sm:col-span-3 flex items-center justify-center gap-1 py-2.5 bg-apple-blue text-white rounded-lg text-[11px] font-bold uppercase hover:bg-blue-600 disabled:opacity-50">
          {busy === 'add' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Tambah Foto
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum ada foto.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((it, idx) => (
            <div key={it.id} className="relative rounded-xl overflow-hidden border border-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.url} alt={it.caption ?? ''} className="w-full aspect-square object-cover bg-gray-100" />
              <div className="absolute top-2 left-2 flex gap-1">
                <button onClick={() => move(idx, -1)} disabled={idx === 0 || !!busy} className="p-1.5 rounded-lg bg-white/90 text-gray-600 hover:bg-white disabled:opacity-30" title="Naikkan" aria-label="Naikkan urutan"><ChevronUp size={14} /></button>
                <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1 || !!busy} className="p-1.5 rounded-lg bg-white/90 text-gray-600 hover:bg-white disabled:opacity-30" title="Turunkan" aria-label="Turunkan urutan"><ChevronDown size={14} /></button>
              </div>
              <button onClick={() => remove(it.id)} disabled={busy === it.id} className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-red-500 hover:bg-white" title="Hapus"><Trash2 size={14} /></button>
              {it.caption && <p className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] p-1.5 truncate">{it.caption}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Panel Profil Bisnis — kontak/jam/alamat/peta/sosial ─────────
function ProfilePanel({ page, tenantId, initial }: { page: PageInfo | null; tenantId: string; initial: TenantProfile | null }) {
  const supabase = createClient()
  const [f, setF] = useState({
    wa: initial?.wa ?? '', email: initial?.email ?? '', alamat: initial?.alamat ?? '',
    jam: initial?.jam ?? '', maps_url: initial?.maps_url ?? '', instagram: initial?.instagram ?? '',
    ongkir: initial?.ongkir ?? '', delivery: initial?.delivery ?? '', newsletter: initial?.newsletter ?? false,
  })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const inp = 'text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none w-full'

  const save = async () => {
    if (!page) return
    setBusy(true); setMsg(null)
    try {
      const { error } = await supabase.from('tenant_profile').upsert({
        page_id: page.id, tenant_id: tenantId,
        wa: f.wa || null, email: f.email || null, alamat: f.alamat || null, jam: f.jam || null,
        maps_url: f.maps_url || null, instagram: f.instagram || null, ongkir: f.ongkir || null,
        delivery: f.delivery || null, newsletter: f.newsletter, updated_at: new Date().toISOString(),
      } as never, { onConflict: 'page_id' })
      if (error) throw error
      setMsg('Tersimpan.')
    } catch (e: any) { setMsg(`Gagal: ${e.message}`) } finally { setBusy(false) }
  }

  const field = (label: string, key: keyof typeof f, placeholder = '', textarea = false) => (
    <div>
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
      {textarea
        ? <textarea value={f[key] as string} onChange={(e) => setF({ ...f, [key]: e.target.value })} placeholder={placeholder} rows={2} className={inp} />
        : <input value={f[key] as string} onChange={(e) => setF({ ...f, [key]: e.target.value })} placeholder={placeholder} className={inp} />}
    </div>
  )

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Profil Bisnis</h2>
      <p className="text-sm text-gray-500 mb-5">Kontak, jam buka, alamat, dan info lain yang tampil di website Anda.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field('Nomor WhatsApp', 'wa', '6281...')}
        {field('Email Bisnis', 'email', 'halo@bisnis.id')}
        {field('Instagram', 'instagram', '@bisnis')}
        {field('Jam Buka', 'jam', 'Senin-Jumat 09.00-21.00', true)}
        <div className="sm:col-span-2">{field('Alamat', 'alamat', 'Jl. ...', true)}</div>
        <div className="sm:col-span-2">{field('URL Google Maps (embed)', 'maps_url', 'https://www.google.com/maps?q=...&output=embed')}</div>
        {field('Info Ongkir', 'ongkir', 'mis. Gratis ongkir min. 100rb')}
        {field('Info Delivery', 'delivery', 'mis. GoFood, GrabFood')}
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700 mt-4">
        <input type="checkbox" checked={f.newsletter} onChange={(e) => setF({ ...f, newsletter: e.target.checked })} />
        Aktifkan pendaftaran newsletter
      </label>
      {msg && <p className="text-xs mt-3 text-gray-500">{msg}</p>}
      <div className="flex justify-end mt-5">
        <button onClick={save} disabled={busy} className="flex items-center gap-1 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[11px] font-bold uppercase hover:bg-gray-800 disabled:opacity-50">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Simpan Profil
        </button>
      </div>
    </div>
  )
}
