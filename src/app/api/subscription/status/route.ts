import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!subscription) {
    return NextResponse.json({ tier: null, status: null, expired: true });
  }

  // Check if subscription is expired
  const now = new Date();
  const isExpired = subscription.endDate && subscription.endDate < now;
  
  // Update status if expired
  if (isExpired && subscription.status === "ACTIVE") {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "EXPIRED" },
    });
  }

  return NextResponse.json({
    tier: subscription.tier,
    status: isExpired ? "EXPIRED" : subscription.status,
    expired: isExpired,
    endDate: subscription.endDate,
    daysRemaining: subscription.endDate
      ? Math.max(0, Math.ceil((subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : null,
  });
}
