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

  const [form, setForm] = useState<{
    businessName: string
    email: string
    phone: string
    location: string
    businessType: string
    listingType: 'product' | 'service'
    price: string
    priceRange: string
    description: string
    imageUrl: string
    variants: Array<{ name: string; price: string; description: string }>
  }>({
    businessName: '',
    email: 'contact@fraogo.com',
    phone: '+234 802 822 9002',
    location: 'Ikeja, Lagos, Nigeria',
    businessType: 'Solar & Energy',
    listingType: 'product',
    price: '',
    priceRange: '',
    description: '',
    imageUrl: '',
    variants: [],
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await createAdminVendor(form, imageFiles)
      if (res.success) {
        setOpen(false)
        setForm({
          businessName: '',
          email: 'contact@fraogo.com',
          phone: '+234 802 822 9002',
          location: 'Ikeja, Lagos, Nigeria',
          businessType: 'Solar & Energy',
          listingType: 'product',
          price: '',
          priceRange: '',
          description: '',
          imageUrl: '',
          variants: [],
        })
        setImageFiles([])
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
                  <label className="block font-semibold text-gray-700 mb-1">Listing Type *</label>
                  <select
                    value={form.listingType}
                    onChange={(e) => setForm({ ...form, listingType: e.target.value as 'product' | 'service' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B4AD4] focus:outline-none"
                  >
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price {form.listingType === 'product' ? '*' : '(Optional)'}</label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. ₦650,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B4AD4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price Range</label>
                  <input
                    type="text"
                    value={form.priceRange}
                    onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
                    placeholder="e.g. ₦50,000 - ₦120,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B4AD4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Image files (Optional, up to 3)</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? [])
                      setImageFiles(files.slice(0, 3))
                      if (files.length > 3) {
                        setError('Only the first 3 images will be used.')
                      }
                    }}
                    className="w-full text-xs text-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload up to 3 images for the listing gallery.
                  </p>
                  {imageFiles.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected files: {imageFiles.map((file) => file.name).join(', ')}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Or image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B4AD4] focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Provide a URL if you do not want to upload a file.</p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Product/Service Description & Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="List specifications, pricing details, and warranty info..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B4AD4] focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-700">Variants & Pricing Tiers (optional)</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({
                        ...form,
                        variants: [...form.variants, { name: '', price: '', description: '' }],
                      })
                    }}
                    className="text-xs font-semibold text-[#0E2A82] hover:text-[#1B4AD4]"
                  >
                    + Add variant
                  </button>
                </div>

                  {form.variants.length === 0 && (
                    <p className="text-xs text-gray-500">Add variants for different sizes, colors, or price packages for this product.</p>
                  )}

                  {form.variants.map((variant, index) => (
                    <div key={index} className="space-y-2 rounded-2xl border border-gray-200 p-3 bg-slate-50">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-gray-700">Variant {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => setForm({
                            ...form,
                            variants: form.variants.filter((_, idx) => idx !== index),
                          })}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={variant.name}
                          placeholder="Variant name (e.g. Red, 2-pack)"
                          onChange={(e) => {
                            const updated = [...form.variants]
                            updated[index] = { ...updated[index], name: e.target.value }
                            setForm({ ...form, variants: updated })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B4AD4] focus:outline-none"
                        />
                        <input
                          type="text"
                          value={variant.price}
                          placeholder="Price (optional)"
                          onChange={(e) => {
                            const updated = [...form.variants]
                            updated[index] = { ...updated[index], price: e.target.value }
                            setForm({ ...form, variants: updated })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B4AD4] focus:outline-none"
                        />
                        <input
                          type="text"
                          value={variant.description}
                          placeholder="Short description (optional)"
                          onChange={(e) => {
                            const updated = [...form.variants]
                            updated[index] = { ...updated[index], description: e.target.value }
                            setForm({ ...form, variants: updated })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B4AD4] focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
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
