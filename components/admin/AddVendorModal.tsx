'use client'

import { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { createAdminVendor } from '@/app/actions/vendor'
import { KNOWN_CATEGORIES } from '@/lib/categories'
import { useRouter } from 'next/navigation'

export default function AddVendorModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    businessName: '',
    email: 'contact@fraogo.com',
    phone: '+234 802 822 9002',
    location: 'Ikeja, Lagos, Nigeria',
    businessType: 'Solar & Energy',
    description: '',
    imageUrl: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await createAdminVendor(form)
      if (res.success) {
        setOpen(false)
        setForm({
          businessName: '',
          email: 'contact@fraogo.com',
          phone: '+234 802 822 9002',
          location: 'Ikeja, Lagos, Nigeria',
          businessType: 'Solar & Energy',
          description: '',
          imageUrl: '',
        })
        router.refresh()
      } else {
        setError(res.error ?? 'Error creating vendor listing.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E2A82] text-white text-xs font-bold shadow-sm hover:bg-[#1B4AD4] transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Vendor / Product Listing
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-gray-900 mb-1">Add Vendor / Product Listing</h2>
            <p className="text-xs text-gray-500 mb-5">
              Create an active vendor profile or product listing that will immediately appear in the public marketplace.
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Listing / Business Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fraogo Solar - 5kVA Hybrid Inverter Kit"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B4AD4] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category / Type *</label>
                  <select
                    value={form.businessType}
                    onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B4AD4] focus:outline-none"
                  >
                    {KNOWN_CATEGORIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="Other">Other Category</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B4AD4] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B4AD4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Product Description, Specs & Pricing Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="List items, specifications, pricing (e.g. ₦650,000), and warranty info..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B4AD4] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0E2A82] text-white font-semibold hover:bg-[#1B4AD4] disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
