import StoreTemplatePreviewPage from '@/app/store/components/StoreTemplatePreviewPage'
import { createStoreMetadata } from '@/lib/store/metadata'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata = createStoreMetadata({ title: 'Easy Booking Preview — Webzoka Store', description: 'Interactive preview for the Easy Booking Webzoka template direction.', pathname: '/store/template/easy-booking/preview', noIndex: true })

export default function EasyBookingPreviewPage() {
  return <StoreTemplatePreviewPage template={getStoreTemplate('easy-booking')} />
}
