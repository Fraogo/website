import Link from 'next/link'

/**
 * Prev/Next pager for admin list pages. Preserves other query params
 * (e.g. ?status=pending) when moving between pages.
 */
export default function Pagination({
  page,
  totalPages,
  basePath,
  query = {},
}: {
  page: number
  totalPages: number
  basePath: string
  query?: Record<string, string | undefined>
}) {
  if (totalPages <= 1) return null

  function hrefFor(p: number) {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(query)) {
      if (v) params.set(k, v)
    }
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  const prevDisabled = page <= 1
  const nextDisabled = page >= totalPages

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <Link
        href={hrefFor(page - 1)}
        aria-disabled={prevDisabled}
        tabIndex={prevDisabled ? -1 : undefined}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border border-border transition-colors ${
          prevDisabled ? 'opacity-40 pointer-events-none' : 'bg-white text-gray-600 hover:border-gray-400'
        }`}
      >
        ← Previous
      </Link>
      <span className="text-xs text-gray-400 font-medium">Page {page} of {totalPages}</span>
      <Link
        href={hrefFor(page + 1)}
        aria-disabled={nextDisabled}
        tabIndex={nextDisabled ? -1 : undefined}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border border-border transition-colors ${
          nextDisabled ? 'opacity-40 pointer-events-none' : 'bg-white text-gray-600 hover:border-gray-400'
        }`}
      >
        Next →
      </Link>
    </div>
  )
}
