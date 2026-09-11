import type { Metadata } from 'next'
import StoreTemplatePreviewPage from '@/app/store/components/StoreTemplatePreviewPage'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata: Metadata = { title: 'Care Booking Preview — Webzoka Store', description: 'Interactive preview for the Care Booking Webzoka template direction.', robots: { index: false, follow: false } }

export default function CareBookingPreviewPage() {
  return <StoreTemplatePreviewPage template={getStoreTemplate('care-booking')} />
}
