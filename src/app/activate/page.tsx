"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

export default function ActivatePage() {
  const router = useRouter();
  const [step, setStep] = useState<"code" | "email">("code");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [tier, setTier] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Validate activation code
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/validate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid activation code");
      }

      setTier(data.tier);
      setStep("email");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Create account and send magic link
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Redirect to check email page
      router.push("/auth/check-email");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <span className="text-2xl font-bold text-primary-600">
            Interview Accelerator
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Activate Your Account
        </h2>
        <p className="mt-2 text-center text-gray-600">
          {step === "code"
            ? "Enter the activation code from your purchase PDF"
            : "Enter your email to complete activation"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "code"
                    ? "bg-primary-600 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {step === "email" ? <CheckCircle className="w-5 h-5" /> : "1"}
              </div>
              <span className="text-sm text-gray-600">Code</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "email"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <span className="text-sm text-gray-600">Email</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {/* Step 1: Enter Code */}
          {step === "code" && (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="label">
                  Activation Code
                </label>
                <input
                  id="code"
                  type="text"
                  required
                  className="input font-mono text-center tracking-wide"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="IA-XXX-XXXXX-XXXXX-XXXXX-XXXX"
                  autoComplete="off"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Find this code in the PDF you received after purchase
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !code}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Validate Code
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Enter Email */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {tier && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-800 font-medium">
                    ✓ {tier} Access Activated
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    {tier === "STARTER" && "14 days of access"}
                    {tier === "PRO" && "30 days of access with AI features"}
                    {tier === "PREMIUM" && "365 days of access with all features"}
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="label">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label htmlFor="email" className="label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
                <p className="mt-2 text-xs text-gray-500">
                  We'll send you a login link to this email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !name}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Account & Send Login Link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("code")}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to code entry
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
