'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleHelp,
  Clock3,
  MessageCircle,
  Pencil,
  RefreshCcw,
  Store,
  WalletCards,
} from 'lucide-react'
import { resumeCustomizeDraft } from '@/lib/store/customize'
import { ANALYTICS_EVENTS, trackEvent, trackEventOnce } from '@/lib/analytics'
import { buildStoreWhatsAppLink, type StoreWhatsAppLink } from '@/lib/store/whatsapp'
import {
  buildSummaryWhatsAppMessage,
  resolveSummary,
  type SummaryReadinessItem,
  type SummaryResolution,
  type SummaryViewModel,
} from '@/lib/store/summary'
import StoreShell from './StoreShell'
import styles from './SummaryView.module.css'

type SummaryState = { readonly status: 'loading' } | SummaryResolution

interface SummaryHandoff {
  readonly message: string | null
  readonly link: StoreWhatsAppLink
  readonly messageError: boolean
}

function getSessionStorage(): Storage | null {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function unavailableLink(): StoreWhatsAppLink {
  return { available: false, href: null, number: null, status: 'missing-number' }
}

function createHandoff(viewModel: SummaryViewModel): SummaryHandoff {
  try {
    const message = buildSummaryWhatsAppMessage(viewModel)
    return { message, link: buildStoreWhatsAppLink(message), messageError: false }
  } catch {
    return { message: null, link: unavailableLink(), messageError: true }
  }
}

function recoveryCopy(reason: Exclude<SummaryResolution, { status: 'ready' }>['reason']): { title: string; body: string } {
  if (reason === 'corrupt-draft') {
    return {
      title: 'Draft belum bisa dibaca.',
      body: 'Jawaban di sesi browser ini tidak lengkap atau sudah berubah. Kamu bisa mulai ulang dari template yang dipilih.',
    }
  }
  if (reason === 'stale-template') {
    return {
      title: 'Template ini sudah tidak tersedia.',
      body: 'Kami tidak mengalihkanmu ke template lain. Kembali ke Store untuk memilih fondasi yang masih tersedia.',
    }
  }
  if (reason === 'incomplete-draft') {
    return {
      title: 'Ringkasan belum siap.',
      body: 'Selesaikan empat langkah pertanyaan dulu agar kebutuhan dan rekomendasi bisa dirangkum dengan benar.',
    }
  }
  return {
    title: 'Belum ada draft Customize.',
    body: 'Ringkasan hanya tersedia setelah kamu menyelesaikan pertanyaan di sesi browser ini. Mulai dari satu contoh website, lalu ceritakan kebutuhan bisnismu.',
  }
}

function SectionList({ items }: { items: readonly string[] }) {
  return (
    <ul className={styles.detailList}>
      {items.map((item) => (
        <li key={item}>
          <Check size={16} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function DetailSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className={styles.detailSection} aria-labelledby={id}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>Ringkasan</p>
        <h2 id={id}>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function ReadinessList({ items }: { items: readonly SummaryReadinessItem[] }) {
  if (items.length === 0) {
    return <p className={styles.emptyDetail}>Belum ada area kesiapan yang ditentukan.</p>
  }

  return (
    <div className={styles.readinessGrid}>
      {items.map((item) => (
        <div className={styles.readinessItem} key={item.label}>
          <span>{item.label}</span>
          <strong>{item.state}</strong>
        </div>
      ))}
    </div>
  )
}

function SummaryContent({ resolution }: { resolution: Extract<SummaryResolution, { status: 'ready' }> }) {
  const router = useRouter()
  const { viewModel } = resolution
  const handoff = createHandoff(viewModel)

  useEffect(() => {
    trackEventOnce(ANALYTICS_EVENTS.recommendationViewed, {
      template_slug: resolution.templateSlug,
      recommendation_tier: viewModel.recommendation.tier,
    }, `recommendation:${resolution.templateSlug}:${viewModel.recommendation.tier}`)
    trackEventOnce(ANALYTICS_EVENTS.summaryViewed, {
      template_slug: resolution.templateSlug,
      recommendation_tier: viewModel.recommendation.tier,
    }, `summary:${resolution.templateSlug}:${viewModel.recommendation.tier}`)
  }, [resolution.templateSlug, viewModel.recommendation.tier])

  const editAnswers = () => {
    resumeCustomizeDraft(getSessionStorage(), resolution.templateSlug)
    router.push(viewModel.template.customizeRoute)
  }

  const unavailableReason = handoff.messageError
    ? 'Pesan konsultasi belum dapat dibuat. Coba kembali ke pertanyaan atau mulai lagi.'
    : handoff.link.status === 'invalid-number'
      ? 'Nomor tujuan WhatsApp di Preview belum tersedia. Tombol akan aktif setelah tujuan konsultasi tersedia.'
      : 'WhatsApp belum tersedia di Preview. Tombol akan aktif setelah tujuan konsultasi tersedia.'

  return (
    <div className={styles.page} data-summary-status="ready" data-recommendation-tier={viewModel.recommendation.tier}>
      <div className={styles.container}>
        <div className={styles.topline}>
          <Link className={styles.backLink} href="/store">
            <ArrowLeft size={16} aria-hidden="true" /> Kembali ke Store
          </Link>
          <button className={styles.editLink} type="button" onClick={editAnswers}>
            <Pencil size={15} aria-hidden="true" /> Edit jawaban
          </button>
        </div>

        <header className={styles.intro}>
          <p className={styles.eyebrow}>Ringkasan kebutuhan</p>
          <h1>Kebutuhanmu sudah siap dibawa ke konsultasi.</h1>
          <p>Ini adalah rangkuman dari jawabanmu dan rekomendasi awal. Cakupan pekerjaan, harga final, dan langkah pengerjaan dibahas bersama tim Webzoka.</p>
        </header>

        <section className={styles.templateCard} aria-labelledby="selected-template-title">
          <div className={styles.templateMark} aria-hidden="true"><Store size={22} /></div>
          <div className={styles.templateCopy}>
            <p className={styles.eyebrow}>Template terpilih</p>
            <h2 id="selected-template-title">{viewModel.template.name}</h2>
            <p className={styles.templateMeta}>{viewModel.template.category}</p>
            <p>{viewModel.template.description}</p>
          </div>
          <Link className={styles.templateLink} href={viewModel.template.detailRoute}>
            Lihat contoh website <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </section>

        <section className={styles.recommendation} aria-labelledby="recommendation-title">
          <div className={styles.recommendationTopline}>
            <div className={styles.recommendationLabel}><WalletCards size={18} aria-hidden="true" /><span>Rekomendasi awal</span></div>
            <span className={styles.tierBadge}>{viewModel.recommendation.label}</span>
          </div>
          <h2 id="recommendation-title">{viewModel.recommendation.label}</h2>
          <p className={styles.recommendationSummary}>{viewModel.recommendation.summary}</p>
          <div className={styles.recommendationReason}>
            <p className={styles.miniLabel}>Alasan</p>
            <SectionList items={viewModel.recommendation.reasons} />
          </div>
          <div className={styles.priceRow}>
            <div><p className={styles.miniLabel}>Gambaran harga</p><strong>{viewModel.recommendation.price.display}</strong></div>
            <p>{viewModel.recommendation.price.note}</p>
          </div>
          {viewModel.recommendation.requiresConsultation ? (
            <p className={styles.consultationNote}><CircleHelp size={17} aria-hidden="true" /> Perlu konsultasi muncul saat beberapa kebutuhan belum cukup jelas. Tim Webzoka akan membahasnya bersamamu sebelum pekerjaan dimulai.</p>
          ) : null}
        </section>

        <div className={styles.detailGrid}>
          <DetailSection id="business-context-title" title="Bisnis dan konteks">
            <div className={styles.contextGrid}>
              <div><span>Jenis bisnis</span><strong>{viewModel.business.type}</strong></div>
              <div><span>Kategori</span><strong>{viewModel.business.category}</strong></div>
              {viewModel.business.area ? <div><span>Area layanan</span><strong>{viewModel.business.area}</strong></div> : null}
              <div><span>Website saat ini</span><strong>{viewModel.business.websiteStatus}</strong></div>
              <div><span>Channel yang dipakai</span><strong>{viewModel.business.contactChannels.join(', ') || 'Belum dicantumkan'}</strong></div>
            </div>
          </DetailSection>

          <DetailSection id="customer-needs-title" title="Kebutuhan pelanggan">
            <SectionList items={viewModel.customerNeeds} />
          </DetailSection>

          <DetailSection id="operational-needs-title" title="Kebutuhan operasional">
            <SectionList items={viewModel.operationalNeeds} />
          </DetailSection>

          {viewModel.accountNeeds.length > 0 ? (
            <DetailSection id="account-needs-title" title="Kebutuhan akun / member">
              <SectionList items={viewModel.accountNeeds} />
            </DetailSection>
          ) : null}

          <DetailSection id="readiness-title" title="Kesiapan bisnis">
            <ReadinessList items={viewModel.readiness} />
            <div className={styles.timelineRow}><Clock3 size={18} aria-hidden="true" /><div><span>Timeline pilihan</span><strong>{viewModel.timeline}</strong></div></div>
          </DetailSection>
        </div>

        <section className={styles.handoff} aria-labelledby="handoff-title">
          <div className={styles.handoffIcon} aria-hidden="true"><MessageCircle size={24} /></div>
          <div className={styles.handoffCopy}>
            <p className={styles.eyebrow}>Langkah berikutnya</p>
            <h2 id="handoff-title">Bawa ringkasan ini ke percakapan yang tepat.</h2>
            <p>Rekomendasi ini masih awal. Kirim ringkasan ke WhatsApp untuk membahas kebutuhan dan langkah berikutnya. Mengklik tombol tidak berarti kamu membeli atau membayar apa pun.</p>
            {handoff.link.available && handoff.link.href ? (
              <a
                className={styles.primaryAction}
                href={handoff.link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent(ANALYTICS_EVENTS.whatsappConsultationClick, {
                  template_slug: resolution.templateSlug,
                  recommendation_tier: viewModel.recommendation.tier,
                  source_page: '/store/summary',
                })}
              >
                Konsultasikan via WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ) : (
              <button className={styles.primaryAction} type="button" disabled aria-describedby="whatsapp-status">
                Konsultasikan via WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
              </button>
            )}
            <p id="whatsapp-status" className={styles.handoffStatus} role="status">{handoff.link.available ? 'Pesan konsultasi sudah disiapkan. Periksa kembali isinya sebelum dikirim.' : unavailableReason}</p>
          </div>
        </section>

        <div className={styles.bottomActions}>
          <button className={styles.secondaryAction} type="button" onClick={editAnswers}><Pencil size={16} aria-hidden="true" /> Edit jawaban</button>
          <Link className={styles.storeAction} href="/store"><ArrowLeft size={16} aria-hidden="true" /> Kembali ke Store</Link>
        </div>
      </div>
    </div>
  )
}

function SummaryRecovery({ resolution }: { resolution: Extract<SummaryResolution, { status: 'recovery' }> }) {
  const copy = recoveryCopy(resolution.reason)
  return (
    <div className={styles.page} data-summary-status={resolution.reason}>
      <div className={styles.container}>
        <div className={styles.topline}>
          <Link className={styles.backLink} href="/store"><ArrowLeft size={16} aria-hidden="true" /> Kembali ke Store</Link>
        </div>
        <section className={styles.recovery} aria-labelledby="recovery-title">
          <div className={styles.recoveryIcon} aria-hidden="true"><RefreshCcw size={24} /></div>
          <p className={styles.eyebrow}>Ringkasan kebutuhan</p>
          <h1 id="recovery-title">{copy.title}</h1>
          <p>{copy.body}</p>
          <div className={styles.recoveryActions}>
            <Link className={styles.primaryAction} href="/store#templates">Mulai lagi <ArrowRight size={17} aria-hidden="true" /></Link>
            {resolution.customizeRoute ? <Link className={styles.secondaryAction} href={resolution.customizeRoute}>Lanjutkan pertanyaan <ArrowRight size={16} aria-hidden="true" /></Link> : null}
          </div>
        </section>
      </div>
    </div>
  )
}

export default function SummaryView() {
  const [state, setState] = useState<SummaryState>({ status: 'loading' })

  useEffect(() => {
    setState(resolveSummary(getSessionStorage()))
  }, [])

  return (
    <StoreShell>
      {state.status === 'loading' ? (
        <div className={styles.page} data-summary-status="loading">
          <div className={styles.container}>
            <section className={styles.loadingState} aria-busy="true" aria-labelledby="summary-loading-title">
              <p className={styles.eyebrow}>Ringkasan kebutuhan</p>
              <h1 id="summary-loading-title">Menyiapkan ringkasanmu.</h1>
              <p>Memeriksa draft Customize di sesi browser ini…</p>
            </section>
          </div>
        </div>
      ) : state.status === 'ready' ? (
        <SummaryContent resolution={state} />
      ) : (
        <SummaryRecovery resolution={state} />
      )}
    </StoreShell>
  )
}
