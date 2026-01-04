"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, Mail, Rocket, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      const newCode = [...code];
      newCode[index] = value.replace(/\D/g, "");
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setVerifying(true);
    setError("");

    try {
      const result = await signIn("magic-link", {
        email,
        code: fullCode,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid or expired code. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setVerifying(false);
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
              We sent a login link and code to <strong className="text-white">{email}</strong>
            </p>

            {/* 6-digit code input */}
            <div className="mb-6">
              <p className="text-sm text-white/50 mb-4">
                Enter the 6-digit code from your email:
              </p>
              
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="flex justify-center gap-2 mb-4">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-colors"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={verifying || code.join("").length !== 6}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {verifying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Verify Code
                  </>
                )}
              </button>
            </div>

            <p className="text-sm text-white/50 mb-4">
              Or click the link in the email to sign in. Expires in 15 minutes.
            </p>

            <button
              onClick={() => {
                setSent(false);
                setEmail("");
                setCode(["", "", "", "", "", ""]);
                setError("");
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
                    Send Login Code
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
