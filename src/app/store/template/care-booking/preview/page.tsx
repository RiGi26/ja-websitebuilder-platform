import type { Metadata } from 'next'
import { CareBookingExperience } from '../care-booking-experience'

export const metadata: Metadata = {
  title: 'Care Booking Preview',
  description: 'Interactive preview for the Care Booking Webzoka template direction.',
}

export default function CareBookingPreviewPage() {
  return <CareBookingExperience mode="preview" />
}
