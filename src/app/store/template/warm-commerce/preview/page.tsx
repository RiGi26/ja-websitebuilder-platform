import type { Metadata } from 'next'
import PreviewToolbar from '@/app/store/components/PreviewToolbar'
import WarmCommerceSite from '../WarmCommerceSite'

export const metadata: Metadata = {
  title: 'Preview Warm Commerce — Dapur Rona | Webzoka Store',
  description: 'Preview responsif template Warm Commerce menggunakan identitas bisnis fiktif Dapur Rona.',
  robots: { index: false, follow: false },
}
export default function WarmCommercePreviewPage() {
  return (
    <>
      <PreviewToolbar />
      <WarmCommerceSite />
    </>
  )
}
