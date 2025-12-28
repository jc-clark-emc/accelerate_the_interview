import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const PRICE_IDS: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER!,
  pro: process.env.STRIPE_PRICE_PRO!,
  premium: process.env.STRIPE_PRICE_PREMIUM!,
};

const TIER_DAYS: Record<string, number> = {
  starter: 14,
  pro: 30,
  premium: 365,
};

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, plan } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        currentDay: 1,
      },
    });

    // Initialize day progress (Day 1 unlocked)
    await prisma.dayProgress.create({
      data: {
        userId: user.id,
        dayNumber: 1,
        status: "UNLOCKED",
      },
    });

    // Create Stripe checkout session
    const priceId = PRICE_IDS[plan || "pro"];
    const tierDays = TIER_DAYS[plan || "pro"];
    const tierName = (plan || "pro").toUpperCase();

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/signup?canceled=true`,
      metadata: {
        userId: user.id,
        tier: tierName,
        days: tierDays.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
