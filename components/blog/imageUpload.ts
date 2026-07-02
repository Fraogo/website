import { uploadBlogImageAction } from '@/app/actions/blog'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1] ?? '')
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Returns an uploader for RichTextEditor / cover fields. Pass a writer token on
// the public /write page; omit it in the admin panel (uses the admin session).
export function makeImageUploader(token?: string) {
  return async (file: File): Promise<string> => {
    const base64 = await fileToBase64(file)
    const res = await uploadBlogImageAction({ base64, filename: file.name, token })
    if (!res.success || !('url' in res) || !res.url) {
      throw new Error(typeof res.error === 'string' ? res.error : 'Upload failed')
    }
    return res.url
  }
}
