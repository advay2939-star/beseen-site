import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    name,
    email,
    dermatologist,
  } = req.body || {};

  // ── Validate required fields ──
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment fields" });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    console.error("❌ RAZORPAY_KEY_SECRET not set");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // ── Verify HMAC signature ──
  const payload = razorpay_order_id + "|" + razorpay_payment_id;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  if (expected !== razorpay_signature) {
    console.error("❌ Signature mismatch");
    return res.status(400).json({ success: false, error: "Invalid payment signature" });
  }

  console.log("✅ Payment verified:", razorpay_payment_id);

  // ── Trigger email (fire-and-forget) ──
  // Build base URL that works in both preview and production deployments
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";

  try {
    const emailRes = await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "payment",
        name: name || "",
        email: email || "",
        dermatologist: dermatologist || "your dermatologist",
      }),
    });
    if (!emailRes.ok) {
      console.warn("⚠ Email API returned:", emailRes.status);
    }
  } catch (e) {
    // Never let email failure block payment confirmation
    console.error("⚠ Email trigger failed (non-fatal):", e.message);
  }

  return res.status(200).json({ success: true });
}