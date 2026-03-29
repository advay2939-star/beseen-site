import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev', // later replace with your domain
      to: email,
      subject: 'You’re on the BeSeen waitlist 🚀',
      html: `
        <h2>Welcome, ${name}</h2>
        <p>You’ve successfully joined the BeSeen waitlist.</p>
        <p>We’ll notify you soon.</p>
      `,
    });

    console.log("EMAIL SENT:", response);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
}
