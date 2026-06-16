import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Navbar from '@/app/components/Navbar'
import BriefingForm from './BriefingForm'

export const dynamic = 'force-dynamic'

async function getOrderByToken(token: string) {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('id, tracking_token, payment_status, briefing_submitted_at, briefing_data, nama_usaha, nama_perusahaan, nomor_wa, email, industri, selected_addons, total_estimasi')
    .eq('tracking_token', token)
    .maybeSingle()
  return data
}

export default async function BriefingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const order = await getOrderByToken(token)

  // Token tidak valid
  if (!order) {
    redirect('/track')
  }

  // Belum bayar DP — bawa token supaya /track menampilkan banner briefing begitu
  // pembayaran terkonfirmasi (auto-refresh 30 dtk), alih-alih jadi dead-end.
  if (order.payment_status !== 'dp_paid') {
    redirect(`/track?id=${order.id}&token=${token}`)
  }

  const namaKlien = order.nama_perusahaan || order.nama_usaha || 'Customer'

  // Handoff tema dari galeri corp (Fase 3): default sub-kat + varian brief form.
  // Disetel payment/create saat insert; null untuk order tanpa handoff.
  const preselect = (order.briefing_data as Record<string, unknown> | null)?.preselect as
    | { sub_kategori?: string | null; variant?: string }
    | undefined

  // Sudah submit — tampilkan readonly summary
  if (order.briefing_submitted_at) {
    return (
      <div className="min-h-screen bg-[#F5F5F7]">
        <Navbar />
        <main className="pt-32 pb-24 px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-[32px] p-10 shadow-sm border border-black/[0.04]">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">✅</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
                Briefing Sudah Diterima!
              </h1>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Terima kasih {namaKlien}. Tim kami sedang review brief Anda dan akan segera menghubungi via WhatsApp.
              </p>
              <a
                href={`/track?id=${order.id}`}
                className="inline-flex items-center gap-2 py-3 px-6 bg-[#0071E3] text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors text-sm"
              >
                Lacak Progress
              </a>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      <main className="pt-32 pb-24 px-4">
        <BriefingForm
          token={token}
          orderId={order.id}
          namaKlien={namaKlien}
          nomorWa={order.nomor_wa ?? ''}
          email={order.email ?? ''}
          industri={order.industri ?? ''}
          selectedAddons={order.selected_addons ?? []}
          preselect={preselect}
        />
      </main>
    </div>
  )
}
