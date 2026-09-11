import type { Metadata } from 'next'
import { CareBookingExperience } from './care-booking-experience'

export const metadata: Metadata = {
  title: 'Care Booking',
  description: 'A calm appointment-request Webzoka template direction for clinics, practitioners, wellness, and care services.',
}

export default function CareBookingPage() {
  return <CareBookingExperience mode="detail" />
}
