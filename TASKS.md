# Fraogo Tasks

## SECURITY — DO FIRST: rotate the leaked secrets

The old `.env.example` exposed real keys on GitHub. Until they are rotated, anyone
who saw them can read/write your database + storage and send email as you. For each:
rotate it, update it in **Vercel** (Project → Settings → Environment Variables) and
in your local `.env`, then redeploy.

- [ ] SUPABASE anon + service_role keys — Supabase → Settings → API. Rotate both
      (or Settings → API → JWT Secret → "Generate new secret" to invalidate both at
      once), then copy the new values into SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY
- [ ] Database password — Supabase → Settings → Database → Reset database password,
      then update the password portion of DATABASE_URL and DIRECT_URL
- [ ] RESEND_API_KEY — Resend → API Keys → delete the exposed key, create a new one
- [ ] After rotating, update every value in Vercel env vars + local `.env`, then redeploy
- [ ] Admin password — sign in at /admin/login, then /admin/settings → change it
      (or run: `npx tsx scripts/set-admin-password.ts "YourNewPassword"`)

## Resend (required for customer + invoice emails)

- [ ] Verify the fraogo.com domain in Resend (add the DNS records it shows). Without
      this, customer emails and "Email to Client" won't deliver on the free tier.
- [ ] Confirm EMAIL_FROM uses the verified domain (e.g. noreply@fraogo.com)
- [ ] Test: submit a form / email an invoice and confirm it arrives

## Supabase storage

- [ ] Confirm buckets exist: vendor-portfolio (Public), vendor-documents (Private)
- [ ] Confirm the vendor-portfolio insert policy is applied (browser uploads)
- [ ] Test a vendor registration + portfolio image upload end to end

## Vercel

- [ ] Verify all env vars present — especially SUPABASE_SERVICE_ROLE_KEY + SUPABASE_ANON_KEY,
      NEXTAUTH_SECRET, and NEXTAUTH_URL set to your live domain
- [ ] Point DNS to Vercel

## Assets (drop into public/)

- [ ] og-image.jpg (1200x630)
- [ ] images/hero-bg.jpg (1920x1080)
- [ ] images/cta-bg.jpg (1920x600)
- [ ] images/about-hero-bg.jpg (1920x600)
- [ ] images/services-hero-bg.jpg (1920x600)
- [ ] images/services/procurement.jpg, logistics.jpg, general.jpg (800x500)
- [ ] team/member-1.jpg, member-2.jpg, ... (square, 400x400+)

## Content (edit content/index.ts)

- [ ] Add real team names, roles, bios (currently hidden until filled)
- [ ] Verify contact details + social links
- [ ] Optional: add Google Maps embed URL

## Optional / later

- [ ] Honeypot field on public forms (extra bot filter on top of rate limiting)
- [ ] Upstash Redis for cross-instance rate limiting (free tier)
- [ ] Paystack/Flutterwave payment gateway
- [ ] Sentry error logging
- [ ] Tighten CSP with a nonce (remove script-src 'unsafe-inline')
