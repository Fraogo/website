'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { sendEmail } from '@/lib/email'
import { revalidatePath } from 'next/cache'

const contactSchema = z.object({
  name:    z.string().min(2, 'Name is required'),
  email:   z.string().email('A valid email address is required'),
  phone:   z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>

export async function submitContactForm(data: ContactFormData) {
  const parsed = contactSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }

  const { name, email, phone, subject, message } = parsed.data

  try {
    await prisma.contactInquiry.create({
      data: { name, email, phone: phone ?? null, subject, message },
    })

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'fraogo6@gmail.com'
    const ADMIN_CC    = process.env.ADMIN_EMAIL_CC

    await sendEmail({
      to: ADMIN_EMAIL,
      cc: ADMIN_CC,
      subject: `[FRAOGO] New Contact Inquiry — ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto">
          <div style="background:#1B4AD4;padding:28px 32px;border-radius:8px 8px 0 0">
            <h1 style="color:#fff;margin:0;font-size:22px">New Contact Inquiry</h1>
          </div>
          <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 12px;font-weight:600;background:#f9fafb;width:30%;border:1px solid #e5e7eb">Name</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${name}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:600;background:#f9fafb;border:1px solid #e5e7eb">Email</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${email}</td></tr>
              ${phone ? `<tr><td style="padding:8px 12px;font-weight:600;background:#f9fafb;border:1px solid #e5e7eb">Phone</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${phone}</td></tr>` : ''}
              <tr><td style="padding:8px 12px;font-weight:600;background:#f9fafb;border:1px solid #e5e7eb">Subject</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${subject}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:600;background:#f9fafb;border:1px solid #e5e7eb;vertical-align:top">Message</td><td style="padding:8px 12px;border:1px solid #e5e7eb;white-space:pre-wrap">${message}</td></tr>
            </table>
            <p style="margin-top:20px"><a href="${process.env.NEXTAUTH_URL}/admin/contacts" style="background:#1B4AD4;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;display:inline-block">View in Admin Panel</a></p>
          </div>
        </div>
      `,
    })

    revalidatePath('/admin/contacts')
    return { success: true }
  } catch (error) {
    console.error('[Contact] Submit error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function getContactInquiries(status?: string) {
  await requireAdmin()
  return prisma.contactInquiry.findMany({
    where: status && status !== 'all' ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  })
}

export async function markContactRead(id: string, status: 'read' | 'responded') {
  await requireAdmin()
  await prisma.contactInquiry.update({ where: { id }, data: { status } })
  revalidatePath('/admin/contacts')
}
