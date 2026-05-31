'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type CartItem = {
  id: string          // product id
  nama: string
  harga: number
  gambar_url: string | null
  qty: number
}

type CartCtx = {
  items: CartItem[]
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  count: number
  subtotal: number
  openDrawer: () => void
}

const Ctx = createContext<CartCtx | null>(null)
export const useCart = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart harus di dalam CartProvider')
  return c
}

function storageKey(slug: string) { return `ja_cart:${slug}` }

export function CartProvider({
  slug,
  primary,
  children,
}: {
  slug: string
  primary?: string
  children: React.ReactNode
}) {
  const [items, setItems] = useState<CartItem[]>([])
  const [drawer, setDrawer] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // load dari localStorage saat mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(slug))
      if (raw) setItems(JSON.parse(raw))
    } catch { /* abaikan */ }
    setHydrated(true)
  }, [slug])

  // simpan tiap berubah
  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(storageKey(slug), JSON.stringify(items)) } catch { /* abaikan */ }
  }, [items, slug, hydrated])

  const add: CartCtx['add'] = useCallback((item, qty = 1) => {
    setItems((prev) => {
      const ex = prev.find((p) => p.id === item.id)
      if (ex) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p))
      return [...prev, { ...item, qty }]
    })
    setDrawer(true)
  }, [])

  const setQty: CartCtx['setQty'] = useCallback((id, qty) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => (p.id === id ? { ...p, qty } : p)),
    )
  }, [])

  const remove: CartCtx['remove'] = useCallback((id) => setItems((p) => p.filter((x) => x.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])

  const count = items.reduce((a, b) => a + b.qty, 0)
  const subtotal = items.reduce((a, b) => a + b.harga * b.qty, 0)

  return (
    <Ctx.Provider value={{ items, add, setQty, remove, clear, count, subtotal, openDrawer: () => setDrawer(true) }}>
      {children}
      <CartFloatingButton primary={primary} onOpen={() => setDrawer(true)} count={count} />
      {drawer && <CartDrawer slug={slug} primary={primary} onClose={() => setDrawer(false)} />}
    </Ctx.Provider>
  )
}

function rupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

function CartFloatingButton({ primary, onOpen, count }: { primary?: string; onOpen: () => void; count: number }) {
  if (count === 0) return null
  return (
    <button
      onClick={onOpen}
      style={primary ? { backgroundColor: primary } : undefined}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 rounded-full text-white shadow-xl font-bold text-sm bg-gray-900 hover:opacity-90 transition-opacity"
      aria-label="Buka keranjang"
    >
      🛒 <span>{count}</span>
    </button>
  )
}

function CartDrawer({ slug, primary, onClose }: { slug: string; primary?: string; onClose: () => void }) {
  const { items, setQty, remove, subtotal } = useCart()
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-black/5">
          <h2 className="text-lg font-bold text-gray-900">Keranjang</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Keranjang kosong.</p>
          ) : items.map((it) => (
            <div key={it.id} className="flex gap-3 items-center">
              {it.gambar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.gambar_url} alt={it.nama} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              ) : <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" />}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 truncate">{it.nama}</p>
                <p className="text-xs text-gray-500">{rupiah(it.harga)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => setQty(it.id, it.qty - 1)} className="w-6 h-6 rounded-full border border-black/10 text-gray-600">−</button>
                  <span className="text-sm font-bold w-6 text-center">{it.qty}</span>
                  <button onClick={() => setQty(it.id, it.qty + 1)} className="w-6 h-6 rounded-full border border-black/10 text-gray-600">+</button>
                  <button onClick={() => remove(it.id)} className="ml-auto text-xs text-red-500 font-bold">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-black/5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold text-gray-900">{rupiah(subtotal)}</span>
            </div>
            <a
              href={`/${slug}/checkout`}
              style={primary ? { backgroundColor: primary } : undefined}
              className="block w-full text-center py-3.5 rounded-2xl text-white font-bold bg-gray-900 hover:opacity-90 transition-opacity"
            >
              Lanjut ke Checkout
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
