import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch resume profile
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.resumeProfile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(profile);
}

// POST - Create or update resume profile
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  // Check if all required fields are filled
  const isComplete =
    data.headline &&
    data.summaryStatement &&
    data.bulletOne;

  const profile = await prisma.resumeProfile.upsert({
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

  return NextResponse.json(profile);
}
