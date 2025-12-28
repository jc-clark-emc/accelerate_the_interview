import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DashboardNav } from "@/components/DashboardNav";
import { getDaysRemaining } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user with subscription
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      dayProgress: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Check subscription status
  const subscription = user.subscription;
  const isActive = subscription?.status === "ACTIVE";
  const daysRemaining = subscription?.endDate
    ? getDaysRemaining(subscription.endDate)
    : 0;

  // If subscription expired, set to read-only
  if (subscription && daysRemaining <= 0 && subscription.status === "ACTIVE") {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "READ_ONLY" },
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav
        user={{
          name: user.name || user.email,
          email: user.email,
          currentDay: user.currentDay,
        }}
        subscription={{
          tier: subscription?.tier || "STARTER",
          status: subscription?.status || "ACTIVE",
          daysRemaining,
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
