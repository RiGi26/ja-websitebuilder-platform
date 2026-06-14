import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Navbar from '@/app/components/Navbar'
import { getManifest } from '@/lib/theme-system/manifest'
import { BESPOKE_VARIANTS, BESPOKE_RENDERED_BLOCKS } from '@/app/components/themes/toko-bespoke/variants'
import DetailForm from './DetailForm'

export const dynamic = 'force-dynamic'

async function getOrderByToken(token: string) {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('id, tracking_token, payment_status, briefing_submitted_at, briefing_data, nama_usaha, nama_perusahaan, industri, tenant_id')
    .eq('tracking_token', token)
    .maybeSingle()
  return data
}

export default async function BriefingDetailPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const order = await getOrderByToken(token)

  if (!order) redirect('/track')
  if (!order.briefing_submitted_at) {
    redirect(`/order/briefing/${token}`)
  }

  const namaKlien = order.nama_perusahaan || order.nama_usaha || 'Customer'
  const existingTahap2 = (order.briefing_data as Record<string, unknown>)?.tahap_2 as Record<string, unknown> | undefined

  // Tema yang dipilih klien menentukan section konten mana yang relevan
  // ditampilkan (form hanya minta blok yang BENAR dirender tema). Varian bespoke
  // toko (atelier-noir dst) tidak ada di MANIFESTS → resolve lewat
  // BESPOKE_VARIANTS → BESPOKE_RENDERED_BLOCKS. Tema lama/non-composable →
  // keduanya undefined → semua false → hanya foto/testimoni klasik.
  const variant = ((order.briefing_data as Record<string, unknown>)?.branding as Record<string, unknown> | undefined)?.variant as string | undefined
  const mblocks = getManifest(variant)?.blocks
  const bespokeTheme = variant ? BESPOKE_VARIANTS[variant]?.theme : undefined
  const bblocks = bespokeTheme ? BESPOKE_RENDERED_BLOCKS[bespokeTheme] : undefined
  const activeBlocks = {
    team: !!mblocks?.team,
    pricing: !!mblocks?.pricing,
    process: !!mblocks?.process,
    partners: !!mblocks?.partners,
    social: !!(mblocks?.social || bblocks?.social),
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      <main className="pt-32 pb-24 px-4">
        <DetailForm
          token={token}
          orderId={order.id}
          namaKlien={namaKlien}
          industri={order.industri ?? ''}
          existingData={existingTahap2}
          blocks={activeBlocks}
        />
      </main>
    </div>
  )
}
