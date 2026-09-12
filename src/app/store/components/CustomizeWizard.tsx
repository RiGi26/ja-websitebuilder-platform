'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  FileText,
  Globe2,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RotateCcw,
  Save,
  Store,
} from 'lucide-react'
import { CAPABILITY_TAXONOMY } from '@/lib/store/capabilities'
import {
  BUSINESS_CATEGORY_OPTIONS,
  CONTACT_CHANNEL_OPTIONS,
  CURRENT_WEBSITE_STATUS_OPTIONS,
  CUSTOMIZE_STEP_LABELS,
  createCustomizeDraft,
  getCustomizeConfig,
  OPERATIONAL_MODE_OPTIONS,
  READINESS_STATE_OPTIONS,
  readCustomizeDraft,
  resetCustomizeDraft,
  setCustomerNeeds,
  setCustomerNeedsUncertain,
  setOperationalMode,
  setOperationalNeeds,
  TIMELINE_OPTIONS,
  writeCustomizeDraft,
} from '@/lib/store/customize'
import { recommendStoreSolution } from '@/lib/store/recommendation'
import { STORE_CATEGORY_LABELS } from '@/lib/store/templates'
import type {
  CapabilityId,
  ContactChannelId,
  CustomizeDraft,
  CustomizeStep,
  CurrentWebsiteStatus,
  OperationalSelectionMode,
  ReadinessAssetId,
  ReadinessState,
  StoreTemplate,
  TimelinePreference,
} from '@/lib/store/types'
import StoreShell from './StoreShell'
import styles from './CustomizeWizard.module.css'

type StepError = 'business-type' | 'customer-needs' | 'operational-needs'

const CONTACT_CHANNEL_ICONS = {
  whatsapp: MessageCircle,
  instagram: Globe2,
  marketplace: Store,
  phone: Phone,
  email: Mail,
  'walk-in': MapPin,
  other: CircleHelp,
} as const

const ASSET_LABELS: Record<ReadinessAssetId, string> = {
  logo: 'Logo bisnis',
  domain: 'Nama domain',
  photos: 'Foto / visual',
  catalog: 'Daftar isi bisnis',
  'business-copy': 'Teks profil dan cerita bisnis',
}

function getSessionStorage(): Storage | null {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function ChoiceOption({
  id,
  name,
  type,
  checked,
  label,
  description,
  onChange,
}: {
  id: string
  name: string
  type: 'checkbox' | 'radio'
  checked: boolean
  label: string
  description?: string
  onChange: () => void
}) {
  return (
    <label className={styles.choice} data-selected={checked ? 'true' : 'false'} htmlFor={id}>
      <input id={id} name={name} type={type} checked={checked} onChange={onChange} />
      <span className={styles.choiceBody}>
        <span className={styles.choiceLabel}>{label}</span>
        {description ? <span className={styles.choiceDescription}>{description}</span> : null}
      </span>
      <span className={styles.choiceMark} aria-hidden="true">{checked ? <Check size={16} /> : null}</span>
    </label>
  )
}

function CapabilityOption({
  id,
  checked,
  onChange,
  disabled = false,
}: {
  id: CapabilityId
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) {
  const capability = CAPABILITY_TAXONOMY[id]
  return (
    <label className={`${styles.choice} ${disabled ? styles.choiceDisabled : ''}`} data-selected={checked ? 'true' : 'false'} htmlFor={`capability-${id}`}>
      <input id={`capability-${id}`} name={`capability-${capability.group}`} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
      <span className={styles.choiceBody}>
        <span className={styles.choiceLabel}>{capability.label}</span>
        <span className={styles.choiceDescription}>{capability.description}</span>
      </span>
      <span className={styles.choiceMark} aria-hidden="true">{checked ? <Check size={16} /> : null}</span>
    </label>
  )
}

function assetStateLabel(state: ReadinessState): string {
  if (state === 'ready') return 'Sudah ada'
  if (state === 'missing') return 'Belum ada'
  if (state === 'help') return 'Perlu dibantu'
  return 'Belum ditentukan'
}

function selectedCountLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}

export default function CustomizeWizard({ template }: { template: StoreTemplate }) {
  const router = useRouter()
  const config = getCustomizeConfig(template)
  const [draft, setDraft] = useState<CustomizeDraft>(() => createCustomizeDraft(template))
  const [hydrated, setHydrated] = useState(false)
  const [stepError, setStepError] = useState<StepError | null>(null)
  const [storageMessage, setStorageMessage] = useState('')
  const skipNextPersist = useRef(false)

  useEffect(() => {
    const restored = readCustomizeDraft(getSessionStorage(), template.slug)
    if (restored) {
      setDraft(restored)
      setStorageMessage('Draft sebelumnya dipulihkan dari sesi browser ini.')
    } else if (!getSessionStorage()) {
      setStorageMessage('Penyimpanan sesi browser tidak tersedia. Jawaban tetap bisa dipakai selama halaman ini terbuka.')
    }
    setHydrated(true)
  }, [template.slug])

  useEffect(() => {
    if (!hydrated) return
    if (skipNextPersist.current) {
      skipNextPersist.current = false
      return
    }
    if (!writeCustomizeDraft(getSessionStorage(), draft)) {
      setStorageMessage('Draft belum bisa disimpan di browser ini. Coba tetap di tab yang sama.')
    }
  }, [draft, hydrated])

  const updateDraft = (next: Partial<CustomizeDraft>) => {
    setDraft((current) => ({ ...current, ...next, status: 'draft' }))
    setStepError(null)
  }

  const focusStepError = (error: StepError) => {
    window.requestAnimationFrame(() => {
      const targetId = error === 'business-type'
        ? 'business-type'
        : error === 'customer-needs'
          ? 'customer-needs-unsure'
          : 'operational-mode-selected'
      document.getElementById(targetId)?.focus()
    })
  }

  const validateCurrentStep = (): boolean => {
    if (draft.currentStep === 1 && draft.businessType.trim().length < 2) {
      setStepError('business-type')
      focusStepError('business-type')
      return false
    }
    if (draft.currentStep === 2 && draft.customerNeeds.length === 0 && !draft.uncertainties.includes('customer-needs')) {
      setStepError('customer-needs')
      focusStepError('customer-needs')
      return false
    }
    if (draft.currentStep === 3 && draft.operationalMode === 'selected' && draft.operationalNeeds.length === 0) {
      setStepError('operational-needs')
      focusStepError('operational-needs')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (!validateCurrentStep()) return
    if (draft.currentStep === 4) {
      setDraft((current) => ({ ...current, status: 'complete', currentStep: 4 }))
      setStorageMessage('Kebutuhanmu sudah tersimpan di sesi browser ini.')
      return
    }
    updateDraft({ currentStep: (draft.currentStep + 1) as CustomizeStep })
  }

  const handleBack = () => {
    setStepError(null)
    if (draft.currentStep === 1) {
      router.push(template.detailRoute)
      return
    }
    updateDraft({ currentStep: (draft.currentStep - 1) as CustomizeStep })
  }

  const handleReset = () => {
    if (!window.confirm('Mulai lagi dari awal? Jawaban Customize untuk template ini akan dihapus dari sesi browser.')) return
    resetCustomizeDraft(getSessionStorage(), template.slug)
    skipNextPersist.current = true
    setDraft(createCustomizeDraft(template))
    setStepError(null)
    setStorageMessage('Draft direset. Kamu bisa mulai lagi dari awal.')
  }

  const toggleContactChannel = (id: ContactChannelId) => {
    const next = draft.currentContactChannels.includes(id)
      ? draft.currentContactChannels.filter((current) => current !== id)
      : [...draft.currentContactChannels, id]
    updateDraft({ currentContactChannels: next })
  }

  const toggleCustomerCapability = (id: CapabilityId) => {
    const next = draft.customerNeeds.includes(id)
      ? draft.customerNeeds.filter((current) => current !== id)
      : [...draft.customerNeeds, id]
    setDraft((current) => setCustomerNeeds(current, next))
    setStepError(null)
  }

  const toggleOperationalCapability = (id: CapabilityId) => {
    const next = draft.operationalNeeds.includes(id)
      ? draft.operationalNeeds.filter((current) => current !== id)
      : [...draft.operationalNeeds, id]
    setDraft((current) => setOperationalNeeds(current, next))
    setStepError(null)
  }

  const chooseOperationalMode = (mode: OperationalSelectionMode) => {
    setDraft((current) => setOperationalMode(current, mode))
    setStepError(null)
  }

  const setAsset = (asset: ReadinessAssetId, state: Exclude<ReadinessState, 'unknown'>) => {
    updateDraft({ assets: { ...draft.assets, [asset]: state } })
  }

  const currentStepLabel = CUSTOMIZE_STEP_LABELS[draft.currentStep - 1].label
  const selectedCustomerLabels = draft.customerNeeds.map((id) => CAPABILITY_TAXONOMY[id].label)
  const selectedOperationalLabels = draft.operationalNeeds.map((id) => CAPABILITY_TAXONOMY[id].label)
  const completedAssetCount = Object.values(draft.assets).filter((state) => state !== 'unknown').length
  const recommendation = draft.status === 'complete' ? recommendStoreSolution(draft, template) : null

  return (
    <StoreShell>
      <div className={styles.page} data-template={template.slug}>
        <header className={styles.header}>
          <div className={styles.container}>
            <div className={styles.headerTopline}>
              <Link className={styles.backLink} href={template.detailRoute}>
                <ArrowLeft size={16} aria-hidden="true" /> Kembali ke {template.name}
              </Link>
              <button className={styles.resetButton} type="button" onClick={handleReset}>
                <RotateCcw size={15} aria-hidden="true" /> Mulai dari awal
              </button>
            </div>
            <div className={styles.identity}>
              <div className={styles.identityMark} aria-hidden="true"><Store size={20} /></div>
              <div>
                <p className={styles.kicker}>Customize template</p>
                <p className={styles.identityName}>{template.name}</p>
              </div>
              <span className={styles.category}>{STORE_CATEGORY_LABELS[template.category]}</span>
            </div>
            <div className={styles.headingBlock}>
              <p className={styles.kicker}>Langkah {draft.currentStep} dari 4</p>
              <h1>Bangun arah website yang terasa pas untuk bisnismu.</h1>
              <p>Jawab singkat saja. Belum punya semua jawabannya juga tidak apa-apa.</p>
            </div>
            <div className={styles.progressBlock}>
              <div
                className={styles.progressTrack}
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={4}
                aria-valuenow={draft.currentStep}
                aria-valuetext={`${draft.currentStep} dari 4 — ${currentStepLabel}`}
              >
                <span className={styles.progressFill} style={{ width: `${draft.currentStep * 25}%` }} />
              </div>
              <ol className={styles.stepList} aria-label="Progress Customize">
                {CUSTOMIZE_STEP_LABELS.map(({ step, label }) => (
                  <li key={step} aria-current={draft.currentStep === step ? 'step' : undefined} className={draft.currentStep >= step ? styles.stepActive : ''}>
                    <span>{step}</span>
                    <strong>{label}</strong>
                  </li>
                ))}
              </ol>
            </div>
            {storageMessage ? <p className={styles.storageMessage} role="status"><Save size={15} aria-hidden="true" /> {storageMessage}</p> : null}
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.container}>
            {draft.status === 'complete' ? (
              <section className={styles.completePanel} aria-labelledby="complete-title">
                <div className={styles.completeIcon} aria-hidden="true"><Check size={28} /></div>
                <p className={styles.kicker}>Customize selesai</p>
                <h2 id="complete-title">Kebutuhanmu sudah tersimpan.</h2>
                <p>Berikut rekomendasi awal berdasarkan jawabanmu. Ini belum menjadi harga final, order, booking, atau proses pembuatan otomatis.</p>
                {recommendation ? (
                  <aside className={styles.recommendationPanel} data-recommendation-template={recommendation.templateSlug} data-recommendation-tier={recommendation.tier} aria-labelledby="recommendation-title">
                    <div className={styles.recommendationHeading}>
                      <div>
                        <p className={styles.kicker}>Rekomendasi awal</p>
                        <h3 id="recommendation-title">{recommendation.label}</h3>
                      </div>
                      <span className={styles.recommendationBadge}>{recommendation.tier === 'consultation' ? 'Perlu dibahas' : 'Cocok untuk mulai'}</span>
                    </div>
                    <p className={styles.recommendationSummary}>{recommendation.summary}</p>
                    <ul className={styles.recommendationReasons}>
                      {recommendation.reasons.map((reason) => <li key={reason}>{reason}</li>)}
                    </ul>
                  </aside>
                ) : null}
                <div className={styles.summaryGrid}>
                  <div><span>Bisnis</span><strong>{draft.businessType}</strong><small>{STORE_CATEGORY_LABELS[draft.businessCategory]}</small></div>
                  <div><span>Customer</span><strong>{selectedCountLabel(draft.customerNeeds.length, 'kebutuhan dipilih', 'kebutuhan dipilih')}</strong><small>{selectedCustomerLabels.slice(0, 2).join(', ') || 'Belum ditentukan'}</small></div>
                  <div><span>Operasional</span><strong>{draft.operationalMode === 'none' ? 'Tidak perlu dashboard khusus' : draft.operationalMode === 'unsure' ? 'Belum yakin' : selectedCountLabel(draft.operationalNeeds.length, 'kebutuhan dipilih', 'kebutuhan dipilih')}</strong><small>{selectedOperationalLabels.slice(0, 2).join(', ') || 'Belum ditentukan'}</small></div>
                  <div><span>Kesiapan</span><strong>{completedAssetCount} dari 5 area diisi</strong><small>{TIMELINE_OPTIONS.find((option) => option.id === draft.timeline)?.label}</small></div>
                </div>
                <div className={styles.completeActions}>
                  <button className={styles.secondaryButton} type="button" onClick={() => updateDraft({ status: 'draft' })}>Ubah jawaban</button>
                  <Link className={styles.primaryButton} href={template.detailRoute}><ArrowLeft size={17} aria-hidden="true" /> Kembali ke template</Link>
                </div>
              </section>
            ) : (
              <>
                {stepError ? (
                  <div className={styles.errorSummary} role="alert">
                    <CircleHelp size={18} aria-hidden="true" />
                    <p>
                      {stepError === 'business-type' && 'Ceritakan dulu jenis atau bentuk bisnismu agar arah Customize bisa lebih relevan.'}
                      {stepError === 'customer-needs' && 'Pilih minimal satu kebutuhan customer, atau pilih Belum yakin untuk lanjut.'}
                      {stepError === 'operational-needs' && 'Pilih minimal satu kebutuhan operasional, atau pilih Tidak perlu dashboard khusus / Belum yakin.'}
                    </p>
                  </div>
                ) : null}

                <section className={styles.formPanel} aria-labelledby="step-title">
                  {draft.currentStep === 1 ? (
                    <>
                      <div className={styles.sectionHeading}>
                        <p className={styles.kicker}>01 / Tentang bisnis</p>
                        <h2 id="step-title">Mulai dari konteks bisnismu.</h2>
                        <p>Kami perlu tahu bentuk bisnis dan titik mulainya. Tidak perlu menjawab hal teknis.</p>
                      </div>
                      <div className={styles.formGrid}>
                        <label className={styles.field} htmlFor="business-category">
                          <span>Jenis / kategori bisnis</span>
                          <select id="business-category" value={draft.businessCategory} onChange={(event) => updateDraft({ businessCategory: event.target.value as CustomizeDraft['businessCategory'] })}>
                            {BUSINESS_CATEGORY_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                          </select>
                          <small>Sudah dipilih dari template, tapi bisa kamu ubah.</small>
                        </label>
                        <label className={styles.field} htmlFor="business-type">
                          <span>Jenis atau bentuk bisnismu <em>Wajib</em></span>
                          <input id="business-type" type="text" value={draft.businessType} onChange={(event) => updateDraft({ businessType: event.target.value })} placeholder={config.businessTypePrompt} aria-invalid={stepError === 'business-type'} />
                          <small>Contoh: toko kue rumahan, klinik gigi, atau konsultan pajak.</small>
                        </label>
                        <label className={styles.field} htmlFor="business-area">
                          <span>Kota atau area layanan <small>(opsional)</small></span>
                          <input id="business-area" type="text" value={draft.businessArea} onChange={(event) => updateDraft({ businessArea: event.target.value })} placeholder="Contoh: Bandung dan sekitarnya" />
                        </label>
                      </div>
                      <fieldset className={styles.fieldset}>
                        <legend>Status website saat ini</legend>
                        <div className={styles.choiceGrid}>
                          {CURRENT_WEBSITE_STATUS_OPTIONS.map((option) => (
                            <ChoiceOption key={option.id} id={`website-status-${option.id}`} name="website-status" type="radio" checked={draft.currentWebsiteStatus === option.id} label={option.label} description={option.description} onChange={() => updateDraft({ currentWebsiteStatus: option.id as CurrentWebsiteStatus })} />
                          ))}
                        </div>
                      </fieldset>
                      <fieldset className={styles.fieldset}>
                        <legend>Channel yang sedang dipakai <small>(boleh pilih beberapa)</small></legend>
                        <div className={styles.choiceGridThree}>
                          {CONTACT_CHANNEL_OPTIONS.map((option) => {
                            const Icon = CONTACT_CHANNEL_ICONS[option.id]
                            return <label key={option.id} className={`${styles.compactChoice} ${draft.currentContactChannels.includes(option.id) ? styles.compactChoiceSelected : ''}`} htmlFor={`contact-${option.id}`}><input id={`contact-${option.id}`} type="checkbox" checked={draft.currentContactChannels.includes(option.id)} onChange={() => toggleContactChannel(option.id)} /><Icon size={17} aria-hidden="true" /><span>{option.label}</span></label>
                          })}
                        </div>
                      </fieldset>
                    </>
                  ) : null}

                  {draft.currentStep === 2 ? (
                    <>
                      <div className={styles.sectionHeading}>
                        <p className={styles.kicker}>02 / Kebutuhan customer</p>
                        <h2 id="step-title">Apa yang ingin customer lihat atau lakukan?</h2>
                        <p>{config.customerIntro}</p>
                      </div>
                      <fieldset className={styles.fieldset}>
                        <legend>Pilih semua yang terasa penting</legend>
                        <div className={styles.capabilityGrid}>
                          {config.customerCapabilities.map((id) => <CapabilityOption key={id} id={id} checked={draft.customerNeeds.includes(id)} onChange={() => toggleCustomerCapability(id)} />)}
                        </div>
                      </fieldset>
                      <div className={styles.unsurePanel}>
                        <ChoiceOption id="customer-needs-unsure" name="customer-needs-uncertain" type="checkbox" checked={draft.uncertainties.includes('customer-needs')} label="Belum yakin" description="Simpan konteksnya dulu, nanti dibantu menyusun prioritasnya." onChange={() => { setDraft((current) => setCustomerNeedsUncertain(current, !current.uncertainties.includes('customer-needs'))); setStepError(null) }} />
                      </div>
                    </>
                  ) : null}

                  {draft.currentStep === 3 ? (
                    <>
                      <div className={styles.sectionHeading}>
                        <p className={styles.kicker}>03 / Kebutuhan operasional</p>
                        <h2 id="step-title">Apa yang perlu dibantu di belakang layar?</h2>
                        <p>Ini membantu kami memahami alur kerja tim. Pilihan di sini belum berarti dashboard langsung dibuat.</p>
                      </div>
                      <fieldset className={styles.fieldset}>
                        <legend>Seberapa jauh kamu butuh area pengelolaan?</legend>
                        <div className={styles.choiceGrid}>
                          {OPERATIONAL_MODE_OPTIONS.map((option) => (
                            <ChoiceOption key={option.id} id={`operational-mode-${option.id}`} name="operational-mode" type="radio" checked={draft.operationalMode === option.id} label={option.label} description={option.description} onChange={() => chooseOperationalMode(option.id)} />
                          ))}
                        </div>
                      </fieldset>
                      <fieldset className={styles.fieldset} disabled={draft.operationalMode !== 'selected'}>
                        <legend>Pilih area yang ingin dikelola</legend>
                        <div className={styles.capabilityGrid}>
                          {config.operationalCapabilities.map((id) => <CapabilityOption key={id} id={id} checked={draft.operationalNeeds.includes(id)} disabled={draft.operationalMode !== 'selected'} onChange={() => toggleOperationalCapability(id)} />)}
                        </div>
                      </fieldset>
                      <p className={styles.boundaryNote}><LayoutDashboard size={17} aria-hidden="true" /> Kami hanya mencatat kebutuhan ini. Rekomendasi dan pembahasan scope datang di tahap berikutnya.</p>
                    </>
                  ) : null}

                  {draft.currentStep === 4 ? (
                    <>
                      <div className={styles.sectionHeading}>
                        <p className={styles.kicker}>04 / Kesiapan project</p>
                        <h2 id="step-title">Apa yang sudah siap untuk memulai?</h2>
                        <p>Jawaban boleh belum lengkap. Pilih “Perlu dibantu” kalau kamu ingin area ini ikut dibahas.</p>
                      </div>
                      <div className={styles.readinessList}>
                        {(Object.keys(ASSET_LABELS) as ReadinessAssetId[]).map((asset) => (
                          <fieldset className={styles.readinessField} key={asset}>
                            <legend>{asset === 'catalog' ? config.catalogAssetLabel : ASSET_LABELS[asset]}</legend>
                            <div className={styles.readinessChoices}>
                              {READINESS_STATE_OPTIONS.map((option) => <ChoiceOption key={option.id} id={`asset-${asset}-${option.id}`} name={`asset-${asset}`} type="radio" checked={draft.assets[asset] === option.id} label={option.label} onChange={() => setAsset(asset, option.id)} />)}
                            </div>
                          </fieldset>
                        ))}
                      </div>
                      <fieldset className={styles.fieldset}>
                        <legend>Kapan ingin mulai membahas project ini?</legend>
                        <div className={styles.choiceGridFour}>
                          {TIMELINE_OPTIONS.map((option) => <ChoiceOption key={option.id} id={`timeline-${option.id}`} name="timeline" type="radio" checked={draft.timeline === option.id} label={option.label} onChange={() => updateDraft({ timeline: option.id as TimelinePreference })} />)}
                        </div>
                      </fieldset>
                      <aside className={styles.reviewPanel} aria-label="Ringkasan jawaban">
                        <div className={styles.reviewHeading}><FileText size={18} aria-hidden="true" /><div><strong>Ringkasan jawabanmu</strong><span>Belum ada rekomendasi di tahap ini.</span></div></div>
                        <div className={styles.reviewRows}>
                          <div><span>Bisnis</span><strong>{draft.businessType || 'Belum diisi'} · {STORE_CATEGORY_LABELS[draft.businessCategory]}</strong></div>
                          <div><span>Customer</span><strong>{selectedCustomerLabels.join(', ') || (draft.uncertainties.includes('customer-needs') ? 'Belum yakin' : 'Belum dipilih')}</strong></div>
                          <div><span>Operasional</span><strong>{draft.operationalMode === 'none' ? 'Tidak perlu dashboard khusus' : draft.operationalMode === 'unsure' ? 'Belum yakin' : selectedOperationalLabels.join(', ') || 'Belum dipilih'}</strong></div>
                          <div><span>Kesiapan</span><strong>{completedAssetCount} dari 5 area diisi · {TIMELINE_OPTIONS.find((option) => option.id === draft.timeline)?.label}</strong></div>
                        </div>
                      </aside>
                    </>
                  ) : null}
                </section>

                <div className={styles.actionBar}>
                  <button className={styles.secondaryButton} type="button" onClick={handleBack}>
                    <ArrowLeft size={17} aria-hidden="true" /> {draft.currentStep === 1 ? 'Kembali' : 'Sebelumnya'}
                  </button>
                  <button className={styles.primaryButton} type="button" onClick={handleNext}>
                    {draft.currentStep === 4 ? 'Simpan kebutuhan' : 'Lanjut'} <ArrowRight size={17} aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </StoreShell>
  )
}
