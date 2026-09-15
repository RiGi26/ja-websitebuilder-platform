import type { MetadataRoute } from 'next'
import { STORE_BASE_URL } from '@/lib/store/metadata'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/store'],
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${STORE_BASE_URL}/sitemap.xml`,
  }
}
