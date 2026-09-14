import type { StoreTemplate } from '@/lib/store/types'
import { CircleHelp } from 'lucide-react'
import PreviewToolbar from './PreviewToolbar'
import styles from './StorePreviewFrame.module.css'

export default function StorePreviewFrame({ template, children }: { template: StoreTemplate; children: React.ReactNode }) {
  return (
    <>
      <PreviewToolbar template={template} />
      <aside className={styles.notice} aria-label="Informasi preview">
        <CircleHelp size={17} aria-hidden="true" />
        <span>Ini adalah contoh demo tampilan. Website final akan disesuaikan dengan bisnis dan kebutuhanmu.</span>
      </aside>
      {children}
    </>
  )
}
