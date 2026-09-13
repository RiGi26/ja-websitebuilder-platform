import StoreTemplateDetailPage from '@/app/store/components/StoreTemplateDetailPage'
import { createStoreMetadata } from '@/lib/store/metadata'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata = createStoreMetadata({ title: 'Care Booking — Webzoka Store', description: 'A calm appointment-request Webzoka template direction for clinics, practitioners, wellness, and care services.', pathname: '/store/template/care-booking' })

export default function CareBookingPage() {
  return <StoreTemplateDetailPage template={getStoreTemplate('care-booking')} />
}
