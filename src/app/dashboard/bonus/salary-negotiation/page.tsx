"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  Sparkles,
  Lock,
  Copy,
  Check,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

export default function SalaryNegotiationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    role: "",
    currentOffer: "",
    targetSalary: "",
    yearsExperience: "",
    accomplishments: "",
    marketData: "",
  });

  const [script, setScript] = useState<{
    openingStatement: string;
    counterOfferScript: string;
    negotiationTips: string[];
    walkAwayGuidance: string;
  } | null>(null);

  // Check premium status
  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await fetch("/api/subscription/status");
        if (res.ok) {
          const data = await res.json();
          setIsPremium(data.tier === "PREMIUM");
        }
      } catch (err) {
        console.error("Failed to check subscription:", err);
      } finally {
        setLoading(false);
      }
    }
    checkAccess();
  }, []);

  // Generate script
  const handleGenerate = async () => {
    if (!formData.role || !formData.currentOffer || !formData.targetSalary) {
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/ai/salary-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: formData.role,
          currentOffer: parseInt(formData.currentOffer),
          targetSalary: parseInt(formData.targetSalary),
          yearsExperience: parseInt(formData.yearsExperience) || 0,
          keyAccomplishments: formData.accomplishments
            .split("\n")
            .filter(Boolean),
          marketData: formData.marketData,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setScript(data);
      }
    } catch (err) {
      console.error("Failed to generate script:", err);
    } finally {
      setGenerating(false);
    }
  };

  // Copy to clipboard
  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Premium Feature</h1>
        <p className="text-gray-600 mb-6">
          Salary negotiation scripts are available on the Premium plan.
        </p>
        <Link href="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-bold">Salary Negotiation Scripts</h1>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
            PREMIUM
          </span>
        </div>
        <p className="text-gray-600">
          Get AI-generated negotiation scripts personalized to your situation.
        </p>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Before you negotiate:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Research market rates on Glassdoor, Levels.fyi, Payscale</li>
              <li>Know your minimum acceptable salary</li>
              <li>Have competing offers if possible</li>
              <li>Practice out loud before the call</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card mb-6">
        <h2 className="font-semibold mb-4">Your Situation</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Role/Position</label>
            <input
              type="text"
              className="input"
              placeholder="Senior Product Manager"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Current Offer</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  className="input pl-7"
                  placeholder="120000"
                  value={formData.currentOffer}
                  onChange={(e) =>
                    setFormData({ ...formData, currentOffer: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="label">Target Salary</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  className="input pl-7"
                  placeholder="140000"
                  value={formData.targetSalary}
                  onChange={(e) =>
                    setFormData({ ...formData, targetSalary: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <label className="label">Years of Experience</label>
            <input
              type="number"
              className="input w-32"
              placeholder="5"
              value={formData.yearsExperience}
              onChange={(e) =>
                setFormData({ ...formData, yearsExperience: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label">Key Accomplishments (one per line)</label>
            <textarea
              className="input min-h-[100px]"
              placeholder="Led a team of 5 to launch product ahead of schedule&#10;Increased revenue by 25% through new feature&#10;Reduced customer churn by 15%"
              value={formData.accomplishments}
              onChange={(e) =>
                setFormData({ ...formData, accomplishments: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label">Market Data (optional)</label>
            <textarea
              className="input min-h-[80px]"
              placeholder="e.g., Glassdoor shows $130-150k for this role in SF, I have a competing offer at $135k"
              value={formData.marketData}
              onChange={(e) =>
                setFormData({ ...formData, marketData: e.target.value })
              }
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={
              generating ||
              !formData.role ||
              !formData.currentOffer ||
              !formData.targetSalary
            }
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              "Generating..."
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Negotiation Script
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Script */}
      {script && (
        <div className="space-y-4">
          <h2 className="font-semibold">Your Negotiation Script</h2>

          {/* Opening Statement */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Opening Statement</h3>
              <button
                onClick={() => handleCopy("opening", script.openingStatement)}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                {copied === "opening" ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {script.openingStatement}
            </p>
          </div>

          {/* Counter Offer Script */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Counter-Offer Script</h3>
              <button
                onClick={() => handleCopy("counter", script.counterOfferScript)}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                {copied === "counter" ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
              {script.counterOfferScript}
            </p>
          </div>

          {/* Tips */}
          <div className="card">
            <h3 className="font-medium mb-3">Negotiation Tips</h3>
            <ul className="space-y-2">
              {script.negotiationTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="bg-primary-100 text-primary-600 font-bold w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Walk Away Guidance */}
          <div className="card bg-yellow-50 border-yellow-200">
            <h3 className="font-medium mb-2">When to Walk Away</h3>
            <p className="text-sm text-yellow-800">{script.walkAwayGuidance}</p>
          </div>
        </div>
      )}
    </div>
  );
}
