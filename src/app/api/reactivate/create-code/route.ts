import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { REACTIVATION_PRICING, PRICING_TIERS } from "@/lib/constants";
import crypto from "crypto";

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
    const pricing = REACTIVATION_PRICING[tier];

    // Generate a unique reactivation code
    const reactivationCode = `REACT-${tier.charAt(0)}-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;

    // Store the reactivation code in database
    // This code will be validated when they complete payment
    await prisma.activationCode.create({
      data: {
        code: reactivationCode,
        tier,
        isUsed: false,
        // Store metadata about this being a reactivation
        metadata: JSON.stringify({
          type: "reactivation",
          userId: user.id,
          originalPrice: pricing.originalPrice,
          discountedPrice: pricing.discountedPrice,
        }),
      },
    });

    // For now, we'll create a Stan Store URL with the product
    // In production, you might want to use Stripe Checkout with a discount
    const stanStoreUrl = `https://stan.store/_thecareerengineer`;
    
    // Alternative: If using Stripe, create a checkout session
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const checkoutSession = await stripe.checkout.sessions.create({
    //   mode: 'payment',
    //   line_items: [{
    //     price_data: {
    //       currency: 'usd',
    //       product_data: {
    //         name: `Interview Accelerator ${tier} - Reactivation`,
    //       },
    //       unit_amount: pricing.discountedPrice * 100,
    //     },
    //     quantity: 1,
    //   }],
    //   success_url: `${process.env.NEXTAUTH_URL}/reactivate/success?code=${reactivationCode}`,
    //   cancel_url: `${process.env.NEXTAUTH_URL}/reactivate`,
    //   metadata: {
    //     reactivationCode,
    //     userId: user.id,
    //   },
    // });
    // return NextResponse.json({ checkoutUrl: checkoutSession.url });

    // For Stan Store flow, send them to Stan Store
    // They'll get a PDF with the reactivation code
    // For manual reactivations, admin can use the code directly

    return NextResponse.json({
      checkoutUrl: stanStoreUrl,
      reactivationCode, // In production, don't expose this - it should be in the PDF they receive
      message: "Contact support@engineermycareer.com with this code after payment for instant reactivation",
    });
  } catch (error) {
    console.error("Reactivation code creation error:", error);
    return NextResponse.json(
      { error: "Failed to create reactivation code" },
      { status: 500 }
    );
  }
}
