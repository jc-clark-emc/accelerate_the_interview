import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { REACTIVATION_PRICING } from "@/lib/constants";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Map tier to Stripe price ID (same products, coupon applies discount)
const PRICE_IDS: Record<string, string> = {
  STARTER: process.env.STRIPE_PRICE_STARTER!,
  PRO: process.env.STRIPE_PRICE_PRO!,
};

// Reactivation coupon code (create this in Stripe dashboard: 50% off)
const REACTIVATION_COUPON = process.env.STRIPE_REACTIVATION_COUPON || "COMEBACK50";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
      },
    });

    if (!user || !user.subscription) {
      return NextResponse.json({ error: "User or subscription not found" }, { status: 404 });
    }

    const subscription = user.subscription;
    const isExpired = subscription.status === "READ_ONLY" || subscription.status === "EXPIRED";
    const isEligibleTier = subscription.tier === "STARTER" || subscription.tier === "PRO";

    if (!isExpired || !isEligibleTier) {
      return NextResponse.json({ error: "Not eligible for reactivation" }, { status: 400 });
    }

    const tier = subscription.tier as "STARTER" | "PRO";
    const priceId = PRICE_IDS[tier];

    if (!priceId) {
      return NextResponse.json({ error: "Price not configured" }, { status: 500 });
    }

    // Create Stripe Checkout with 50% coupon
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      discounts: [
        {
          coupon: REACTIVATION_COUPON,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/reactivate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/reactivate`,
      metadata: {
        type: "reactivation",
        userId: user.id,
        tier,
      },
    });

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
    });
  } catch (error: any) {
    console.error("Reactivation checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
