'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Faq {
  question: string
  answer: string
}

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0) // first item open by default

  return (
    <div className="divide-y divide-gray-200 border-y border-gray-200">
      {faqs.map((faq, i) => {
        const isOpen = open === i
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group w-full flex items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-bold text-gray-900 text-[15px] sm:text-base group-hover:text-[#1B4AD4] transition-colors">
                {faq.question}
              </span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 flex-shrink-0 text-[#1B4AD4] transition-transform duration-300',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            {/* grid-rows trick = smooth height animation without measuring */}
            <div className={cn('grid transition-all duration-300 ease-out', isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]')}>
              <div className="overflow-hidden">
                <p className="text-sm text-gray-500 leading-relaxed pr-6 sm:pr-10">{faq.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
