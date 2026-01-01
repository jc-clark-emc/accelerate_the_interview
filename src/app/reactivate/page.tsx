"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Rocket, Zap, Check, ArrowLeft, Loader2, Clock, Target, Sparkles } from "lucide-react";

interface ReactivationData {
  tier: "STARTER" | "PRO";
  originalPrice: number;
  discountedPrice: number;
  days: number;
  daysCompleted: number;
  email: string;
}

export default function ReactivatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<ReactivationData | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function fetchReactivationData() {
      try {
        const res = await fetch("/api/reactivate/check");
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Unable to check reactivation status");
        }

        if (!result.eligible) {
          router.push("/dashboard");
          return;
        }

        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReactivationData();
  }, [router]);

  const handleReactivate = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/reactivate/create-code", {
        method: "POST",
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create reactivation code");
      }

      // Redirect to Stan Store with the discount code
      // Or if using Stripe, redirect to checkout
      window.location.href = result.checkoutUrl;
    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00ffff] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/dashboard" className="text-[#00ffff] hover:text-[#ff1493] transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#00ffff] hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Rocket className="w-8 h-8 text-[#00ffff]" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-[#ff1493] bg-clip-text text-transparent">
              Welcome Back!
            </h1>
          </div>
          <p className="text-white/60 text-lg">
            Pick up where you left off with 50% off
          </p>
        </div>

        {/* Progress Summary */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#00ffff]" />
            Your Progress
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-[#00ffff]">{data.daysCompleted}</p>
              <p className="text-white/50 text-sm">Days Completed</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-[#ff1493]">{14 - data.daysCompleted}</p>
              <p className="text-white/50 text-sm">Days Remaining</p>
            </div>
          </div>
          <p className="text-white/60 mt-4 text-sm">
            All your data is saved: jobs, contacts, STAR stories, and profile.
          </p>
        </div>

        {/* Reactivation Offer */}
        <div className="card border-2 border-[#00ffff]/50 bg-[#00ffff]/5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#00ffff]" />
            <span className="badge badge-cyan">Special Offer</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Reactivate Your {data.tier} Plan
          </h2>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-4xl font-bold bg-gradient-to-r from-[#00ffff] to-[#ff1493] bg-clip-text text-transparent">
              ${data.discountedPrice}
            </span>
            <span className="text-white/40 line-through text-xl">${data.originalPrice}</span>
            <span className="badge badge-green">50% OFF</span>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3 text-white/80">
              <Check className="w-5 h-5 text-[#10b981]" />
              {data.days} more days to complete the program
            </li>
            <li className="flex items-center gap-3 text-white/80">
              <Check className="w-5 h-5 text-[#10b981]" />
              Keep all your existing data and progress
            </li>
            <li className="flex items-center gap-3 text-white/80">
              <Check className="w-5 h-5 text-[#10b981]" />
              Full access to all {data.tier === "PRO" ? "AI-powered " : ""}features
            </li>
            <li className="flex items-center gap-3 text-white/80">
              <Clock className="w-5 h-5 text-[#10b981]" />
              Start right where you left off
            </li>
          </ul>

          <button
            onClick={handleReactivate}
            disabled={processing}
            className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50"
          >
            {processing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Reactivate Now for ${data.discountedPrice}
              </>
            )}
          </button>

          <p className="text-white/40 text-sm text-center mt-4">
            One-time payment. No subscriptions.
          </p>
        </div>

        {/* Contact */}
        <p className="text-center text-white/40 text-sm mt-8">
          Questions? Email us at{" "}
          <a href="mailto:support@engineermycareer.com" className="text-[#00ffff] hover:text-[#ff1493] transition-colors">
            support@engineermycareer.com
          </a>
        </p>
      </div>
    </div>
  );
}
