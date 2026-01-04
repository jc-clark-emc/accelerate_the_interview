"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle, Copy, Check, ArrowRight, Rocket } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const PLAN_NAMES: Record<string, string> = {
  starter: "Starter",
  pro: "Pro",
  premium: "Premium",
};

const PLAN_FEATURES: Record<string, string[]> = {
  starter: [
    "Full 14-day guided program",
    "16 days to complete",
    "Career profile dashboard",
    "Job tracker with match scores",
    "STAR story builder",
  ],
  pro: [
    "Everything in Starter",
    "32 days to complete",
    "AI resume bullet optimizer",
    "AI STAR story coach",
    "AI networking message generator",
  ],
  premium: [
    "Everything in Pro",
    "365 days of access",
    "AI salary negotiation scripts",
    "First 90 days success plan",
    "Weekly wins tracker",
  ],
};

function PurchaseSuccessContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const plan = searchParams.get("plan") || "pro";
  const email = searchParams.get("email") || "";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e] text-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Interview Accelerator!
          </h1>
          <p className="text-xl text-gray-400">
            Your {PLAN_NAMES[plan]} plan is ready. Here's your activation code.
          </p>
        </div>

        {/* Activation Code Box */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-500/30 rounded-2xl p-8 mb-8">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-3 text-center">
            Your Activation Code
          </p>
          <div className="flex items-center justify-center gap-4">
            <code className="text-2xl md:text-3xl font-mono font-bold bg-black/30 px-6 py-4 rounded-xl border border-white/10 tracking-wider">
              {code}
            </code>
            <button
              onClick={handleCopy}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Copy code"
            >
              {copied ? (
                <Check className="w-6 h-6 text-green-400" />
              ) : (
                <Copy className="w-6 h-6" />
              )}
            </button>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            Save this code! You'll need it to activate your account.
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-cyan-400" />
            Activate Your Account
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">Go to the activation page</p>
                <p className="text-gray-400 text-sm">Click the button below or visit engineermycareer.com/activate</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">Enter your activation code</p>
                <p className="text-gray-400 text-sm">Paste the code shown above</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">Create your account</p>
                <p className="text-gray-400 text-sm">Enter your name and email ({email}). We'll send you a magic link.</p>
              </div>
            </div>
          </div>

          <Link
            href="/activate"
            className="mt-8 w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            Activate Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* What's Included */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-4">
            What's Included in {PLAN_NAMES[plan]}
          </h2>
          <ul className="space-y-3">
            {PLAN_FEATURES[plan]?.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Confirmation Email Note */}
        <p className="text-center text-gray-500 text-sm mt-8">
          A confirmation email has been sent to {email}.
          <br />
          If you have any issues, contact jc@engineermycareer.com
        </p>
      </div>
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        </div>
      }
    >
      <PurchaseSuccessContent />
    </Suspense>
  );
}
