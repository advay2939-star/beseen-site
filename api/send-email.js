import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    const { email, name } = req.body;

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // works for testing
      to: email,
      subject: 'You’re on the waitlist 🚀',
      html: `<p>Hey ${name}, you’re officially on the BeSeen waitlist.</p>`
    });

    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
