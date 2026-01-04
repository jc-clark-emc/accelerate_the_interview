import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkActiveSubscription } from "@/lib/utils";

// GET - Fetch career preferences
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const preferences = await prisma.careerPreferences.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(preferences);
}

// POST - Create or update career preferences
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

  // Check if all required fields are filled
  const isComplete =
    data.targetJobTitles?.length > 0 &&
    data.salaryMin !== null &&
    data.workLocationPreference !== null &&
    data.nonNegotiables?.length > 0 &&
    data.weights !== null;

  const preferences = await prisma.careerPreferences.upsert({
    where: { userId: session.user.id },
    update: {
      ...data,
      isComplete,
      completedAt: isComplete ? new Date() : null,
    },
    create: {
      userId: session.user.id,
      ...data,
      isComplete,
      completedAt: isComplete ? new Date() : null,
    },
  });

  return NextResponse.json(preferences);
}
