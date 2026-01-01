import Link from "next/link";
import { PRICING_TIERS } from "@/lib/constants";
import { Check, Rocket, ChevronDown, Star, TrendingUp, Users, Clock, Target, MessageSquare, FileText, Sparkles } from "lucide-react";
import PricingSection from "@/components/PricingSection";

export default function Home() {
  const painPoints = [
    { icon: FileText, text: "Tweaking your resume for every single role" },
    { icon: Target, text: "Sending applications into a black hole" },
    { icon: Clock, text: "Spending hours on job boards with nothing to show" },
    { icon: MessageSquare, text: "Not knowing what to say in networking messages" },
    { icon: Users, text: "Feeling alone while everyone else seems to be winning" },
    { icon: TrendingUp, text: "Wondering if you're even doing this right" },
  ];

  const programHighlights = [
    { days: "Days 1-2", title: "Know Yourself & Your Goals", description: "Build your professional identity and define exactly what you want" },
    { days: "Days 3-5", title: "Resume & LinkedIn Ready", description: "Craft compelling materials that get you noticed" },
    { days: "Days 6-7", title: "Networking Setup", description: "Prepare your outreach strategy and message templates" },
    { days: "Days 8-11", title: "Apply & Connect", description: "10 targeted applications + 60 networking messages" },
    { days: "Days 12-14", title: "Interview Ready", description: "STAR stories prepped and practiced on camera" },
  ];

  const companies = [
    "Google", "Microsoft", "Apple", "Amazon", "Meta", "Netflix", "Spotify", "LinkedIn", "Salesforce", "Adobe"
  ];

  const testimonials = [
    {
      quote: "I went from mass-applying to 50+ jobs a week to landing 3 interviews in my first week using this system. The networking templates alone were worth it.",
      name: "Marcus T.",
      role: "Software Engineer",
      company: "Now at a Fortune 500"
    },
    {
      quote: "Finally, a system that actually works. I was so tired of the generic advice. This gave me a clear roadmap and I followed it to my dream role.",
      name: "Priya S.",
      role: "Product Manager",
      company: "Landed remote role"
    },
    {
      quote: "The STAR story prep saved me in my final round. I walked in confident because I had already practiced every answer on camera.",
      name: "James L.",
      role: "Data Analyst",
      company: "40% salary increase"
    },
  ];

  const faqs = [
    {
      question: "How is this different from other job search advice?",
      answer: "This isn't advice—it's a system. You get a daily checklist, templates you can copy-paste, and a dashboard that tracks everything. No guessing what to do next."
    },
    {
      question: "What if I can't commit 30 minutes every day?",
      answer: "Life happens. The program is flexible—you can pause and pick up where you left off. Your access doesn't expire based on calendar days, but on active days you use."
    },
    {
      question: "I'm not in tech. Will this work for me?",
      answer: "Yes. The principles—targeted applications, strategic networking, compelling stories—work across industries. The templates are customizable to any field."
    },
    {
      question: "What's the difference between the tiers?",
      answer: "Starter gives you the full 14-day system. Pro adds AI-powered resume and message optimization. Premium includes salary negotiation scripts, 90-day plans, and a full year of access."
    },
    {
      question: "Can I get a refund?",
      answer: "Due to the digital nature of the product, we don't offer refunds. But we're confident—if you do the work, you'll see results."
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="nav-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-[#00ffff]" />
              <span className="text-xl font-bold bg-gradient-to-r from-[#00ffff] to-[#ff1493] bg-clip-text text-transparent">
                Interview Accelerator
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/activate" className="text-[#00ffff] hover:text-white transition-colors text-sm font-medium hidden md:block">
                Already purchased? Activate →
              </Link>
              <Link href="/login" className="nav-link">Login</Link>
              <a href="#pricing" className="btn-primary">Get Started</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Activate Banner */}
      <div className="md:hidden bg-[#00ffff]/10 border-b border-[#00ffff]/20 py-2 px-4 text-center">
        <Link href="/activate" className="text-[#00ffff] text-sm font-medium">
          Already purchased? Activate your account →
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#00ffff] rounded-full filter blur-[128px]"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#ff1493] rounded-full filter blur-[128px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="badge badge-cyan mb-6 inline-flex">
            <Sparkles className="w-4 h-4" />
            Get Interview-Ready in 14 Days
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Stop Applying Into the Void.</span>
            <span className="block bg-gradient-to-r from-[#00ffff] to-[#ff1493] bg-clip-text text-transparent">
              Start Getting Interviews.
            </span>
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            A proven 14-day system to transform your job search. 30 minutes a day. 
            Clear steps. Real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pricing" className="btn-primary text-lg px-8 py-4">
              Start Your Transformation
            </a>
            <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="badge badge-pink mb-4 inline-flex">
              End the Struggle
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              You&apos;re doing everything &quot;right&quot;
              <span className="block text-white/60">but still not getting interviews?</span>
            </h2>
            <p className="text-xl text-[#ff1493]">Any of these sound familiar?</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {painPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <div key={i} className="card flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ff1493]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#ff1493]" />
                  </div>
                  <p className="text-white/80">{point.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <div className="card inline-block max-w-2xl">
              <p className="text-lg text-white/80">
                <span className="text-[#00ffff] font-semibold">Finding a job is a whole job...</span>
                <br />
                <span className="text-white/60">And that&apos;s why we built Interview Accelerator—to do the heavy lifting for you.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="badge badge-cyan mb-4 inline-flex">
              The System
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your 14-Day Transformation
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Each day builds on the last. By day 14, you&apos;ll have everything you need to land interviews.
            </p>
          </div>

          <div className="space-y-4">
            {programHighlights.map((phase, i) => (
              <div key={i} className="card flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-shrink-0">
                  <span className="badge badge-purple">{phase.days}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{phase.title}</h3>
                  <p className="text-white/60">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="stat-box">
              <div className="stat-number">10</div>
              <div className="stat-label">Targeted Applications</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">60</div>
              <div className="stat-label">Networking Messages</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">10</div>
              <div className="stat-label">STAR Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Companies */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="badge badge-green mb-4 inline-flex">
              <TrendingUp className="w-4 h-4" />
              Where Our Users Land
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Join Professionals at Leading Companies
            </h2>
            <p className="text-white/60">Our system has helped job seekers land roles at top companies</p>
          </div>

          <div className="relative overflow-hidden py-8">
            <div className="flex gap-12 animate-marquee">
              {[...companies, ...companies].map((company, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 px-6 py-3 bg-white/5 rounded-lg border border-white/10 text-white/60 font-medium"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#ff1493] bg-clip-text text-transparent">2,500+</div>
              <div className="text-white/50 text-sm">Job Seekers Helped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#ff1493] bg-clip-text text-transparent">89%</div>
              <div className="text-white/50 text-sm">Interview Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#ff1493] bg-clip-text text-transparent">21 Days</div>
              <div className="text-white/50 text-sm">Avg. Time to Interview</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="badge badge-purple mb-4 inline-flex">
              <Star className="w-4 h-4" />
              Success Stories
            </div>
            <h2 className="text-3xl font-bold text-white">
              Real Results from Real People
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="card">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-white/50 text-sm">{testimonial.role}</p>
                  <p className="text-[#00ffff] text-sm">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="badge badge-cyan mb-4 inline-flex">
              Invest in Your Career
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-white/60">One-time purchase. No subscriptions. Your data stays yours.</p>
          </div>

          <PricingSection />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="badge badge-purple mb-4 inline-flex">
              Got Questions?
            </div>
            <h2 className="text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="card group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-white/50 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-4 text-white/70 border-t border-white/10 pt-4">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl text-white/60 mb-8">
            Join thousands who&apos;ve gone from frustrated to interview-ready in just 14 days.
          </p>
          <a href="#pricing" className="btn-primary text-lg px-12 py-4 inline-block">
            Get Started Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-[#00ffff]" />
              <span className="font-semibold bg-gradient-to-r from-[#00ffff] to-[#ff1493] bg-clip-text text-transparent">
                Interview Accelerator
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="text-white/50 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-white/50 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <a href="mailto:support@engineermycareer.com" className="text-white/50 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Engineer My Career. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
