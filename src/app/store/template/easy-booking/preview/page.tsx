import type { Metadata } from 'next'
import { EasyBookingExperience } from '../easy-booking-experience'

export const metadata: Metadata = {
  title: 'Easy Booking Preview',
  description: 'Interactive preview for the Easy Booking Webzoka template direction.',
}

export default function EasyBookingPreviewPage() {
  return <EasyBookingExperience mode="preview" />
}
