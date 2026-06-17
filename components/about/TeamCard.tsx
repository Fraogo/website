'use client'

import { useState } from 'react'

interface TeamMember {
  name: string
  role: string
  bio: string
  image: string
  linkedin?: string
}

function LinkedInLink({ href, className = '' }: { href: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#1B4AD4] transition-colors ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
      LinkedIn
    </a>
  )
}

export default function TeamCard({ member, featured = false }: { member: TeamMember; featured?: boolean }) {
  const [imgError, setImgError] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const initials = member.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  // Collapse long bios behind a "Read more" toggle (works on every screen size)
  const limit = featured ? 320 : 150
  const isLong = member.bio.length > limit
  const bioText = !isLong || expanded ? member.bio : member.bio.slice(0, limit).trimEnd() + '…'

  const Photo = (
    imgError ? (
      <div
        className="w-full h-full flex items-center justify-center text-white font-black"
        style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)', fontSize: featured ? '3rem' : '1.875rem' }}
      >
        {initials}
      </div>
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={() => setImgError(true)}
      />
    )
  )

  const ReadMoreBtn = isLong ? (
    <button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      className="mt-2 text-xs font-bold text-[#1B4AD4] hover:underline"
    >
      {expanded ? 'Show less' : 'Read more'}
    </button>
  ) : null

  // ── Featured (team lead) — larger, photo beside bio on desktop ───────────────
  if (featured) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100 group md:flex">
        <div className="relative md:w-72 lg:w-80 flex-shrink-0 aspect-[4/3] md:aspect-auto bg-gray-100 overflow-hidden">
          {Photo}
        </div>
        <div className="p-6 lg:p-8 flex-1">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#1B4AD4] bg-[#EEF2FF] px-2.5 py-1 rounded-full mb-3">
            Team Lead
          </span>
          <h3 className="font-black text-gray-900 text-xl lg:text-2xl leading-tight">{member.name}</h3>
          <p className="text-sm font-semibold mt-1 mb-4" style={{ color: '#1B4AD4' }}>{member.role}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{bioText}</p>
          {ReadMoreBtn}
          {member.linkedin && <div className="mt-4"><LinkedInLink href={member.linkedin} /></div>}
        </div>
      </div>
    )
  }

  // ── Default card ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100 card-hover group flex flex-col">
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        {Photo}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-tight">{member.name}</h3>
        <p className="text-xs font-semibold mt-0.5 mb-2" style={{ color: '#1B4AD4' }}>{member.role}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{bioText}</p>
        {ReadMoreBtn}
        {member.linkedin && <div className="mt-3"><LinkedInLink href={member.linkedin} /></div>}
      </div>
    </div>
  )
}
