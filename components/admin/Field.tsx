/** A labelled read-only field for admin detail cards. Renders nothing if empty. */
export default function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm text-gray-800 break-words">{value}</p>
    </div>
  )
}
