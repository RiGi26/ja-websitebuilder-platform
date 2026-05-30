'use client'

import { useState } from 'react'
import { Plus, Trash2, Loader2, Eye, EyeOff } from 'lucide-react'
import type { Product, BlogPost } from '@/types/websitebuilder'

type Props = {
  pageId: string
  tenantId: string
  initialProducts: Product[]
  initialPosts: BlogPost[]
}

async function call(url: string, method: string, body: unknown) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error ?? `${res.status}`)
  return json
}

export default function AddonManager({ pageId, tenantId, initialProducts, initialPosts }: Props) {
  return (
    <div className="space-y-8">
      <ProductPanel pageId={pageId} tenantId={tenantId} initial={initialProducts} />
      <BlogPanel pageId={pageId} tenantId={tenantId} initial={initialPosts} />
    </div>
  )
}

// ── Produk ────────────────────────────────────────────────────
function ProductPanel({ pageId, tenantId, initial }: { pageId: string; tenantId: string; initial: Product[] }) {
  const [items, setItems] = useState<Product[]>(initial)
  const [nama, setNama] = useState('')
  const [harga, setHarga] = useState('')
  const [kategori, setKategori] = useState('')
  const [gambar, setGambar] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  const add = async () => {
    if (!nama.trim()) return alert('Nama produk wajib')
    setBusy('add')
    try {
      const { product } = await call('/api/admin/products', 'POST', {
        page_id: pageId, tenant_id: tenantId,
        nama, harga: Number(harga) || 0, kategori: kategori || null, gambar_url: gambar || null,
      })
      setItems((p) => [...p, product])
      setNama(''); setHarga(''); setKategori(''); setGambar('')
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const toggle = async (it: Product) => {
    setBusy(it.id)
    try {
      const { product } = await call('/api/admin/products', 'PATCH', { id: it.id, is_active: !it.is_active })
      setItems((p) => p.map((x) => (x.id === it.id ? product : x)))
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const remove = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return
    setBusy(id)
    try { await call('/api/admin/products', 'DELETE', { id }); setItems((p) => p.filter((x) => x.id !== id)) }
    catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
        Produk ({items.length}) — tampil di section <code>product_list</code>
      </p>

      {/* form tambah */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4">
        <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama produk *" className="text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none sm:col-span-2" />
        <input value={harga} onChange={(e) => setHarga(e.target.value)} placeholder="Harga (angka)" inputMode="numeric" className="text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none" />
        <input value={kategori} onChange={(e) => setKategori(e.target.value)} placeholder="Kategori" className="text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none" />
        <input value={gambar} onChange={(e) => setGambar(e.target.value)} placeholder="URL gambar (opsional)" className="text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none sm:col-span-3" />
        <button disabled={busy === 'add'} onClick={add} className="flex items-center justify-center gap-1 py-2.5 bg-apple-blue text-white rounded-lg text-[11px] font-bold uppercase hover:bg-blue-600 disabled:opacity-50">
          {busy === 'add' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Tambah
        </button>
      </div>

      {/* daftar */}
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum ada produk.</p>
      ) : (
        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-black/5">
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{it.nama} {!it.is_active && <span className="text-[10px] text-gray-400 uppercase">(non-aktif)</span>}</p>
                <p className="text-xs text-gray-500">Rp {Number(it.harga).toLocaleString('id-ID')}{it.kategori ? ` · ${it.kategori}` : ''}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggle(it)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-white" title={it.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
                  {it.is_active ? <Eye size={14} /> : <EyeOff size={14} className="text-gray-400" />}
                </button>
                <button onClick={() => remove(it.id)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Hapus">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Blog ──────────────────────────────────────────────────────
function BlogPanel({ pageId, tenantId, initial }: { pageId: string; tenantId: string; initial: BlogPost[] }) {
  const [items, setItems] = useState<BlogPost[]>(initial)
  const [judul, setJudul] = useState('')
  const [ringkasan, setRingkasan] = useState('')
  const [penulis, setPenulis] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  const add = async () => {
    if (!judul.trim()) return alert('Judul artikel wajib')
    setBusy('add')
    try {
      const { post } = await call('/api/admin/blog', 'POST', {
        page_id: pageId, tenant_id: tenantId,
        judul, ringkasan: ringkasan || null, penulis: penulis || null, is_published: true,
      })
      setItems((p) => [post, ...p])
      setJudul(''); setRingkasan(''); setPenulis('')
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const toggle = async (it: BlogPost) => {
    setBusy(it.id)
    try {
      const { post } = await call('/api/admin/blog', 'PATCH', { id: it.id, is_published: !it.is_published })
      setItems((p) => p.map((x) => (x.id === it.id ? post : x)))
    } catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }
  const remove = async (id: string) => {
    if (!confirm('Hapus artikel ini?')) return
    setBusy(id)
    try { await call('/api/admin/blog', 'DELETE', { id }); setItems((p) => p.filter((x) => x.id !== id)) }
    catch (e: any) { alert(`Gagal: ${e.message}`) } finally { setBusy(null) }
  }

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
        Blog ({items.length}) — tampil di section <code>blog_list</code>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Judul artikel *" className="text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none sm:col-span-2" />
        <input value={penulis} onChange={(e) => setPenulis(e.target.value)} placeholder="Penulis" className="text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none" />
        <input value={ringkasan} onChange={(e) => setRingkasan(e.target.value)} placeholder="Ringkasan singkat" className="text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none sm:col-span-2" />
        <button disabled={busy === 'add'} onClick={add} className="flex items-center justify-center gap-1 py-2.5 bg-apple-blue text-white rounded-lg text-[11px] font-bold uppercase hover:bg-blue-600 disabled:opacity-50">
          {busy === 'add' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Tambah
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum ada artikel.</p>
      ) : (
        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-black/5">
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{it.judul} {!it.is_published && <span className="text-[10px] text-gray-400 uppercase">(draft)</span>}</p>
                {it.penulis && <p className="text-xs text-gray-500">oleh {it.penulis}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggle(it)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-white" title={it.is_published ? 'Jadikan draft' : 'Publish'}>
                  {it.is_published ? <Eye size={14} /> : <EyeOff size={14} className="text-gray-400" />}
                </button>
                <button onClick={() => remove(it.id)} disabled={busy === it.id} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Hapus">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
