import type { MetadataRoute } from 'next'
import { STORE_BASE_URL } from '@/lib/store/metadata'
import { STORE_TEMPLATE_REGISTRY } from '@/lib/store/templates'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${STORE_BASE_URL}/store`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...STORE_TEMPLATE_REGISTRY.map((template) => ({
      url: `${STORE_BASE_URL}${template.detailRoute}`,
      changeFrequency: 'weekly' as const,
      priority: template.featured ? 0.9 : 0.8,
    })),
  ]
}
