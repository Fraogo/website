# Fraogo Tasks

Your checklist. Edit this file as you complete items.

Two kinds of tasks: in the code (mostly done) and outside (Supabase, Resend, Vercel, assets).

---

## URGENT - Security

These must be done first. The .env.example file exposed real secrets on GitHub.

- [ ] Rotate Supabase API keys (anon and service-role) in Supabase dashboard
- [ ] Rotate database password in Supabase dashboard
- [ ] Revoke and reissue Resend API key
- [ ] Change admin password using: `npx tsx scripts/set-admin-password.ts "YourNewPassword"`

---

## Development - Do Now

- [ ] Restart dev server with `npm run dev`
- [ ] Visit `http://localhost:3000/admin/login` and confirm login works
- [ ] Set up Supabase Storage policies:
      `vendor-documents` bucket = Private (admins use signed URLs)
      `vendor-portfolio` bucket = Public read, token-scoped uploads
- [ ] Add `SUPABASE_URL` to your local .env (needed for vendor dashboard)

---

## Assets to Add

Drop files into `public/` (site works without them, but looks unfinished).

- [ ] Logo: `public/logo/logo.png` and `public/logo/logo-white.png` (currently .jpeg, navbar shows text fallback)
- [ ] Favicon: `public/favicon.ico`
- [ ] Social share image: `public/og-image.jpg` (1200x630)
- [ ] Hero: `public/images/hero-bg.jpg` (1920x1080)
- [ ] CTA banner: `public/images/cta-bg.jpg` (1920x600)
- [ ] About header: `public/images/about-hero-bg.jpg` (1920x600)
- [ ] Services header: `public/images/services-hero-bg.jpg` (1920x600)
- [ ] Service photos (800x500): `public/images/services/procurement.jpg`, `logistics.jpg`, `general.jpg`
- [ ] Team photos (min 400x400 square): `public/team/member-1.jpg`, `member-2.jpg`, etc.

---

## Content - Edit `content/index.ts`

- [ ] Add real team member names, roles, and bios (currently hidden because names start with `[`)
- [ ] Confirm contact details: phone, email (fraogo6@gmail.com), address
- [ ] Add X social link: https://x.com/fraogo92031
- [ ] Check all social media links point to real accounts
- [ ] Optionally add Google Maps embed URL for contact page

---

## Supabase Setup

- [ ] Confirm database is synced: `npx prisma db push` has been run
- [ ] Test vendor registration: vendor data saves to DB
- [ ] Test vendor approval: magic link email sends and dashboard loads when clicked
- [ ] Keep database password safe (in .env only, never committed)

---

## Resend Email Setup

- [ ] Create Resend account, get API key
- [ ] Set `RESEND_API_KEY` in .env
- [ ] Verify `fraogo.com` domain in Resend (must be your own domain, not Gmail)
- [ ] Test order/contact emails send to ADMIN_EMAIL

---

## Vercel Deployment

When ready to go live:

- [ ] Add all env vars to Vercel: DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, ADMIN_LOGIN_EMAIL, ADMIN_LOGIN_PASSWORD_HASH, RESEND_API_KEY, EMAIL_FROM, ADMIN_EMAIL, SUPABASE_URL, NEXT_PUBLIC_SITE_URL
- [ ] Set NEXT_PUBLIC_SITE_URL to your live domain (e.g. https://fraogo.com)
- [ ] Point fraogo.com DNS to Vercel

---

## Optional Hardening (Not Urgent)

- [ ] Move admin login rate limiter from in-memory to Upstash Redis for multi-instance protection
- [ ] Use crypto.randomUUID() instead of cuid() for vendor magic-link tokens
- [ ] Tighten Content-Security-Policy to use nonce-based scripts instead of inline
