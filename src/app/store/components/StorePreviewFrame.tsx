import type { StoreTemplate } from '@/lib/store/types'
import PreviewToolbar from './PreviewToolbar'

export default function StorePreviewFrame({ template, children }: { template: StoreTemplate; children: React.ReactNode }) {
  return (
    <>
      <PreviewToolbar template={template} />
      {children}
    </>
  )
}
