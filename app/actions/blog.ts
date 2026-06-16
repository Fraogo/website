'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

const postSchema = z.object({
  title:      z.string().min(3),
  excerpt:    z.string().optional(),
  content:    z.string().min(10),
  coverImage: z.string().url().optional().or(z.literal('')),
  published:  z.boolean().default(false),
})

export type BlogPostData = z.infer<typeof postSchema>

export async function createBlogPost(data: BlogPostData) {
  const parsed = postSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors }

  const d = parsed.data
  const baseSlug = slugify(d.title)

  // Ensure unique slug
  let slug = baseSlug
  let counter = 1
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`
  }

  try {
    const post = await prisma.blogPost.create({
      data: {
        title:       d.title,
        slug,
        excerpt:     d.excerpt || null,
        content:     d.content,
        coverImage:  d.coverImage || null,
        published:   d.published,
        publishedAt: d.published ? new Date() : null,
      },
    })

    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    return { success: true, id: post.id, slug: post.slug }
  } catch (error) {
    console.error('[Blog] Create error:', error)
    return { success: false, error: 'Failed to create post.' }
  }
}

export async function updateBlogPost(id: string, data: BlogPostData & { publish?: boolean }) {
  const parsed = postSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors }

  const d = parsed.data

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) return { success: false, error: 'Post not found.' }

    const wasPublished = existing.published

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title:       d.title,
        excerpt:     d.excerpt || null,
        content:     d.content,
        coverImage:  d.coverImage || null,
        published:   d.published,
        publishedAt: d.published && !wasPublished ? new Date() : existing.publishedAt,
      },
    })

    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath('/admin/blog')
    return { success: true, slug: post.slug }
  } catch (error) {
    console.error('[Blog] Update error:', error)
    return { success: false, error: 'Failed to update post.' }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const post = await prisma.blogPost.delete({ where: { id } })
    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath('/admin/blog')
    return { success: true }
  } catch (error) {
    console.error('[Blog] Delete error:', error)
    return { success: false, error: 'Failed to delete post.' }
  }
}
