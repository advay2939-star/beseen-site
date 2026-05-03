import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
 console.log("ENV CHECK:");
 console.log("KEY:", process.env.RAZORPAY_KEY_ID);
 console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: 59900,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    return res.status(200).json(order);

  } catch (err) {
    console.error("FULL ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
}