import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { StoreTemplate } from '@/lib/store/types'
import { STORE_CATEGORY_LABELS } from '@/lib/store/templates'
import TemplateStatusBadge from './TemplateStatusBadge'
import styles from './PreviewToolbar.module.css'

export default function PreviewToolbar({ template }: { template: StoreTemplate }) {
  return (
    <div className={styles.toolbar} role="toolbar" aria-label={`Toolbar preview ${template.name}`}>
      <Link href={template.detailRoute} className={styles.back} aria-label={`Kembali ke detail ${template.name}`}>
        <ArrowLeft size={18} aria-hidden="true" /><span>Kembali</span>
      </Link>
      <div className={styles.identity}>
        <strong>{template.name}</strong>
        <span>{STORE_CATEGORY_LABELS[template.category]}</span>
      </div>
      <div className={styles.status}><TemplateStatusBadge status={template.previewStatus} /></div>
      <Link href={`${template.detailRoute}#gunakan-template`} className={styles.action}>
        Gunakan Template Ini <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  )
}
