import type { Metadata } from 'next'
import SummaryView from '@/app/store/components/SummaryView'

export const metadata: Metadata = {
  title: 'Ringkasan kebutuhan — Webzoka Store',
  description: 'Tinjau kebutuhan bisnis dan rekomendasi awal sebelum konsultasi dengan Webzoka.',
  robots: { index: false, follow: false },
}

export default function StoreSummaryRoute() {
  return <SummaryView />
}
