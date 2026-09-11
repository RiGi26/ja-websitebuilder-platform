import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import StoreTemplateDetailPage from '@/app/store/components/StoreTemplateDetailPage'
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
    ? { title: `${template.name} — Webzoka Store`, description: template.shortDescription }
    : {}
}

export default async function StoreTemplateDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const template = getStoreTemplateBySlug(slug)
  if (!template) notFound()

  return <StoreTemplateDetailPage template={template} />
}
