import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatDate, readingTime } from '@/lib/utils'
import { ArrowRight, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, guides, and industry knowledge from the Fraogo team — covering procurement, logistics, and Nigerian business.',
}

export const dynamic = 'force-dynamic'

function initials(name?: string | null): string {
  if (!name) return 'F'
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || 'F'
}

function Avatar({ name }: { name?: string | null }) {
  return (
    <span className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
      style={{ background: 'linear-gradient(135deg,#0E2A82,#1B4AD4)' }}>
      {initials(name)}
    </span>
  )
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, publishedAt: true, author: true, content: true },
  })

  const [featured, ...rest] = posts

  return (
    <div className="min-h-screen bg-white">
      <div className="page-header">
        <div className="section-container pt-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-300">Knowledge</p>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">The Fraogo Blog</h1>
          <p className="text-white/65 max-w-2xl text-base leading-relaxed">
            Guides, tips, and industry insights for Nigerian businesses navigating procurement, logistics, and service operations.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="section-container">
          {posts.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-20">
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
            <>
              {/* ── Featured lead ── */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="group grid lg:grid-cols-2 gap-8 items-center mb-16">
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden relative shadow-soft" style={{ background: 'linear-gradient(135deg,#EEF2FF,#dbe4ff)' }}>
                    {featured.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <div>
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#1B4AD4] mb-3">Latest</span>
                    <h2 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight mb-3 group-hover:text-[#1B4AD4] transition-colors">
                      {featured.title}
                    </h2>
                    {featured.excerpt && <p className="text-gray-500 leading-relaxed mb-5 line-clamp-3">{featured.excerpt}</p>}
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <Avatar name={featured.author} />
                      <span className="font-semibold text-gray-600">{featured.author ?? 'Fraogo'}</span>
                      <span>·</span>
                      <span>{featured.publishedAt ? formatDate(featured.publishedAt) : ''}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {readingTime(featured.content)} min</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* ── Grid ── */}
              {rest.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100 card-hover flex flex-col">
                      <div className="aspect-[16/9] relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#EEF2FF,#dbe4ff)' }}>
                        {post.coverImage && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h2 className="font-black text-gray-900 text-base leading-snug mb-2 group-hover:text-[#1B4AD4] transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-2 mb-4">{post.excerpt}</p>}
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
                          <Avatar name={post.author} />
                          <span className="font-semibold text-gray-600 truncate">{post.author ?? 'Fraogo'}</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1 flex-shrink-0"><Clock className="w-3 h-3" /> {readingTime(post.content)}m</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
