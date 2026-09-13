import StoreTemplateDetailPage from '@/app/store/components/StoreTemplateDetailPage'
import { createStoreMetadata } from '@/lib/store/metadata'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata = createStoreMetadata({ title: 'Trust Profile — Webzoka Store', description: 'A credibility-led Webzoka template direction for professional services.', pathname: '/store/template/trust-profile' })

export default function TrustProfilePage() {
  return <StoreTemplateDetailPage template={getStoreTemplate('trust-profile')} />
}
