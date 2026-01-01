"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { PRICING_TIERS } from "@/lib/constants";

export default function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [showEmailModal, setShowEmailModal] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleCheckout = async (plan: string) => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(plan);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan }),
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error || "Something went wrong");
        setLoading(null);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(null);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Starter */}
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-2">{PRICING_TIERS.STARTER.name}</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-[#00ffff] to-[#ff1493] bg-clip-text text-transparent mb-1">
            ${PRICING_TIERS.STARTER.price}
          </p>
          <p className="text-white/50 text-sm mb-6">{PRICING_TIERS.STARTER.days} days to complete</p>
          <ul className="space-y-3 mb-8">
            {PRICING_TIERS.STARTER.features.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm text-white/70">
                <Check className="w-4 h-4 text-[#10b981] flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShowEmailModal("starter")}
            className="btn-secondary w-full"
          >
            Get Starter
          </button>
        </div>

        {/* Pro */}
        <div className="card border border-[#00ffff]/50 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge badge-cyan text-xs">MOST POPULAR</div>
          <h3 className="text-xl font-bold text-white mb-2">{PRICING_TIERS.PRO.name}</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-[#00ffff] to-[#ff1493] bg-clip-text text-transparent mb-1">
            ${PRICING_TIERS.PRO.price}
          </p>
          <p className="text-white/50 text-sm mb-6">{PRICING_TIERS.PRO.days} days to complete</p>
          <ul className="space-y-3 mb-8">
            {PRICING_TIERS.PRO.features.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm text-white/70">
                <Check className="w-4 h-4 text-[#10b981] flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShowEmailModal("pro")}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Get Pro
          </button>
        </div>

        {/* Premium */}
        <div className="card relative">
          <div className="absolute -top-3 right-4 badge badge-yellow text-xs">BEST VALUE</div>
          <h3 className="text-xl font-bold text-white mb-2">{PRICING_TIERS.PREMIUM.name}</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-[#00ffff] to-[#ff1493] bg-clip-text text-transparent mb-1">
            ${PRICING_TIERS.PREMIUM.price}
          </p>
          <p className="text-white/50 text-sm mb-6">{PRICING_TIERS.PREMIUM.days} days of access</p>
          <ul className="space-y-3 mb-8">
            {PRICING_TIERS.PREMIUM.features.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm text-white/70">
                <Check className="w-4 h-4 text-[#10b981] flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShowEmailModal("premium")}
            className="btn-secondary w-full"
          >
            Get Premium
          </button>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-2">
              Get {showEmailModal.charAt(0).toUpperCase() + showEmailModal.slice(1)}
            </h3>
            <p className="text-white/60 mb-6">
              Enter your email to continue to secure checkout.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00ffff]/50"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                onClick={() => handleCheckout(showEmailModal)}
                disabled={loading === showEmailModal}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading === showEmailModal ? "Loading..." : "Continue to Checkout"}
              </button>

              <button
                onClick={() => {
                  setShowEmailModal(null);
                  setEmail("");
                  setError("");
                }}
                className="w-full text-white/50 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
