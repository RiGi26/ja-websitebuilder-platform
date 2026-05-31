'use client'

import { useCart } from './CartProvider'
import type { Product } from '@/types/websitebuilder'

// Tombol "Tambah ke Keranjang" untuk satu produk. Dipakai di ProductList.
// Hanya dirender saat website mengaktifkan fitur toko (hasCart).
export default function AddToCartButton({ product, primary }: { product: Product; primary?: string }) {
  const { add } = useCart()
  return (
    <button
      onClick={() => add({ id: product.id, nama: product.nama, harga: Number(product.harga), gambar_url: product.gambar_url })}
      style={primary ? { backgroundColor: primary } : undefined}
      className="mt-3 w-full py-2 rounded-xl text-white text-[11px] font-bold uppercase tracking-widest bg-gray-900 hover:opacity-90 transition-opacity"
    >
      + Keranjang
    </button>
  )
}
