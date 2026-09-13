import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CustomizeWizard from '@/app/store/components/CustomizeWizard'
import { createStoreMetadata } from '@/lib/store/metadata'
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
    ? createStoreMetadata({
        title: `Customize ${template.name} — Webzoka Store`,
        description: `Ceritakan kebutuhan bisnismu untuk ${template.name} dalam empat langkah singkat.`,
        pathname: template.customizeRoute,
        noIndex: true,
      })
    : {}
}

export default async function StoreCustomizeRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const template = getStoreTemplateBySlug(slug)
  if (!template) notFound()

  return <CustomizeWizard template={template} />
}
