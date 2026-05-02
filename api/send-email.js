import { Resend } from 'resend';

const resend = new Resend(process.env.re_EJuAR9Ns_GJumm46ZhASTXd8GQQboyEKK);

export default async function handler(req, res) {
  try {
    // ✅ Support BOTH GET and POST (important)
    const data = req.method === 'POST' ? req.body : req.query;

    const { type, name, email, dermatologist } = data;

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    console.log("Sending email to:", email, "Type:", type);

    if (type === 'questionnaire') {
      await resend.emails.send({
        from: 'BeSeen <onboarding@resend.dev>',
        to: email,
        subject: "You're one step away from clear skin 🌿",
        html: `<p>Hi ${name || 'there'}, your routine is ready.</p>`
      });
    }

    if (type === 'payment') {
      await resend.emails.send({
        from: 'BeSeen <onboarding@resend.dev>',
        to: email,
        subject: "Your dermatologist is reviewing your skin 🩺",
        html: `<p>Hi ${name || 'there'}, ${dermatologist || 'Dr. Riya'} is reviewing your profile.</p>`
      });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("EMAIL ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}