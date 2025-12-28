"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Briefcase,
  LogOut,
  Menu,
  X,
  DollarSign,
  Calendar,
  Trophy,
  Crown,
  Rocket,
} from "lucide-react";
import { useState } from "react";

interface DashboardNavProps {
  user: {
    name: string | null;
    email: string;
    currentDay: number;
  };
  subscription: {
    tier: string;
    status: string;
    daysRemaining: number;
  };
}

export function DashboardNav({ user, subscription }: DashboardNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPremium = subscription.tier === "PREMIUM";
  const isReadOnly = subscription.status === "READ_ONLY" || subscription.status === "EXPIRED";

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/jobs", label: "Job Tracker", icon: Briefcase },
  ];

  const bonusItems = isPremium
    ? [
        { href: "/dashboard/bonus/salary-negotiation", label: "Salary Scripts", icon: DollarSign },
        { href: "/dashboard/bonus/first-90-days", label: "90-Day Plan", icon: Calendar },
        { href: "/dashboard/bonus/weekly-wins", label: "Weekly Wins", icon: Trophy },
      ]
    : [];

  return (
    <nav className="nav-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Nav Items */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-neon-cyan" />
              <span className="text-xl font-bold title-accent">
                Interview Accelerator
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center ml-10 space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "nav-link-active"
                        : "nav-link"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}

              {/* Premium Bonus Items */}
              {bonusItems.length > 0 && (
                <>
                  <span className="text-white/20 px-2">|</span>
                  {bonusItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30"
                            : "text-white/70 hover:text-yellow-400 hover:bg-yellow-500/10"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Subscription Badge */}
            <div className="hidden sm:flex items-center gap-2">
              {isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
              {isReadOnly ? (
                <span className="badge badge-yellow">
                  Read Only
                </span>
              ) : (
                <span className={`badge ${isPremium ? "badge-yellow" : "badge-green"}`}>
                  {subscription.tier} • {subscription.daysRemaining}d
                </span>
              )}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-white/60">
                {user.name || user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-white/40 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white/70 hover:text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive
                      ? "nav-link-active"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            {/* Premium Bonus Items in Mobile */}
            {bonusItems.length > 0 && (
              <>
                <hr className="border-white/10 my-3" />
                <p className="px-4 text-xs text-yellow-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                  <Crown className="w-3 h-3" />
                  Premium Features
                </p>
                {bonusItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                        isActive
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "text-white/70 hover:text-yellow-400"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </>
            )}

            <hr className="border-white/10 my-3" />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 w-full hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
