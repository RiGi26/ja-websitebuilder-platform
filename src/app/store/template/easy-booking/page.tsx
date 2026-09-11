import type { Metadata } from 'next'
import StoreTemplateDetailPage from '@/app/store/components/StoreTemplateDetailPage'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata: Metadata = { title: 'Easy Booking — Webzoka Store', description: 'A rental discovery and booking inquiry Webzoka template direction.', robots: { index: false, follow: false } }

export default function EasyBookingPage() {
  return <StoreTemplateDetailPage template={getStoreTemplate('easy-booking')} />
}
