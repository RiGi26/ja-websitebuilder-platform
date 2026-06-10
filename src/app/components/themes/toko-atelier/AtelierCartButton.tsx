'use client'

import { useCart } from '@/app/components/cart/CartProvider'
import type { Product } from '@/types/websitebuilder'

// Tombol keranjang bergaya atelier (.ta-cardbtn — CSS di taCss renderer).
// Dirender HANYA saat hasCart && produk DB cocok (dipasangkan di
// TokoAtelierRenderer via nama). Sample statis tak pernah memuat komponen ini,
// jadi renderToStaticMarkup aman dari useCart di luar CartProvider.
export default function AtelierCartButton({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <button
      type="button"
      className="ta-cardbtn"
      onClick={() => add({ id: product.id, nama: product.nama, harga: Number(product.harga), gambar_url: product.gambar_url })}
    >
      + Keranjang
    </button>
  )
}
