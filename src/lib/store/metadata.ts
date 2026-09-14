import type { Metadata } from 'next'

export const STORE_BASE_URL = 'https://store.webzoka.com'
export const STORE_METADATA_BASE = new URL(STORE_BASE_URL)
// Public Customer Hub route: the apex Webzoka URL redirects here, so Store
// return navigation lands on the stable user-facing Public entry experience.
export const PUBLIC_WEBZOKA_URL = 'https://www.webzoka.com/hub/store'

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
