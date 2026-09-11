import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Eye,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import StoreShell from '@/app/store/components/StoreShell'
import { storeWhatsAppUrl } from '@/lib/store/whatsapp'
import { warmCommerceMetadata } from './warm-commerce-data'
import styles from './WarmCommerceDetail.module.css'

export const metadata: Metadata = {
  title: 'Warm Commerce — Template Website Kuliner | Webzoka Store',
  description:
    'Template website kuliner yang hangat, product-led, dan siap mengarahkan pelanggan ke katalog, WhatsApp, dan lokasi bisnis.',
  robots: { index: false, follow: false },
}
const consultationUrl = storeWhatsAppUrl(
  'Halo Webzoka, saya ingin menggunakan template Warm Commerce dan membahas penyesuaiannya untuk bisnis saya.',
)

function ConsultationLink({ className }: { className: string }) {
  if (!consultationUrl) {
    return (
      <span className={`${className} ${styles.disabledAction}`} role="status">
        WhatsApp belum dikonfigurasi
      </span>
    )
  }

  return (
    <a href={consultationUrl} target="_blank" rel="noopener noreferrer" className={className}>
      Gunakan Template Ini <MessageCircle size={17} aria-hidden="true" />
    </a>
  )
}
const customerCapabilities = [
  {
    icon: ShoppingBag,
    title: 'Menemukan menu',
    copy: 'Kategori, foto, deskripsi, dan harga tersusun agar pelanggan cepat memilih.',
  },
  {
    icon: MessageCircle,
    title: 'Memesan lewat WhatsApp',
    copy: 'Jalur pesan tetap dekat dengan cara bisnis owner-led melayani pelanggan hari ini.',
  },
  {
    icon: MapPin,
    title: 'Menemukan lokasi',
    copy: 'Alamat, jam buka, area layanan, dan tautan Maps berada di satu tempat.',
  },
]

const faqItems = [
  {
    question: 'Apakah Warm Commerce sudah memiliki checkout?',
    answer:
      'Belum. Prototype ini dirancang untuk katalog dan pemesanan berbantuan WhatsApp, bukan keranjang dan pembayaran mandiri.',
  },
  {
    question: 'Apa yang bisa diganti?',
    answer:
      'Nama brand, warna utama, foto, kategori, produk, harga, nomor WhatsApp, alamat, jam buka, tautan sosial, CTA, dan bagian yang ditampilkan dirancang agar bisa disesuaikan.',
  },
  {
    question: 'Bisa ditambah sistem order atau stok?',
    answer:
      'Bisa menjadi tahap lanjutan melalui Website + Portal. Scope order, stok, pelanggan, membership, dan payment perlu dibahas sesuai alur bisnisnya.',
  },
]

export default function WarmCommerceDetailPage() {
  return (
    <StoreShell>
      <div className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/store">Store</Link><span aria-hidden="true">/</span><span aria-current="page">Warm Commerce</span>
            </nav>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <div className={styles.meta}>
                  <span className={styles.status}><i aria-hidden="true" />{warmCommerceMetadata.status}</span>
                  <span>Template {warmCommerceMetadata.category}</span>
                </div>
                <h1>Warm Commerce</h1>
                <p className={styles.positioning}>Website kuliner yang membuat produk terasa dekat dan jalur pesan terasa jelas.</p>
                <p className={styles.lede}>{warmCommerceMetadata.summary}</p>
                <ul aria-label="Kemampuan utama">
                  {warmCommerceMetadata.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
                </ul>
                <div className={styles.heroActions}>
                  <Link href="/store/template/warm-commerce/preview" className={styles.primaryAction}>
                    Lihat Preview <Eye size={16} aria-hidden="true" />
                  </Link>
                  <ConsultationLink className={styles.secondaryAction} />
                </div>
              </div>

              <Link href="/store/template/warm-commerce/preview" className={styles.previewCard} aria-label="Buka preview penuh Warm Commerce">
                <div className={styles.browserBar} aria-hidden="true"><span><i /><i /><i /></span><small>dapur-rona.demo</small></div>
                <Image
                  src="/images/store/warm-commerce/dapur-rona-spread.webp"
                  alt="Preview Dapur Rona dengan pempek, pastel, dan es teh"
                  fill
                  priority
                  sizes="(max-width: 767px) 100vw, 54vw"
                />
                <div className={styles.previewOverlay}>
                  <span>Dapur Rona · Demo fiktif</span>
                  <strong>Rasa rumahan, dibuat untuk dinikmati.</strong>
                  <span className={styles.previewLink}>Buka preview penuh <ArrowRight size={15} aria-hidden="true" /></span>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <section className={styles.audience} aria-labelledby="audience-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Cocok untuk siapa</p>
              <h2 id="audience-title">Untuk bisnis kuliner yang tumbuh dari kedekatan.</h2>
              <p>Terutama bisnis owner-led yang menjual lewat Instagram dan WhatsApp, lalu membutuhkan katalog yang lebih rapi.</p>
            </div>
            <ul className={styles.businessTypes}>
              {warmCommerceMetadata.businessTypes.map((businessType, index) => (
                <li key={businessType}><span>{String(index + 1).padStart(2, '0')}</span>{businessType}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.capabilities} aria-labelledby="capabilities-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Customer bisa apa</p>
              <h2 id="capabilities-title">Satu alur pendek menuju pesanan.</h2>
            </div>
            <div className={styles.capabilityGrid}>
              {customerCapabilities.map(({ icon: Icon, title, copy }, index) => (
                <article key={title}>
                  <div><Icon size={22} aria-hidden="true" /><span>{String(index + 1).padStart(2, '0')}</span></div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.scope} aria-labelledby="scope-title">
          <div className={styles.container}>
            <div className={styles.scopeGrid}>
              <div>
                <p className={styles.eyebrow}>Fondasi template</p>
                <h2 id="scope-title">Yang sudah termasuk.</h2>
                <ul className={styles.checkList}>
                  {warmCommerceMetadata.included.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}
                </ul>
              </div>
              <div className={styles.optionalCard}>
                <p className={styles.eyebrow}>Bisa dikembangkan dengan</p>
                <h3>Tambah sistem saat operasionalnya memang membutuhkan.</h3>
                <ul>
                  {warmCommerceMetadata.optional.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <p>Fitur opsional belum dibangun di prototype ini dan membutuhkan scope terpisah.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.growth} aria-labelledby="growth-title">
          <div className={styles.container}>
            <div className={styles.growthIntro}>
              <p className={styles.eyebrow}>Jalur bertumbuh</p>
              <h2 id="growth-title">Mulai dari Website. Tambah Portal saat pesanan makin ramai.</h2>
            </div>
            <div className={styles.growthFlow}>
              <div><span>01</span><small>Rekomendasi awal</small><strong>{warmCommerceMetadata.baseRecommendation}</strong><p>Katalog, cerita bisnis, lokasi, dan WhatsApp.</p></div>
              <ArrowRight size={28} aria-hidden="true" />
              <div><span>02</span><small>Upgrade bila perlu</small><strong>{warmCommerceMetadata.upgradeRecommendation}</strong><p>Order, stok, pelanggan, dan kerja tim.</p></div>
            </div>
          </div>
        </section>

        <section className={styles.faq} aria-labelledby="faq-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Pertanyaan singkat</p>
              <h2 id="faq-title">Sebelum memilih Warm Commerce.</h2>
            </div>
            <div className={styles.faqList}>
              {faqItems.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}<ChevronDown size={18} aria-hidden="true" /></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="gunakan-template" className={styles.finalCta} aria-labelledby="use-title">
          <div className={styles.finalInner}>
            <div>
              <p className={styles.eyebrow}><Sparkles size={15} aria-hidden="true" />Langkah berikutnya</p>
              <h2 id="use-title">Gunakan Warm Commerce sebagai titik mulai.</h2>
              <p>Customize mandiri belum tersedia. Kirim kebutuhanmu lewat WhatsApp; tim Webzoka akan membahas isi, warna, produk, dan scope yang perlu disesuaikan.</p>
              {!consultationUrl && (
                <p className={styles.whatsappNotice} role="status">
                  WhatsApp belum dikonfigurasi di environment preview ini. Tidak ada nomor tujuan yang di-hardcode.
                </p>
              )}
            </div>
            <ConsultationLink className={styles.finalAction} />
          </div>
        </section>
      </div>
    </StoreShell>
  )
}
