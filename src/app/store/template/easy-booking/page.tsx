import StoreTemplateDetailPage from '@/app/store/components/StoreTemplateDetailPage'
import { createStoreMetadata } from '@/lib/store/metadata'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata = createStoreMetadata({ title: 'Easy Booking — Webzoka Store', description: 'A rental discovery and booking inquiry Webzoka template direction.', pathname: '/store/template/easy-booking' })

export default function EasyBookingPage() {
  return <StoreTemplateDetailPage template={getStoreTemplate('easy-booking')} />
}
