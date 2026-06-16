'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { submitProcurementOrder } from '@/app/actions/procurement'
import { Trash2, Plus, ShoppingCart, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function CartPage() {
  const router = useRouter()
  const { orderType, customerInfo, items, removeItem, clearCart } = useCartStore()
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Safe hydration check for React 19
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && (!customerInfo || items.length === 0)) {
      router.replace('/procurement/nigeria')
    }
  }, [mounted, customerInfo, items.length, router])

  if (!mounted || !customerInfo || items.length === 0) return null

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitProcurementOrder({
        type: orderType ?? 'nigeria',
        customerName: customerInfo.fullName,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        items: items.map((item) => ({
          name: item.name,
          specification: item.specification,
          quantity: item.quantity,
          deliveryMode: item.deliveryMode,
          deliveryAddress: item.deliveryAddress,
        })),
      })

      if (result.success) {
        clearCart()
        router.push(`/procurement/success?ref=${result.orderId}`)
      } else {
        setError(typeof result.error === 'string' ? result.error : 'Something went wrong. Please try again.')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
      setShowModal(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      {/* Header */}
      <div className="page-header">
        <div className="section-container pt-8">
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#1B4AD4' }}>
            Procurement
          </p>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            Order Preview
          </h1>
          <p className="text-white/70">Review your items before submitting</p>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
            <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>i</span>
              Customer Information
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">Name</div>
                <div className="font-semibold">{customerInfo.fullName}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">Email</div>
                <div className="font-semibold">{customerInfo.email}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">Phone</div>
                <div className="font-semibold">{customerInfo.phone}</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <span className={cn(
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold',
                orderType === 'nigeria' ? 'bg-blue-100 text-blue-800' : 'bg-blue-100 text-blue-800'
              )}>
                {orderType === 'nigeria' ? '🇳🇬 Nigeria Order' : '🌍 International Order'}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-2xl shadow-soft border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-foreground">Order Items ({items.length})</h2>
              <Link
                href={orderType === 'nigeria' ? '/procurement/nigeria' : '/procurement/international'}
                className="flex items-center gap-1.5 text-sm font-semibold hover:underline"
                style={{ color: '#0E2A82' }}
              >
                <Plus className="w-4 h-4" />
                Add More Items
              </Link>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-8">#</th>
                    <th>Item Name</th>
                    <th>Specification</th>
                    <th className="text-center">Qty</th>
                    <th>Delivery Mode</th>
                    <th className="text-center">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={item.id}>
                      <td className="text-center text-muted-foreground text-xs">{i + 1}</td>
                      <td className="font-medium">{item.name}</td>
                      <td className="text-sm text-muted-foreground max-w-48 truncate" title={item.specification}>{item.specification}</td>
                      <td className="text-center font-bold">{item.quantity}</td>
                      <td>
                        <div>
                          <span className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold',
                            item.deliveryMode === 'pickup' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                          )}>
                            {item.deliveryMode === 'pickup' ? 'Pick Up' : 'Dispatch'}
                          </span>
                          {item.deliveryMode === 'dispatch' && item.deliveryAddress && (
                            <p className="text-xs text-muted-foreground mt-1 max-w-32 truncate" title={item.deliveryAddress}>
                              {item.deliveryAddress}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border">
              {items.map((item, i) => (
                <div key={item.id} className="p-4 relative">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="text-xs text-muted-foreground mb-1">Item #{i + 1}</div>
                  <div className="font-bold text-foreground">{item.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{item.specification}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm font-semibold">Qty: {item.quantity}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded font-semibold', item.deliveryMode === 'pickup' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700')}>
                      {item.deliveryMode === 'pickup' ? 'Pick Up' : 'Dispatch'}
                    </span>
                  </div>
                  {item.deliveryMode === 'dispatch' && item.deliveryAddress && (
                    <div className="text-xs text-muted-foreground mt-1">📍 {item.deliveryAddress}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={orderType === 'nigeria' ? '/procurement/nigeria' : '/procurement/international'}
              className="btn-outline-green flex-1 text-center py-4 rounded-2xl"
            >
              ← Edit Order
            </Link>
            <button
              onClick={() => setShowModal(true)}
              disabled={items.length === 0}
              className="btn-primary flex-1 py-4 rounded-2xl text-base disabled:opacity-60 disabled:cursor-not-allowed"
              id="submit-order-btn"
            >
              Submit Order
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-elevated animate-scale-in">
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#f0fdf4' }}>
                <ShoppingCart className="w-7 h-7" style={{ color: '#0E2A82' }} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Confirm Order Submission</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to submit this order? Our team will contact you within 24–48 hours.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary flex-1 py-3 rounded-xl text-sm disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                    Yes, Submit
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

