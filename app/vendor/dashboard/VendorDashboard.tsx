'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Upload, Trash2, Loader2 } from 'lucide-react'
import { addVendorImage, deleteVendorImageAction } from '@/app/actions/vendorPortfolio'
import { supabaseClient, VENDOR_PORTFOLIO_BUCKET } from '@/lib/storage'

interface VendorImage { id: string; url: string }
interface Vendor {
  id: string
  businessName: string
  description: string
  location: string
  businessType: string
  portfolioImages: VendorImage[]
}

export default function VendorDashboard({ token, vendor }: { token: string; vendor: Vendor }) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setError(null)
    setUploading(true)
    try {
      for (const file of files) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          setError('Only JPG, PNG, or WebP images are allowed.')
          continue
        }
        if (file.size > 5 * 1024 * 1024) {
          setError('Each image must be under 5MB.')
          continue
        }
        const ext = file.name.split('.').pop()
        const path = `${vendor.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: upErr } = await supabaseClient.storage
          .from(VENDOR_PORTFOLIO_BUCKET)
          .upload(path, file, { contentType: file.type })
        if (upErr) {
          console.error('[VendorDashboard] upload:', upErr)
          setError('Upload failed — please try again.')
          continue
        }
        const { data } = supabaseClient.storage.from(VENDOR_PORTFOLIO_BUCKET).getPublicUrl(path)
        const res = await addVendorImage(token, data.publicUrl, file.name)
        if (!res.success) setError(res.error ?? 'Could not save image.')
      }
      router.refresh()
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleDelete(imageId: string) {
    if (!confirm('Remove this image from your portfolio?')) return
    const res = await deleteVendorImageAction(token, imageId)
    if (res.success) router.refresh()
    else setError(res.error ?? 'Could not delete image.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-header">
        <div className="section-container pt-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-2 text-blue-300">Vendor Dashboard</p>
          <h1 className="text-3xl lg:text-4xl font-black mb-1">{vendor.businessName}</h1>
          <p className="text-white/65 text-sm">{vendor.businessType} · {vendor.location}</p>
        </div>
      </div>

      <div className="section-container py-10 max-w-4xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-1">Portfolio Images</h2>
          <p className="text-sm text-gray-400 mb-4">
            Show customers your work. JPG, PNG or WebP, up to 5MB each (max 50 images). {vendor.portfolioImages.length}/50 used.
          </p>
          <label className="inline-flex items-center gap-2 cursor-pointer btn-primary px-5 py-3 rounded-xl text-sm">
            {uploading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
              : <><Upload className="w-4 h-4" /> Upload Images</>}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="sr-only"
              onChange={handleFiles}
              disabled={uploading || vendor.portfolioImages.length >= 50}
            />
          </label>
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </div>

        {vendor.portfolioImages.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-soft text-sm text-gray-400">
            No images yet — upload your first above.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {vendor.portfolioImages.map((img) => (
              <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                <Image src={img.url} alt="" fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Delete image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
