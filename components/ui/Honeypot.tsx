// Hidden anti-bot field. Visually removed (not display:none, which naive bots
// skip) and hidden from real users via off-screen positioning + aria-hidden +
// tabIndex/autoComplete off. If it gets a value, the submitter is a bot.
export default function Honeypot({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
      <label>
        Company website
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  )
}
