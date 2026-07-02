'use client'

import { useEffect, useState } from 'react'

// Thin bar at the very top that fills as the reader scrolls the article.
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement
      const scrollable = el.scrollHeight - el.clientHeight
      setProgress(scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent">
      <div
        className="h-full transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#1B4AD4,#2A5EE8)' }}
      />
    </div>
  )
}
