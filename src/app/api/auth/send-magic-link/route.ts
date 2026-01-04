import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import prisma from "@/lib/prisma";
import { sendMagicLinkEmail } from "@/lib/email";

// Generate a 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      // Just say we sent the email
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, you will receive a login link.",
      });
    }

    // Generate magic link token and 6-digit code
    const magicLinkToken = nanoid(32);
    const loginCode = generateCode();
    const magicLinkExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        magicLinkToken,
        loginCode,
        magicLinkExpires,
      },
    });

    // Send email with both link and code
    await sendMagicLinkEmail(email, magicLinkToken, loginCode);

    return NextResponse.json({
      success: true,
      message: "Login link sent!",
    });
  } catch (error: any) {
    console.error("Send magic link error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
