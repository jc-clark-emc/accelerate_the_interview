"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  Lock,
  Rocket,
  Users,
  Target,
} from "lucide-react";
import Link from "next/link";

interface NinetyDayPlan {
  days1to30: { focus: string; goals: string[]; actions: string[] };
  days31to60: { focus: string; goals: string[]; actions: string[] };
  days61to90: { focus: string; goals: string[]; actions: string[] };
  quickWins: string[];
  relationshipsToBuild: string[];
}

export default function First90DaysPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    company: "",
    industry: "",
    teamSize: "",
    reportingTo: "",
    responsibilities: "",
  });

  const [plan, setPlan] = useState<NinetyDayPlan | null>(null);

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

  // Generate plan
  const handleGenerate = async () => {
    if (!formData.role || !formData.company) {
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/ai/90-day-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: formData.role,
          company: formData.company,
          industry: formData.industry,
          teamSize: formData.teamSize ? parseInt(formData.teamSize) : undefined,
          reportingTo: formData.reportingTo,
          keyResponsibilities: formData.responsibilities
            .split("\n")
            .filter(Boolean),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPlan(data);
      }
    } catch (err) {
      console.error("Failed to generate plan:", err);
    } finally {
      setGenerating(false);
    }
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
          The First 90 Days guide is available on the Premium plan.
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
            <Calendar className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-bold">First 90 Days Plan</h1>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
            PREMIUM
          </span>
        </div>
        <p className="text-gray-600">
          Get a personalized roadmap to make an impact in your new role.
        </p>
      </div>

      {/* Form */}
      <div className="card mb-6">
        <h2 className="font-semibold mb-4">New Role Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Role/Title</label>
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
            <div>
              <label className="label">Company</label>
              <input
                type="text"
                className="input"
                placeholder="Acme Inc"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Industry</label>
              <input
                type="text"
                className="input"
                placeholder="B2B SaaS"
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Team Size (if managing)</label>
              <input
                type="number"
                className="input"
                placeholder="5"
                value={formData.teamSize}
                onChange={(e) =>
                  setFormData({ ...formData, teamSize: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="label">Reporting To</label>
            <input
              type="text"
              className="input"
              placeholder="VP of Product"
              value={formData.reportingTo}
              onChange={(e) =>
                setFormData({ ...formData, reportingTo: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label">Key Responsibilities (one per line)</label>
            <textarea
              className="input min-h-[100px]"
              placeholder="Own the product roadmap for core platform&#10;Lead a team of 3 PMs&#10;Drive 20% increase in user engagement"
              value={formData.responsibilities}
              onChange={(e) =>
                setFormData({ ...formData, responsibilities: e.target.value })
              }
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !formData.role || !formData.company}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              "Generating..."
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate 90-Day Plan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Plan */}
      {plan && (
        <div className="space-y-6">
          <h2 className="font-semibold">Your 90-Day Plan</h2>

          {/* Days 1-30 */}
          <div className="card border-l-4 border-l-blue-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Days 1-30
              </span>
              <span className="text-gray-500">Learn & Listen</span>
            </div>
            <p className="font-medium text-gray-900 mb-3">{plan.days1to30.focus}</p>
            
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-2">Goals:</p>
              <ul className="space-y-1">
                {plan.days1to30.goals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Target className="w-4 h-4 text-blue-500 mt-0.5" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Actions:</p>
              <ul className="space-y-1">
                {plan.days1to30.actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-500">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Days 31-60 */}
          <div className="card border-l-4 border-l-purple-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                Days 31-60
              </span>
              <span className="text-gray-500">Contribute & Connect</span>
            </div>
            <p className="font-medium text-gray-900 mb-3">{plan.days31to60.focus}</p>
            
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-2">Goals:</p>
              <ul className="space-y-1">
                {plan.days31to60.goals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Target className="w-4 h-4 text-purple-500 mt-0.5" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Actions:</p>
              <ul className="space-y-1">
                {plan.days31to60.actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-purple-500">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Days 61-90 */}
          <div className="card border-l-4 border-l-green-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                Days 61-90
              </span>
              <span className="text-gray-500">Drive Impact</span>
            </div>
            <p className="font-medium text-gray-900 mb-3">{plan.days61to90.focus}</p>
            
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-2">Goals:</p>
              <ul className="space-y-1">
                {plan.days61to90.goals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Target className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Actions:</p>
              <ul className="space-y-1">
                {plan.days61to90.actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Wins */}
          <div className="card bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <Rocket className="w-5 h-5 text-yellow-600" />
              <h3 className="font-medium">Quick Wins</h3>
            </div>
            <ul className="space-y-2">
              {plan.quickWins.map((win, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-yellow-600">⚡</span>
                  <span>{win}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Relationships */}
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium">Key Relationships to Build</h3>
            </div>
            <ul className="space-y-2">
              {plan.relationshipsToBuild.map((relationship, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-600">👤</span>
                  <span>{relationship}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
