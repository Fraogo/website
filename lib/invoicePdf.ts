import type { jsPDF } from 'jspdf'
import { company, contact } from '@/content'

export interface InvoiceLine {
  name: string
  quantity: number
  unitPrice: number
  total: number
}

export interface InvoicePdfData {
  invoiceNumber: string
  clientName: string
  clientEmail?: string
  invoiceDate: string
  lineItems: InvoiceLine[]
  taxRate: number
  subtotal: number
  tax: number
  grandTotal: number
  notes?: string
}

// Standard PDF fonts (Helvetica) have no ₦ glyph, so the PDF uses "NGN".
const money = (n: number) =>
  `NGN ${(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function formatDate(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Brand-ish RGB tuples (avoid hex strings — RGB is version-safe in jsPDF)
const C = {
  brand:   [14, 42, 130] as const,
  dark:    [17, 24, 39] as const,
  body:    [55, 65, 81] as const,
  muted:   [107, 114, 128] as const,
  faint:   [156, 163, 175] as const,
  line:    [229, 231, 235] as const,
  rowline: [243, 244, 246] as const,
  tablebg: [238, 242, 255] as const,
  ghost:   [209, 213, 219] as const,
}

export async function buildInvoicePdf(data: InvoicePdfData): Promise<jsPDF> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 40
  const right = pageW - margin
  let y = 56

  // ── Brand block (left) ──
  doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor(...C.brand)
  doc.text('FRAOGO', margin, y)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...C.muted)
  doc.text(company.legalName, margin, y + 16)
  doc.text(company.rc, margin, y + 28)
  doc.text(contact.address, margin, y + 40, { maxWidth: 240 })
  doc.text(`${contact.phone}  ·  ${contact.email}`, margin, y + 66)

  // ── Invoice title + meta (right) ──
  doc.setFont('helvetica', 'bold'); doc.setFontSize(28); doc.setTextColor(...C.ghost)
  doc.text('INVOICE', right, y, { align: 'right' })
  doc.setFontSize(11); doc.setTextColor(...C.dark)
  doc.text(data.invoiceNumber || '—', right, y + 18, { align: 'right' })
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(...C.muted)
  doc.text(`Date: ${formatDate(data.invoiceDate)}`, right, y + 34, { align: 'right' })

  y += 100

  // ── Bill To ──
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...C.faint)
  doc.text('BILL TO', margin, y)
  doc.setFontSize(13); doc.setTextColor(...C.dark)
  doc.text(data.clientName || '—', margin, y + 17)
  if (data.clientEmail) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(...C.muted)
    doc.text(data.clientEmail, margin, y + 31)
  }

  y += 54

  // ── Table header ──
  const qtyX = right - 230
  const priceX = right - 130
  const totalX = right - 6
  doc.setFillColor(...C.tablebg)
  doc.rect(margin, y, right - margin, 22, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...C.body)
  doc.text('DESCRIPTION', margin + 6, y + 14)
  doc.text('QTY', qtyX, y + 14, { align: 'right' })
  doc.text('UNIT PRICE', priceX, y + 14, { align: 'right' })
  doc.text('TOTAL', totalX, y + 14, { align: 'right' })
  y += 22

  // ── Rows ──
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10)
  for (const it of data.lineItems) {
    y += 22
    doc.setTextColor(...C.dark)
    doc.text(it.name || '—', margin + 6, y, { maxWidth: qtyX - margin - 50 })
    doc.text(String(it.quantity ?? 0), qtyX, y, { align: 'right' })
    doc.text(money(it.unitPrice), priceX, y, { align: 'right' })
    doc.text(money(it.total), totalX, y, { align: 'right' })
    doc.setDrawColor(...C.rowline)
    doc.line(margin, y + 9, right, y + 9)
  }

  // ── Totals ──
  y += 34
  const labelX = right - 130
  const valX = right - 6
  const totalsRow = (label: string, val: string, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    const c = bold ? C.brand : C.body
    doc.setTextColor(c[0], c[1], c[2])
    doc.text(label, labelX, y, { align: 'right' })
    doc.text(val, valX, y, { align: 'right' })
    y += 18
  }
  doc.setFontSize(10)
  totalsRow('Subtotal', money(data.subtotal))
  totalsRow(`VAT (${data.taxRate}%)`, money(data.tax))
  doc.setDrawColor(...C.line)
  doc.line(labelX - 60, y - 7, valX, y - 7)
  doc.setFontSize(12)
  totalsRow('Grand Total', money(data.grandTotal), true)

  // ── Payment details ──
  y += 26
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...C.faint)
  doc.text('PAYMENT DETAILS', margin, y)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(...C.dark)
  doc.text(`Bank: ${company.bank.bankName}`, margin, y + 16)
  doc.text(`Account Name: ${company.bank.accountName}`, margin, y + 30)
  doc.text(`Account Number: ${company.bank.accountNumber}`, margin, y + 44)
  y += 44

  // ── Notes ──
  if (data.notes && data.notes.trim()) {
    y += 28
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...C.faint)
    doc.text('NOTES', margin, y)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(...C.body)
    doc.text(data.notes.trim(), margin, y + 15, { maxWidth: right - margin })
  }

  // ── Footer ──
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...C.faint)
  doc.text('Thank you for your business · FRAOGO', pageW / 2, pageH - 28, { align: 'center' })

  return doc
}

export async function downloadInvoicePdf(data: InvoicePdfData) {
  const doc = await buildInvoicePdf(data)
  doc.save(`${data.invoiceNumber || 'invoice'}.pdf`)
}

// Base64 (no data-URI prefix) for Resend email attachments.
export async function invoicePdfBase64(data: InvoicePdfData): Promise<string> {
  const doc = await buildInvoicePdf(data)
  const uri = doc.output('datauristring')
  return uri.substring(uri.indexOf('base64,') + 'base64,'.length)
}
