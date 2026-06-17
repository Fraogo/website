'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, FileText, Download, Printer } from 'lucide-react'
import { saveInvoice, getNextInvoiceNumber } from '@/app/actions/invoice'

interface LineItem {
  name: string
  quantity: number
  unitPrice: number
  total: number
}

const TAX_RATE = 7.5 // VAT in Nigeria

export default function InvoicePage() {
  const router = useRouter()
  const printRef = useRef<HTMLDivElement>(null)

  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [taxRate, setTaxRate] = useState(TAX_RATE)
  const [items, setItems] = useState<LineItem[]>([
    { name: '', quantity: 1, unitPrice: 0, total: 0 },
  ])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getNextInvoiceNumber().then(setInvoiceNumber)
  }, [])

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

  function handlePrint() {
    window.print()
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
            <FileText className="w-5 h-5" style={{ color: '#1B4AD4' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Invoice Generator</h1>
            <p className="text-sm text-gray-400">Create and save client invoices</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Invoice'}
          </button>
          <button
            onClick={handlePrint}
            className="btn-outline px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print / PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 print:hidden">
          {error}
        </div>
      )}

      {/* Invoice Document */}
      <div ref={printRef} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-8 print:shadow-none print:border-none print:rounded-none">

        {/* Invoice Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="text-2xl font-black mb-1" style={{ color: '#0E2A82' }}>FRAOGO</div>
            <div className="text-xs text-gray-400 leading-relaxed">
              Professional Procurement, Logistics &amp; Services<br />
              Nigeria
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-gray-200 mb-1">INVOICE</div>
            <div className="text-sm font-mono font-bold text-gray-700">
              <input
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="text-right font-mono font-bold text-gray-700 border-b border-dashed border-gray-200 focus:outline-none focus:border-[#1B4AD4] bg-transparent w-40 print:border-none"
              />
            </div>
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
              className="w-full text-base font-black text-gray-900 border-b border-dashed border-gray-200 pb-1 mb-2 focus:outline-none focus:border-[#1B4AD4] bg-transparent print:border-none"
            />
            <input
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@email.com (optional)"
              className="w-full text-sm text-gray-500 border-b border-dashed border-gray-100 pb-1 focus:outline-none focus:border-[#1B4AD4] bg-transparent print:border-none"
            />
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Invoice Date</p>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="text-sm font-semibold text-gray-700 border-b border-dashed border-gray-200 pb-1 focus:outline-none focus:border-[#1B4AD4] bg-transparent sm:text-right print:border-none"
            />
          </div>
        </div>

        {/* Line Items */}
        <table className="w-full text-sm mb-6">
          <thead>
            <tr style={{ background: '#EEF2FF' }}>
              <th className="text-left px-3 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide rounded-l-lg">Description</th>
              <th className="text-center px-3 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide w-16">Qty</th>
              <th className="text-right px-3 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide w-32">Unit Price</th>
              <th className="text-right px-3 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide w-32 rounded-r-lg">Total</th>
              <th className="w-8 print:hidden" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item, i) => (
              <tr key={i}>
                <td className="px-3 py-2.5">
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(i, 'name', e.target.value)}
                    placeholder="Item description"
                    className="w-full focus:outline-none bg-transparent text-gray-800"
                  />
                </td>
                <td className="px-3 py-2.5">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))}
                    className="w-full text-center focus:outline-none bg-transparent text-gray-800"
                  />
                </td>
                <td className="px-3 py-2.5">
                  <input
                    type="number"
                    min={0}
                    value={item.unitPrice}
                    onChange={(e) => updateItem(i, 'unitPrice', Number(e.target.value))}
                    className="w-full text-right focus:outline-none bg-transparent text-gray-800"
                  />
                </td>
                <td className="px-3 py-2.5 text-right font-semibold text-gray-900">
                  {fmt(item.total)}
                </td>
                <td className="pl-2 print:hidden">
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

        {/* Add item button */}
        <button
          onClick={addItem}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#1B4AD4] hover:underline mb-8 print:hidden"
        >
          <Plus className="w-3.5 h-3.5" /> Add Line Item
        </button>

        {/* Totals */}
        <div className="ml-auto max-w-xs space-y-2 border-t border-gray-100 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-900">{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-1">
              VAT (
              <input
                type="number"
                min={0}
                max={100}
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-10 text-center focus:outline-none bg-transparent text-gray-500 print:border-none"
              />
              %)
            </span>
            <span className="font-semibold text-gray-900">{fmt(tax)}</span>
          </div>
          <div className="flex justify-between text-base font-black border-t border-gray-200 pt-3 mt-3">
            <span style={{ color: '#0E2A82' }}>Grand Total</span>
            <span style={{ color: '#0E2A82' }}>{fmt(grandTotal)}</span>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-10 pt-6 border-t border-gray-100 text-xs text-gray-400 text-center">
          Thank you for your business · Payment due within 7 days · FRAOGO
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body > * { display: none !important; }
          #__next > * { display: none !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  )
}
