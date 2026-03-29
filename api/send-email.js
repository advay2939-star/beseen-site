import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const { email, name } = req.body;

  try {
    await resend.emails.send({
      from: 'BeSeen <onboarding@resend.dev>',
      to: email,
      subject: 'You’re on the BeSeen waitlist',
      html: `
        <div style="font-family: DM Sans, sans-serif; padding: 24px;">
          <h2 style="color:#3a7d5c;">You're in.</h2>
          <p>Hey ${name},</p>
          <p>You’ve successfully joined the BeSeen waitlist.</p>
          <p>We’ll notify you when we launch.</p>
          <br/>
          <p style="color:#888;">– Team BeSeen</p>
        </div>
      `
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Email failed' });
  }
}