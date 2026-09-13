import StoreTemplatePreviewPage from '@/app/store/components/StoreTemplatePreviewPage'
import { createStoreMetadata } from '@/lib/store/metadata'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata = createStoreMetadata({
  title: 'Preview Warm Commerce — Dapur Rona | Webzoka Store',
  description: 'Preview responsif template Warm Commerce menggunakan identitas bisnis fiktif Dapur Rona.',
  pathname: '/store/template/warm-commerce/preview',
  noIndex: true,
})

export default function WarmCommercePreviewPage() {
  return <StoreTemplatePreviewPage template={getStoreTemplate('warm-commerce')} />
}
