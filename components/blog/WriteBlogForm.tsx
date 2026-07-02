'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2, Upload, AlertTriangle, X } from 'lucide-react'
import RichTextEditor from '@/components/admin/RichTextEditor'
import Honeypot from '@/components/ui/Honeypot'
import { makeImageUploader } from './imageUpload'
import { submitPublicBlogPost } from '@/app/actions/blog'

export default function WriteBlogForm({ token, writerName }: { token: string; writerName: string }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState(writerName)
  const [excerpt, setExcerpt] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [content, setContent] = useState('')
  const [hp, setHp] = useState('')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null)

  const uploader = makeImageUploader(token)

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploadingCover(true)
    setError(null)
    try {
      setCoverImage(await uploader(file))
    } catch {
      setError('Cover image upload failed. Please try again or paste a URL.')
    } finally {
      setUploadingCover(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (title.trim().length < 3) { setError('Title must be at least 3 characters.'); return }
    if (content.replace(/<[^>]*>/g, '').trim().length < 10) { setError('Please write some content first.'); return }

    setSubmitting(true)
    const res = await submitPublicBlogPost(token, {
      title, author, excerpt, coverImage, content, company_website: hp,
    })
    setSubmitting(false)
    if (res.success) setPublishedSlug(res.slug ?? '')
    else setError(typeof res.error === 'string' ? res.error : 'Please check the fields and try again.')
  }

  if (publishedSlug !== null) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg,#0E2A82,#1B4AD4)' }}>
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Published!</h2>
        <p className="text-gray-500 mb-7">Your post is now live on the blog.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href={`/blog/${publishedSlug}`} className="btn-primary px-5 py-2.5 rounded-xl text-sm">View post</Link>
          <button
            onClick={() => { setTitle(''); setExcerpt(''); setCoverImage(''); setContent(''); setPublishedSlug(null) }}
            className="btn-outline px-5 py-2.5 rounded-xl text-sm"
          >
            Write another
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Honeypot value={hp} onChange={setHp} />

      <div>
        <label className="form-label">Title *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200}
          placeholder="A clear, specific headline" className="form-input text-lg font-bold" />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="form-label">Author</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={120} className="form-input" />
        </div>
        <div>
          <label className="form-label">Short summary <span className="text-gray-400 font-normal">(optional)</span></label>
          <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxLength={500}
            placeholder="One line shown on the blog list" className="form-input" />
        </div>
      </div>

      <div>
        <label className="form-label">Cover image <span className="text-gray-400 font-normal">(optional)</span></label>
        {coverImage ? (
          <div className="relative rounded-xl overflow-hidden border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt="Cover" className="w-full max-h-56 object-cover" />
            <button type="button" onClick={() => setCoverImage('')}
              className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/60 text-white flex items-center justify-center" aria-label="Remove cover">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="inline-flex items-center justify-center gap-2 btn-outline px-4 py-2.5 rounded-xl text-sm cursor-pointer whitespace-nowrap">
              {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload image
              <input type="file" accept="image/*" className="sr-only" onChange={handleCover} disabled={uploadingCover} />
            </label>
            <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
              placeholder="…or paste an image URL" className="form-input flex-1" />
          </div>
        )}
      </div>

      <div>
        <label className="form-label">Content *</label>
        <RichTextEditor value={content} onChange={setContent} uploadImage={uploader} />
        <p className="text-xs text-gray-400 mt-1">Use the toolbar for headings, lists, quotes, links and images (upload or paste a URL).</p>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {error}
        </div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 rounded-xl text-base disabled:opacity-60">
        {submitting ? <span className="flex items-center gap-2 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Publishing…</span> : 'Publish Post'}
      </button>
    </form>
  )
}
