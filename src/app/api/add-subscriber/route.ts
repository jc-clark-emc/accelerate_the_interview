import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Add to Resend audience (if you have one set up)
    if (process.env.RESEND_AUDIENCE_ID) {
      try {
        await resend.contacts.create({
          email,
          audienceId: process.env.RESEND_AUDIENCE_ID,
        });
      } catch (err) {
        // Contact might already exist, that's okay
        console.log("Resend contact creation:", err);
      }
    }

    // Optional: Send welcome email
    if (process.env.SEND_WELCOME_EMAIL === "true") {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "jc@engineermycareer.com",
        to: email,
        subject: "Welcome to Engineer My Career!",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0a0a0f;">Welcome! 🚀</h1>
            <p>Thanks for joining the Engineer My Career community.</p>
            <p>We'll keep you updated on job search tips, new resources, and exclusive offers.</p>
            <p>Ready to accelerate your job search? Check out <a href="https://engineermycareer.com">Interview Accelerator</a>.</p>
            <p>Best,<br>The Engineer My Career Team</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add subscriber error:", error);
    return NextResponse.json(
      { error: "Failed to add subscriber" },
      { status: 500 }
    );
  }
}
