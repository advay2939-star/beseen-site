import Razorpay from "razorpay";

export default async function handler(req, res) {
  try {
    console.log("ENV KEY:", process.env.rzp_live_SkXtlkfDZueYwN);

    const razorpay = new Razorpay({
      key_id: process.env.rzp_live_SkXtlkfDZueYwN,
      key_secret: process.env.kCPhdDxUaTLljpBxllLglfNq,
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
      stack: err.stack
    });
  }
}