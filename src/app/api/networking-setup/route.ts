import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkActiveSubscription } from "@/lib/utils";

// GET - Fetch networking setup
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const setup = await prisma.networkingSetup.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(setup);
}

// POST - Create or update networking setup
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

  const setup = await prisma.networkingSetup.upsert({
    where: { userId: session.user.id },
    update: data,
    create: {
      userId: session.user.id,
      ...data,
    },
  });

  return NextResponse.json(setup);
}
