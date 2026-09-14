import type { Metadata } from 'next'
import { Suspense } from 'react'
import StoreShell from './components/StoreShell'
import StoreIndex from './components/StoreIndex'
import { createStoreMetadata } from '@/lib/store/metadata'

export const metadata: Metadata = createStoreMetadata({
  title: 'Contoh Website — Webzoka Store',
  description: 'Bandingkan enam contoh website Webzoka berdasarkan kategori bisnis dan kebutuhanmu.',
  pathname: '/store',
})

function StoreIndexFallback() {
  return (
    <div style={{ minHeight: '100dvh', padding: '48px 32px' }} aria-busy="true">
      <p>Webzoka Store</p>
      <h1>Pilih contoh website yang paling cocok untuk usahamu.</h1>
      <p>Memuat koleksi contoh website…</p>
    </div>
  )
}

export default function StorePage() {
  return (
    <StoreShell>
      <Suspense fallback={<StoreIndexFallback />}>
        <StoreIndex />
      </Suspense>
    </StoreShell>
  )
}
