import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch all weekly wins for user
export async function GET() {
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

  const wins = await prisma.weeklyWin.findMany({
    where: { userId: session.user.id },
    orderBy: { weekOf: "desc" },
  });

  return NextResponse.json(wins);
}

// POST - Create a new weekly win
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

  const data = await request.json();

  const win = await prisma.weeklyWin.create({
    data: {
      userId: session.user.id,
      weekOf: new Date(data.weekOf),
      wins: data.wins || [],
      challenges: data.challenges || [],
      learnings: data.learnings || [],
      nextWeekGoals: data.nextWeekGoals || [],
    },
  });

  return NextResponse.json(win);
}

// DELETE - Delete a weekly win
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  // Verify ownership
  const existing = await prisma.weeklyWin.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.weeklyWin.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
