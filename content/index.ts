/**
 * FRAOGO SITE CONTENT
 * ===================
 * Edit this file to update text, images, and info across the website.
 * No coding knowledge required — just update the values between the quotes.
 *
 * After editing, save the file and the website will automatically reflect the changes.
 */

// ─── COMPANY INFORMATION ─────────────────────────────────────────────────────

export const company = {
  name: 'Fraogo',
  legalName: 'Fraogo Limited',
  tagline: 'Procurement · Logistics · General Services',
  shortDescription: 'Procurement, freight, and business services for Nigerian businesses and individuals.',
  longDescription: `Fraogo is a Nigerian company built to simplify how businesses and individuals
source products, move goods, and access quality services. We handle the complexity —
you focus on what matters.`,
  rc: 'RC8967311',
  founded: '2024',

  // ── Homepage hero ──────────────────────────────────────────────────────────
  // The headline is shown as stacked lines; the last line is highlighted.
  // Edit the text here and the homepage updates automatically.
  heroEyebrow: 'Ikeja, Lagos · Nigeria',
  heroHeadlineLines: ['Procurement.', 'Logistics.', 'General Services —'],
  heroHeadlineAccent: 'Done in Nigeria.',
  heroSubtext:
    'From sourcing products globally to transporting goods across Nigeria — Fraogo handles the complexity so you can focus on your business.',

  // Leave stats as an empty array — fake numbers hurt trust more than no numbers
  stats: [] as { value: string; label: string }[],
}

// ─── CONTACT INFORMATION ─────────────────────────────────────────────────────

export const contact = {
  address:  'Plot 35b, Abisogun Leigh str, Ikeja, Lagos-State, Nigeria',
  phone:    '+234 802 822 9002',
  phone2:   '',
  email:    'fraogo6@gmail.com',
  whatsapp: '2348028229002',

  // Google Maps embed URL — paste the URL from the Google Maps "Embed a map" dialog
  googleMapsEmbedUrl: '',

  social: {
    instagram: 'https://instagram.com/fraogo',
    facebook:  'https://facebook.com/fraogo',
    twitter:   'https://x.com/fraogo',
    linkedin:  'https://linkedin.com/company/fraogo',
  },
}

// ─── TEAM MEMBERS ─────────────────────────────────────────────────────────────
//
// PHOTOS: Save square images (minimum 400×400px) as:
//   member-1.jpg, member-2.jpg, member-3.jpg ...
//   inside the  public/team/  folder.
//
// Members with a name starting with "[" are automatically hidden from the website.
// Fill in real names when you're ready and they'll appear automatically.

export const team: {
  name: string
  role: string
  bio: string
  image: string
  linkedin?: string
}[] = [
  {
    name:     '[TEAM MEMBER 1 FULL NAME]',
    role:     'Chief Executive Officer',
    bio:      '[Short bio — 1–2 sentences about their background and role at Fraogo.]',
    image:    '/team/member-1.jpg',
    linkedin: '',
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
]

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────

export const about = {
  story: `Fraogo was founded in 2024 after its founders witnessed firsthand how difficult it was for Nigerian businesses and individuals to reliably source products, coordinate shipments, and access quality service providers. Too many people were losing money to unreliable suppliers, delayed logistics, or vendors who simply didn't show up — and there was no single trusted partner to turn to.

We built Fraogo to change that. Headquartered in Ikeja, Lagos, and registered with the Corporate Affairs Commission (RC8967311), we bring together procurement, logistics, and general services under one roof. Whether you need to import goods from abroad, ship cargo within Nigeria, or hire a vetted vendor for an upcoming project, Fraogo handles the complexity so you can focus on what matters most.

Our model is simple: you submit your request, we confirm the details within 24 hours, and we execute with full accountability from start to finish. No chasing suppliers. No hidden fees. No guessing where your order is. Just results — delivered.`,

  mission: 'To make procurement, logistics, and service access simple, reliable, and transparent for every Nigerian business and individual.',

  vision: 'To become Nigeria\'s most trusted multi-service platform — connecting businesses and individuals to quality products, freight solutions, and verified service providers across the country and beyond.',

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
