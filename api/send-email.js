import { Resend } from 'resend';

const resend = new Resend(process.env.re_EJuAR9Ns_GJumm46ZhASTXd8GQQboyEKK);

export default async function handler(req, res) {
  try {
    const { type, name, email, dermatologist } = req.body;

    if (!email) {
      return res.status(200).json({ success: true });
    }

    // 📩 EMAIL 1: Questionnaire submitted
    if (type === 'questionnaire') {
      await resend.emails.send({
        from: 'BeSeen <onboarding@resend.dev>',
        to: email,
        subject: "You're one step away from clear skin 🌿",
        html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 520px; margin: auto; padding: 24px; color: #111;">
<div style="font-size:18px; font-weight:600; margin-bottom:20px;">
  BeSeen<span style="color:#1f3d34;">.</span>
</div>
  <h2 style="margin-bottom: 8px;">You're one step away, ${name || 'there'} 🌿</h2>

  <p style="color: #444; line-height: 1.6;">
    We’ve analysed your skin profile and your personalised routine is ready.
  </p>

  <div style="background: #f6f7f6; padding: 16px; border-radius: 12px; margin: 20px 0;">
    <strong>Here’s what you unlock:</strong>
    <ul style="padding-left: 18px; margin-top: 10px; color:#333;">
      <li>Personalised skincare routine (built for your skin)</li>
      <li>Dermatologist-backed plan</li>
      <li>Check-ins every 4 days</li>
      <li>21-day visible results guarantee</li>
      <li>WhatsApp support from your expert</li>
    </ul>
  </div>

  <a href="https://beseen.skin"
     style="display:inline-block; padding:14px 22px; background:#1f3d34; color:#fff; text-decoration:none; border-radius:10px; font-weight:600;">
     Unlock My Routine — ₹599
  </a>

  <p style="margin-top:20px; font-size:14px; color:#666;">
    If you don’t see results in 21 days, we refund you. No questions asked.
  </p>

  <p style="margin-top:30px;">— BeSeen</p>

</div>
`
      });
    }

    // 📩 EMAIL 2: Payment completed
    if (type === 'payment') {
      await resend.emails.send({
        from: 'BeSeen <onboarding@resend.dev>',
        to: email,
        subject: "Your dermatologist is reviewing your skin 🩺",
        html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 520px; margin: auto; padding: 24px; color: #111;">
<div style="font-size:18px; font-weight:600; margin-bottom:20px;">
  BeSeen<span style="color:#1f3d34;">.</span>
</div>
  <h2 style="margin-bottom: 8px;">You're in, ${name || 'there'} 🩺</h2>

  <p style="color: #444; line-height: 1.6;">
    Your assigned dermatologist <strong>${dermatologist || 'Dr. Riya'}</strong> is now reviewing your skin profile.
  </p>

  <div style="background: #f6f7f6; padding: 16px; border-radius: 12px; margin: 20px 0;">
    <strong>What happens next:</strong>
    <ul style="padding-left: 18px; margin-top: 10px; color:#333;">
      <li>Your routine is being customised</li>
      <li>Your photos + answers are being reviewed</li>
      <li>You’ll receive your plan shortly</li>
    </ul>
  </div>

  <p style="margin-top:10px;">
    We’ll also check in every few days to track your progress.
  </p>

  <p style="margin-top:30px;">— BeSeen</p>

</div>
`
      });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(200).json({ success: true });
  }
}