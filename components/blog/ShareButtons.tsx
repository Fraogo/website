'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { WhatsAppIcon, TwitterIcon, FacebookIcon } from '@/components/ui/social-icons'

// Share row for a blog post: WhatsApp, X, Facebook, and copy-link.
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

  const enc = (s: string) => encodeURIComponent(s)
  const wa = `https://wa.me/?text=${enc(`${title} ${url()}`)}`
  const x = `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url())}`
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${enc(url())}`

  const btn =
    'w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 border border-gray-200 hover:text-[#1B4AD4] hover:border-[#1B4AD4] transition-colors'

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1">Share</span>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Share on WhatsApp" title="WhatsApp">
        <WhatsAppIcon />
      </a>
      <a href={x} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Share on X" title="X (Twitter)">
        <TwitterIcon />
      </a>
      <a href={fb} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Share on Facebook" title="Facebook">
        <FacebookIcon />
      </a>
      <button onClick={copy} className={btn} aria-label="Copy link" title="Copy link">
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  )
}
