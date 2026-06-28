'use server'

import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { sendCustomAdminEmail } from '@/lib/email'

const MAX_ATTACHMENTS = 3
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024 // 5MB

const attachmentSchema = z.object({
  filename: z.string().min(1).max(200).regex(/\.(jpe?g|png|webp|gif)$/i, 'Only image files are allowed'),
  content: z.string().min(1), // base64, decoded size checked below
})

const customEmailSchema = z.object({
  to: z.string().email('Invalid email address').max(200),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(1, 'Message is required').max(5000),
  attachments: z.array(attachmentSchema).max(MAX_ATTACHMENTS, `Maximum ${MAX_ATTACHMENTS} images`).optional(),
})

export type CustomEmailData = z.infer<typeof customEmailSchema>

// Admin-only: send a free-typed reply to whoever submitted a request, for
// real through Resend (not a mailto: link). Used from ContactButtons.
export async function sendAdminComposedEmail(data: CustomEmailData) {
  await requireAdmin()

  const parsed = customEmailSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }
  const d = parsed.data

  for (const att of d.attachments ?? []) {
    const bytes = Buffer.from(att.content, 'base64').length
    if (bytes > MAX_ATTACHMENT_BYTES) {
      return { success: false, error: `"${att.filename}" is over 5MB.` }
    }
  }

  const result = await sendCustomAdminEmail(d)
  if (!result.success) {
    return { success: false, error: typeof result.error === 'string' ? result.error : 'Failed to send email.' }
  }
  return { success: true }
}
