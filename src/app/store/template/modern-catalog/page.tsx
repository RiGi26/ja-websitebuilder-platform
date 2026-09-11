import type { Metadata } from 'next'
import StoreTemplateDetailPage from '@/app/store/components/StoreTemplateDetailPage'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata: Metadata = { title: 'Modern Catalog — Webzoka Store', description: 'A product-first Webzoka template direction for curated collections.', robots: { index: false, follow: false } }

export default function ModernCatalogPage() {
  return <StoreTemplateDetailPage template={getStoreTemplate('modern-catalog')} />
}
