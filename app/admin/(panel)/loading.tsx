import { Skeleton } from '@/components/ui/skeleton'

// Shimmer placeholder while admin pages fetch their data.
export default function AdminLoading() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* header */}
      <div className="flex items-center gap-3 mb-8">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* list rows */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
