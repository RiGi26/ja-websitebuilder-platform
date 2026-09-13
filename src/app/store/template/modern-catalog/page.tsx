import StoreTemplateDetailPage from '@/app/store/components/StoreTemplateDetailPage'
import { createStoreMetadata } from '@/lib/store/metadata'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata = createStoreMetadata({ title: 'Modern Catalog — Webzoka Store', description: 'A product-first Webzoka template direction for curated collections.', pathname: '/store/template/modern-catalog' })

export default function ModernCatalogPage() {
  return <StoreTemplateDetailPage template={getStoreTemplate('modern-catalog')} />
}
