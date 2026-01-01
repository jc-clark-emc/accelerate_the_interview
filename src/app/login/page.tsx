"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, Rocket } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="card py-12 px-4 sm:px-10 text-center">
            <div className="mx-auto w-16 h-16 bg-[#00ffff]/20 rounded-full flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-[#00ffff]" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              Check Your Email
            </h1>

            <p className="text-white/70 mb-6">
              We sent a login link to <strong className="text-white">{email}</strong>
            </p>

            <p className="text-sm text-white/50 mb-6">
              Click the link in the email to sign in. The link expires in 15 minutes.
            </p>

            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="text-[#00ffff] hover:text-[#ff1493] font-medium text-sm transition-colors"
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-2">
          <Rocket className="w-8 h-8 text-[#00ffff]" />
          <span className="text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#ff1493] bg-clip-text text-transparent">
            Interview Accelerator
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-white/60">
          Enter your email to receive a login link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card py-8 px-4 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !email}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Login Link
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-sm text-white/60">
              Don&apos;t have an account?{" "}
              <Link
                href="/activate"
                className="text-[#00ffff] hover:text-[#ff1493] font-medium transition-colors"
              >
                Activate with code
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
