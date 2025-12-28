import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DAYS } from "@/lib/constants";
import { Lock, CheckCircle, Circle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      dayProgress: true,
      jobLeads: true,
      networkingContacts: true,
      starStories: true,
    },
  });

  if (!user) redirect("/login");

  // Get day progress
  const dayProgressMap = new Map(
    user.dayProgress.map((dp) => [dp.dayNumber, dp.status])
  );

  // Calculate stats
  const stats = {
    jobsApplied: user.jobLeads.filter((j) => j.status !== "SAVED").length,
    jobsSaved: user.jobLeads.length,
    messagesSent: user.networkingContacts.filter((c) => c.messageSent).length,
    storiesComplete: user.starStories.filter((s) => s.isComplete).length,
    currentDay: user.currentDay,
  };

  // Determine day status for display
  function getDayStatus(dayNumber: number) {
    const status = dayProgressMap.get(dayNumber);
    if (status === "COMPLETED") return "completed";
    if (status === "IN_PROGRESS") return "in-progress";
    if (dayNumber === user.currentDay) return "unlocked";
    if (dayNumber < user.currentDay) return "unlocked";
    return "locked";
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-gray-600 mt-1">
          You're on Day {user.currentDay} of your 14-day journey.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Jobs Saved</p>
          <p className="text-2xl font-bold text-gray-900">{stats.jobsSaved}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Applications</p>
          <p className="text-2xl font-bold text-gray-900">{stats.jobsApplied}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Messages Sent</p>
          <p className="text-2xl font-bold text-gray-900">{stats.messagesSent}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">STAR Stories</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.storiesComplete}/10
          </p>
        </div>
      </div>

      {/* Current Day CTA */}
      {user.currentDay <= 14 && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-primary-900">
                Day {user.currentDay}: {DAYS[user.currentDay - 1].title}
              </h2>
              <p className="text-primary-700 mt-1">
                {DAYS[user.currentDay - 1].description}
              </p>
              <p className="text-sm text-primary-600 mt-2">
                ⏱️ {DAYS[user.currentDay - 1].estimatedTime}
              </p>
            </div>
            <Link
              href={`/dashboard/day/${user.currentDay}`}
              className="btn-primary flex items-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* 14-Day Progress */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your 14-Day Journey
        </h2>
        <div className="grid gap-3">
          {DAYS.map((day) => {
            const status = getDayStatus(day.number);
            const isCurrentDay = day.number === user.currentDay;

            return (
              <div
                key={day.number}
                className={cn(
                  "border rounded-lg p-4 transition-all",
                  status === "completed" && "day-completed border-green-200",
                  status === "in-progress" && "day-in-progress border-yellow-200",
                  status === "unlocked" && "day-unlocked border-blue-200",
                  status === "locked" && "day-locked border-gray-200",
                  isCurrentDay && "ring-2 ring-primary-500"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {status === "completed" ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : status === "locked" ? (
                        <Lock className="w-6 h-6 text-gray-400" />
                      ) : (
                        <Circle className="w-6 h-6 text-blue-500" />
                      )}
                    </div>

                    {/* Day Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Day {day.number}</span>
                        {isCurrentDay && (
                          <span className="badge badge-blue text-xs">Current</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{day.title}</p>
                    </div>
                  </div>

                  {/* Action */}
                  {status !== "locked" && (
                    <Link
                      href={`/dashboard/day/${day.number}`}
                      className={cn(
                        "text-sm font-medium",
                        status === "completed"
                          ? "text-green-600 hover:text-green-700"
                          : "text-primary-600 hover:text-primary-700"
                      )}
                    >
                      {status === "completed" ? "Review" : "Start"}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
