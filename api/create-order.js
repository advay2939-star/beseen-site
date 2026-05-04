import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: "Razorpay keys not configured" });
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount:   1000,
      currency: "INR",
      receipt:  "rcpt_" + Date.now(),
    });

    return res.status(200).json({
      id:       order.id,
      amount:   order.amount,
      currency: order.currency,
      key_id:   keyId,
    });

  } catch (err) {
    console.error("create-order failed:", err);
    return res.status(500).json({ error: "Could not create order" });
  }
}