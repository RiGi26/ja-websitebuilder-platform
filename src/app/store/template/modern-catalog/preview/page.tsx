import type { Metadata } from 'next'
import StoreTemplatePreviewPage from '@/app/store/components/StoreTemplatePreviewPage'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata: Metadata = { title: 'Modern Catalog Preview — Webzoka Store', description: 'Interactive preview for the Modern Catalog Webzoka template direction.', robots: { index: false, follow: false } }

export default function ModernCatalogPreviewPage() {
  return <StoreTemplatePreviewPage template={getStoreTemplate('modern-catalog')} />
}
