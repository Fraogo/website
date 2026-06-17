import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { sanitizeHtml } from '@/lib/sanitize'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Calendar } from 'lucide-react'
import type { Metadata } from 'next'

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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } })
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-white">

      {/* ── Cover ── */}
      {post.coverImage && (
        <div className="w-full h-72 sm:h-96 overflow-hidden relative" style={{ background: '#EEF2FF' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      {/* ── Article ── */}
      <article className="section-container py-12 lg:py-16 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4AD4] mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4">{post.title}</h1>
          {post.publishedAt && (
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt)}
            </div>
          )}
          {post.excerpt && (
            <p className="mt-4 text-base text-gray-500 leading-relaxed border-l-4 border-[#1B4AD4] pl-4 italic">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Rich text content */}
        <div
          className="prose prose-gray prose-sm lg:prose-base max-w-none
            prose-headings:font-black prose-headings:text-gray-900
            prose-a:text-[#1B4AD4] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900
            prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
        />
      </article>

      {/* ── Back nav ── */}
      <div className="section-container pb-16 max-w-3xl">
        <Link href="/blog" className="btn-outline inline-flex px-6 py-2.5 rounded-xl text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    </div>
  )
}
