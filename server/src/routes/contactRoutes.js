// routes/contact.js
import express from 'express';
import { Resend } from 'resend';

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  try {
    // 1. Notify YOU (the business) about the new message
    await resend.emails.send({
      from: 'CarRental Contact <onboarding@resend.dev>', // replace with your verified domain
      to: process.env.CONTACT_RECEIVER_EMAIL,            // your business email in .env
      subject: `[Contact Form] ${subject} — from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;">
          <div style="background:#2563eb;padding:24px 32px;border-radius:10px 10px 0 0;">
            <h2 style="color:#fff;margin:0;font-size:20px;">New Contact Message</h2>
          </div>
          <div style="background:#fff;padding:28px 32px;border-radius:0 0 10px 10px;border:1px solid #e2e8f0;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;color:#64748b;width:110px;">Name</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;color:#2563eb;"><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Phone</td><td style="padding:8px 0;color:#1e293b;">${phone || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Subject</td><td style="padding:8px 0;color:#1e293b;">${subject}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
            <p style="color:#64748b;font-size:13px;margin:0 0 8px;">Message:</p>
            <p style="color:#1e293b;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="text-align:center;color:#94a3b8;font-size:11px;margin-top:20px;">CarRental · Contact Form</p>
        </div>
      `,
    });

    // 2. Send a confirmation email to the user
    await resend.emails.send({
      from: 'CarRental <onboarding@resend.dev>', // replace with your verified domain
      to: email,
      subject: 'We received your message — CarRental',
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;">
          <div style="background:#2563eb;padding:24px 32px;border-radius:10px 10px 0 0;">
            <h2 style="color:#fff;margin:0;font-size:20px;">Thanks, ${name}!</h2>
          </div>
          <div style="background:#fff;padding:28px 32px;border-radius:0 0 10px 10px;border:1px solid #e2e8f0;">
            <p style="color:#1e293b;font-size:14px;line-height:1.7;">
              We've received your message and will get back to you within <strong>24 hours</strong>.
            </p>
            <p style="color:#64748b;font-size:13px;">
              In the meantime, feel free to browse our fleet or reach us directly on WhatsApp.
            </p>
            <a href="${process.env.FRONTEND_URL}/cars" style="display:inline-block;margin-top:16px;background:#2563eb;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:600;">
              Browse Our Fleet →
            </a>
          </div>
          <p style="text-align:center;color:#94a3b8;font-size:11px;margin-top:20px;">CarRental · You're receiving this because you contacted us.</p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

export default router;