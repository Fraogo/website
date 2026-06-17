import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'
import BlogEditForm from './BlogEditForm'
import type { Metadata } from 'next'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await prisma.blogPost.findUnique({ where: { id }, select: { title: true } })
  return { title: post ? `Edit: ${post.title}` : 'Edit Post' }
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params

  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { id: true, title: true, slug: true, excerpt: true, content: true, coverImage: true, published: true },
  })

  if (!post) notFound()

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
          <h1 className="text-2xl font-black text-gray-900">Edit Post</h1>
          <p className="text-sm text-gray-400">/{post.slug}</p>
        </div>
      </div>

      <BlogEditForm post={post} />
    </div>
  )
}
