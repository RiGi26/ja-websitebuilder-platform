import type { Metadata } from 'next'
import StoreTemplatePreviewPage from '@/app/store/components/StoreTemplatePreviewPage'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata: Metadata = {
  title: 'Preview Warm Commerce — Dapur Rona | Webzoka Store',
  description: 'Preview responsif template Warm Commerce menggunakan identitas bisnis fiktif Dapur Rona.',
  robots: { index: false, follow: false },
}

export default function WarmCommercePreviewPage() {
  return <StoreTemplatePreviewPage template={getStoreTemplate('warm-commerce')} />
}
