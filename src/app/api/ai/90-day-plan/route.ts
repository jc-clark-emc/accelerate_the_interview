import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateFirst90DaysPlan } from "@/lib/openai";

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

  const { role, company, industry, teamSize, reportingTo, keyResponsibilities } = await request.json();

  if (!role || !company) {
    return NextResponse.json(
      { error: "Role and company are required" },
      { status: 400 }
    );
  }

  try {
    const plan = await generateFirst90DaysPlan({
      role,
      company,
      industry: industry || "Technology",
      teamSize,
      reportingTo,
      keyResponsibilities: keyResponsibilities || [],
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("AI error:", error);
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
}
