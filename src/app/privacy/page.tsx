"use client";

import Link from "next/link";
import { Rocket, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[#00ffff] hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Rocket className="w-8 h-8 text-[#00ffff]" />
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        </div>

        <div className="card prose prose-invert max-w-none">
          <p className="text-white/60 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="text-white/70">
              Engineer My Career ("we", "our", or "us") operates Interview Accelerator. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-white mt-4 mb-2">Information You Provide</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li><strong className="text-white">Account Information:</strong> Name, email address</li>
              <li><strong className="text-white">Career Information:</strong> Skills, work history, job preferences, resume content</li>
              <li><strong className="text-white">Job Search Data:</strong> Jobs you save, applications you track, networking contacts</li>
              <li><strong className="text-white">STAR Stories:</strong> Interview preparation content you create</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4 mb-2">Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>IP address</li>
              <li>Pages visited and features used</li>
              <li>Time and date of visits</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-white/70 mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Provide and maintain the Service</li>
              <li>Personalize your experience</li>
              <li>Process your transactions</li>
              <li>Send you service-related communications</li>
              <li>Provide AI-powered features (Pro and Premium tiers)</li>
              <li>Improve our Service</li>
              <li>Respond to your inquiries</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">4. AI Features & Data Processing</h2>
            <p className="text-white/70 mb-4">
              If you use our AI-powered features (available in Pro and Premium tiers), your content may be processed by third-party AI services (OpenAI) to provide:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Resume bullet improvements</li>
              <li>STAR story coaching</li>
              <li>Networking message variations</li>
              <li>Salary negotiation scripts</li>
            </ul>
            <p className="text-white/70 mt-4">
              We do not store your data on third-party AI systems beyond what's necessary to process your request. OpenAI's data usage is governed by their privacy policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">5. Data Sharing</h2>
            <p className="text-white/70 mb-4">We do NOT sell your personal information. We may share your information with:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li><strong className="text-white">Service Providers:</strong> Payment processors (Stan Store), email services (Resend), database hosting (Neon)</li>
              <li><strong className="text-white">AI Providers:</strong> OpenAI (for Pro/Premium AI features)</li>
              <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">6. Data Security</h2>
            <p className="text-white/70">
              We implement appropriate technical and organizational measures to protect your personal information, including encryption in transit (HTTPS) and at rest, secure authentication, and access controls. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">7. Data Retention</h2>
            <p className="text-white/70">
              We retain your data for as long as your account is active or as needed to provide the Service. After your subscription ends, your data remains in read-only mode. You may request deletion of your account and associated data at any time by contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">8. Your Rights</h2>
            <p className="text-white/70 mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="text-white/70 mt-4">
              To exercise these rights, contact us at support@engineermycareer.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">9. Cookies</h2>
            <p className="text-white/70">
              We use essential cookies to maintain your session and remember your preferences. We do not use third-party advertising cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">10. Children's Privacy</h2>
            <p className="text-white/70">
              The Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">11. Changes to This Policy</h2>
            <p className="text-white/70">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">12. Contact Us</h2>
            <p className="text-white/70">
              For questions about this Privacy Policy, contact us at:<br />
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
