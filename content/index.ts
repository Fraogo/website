/**
 * FRAOGO SITE CONTENT
 * ===================
 * Edit this file to update text, images, and info across the website.
 * No coding knowledge required — just update the values between the quotes.
 *
 * Fields marked [UPDATE] need your attention.
 * Fields marked [OPTIONAL] can be left blank if not available.
 *
 * After editing, save the file and the website will automatically reflect the changes.
 */

// ─── COMPANY INFORMATION ─────────────────────────────────────────────────────

export const company = {
  name: 'Fraogo',
  legalName: 'Fraogo Limited',                   // [UPDATE] Your registered company name
  tagline: 'Procurement · Logistics · General Services',
  shortDescription: "Nigeria's trusted partner for procurement, freight, and business services.",
  longDescription: `Fraogo is a Nigerian company built to simplify how businesses and individuals
source products, move goods, and access quality services. We handle the complexity —
you focus on what matters.`,
  rc: 'RC 0000000',                              // [UPDATE] Your CAC registration number
  founded: '2024',                               // [UPDATE] Year the company was founded

  heroHeadline: 'Your Business,\nDelivered.',
  heroSubtext:
    'From sourcing products globally to transporting goods across Nigeria and beyond — Fraogo handles everything so you can focus on growing your business.',

  stats: [
    { value: '500+', label: 'Orders Fulfilled' },
    { value: '50+',  label: 'Active Vendors'   },
    { value: '24h',  label: 'Response Time'    },
  ],
}

// ─── CONTACT INFORMATION ─────────────────────────────────────────────────────

export const contact = {
  address:  '[YOUR BUSINESS ADDRESS HERE]',      // [UPDATE] e.g. "12 Example Close, Garki, Abuja, FCT, Nigeria"
  phone:    '[YOUR PHONE NUMBER]',               // [UPDATE] e.g. "+234 803 000 0000"
  phone2:   '',                                  // [OPTIONAL] Second phone number
  email:    'info@fraogo.com',                   // [UPDATE] if different from info@fraogo.com
  whatsapp: '[WHATSAPP_NUMBER_DIGITS_ONLY]',     // [UPDATE] digits only, no spaces: e.g. "2348030000000"

  // Google Maps embed URL:
  // 1. Open Google Maps → find your business location
  // 2. Click "Share" → "Embed a map" → copy only the URL inside src="..."
  // 3. Paste it below between the quotes
  googleMapsEmbedUrl: '',                        // [UPDATE] Paste Google Maps embed URL here

  social: {
    instagram: 'https://instagram.com/fraogo',   // [UPDATE]
    facebook:  'https://facebook.com/fraogo',    // [UPDATE]
    twitter:   'https://x.com/fraogo',           // [UPDATE]
    linkedin:  'https://linkedin.com/company/fraogo', // [UPDATE]
  },
}

// ─── TEAM MEMBERS ─────────────────────────────────────────────────────────────
//
// PHOTOS: Save square images (minimum 400×400px) as:
//   member-1.jpg, member-2.jpg, member-3.jpg, member-4.jpg, member-5.jpg
//   inside the  public/team/  folder.
//
// TIP: Crop photos to a square before saving for best results.

export const team: {
  name: string
  role: string
  bio: string
  image: string
  linkedin?: string
}[] = [
  {
    name:     '[TEAM MEMBER 1 FULL NAME]',       // [UPDATE]
    role:     'Chief Executive Officer',          // [UPDATE]
    bio:      '[Short bio — 1–2 sentences about their background and role at Fraogo.]', // [UPDATE]
    image:    '/team/member-1.jpg',
    linkedin: '',                                 // [OPTIONAL]
  },
  {
    name:     '[TEAM MEMBER 2 FULL NAME]',
    role:     '[ROLE TITLE]',
    bio:      '[Short bio here.]',
    image:    '/team/member-2.jpg',
    linkedin: '',
  },
  {
    name:     '[TEAM MEMBER 3 FULL NAME]',
    role:     '[ROLE TITLE]',
    bio:      '[Short bio here.]',
    image:    '/team/member-3.jpg',
    linkedin: '',
  },
  {
    name:     '[TEAM MEMBER 4 FULL NAME]',
    role:     '[ROLE TITLE]',
    bio:      '[Short bio here.]',
    image:    '/team/member-4.jpg',
    linkedin: '',
  },
  {
    name:     '[TEAM MEMBER 5 FULL NAME]',
    role:     '[ROLE TITLE]',
    bio:      '[Short bio here.]',
    image:    '/team/member-5.jpg',
    linkedin: '',
  },
]

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────

export const about = {
  // Write your brand story here. 2–3 paragraphs work best.
  // Use \n\n to start a new paragraph.
  story: `[YOUR BRAND STORY HERE. Answer these questions: Why was Fraogo founded? What problem does it solve? Who does it serve? What makes it different from competitors?

Write 2–3 paragraphs. This is the most important text on your About page — be honest, specific, and speak directly to a business owner.]`,

  mission: '[YOUR MISSION STATEMENT — one sentence describing what Fraogo exists to do.]',
  vision:  '[YOUR VISION STATEMENT — one sentence describing where Fraogo is headed in the next 5–10 years.]',

  values: [
    {
      title:       'Reliability',
      description: 'Every order is tracked and followed through. We maintain full accountability from placement to delivery.',
    },
    {
      title:       'Transparency',
      description: 'We keep our clients informed at every step. No surprises, no hidden fees — just honest communication.',
    },
    {
      title:       'Integrity',
      description: 'We do what we say we will do. Our reputation is built on keeping our word to every client and partner.',
    },
    {
      title:       'Excellence',
      description: "We don't settle for average. Every request is handled with speed, care, and professionalism.",
    },
  ],
}
