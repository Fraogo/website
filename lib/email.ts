import { Resend } from 'resend'

// A placeholder key lets `next build` import this module (e.g. for static
// analysis) without a real Resend account configured. Actual sends are
// blocked below if the real key was never provided.
const RESEND_API_KEY = process.env.RESEND_API_KEY
const resend = new Resend(RESEND_API_KEY || 're_dummy_key_for_build')

const FROM = process.env.EMAIL_FROM ?? 'FRAOGO <noreply@fraogo.com>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'fraogo6@gmail.com'
const ADMIN_EMAIL_CC = process.env.ADMIN_EMAIL_CC

// Customer-facing confirmations are scheduled to arrive a short while after the
// submission, while admin notifications stay immediate. Resend accepts natural
// language ('in 1 hour') or an ISO timestamp. Set to '' to send instantly.
const CUSTOMER_EMAIL_DELAY = 'in 1 hour'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  cc?: string
  attachments?: { filename: string; content: string }[]
  scheduledAt?: string
}

export async function sendEmail({ to, subject, html, cc, attachments, scheduledAt }: SendEmailOptions) {
  if (!RESEND_API_KEY) {
    console.error(`[Email Error] RESEND_API_KEY is not set — email NOT sent. Subject: "${subject}"`)
    return { success: false, error: 'RESEND_API_KEY is not configured' }
  }
  try {
    const result = await resend.emails.send({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      cc: cc ? [cc] : undefined,
      subject,
      html,
      attachments,
      scheduledAt: scheduledAt || undefined,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('[Email Error]', error)
    return { success: false, error }
  }
}

// ─── Invoice ──────────────────────────────────────────────────────────────────

// Emails a generated invoice to the client with the PDF attached.
export async function sendInvoiceEmail({
  to,
  invoiceNumber,
  clientName,
  grandTotal,
  pdfBase64,
}: {
  to: string
  invoiceNumber: string
  clientName: string
  grandTotal: string
  pdfBase64: string
}) {
  const html = emailLayout(`
    <h2 style="color:#0E2A82;margin:0 0 12px">Invoice ${invoiceNumber}</h2>
    <p style="margin:0 0 12px">Hello ${clientName},</p>
    <p style="margin:0 0 12px">Please find your invoice <strong>${invoiceNumber}</strong> attached as a PDF.</p>
    <p style="font-size:18px;font-weight:800;color:#0E2A82;margin:0 0 16px">Total due: ${grandTotal}</p>
    <p style="color:#6b7280;font-size:14px;margin:0">The payment details are included on the attached invoice. Thank you for your business.</p>
  `)

  return sendEmail({
    to,
    subject: `Invoice ${invoiceNumber} from FRAOGO`,
    html,
    attachments: [{ filename: `${invoiceNumber}.pdf`, content: pdfBase64 }],
  })
}

// ─── Admin ────────────────────────────────────────────────────────────────────

// Sends a one-time password-reset code to the admin's own inbox (ADMIN_EMAIL).
// The code itself is only ever stored hashed; this is the only place it appears.
export async function sendAdminPasswordResetCode({ code }: { code: string }) {
  const html = emailLayout(`
    <h2 style="color:#0E2A82">Admin Password Reset</h2>
    <p>A request was made to reset your FRAOGO admin password. Enter the code below to set a new password. It expires in <strong>15 minutes</strong>.</p>
    <div style="text-align:center;margin:28px 0">
      <span style="display:inline-block;font-size:34px;letter-spacing:10px;font-weight:800;color:#0E2A82;background:#EEF2FF;padding:16px 28px;border-radius:10px">${code}</span>
    </div>
    <p style="color:#6b7280;font-size:14px">If you didn't request this, you can safely ignore this email — your password will not change.</p>
  `)

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: 'FRAOGO — Admin password reset code',
    html,
  })
}

// ─── Procurement ──────────────────────────────────────────────────────────────

export async function sendProcurementConfirmation(order: {
  customerName: string
  customerEmail: string
  customerPhone: string
  type: string
  items: Array<{
    name: string
    specification: string
    quantity: number
    deliveryMode: string
    deliveryAddress?: string
  }>
}) {
  const itemRows = order.items
    .map(
      (item, i) => `
      <tr style="background:${i % 2 === 0 ? '#f9fafb' : '#ffffff'}">
        <td style="padding:10px 12px;border:1px solid #e5e7eb">${item.name}</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb">${item.specification}</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;text-align:center">${item.quantity}</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb">${item.deliveryMode}${item.deliveryAddress ? ` — ${item.deliveryAddress}` : ''}</td>
      </tr>`
    )
    .join('')

  const html = emailLayout(`
    <h2 style="color:#0E2A82;margin-bottom:8px">We've received your order!</h2>
    <p style="color:#374151;margin-bottom:24px">Hi <strong>${order.customerName}</strong>, thank you for placing an order with FRAOGO. Our team will review your request and contact you within <strong>24–48 hours</strong> to discuss next steps.</p>
    
    <div style="background:#EEF2FF;border-left:4px solid #0E2A82;padding:16px;margin-bottom:24px;border-radius:4px">
      <p style="margin:0;font-size:14px;color:#0E2A82"><strong>Order Type:</strong> ${order.type === 'nigeria' ? '🇳🇬 Nigeria Order' : '🌍 International Order'}</p>
      <p style="margin:4px 0 0;font-size:14px;color:#0E2A82"><strong>Contact:</strong> ${order.customerPhone}</p>
    </div>

    <h3 style="color:#0E2A82;margin-bottom:12px">Order Summary</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
      <thead>
        <tr style="background:#0E2A82;color:#ffffff">
          <th style="padding:10px 12px;text-align:left;border:1px solid #0E2A82">Item Name</th>
          <th style="padding:10px 12px;text-align:left;border:1px solid #0E2A82">Specification</th>
          <th style="padding:10px 12px;text-align:center;border:1px solid #0E2A82">Qty</th>
          <th style="padding:10px 12px;text-align:left;border:1px solid #0E2A82">Delivery Mode</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <p style="color:#6b7280;font-size:14px">If you have any questions, reply to this email or call us at ${process.env.FRAOGO_PHONE ?? 'our contact number'}.</p>
  `)

  await sendEmail({
    to: order.customerEmail,
    subject: 'FRAOGO — We\'ve received your order ✅',
    html,
    scheduledAt: CUSTOMER_EMAIL_DELAY,
  })

  // Admin notification
  const adminHtml = emailLayout(`
    <h2 style="color:#0E2A82">New Procurement Order</h2>
    <p><strong>Customer:</strong> ${order.customerName}<br>
    <strong>Email:</strong> ${order.customerEmail}<br>
    <strong>Phone:</strong> ${order.customerPhone}<br>
    <strong>Type:</strong> ${order.type}</p>
    <h3 style="color:#0E2A82">Items</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <thead>
        <tr style="background:#0E2A82;color:#fff">
          <th style="padding:8px;border:1px solid #0E2A82;text-align:left">Item</th>
          <th style="padding:8px;border:1px solid #0E2A82;text-align:left">Spec</th>
          <th style="padding:8px;border:1px solid #0E2A82">Qty</th>
          <th style="padding:8px;border:1px solid #0E2A82;text-align:left">Delivery</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
  `)

  await sendEmail({
    to: ADMIN_EMAIL,
    cc: ADMIN_EMAIL_CC,
    subject: `[FRAOGO] New Procurement Order — ${order.customerName}`,
    html: adminHtml,
  })
}

// ─── Delivery ─────────────────────────────────────────────────────────────────

export async function sendDeliveryConfirmation(req: {
  senderName: string
  senderEmail: string
  senderPhone: string
  type: string
  itemDescription: string
  itemWeight: number
  weightUnit: string
  destination: string
  receiverName: string
  receiverContact: string
}) {
  const html = emailLayout(`
    <h2 style="color:#0E2A82">Delivery Request Received</h2>
    <p>Hi <strong>${req.senderName}</strong>, we've received your delivery request. Our team will reach out shortly.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">
      <tbody>
        ${detailRow('Type', req.type === 'local' ? 'Local Delivery' : 'International Delivery')}
        ${detailRow('Item Description', req.itemDescription)}
        ${detailRow('Weight', `${req.itemWeight} ${req.weightUnit}`)}
        ${detailRow('Destination', req.destination)}
        ${detailRow('Receiver', req.receiverName)}
        ${detailRow('Receiver Contact', req.receiverContact)}
      </tbody>
    </table>
    <div style="background:#fef3c7;border-left:4px solid #C9A84C;padding:12px;margin-top:20px;border-radius:4px">
      <p style="margin:0;font-size:13px;color:#92400e">⚠️ Receiver must come with a valid means of identification upon collection.</p>
    </div>
  `)

  await sendEmail({ to: req.senderEmail, subject: 'FRAOGO — Delivery Request Received', html, scheduledAt: CUSTOMER_EMAIL_DELAY })
  await sendEmail({
    to: ADMIN_EMAIL,
    cc: ADMIN_EMAIL_CC,
    subject: `[FRAOGO] New Delivery Request — ${req.senderName}`,
    html: emailLayout(`
      <h2 style="color:#0E2A82">New Delivery Request</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tbody>
          ${detailRow('Sender', `${req.senderName} — ${req.senderEmail} — ${req.senderPhone}`)}
          ${detailRow('Type', req.type)}
          ${detailRow('Item', req.itemDescription)}
          ${detailRow('Weight', `${req.itemWeight} ${req.weightUnit}`)}
          ${detailRow('Destination', req.destination)}
          ${detailRow('Receiver', `${req.receiverName} — ${req.receiverContact}`)}
        </tbody>
      </table>
    `),
  })
}

// ─── Relocation ───────────────────────────────────────────────────────────────

export async function sendRelocationConfirmation(req: {
  customerName: string
  customerEmail: string
  customerPhone: string
  pickupLocation: string
  destination: string
  itemsList: string
  itemDescription: string
  transportBy: string
}) {
  const html = emailLayout(`
    <h2 style="color:#0E2A82">Relocation Request Received</h2>
    <p>Hi <strong>${req.customerName}</strong>, we've received your relocation request.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">
      <tbody>
        ${detailRow('Pick-up Location', req.pickupLocation)}
        ${detailRow('Destination', req.destination)}
        ${detailRow('Items to Move', req.itemsList)}
        ${detailRow('Description', req.itemDescription)}
        ${detailRow('Transport', req.transportBy === 'fraogo' ? 'FRAOGO provides transport' : 'Customer arranges transport')}
      </tbody>
    </table>
    <p style="margin-top:16px;color:#6b7280;font-size:14px">Our team will contact you within 24–48 hours to confirm details and provide a quote.</p>
  `)

  await sendEmail({ to: req.customerEmail, subject: 'FRAOGO — Relocation Request Received', html, scheduledAt: CUSTOMER_EMAIL_DELAY })
  await sendEmail({
    to: ADMIN_EMAIL,
    cc: ADMIN_EMAIL_CC,
    subject: `[FRAOGO] New Relocation Request — ${req.customerName}`,
    html: emailLayout(`
      <h2 style="color:#0E2A82">New Relocation Request</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tbody>
          ${detailRow('Customer', `${req.customerName} — ${req.customerEmail} — ${req.customerPhone}`)}
          ${detailRow('Pick-up', req.pickupLocation)}
          ${detailRow('Destination', req.destination)}
          ${detailRow('Items', req.itemsList)}
          ${detailRow('Description', req.itemDescription)}
          ${detailRow('Transport', req.transportBy)}
        </tbody>
      </table>
    `),
  })
}

// ─── Vendor Registration ──────────────────────────────────────────────────────

export async function sendVendorRegistrationConfirmation(vendor: {
  businessName: string
  email: string
  businessType: string
  location: string
}) {
  const html = emailLayout(`
    <h2 style="color:#0E2A82">Vendor Application Received</h2>
    <p>Hi <strong>${vendor.businessName}</strong>, thank you for applying to join the FRAOGO vendor network.</p>
    <p>Your application is currently <strong>under review</strong>. We'll notify you once it's been approved, which typically takes 1–3 business days.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">
      <tbody>
        ${detailRow('Business Name', vendor.businessName)}
        ${detailRow('Service Type', vendor.businessType)}
        ${detailRow('Location', vendor.location)}
      </tbody>
    </table>
    <div style="background:#EEF2FF;border-left:4px solid #0E2A82;padding:16px;margin-top:20px;border-radius:4px">
      <p style="margin:0;font-size:13px;color:#0E2A82">By joining FRAOGO, you agreed that FRAOGO takes 10% of the total bargain as a service fee, and that you will not negotiate with customers directly outside the FRAOGO platform.</p>
    </div>
  `)

  await sendEmail({
    to: vendor.email,
    subject: 'FRAOGO — Vendor Application Received',
    html,
    scheduledAt: CUSTOMER_EMAIL_DELAY,
  })
}

export async function sendVendorAdminNotification(vendor: {
  businessName: string
  email: string
  businessType: string
  location: string
  phone: string
}) {
  const html = emailLayout(`
    <h2 style="color:#0E2A82">New Vendor Application</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tbody>
        ${detailRow('Business Name', vendor.businessName)}
        ${detailRow('Email', vendor.email)}
        ${detailRow('Phone', vendor.phone)}
        ${detailRow('Service Type', vendor.businessType)}
        ${detailRow('Location', vendor.location)}
      </tbody>
    </table>
    <p style="margin-top:16px"><a href="${process.env.NEXTAUTH_URL}/admin/vendors" style="background:#0E2A82;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;display:inline-block">Review in Admin Panel</a></p>
  `)

  await sendEmail({
    to: ADMIN_EMAIL,
    cc: ADMIN_EMAIL_CC,
    subject: `[FRAOGO] New Vendor Application — ${vendor.businessName}`,
    html,
  })
}

export async function sendVendorApprovalWithMagicLink(vendor: {
  businessName: string
  email: string
  magicLinkUrl: string
  profileUrl?: string
}) {
  const html = emailLayout(`
    <h2 style="color:#0E2A82">Your Application Has Been Approved! 🎉</h2>
    <p>Hi <strong>${vendor.businessName}</strong>, congratulations! Your vendor application has been approved by FRAOGO.</p>
    <p>You can now access your vendor dashboard to upload images that customers will see when browsing vendors.</p>
    <p style="margin:24px 0;text-align:center">
      <a href="${vendor.magicLinkUrl}" style="background:#0E2A82;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;display:inline-block;font-size:16px;font-weight:600">Access My Dashboard</a>
    </p>
    ${vendor.profileUrl ? `
    <div style="background:#EEF2FF;border-left:4px solid #0E2A82;padding:16px;border-radius:4px;margin-bottom:16px">
      <p style="margin:0 0 6px;font-size:13px;color:#0E2A82"><strong>Your shareable profile link</strong> — share it anywhere to get customers:</p>
      <p style="margin:0;font-size:13px"><a href="${vendor.profileUrl}" style="color:#1B4AD4">${vendor.profileUrl}</a></p>
    </div>` : ''}
    <div style="background:#fef3c7;border-left:4px solid #C9A84C;padding:12px;border-radius:4px">
      <p style="margin:0;font-size:13px;color:#92400e">⚠️ The dashboard link expires in 7 days. If it expires, contact us to get a new one.</p>
    </div>
  `)

  await sendEmail({
    to: vendor.email,
    subject: 'FRAOGO — Your Vendor Application is Approved! 🎉',
    html,
  })
}

export async function sendVendorRejectionEmail(vendor: {
  businessName: string
  email: string
}) {
  const html = emailLayout(`
    <h2 style="color:#0E2A82">Update on Your Vendor Application</h2>
    <p>Hi <strong>${vendor.businessName}</strong>, thank you for your interest in joining the FRAOGO vendor network.</p>
    <p>After reviewing your application, we're unable to approve it at this time. This isn't necessarily permanent — you're welcome to reach out or apply again in the future with updated details.</p>
    <p style="color:#6b7280;font-size:14px">If you have any questions, just reply to this email and our team will assist you.</p>
  `)

  await sendEmail({
    to: vendor.email,
    subject: 'FRAOGO — Update on Your Vendor Application',
    html,
  })
}

// ─── Vendor Request ───────────────────────────────────────────────────────────

// FRAOGO mediates every vendor request — the vendor is never emailed directly
// here. Only admin is notified; staff relay it to the vendor themselves
// (see the WhatsApp/Email/Call buttons on /admin/vendor-requests).
export async function sendVendorRequestAdminNotification(data: {
  vendorBusinessName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  eventDate?: Date
  description: string
  budget?: string
}) {
  await sendEmail({
    to: ADMIN_EMAIL,
    cc: ADMIN_EMAIL_CC,
    subject: `[FRAOGO] New Vendor Request — ${data.customerName} → ${data.vendorBusinessName}`,
    html: emailLayout(`
      <h2 style="color:#0E2A82">New Vendor Request</h2>
      <p><strong>${data.customerName}</strong> wants to hire <strong>${data.vendorBusinessName}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:8px">
        <tbody>
          ${detailRow('Customer Email', data.customerEmail)}
          ${detailRow('Customer Phone', data.customerPhone)}
          ${data.eventDate ? detailRow('Event Date', new Date(data.eventDate).toLocaleDateString('en-NG', { dateStyle: 'full' })) : ''}
          ${detailRow('Description', data.description)}
          ${data.budget ? detailRow('Budget', data.budget) : ''}
        </tbody>
      </table>
    `),
  })
}

export async function sendVendorRequestCustomerAck(data: {
  customerName: string
  customerEmail: string
  vendorBusinessName: string
}) {
  const html = emailLayout(`
    <h2 style="color:#0E2A82">Request Sent Successfully ✅</h2>
    <p>Hi <strong>${data.customerName}</strong>, your request has been sent to <strong>${data.vendorBusinessName}</strong>.</p>
    <p>FRAOGO will facilitate the connection and our team will reach out to you shortly to confirm the arrangement.</p>
    <div style="background:#fef3c7;border-left:4px solid #C9A84C;padding:12px;border-radius:4px;margin-top:16px">
      <p style="margin:0;font-size:13px;color:#92400e">Remember: All transactions are mediated through FRAOGO. Do not make direct payments to vendors outside the FRAOGO platform.</p>
    </div>
  `)

  await sendEmail({
    to: data.customerEmail,
    subject: `FRAOGO — Your Request to ${data.vendorBusinessName} Has Been Sent`,
    html,
    scheduledAt: CUSTOMER_EMAIL_DELAY,
  })
}

// ─── Supply Order ─────────────────────────────────────────────────────────────

export async function sendSupplyOrderConfirmation(order: {
  customerName: string
  customerEmail: string
  customerPhone: string
  destination: string
  preferredDate: Date
  items: Array<{ name: string; quantity: number; unit: string }>
}) {
  const itemRows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 12px;border:1px solid #e5e7eb">${item.name}</td>
      <td style="padding:8px 12px;border:1px solid #e5e7eb;text-align:center">${item.quantity}</td>
      <td style="padding:8px 12px;border:1px solid #e5e7eb">${item.unit}</td>
    </tr>`
    )
    .join('')

  const html = emailLayout(`
    <h2 style="color:#0E2A82">Supply Order Received ✅</h2>
    <p>Hi <strong>${order.customerName}</strong>, we've received your supply order.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px;margin-bottom:16px">
      <thead>
        <tr style="background:#0E2A82;color:#fff">
          <th style="padding:8px 12px;text-align:left;border:1px solid #0E2A82">Item</th>
          <th style="padding:8px 12px;text-align:center;border:1px solid #0E2A82">Qty</th>
          <th style="padding:8px 12px;text-align:left;border:1px solid #0E2A82">Unit</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    ${detailRow('Delivery Address', order.destination)}
    ${detailRow('Preferred Date', new Date(order.preferredDate).toLocaleDateString('en-NG', { dateStyle: 'full' }))}
    <p style="margin-top:16px;color:#6b7280;font-size:14px">Our team will contact you to confirm your order and arrange payment.</p>
  `)

  await sendEmail({ to: order.customerEmail, subject: 'FRAOGO — Supply Order Received', html, scheduledAt: CUSTOMER_EMAIL_DELAY })
  await sendEmail({
    to: ADMIN_EMAIL,
    cc: ADMIN_EMAIL_CC,
    subject: `[FRAOGO] New Supply Order — ${order.customerName}`,
    html: emailLayout(`
      <h2 style="color:#0E2A82">New Supply Order</h2>
      <p><strong>Customer:</strong> ${order.customerName} — ${order.customerEmail} — ${order.customerPhone}</p>
      <p><strong>Destination:</strong> ${order.destination}</p>
      <p><strong>Preferred Date:</strong> ${new Date(order.preferredDate).toLocaleDateString('en-NG', { dateStyle: 'full' })}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="background:#0E2A82;color:#fff">
            <th style="padding:8px;text-align:left;border:1px solid #0E2A82">Item</th>
            <th style="padding:8px;text-align:center;border:1px solid #0E2A82">Qty</th>
            <th style="padding:8px;text-align:left;border:1px solid #0E2A82">Unit</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
    `),
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detailRow(label: string, value: string) {
  return `
  <tr>
    <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;width:35%;color:#374151;white-space:nowrap">${label}</td>
    <td style="padding:8px 12px;border:1px solid #e5e7eb;color:#111827">${value}</td>
  </tr>`
}

function emailLayout(content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05)">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0E2A82 0%,#1B4AD4 100%);padding:32px 40px;text-align:center">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px">FRAOGO</h1>
              <p style="margin:6px 0 0;color:#93B4F8;font-size:13px">Procurement · Logistics · General Service</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center">
                FRAOGO · ${process.env.FRAOGO_ADDRESS ?? 'Nigeria'} · ${process.env.FRAOGO_PHONE ?? ''}<br>
                ${process.env.FRAOGO_RC_NUMBER ? `RC: ${process.env.FRAOGO_RC_NUMBER}` : ''}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
