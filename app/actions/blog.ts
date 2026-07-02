'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin, verifyAdminSession } from '@/lib/auth'
import { sanitizeHtml } from '@/lib/sanitize'
import { validateWriterToken } from '@/lib/blogWriter'
import { enforceSubmissionLimit, looksLikeBot } from '@/lib/submitGuard'
import { uploadBlogImage } from '@/lib/storage'
import { revalidatePath } from 'next/cache'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || 'post'
  let slug = base
  let counter = 1
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${base}-${counter++}`
  }
  return slug
}

const postSchema = z.object({
  title:      z.string().min(3),
  excerpt:    z.string().optional(),
  content:    z.string().min(10),
  coverImage: z.string().url().optional().or(z.literal('')),
  author:     z.string().optional(),
  published:  z.boolean().default(false),
})

export type BlogPostData = z.infer<typeof postSchema>

export async function createBlogPost(data: BlogPostData) {
  await requireAdmin()

  const parsed = postSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors }

  const d = parsed.data
  d.content = sanitizeHtml(d.content)
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
        author:      d.author || null,
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
  await requireAdmin()

  const parsed = postSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors }

  const d = parsed.data
  d.content = sanitizeHtml(d.content)

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
        author:      d.author || null,
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
  await requireAdmin()

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

// ─── Public (token-gated) authoring ───────────────────────────────────────────

const publicPostSchema = z.object({
  title:      z.string().min(3).max(200),
  excerpt:    z.string().max(500).optional(),
  content:    z.string().min(10),
  coverImage: z.string().url().optional().or(z.literal('')),
  author:     z.string().max(120).optional(),
})

// Publishes a post from the private /write link. No admin session — authorized
// by a valid writer token. Rate-limited + honeypot-guarded + sanitized.
export async function submitPublicBlogPost(token: string, data: unknown) {
  const limitError = await enforceSubmissionLimit('blog-write')
  if (limitError) return { success: false, error: limitError }
  if (looksLikeBot(data)) return { success: true }

  const writer = await validateWriterToken(token)
  if (!writer) return { success: false, error: 'This writing link is invalid or has been revoked.' }

  const parsed = publicPostSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors }
  const d = parsed.data

  try {
    const slug = await uniqueSlug(d.title)
    const post = await prisma.blogPost.create({
      data: {
        title:       d.title,
        slug,
        excerpt:     d.excerpt || null,
        content:     sanitizeHtml(d.content),
        coverImage:  d.coverImage || null,
        author:      (d.author && d.author.trim()) || writer.name,
        published:   true,
        publishedAt: new Date(),
      },
    })
    await prisma.blogWriterToken
      .update({ where: { id: writer.id }, data: { lastUsedAt: new Date() } })
      .catch(() => {})
    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    return { success: true, slug: post.slug }
  } catch (error) {
    console.error('[Blog] Public submit error:', error)
    return { success: false, error: 'Failed to publish post. Please try again.' }
  }
}

// ─── Image upload (admin OR writer token) ─────────────────────────────────────

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif']

export async function uploadBlogImageAction({
  base64,
  filename,
  token,
}: {
  base64: string
  filename: string
  token?: string
}) {
  const session = await verifyAdminSession()
  const authorized = !!session || !!(token && (await validateWriterToken(token)))
  if (!authorized) return { success: false, error: 'Unauthorized' }

  if (!base64) return { success: false, error: 'No image data.' }
  const ext = (filename.split('.').pop() || 'jpg').toLowerCase()
  if (!IMAGE_EXTS.includes(ext)) {
    return { success: false, error: 'Only JPG, PNG, WebP or GIF images are allowed.' }
  }

  const bytes = Buffer.from(base64, 'base64')
  if (bytes.length > MAX_IMAGE_BYTES) return { success: false, error: 'Image must be under 5MB.' }

  const contentType =
    ext === 'png' ? 'image/png'
    : ext === 'webp' ? 'image/webp'
    : ext === 'gif' ? 'image/gif'
    : 'image/jpeg'

  try {
    const url = await uploadBlogImage(bytes, ext, contentType)
    return { success: true, url }
  } catch (error) {
    console.error('[Blog] Image upload error:', error)
    return { success: false, error: 'Upload failed. Please try again.' }
  }
}
