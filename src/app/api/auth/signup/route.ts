import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const PRICE_IDS: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER!,
  pro: process.env.STRIPE_PRICE_PRO!,
  premium: process.env.STRIPE_PRICE_PREMIUM!,
};

// Map plan to activation code
const ACTIVATION_CODES: Record<string, string> = {
  starter: "IA-S7F2A-8B3C1-D9E4F-2A7B8-C3D1",
  pro: "IA-P4E9B-7C2D5-F1A8E-3B6C9-D4F2",
  premium: "IA-M2C8D-5F1A9-E7B3C-8D4F2-A6E1",
};

export async function POST(request: NextRequest) {
  try {
    const { email, plan } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const priceId = PRICE_IDS[plan];
    const activationCode = ACTIVATION_CODES[plan];

    // Create Stripe checkout session
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
      success_url: `${process.env.NEXTAUTH_URL}/purchase-success?code=${activationCode}&plan=${plan}&email=${encodeURIComponent(email)}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/#pricing`,
      metadata: {
        plan,
        activationCode,
        email,
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
