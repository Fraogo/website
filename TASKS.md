# Fraogo Tasks

## CRITICAL - Fix Before Frontend Redesign

- [ ] Rename logo files from .jpeg to .png (public/logo/logo.png, logo-white.png)
- [ ] Create public/og-image.jpg (1200x630)
- [ ] Fix tracking endpoint - add auth check to lookupTracking() or mask customer data
- [ ] Add ADMIN_LOGIN_PASSWORD_HASH validation - throw error if empty in production
- [ ] Replace in-memory rate limiter with Upstash Redis for multi-instance

## URGENT - Security

.env.example exposed secrets on GitHub

- [ ] Rotate Supabase API keys (anon and service-role)
- [ ] Rotate database password
- [ ] Revoke and reissue Resend API key
- [ ] Run npx tsx scripts/set-admin-password.ts "YourNewPassword"

## WARNINGS - Before Deploy

- [ ] Replace 14+ as any type casts with proper types
- [ ] Add input length limits to text fields (.max(5000) in Zod)
- [ ] Use crypto.randomUUID() for vendor magic-link tokens
- [ ] Add email API key validation at build time
- [ ] Make vendor email required in schema
- [ ] Sanitize contact form subject line
- [ ] Add pagination to admin list queries (.take(50).skip())

## Assets

Drop into public/

- [ ] logo.png, logo-white.png
- [ ] favicon.ico
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

- [ ] Run npx prisma db push
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
