import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fraogo.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/services',
    '/contact',
    '/track',
    '/blog',
    '/procurement/nigeria',
    '/procurement/international',
    '/procurement/cart',
    '/logistics/delivery',
    '/logistics/relocation',
    '/general-service/rental',
    '/general-service/supply',
    '/general-service/rental/hire-vendor',
    '/general-service/rental/register-vendor',
  ].map((path) => {
    let priority = 0.7
    if (path === '') priority = 1.0
    else if (path === '/about' || path === '/services' || path === '/contact') priority = 0.9
    else if (path.startsWith('/procurement') || path.startsWith('/logistics') || path.startsWith('/general-service')) priority = 0.8

    return {
      url: `${BASE}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority,
    }
  })

  // Published blog posts. Wrapped so a missing DB at build time never fails the build.
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    })
    blogRoutes = posts.map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  } catch {
    // DB unavailable — ship static routes only
  }

  return [...staticRoutes, ...blogRoutes]
}
