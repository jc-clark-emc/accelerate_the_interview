import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Send welcome email (this also creates the contact in Resend)
    await resend.emails.send({
      from: "Interview Accelerator <jc@engineermycareer.com>",
      to: email,
      subject: "Welcome to Engineer My Career! 🚀",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0a0a0f;">Welcome! 🚀</h1>
          <p>Thanks for joining the Engineer My Career community.</p>
          <p>We'll keep you updated on job search tips, new resources, and exclusive offers.</p>
          <p>Ready to accelerate your job search? Check out <a href="https://engineermycareer.com">Interview Accelerator</a>.</p>
          <p>Best,<br>JC</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add subscriber error:", error);
    return NextResponse.json(
      { error: "Failed to add subscriber" },
      { status: 500 }
    );
  }
}
