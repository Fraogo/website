'use client'

// Catches errors thrown by the root layout itself. It replaces the entire
// document, so it must render its own <html>/<body> and can't rely on
// globals.css being applied — styles are inline on purpose.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0E2A82 0%, #070F2B 100%)',
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
            Something went wrong
          </h1>
          <p style={{ opacity: 0.65, margin: '0 0 1.5rem', fontSize: '0.9rem' }}>
            A critical error occurred. Please try again.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: '#fff',
              color: '#1B4AD4',
              border: 'none',
              padding: '0.7rem 1.4rem',
              borderRadius: '0.6rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
