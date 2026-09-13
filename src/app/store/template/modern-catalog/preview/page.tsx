import StoreTemplatePreviewPage from '@/app/store/components/StoreTemplatePreviewPage'
import { createStoreMetadata } from '@/lib/store/metadata'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata = createStoreMetadata({ title: 'Modern Catalog Preview — Webzoka Store', description: 'Interactive preview for the Modern Catalog Webzoka template direction.', pathname: '/store/template/modern-catalog/preview', noIndex: true })

export default function ModernCatalogPreviewPage() {
  return <StoreTemplatePreviewPage template={getStoreTemplate('modern-catalog')} />
}
