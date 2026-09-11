import type { Metadata } from 'next'
import StoreTemplateDetailPage from '@/app/store/components/StoreTemplateDetailPage'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata: Metadata = { title: 'Trust Profile — Webzoka Store', description: 'A credibility-led Webzoka template direction for professional services.', robots: { index: false, follow: false } }

export default function TrustProfilePage() {
  return <StoreTemplateDetailPage template={getStoreTemplate('trust-profile')} />
}
