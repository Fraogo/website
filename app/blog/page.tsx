import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { ArrowRight, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, guides, and industry knowledge from the Fraogo team — covering procurement, logistics, and Nigerian business.',
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, publishedAt: true },
  })

  return (
    <div className="min-h-screen bg-white">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="section-container pt-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-300">Knowledge</p>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">Our Blog</h1>
          <p className="text-white/65 max-w-2xl text-base leading-relaxed">
            Guides, tips, and industry insights for Nigerian businesses navigating procurement, logistics, and service operations.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="section-container">
          {posts.length === 0 ? (
            /* Empty state */
            <div className="max-w-md mx-auto text-center py-20">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: '#EEF2FF' }}>
                <BookOpen className="w-8 h-8" style={{ color: '#1B4AD4' }} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-3">Content Coming Soon</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                We&apos;re working on articles to help Nigerian businesses make better decisions around
                procurement, logistics, and vendor management. Check back soon.
              </p>
              <Link href="/contact" className="btn-primary px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2">
                Contact Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100 card-hover flex flex-col"
                >
                  {/* Cover image */}
                  <div className="aspect-[16/9] bg-gradient-to-br from-[#EEF2FF] to-[#dbe4ff] relative overflow-hidden">
                    {post.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    {!post.coverImage && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-blue-200" />
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs text-gray-400 mb-2 font-medium">
                      {post.publishedAt ? formatDate(post.publishedAt) : ''}
                    </p>
                    <h2 className="font-black text-gray-900 text-base leading-snug mb-2 group-hover:text-[#1B4AD4] transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
                    )}
                    <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-[#1B4AD4]">
                      Read more <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
