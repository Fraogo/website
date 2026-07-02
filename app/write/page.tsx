import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { validateWriterToken } from '@/lib/blogWriter'
import WriteBlogForm from '@/components/blog/WriteBlogForm'

export const metadata: Metadata = {
  title: 'Write a Post',
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

export default async function WritePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const writer = token ? await validateWriterToken(token) : null

  if (!writer || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f8fafc' }}>
        <div className="max-w-md w-full bg-white rounded-2xl border border-border shadow-soft p-8 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#FEF2F2' }}>
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-2">Invalid writing link</h1>
          <p className="text-sm text-gray-500 mb-6">
            This link is invalid or has been revoked. Please ask Fraogo for a new writing link.
          </p>
          <Link href="/" className="btn-primary px-5 py-2.5 rounded-xl text-sm">Go home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <div className="page-header">
        <div className="section-container pt-8">
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#93A9F5' }}>Fraogo Blog</p>
          <h1 className="text-3xl lg:text-4xl font-black mb-2">Write a Post</h1>
          <p className="text-white/70 max-w-xl">
            Writing as <strong>{writer.name}</strong>. When you publish, your post goes live on the Fraogo blog straight away.
          </p>
        </div>
      </div>
      <div className="section-container py-10">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-border shadow-soft p-5 sm:p-7">
          <WriteBlogForm token={token} writerName={writer.name} />
        </div>
      </div>
    </div>
  )
}
