import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkActiveSubscription } from "@/lib/utils";

// GET - Fetch all STAR stories for user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stories = await prisma.starStory.findMany({
    where: { userId: session.user.id },
    orderBy: { questionNumber: "asc" },
  });

  return NextResponse.json(stories);
}

// POST - Create or update a STAR story
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if subscription is active
  const { isExpired } = await checkActiveSubscription(session.user.id);
  if (isExpired) {
    return NextResponse.json(
      { error: "Your subscription has expired. Please reactivate to continue editing." },
      { status: 403 }
    );
  }

  const data = await request.json();

  const story = await prisma.starStory.upsert({
    where: {
      userId_questionNumber: {
        userId: session.user.id,
        questionNumber: data.questionNumber,
      },
    },
    update: {
      question: data.question,
      situation: data.situation,
      task: data.task,
      action: data.action,
      result: data.result,
    },
    create: {
      userId: session.user.id,
      questionNumber: data.questionNumber,
      question: data.question,
      situation: data.situation,
      task: data.task,
      action: data.action,
      result: data.result,
    },
  });

  return NextResponse.json(story);
}
