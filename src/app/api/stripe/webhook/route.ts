import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, tier, days } = session.metadata || {};

    if (userId && tier && days) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(days));

      // Create or update subscription
      await prisma.subscription.upsert({
        where: { userId },
        update: {
          tier: tier as any,
          status: "ACTIVE",
          stripeCustomerId: session.customer as string,
          endDate,
        },
        create: {
          userId,
          tier: tier as any,
          status: "ACTIVE",
          stripeCustomerId: session.customer as string,
          endDate,
        },
      });

      console.log(`Subscription created for user ${userId}: ${tier} tier, ${days} days`);
    }
  }

  return NextResponse.json({ received: true });
}
