import type { StoreTemplate } from '@/lib/store/types'
import { CircleHelp } from 'lucide-react'
import AnalyticsView from './AnalyticsView'
import PreviewToolbar from './PreviewToolbar'
import styles from './StorePreviewFrame.module.css'

export default function StorePreviewFrame({ template, children }: { template: StoreTemplate; children: React.ReactNode }) {
  return (
    <>
      <AnalyticsView
        eventName="store_preview_view"
        properties={{ template_slug: template.slug }}
        dedupeKey={`preview:${template.slug}`}
      />
      <PreviewToolbar template={template} />
      <aside className={styles.notice} aria-label="Informasi preview">
        <CircleHelp size={17} aria-hidden="true" />
        <span>Ini adalah contoh demo tampilan. Website final akan disesuaikan dengan bisnis dan kebutuhanmu.</span>
      </aside>
      {children}
    </>
  )
}
