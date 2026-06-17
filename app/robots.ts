import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fraogo.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep internal/transactional pages out of search results
      disallow: ['/admin', '/vendor/dashboard', '/procurement/cart', '/procurement/success'],
    },
    sitemap: `${BASE}/sitemap.xml`,
  }
}
