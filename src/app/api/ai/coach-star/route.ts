import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { coachStarStory } from "@/lib/openai";

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

  const { question, situation, task, action, result } = await request.json();

  if (!question || !situation || !task || !action || !result) {
    return NextResponse.json(
      { error: "All STAR fields are required" },
      { status: 400 }
    );
  }

  try {
    const coaching = await coachStarStory({
      question,
      situation,
      task,
      action,
      result,
    });

    return NextResponse.json(coaching);
  } catch (error) {
    console.error("AI error:", error);
    return NextResponse.json(
      { error: "Failed to generate coaching" },
      { status: 500 }
    );
  }
}
