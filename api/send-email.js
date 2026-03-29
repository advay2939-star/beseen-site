import { Resend } from 'resend';

export default async function handler(req, res) {
  try {
    console.log("API HIT");

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { email, name } = req.body;

    console.log("BODY:", req.body);

    if (!email || !name) {
      return res.status(400).json({ error: 'Missing email or name' });
    }

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'You’re on the waitlist 🚀',
      html: `<p>Hey ${name}, you're on the waitlist.</p>`
    });

    console.log("EMAIL SENT:", data);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
}