import type { Metadata } from 'next'
import { Suspense } from 'react'
import StoreShell from './components/StoreShell'
import StoreIndex from './components/StoreIndex'
import { createStoreMetadata } from '@/lib/store/metadata'

export const metadata: Metadata = createStoreMetadata({
  title: 'Template Store — Webzoka',
  description: 'Bandingkan enam arah template website Webzoka berdasarkan kategori bisnis dan kebutuhanmu.',
  pathname: '/store',
})

function StoreIndexFallback() {
  return (
    <div style={{ minHeight: '100dvh', padding: '48px 32px' }} aria-busy="true">
      <p>Webzoka Store V2</p>
      <h1>Pilih fondasi website yang sesuai cara bisnismu bekerja.</h1>
      <p>Memuat koleksi template…</p>
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
