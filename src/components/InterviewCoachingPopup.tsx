"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Sparkles, CheckCircle, Loader2 } from "lucide-react";

interface InterviewCoachingPopupProps {
  trigger?: "timer" | "immediate";
  delaySeconds?: number;
}

export function InterviewCoachingPopup({ 
  trigger = "timer", 
  delaySeconds = 30 
}: InterviewCoachingPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if already dismissed this session
    const dismissed = sessionStorage.getItem("coaching-popup-dismissed");
    if (dismissed) return;

    if (trigger === "immediate") {
      setIsOpen(true);
    } else {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, delaySeconds * 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger, delaySeconds]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("coaching-popup-dismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/coaching-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#0a0a0f] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#ff1493]/20 text-[#ff1493] px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Limited Availability
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Want 1-on-1 Interview Coaching?
          </h3>
          <p className="text-white/60">
            Get personalized prep with <span className="text-[#00ffff] font-semibold">Lynda Harvey</span>, 
            our expert interview coach who has helped 500+ candidates land offers.
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-white/80">
            <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0" />
            <span>60-minute 1-on-1 video session</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0" />
            <span>Mock interview with real-time feedback</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0" />
            <span>STAR story refinement for your top 3 stories</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0" />
            <span>Personalized salary negotiation strategy</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {status === "error" && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">
              {errorMessage}
            </div>
          )}
          
          <div className="mb-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#00ffff]/50 focus:ring-1 focus:ring-[#00ffff]/50"
            />
          </div>
          
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Calendar className="w-5 h-5" />
                Book Session - $129
              </>
            )}
          </button>
        </form>

        <p className="text-white/40 text-xs text-center mt-4">
          One-time payment. Session scheduled within 48 hours.
        </p>
      </div>
    </div>
  );
}
