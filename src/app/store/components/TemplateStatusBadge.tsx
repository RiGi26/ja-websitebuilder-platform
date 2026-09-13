import type { TemplateStatus } from '@/lib/store/types'
import { STORE_STATUS_LABELS } from '@/lib/store/templates'
import styles from './TemplateStatusBadge.module.css'

export default function TemplateStatusBadge({ status }: { status: TemplateStatus }) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      <i aria-hidden="true" />
      {STORE_STATUS_LABELS[status]}
    </span>
  )
}
