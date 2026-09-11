import type { Metadata } from 'next'
import { TrustProfileExperience } from '../trust-profile-experience'

export const metadata: Metadata = {
  title: 'Trust Profile Preview',
  description: 'Interactive preview for the Trust Profile Webzoka template direction.',
}

export default function TrustProfilePreviewPage() {
  return <TrustProfileExperience mode="preview" />
}
