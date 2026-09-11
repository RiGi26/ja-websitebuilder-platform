import type { Metadata } from 'next'
import StoreTemplatePreviewPage from '@/app/store/components/StoreTemplatePreviewPage'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata: Metadata = { title: 'Trust Profile Preview — Webzoka Store', description: 'Interactive preview for the Trust Profile Webzoka template direction.', robots: { index: false, follow: false } }

export default function TrustProfilePreviewPage() {
  return <StoreTemplatePreviewPage template={getStoreTemplate('trust-profile')} />
}
