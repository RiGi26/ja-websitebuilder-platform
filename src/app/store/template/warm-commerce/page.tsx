import type { Metadata } from 'next'
import StoreTemplateDetailPage from '@/app/store/components/StoreTemplateDetailPage'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata: Metadata = {
  title: 'Warm Commerce — Template Website Kuliner | Webzoka Store',
  description: 'Template website kuliner yang hangat, product-led, dan siap mengarahkan pelanggan ke katalog, WhatsApp, dan lokasi bisnis.',
  robots: { index: false, follow: false },
}

export default function WarmCommerceDetailPage() {
  return <StoreTemplateDetailPage template={getStoreTemplate('warm-commerce')} />
}
