const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

const DEST_EMAIL = 'aishwarya.gawande208@gmail.com';
const SUBJECT_PREFIX = 'New Contact Form Submission - PetRecs Website';

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error('SMTP credentials missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass }
  });
}

app.post('/send-email', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    // simple validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ ok: false, error: 'All fields are required.' });
    }

    const transporter = createTransport();

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: process.env.TZ || 'UTC' });

    const html = `
      <div style="font-family:system-ui,Inter,Arial; color:#0e2a34; line-height:1.4">
        <h2 style="margin-bottom:8px;">${SUBJECT_PREFIX}</h2>
        <p style="margin:0 0 12px;color:#5b6d76;font-size:14px;">Submitted: ${timestamp}</p>
        <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
          <tr><td style="font-weight:700;width:120px">Name</td><td>${escapeHtml(name)}</td></tr>
          <tr><td style="font-weight:700">Email</td><td>${escapeHtml(email)}</td></tr>
          <tr><td style="font-weight:700">Phone</td><td>${escapeHtml(phone)}</td></tr>
          <tr><td style="font-weight:700;vertical-align:top">Message</td><td>${escapeHtml(message).replace(/\n/g,'<br>')}</td></tr>
        </table>
        <hr style="margin:16px 0;border:none;border-top:1px solid #eef3f6">
        <p style="color:#869399;font-size:12px;margin:0">This message was sent from PetRecs website contact form.</p>
      </div>
    `;

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: DEST_EMAIL,
      subject: `${SUBJECT_PREFIX}`,
      text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}\n\nSubmitted: ${timestamp}`,
      html
    };

    await transporter.sendMail(mailOptions);

    return res.json({ ok: true, message: 'Email sent' });
  } catch (err) {
    console.error('send-email error', err);
    return res.status(500).json({ ok: false, error: 'Unable to send email.' });
  }
});

// small HTML-escaping helper
function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Email API listening on ${PORT}`));