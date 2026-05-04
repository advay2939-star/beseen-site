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
    subject: `${name ? name + ", we" : "We"} received your skin profile 🌿`,
    html: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:540px;margin:auto;padding:40px 28px;color:#111;background:#ffffff;">

  <!-- Logo -->
  <div style="font-size:22px;font-weight:700;letter-spacing:-0.5px;margin-bottom:36px;">
    BeSeen<span style="color:#3d6b5e;">.</span>
  </div>

  <!-- Headline -->
  <h2 style="font-size:26px;font-weight:600;line-height:1.3;margin:0 0 14px 0;">
    ${name ? `${name}, we see you.` : "We see you."}
  </h2>

  <p style="font-size:15px;color:#444;line-height:1.75;margin:0 0 20px 0;">
    You just completed your full skin questionnaire — and we want you to know 
    that every single answer you gave is being taken seriously.
  </p>

  <p style="font-size:15px;color:#444;line-height:1.75;margin:0 0 28px 0;">
    This wasn't a generic quiz. Every question was designed by dermatologists 
    to map the exact state of your skin — your type, your concerns, your lifestyle, 
    your environment. That's the level of detail that makes BeSeen different 
    from anything else you've tried.
  </p>

  <!-- Value block -->
  <div style="background:#f0f7f5;border-radius:14px;padding:24px 26px;margin-bottom:28px;">
    <p style="margin:0 0 16px 0;font-size:15px;font-weight:600;color:#1a1a1a;">
      Here's what we've built for you:
    </p>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:9px 0;vertical-align:top;width:26px;font-size:17px;">🧴</td>
        <td style="padding:9px 0;font-size:13.5px;color:#333;line-height:1.65;">
          <strong>A full morning + night routine</strong> — ingredient-matched to your 
          exact skin type and concerns. No guessing, no generic advice.
        </td>
      </tr>
      <tr>
        <td style="padding:9px 0;vertical-align:top;font-size:17px;">👩‍⚕️</td>
        <td style="padding:9px 0;font-size:13.5px;color:#333;line-height:1.65;">
          <strong>A real dermatologist assigned to you</strong> — who personally reviews 
          your photos and profile before crafting your plan.
        </td>
      </tr>
      <tr>
        <td style="padding:9px 0;vertical-align:top;font-size:17px;">📅</td>
        <td style="padding:9px 0;font-size:13.5px;color:#333;line-height:1.65;">
          <strong>Check-ins at day 4 and day 21</strong> — your expert doesn't disappear 
          after the routine is sent. They follow up and adjust based on how your skin responds.
        </td>
      </tr>
      <tr>
        <td style="padding:9px 0;vertical-align:top;font-size:17px;">💬</td>
        <td style="padding:9px 0;font-size:13.5px;color:#333;line-height:1.65;">
          <strong>WhatsApp support throughout</strong> — real answers from your expert, 
          not a chatbot.
        </td>
      </tr>
    </table>
  </div>

  <!-- Reassurance -->
  <p style="font-size:15px;color:#444;line-height:1.75;margin:0 0 10px 0;">
    All of this — for a one-time ₹599. No subscription. No recurring charges. 
    Just results.
  </p>

  <p style="font-size:15px;color:#444;line-height:1.75;margin:0 0 28px 0;">
    And if you don't see visible improvement in 21 days, we refund you. 
    Completely. No forms, no follow-up, no questions asked.
  </p>

  <!-- CTA -->
  <a href="https://beseen.skin"
     style="display:inline-block;padding:16px 30px;background:#3d6b5e;color:#ffffff;
            text-decoration:none;border-radius:11px;font-weight:600;font-size:15px;
            letter-spacing:0.2px;margin-bottom:28px;">
    Unlock My Routine — ₹599 →
  </a>

  <!-- Trust line -->
  <p style="font-size:13px;color:#888;line-height:1.65;margin:0 0 8px 0;">
    Your skin profile is saved. You won't need to redo the questionnaire — 
    just click above and you'll pick up exactly where you left off.
  </p>

  <hr style="border:none;border-top:1px solid #eeeeee;margin:32px 0 20px 0;">

  <p style="font-size:12px;color:#bbb;margin:0;line-height:1.6;">
    With care — Team BeSeen &nbsp;·&nbsp; 
    Not a substitute for professional medical advice.
  </p>

</div>`,
  });
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