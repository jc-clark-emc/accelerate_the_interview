import Link from "next/link";
import { Mail, Rocket } from "lucide-react";

export default function CheckEmailPage() {
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
            We&apos;ve sent you a login link. Click the link in the email to access
            your Interview Accelerator account.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-white/50 mb-6">
            <p className="font-medium text-white/70 mb-2">
              Didn&apos;t receive the email?
            </p>
            <ul className="list-disc list-inside text-left space-y-1">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email</li>
              <li>Wait a few minutes and try again</li>
            </ul>
          </div>

          <Link
            href="/login"
            className="text-[#00ffff] hover:text-[#ff1493] font-medium transition-colors"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
