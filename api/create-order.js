import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.rzp_live_SkXtlkfDZueYwN,
  key_secret: process.env.kCPhdDxUaTLljpBxllLglfNq,
});

export default async function handler(req, res) {
  try {
    const options = {
      amount: 59900, // ₹599
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return res.status(500).json({ error: "Order creation failed" });
  }
}