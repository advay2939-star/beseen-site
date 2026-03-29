import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

  // ❗ handle wrong method (THIS FIXES CRASH)
  if (req.method !== 'POST') {
    return res.status(200).json({ message: 'API working' });
  }

  const { email, name } = req.body;

  try {
    await resend.emails.send({
      from: 'BeSeen <onboarding@resend.dev>',
      to: email,
      subject: 'You’re on the BeSeen waitlist',
      html: `<p>Hey ${name}, you're on the waitlist 🚀</p>`
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('EMAIL ERROR:', error);
    return res.status(500).json({ error: 'Email failed' });
  }
}