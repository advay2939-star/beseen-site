import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      email
    } = req.body;

    // 🛑 Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment data" });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      console.error("Missing RAZORPAY_KEY_SECRET");
      return res.status(500).json({ error: "Server config error" });
    }

    // 🔐 Create expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    // ✅ Compare signatures
    if (expectedSignature === razorpay_signature) {
      console.log("✅ Payment verified:", razorpay_payment_id);

      // 👉 OPTIONAL: trigger email after payment
      try {
        await fetch(`${req.headers.origin}/api/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "payment",
            name,
            email,
          }),
        });
      } catch (e) {
        console.error("Email send failed:", e);
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified",
      });
    }

    // ❌ Invalid signature
    console.error("❌ Invalid signature");

    return res.status(400).json({
      success: false,
      error: "Invalid payment signature",
    });

  } catch (err) {
    console.error("VERIFY ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
}