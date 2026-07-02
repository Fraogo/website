import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'dummy_key'

// Server-side admin client (service role — bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Client-side anon client (for use in browser — respects RLS)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// ─── Bucket names ─────────────────────────────────────────────────────────────
export const VENDOR_DOCUMENTS_BUCKET = 'vendor-documents' // private
export const VENDOR_PORTFOLIO_BUCKET = 'vendor-portfolio' // public
export const BLOG_IMAGES_BUCKET = 'blog-images' // public

// ─── Upload a blog image (server-side, service role) ──────────────────────────
// Returns the public URL. Used for cover images and in-article images, by both
// the admin editor and the token-gated public write page.
export async function uploadBlogImage(bytes: Buffer, ext: string, contentType: string) {
  const safeExt = ext.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg'
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${safeExt}`

  const { data, error } = await supabaseAdmin.storage
    .from(BLOG_IMAGES_BUCKET)
    .upload(fileName, bytes, { contentType })

  if (error) {
    console.error('[Storage] Blog image upload error:', error)
    throw error
  }

  const { data: publicData } = supabaseAdmin.storage
    .from(BLOG_IMAGES_BUCKET)
    .getPublicUrl(data.path)

  return publicData.publicUrl
}

// ─── Upload vendor NIN document (server-side) ─────────────────────────────────
export async function uploadNinDocument(
  file: File,
  vendorId: string
) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${vendorId}/nin_${Date.now()}.${fileExt}`

  const { data, error } = await supabaseAdmin.storage
    .from(VENDOR_DOCUMENTS_BUCKET)
    .upload(fileName, file)

  if (error) {
    console.error('[Storage] NIN upload error:', error)
    throw error
  }

  return data.path
}

// ─── Get signed URL for private NIN document ──────────────────────────────────
// Must never throw: it's awaited during page render, so a throw would crash the
// whole page. Returns null on a missing path or any storage/network failure.
export async function getNinSignedUrl(path: string | null | undefined) {
  if (!path) return null

  try {
    const { data, error } = await supabaseAdmin.storage
      .from(VENDOR_DOCUMENTS_BUCKET)
      .createSignedUrl(path, 60 * 15) // 15 mins expiry

    if (error) {
      console.error('[Storage] Signed URL error:', error)
      return null
    }

    return data.signedUrl
  } catch (err) {
    console.error('[Storage] Signed URL threw:', err)
    return null
  }
}

// ─── Upload portfolio image (server-side) ─────────────────────────────────────
export async function uploadPortfolioImage(
  file: File,
  vendorId: string
) {
  const fileName = `${vendorId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`

  const { data, error } = await supabaseAdmin.storage
    .from(VENDOR_PORTFOLIO_BUCKET)
    .upload(fileName, file)

  if (error) {
    console.error('[Storage] Portfolio upload error:', error)
    throw error
  }

  const { data: publicData } = supabaseAdmin.storage
    .from(VENDOR_PORTFOLIO_BUCKET)
    .getPublicUrl(data.path)

  return publicData.publicUrl
}

// ─── Delete portfolio image ───────────────────────────────────────────────────
export async function deletePortfolioImage(path: string) {
  const { error } = await supabaseAdmin.storage
    .from(VENDOR_PORTFOLIO_BUCKET)
    .remove([path])

  if (error) {
    console.error('[Storage] Delete error:', error)
    throw error
  }
}
