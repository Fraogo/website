// Branded full-area loading state: a spinning brand-blue ring around the
// pulsing Fraogo mark. Server-safe (no hooks/events) so it works in loading.tsx.
export default function PageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5">
      <div className="relative w-16 h-16">
        {/* spinning ring */}
        <span
          className="absolute inset-0 rounded-full border-[3px] animate-spin"
          style={{ borderColor: '#EEF2FF', borderTopColor: '#1B4AD4' }}
        />
        {/* pulsing logo mark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/icon.svg"
          alt=""
          className="absolute inset-0 m-auto h-7 w-auto animate-pulse"
        />
      </div>
      <p className="text-sm font-semibold tracking-wide text-gray-400">{label}…</p>
    </div>
  )
}
