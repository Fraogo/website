import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Link2 } from 'lucide-react'
import { getWriterTokens } from '@/app/actions/blogWriter'
import WriterLinksManager from '@/components/admin/WriterLinksManager'

export const metadata: Metadata = { title: 'Writer Links — Admin' }
export const dynamic = 'force-dynamic'

export default async function WriterLinksPage() {
  const tokens = await getWriterTokens()

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/blog" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
          <Link2 className="w-5 h-5" style={{ color: '#1B4AD4' }} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Writer Links</h1>
          <p className="text-sm text-gray-400">Private links that let people publish posts without an admin account</p>
        </div>
      </div>

      <WriterLinksManager initialTokens={tokens} />
    </div>
  )
}
