'use client'

import { useState } from 'react'
import { Link2, Check, Share2, MessageCircle } from 'lucide-react'
import { TwitterIcon, FacebookIcon } from '@/components/ui/social-icons'

// Share row for a blog post. Uses the native share sheet on mobile when
// available, plus explicit WhatsApp / X / Facebook links and copy-to-clipboard.
export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  function url() {
    return typeof window !== 'undefined' ? window.location.href : ''
  }

  function copy() {
    navigator.clipboard.writeText(url()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function nativeShare() {
    if (navigator.share) {
      try { await navigator.share({ title, url: url() }) } catch { /* cancelled */ }
    } else {
      copy()
    }
  }

  const enc = (s: string) => encodeURIComponent(s)
  const wa = `https://wa.me/?text=${enc(`${title} ${url()}`)}`
  const x = `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url())}`
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${enc(url())}`

  const linkClass =
    'w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 border border-gray-200 hover:text-[#1B4AD4] hover:border-[#1B4AD4] transition-colors'

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1">Share</span>
      <button onClick={nativeShare} className={linkClass} aria-label="Share">
        <Share2 className="w-4 h-4" />
      </button>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label="Share on WhatsApp">
        <MessageCircle className="w-4 h-4" />
      </a>
      <a href={x} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label="Share on X">
        <TwitterIcon />
      </a>
      <a href={fb} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label="Share on Facebook">
        <FacebookIcon />
      </a>
      <button onClick={copy} className={linkClass} aria-label="Copy link">
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  )
}
