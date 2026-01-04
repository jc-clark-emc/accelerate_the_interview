import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Send notification email to admin
    await resend.emails.send({
      from: "Interview Accelerator <noreply@engineermycareer.com>",
      to: process.env.ADMIN_EMAIL || "team@engineermycareer.com",
      subject: "New 1-on-1 Coaching Interest",
      html: `
        <h2>New Coaching Interest</h2>
        <p>Someone expressed interest in 1-on-1 interview prep:</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Coaching signup error:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}