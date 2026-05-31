'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Plus, Trash2, Loader2, Eye, EyeOff, Pencil, Check, LogOut, ExternalLink, Package,
} from 'lucide-react'
import type { Product } from '@/types/websitebuilder'

type PageInfo = { id: string; nama_website: string; slug: string | null; status: string }
type Props = {
  tenantId: string
  namaTenant: string
  page: PageInfo | null
  initialProducts: Product[]
  hasShop: boolean
}

type Draft = { nama: string; harga: string; kategori: string; gambar_url: string; deskripsi: string; stok: string }
const EMPTY: Draft = { nama: '', harga: '', kategori: '', gambar_url: '', deskripsi: '', stok: '' }

export default function PortalDashboard({ tenantId, namaTenant, page, initialProducts, hasShop }: Props) {
  const router = useRouter()
  const supabase = createClient()
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
        ) : !hasShop ? (
          <div className="bg-white rounded-3xl p-12 text-center apple-shadow border border-black/5">
            <Package size={40} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-1">Belum ada fitur yang bisa dikelola sendiri</h2>
            <p className="text-sm text-gray-500">Website Anda belum mengaktifkan fitur toko. Hubungi tim untuk perubahan konten.</p>
          </div>
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
      </main>
    </div>
  )
}
