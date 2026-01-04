"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2, ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function ReactivateSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    async function processReactivation() {
      if (!sessionId) {
        setError("No session ID provided");
        setStatus("error");
        return;
      }

      try {
        const res = await fetch("/api/reactivate/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to process reactivation");
        }

        setStatus("success");
      } catch (err: any) {
        setError(err.message);
        setStatus("error");
      }
    }

    processReactivation();
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#00ffff] animate-spin mx-auto mb-4" />
          <p className="text-white/60">Processing your reactivation...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-white/60 mb-4">
            If you completed payment, please contact support@engineermycareer.com
          </p>
          <Link href="/dashboard" className="text-[#00ffff] hover:text-[#ff1493]">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome Back!
        </h1>

        <p className="text-white/60 mb-8">
          Your account has been reactivated. All your previous progress has been restored.
        </p>

        <div className="card bg-[#00ffff]/5 border-[#00ffff]/30 mb-8">
          <div className="flex items-center gap-3 justify-center">
            <Rocket className="w-6 h-6 text-[#00ffff]" />
            <span className="text-white font-medium">
              Your timer has been reset. Time to finish strong!
            </span>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="btn-primary inline-flex items-center gap-2"
        >
          Continue to Dashboard
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

export default function ReactivateSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#00ffff] animate-spin" />
        </div>
      }
    >
      <ReactivateSuccessContent />
    </Suspense>
  );
}
