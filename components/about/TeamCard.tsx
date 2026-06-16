'use client'

import { useState } from 'react'

interface TeamMember {
  name: string
  role: string
  bio: string
  image: string
  linkedin?: string
}

export default function TeamCard({ member }: { member: TeamMember }) {
  const [imgError, setImgError] = useState(false)

  const initials = member.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100 card-hover text-center group">
      {/* Photo / Initials fallback */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        {imgError ? (
          <div
            className="w-full h-full flex items-center justify-center text-white text-3xl font-black"
            style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}
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
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-tight">{member.name}</h3>
        <p className="text-xs font-semibold mt-0.5 mb-2" style={{ color: '#1B4AD4' }}>{member.role}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-gray-400 hover:text-[#1B4AD4] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        )}
      </div>
    </div>
  )
}
