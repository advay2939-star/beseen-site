import { Resend } from "resend";

// ✅ NEVER hardcode the API key — use RESEND_API_KEY in Vercel environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, name, email, dermatologist } = req.body || {};

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }
    if (!type) {
      return res.status(400).json({ error: "Missing type" });
    }

    console.log("📩 Sending email:", { email, type });

    // ─────────────────────────────────────
    // EMAIL 1 — Questionnaire complete
    // ─────────────────────────────────────
    if (type === "questionnaire") {
      await resend.emails.send({
        from: "BeSeen <onboarding@resend.dev>",
        to: email,
        subject: "Your personalised routine is ready 🌿",
        html: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto;max-width:520px;margin:auto;padding:24px;color:#111;">
  <div style="font-size:18px;font-weight:600;margin-bottom:20px;">BeSeen<span style="color:#3d6b5e;">.</span></div>
  <h2 style="margin-bottom:8px;">Hi ${name || "there"}, your routine is ready 🌿</h2>
  <p style="color:#444;line-height:1.6;">
    Based on your skin profile, we've built a personalised routine tailored specifically for you.
  </p>
  <div style="background:#f6f7f6;padding:16px;border-radius:12px;margin:20px 0;">
    <strong>What you'll get:</strong>
    <ul style="padding-left:18px;margin-top:10px;color:#333;">
      <li>Personalised skincare routine (morning &amp; night)</li>
      <li>Dermatologist-backed recommendations</li>
      <li>4-day progress check-ins</li>
      <li>Routine refinement after 21 days</li>
      <li>Direct WhatsApp support from your expert</li>
    </ul>
  </div>
  <a href="https://beseen.skin"
     style="display:inline-block;padding:14px 22px;background:#3d6b5e;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;">
    Unlock My Routine — ₹599
  </a>
  <p style="margin-top:20px;font-size:14px;color:#666;">
    If you don't see visible improvement in 21 days, we'll refund you — no questions asked.
  </p>
  <p style="margin-top:30px;">— Team BeSeen</p>
</div>`,
      });
    }

    // ─────────────────────────────────────
    // EMAIL 2 — Payment confirmed
    // ─────────────────────────────────────
    if (type === "payment") {
      await resend.emails.send({
        from: "BeSeen <onboarding@resend.dev>",
        to: email,
        subject: "Your dermatologist is now reviewing your skin 🩺",
        html: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto;max-width:520px;margin:auto;padding:24px;color:#111;">
  <div style="font-size:18px;font-weight:600;margin-bottom:20px;">BeSeen<span style="color:#3d6b5e;">.</span></div>
  <h2 style="margin-bottom:8px;">You're in, ${name || "there"} 🩺</h2>
  <p style="color:#444;line-height:1.6;">
    Your assigned dermatologist <strong>${dermatologist || "Dr. Riya"}</strong> is now reviewing your skin profile and tailoring your routine.
  </p>
  <div style="background:#f6f7f6;padding:16px;border-radius:12px;margin:20px 0;">
    <strong>What happens next:</strong>
    <ul style="padding-left:18px;margin-top:10px;color:#333;">
      <li>Your skin photos &amp; responses are being analysed</li>
      <li>Your personalised routine is being crafted</li>
      <li>You'll receive your plan on WhatsApp within 24 hours</li>
    </ul>
  </div>
  <p style="font-size:14px;color:#666;">
    We'll check in at day 4 and day 21 to track your progress and refine your routine.
  </p>
  <p style="margin-top:30px;">— Team BeSeen</p>
</div>`,
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ EMAIL ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}