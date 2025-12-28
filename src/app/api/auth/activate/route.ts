import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import prisma from "@/lib/prisma";
import { validateActivationCode, getTierDays, getTierName } from "@/lib/activation";
import { sendMagicLinkEmail, sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { code, email, name } = await request.json();

    // Validate inputs
    if (!code || !email) {
      return NextResponse.json(
        { error: "Activation code and email are required" },
        { status: 400 }
      );
    }

    // Validate the activation code
    const tier = validateActivationCode(code);

    if (!tier) {
      return NextResponse.json(
        { error: "Invalid activation code" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      // User exists - just send them a new magic link
      const magicLinkToken = nanoid(32);
      const magicLinkExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          magicLinkToken,
          magicLinkExpires,
        },
      });

      await sendMagicLinkEmail(email, magicLinkToken);

      return NextResponse.json({
        success: true,
        message: "Login link sent to your email",
        isNewUser: false,
      });
    }

    // Create new user
    const magicLinkToken = nanoid(32);
    const magicLinkExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        magicLinkToken,
        magicLinkExpires,
        currentDay: 1,
      },
    });

    // Create subscription
    const days = getTierDays(tier);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier,
        status: "ACTIVE",
        endDate,
      },
    });

    // Initialize day 1 as unlocked
    await prisma.dayProgress.create({
      data: {
        userId: user.id,
        dayNumber: 1,
        status: "UNLOCKED",
      },
    });

    // Send emails
    await sendMagicLinkEmail(email, magicLinkToken);
    await sendWelcomeEmail(email, name, getTierName(tier));

    return NextResponse.json({
      success: true,
      message: "Account created! Check your email for login link.",
      isNewUser: true,
    });
  } catch (error: any) {
    console.error("Activation error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
