import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { getTierDays } from "@/lib/activation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // Retrieve the Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Verify this is a reactivation for the current user
    const metadata = checkoutSession.metadata;
    if (metadata?.type !== "reactivation" || metadata?.userId !== session.user.id) {
      return NextResponse.json({ error: "Invalid reactivation session" }, { status: 400 });
    }

    const tier = metadata.tier as "STARTER" | "PRO";

    // Get user's existing subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!existingSubscription) {
      return NextResponse.json({ error: "No existing subscription found" }, { status: 400 });
    }

    // Calculate new end date
    const days = getTierDays(tier);
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + days);

    // Update subscription
    await prisma.subscription.update({
      where: { id: existingSubscription.id },
      data: {
        status: "ACTIVE",
        endDate: newEndDate,
        // Keep the same tier
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription reactivated successfully",
      newEndDate,
      daysAdded: days,
    });
  } catch (error: any) {
    console.error("Reactivation process error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process reactivation" },
      { status: 500 }
    );
  }
}
