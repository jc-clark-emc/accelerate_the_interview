import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST - Update day progress
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { dayNumber, status } = await request.json();

  // Update or create day progress
  const progress = await prisma.dayProgress.upsert({
    where: {
      userId_dayNumber: {
        userId: session.user.id,
        dayNumber,
      },
    },
    update: {
      status,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
    create: {
      userId: session.user.id,
      dayNumber,
      status,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  });

  // If completing a day, unlock the next day and update current day
  if (status === "COMPLETED" && dayNumber < 14) {
    const nextDay = dayNumber + 1;

    // Unlock next day
    await prisma.dayProgress.upsert({
      where: {
        userId_dayNumber: {
          userId: session.user.id,
          dayNumber: nextDay,
        },
      },
      update: {
        status: "UNLOCKED",
      },
      create: {
        userId: session.user.id,
        dayNumber: nextDay,
        status: "UNLOCKED",
      },
    });

    // Update user's current day
    await prisma.user.update({
      where: { id: session.user.id },
      data: { currentDay: nextDay },
    });
  }

  return NextResponse.json(progress);
}

// GET - Fetch all day progress for user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const progress = await prisma.dayProgress.findMany({
    where: { userId: session.user.id },
    orderBy: { dayNumber: "asc" },
  });

  return NextResponse.json(progress);
}
