'use server'

import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { sendInvoiceEmail } from '@/lib/email'
import { revalidatePath } from 'next/cache'

const lineItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(200),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  total: z.number().min(0),
})

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required').max(60),
  clientName: z.string().min(2, 'Client name is required').max(200),
  clientEmail: z.string().email().max(200).optional().or(z.literal('')),
  invoiceDate: z.string(),
  taxRate: z.number().min(0).max(100),
  lineItems: z.array(lineItemSchema).min(1).max(100),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  grandTotal: z.number().min(0),
})

export type InvoiceFormData = z.infer<typeof invoiceSchema>

export async function saveInvoice(data: InvoiceFormData) {
  await requireAdmin()
  const parsed = invoiceSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }

  const d = parsed.data

  try {
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: d.invoiceNumber,
        clientName: d.clientName,
        clientEmail: d.clientEmail || null,
        invoiceDate: new Date(d.invoiceDate),
        taxRate: d.taxRate,
        lineItems: d.lineItems as Prisma.InputJsonValue,
        subtotal: d.subtotal,
        tax: d.tax,
        grandTotal: d.grandTotal,
      },
    })
    return { success: true, invoiceId: invoice.id }
  } catch (error: unknown) {
    // Handle unique constraint (duplicate invoice number)
    if ((error as { code?: string }).code === 'P2002') {
      return { success: false, error: 'Invoice number already exists. Please use a different number.' }
    }
    console.error('[Invoice] Save error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function getInvoices() {
  await requireAdmin()
  return prisma.invoice.findMany({ orderBy: { createdAt: 'desc' } })
}

const emailInvoiceSchema = z.object({
  to: z.string().email('A valid client email is required'),
  invoiceNumber: z.string().min(1).max(60),
  clientName: z.string().min(1).max(200),
  grandTotal: z.string().min(1).max(40),
  pdfBase64: z.string().min(1),
})

export async function emailInvoice(data: z.infer<typeof emailInvoiceSchema>) {
  await requireAdmin()
  const parsed = emailInvoiceSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: 'Invalid invoice email data.' }
  }
  const res = await sendInvoiceEmail(parsed.data)
  if (!res.success) {
    return { success: false, error: 'Could not send the email. Check the email configuration and try again.' }
  }
  return { success: true }
}

export async function deleteInvoice(id: string) {
  await requireAdmin()
  try {
    await prisma.invoice.delete({ where: { id } })
    revalidatePath('/admin/invoice')
    return { success: true }
  } catch (error) {
    console.error('[Invoice] Delete error:', error)
    return { success: false, error: 'Failed to delete invoice.' }
  }
}

export async function getNextInvoiceNumber(): Promise<string> {
  await requireAdmin()
  const year = new Date().getFullYear()
  const lastInvoice = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: `FRG-${year}-` } },
    orderBy: { createdAt: 'desc' },
  })

  if (!lastInvoice) return `FRG-${year}-0001`

  const lastNum = parseInt(lastInvoice.invoiceNumber.split('-')[2] ?? '0')
  const nextNum = String(lastNum + 1).padStart(4, '0')
  return `FRG-${year}-${nextNum}`
}
