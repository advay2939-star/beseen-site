import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error("Missing Razorpay env vars");
    return res.status(500).json({ error: "Payment system not configured" });
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: 59900, // ₹599 in paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,  // ← return this so HTML doesn't hardcode it
    });

  } catch (err) {
    console.error("Order creation failed:", err);
    return res.status(500).json({ error: "Order creation failed" });
  }
}