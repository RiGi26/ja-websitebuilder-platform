import Link from 'next/link'
import { ArrowUpRight, Eye } from 'lucide-react'
import { BUSINESS_TYPE_LABELS, STORE_CATEGORY_LABELS } from '@/lib/store/templates'
import type { StoreTemplate } from '@/lib/store/types'
import TemplateStatusBadge from './TemplateStatusBadge'
import styles from './StoreCard.module.css'

export default function StoreCard({ template, featured = false }: { template: StoreTemplate; featured?: boolean }) {
  const businessFit = template.businessTypes.map((id) => BUSINESS_TYPE_LABELS[id]).join(' · ')

  return (
    <article className={`${styles.card} ${featured ? styles.featured : ''}`} data-template={template.slug}>
      <div className={styles.art} aria-hidden="true">
        <span className={styles.artIndex}>{String(template.sortOrder).padStart(2, '0')} / 06</span>
        <span className={styles.artRule} />
        <span className={styles.artWord}>{template.shortName}</span>
        <span className={styles.artShape} />
        <span className={styles.artCaption}>{STORE_CATEGORY_LABELS[template.category]}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.metaRow}>
          <span className={styles.category}>{STORE_CATEGORY_LABELS[template.category]}</span>
          <TemplateStatusBadge status={template.previewStatus} />
        </div>
        <h3>{template.name}</h3>
        <p className={styles.positioning}>{template.positioning}</p>
        <p className={styles.fit}>
          <span>Cocok untuk</span>
          {businessFit}
        </p>
        <div className={styles.priceRow}>
          <span>Website</span>
          <strong>{template.pricePresentation.website.display}</strong>
        </div>
        <div className={styles.actions}>
          <Link className={styles.primaryAction} href={template.detailRoute}>
            Lihat Template <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          {template.previewStatus === 'preview' && (
            <Link className={styles.previewAction} href={template.previewRoute}>
              <Eye size={16} aria-hidden="true" /> Preview
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
