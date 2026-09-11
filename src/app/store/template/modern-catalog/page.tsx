import type { Metadata } from 'next'
import { ModernCatalogExperience } from './modern-catalog-experience'

export const metadata: Metadata = {
  title: 'Modern Catalog',
  description: 'A product-first Webzoka template direction for curated collections.',
}

export default function ModernCatalogPage() {
  return <ModernCatalogExperience mode="detail" />
}
