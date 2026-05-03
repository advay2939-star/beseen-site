import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const app = express();
app.use(express.json());

const razorpay = new Razorpay({
  key_id: "rzp_live_SkXtlkfDZueYwN",
  key_secret: "kCPhdDxUaTLljpBxllLglfNq"
});

app.post("/api/create-order", async (req, res) => {
  const order = await razorpay.orders.create({
    amount: 59900,
    currency: "INR"
  });
  res.json(order);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});