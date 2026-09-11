import type { Metadata } from 'next'
import { ModernCatalogExperience } from '../modern-catalog-experience'

export const metadata: Metadata = {
  title: 'Modern Catalog Preview',
  description: 'Interactive preview for the Modern Catalog Webzoka template direction.',
}

export default function ModernCatalogPreviewPage() {
  return <ModernCatalogExperience mode="preview" />
}
