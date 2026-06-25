'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { updateBlogPost, deleteBlogPost } from '@/app/actions/blog'
import RichTextEditor from '@/components/admin/RichTextEditor'

interface PostData {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  author: string | null
  published: boolean
}

export default function BlogEditForm({ post }: { post: PostData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [content, setContent] = useState(post.content)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const result = await updateBlogPost(post.id, {
        title:      data.get('title') as string,
        excerpt:    (data.get('excerpt') as string) || undefined,
        content,
        coverImage: (data.get('coverImage') as string) || undefined,
        author:     (data.get('author') as string) || undefined,
        published:  data.get('published') === 'true',
      })

      if (result.success) {
        router.push('/admin/blog')
      } else {
        setError(typeof result.error === 'string' ? result.error : 'Please check the fields.')
      }
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this post permanently? This cannot be undone.')) return
    setDeleting(true)
    const result = await deleteBlogPost(post.id)
    if (result.success) router.push('/admin/blog')
    else { setError('Failed to delete post.'); setDeleting(false) }
  }

  return (
    <>
      <div className="flex justify-end mb-5">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {deleting ? 'Deleting…' : 'Delete Post'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Title *</label>
            <input name="title" type="text" required defaultValue={post.title} className="form-input" />
          </div>

          <div>
            <label className="form-label">Short Summary / Excerpt</label>
            <textarea name="excerpt" rows={2} defaultValue={post.excerpt ?? ''} className="form-input resize-none" />
          </div>

          <div>
            <label className="form-label">Author <span className="text-gray-400 font-normal">(name shown on the post)</span></label>
            <input name="author" type="text" defaultValue={post.author ?? ''} placeholder="e.g. Franklin Obuke" className="form-input" />
          </div>

          <div>
            <label className="form-label">Cover Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
            <input name="coverImage" type="url" defaultValue={post.coverImage ?? ''} placeholder="https://..." className="form-input" />
          </div>

          <div>
            <label className="form-label">Content *</label>
            <RichTextEditor value={content} onChange={setContent} />
            <p className="text-xs text-gray-400 mt-1">
              Use the toolbar to format your article — headings, lists, quotes, links and images.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <label className="form-label mb-0">Status:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="published" value="true" defaultChecked={post.published} className="accent-[#1B4AD4]" />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="published" value="false" defaultChecked={!post.published} className="accent-[#1B4AD4]" />
                Draft
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary px-6 py-3 rounded-xl text-sm font-bold flex-1 disabled:opacity-60">
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
            {post.published && (
              <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="btn-outline px-5 py-3 rounded-xl text-sm font-bold">
                View Post
              </a>
            )}
            <Link href="/admin/blog" className="btn-outline px-5 py-3 rounded-xl text-sm font-bold">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
