'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, FileText, Download, Mail, Loader2, FolderOpen, Pencil, Printer } from 'lucide-react'
import {
  saveInvoice, getNextInvoiceNumber, getInvoices, deleteInvoice, emailInvoice,
} from '@/app/actions/invoice'
import { downloadInvoicePdf, printInvoicePdf, invoicePdfBase64, type InvoicePdfData } from '@/lib/invoicePdf'
import { company } from '@/content'

interface LineItem {
  name: string
  quantity: number
  unitPrice: number
  total: number
}

type SavedInvoice = Awaited<ReturnType<typeof getInvoices>>[number]

const TAX_RATE = 7.5 // VAT in Nigeria
const DEFAULT_NOTES = 'Payment due within 7 days. Kindly pay into the account below and send proof of payment to our email.'

export default function InvoicePage() {
  const [view, setView] = useState<'menu' | 'new' | 'saved'>('menu')

  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [taxRate, setTaxRate] = useState(TAX_RATE)
  const [items, setItems] = useState<LineItem[]>([{ name: '', quantity: 1, unitPrice: 0, total: 0 }])
  const [notes, setNotes] = useState(DEFAULT_NOTES)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [printing, setPrinting] = useState(false)
  const [emailing, setEmailing] = useState(false)
  const [error, setError] = useState('')
  const [emailMsg, setEmailMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const [invoices, setInvoices] = useState<SavedInvoice[]>([])
  const [loadingList, setLoadingList] = useState(false)

  // Only fetch a number when the editor is actually opened — the landing menu
  // stays instant (no DB round-trip on page load).
  useEffect(() => {
    if (view === 'new' && !invoiceNumber) getNextInvoiceNumber().then(setInvoiceNumber)
  }, [view, invoiceNumber])

  function startNewInvoice() {
    setClientName('')
    setClientEmail('')
    setInvoiceDate(new Date().toISOString().slice(0, 10))
    setTaxRate(TAX_RATE)
    setItems([{ name: '', quantity: 1, unitPrice: 0, total: 0 }])
    setNotes(DEFAULT_NOTES)
    setSaved(false)
    setEmailMsg(null)
    setError('')
    setInvoiceNumber('') // the effect above fetches a fresh number
    setView('new')
  }

  useEffect(() => {
    if (view !== 'saved') return
    setLoadingList(true)
    getInvoices().then((data) => { setInvoices(data); setLoadingList(false) })
  }, [view])

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    setItems((prev) => {
      const updated = [...prev]
      const item = { ...updated[index], [field]: value }
      if (field === 'quantity' || field === 'unitPrice') {
        item.total = Number(item.quantity) * Number(item.unitPrice)
      }
      updated[index] = item
      return updated
    })
  }

  const addItem = () => setItems((p) => [...p, { name: '', quantity: 1, unitPrice: 0, total: 0 }])
  const removeItem = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i))

  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0)
  const tax = subtotal * (taxRate / 100)
  const grandTotal = subtotal + tax

  const fmt = (n: number) => `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`

  const pdfData = (): InvoicePdfData => ({
    invoiceNumber,
    clientName,
    clientEmail: clientEmail || undefined,
    invoiceDate,
    lineItems: items,
    taxRate,
    subtotal,
    tax,
    grandTotal,
    notes,
  })

  async function handleSave() {
    setSaving(true)
    setError('')
    const result = await saveInvoice({
      invoiceNumber, clientName, clientEmail, invoiceDate,
      taxRate, lineItems: items, subtotal, tax, grandTotal,
    })
    setSaving(false)
    if (result.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      setError(typeof result.error === 'string' ? result.error : 'Failed to save invoice.')
    }
  }

  async function handleDownload() {
    setDownloading(true)
    setError('')
    try {
      await downloadInvoicePdf(pdfData())
    } catch (e) {
      console.error(e)
      setError('Could not generate the PDF. Please try again.')
    }
    setDownloading(false)
  }

  async function handlePrint() {
    setPrinting(true)
    setError('')
    try {
      await printInvoicePdf(pdfData())
    } catch (e) {
      console.error(e)
      setError('Could not open the invoice to print.')
    }
    setPrinting(false)
  }

  async function handleEmail() {
    if (!clientEmail) { setEmailMsg({ ok: false, text: 'Add a client email address first.' }); return }
    setEmailing(true)
    setEmailMsg(null)
    try {
      const pdfBase64 = await invoicePdfBase64(pdfData())
      const res = await emailInvoice({
        to: clientEmail, invoiceNumber, clientName: clientName || 'Customer',
        grandTotal: fmt(grandTotal), pdfBase64,
      })
      setEmailMsg(res.success
        ? { ok: true, text: `Invoice emailed to ${clientEmail}.` }
        : { ok: false, text: res.error || 'Failed to send email.' })
    } catch (e) {
      console.error(e)
      setEmailMsg({ ok: false, text: 'Could not generate the PDF to email.' })
    }
    setEmailing(false)
  }

  function openInvoice(inv: SavedInvoice) {
    setInvoiceNumber(inv.invoiceNumber)
    setClientName(inv.clientName)
    setClientEmail(inv.clientEmail ?? '')
    setInvoiceDate(new Date(inv.invoiceDate).toISOString().slice(0, 10))
    setTaxRate(inv.taxRate)
    setItems((inv.lineItems as unknown as LineItem[]) ?? [])
    setEmailMsg(null)
    setError('')
    setView('new')
  }

  async function downloadSaved(inv: SavedInvoice) {
    await downloadInvoicePdf({
      invoiceNumber: inv.invoiceNumber,
      clientName: inv.clientName,
      clientEmail: inv.clientEmail ?? undefined,
      invoiceDate: new Date(inv.invoiceDate).toISOString(),
      lineItems: inv.lineItems as unknown as LineItem[],
      taxRate: inv.taxRate,
      subtotal: inv.subtotal,
      tax: inv.tax,
      grandTotal: inv.grandTotal,
      notes,
    })
  }

  async function handleDeleteSaved(id: string) {
    if (!confirm('Delete this invoice permanently?')) return
    const res = await deleteInvoice(id)
    if (res.success) setInvoices((p) => p.filter((x) => x.id !== id))
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
            <FileText className="w-5 h-5" style={{ color: '#1B4AD4' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Invoice Generator</h1>
            <p className="text-sm text-gray-400">Create, download, email and manage invoices</p>
          </div>
        </div>
        {view === 'new' && (
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleDownload} disabled={downloading}
              className="btn-outline px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-60">
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button onClick={handlePrint} disabled={printing}
              className="btn-outline px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-60">
              {printing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              <span className="hidden sm:inline">Print</span>
            </button>
            <button onClick={handleEmail} disabled={emailing || !clientEmail}
              className="btn-outline px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-50"
              title={!clientEmail ? 'Add a client email first' : 'Email this invoice to the client'}>
              {emailing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              <span className="hidden sm:inline">Email</span>
            </button>
            <button onClick={handleSave} disabled={saving}
              className="btn-primary px-3 sm:px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-60">
              {saving ? 'Saving…' : saved ? '✓' : <><span className="hidden sm:inline">Save Invoice</span><span className="sm:hidden">Save</span></>}
            </button>
          </div>
        )}
      </div>

      {/* Tabs — hidden on the landing menu */}
      {view !== 'menu' && (
        <div className="flex gap-2 mb-6">
          <button onClick={() => setView('menu')}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-white border border-border text-gray-500 hover:border-gray-400">
            ← Menu
          </button>
          {(['new', 'saved'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === v ? 'text-white' : 'bg-white border border-border text-gray-600 hover:border-gray-400'}`}
              style={view === v ? { background: '#0E2A82' } : {}}>
              {v === 'new' ? 'New Invoice' : 'Saved Invoices'}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
      )}
      {emailMsg && view === 'new' && (
        <div className={`text-sm px-4 py-3 rounded-xl mb-5 border ${emailMsg.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {emailMsg.text}
        </div>
      )}

      {/* ─── LANDING MENU ─── */}
      {view === 'menu' ? (
        <div className="grid sm:grid-cols-2 gap-5">
          <button onClick={startNewInvoice}
            className="bg-white rounded-2xl border border-gray-100 shadow-soft p-8 text-left hover:border-[#1B4AD4] hover:shadow-elevated transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg,#0E2A82,#1B4AD4)' }}>
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-1">New Invoice</h2>
            <p className="text-sm text-gray-500">Create a fresh invoice, then download, print or email it.</p>
          </button>
          <button onClick={() => setView('saved')}
            className="bg-white rounded-2xl border border-gray-100 shadow-soft p-8 text-left hover:border-[#1B4AD4] hover:shadow-elevated transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: '#EEF2FF' }}>
              <FolderOpen className="w-6 h-6" style={{ color: '#1B4AD4' }} />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-1">Saved Invoices</h2>
            <p className="text-sm text-gray-500">Open, re-download or delete invoices you&apos;ve saved.</p>
          </button>
        </div>
      ) : view === 'saved' ? (
        loadingList ? (
          <div className="flex items-center gap-2 text-gray-400 text-sm py-12 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading invoices…
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-soft">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-200" />
            <p className="text-gray-400 font-semibold">No saved invoices yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Invoice #</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-gray-900 text-xs">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3.5 text-gray-700 font-semibold">{inv.clientName}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs hidden sm:table-cell">
                      {new Date(inv.invoiceDate).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-gray-900">{fmt(inv.grandTotal)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openInvoice(inv)} className="text-xs font-semibold text-[#1B4AD4] hover:underline flex items-center gap-1">
                          <FolderOpen className="w-3.5 h-3.5" /> Open
                        </button>
                        <button onClick={() => downloadSaved(inv)} className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1">
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                        <button onClick={() => handleDeleteSaved(inv.id)} className="text-gray-300 hover:text-red-500 transition-colors" aria-label="Delete invoice">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
      /* ─── INVOICE BUILDER ─── */
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 sm:p-8">

        {/* Invoice Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="text-2xl font-black mb-1" style={{ color: '#0E2A82' }}>FRAOGO</div>
            <div className="text-xs text-gray-400 leading-relaxed">
              {company.legalName} · {company.rc}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-gray-200 mb-1">INVOICE</div>
            <input
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="text-right font-mono font-bold text-gray-700 border-b border-dashed border-gray-200 focus:outline-none focus:border-[#1B4AD4] bg-transparent w-40"
            />
          </div>
        </div>

        {/* Bill To + Date */}
        <div className="grid sm:grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Bill To</p>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client Name / Company"
              className="w-full text-base font-black text-gray-900 border-b border-dashed border-gray-200 pb-1 mb-2 focus:outline-none focus:border-[#1B4AD4] bg-transparent"
            />
            <input
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@email.com (needed to email)"
              className="w-full text-sm text-gray-500 border-b border-dashed border-gray-100 pb-1 focus:outline-none focus:border-[#1B4AD4] bg-transparent"
            />
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Invoice Date</p>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="text-sm font-semibold text-gray-700 border-b border-dashed border-gray-200 pb-1 focus:outline-none focus:border-[#1B4AD4] bg-transparent sm:text-right"
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full text-sm mb-6 min-w-[480px]">
          <thead>
            <tr style={{ background: '#EEF2FF' }}>
              <th className="text-left px-3 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide rounded-l-lg">Description</th>
              <th className="text-center px-3 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide w-16">Qty</th>
              <th className="text-right px-3 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide w-32">Unit Price</th>
              <th className="text-right px-3 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide w-32 rounded-r-lg">Total</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item, i) => (
              <tr key={i}>
                <td className="px-3 py-2.5">
                  <input value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="Item description"
                    className="w-full focus:outline-none bg-transparent text-gray-800" />
                </td>
                <td className="px-3 py-2.5">
                  <input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))}
                    className="w-full text-center focus:outline-none bg-transparent text-gray-800" />
                </td>
                <td className="px-3 py-2.5">
                  <input type="number" min={0} value={item.unitPrice} onChange={(e) => updateItem(i, 'unitPrice', Number(e.target.value))}
                    className="w-full text-right focus:outline-none bg-transparent text-gray-800" />
                </td>
                <td className="px-3 py-2.5 text-right font-semibold text-gray-900">{fmt(item.total)}</td>
                <td className="pl-2">
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <button onClick={addItem} className="flex items-center gap-1.5 text-xs font-semibold text-[#1B4AD4] hover:underline mb-8">
          <Plus className="w-3.5 h-3.5" /> Add Line Item
        </button>

        {/* Totals */}
        <div className="ml-auto max-w-xs space-y-2 border-t border-gray-100 pt-4 mb-10">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-900">{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-1">
              VAT (
              <input type="number" min={0} max={100} value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-10 text-center focus:outline-none bg-transparent text-gray-500" />
              %)
            </span>
            <span className="font-semibold text-gray-900">{fmt(tax)}</span>
          </div>
          <div className="flex justify-between text-base font-black border-t border-gray-200 pt-3 mt-3">
            <span style={{ color: '#0E2A82' }}>Grand Total</span>
            <span style={{ color: '#0E2A82' }}>{fmt(grandTotal)}</span>
          </div>
        </div>

        {/* Payment details */}
        <div className="grid sm:grid-cols-2 gap-8 border-t border-gray-100 pt-6">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Payment Details</p>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p><span className="text-gray-400">Bank:</span> {company.bank.bankName}</p>
              <p><span className="text-gray-400">Account Name:</span> {company.bank.accountName}</p>
              <p><span className="text-gray-400">Account No:</span> {company.bank.accountNumber}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Pencil className="w-3 h-3" /> Notes / Terms
            </p>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              className="w-full text-sm text-gray-600 resize-none border border-dashed border-gray-200 rounded-lg p-2 focus:outline-none focus:border-[#1B4AD4] bg-transparent" />
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
