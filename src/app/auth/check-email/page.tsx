import Link from "next/link";
import { Mail } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-primary-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h1>

          <p className="text-gray-600 mb-6">
            We've sent you a login link. Click the link in the email to access
            your Interview Accelerator account.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 mb-6">
            <p className="font-medium text-gray-700 mb-1">
              Didn't receive the email?
            </p>
            <ul className="list-disc list-inside text-left space-y-1">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email</li>
              <li>Wait a few minutes and try again</li>
            </ul>
          </div>

          <Link
            href="/login"
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
