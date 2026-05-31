import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { refreshBookingStatus } from '@/lib/booking-status'

export const dynamic = 'force-dynamic'

function rupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

const LABEL: Record<string, { t: string; d: string; c: string }> = {
  paid: { t: 'DP Berhasil Dibayar 🎉', d: 'Terima kasih! Reservasi Anda terkonfirmasi. Penjual akan menghubungi Anda.', c: 'text-green-600' },
  awaiting_payment: { t: 'Menunggu Pembayaran', d: 'Selesaikan pembayaran DP Anda. Status diperbarui otomatis.', c: 'text-amber-500' },
  unpaid: { t: 'Menunggu Pembayaran', d: 'Selesaikan pembayaran DP Anda.', c: 'text-amber-500' },
  not_required: { t: 'Reservasi Tercatat', d: 'Reservasi Anda sudah tercatat. Penjual akan menghubungi Anda untuk konfirmasi.', c: 'text-gray-900' },
  failed: { t: 'Pembayaran Gagal', d: 'Pembayaran tidak berhasil. Silakan coba lagi.', c: 'text-red-500' },
  expired: { t: 'Pembayaran Kedaluwarsa', d: 'Waktu pembayaran habis. Silakan booking ulang.', c: 'text-red-500' },
}

export default async function BookingStatusPage({
  params, searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ id?: string }>
}) {
  const { slug } = await params
  const { id } = await searchParams
  if (!id) notFound()

  // Zero-config: tanya status langsung ke Midtrans saat pemesan kembali.
  try { await refreshBookingStatus(id) } catch { /* non-fatal */ }

  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('id, nama_pemesan, total, dp_amount, status, payment_status, page_id, jadwal')
    .eq('id', id)
    .maybeSingle()
  if (!booking) notFound()

  // Pastikan booking ini milik halaman di slug tsb (cegah enumerasi lintas tenant).
  const { data: page } = await supabaseAdmin
    .from('landing_pages').select('id').eq('slug', slug).maybeSingle()
  if (!page || page.id !== booking.page_id) notFound()

  const info = LABEL[booking.payment_status] ?? LABEL.unpaid

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
      <div className="bg-white rounded-[32px] p-10 max-w-md w-full apple-shadow border border-black/[0.03] text-center">
        <h1 className={`text-2xl font-bold mb-2 ${info.c}`}>{info.t}</h1>
        <p className="text-sm text-gray-500 mb-6">{info.d}</p>
        <div className="bg-gray-50 rounded-2xl p-5 border border-black/5 text-left space-y-2 mb-6">
          <div className="flex justify-between text-sm"><span className="text-gray-400">Pemesan</span><span className="font-bold text-gray-900">{booking.nama_pemesan}</span></div>
          {booking.dp_amount > 0 && (
            <div className="flex justify-between text-sm"><span className="text-gray-400">DP</span><span className="font-bold text-gray-900">{rupiah(Number(booking.dp_amount))}</span></div>
          )}
          <div className="flex justify-between text-sm"><span className="text-gray-400">Kode Booking</span><span className="font-mono text-gray-900">{booking.id.slice(0, 8).toUpperCase()}</span></div>
        </div>
        <Link href={`/${slug}`} className="inline-block text-sm font-bold text-gray-900 underline">← Kembali ke halaman</Link>
      </div>
    </div>
  )
}
