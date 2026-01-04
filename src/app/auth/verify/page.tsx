"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Invalid login link. Please request a new one.");
      return;
    }

    // Use the token to sign in
    async function verify() {
      try {
        const result = await signIn("magic-link", {
          token,
          redirect: false,
        });

        if (result?.error) {
          setStatus("error");
          setError(result.error);
        } else {
          setStatus("success");
          // Redirect to dashboard after short delay
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      } catch (err: any) {
        setStatus("error");
        setError("Something went wrong. Please try again.");
      }
    }

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-6" />
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Verifying your login...
              </h1>
              <p className="text-gray-600">Just a moment</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                You're logged in!
              </h1>
              <p className="text-gray-600">Redirecting to your dashboard...</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Login Failed
              </h1>
              <p className="text-red-600 mb-6">{error}</p>
              <Link href="/login" className="btn-primary">
                Try Again
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-12 px-4 shadow sm:rounded-lg sm:px-10 text-center">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-6" />
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Loading...
              </h1>
            </div>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
