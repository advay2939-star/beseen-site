// /api/create-order.js
import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // Fail fast if env vars are missing — clear error in Vercel logs
  if (!keyId || !keySecret) {
    console.error("❌ Missing Razorpay env vars");
    return res.status(500).json({ error: "Payment service not configured" });
  }

  try {
    const razorpay = new Razorpay({
      key_id:     keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount:   59900,              // ₹599 in paise — change if needed
      currency: "INR",
      receipt:  "rcpt_" + Date.now(),
    });

    // Return only what the frontend needs
    return res.status(200).json({
      id:       order.id,
      amount:   order.amount,
      currency: order.currency,
    });

  } catch (err) {
    console.error("❌ Razorpay order creation failed:", err);
    return res.status(500).json({ error: "Failed to create payment order" });
  }
}