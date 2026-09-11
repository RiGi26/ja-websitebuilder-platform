import type { Metadata } from 'next'
import { TrustProfileExperience } from './trust-profile-experience'

export const metadata: Metadata = {
  title: 'Trust Profile',
  description: 'A credibility-led Webzoka template direction for professional services.',
}

export default function TrustProfilePage() {
  return <TrustProfileExperience mode="detail" />
}
