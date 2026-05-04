import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, name, email, dermatologist } = req.body || {};

    if (!email) return res.status(400).json({ error: "Missing email" });
    if (!type)  return res.status(400).json({ error: "Missing type" });

    console.log("📩 Sending email:", { email, type });

    // ─────────────────────────────────────────────────────
    // EMAIL 1 — Quiz done, didn't pay (abandonment/callback)
    // ─────────────────────────────────────────────────────
    if (type === "questionnaire") {
      await resend.emails.send({
        from: "BeSeen <hello@beseen.skin>",
        to:   email,
        subject: `${name ? name + ", your" : "Your"} personalised skin routine is waiting 🌿`,
        html: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:auto;padding:32px 24px;color:#111;background:#fff;">

  <div style="font-size:20px;font-weight:700;margin-bottom:28px;letter-spacing:-0.5px;">
    BeSeen<span style="color:#3d6b5e;">.</span>
  </div>

  <h2 style="font-size:24px;font-weight:600;margin-bottom:10px;line-height:1.3;">
    ${name ? `Hey ${name} —` : "Hey —"} your routine is built and ready.
  </h2>

  <p style="color:#555;line-height:1.7;margin-bottom:20px;">
    You took the time to answer every question about your skin. We took that seriously — 
    your personalised routine is already put together and waiting for you.
  </p>

  <div style="background:#f0f7f5;border-left:3px solid #3d6b5e;border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:24px;">
    <p style="margin:0;font-size:14px;color:#2f4f45;line-height:1.7;">
      <strong>Your plan includes:</strong><br>
      ✓ A morning and night routine built for your skin type<br>
      ✓ Ingredient-matched recommendations (no guesswork)<br>
      ✓ A dermatologist who will personally check in at day 4 and day 21<br>
      ✓ WhatsApp support throughout your journey
    </p>
  </div>

  <p style="color:#555;line-height:1.7;margin-bottom:8px;">
    All of that — for a one-time ₹599. No subscription. No hidden charges.
  </p>

  <p style="color:#555;line-height:1.7;margin-bottom:28px;">
    And if you don't see visible improvement in 21 days, we'll refund you completely. 
    No questions, no forms, no hassle.
  </p>

  <a href="https://beseen.skin" 
     style="display:inline-block;padding:15px 28px;background:#3d6b5e;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;letter-spacing:0.2px;">
    Unlock My Routine — ₹599 →
  </a>

  <p style="margin-top:28px;font-size:13px;color:#888;line-height:1.6;">
    Your skin data is saved. You won't need to redo the quiz — just click the button above 
    and you'll pick up right where you left off.
  </p>

  <hr style="border:none;border-top:1px solid #eee;margin:32px 0;">

  <p style="font-size:12px;color:#aaa;margin:0;">
    — Team BeSeen &nbsp;·&nbsp; Not a substitute for medical advice.
  </p>

</div>`,
      });
    }

    // ─────────────────────────────────────────────────────
    // EMAIL 2 — Payment confirmed
    // ─────────────────────────────────────────────────────
    if (type === "payment") {
      await resend.emails.send({
        from: "BeSeen <hello@beseen.skin>",
        to:   email,
        subject: "You're in. Your dermatologist is on it 🩺",
        html: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:auto;padding:32px 24px;color:#111;background:#fff;">

  <div style="font-size:20px;font-weight:700;margin-bottom:28px;letter-spacing:-0.5px;">
    BeSeen<span style="color:#3d6b5e;">.</span>
  </div>

  <div style="text-align:center;margin-bottom:32px;">
    <div style="width:64px;height:64px;background:#e6efec;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;">
      ✅
    </div>
  </div>

  <h2 style="font-size:24px;font-weight:600;margin-bottom:10px;line-height:1.3;">
    Payment confirmed. Thank you${name ? `, ${name}` : ""}.
  </h2>

  <p style="color:#555;line-height:1.7;margin-bottom:20px;">
    Seriously — thank you for trusting us with your skin. That means a lot to us, 
    and we're going to make sure it's worth it.
  </p>

  <div style="background:#f0f7f5;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
    <p style="margin:0 0 14px 0;font-weight:600;font-size:15px;color:#1a1a1a;">What's happening right now:</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:8px 0;vertical-align:top;width:28px;font-size:18px;">🔬</td>
        <td style="padding:8px 0;font-size:13.5px;color:#333;line-height:1.6;">
          <strong>Dr. ${dermatologist || "Riya"}</strong> is reviewing your skin photos 
          and questionnaire answers right now.
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;vertical-align:top;font-size:18px;">✍️</td>
        <td style="padding:8px 0;font-size:13.5px;color:#333;line-height:1.6;">
          Your personalised morning, night, and pre-sleep routine is being crafted 
          specifically for your skin type and concerns.
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;vertical-align:top;font-size:18px;">📱</td>
        <td style="padding:8px 0;font-size:13.5px;color:#333;line-height:1.6;">
          Your complete routine will be delivered to you via <strong>WhatsApp and email 
          within 24 hours</strong> — usually much sooner (often under 2 hours).
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;vertical-align:top;font-size:18px;">📅</td>
        <td style="padding:8px 0;font-size:13.5px;color:#333;line-height:1.6;">
          Your dermatologist will personally check in at <strong>day 4</strong> and 
          <strong>day 21</strong> to review your progress and fine-tune your plan.
        </td>
      </tr>
    </table>
  </div>

  <div style="background:#fffbea;border:1px solid #f0e080;border-radius:10px;padding:14px 18px;margin-bottom:28px;">
    <p style="margin:0;font-size:13px;color:#7a6500;line-height:1.6;">
      🛡 <strong>21-day money-back guarantee:</strong> If you don't see visible improvement, 
      we'll refund you in full — no questions asked.
    </p>
  </div>

  <p style="color:#555;line-height:1.7;margin-bottom:4px;font-size:14px;">
    Keep an eye on your WhatsApp. Dr. ${dermatologist || "Riya"} will introduce themselves shortly.
  </p>

  <hr style="border:none;border-top:1px solid #eee;margin:32px 0;">

  <p style="font-size:12px;color:#aaa;margin:0;line-height:1.6;">
    — Team BeSeen &nbsp;·&nbsp; Questions? Reply to this email anytime.<br>
    Not a substitute for professional medical advice.
  </p>

</div>`,
      });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("❌ EMAIL ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}