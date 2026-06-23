# Fraogo Tasks

## CRITICAL - Fix Before Frontend Redesign

- [x] Logo done as SVG (public/logo/icon.svg + icon-white.svg, wordmark as live text) + favicon (app/icon.svg)
- [ ] Create public/og-image.jpg (1200x630)
- [x] Fix tracking endpoint - public lookup no longer returns customer name or email
- [x] Add admin password guard - login fails closed when no password is configured
- [ ] Replace in-memory rate limiter with Upstash Redis for multi-instance (needs Upstash account)

## URGENT - Security

.env.example exposed secrets on GitHub. Replace these IMMEDIATELY:

### Rotate (replace with new values from dashboards)
- [ ] SUPABASE_ANON_KEY - go to Supabase dashboard → Settings → API Keys, copy the new anon key
- [ ] SUPABASE_SERVICE_ROLE_KEY - Supabase dashboard → Settings → API Keys, copy the new service role key
- [ ] RESEND_API_KEY - go to Resend dashboard → API Keys, revoke old key and create new one
- [ ] DATABASE_URL - if password was exposed, change password in Supabase → Database → Password, then update DATABASE_URL connection string
- [ ] DIRECT_URL - same as DATABASE_URL but for direct pool connection

### Get (you don't have these yet)
- [ ] SUPABASE_URL - Supabase dashboard → Settings → API, copy Project URL (looks like https://abc123.supabase.co)
- [ ] NEXTAUTH_SECRET - generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
- [ ] EMAIL_FROM - set to your Resend verified domain sender (e.g. noreply@fraogo.com)

### Already set (verify these are correct)
- [ ] DATABASE_URL - check in .env, matches Supabase connection string
- [ ] DIRECT_URL - check in .env, matches Supabase direct connection string
- [ ] NEXTAUTH_URL - check in .env, should be http://localhost:3001 locally, https://fraogo.com on Vercel
- [ ] ADMIN_LOGIN_EMAIL - check in .env, your admin email
- [ ] ADMIN_EMAIL - check in .env, where to send customer messages (fraogo6@gmail.com)
- [ ] NEXT_PUBLIC_SITE_URL - check in .env, http://localhost:3001 locally, https://fraogo.com on Vercel

### Set password (after rotating secrets)
- [ ] Log in to admin page (http://localhost:3001/admin/login) with current password
- [ ] Go to /admin/settings and use the password form to change to something strong
- [ ] (Or if you can't log in yet: run npx tsx scripts/set-admin-password.ts "YourNewPassword")

## WARNINGS - Before Deploy

- [x] Replace as any type casts with Prisma.InputJsonValue
- [x] Add input length limits to text fields (.max in Zod)
- [x] Use crypto random for vendor magic-link tokens (256-bit)
- [x] Sanitize contact form subject line
- [x] Add email API key validation - sendEmail() now fails loudly if RESEND_API_KEY missing
- [x] Make vendor email required in schema - migration pushed to DB (0 vendors existed, no data risk)
- [x] Add pagination to all 8 admin list pages (20 per page, Previous/Next)

## Assets

Drop into public/

- [x] logo (SVG in public/logo/) + favicon (app/icon.svg)
- [ ] og-image.jpg (1200x630)
- [ ] hero-bg.jpg (1920x1080)
- [ ] cta-bg.jpg (1920x600)
- [ ] about-hero-bg.jpg (1920x600)
- [ ] services-hero-bg.jpg (1920x600)
- [ ] services/procurement.jpg, logistics.jpg, general.jpg (800x500)
- [ ] team/member-1.jpg, member-2.jpg, etc (400x400+)

## Content

Edit content/index.ts

- [ ] Add real team names, roles, bios (currently hidden)
- [ ] Verify contact details correct
- [ ] Check social media links valid
- [ ] Optional: add Google Maps embed URL

## Supabase

- [x] Schema synced with npx prisma db push
- [ ] Test vendor registration saves to DB
- [ ] Set up Storage policies: vendor-documents Private, vendor-portfolio Public
- [ ] Add SUPABASE_URL to .env

## Resend

- [ ] Create account, get API key
- [ ] Set RESEND_API_KEY in .env
- [ ] Verify fraogo.com domain
- [ ] Test emails send

## Vercel

- [ ] Add all env vars: DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, ADMIN_LOGIN_EMAIL, ADMIN_LOGIN_PASSWORD_HASH, RESEND_API_KEY, EMAIL_FROM, ADMIN_EMAIL, SUPABASE_URL, NEXT_PUBLIC_SITE_URL
- [ ] Set NEXT_PUBLIC_SITE_URL to your domain
- [ ] Point DNS to Vercel

## Optional

- [ ] Implement Paystack/Flutterwave payment gateway
- [ ] Add error logging to Sentry
- [ ] Tighten CSP headers with nonce
