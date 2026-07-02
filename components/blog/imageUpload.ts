import { uploadBlogImageAction } from '@/app/actions/blog'

function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1] ?? '')
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Resize + re-encode in the browser BEFORE sending to the Server Action. Raw
// photos are often several MB, and as base64 they blow past the Server Action
// body limit (→ 413). Downscaling the longest side to 1600px as JPEG typically
// yields <500KB, which uploads reliably and also saves storage/bandwidth.
// Animated GIFs / SVG / other types are passed through untouched.
async function toUploadPayload(file: File): Promise<{ base64: string; filename: string }> {
  const isRaster = /^image\/(jpeg|png|webp)$/.test(file.type)
  if (!isRaster) return { base64: await fileToBase64(file), filename: file.name }

  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve(r.result as string)
      r.onerror = reject
      r.readAsDataURL(file)
    })
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new window.Image()
      i.onload = () => resolve(i)
      i.onerror = reject
      i.src = dataUrl
    })

    const scale = Math.min(1, 1600 / Math.max(img.width, img.height))
    const w = Math.max(1, Math.round(img.width * scale))
    const h = Math.max(1, Math.round(img.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return { base64: await fileToBase64(file), filename: file.name }
    ctx.drawImage(img, 0, 0, w, h)

    const base64 = canvas.toDataURL('image/jpeg', 0.82).split(',')[1] ?? ''
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
    return { base64, filename: `${baseName}.jpg` }
  } catch {
    return { base64: await fileToBase64(file), filename: file.name }
  }
}

// Returns an uploader for RichTextEditor / cover fields. Pass a writer token on
// the public /write page; omit it in the admin panel (uses the admin session).
export function makeImageUploader(token?: string) {
  return async (file: File): Promise<string> => {
    const { base64, filename } = await toUploadPayload(file)
    const res = await uploadBlogImageAction({ base64, filename, token })
    if (!res.success || !('url' in res) || !res.url) {
      throw new Error(typeof res.error === 'string' ? res.error : 'Upload failed')
    }
    return res.url
  }
}
