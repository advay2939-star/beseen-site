import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: "Missing Razorpay keys" });
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: 59900, // ₹599
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (err) {
    console.error("Order creation failed:", err);
    return res.status(500).json({ error: "Order creation failed" });
  }
}