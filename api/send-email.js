import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Missing email or name' });
    }
const data = await resend.emails.send({
  from: 'BeSeen <hello@beseen.skin>',
  to: email,
  subject: 'You’re on the waitlist 🚀',
  html: `
    <div style="font-family: Arial; padding: 20px;">
      <h2>You're in 🚀</h2>
      <p>Hey ${name},</p>
      <p>You’re officially on the <strong>BeSeen</strong> waitlist.</p>
      <p>We’re building something that will genuinely upgrade your skin game.</p>
      <br/>
      <p>Stay tuned.</p>
      <p><strong>– Team BeSeen</strong></p>
    </div>
  `
});
return res.status(200).json(data);

  } catch (error) {
    console.error('EMAIL ERROR:', error);

    return res.status(500).json({
      error: error.message || 'Email failed',
    });
  }
}