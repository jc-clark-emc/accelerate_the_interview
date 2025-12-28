import Link from "next/link";
import { PRICING_TIERS, DAYS } from "@/lib/constants";
import { Check } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary-600">
                Interview Accelerator
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Login
              </Link>
              <Link href="/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Land Your Dream Job in 14 Days
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
            A structured program that takes you from scattered job seeker to
            confident candidate. 30 minutes a day. Clear steps. Real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Start Your 14-Day Journey
            </Link>
            <a
              href="#pricing"
              className="border border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* What You'll Accomplish */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            What You'll Accomplish
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            In just 14 days, spending only 30 minutes each day, you'll build
            everything you need to land interviews faster.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DAYS.map((day) => (
              <div key={day.number} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-primary-100 text-primary-600 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    {day.number}
                  </span>
                  <h3 className="font-semibold">{day.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{day.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Choose Your Plan
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Pick the plan that fits your timeline. All plans include the full
            14-day program and dashboard access.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="card border-2">
              <h3 className="text-xl font-bold mb-2">
                {PRICING_TIERS.STARTER.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">
                  ${PRICING_TIERS.STARTER.price}
                </span>
              </div>
              <p className="text-gray-600 mb-6">
                {PRICING_TIERS.STARTER.days} days to complete
              </p>
              <ul className="space-y-3 mb-8">
                {PRICING_TIERS.STARTER.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://stan.store/YOUR_STORE/starter"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full text-center block"
              >
                Buy on Stan Store
              </a>
            </div>

            {/* Pro - Most Popular */}
            <div className="card border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">
                {PRICING_TIERS.PRO.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">
                  ${PRICING_TIERS.PRO.price}
                </span>
              </div>
              <p className="text-gray-600 mb-6">
                {PRICING_TIERS.PRO.days} days to complete
              </p>
              <ul className="space-y-3 mb-8">
                {PRICING_TIERS.PRO.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://stan.store/YOUR_STORE/pro"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center block"
              >
                Buy on Stan Store
              </a>
            </div>

            {/* Premium */}
            <div className="card border-2">
              <h3 className="text-xl font-bold mb-2">
                {PRICING_TIERS.PREMIUM.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">
                  ${PRICING_TIERS.PREMIUM.price}
                </span>
              </div>
              <p className="text-gray-600 mb-6">
                {PRICING_TIERS.PREMIUM.days} days of access
              </p>
              <ul className="space-y-3 mb-8">
                {PRICING_TIERS.PREMIUM.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://stan.store/YOUR_STORE/premium"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full text-center block"
              >
                Buy on Stan Store
              </a>
            </div>
          </div>

          {/* Clear Terms */}
          <div className="mt-12 text-center text-sm text-gray-500 max-w-2xl mx-auto">
            <p className="font-medium mb-2">What you're purchasing:</p>
            <p>
              Starter: 14 days of full access. Pro: 30 days of full access with
              AI features. Premium: 365 days of full access with AI features and
              bonus content. After your access period ends, your data becomes
              read-only. You can upgrade at any time to restore full access.
            </p>
            <p className="mt-4">
              <Link href="/activate" className="text-primary-600 hover:text-primary-500 font-medium">
                Already purchased? Activate your account here →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl font-bold text-white mb-4">
            Interview Accelerator
          </p>
          <p className="text-sm">
            © {new Date().getFullYear()} Interview Accelerator. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
