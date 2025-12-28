import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateMessageVariations } from "@/lib/openai";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user has AI access
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
      tier: { in: ["PRO", "PREMIUM"] },
    },
  });

  if (!subscription) {
    return NextResponse.json(
      { error: "AI features require Pro or Premium subscription" },
      { status: 403 }
    );
  }

  const { template, recipientName, recipientRole, company, yourName, yourTitle, specificDetail } = await request.json();

  if (!template || !recipientName || !company) {
    return NextResponse.json(
      { error: "Template, recipient name, and company are required" },
      { status: 400 }
    );
  }

  try {
    const variations = await generateMessageVariations(template, {
      recipientName,
      recipientRole: recipientRole || "Professional",
      company,
      yourName: yourName || "Job Seeker",
      yourTitle: yourTitle || "Professional",
      specificDetail,
    });

    return NextResponse.json({ variations });
  } catch (error) {
    console.error("AI error:", error);
    return NextResponse.json(
      { error: "Failed to generate variations" },
      { status: 500 }
    );
  }
}
