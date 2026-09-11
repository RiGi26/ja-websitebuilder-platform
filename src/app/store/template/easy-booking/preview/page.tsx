import type { Metadata } from 'next'
import StoreTemplatePreviewPage from '@/app/store/components/StoreTemplatePreviewPage'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata: Metadata = { title: 'Easy Booking Preview — Webzoka Store', description: 'Interactive preview for the Easy Booking Webzoka template direction.', robots: { index: false, follow: false } }

export default function EasyBookingPreviewPage() {
  return <StoreTemplatePreviewPage template={getStoreTemplate('easy-booking')} />
}
