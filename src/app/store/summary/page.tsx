import SummaryView from '@/app/store/components/SummaryView'
import { createStoreMetadata } from '@/lib/store/metadata'

export const metadata = createStoreMetadata({
  title: 'Ringkasan kebutuhan — Webzoka Store',
  description: 'Tinjau kebutuhan bisnis dan rekomendasi awal sebelum konsultasi dengan Webzoka.',
  pathname: '/store/summary',
  noIndex: true,
})

export default function StoreSummaryRoute() {
  return <SummaryView />
}
