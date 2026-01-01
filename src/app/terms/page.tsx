"use client";

import Link from "next/link";
import { Rocket, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[#00ffff] hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Rocket className="w-8 h-8 text-[#00ffff]" />
          <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        </div>

        <div className="card prose prose-invert max-w-none">
          <p className="text-white/60 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-white/70">
              By accessing and using Interview Accelerator ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p className="text-white/70">
              Interview Accelerator is a 14-day job search coaching program that provides structured guidance, templates, and tools to help users prepare for job interviews. The Service includes access to a web-based dashboard, educational content, and depending on your subscription tier, AI-powered features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">3. Account Registration</h2>
            <p className="text-white/70 mb-4">
              To use the Service, you must:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Purchase access through our authorized payment processor</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 18 years old or have parental consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">4. Subscription Tiers & Access</h2>
            <p className="text-white/70 mb-4">
              We offer three subscription tiers:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li><strong className="text-white">Starter ($149):</strong> 14 days of full access</li>
              <li><strong className="text-white">Pro ($399):</strong> 30 days of full access with AI features</li>
              <li><strong className="text-white">Premium ($599):</strong> 365 days of full access with AI features and bonus content</li>
            </ul>
            <p className="text-white/70 mt-4">
              After your access period ends, your account becomes read-only. You may view your data but cannot make edits without upgrading.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">5. Payment & Refunds</h2>
            <p className="text-white/70 mb-4">
              All payments are processed through our authorized payment processor. Due to the digital nature of the product and immediate access granted upon purchase, <strong className="text-white">all sales are final and non-refundable</strong>.
            </p>
            <p className="text-white/70">
              If you experience technical issues that prevent you from accessing the Service, please contact us at support@engineermycareer.com within 7 days of purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">6. Acceptable Use</h2>
            <p className="text-white/70 mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Share your account credentials or activation code with others</li>
              <li>Reproduce, distribute, or resell any content from the Service</li>
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to reverse engineer or hack the Service</li>
              <li>Use automated systems to access the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">7. Intellectual Property</h2>
            <p className="text-white/70">
              All content, templates, and materials provided through the Service are owned by Engineer My Career and are protected by copyright. You may use these materials for your personal job search only. You may not redistribute, sell, or share these materials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-white/70">
              The Service is provided "as is" without warranties of any kind. We do not guarantee that you will receive job interviews or offers. Success depends on your effort, qualifications, market conditions, and many other factors outside our control.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
            <p className="text-white/70">
              To the maximum extent permitted by law, Engineer My Career shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">10. Changes to Terms</h2>
            <p className="text-white/70">
              We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">11. Contact</h2>
            <p className="text-white/70">
              For questions about these Terms of Service, contact us at:<br />
              <a href="mailto:support@engineermycareer.com" className="text-[#00ffff] hover:text-[#ff1493] transition-colors">
                support@engineermycareer.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
