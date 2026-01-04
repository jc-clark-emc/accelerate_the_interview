import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DAYS } from "@/lib/constants";
import { Lock, CheckCircle, Circle, ArrowRight, Briefcase, MessageSquare, FileText, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExpiredBanner } from "@/components/ExpiredBanner";

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
    if (dayNumber === user!.currentDay) return "unlocked";
    if (dayNumber < user!.currentDay) return "unlocked";
    return "locked";
  }

  // Check if subscription is expired
  const isExpired = user.subscription?.status === "READ_ONLY" || user.subscription?.status === "EXPIRED";
  const isEligibleForReactivation = isExpired && (user.subscription?.tier === "STARTER" || user.subscription?.tier === "PRO");
  const daysCompleted = user.dayProgress.filter(dp => dp.status === "COMPLETED").length;

  return (
    <div className="space-y-8">
      {/* Expired Banner */}
      {isEligibleForReactivation && user.subscription && (
        <ExpiredBanner 
          tier={user.subscription.tier as "STARTER" | "PRO"} 
          daysCompleted={daysCompleted} 
        />
      )}

      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-white/60 mt-1">
          You&apos;re on Day {user.currentDay} of your 14-day journey.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00ffff]/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#00ffff]" />
            </div>
            <div>
              <p className="text-sm text-white/50">Jobs Saved</p>
              <p className="text-2xl font-bold text-white">{stats.jobsSaved}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#10b981]/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <p className="text-sm text-white/50">Applications</p>
              <p className="text-2xl font-bold text-white">{stats.jobsApplied}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#a855f7]/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#a855f7]" />
            </div>
            <div>
              <p className="text-sm text-white/50">Messages Sent</p>
              <p className="text-2xl font-bold text-white">{stats.messagesSent}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff1493]/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#ff1493]" />
            </div>
            <div>
              <p className="text-sm text-white/50">STAR Stories</p>
              <p className="text-2xl font-bold text-white">{stats.storiesComplete}/10</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Day CTA */}
      {user.currentDay <= 14 && (
        <div className="card border-2 border-[#00ffff]/50 bg-[#00ffff]/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="badge badge-cyan mb-2">Current Focus</div>
              <h2 className="text-lg font-semibold text-white">
                Day {user.currentDay}: {DAYS[user.currentDay - 1].title}
              </h2>
              <p className="text-white/60 mt-1">
                {DAYS[user.currentDay - 1].description}
              </p>
              <p className="text-sm text-[#00ffff] mt-2">
                ⏱️ {DAYS[user.currentDay - 1].estimatedTime}
              </p>
            </div>
            <Link
              href={`/dashboard/day/${user.currentDay}`}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* 14-Day Progress */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
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
                  "card transition-all",
                  status === "completed" && "border-[#10b981]/30 bg-[#10b981]/5",
                  status === "in-progress" && "border-[#f59e0b]/30 bg-[#f59e0b]/5",
                  status === "unlocked" && "border-[#00ffff]/30",
                  status === "locked" && "border-white/5 opacity-50",
                  isCurrentDay && "ring-2 ring-[#00ffff]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {status === "completed" ? (
                        <CheckCircle className="w-6 h-6 text-[#10b981]" />
                      ) : status === "locked" ? (
                        <Lock className="w-6 h-6 text-white/30" />
                      ) : (
                        <Circle className="w-6 h-6 text-[#00ffff]" />
                      )}
                    </div>

                    {/* Day Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">Day {day.number}</span>
                        {isCurrentDay && (
                          <span className="badge badge-cyan text-xs">Current</span>
                        )}
                      </div>
                      <p className="text-sm text-white/60">{day.title}</p>
                    </div>
                  </div>

                  {/* Action */}
                  {status !== "locked" && (
                    <Link
                      href={`/dashboard/day/${day.number}`}
                      className={cn(
                        "text-sm font-medium transition-colors",
                        status === "completed"
                          ? "text-[#10b981] hover:text-[#10b981]/80"
                          : "text-[#00ffff] hover:text-[#ff1493]"
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
