import StoreTemplatePreviewPage from '@/app/store/components/StoreTemplatePreviewPage'
import { createStoreMetadata } from '@/lib/store/metadata'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata = createStoreMetadata({ title: 'Trust Profile Preview — Webzoka Store', description: 'Interactive preview for the Trust Profile Webzoka template direction.', pathname: '/store/template/trust-profile/preview', noIndex: true })

export default function TrustProfilePreviewPage() {
  return <StoreTemplatePreviewPage template={getStoreTemplate('trust-profile')} />
}
