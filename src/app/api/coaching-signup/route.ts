import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Your Resend audience ID for the newsletter list
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || "";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Add contact to Resend audience
    if (AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        audienceId: AUDIENCE_ID,
        unsubscribed: false,
      });
    }

    // Send notification email to Lynda
    await resend.emails.send({
      from: "Interview Accelerator <noreply@engineermycareer.com>",
      to: "lynda@engineermycareer.com", // Update this to Lynda's actual email
      subject: "New 1-on-1 Coaching Request",
      html: `
        <h2>New Coaching Request</h2>
        <p>Someone wants to book a 1-on-1 interview prep session:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>Please reach out to schedule their session.</p>
      `,
    });

    // Send confirmation email to user
    await resend.emails.send({
      from: "Interview Accelerator <noreply@engineermycareer.com>",
      to: email,
      subject: "Your Interview Coaching Request",
      html: `
        <h2>Thanks for your interest!</h2>
        <p>Lynda Harvey will reach out within 24-48 hours to schedule your personalized interview prep session.</p>
        <p>In the meantime, keep working through your Interview Accelerator program!</p>
        <p>Best,<br>The Interview Accelerator Team</p>
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
