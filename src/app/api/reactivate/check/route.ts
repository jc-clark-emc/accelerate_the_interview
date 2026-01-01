import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { REACTIVATION_PRICING } from "@/lib/constants";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
        dayProgress: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subscription = user.subscription;

    // Check if eligible for reactivation
    // Must have expired subscription (READ_ONLY or EXPIRED)
    // Must be STARTER or PRO tier (PREMIUM has 365 days, unlikely to expire)
    if (!subscription) {
      return NextResponse.json({ eligible: false, reason: "No subscription found" });
    }

    const isExpired = subscription.status === "READ_ONLY" || subscription.status === "EXPIRED";
    const isEligibleTier = subscription.tier === "STARTER" || subscription.tier === "PRO";

    if (!isExpired) {
      return NextResponse.json({ eligible: false, reason: "Subscription is still active" });
    }

    if (!isEligibleTier) {
      return NextResponse.json({ eligible: false, reason: "Premium tier not eligible for reactivation discount" });
    }

    const tier = subscription.tier as "STARTER" | "PRO";
    const pricing = REACTIVATION_PRICING[tier];
    const daysCompleted = user.dayProgress.filter(dp => dp.status === "COMPLETED").length;

    return NextResponse.json({
      eligible: true,
      tier,
      originalPrice: pricing.originalPrice,
      discountedPrice: pricing.discountedPrice,
      days: pricing.days,
      daysCompleted,
      email: user.email,
    });
  } catch (error) {
    console.error("Reactivation check error:", error);
    return NextResponse.json(
      { error: "Failed to check reactivation status" },
      { status: 500 }
    );
  }
}
