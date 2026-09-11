import type { Metadata } from 'next'
import StoreTemplateDetailPage from '@/app/store/components/StoreTemplateDetailPage'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata: Metadata = { title: 'Care Booking — Webzoka Store', description: 'A calm appointment-request Webzoka template direction for clinics, practitioners, wellness, and care services.', robots: { index: false, follow: false } }

export default function CareBookingPage() {
  return <StoreTemplateDetailPage template={getStoreTemplate('care-booking')} />
}
