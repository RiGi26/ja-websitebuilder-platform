import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Eye, Layers3 } from 'lucide-react'
import { CAPABILITY_TAXONOMY, RECOMMENDATION_TIER_LABELS } from '@/lib/store/capabilities'
import {
  BUSINESS_TYPE_LABELS,
  STORE_CATEGORY_LABELS,
} from '@/lib/store/templates'
import type { StoreTemplate } from '@/lib/store/types'
import StoreShell from './StoreShell'
import TemplateStatusBadge from './TemplateStatusBadge'
import styles from './StoreTemplateDetailPage.module.css'

export default function StoreTemplateDetailPage({ template }: { template: StoreTemplate }) {
  const previewAsset = template.previewAssets?.find((asset) => asset.kind === 'hero' || asset.kind === 'card')
  const customerCan = template.customerCan.map((id) => CAPABILITY_TAXONOMY[id].label)
  const priceTiers = [
    ['website', RECOMMENDATION_TIER_LABELS.website, template.pricePresentation.website],
    ['website-portal', RECOMMENDATION_TIER_LABELS['website-portal'], template.pricePresentation.websitePortal],
    ['bundle', RECOMMENDATION_TIER_LABELS.bundle, template.pricePresentation.bundle],
  ] as const

  return (
    <StoreShell>
      <div className={styles.page} data-template={template.slug}>
        <header className={styles.hero}>
          <div className={styles.container}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/store"><ArrowLeft size={15} aria-hidden="true" /> Store</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{template.name}</span>
            </nav>

            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <div className={styles.meta}>
                  <TemplateStatusBadge status={template.previewStatus} />
                  <span>{STORE_CATEGORY_LABELS[template.category]}</span>
                </div>
                <p className={styles.eyebrow}><Layers3 size={15} aria-hidden="true" /> Template direction</p>
                <h1>{template.name}</h1>
                <p className={styles.positioning}>{template.positioning}</p>
                <p className={styles.lede}>{template.shortDescription}</p>
                <div className={styles.actions}>
                  {template.previewStatus === 'preview' ? (
                    <Link className={styles.primaryAction} href={template.previewRoute}>
                      Lihat Preview <Eye size={17} aria-hidden="true" />
                    </Link>
                  ) : (
                    <span className={styles.unavailableAction} role="status">Preview {template.previewStatus === 'coming-soon' ? 'segera hadir' : 'tersedia di live site'}</span>
                  )}
                  <Link className={styles.secondaryAction} href="#gunakan-template">Gunakan Template Ini <ArrowRight size={16} aria-hidden="true" /></Link>
                </div>
              </div>

              <div className={styles.heroVisual} aria-label={`Arah visual ${template.name}`}>
                {previewAsset ? (
                  <Image src={previewAsset.src} alt={previewAsset.alt} fill priority sizes="(max-width: 767px) 100vw, 48vw" />
                ) : (
                  <>
                    <span className={styles.visualIndex}>{String(template.sortOrder).padStart(2, '0')} / 06</span>
                    <strong>{template.shortName}</strong>
                    <span className={styles.visualCategory}>{STORE_CATEGORY_LABELS[template.category]}</span>
                  </>
                )}
                <div className={styles.visualOverlay}>
                  <span>{template.name}</span>
                  <strong>Direction untuk cara bisnis yang berbeda.</strong>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className={styles.section} aria-labelledby="audience-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Cocok untuk siapa</p>
              <h2 id="audience-title">Pilih arah yang sudah dekat dengan jenis bisnismu.</h2>
            </div>
            <div className={styles.audienceGrid}>
              <div>
                <p className={styles.bodyCopy}>Template ini dirancang untuk:</p>
                <ul className={styles.businessList}>
                  {template.businessTypes.map((businessType) => <li key={businessType}>{BUSINESS_TYPE_LABELS[businessType]}</li>)}
                </ul>
              </div>
              <div className={styles.customerCard}>
                <p className={styles.eyebrow}>Customer bisa</p>
                <ul className={styles.checkList}>
                  {customerCan.map((capability) => <li key={capability}><Check size={16} aria-hidden="true" />{capability}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.altSection}`} aria-labelledby="scope-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Ruang lingkup</p>
              <h2 id="scope-title">Fondasi yang sudah termasuk, lalu bisa dikembangkan.</h2>
            </div>
            <div className={styles.scopeGrid}>
              <div className={styles.featurePanel}>
                <h3>Termasuk di Website</h3>
                <ul className={styles.checkList}>
                  {template.includedFeatures.map((feature) => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}
                </ul>
              </div>
              <div className={styles.featurePanel}>
                <h3>Bisa ditambah nanti</h3>
                <ul className={styles.optionalList}>
                  {template.optionalFeatures.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <p>Fitur opsional tidak dianggap sudah aktif di preview. Scope dibahas terpisah.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="price-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Pilih titik mulai</p>
              <h2 id="price-title">Website dulu, tambah sistem saat alurnya membutuhkan.</h2>
              <p className={styles.headingCopy}>Harga awal hanya berlaku untuk kebutuhan website publik. Portal dan akun menyesuaikan scope.</p>
            </div>
            <div className={styles.priceGrid}>
              {priceTiers.map(([id, label, presentation]) => (
                <article className={`${styles.priceCard} ${id === 'website' ? styles.priceCardActive : ''}`} key={id}>
                  <span>{label}</span>
                  <strong>{presentation.display}</strong>
                  <p>{presentation.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.finalCta} id="gunakan-template" aria-labelledby="use-title">
          <div className={styles.container}>
            <p className={styles.eyebrow}>Langkah berikutnya</p>
            <h2 id="use-title">Gunakan {template.name} sebagai titik mulai.</h2>
            <p>Customize mandiri belum tersedia di S3. Simpan arah ini, lalu bahas isi, warna, dan scope yang perlu disesuaikan bersama Webzoka.</p>
            <div className={styles.finalActions}>
              <span className={styles.comingSoon} role="status">Customize segera hadir di tahap berikutnya.</span>
              <Link className={styles.secondaryActionLight} href="/store">Kembali ke koleksi <ArrowLeft size={16} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
      </div>
    </StoreShell>
  )
}
