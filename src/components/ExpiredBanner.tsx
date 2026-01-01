"use client";

import Link from "next/link";
import { AlertTriangle, Zap } from "lucide-react";
import { REACTIVATION_PRICING } from "@/lib/constants";

interface ExpiredBannerProps {
  tier: "STARTER" | "PRO";
  daysCompleted: number;
}

export function ExpiredBanner({ tier, daysCompleted }: ExpiredBannerProps) {
  const pricing = REACTIVATION_PRICING[tier];
  
  return (
    <div className="bg-gradient-to-r from-[#ff1493]/20 to-[#00ffff]/20 border-2 border-[#ff1493]/50 rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#ff1493]/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-[#ff1493]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Your access has expired
            </h3>
            <p className="text-white/60">
              You completed {daysCompleted} of 14 days. Your data is safe and in read-only mode.
            </p>
            <p className="text-white/80 mt-2">
              <span className="text-[#00ffff] font-semibold">Good news:</span> Pick up where you left off at 50% off!
            </p>
          </div>
        </div>
        
        <Link
          href="/reactivate"
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Zap className="w-4 h-4" />
          Reactivate for ${pricing.discountedPrice}
          <span className="text-white/60 line-through text-sm">${pricing.originalPrice}</span>
        </Link>
      </div>
    </div>
  );
}
