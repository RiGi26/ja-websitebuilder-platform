import type { Metadata } from 'next'
import { EasyBookingExperience } from './easy-booking-experience'

export const metadata: Metadata = {
  title: 'Easy Booking',
  description: 'A rental discovery and booking inquiry Webzoka template direction.',
}

export default function EasyBookingPage() {
  return <EasyBookingExperience mode="detail" />
}
