import type { Metadata } from 'next'

export const STORE_BASE_URL = 'https://store.webzoka.com'
export const STORE_METADATA_BASE = new URL(STORE_BASE_URL)
// Canonical public entry used by Store return navigation.
export const PUBLIC_WEBZOKA_URL = 'https://webzoka.com'

type StoreMetadataInput = {
  title: string
  description: string
  pathname: string
  noIndex?: boolean
}

export function createStoreMetadata({ title, description, pathname, noIndex = false }: StoreMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: {
      title,
      description,
      url: new URL(pathname, STORE_METADATA_BASE).toString(),
      siteName: 'Webzoka Store',
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}
