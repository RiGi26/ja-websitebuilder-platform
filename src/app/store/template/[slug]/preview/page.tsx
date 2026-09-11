import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import StoreTemplatePreviewPage from '@/app/store/components/StoreTemplatePreviewPage'
import { getStoreTemplateBySlug } from '@/lib/store/templates'
import { TEMPLATE_SLUGS } from '@/lib/store/types'

export const dynamicParams = false

export function generateStaticParams() {
  return TEMPLATE_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const template = getStoreTemplateBySlug(slug)
  return template
    ? { title: `${template.name} Preview — Webzoka Store`, description: `Preview ${template.name} dengan perilaku demo yang disetujui.`, robots: { index: false, follow: false } }
    : {}
}

export default async function StoreTemplatePreviewRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const template = getStoreTemplateBySlug(slug)
  if (!template) notFound()

  return (
    <StoreTemplatePreviewPage template={template} />
  )
}
