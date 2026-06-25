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

  // ── Bank / payment details (shown on invoices) ─────────────────────────────
  // Fill in your real business account so clients know where to pay.
  bank: {
    bankName:      '[YOUR BANK NAME]',
    accountName:   'Fraogo Limited',
    accountNumber: '[YOUR ACCOUNT NUMBER]',
  },

  // ── Homepage hero ──────────────────────────────────────────────────────────
  // The headline is shown as stacked lines; the last line is highlighted.
  // Edit the text here and the homepage updates automatically.
  heroEyebrow: 'Ikeja, Lagos · Nigeria',
  heroHeadlineLines: ['Procurement.', 'Logistics.'],
  heroHeadlineAccent: 'General Services.',
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

  // Google Maps: the contact page auto-generates a map from `address` above.
  // To pin an exact spot instead, open Google Maps → Share → "Embed a map",
  // copy the src="..." URL from the iframe, and paste it here (it overrides the auto map).
  googleMapsEmbedUrl: '',

  social: {
    instagram: 'https://instagram.com/fraogo',
    facebook:  'https://facebook.com/fraogo',
    twitter:   'https://x.com/fraogo92031',
    linkedin:  'https://linkedin.com/company/fraogo',
    tiktok:    'https://www.tiktok.com/@fraogo_services',
  },
}

// ─── FREQUENTLY ASKED QUESTIONS ───────────────────────────────────────────────
// Shown on the Contact page. Add, edit, or remove questions freely.

export const faqs: { question: string; answer: string }[] = [
  {
    question: 'How do I place an order or request?',
    answer:
      'Pick the service you need — Procurement, Logistics, or General Services — and fill in the short form. Our team reviews it and contacts you within 24–48 hours to confirm the details and next steps.',
  },
  {
    question: 'Do I have to pay upfront?',
    answer:
      'No. Submitting a request is free and commits you to nothing. We confirm the details and pricing with you first, then proceed once you approve.',
  },
  {
    question: 'How long does it take to hear back?',
    answer:
      'We respond to every request within 24–48 hours. Actual sourcing or delivery timelines depend on the service and route involved, which we confirm when we reach out.',
  },
  {
    question: 'Where do you operate?',
    answer:
      'We are based in Ikeja, Lagos and work across Nigeria. For procurement and logistics we also handle international sourcing and shipping.',
  },
  {
    question: 'How do I track my order?',
    answer:
      'Once your order is confirmed we give you a reference number. Enter it on the Track page to see real-time status and updates.',
  },
  {
    question: 'Are your vendors verified?',
    answer:
      'Yes. Vendors are vetted before they join our network, and every booking is mediated through Fraogo for your protection — payments and arrangements should always go through us.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Pricing depends on your specific request, and we confirm a clear quote before anything moves. For vendor hires, Fraogo charges a 10% service fee on the agreed amount.',
  },
]

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
    name:     'Franklin Obuke',
    role:     'Team Lead',
    bio:      "Obuke Franklin is an Industrial Maintenance Engineer, Operations Analyst, and Energy Performance Analyst with over 7 years of combined experience spanning industrial maintenance, operations analysis, procurement, and energy optimization. He possesses strong expertise in operational efficiency, preventive and corrective maintenance, data analysis, and energy management solutions for organizations seeking improved performance and cost reduction. Currently serving as an Operations Analyst at Starsight Energy since 2022, Franklin has played a key role in managing maintenance operations across over 600 sites, coordinating OEM support, monitoring diesel consumption trends, improving site visibility, and analyzing PV injection and operational performance data. His analytical expertise enables him to identify inefficiencies and provide practical, data-driven solutions that improve energy utilization and operational reliability for organizations. Prior to this role, he worked with FrieslandCampina WAMCO Nigeria PLC as a Maintenance Engineer Trainee from 2018 to 2019, where he was involved in preventive and corrective maintenance of industrial production equipment, machine lubrication systems, and maintenance planning. He also gained hands-on fabrication and industrial field experience as a Welder/Fitter Trainee at Dorman Long Engineering Limited in 2017. Franklin is also the Team Lead of FRAOGO VENTURE, a procurement and sourcing organization focused on delivering reliable procurement solutions, industrial sourcing, equipment supply, maintenance support, and operational services to businesses across multiple sectors. Franklin combines technical expertise with advanced analytical skills to help organizations optimize operations, reduce energy waste, and improve overall business performance. He is certified in Six Sigma, Power BI, Sustainability Management, and Project Management, with strong proficiency in Microsoft Excel, ERP systems, CRM systems, and data analytics tools.",
    image:    '/team/member-1.jpg',
    linkedin: '',
  },
  {
    name:     'Olamide Soyobi',
    role:     'Social Media & Communications Lead',
    bio:      'Soyobi Favour Olamide is a Mass Communication graduate with a strong passion for digital communication and brand storytelling. As a skilled social media manager, she specializes in content strategy, audience engagement, and online brand growth. With a blend of creativity and communication expertise, she helps brands build meaningful connections and maintain a compelling digital presence.',
    image:    '/team/member-2.jpg',
    linkedin: '',
  },
  {
    name:     'Marvellous Adepoju',
    role:     'IT Specialist',
    bio:      'Marvellous Adepoju is a Software Developer and System Architect, he specializes in developing Software solutions for businesses and individuals He also focuses on building and maintaining automation systems for businesses, meeting their technological needs, while currently undergoing his bachelor\'s of Engineering programme in Computer Engineering ',
    image:    '/team/member-3.jpg',
    linkedin: '',
  },
]

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────

export const about = {
  story: `Fraogo was founded in 2025 after its founders witnessed firsthand how difficult it was for Nigerian businesses and individuals to reliably source products, coordinate shipments, and access quality service providers. Too many people were losing money to unreliable suppliers, delayed logistics, or vendors who simply didn't show up — and there was no single trusted partner to turn to.

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
