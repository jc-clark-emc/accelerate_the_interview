import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateSalaryScript } from "@/lib/openai";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user has Premium access
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
      tier: "PREMIUM",
    },
  });

  if (!subscription) {
    return NextResponse.json(
      { error: "Premium subscription required" },
      { status: 403 }
    );
  }

  const { role, currentOffer, targetSalary, yearsExperience, keyAccomplishments, marketData } = await request.json();

  if (!role || !currentOffer || !targetSalary) {
    return NextResponse.json(
      { error: "Role, current offer, and target salary are required" },
      { status: 400 }
    );
  }

  try {
    const script = await generateSalaryScript({
      role,
      currentOffer,
      targetSalary,
      yearsExperience: yearsExperience || 0,
      keyAccomplishments: keyAccomplishments || [],
      marketData,
    });

    return NextResponse.json(script);
  } catch (error) {
    console.error("AI error:", error);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}
