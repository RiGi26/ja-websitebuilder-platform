import StoreTemplateDetailPage from '@/app/store/components/StoreTemplateDetailPage'
import { createStoreMetadata } from '@/lib/store/metadata'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata = createStoreMetadata({
  title: 'Warm Commerce — Template Website Kuliner | Webzoka Store',
  description: 'Template website kuliner yang hangat, product-led, dan siap mengarahkan pelanggan ke katalog, WhatsApp, dan lokasi bisnis.',
  pathname: '/store/template/warm-commerce',
})

export default function WarmCommerceDetailPage() {
  return <StoreTemplateDetailPage template={getStoreTemplate('warm-commerce')} />
}
