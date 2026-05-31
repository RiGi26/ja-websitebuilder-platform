import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { refreshShopOrderStatus } from '@/lib/shop-order-status'

export const dynamic = 'force-dynamic'

function rupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

const LABEL: Record<string, { t: string; d: string; c: string }> = {
  paid: { t: 'Pembayaran Berhasil 🎉', d: 'Terima kasih! Pesanan Anda sedang diproses penjual.', c: 'text-green-600' },
  awaiting_payment: { t: 'Menunggu Pembayaran', d: 'Selesaikan pembayaran Anda. Status akan diperbarui otomatis.', c: 'text-amber-500' },
  unpaid: { t: 'Menunggu Pembayaran', d: 'Selesaikan pembayaran Anda.', c: 'text-amber-500' },
  failed: { t: 'Pembayaran Gagal', d: 'Pembayaran tidak berhasil. Silakan coba lagi.', c: 'text-red-500' },
  expired: { t: 'Pembayaran Kedaluwarsa', d: 'Waktu pembayaran habis. Silakan pesan ulang.', c: 'text-red-500' },
}

export default async function OrderStatusPage({
  params, searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ id?: string }>
}) {
  const { slug } = await params
  const { id } = await searchParams
  if (!id) notFound()

  // Zero-config: tanya status langsung ke Midtrans saat pembeli kembali,
  // sehingga status terupdate walau client belum set Notification URL.
  try { await refreshShopOrderStatus(id) } catch { /* non-fatal */ }

  const { data: order } = await supabaseAdmin
    .from('shop_orders')
    .select('id, pembeli_nama, total, status, payment_status, page_id')
    .eq('id', id)
    .maybeSingle()
  if (!order) notFound()

  // Pastikan pesanan ini milik toko di slug tsb (cegah enumerasi lintas toko)
  const { data: page } = await supabaseAdmin
    .from('landing_pages').select('id').eq('slug', slug).maybeSingle()
  if (!page || page.id !== order.page_id) notFound()

  const info = LABEL[order.payment_status] ?? LABEL.unpaid

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
      <div className="bg-white rounded-[32px] p-10 max-w-md w-full apple-shadow border border-black/[0.03] text-center">
        <h1 className={`text-2xl font-bold mb-2 ${info.c}`}>{info.t}</h1>
        <p className="text-sm text-gray-500 mb-6">{info.d}</p>
        <div className="bg-gray-50 rounded-2xl p-5 border border-black/5 text-left space-y-2 mb-6">
          <div className="flex justify-between text-sm"><span className="text-gray-400">Pemesan</span><span className="font-bold text-gray-900">{order.pembeli_nama}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-400">Total</span><span className="font-bold text-gray-900">{rupiah(Number(order.total))}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-400">Kode Pesanan</span><span className="font-mono text-gray-900">{order.id.slice(0, 8).toUpperCase()}</span></div>
        </div>
        <Link href={`/${slug}`} className="inline-block text-sm font-bold text-gray-900 underline">← Kembali ke toko</Link>
      </div>
    </div>
  )
}
