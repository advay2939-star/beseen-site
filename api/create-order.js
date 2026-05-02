import Razorpay from "razorpay";

export default async function handler(req, res) {
  // Only allow POST (important for security + clean logs)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 🔐 Validate env variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Missing Razorpay env variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // 🧾 Create Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // 💰 Amount (₹599 → paise)
    const amount = 59900;

    // 🧠 Optional: receive user data from frontend
    const { name, email } = req.body || {};

    // 🧾 Create order
    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        name: name || "customer",
        email: email || "unknown",
      },
    });

    // ✅ Success response
    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("RAZORPAY ORDER ERROR:", error);

    return res.status(500).json({
      error: "Failed to create order",
      details: error.message,
    });
  }
}