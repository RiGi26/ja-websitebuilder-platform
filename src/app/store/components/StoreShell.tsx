'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Menu, MessageCircle, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { storeWhatsAppUrl } from '@/lib/store/whatsapp'
import styles from './StoreShell.module.css'

const storeNav = [
  { label: 'Store', href: '/store' },
  { label: 'Koleksi template', href: '/store#templates' },
]

const consultationUrl = storeWhatsAppUrl(
  'Halo Webzoka, saya ingin konsultasi memilih template dan fondasi website untuk bisnis saya.',
)

function StoreNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className={styles.navigation} aria-label="Navigasi Webzoka Store">
      <p className={styles.navLabel}>Belanja berdasarkan kebutuhan</p>
      {storeNav.map((item) => {
        const active = item.href === '/store'
          ? pathname === '/store'
          : item.href.startsWith('/store#') && pathname.startsWith('/store/template')

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={active ? styles.activeLink : styles.navLink}
            onClick={onNavigate}
          >
            <span>{item.label}</span>
            {active && <span className={styles.activeMark} aria-hidden="true" />}
          </Link>
        )
      })}
    </nav>
  )
}
function BrandBlock() {
  return (
    <div className={styles.brandBlock}>
      <Link href="/store" className={styles.brand} aria-label="Webzoka Store, kembali ke halaman Store">
        <span className={styles.brandMark} aria-hidden="true">W</span>
        <span className={styles.brandName}>Webzoka</span>
      </Link>
      <span>Store</span>
      <p>Pilih bentuk bisnisnya dulu. Kami bantu menerjemahkan kebutuhanmu setelahnya.</p>
    </div>
  )
}

function StoreUtilities({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className={styles.utilities}>
      <Link href="/store" onClick={onNavigate}>
        <ArrowLeft size={15} aria-hidden="true" /> Kembali ke Store
      </Link>
      {consultationUrl ? (
        <a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
          <MessageCircle size={15} aria-hidden="true" /> Konsultasi WhatsApp
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      ) : (
        <span className={styles.unavailableUtility} role="status">
          <MessageCircle size={15} aria-hidden="true" /> WhatsApp belum dikonfigurasi
        </span>
      )}
    </div>
  )
}

export default function StoreShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        window.requestAnimationFrame(() => menuButtonRef.current?.focus())
        return
      }

      if (event.key !== 'Tab' || !drawerRef.current) return
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const close = () => setOpen(false)
  const closeAndRestoreFocus = () => {
    setOpen(false)
    window.requestAnimationFrame(() => menuButtonRef.current?.focus())
  }

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#store-main">Lewati ke konten Store</a>

      <aside className={styles.sidebar} aria-label="Navigasi Webzoka Store">
        <BrandBlock />
        <StoreNavigation />
        <StoreUtilities />
      </aside>

      <header className={styles.mobileHeader}>
        <div className={styles.mobileHeaderInner}>
          <Link href="/store" className={styles.mobileBrand} aria-label="Webzoka Store, kembali ke halaman Store">
            <span className={styles.brandMark} aria-hidden="true">W</span>
            <span className={styles.brandName}>Webzoka</span>
            <span>Store</span>
          </Link>
          {!open && (
            <button
              ref={menuButtonRef}
              type="button"
              className={styles.menuButton}
              aria-label="Buka menu Store"
              aria-expanded="false"
              aria-controls="store-mobile-drawer"
              onClick={() => setOpen(true)}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          )}
        </div>
      </header>

      {open && (
        <div className={styles.drawerLayer}>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Tutup menu Store"
            onClick={closeAndRestoreFocus}
          />
          <aside
            ref={drawerRef}
            id="store-mobile-drawer"
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Menu Webzoka Store"
          >
            <div className={styles.drawerHead}>
              <BrandBlock />
              <button
                ref={closeButtonRef}
                type="button"
                className={styles.menuButton}
                aria-label="Tutup menu Store"
                onClick={closeAndRestoreFocus}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <StoreNavigation onNavigate={close} />
            <StoreUtilities onNavigate={close} />
          </aside>
        </div>
      )}

      <main id="store-main" className={styles.main} tabIndex={-1}>{children}</main>
    </div>
  )
}
