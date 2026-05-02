import { Resend } from 'resend';

const resend = new Resend(process.env.re_EJuAR9Ns_GJumm46ZhASTXd8GQQboyEKK);

export default async function handler(req, res) {
  try {
    // Support both GET and POST
    const data = req.method === 'POST' ? req.body : req.query;
    const { type, name, email, dermatologist } = data;

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    console.log("📩 Sending email:", { email, type });

    // ─────────────────────────────
    // EMAIL 1 — Questionnaire Done
    // ─────────────────────────────
    if (type === 'questionnaire') {
      await resend.emails.send({
        from: 'BeSeen <onboarding@resend.dev>',
        to: email,
        subject: "Your personalised routine is ready 🌿",
        html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 520px; margin: auto; padding: 24px; color: #111;">

  <div style="font-size:18px; font-weight:600; margin-bottom:20px;">
    BeSeen<span style="color:#1f3d34;">.</span>
  </div>

  <h2 style="margin-bottom: 8px;">Hi ${name || 'there'}, your routine is ready 🌿</h2>

  <p style="color: #444; line-height: 1.6;">
    Based on your skin profile, we've built a personalised routine tailored specifically for you.
  </p>

  <div style="background: #f6f7f6; padding: 16px; border-radius: 12px; margin: 20px 0;">
    <strong>What you’ll get:</strong>
    <ul style="padding-left: 18px; margin-top: 10px; color:#333;">
      <li>Personalised skincare routine (morning & night)</li>
      <li>Dermatologist-backed recommendations</li>
      <li>4-day progress check-ins</li>
      <li>Routine refinement after 21 days</li>
      <li>Direct WhatsApp support from your expert</li>
    </ul>
  </div>

  <a href="https://beseen.skin"
     style="display:inline-block; padding:14px 22px; background:#1f3d34; color:#fff; text-decoration:none; border-radius:10px; font-weight:600;">
     Unlock My Routine — ₹599
  </a>

  <p style="margin-top:20px; font-size:14px; color:#666;">
    If you don’t see visible improvement in 21 days, we’ll refund you — no questions asked.
  </p>

  <p style="margin-top:30px;">— Team BeSeen</p>

</div>
`
      });
    }

    // ─────────────────────────────
    // EMAIL 2 — Payment Success
    // ─────────────────────────────
    if (type === 'payment') {
      await resend.emails.send({
        from: 'BeSeen <onboarding@resend.dev>',
        to: email,
        subject: "Your dermatologist is now reviewing your skin 🩺",
        html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 520px; margin: auto; padding: 24px; color: #111;">

  <div style="font-size:18px; font-weight:600; margin-bottom:20px;">
    BeSeen<span style="color:#1f3d34;">.</span>
  </div>

  <h2 style="margin-bottom: 8px;">You're in, ${name || 'there'} 🩺</h2>

  <p style="color: #444; line-height: 1.6;">
    Your assigned dermatologist <strong>${dermatologist || 'Dr. Riya'}</strong> is now reviewing your skin profile and tailoring your routine.
  </p>

  <div style="background: #f6f7f6; padding: 16px; border-radius: 12px; margin: 20px 0;">
    <strong>What happens next:</strong>
    <ul style="padding-left: 18px; margin-top: 10px; color:#333;">
      <li>Your skin photos & responses are being analysed</li>
      <li>Your personalised routine is being crafted</li>
      <li>You’ll receive your plan shortly</li>
    </ul>
  </div>

  <p style="margin-top:10px;">
    We’ll also check in every few days to track your progress and refine your routine.
  </p>

  <p style="margin-top:20px; font-size:14px; color:#666;">
    You’ll receive a WhatsApp message from your dermatologist soon.
  </p>

  <p style="margin-top:30px;">— Team BeSeen</p>

</div>
`
      });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("❌ EMAIL ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}