'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react'
import { storeWhatsAppUrl } from '@/lib/store/whatsapp'
import {
  dapurRona,
  warmCommerceCategories,
  warmCommerceProducts,
  type WarmCommerceCategory,
  type WarmCommerceProduct,
} from './warm-commerce-data'
import styles from './WarmCommerceSite.module.css'

const orderUrl = storeWhatsAppUrl(
  'Halo Webzoka, saya sedang melihat demo Dapur Rona dan tertarik memakai template Warm Commerce.',
)

const inquiryLinkProps = orderUrl
  ? { href: orderUrl, target: '_blank', rel: 'noopener noreferrer' }
  : { href: '#warm-commerce-whatsapp-unavailable' }

const locationUrl =
  'https://www.google.com/maps/search/?api=1&query=Ciputat%2C%20Tangerang%20Selatan'

const priceFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const navItems = [
  { label: 'Menu', href: '#menu' },
  { label: 'Tentang', href: '#tentang' },
  { label: 'Cara Pesan', href: '#cara-pesan' },
  { label: 'Lokasi', href: '#lokasi' },
]

function ProductCard({ product }: { product: WarmCommerceProduct }) {
  return (
    <article className={styles.productCard}>
      <div className={styles.productImage}>
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1099px) 50vw, 33vw"
        />
      </div>
      <div className={styles.productCopy}>
        <span>{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div>
          <strong>{priceFormatter.format(product.price)}</strong>
          <a {...inquiryLinkProps} aria-label={`Tanyakan ${product.name} lewat WhatsApp`}>
            Tanya menu <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  )
}

export default function WarmCommerceSite() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<WarmCommerceCategory>('Semua')
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        window.requestAnimationFrame(() => menuButtonRef.current?.focus())
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const filteredProducts = activeCategory === 'Semua'
    ? warmCommerceProducts
    : warmCommerceProducts.filter((product) => product.category === activeCategory)

  const closeMenu = () => setMenuOpen(false)
  const featuredProduct = warmCommerceProducts.find((product) => product.featured)!
  const supportingProducts = warmCommerceProducts.filter((product) => !product.featured).slice(0, 2)

  return (
    <div className={styles.site}>
      <a className={styles.skipLink} href="#dapur-rona-main">Lewati ke konten utama</a>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="#top" className={styles.brand} aria-label="Dapur Rona, kembali ke atas">
            <span aria-hidden="true">R</span>
            <strong>Dapur Rona</strong>
          </a>

          <nav className={styles.desktopNav} aria-label="Navigasi Dapur Rona">
            {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>

          <a {...inquiryLinkProps} className={styles.headerAction}>
            Pesan Sekarang <ArrowRight size={15} aria-hidden="true" />
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            className={styles.mobileMenuButton}
            aria-label={menuOpen ? 'Tutup menu Dapur Rona' : 'Buka menu Dapur Rona'}
            aria-expanded={menuOpen}
            aria-controls="dapur-rona-mobile-menu"
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>

        {menuOpen && (
          <nav id="dapur-rona-mobile-menu" className={styles.mobileNav} aria-label="Navigasi mobile Dapur Rona">
            {navItems.map((item) => <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>)}
            <a {...inquiryLinkProps} onClick={closeMenu}>
              Pesan Sekarang <MessageCircle size={16} aria-hidden="true" />
            </a>
          </nav>
        )}
      </header>

      <main id="dapur-rona-main" tabIndex={-1}>
        <section id="top" className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}><span aria-hidden="true" />{dapurRona.eyebrow}</p>
              <h1>{dapurRona.headline}</h1>
              <p className={styles.lede}>{dapurRona.heroCopy}</p>
              <div className={styles.heroActions}>
                <a href="#menu" className={styles.primaryAction}>Lihat Menu <ArrowRight size={16} aria-hidden="true" /></a>
                <a {...inquiryLinkProps} className={styles.textAction}>
                  Pesan via WhatsApp <MessageCircle size={16} aria-hidden="true" />
                </a>
              </div>
              <div className={styles.heroNotes} aria-label="Informasi layanan Dapur Rona">
                <span><Clock3 size={15} aria-hidden="true" /> Dibuat setelah pesanan dikonfirmasi</span>
                <span><ShoppingBag size={15} aria-hidden="true" /> Ambil sendiri atau kirim lokal</span>
              </div>
              {!orderUrl && (
                <p id="warm-commerce-whatsapp-unavailable" className={styles.whatsappNotice} role="status">
                  WhatsApp belum dikonfigurasi untuk preview ini. CTA inquiry akan aktif setelah NEXT_PUBLIC_WEBZOKA_WHATSAPP_NUMBER tersedia.
                </p>
              )}
            </div>

            <div className={styles.heroVisual}>
              <Image
                src={dapurRona.heroImage}
                alt="Pempek, pastel, dan es teh jeruk tersaji di meja Dapur Rona"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 58vw"
              />
              <div className={styles.heroCaption}>
                <span>Menu hari ini</span>
                <strong>Hangat, gurih, siap dinikmati.</strong>
              </div>
              <span className={styles.freshMark} aria-hidden="true">fresh<br />daily</span>
            </div>
          </div>
        </section>

        <section className={styles.discovery} aria-labelledby="best-seller-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}><span aria-hidden="true" />Pilihan Dapur Rona</p>
                <h2 id="best-seller-title">Mulai dari yang paling sering dicari.</h2>
              </div>
              <p>Pilih menu satuan untuk hari ini, atau gabungkan jadi paket untuk dinikmati bersama.</p>
            </div>

            <div className={styles.discoveryGrid}>
              <article className={styles.featuredProduct}>
                <div className={styles.featuredImage}>
                  <Image
                    src={featuredProduct.image}
                    alt={featuredProduct.imageAlt}
                    fill
                    sizes="(max-width: 767px) 100vw, 62vw"
                  />
                  <span>Best seller</span>
                </div>
                <div className={styles.featuredCopy}>
                  <span>{featuredProduct.category}</span>
                  <h3>{featuredProduct.name}</h3>
                  <p>{featuredProduct.description}</p>
                  <div>
                    <strong>{priceFormatter.format(featuredProduct.price)}</strong>
                    <a {...inquiryLinkProps}>
                      Tanya via WhatsApp <ArrowRight size={15} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>

              <div className={styles.supportingProducts}>
                {supportingProducts.map((product) => (
                  <article key={product.id} className={styles.supportingProduct}>
                    <div className={styles.supportingImage}>
                      <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width: 767px) 100vw, 32vw" />
                    </div>
                    <div>
                      <span>{product.category}</span>
                      <h3>{product.name}</h3>
                      <strong>{priceFormatter.format(product.price)}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="menu" className={styles.catalog} aria-labelledby="catalog-title">
          <div className={styles.container}>
            <div className={styles.catalogHead}>
              <div>
                <p className={styles.eyebrow}><span aria-hidden="true" />Menu & katalog</p>
                <h2 id="catalog-title">Mau makan apa hari ini?</h2>
              </div>
              <div className={styles.categories} aria-label="Filter kategori menu">
                {warmCommerceCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={activeCategory === category}
                    className={activeCategory === category ? styles.activeCategory : undefined}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.productGrid} aria-live="polite">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>

        <section className={styles.promo} aria-labelledby="promo-title">
          <div className={styles.promoInner}>
            <div className={styles.promoVisual}>
              <Image
                src={dapurRona.heroImage}
                alt="Pilihan hidangan untuk Paket Rona Sore"
                fill
                sizes="(max-width: 767px) 100vw, 52vw"
              />
            </div>
            <div className={styles.promoCopy}>
              <p className={styles.eyebrow}><span aria-hidden="true" />Paket pilihan</p>
              <h2 id="promo-title">Sore terasa lebih ramai kalau dinikmati bersama.</h2>
              <p>Isi meja dengan pempek, pastel renyah, dan teh jeruk. Cocok untuk rapat kecil, arisan, atau jeda sore di rumah.</p>
              <div>
                <span>Mulai</span>
                <strong>{priceFormatter.format(85000)}</strong>
              </div>
              <a {...inquiryLinkProps} className={styles.promoAction}>
                Tanya Paket Rona Sore <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section id="tentang" className={styles.story} aria-labelledby="story-title">
          <div className={styles.storyInner}>
            <div>
              <p className={styles.eyebrow}><span aria-hidden="true" />Tentang Dapur Rona</p>
              <h2 id="story-title">Masak secukupnya. Sajikan sehangatnya.</h2>
            </div>
            <div className={styles.storyCopy}>
              <p>
                Dapur Rona adalah contoh usaha rumahan yang menyiapkan makanan dan camilan dalam
                jumlah terbatas setiap hari. Menu dibuat supaya mudah dipilih, mudah ditanyakan,
                dan tetap terasa dekat seperti masakan rumah.
              </p>
              <blockquote>“Yang penting kamu tahu apa yang tersedia, berapa harganya, dan bagaimana cara memesannya.”</blockquote>
              <p className={styles.demoDisclosure}>Dapur Rona adalah identitas bisnis fiktif untuk demonstrasi template.</p>
            </div>
          </div>
        </section>

        <section id="cara-pesan" className={styles.process} aria-labelledby="process-title">
          <div className={styles.container}>
            <div className={styles.processIntro}>
              <p className={styles.eyebrow}><span aria-hidden="true" />Cara pesan</p>
              <h2 id="process-title">Dari pilih menu sampai siap dinikmati.</h2>
              <p>Kirim pilihanmu lewat WhatsApp. Kami lanjutkan dengan konfirmasi yang jelas.</p>
            </div>
            <ol className={styles.processList}>
              <li><span>01</span><div><h3>Pilih menu</h3><p>Lihat kategori, isi, dan harga yang tersedia.</p></div></li>
              <li><span>02</span><div><h3>Kirim pesanan</h3><p>Tanyakan stok atau kirim daftar pilihan lewat WhatsApp.</p></div></li>
              <li><span>03</span><div><h3>Konfirmasi</h3><p>Cocokkan jumlah, waktu ambil atau kirim, dan total pesanan.</p></div></li>
              <li><span>04</span><div><h3>Pesanan diproses</h3><p>Dapur mulai menyiapkan pesanan setelah konfirmasi.</p></div></li>
            </ol>
          </div>
        </section>

        <section id="lokasi" className={styles.location} aria-labelledby="location-title">
          <div className={styles.locationInner}>
            <div className={styles.locationCopy}>
              <p className={styles.eyebrow}><span aria-hidden="true" />Lokasi & jam buka</p>
              <h2 id="location-title">Ambil di dapur atau tanyakan pengiriman lokal.</h2>
              <div className={styles.locationFacts}>
                <div><MapPin size={20} aria-hidden="true" /><div><strong>{dapurRona.address}</strong><span>Alamat hanya contoh untuk kebutuhan prototype.</span></div></div>
                <div><Clock3 size={20} aria-hidden="true" /><div>{dapurRona.hours.map((hour) => <span key={hour}>{hour}</span>)}</div></div>
                <div><Instagram size={20} aria-hidden="true" /><div><strong>{dapurRona.socialLabel}</strong><span>Akun contoh, tidak terhubung ke profil nyata.</span></div></div>
              </div>
              <a href={locationUrl} target="_blank" rel="noopener noreferrer" className={styles.locationAction}>
                Buka area contoh di Maps <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
            <div className={styles.mapPlaceholder} role="img" aria-label="Ilustrasi lokasi contoh Dapur Rona di Ciputat, Tangerang Selatan">
              <span className={styles.mapRoadOne} aria-hidden="true" />
              <span className={styles.mapRoadTwo} aria-hidden="true" />
              <span className={styles.mapPin}><MapPin size={25} aria-hidden="true" /></span>
              <div><small>Lokasi contoh</small><strong>Ciputat</strong><span>Tangerang Selatan</span></div>
            </div>
          </div>
        </section>

        <section className={styles.finalCta} aria-labelledby="final-cta-title">
          <div className={styles.finalInner}>
            <div>
              <p className={styles.eyebrow}><span aria-hidden="true" />Pesan hari ini</p>
              <h2 id="final-cta-title">Sudah tahu mau pesan apa?</h2>
            </div>
            <div>
              <p>Kirim menu pilihanmu. Untuk prototype ini, tombol membuka konsultasi Warm Commerce dengan Webzoka.</p>
              <a {...inquiryLinkProps} className={styles.finalAction}>
                Pesan via WhatsApp <MessageCircle size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>
          <a href="#top" className={styles.brand} aria-label="Dapur Rona, kembali ke atas">
            <span aria-hidden="true">R</span><strong>Dapur Rona</strong>
          </a>
          <p>{dapurRona.tagline}</p>
        </div>
        <p>Demo fiktif · Warm Commerce by Webzoka</p>
      </footer>
    </div>
  )
}
