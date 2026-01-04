import { CheckCircle, Calendar, Mail } from "lucide-react";
import Link from "next/link";

export default function CoachingSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          You're Booked!
        </h1>

        <p className="text-white/60 mb-8">
          Thank you for booking a 1-on-1 coaching session with Lynda Harvey.
        </p>

        <div className="card text-left space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#00ffff] mt-0.5" />
            <div>
              <p className="text-white font-medium">Check your email</p>
              <p className="text-white/60 text-sm">
                You'll receive a confirmation email with next steps.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[#00ffff] mt-0.5" />
            <div>
              <p className="text-white font-medium">Scheduling</p>
              <p className="text-white/60 text-sm">
                Lynda will reach out within 48 hours to schedule your session.
              </p>
            </div>
          </div>
        </div>

        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
