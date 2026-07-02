import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { sanitizeHtml } from '@/lib/sanitize'
import { formatDate, readingTime } from '@/lib/utils'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import type { Metadata } from 'next'
import ReadingProgress from '@/components/blog/ReadingProgress'
import ShareButtons from '@/components/blog/ShareButtons'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } })
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { title: post.title, description: post.excerpt ?? undefined, images: post.coverImage ? [post.coverImage] : [] },
  }
}

function initials(name?: string | null): string {
  if (!name) return 'F'
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || 'F'
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } })
  if (!post) notFound()

  const related = await prisma.blogPost.findMany({
    where: { published: true, slug: { not: slug } },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, publishedAt: true },
  })

  const mins = readingTime(post.content)

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgress />

      {/* ── Cover ── */}
      {post.coverImage && (
        <div className="w-full h-72 sm:h-[26rem] overflow-hidden relative" style={{ background: '#EEF2FF' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* ── Article ── */}
      <article className="section-container py-12 lg:py-16 max-w-[720px]">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4AD4] mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl lg:text-[2.6rem] font-black text-gray-900 leading-[1.15] mb-6">{post.title}</h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#0E2A82,#1B4AD4)' }}>
                {initials(post.author)}
              </span>
              <div className="text-sm">
                <p className="font-bold text-gray-800 leading-tight">{post.author ?? 'Fraogo'}</p>
                <p className="text-gray-400 flex items-center gap-3 mt-0.5">
                  {post.publishedAt && (
                    <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(post.publishedAt)}</span>
                  )}
                  <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {mins} min read</span>
                </p>
              </div>
            </div>
            <ShareButtons title={post.title} />
          </div>

          {post.excerpt && (
            <p className="mt-6 text-lg text-gray-500 leading-relaxed italic">{post.excerpt}</p>
          )}
        </header>

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
        />

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <Link href="/blog" className="btn-outline inline-flex px-5 py-2.5 rounded-xl text-sm">
            <ArrowLeft className="w-4 h-4" /> All articles
          </Link>
          <ShareButtons title={post.title} />
        </div>
      </article>

      {/* ── Related ── */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-14 border-t border-gray-100">
          <div className="section-container">
            <h2 className="text-2xl font-black text-gray-900 mb-8">More articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100 card-hover flex flex-col">
                  <div className="aspect-[16/9] relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#EEF2FF,#dbe4ff)' }}>
                    {r.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.coverImage} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-black text-gray-900 text-base leading-snug mb-2 group-hover:text-[#1B4AD4] transition-colors line-clamp-2">{r.title}</h3>
                    {r.excerpt && <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{r.excerpt}</p>}
                    <p className="text-xs text-gray-400 mt-3">{r.publishedAt ? formatDate(r.publishedAt) : ''}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
