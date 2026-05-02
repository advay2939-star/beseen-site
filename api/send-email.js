import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    const { type, name, email, dermatologist } = req.body;

    if (!email) {
      return res.status(200).json({ success: true });
    }

    if (type === 'questionnaire') {
      await resend.emails.send({
        from: 'BeSeen <onboarding@resend.dev>',
        to: email,
        subject: "You're one step away 🌿",
        html: `
          <p>Hi ${name || 'there'},</p>

          <p>We’ve received your skin profile.</p>

          <p>You’re just <strong>₹599 away</strong> from unlocking:</p>

          <ul>
            <li>Personalised skincare routine</li>
            <li>Dermatologist-backed plan</li>
            <li>4-day check-ins</li>
            <li>21-day results guarantee</li>
          </ul>

          <p>Complete your journey now.</p>

          <p>— BeSeen</p>
        `
      });
    }

    if (type === 'payment') {
      await resend.emails.send({
        from: 'BeSeen <onboarding@resend.dev>',
        to: email,
        subject: "Your dermatologist is reviewing your skin 🩺",
        html: `
          <p>Hi ${name || 'there'},</p>

          <p>Your assigned expert <strong>${dermatologist || 'Dermatologist'}</strong> is now reviewing your profile.</p>

          <p>Your personalised skincare routine is being prepared.</p>

          <p>We’ll reach out shortly.</p>

          <p>— BeSeen</p>
        `
      });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(200).json({ success: true });
  }
}