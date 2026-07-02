'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { createBlogPost } from '@/app/actions/blog'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { makeImageUploader } from '@/components/blog/imageUpload'

const uploadImage = makeImageUploader()

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [content, setContent] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const result = await createBlogPost({
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
        setError(typeof result.error === 'string' ? result.error : 'Please check the fields and try again.')
      }
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/blog" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
          <BookOpen className="w-5 h-5" style={{ color: '#1B4AD4' }} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">New Blog Post</h1>
          <p className="text-sm text-gray-400">Write and publish a new article</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Title *</label>
            <input
              name="title"
              type="text"
              required
              placeholder="e.g. How to Source Products from China for Your Nigerian Business"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Short Summary / Excerpt <span className="text-gray-400 font-normal">(shows on blog listing)</span></label>
            <textarea
              name="excerpt"
              rows={2}
              placeholder="One or two sentences summarising what the article is about."
              className="form-input resize-none"
            />
          </div>

          <div>
            <label className="form-label">Author <span className="text-gray-400 font-normal">(name shown on the post)</span></label>
            <input
              name="author"
              type="text"
              placeholder="e.g. Franklin Obuke"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Cover Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              name="coverImage"
              type="url"
              placeholder="https://..."
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Content *</label>
            <RichTextEditor value={content} onChange={setContent} uploadImage={uploadImage} />
            <p className="text-xs text-gray-400 mt-1">
              Use the toolbar to format your article — headings, lists, quotes, links and images.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <label className="form-label mb-0">Publish immediately?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="published" value="true" className="accent-[#1B4AD4]" />
                Yes, publish now
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="published" value="false" defaultChecked className="accent-[#1B4AD4]" />
                Save as draft
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-3 rounded-xl text-sm font-bold flex-1 disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Save Post'}
            </button>
            <Link href="/admin/blog" className="btn-outline px-6 py-3 rounded-xl text-sm font-bold text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
