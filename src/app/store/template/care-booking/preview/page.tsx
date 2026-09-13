import StoreTemplatePreviewPage from '@/app/store/components/StoreTemplatePreviewPage'
import { createStoreMetadata } from '@/lib/store/metadata'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata = createStoreMetadata({ title: 'Care Booking Preview — Webzoka Store', description: 'Interactive preview for the Care Booking Webzoka template direction.', pathname: '/store/template/care-booking/preview', noIndex: true })

export default function CareBookingPreviewPage() {
  return <StoreTemplatePreviewPage template={getStoreTemplate('care-booking')} />
}
