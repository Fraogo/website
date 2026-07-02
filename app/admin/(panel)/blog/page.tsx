import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { BookOpen, Plus, Eye, Link2 } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import DeleteButton from '@/components/admin/DeleteButton'
import { deleteBlogPost } from '@/app/actions/blog'

export const metadata: Metadata = { title: 'Blog Posts — Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      published: true,
      publishedAt: true,
      createdAt: true,
    },
  })

  const publishedCount = posts.filter((p) => p.published).length

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
            <BookOpen className="w-5 h-5" style={{ color: '#1B4AD4' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Blog Posts</h1>
            <p className="text-sm text-gray-400">{publishedCount} published · {posts.length - publishedCount} draft</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/blog/writers"
            className="btn-outline px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <Link2 className="w-4 h-4" /> Writer Links
          </Link>
          <Link
            href="/admin/blog/new"
            className="btn-primary px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Post
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-soft">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-200" />
          <p className="text-gray-400 font-semibold mb-4">No blog posts yet</p>
          <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
            Write about procurement tips, logistics updates, or Nigerian business insights to help your audience.
          </p>
          <Link href="/admin/blog/new" className="btn-primary px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Write First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="font-black text-gray-900 text-base">{post.title}</h2>
                  <span className={`status-badge text-xs px-2 py-0.5 ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                {post.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-1 mb-2">{post.excerpt}</p>
                )}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-400">
                  <span className="truncate max-w-[140px] sm:max-w-xs">/{post.slug}</span>
                  <span>·</span>
                  <span>{post.publishedAt ? `Published ${formatDate(post.publishedAt)}` : `Created ${formatDate(post.createdAt)}`}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {post.published && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#1B4AD4] hover:bg-blue-50 transition-colors"
                    title="View on site"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                )}
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="text-xs font-semibold text-[#1B4AD4] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Edit
                </Link>
                <DeleteButton id={post.id} action={deleteBlogPost} confirmText={`Delete "${post.title}" permanently?`} />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
