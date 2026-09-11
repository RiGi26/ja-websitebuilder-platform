import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import styles from './PreviewToolbar.module.css'

export default function PreviewToolbar() {
  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Toolbar preview Warm Commerce">
      <Link href="/store/template/warm-commerce" className={styles.back} aria-label="Kembali ke detail Warm Commerce">
        <ArrowLeft size={18} aria-hidden="true" /><span>Kembali</span>
      </Link>
      <div className={styles.identity}>
        <strong>Warm Commerce</strong>
        <span><i aria-hidden="true" />Preview responsif</span>
      </div>
      <Link href="/store/template/warm-commerce#gunakan-template" className={styles.action}>
        Gunakan Template Ini <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  )
}
