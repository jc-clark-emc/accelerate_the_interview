"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DAYS } from "@/lib/constants";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

interface ResumeProfileData {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  headline: string | null;
  summaryStatement: string | null;
  currentCompany: string | null;
  currentTitle: string | null;
  bulletOne: string | null;
  bulletOneOriginal: string | null;
  bulletTwo: string | null;
  bulletTwoOriginal: string | null;
  bulletThree: string | null;
  bulletThreeOriginal: string | null;
}

const initialData: ResumeProfileData = {
  fullName: null,
  email: null,
  phone: null,
  location: null,
  linkedinUrl: null,
  portfolioUrl: null,
  headline: null,
  summaryStatement: null,
  currentCompany: null,
  currentTitle: null,
  bulletOne: null,
  bulletOneOriginal: null,
  bulletTwo: null,
  bulletTwoOriginal: null,
  bulletThree: null,
  bulletThreeOriginal: null,
};

export default function Day4Page() {
  const router = useRouter();
  const [data, setData] = useState<ResumeProfileData>(initialData);
  const [careerProfile, setCareerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [hasAI, setHasAI] = useState(false);

  const dayInfo = DAYS[3]; // Day 4

  const sections = [
    {
      title: "Contact Information",
      description: "Make sure your contact info is clean and professional.",
    },
    {
      title: "Professional Headline",
      description: "Your headline appears at the top of your resume.",
    },
    {
      title: "Summary Statement",
      description: "A brief overview of who you are and what you bring.",
    },
    {
      title: "Experience Bullets",
      description: "Transform your experience using the proven formula.",
    },
  ];

  // Load existing data
  useEffect(() => {
    async function loadData() {
      try {
        const [resumeRes, profileRes] = await Promise.all([
          fetch("/api/resume-profile"),
          fetch("/api/career-profile"),
        ]);

        if (resumeRes.ok) {
          const resume = await resumeRes.json();
          if (resume) {
            setData({ ...initialData, ...resume });
          }
        }

        if (profileRes.ok) {
          const profile = await profileRes.json();
          setCareerProfile(profile);
        }

        // Check subscription tier for AI features
        // For now, we'll assume based on presence of OpenAI key
        setHasAI(false); // Default to false, would check subscription in production
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Save data
  const handleSave = async (moveNext = false) => {
    setSaving(true);
    try {
      const res = await fetch("/api/resume-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save");

      if (moveNext) {
        if (currentSection === sections.length - 1) {
          await fetch("/api/day-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dayNumber: 4, status: "COMPLETED" }),
          });
          router.push("/dashboard/day/5");
        } else {
          setCurrentSection(currentSection + 1);
        }
      }
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
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
          <span className="bg-primary-100 text-primary-600 font-bold w-10 h-10 rounded-full flex items-center justify-center">
            4
          </span>
          <h1 className="text-2xl font-bold">{dayInfo.title}</h1>
        </div>
        <p className="text-gray-600">{dayInfo.description}</p>
        <p className="text-sm text-gray-500 mt-2">⏱️ {dayInfo.estimatedTime}</p>
      </div>

      {/* Section Progress */}
      <div className="flex gap-2 mb-8">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => {
              handleSave(false);
              setCurrentSection(index);
            }}
            className={`flex-1 h-2 rounded-full transition-colors ${
              index < currentSection
                ? "bg-green-500"
                : index === currentSection
                ? "bg-primary-500"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Current Section */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-1">
          {sections[currentSection].title}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {sections[currentSection].description}
        </p>

        {/* Section 0: Contact Info */}
        {currentSection === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="John Smith"
                  value={data.fullName || ""}
                  onChange={(e) =>
                    setData({ ...data, fullName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="john@example.com"
                  value={data.email || ""}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="(555) 123-4567"
                  value={data.phone || ""}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Location</label>
                <input
                  type="text"
                  className="input"
                  placeholder="San Francisco, CA"
                  value={data.location || ""}
                  onChange={(e) =>
                    setData({ ...data, location: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">LinkedIn URL</label>
                <input
                  type="url"
                  className="input"
                  placeholder="linkedin.com/in/johnsmith"
                  value={data.linkedinUrl || ""}
                  onChange={(e) =>
                    setData({ ...data, linkedinUrl: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">Portfolio URL (optional)</label>
                <input
                  type="url"
                  className="input"
                  placeholder="johnsmith.com"
                  value={data.portfolioUrl || ""}
                  onChange={(e) =>
                    setData({ ...data, portfolioUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Tips for clean contact info:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Use a professional email (firstname.lastname@...)</li>
                    <li>Include city and state, not full address</li>
                    <li>Customize your LinkedIn URL</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Headline */}
        {currentSection === 1 && (
          <div className="space-y-4">
            <div>
              <label className="label">Professional Headline</label>
              <input
                type="text"
                className="input"
                placeholder="Product Manager | B2B SaaS | Data-Driven | Building Products Users Love"
                value={data.headline || ""}
                onChange={(e) => setData({ ...data, headline: e.target.value })}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Headline Formula:</p>
                  <p className="mt-1 font-mono text-xs">
                    [Target Title] | [Key Skill] | [Key Skill] | [Value
                    Statement]
                  </p>
                  <p className="mt-2 font-medium">Examples:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>
                      Software Engineer | Full Stack | React & Node | Building
                      Scalable Systems
                    </li>
                    <li>
                      Marketing Director | B2B Growth | Data-Driven Strategies
                    </li>
                    <li>
                      UX Designer | User Research | Design Systems | Accessible
                      Design
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {careerProfile?.jobTitlesHeld?.length > 0 && (
              <div className="bg-gray-50 border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  Based on your Day 1 profile, consider using:
                </p>
                <div className="flex flex-wrap gap-2">
                  {careerProfile.jobTitlesHeld.slice(0, 3).map((title: string) => (
                    <span
                      key={title}
                      className="text-sm bg-white px-3 py-1 rounded-full border cursor-pointer hover:bg-primary-50"
                      onClick={() =>
                        setData({
                          ...data,
                          headline: data.headline
                            ? `${title} | ${data.headline}`
                            : title,
                        })
                      }
                    >
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 2: Summary */}
        {currentSection === 2 && (
          <div className="space-y-4">
            <div>
              <label className="label">Summary Statement</label>
              <textarea
                className="input min-h-[150px]"
                placeholder="Write 3-4 sentences about who you are, what you do, and what you're looking for..."
                value={data.summaryStatement || ""}
                onChange={(e) =>
                  setData({ ...data, summaryStatement: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                {(data.summaryStatement || "").split(/\s+/).filter(Boolean)
                  .length}{" "}
                words (aim for 50-100)
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Summary Formula:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>
                      Who you are: "[Role] with [X years] experience in
                      [industry]"
                    </li>
                    <li>What you do: "Skilled in [top 3 skills]"</li>
                    <li>What you've achieved: "Known for [accomplishment]"</li>
                    <li>
                      What you want: "Seeking [target role] where I can [goal]"
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Bullets */}
        {currentSection === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Current/Recent Company</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Acme Inc"
                  value={data.currentCompany || ""}
                  onChange={(e) =>
                    setData({ ...data, currentCompany: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">Job Title</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Senior Product Manager"
                  value={data.currentTitle || ""}
                  onChange={(e) =>
                    setData({ ...data, currentTitle: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Bullet Formula:</p>
                  <p className="mt-1 font-mono text-xs">
                    Accomplished [X] by doing [Y], resulting in [Z]
                  </p>
                  <p className="mt-2">
                    <strong>Example:</strong> Increased user retention by 34% by
                    redesigning the onboarding flow, resulting in $2M additional
                    ARR.
                  </p>
                </div>
              </div>
            </div>

            {/* Bullet 1 */}
            <div>
              <label className="label">Bullet 1</label>
              <textarea
                className="input min-h-[80px]"
                placeholder="Accomplished [what] by doing [how], resulting in [impact]..."
                value={data.bulletOne || ""}
                onChange={(e) =>
                  setData({ ...data, bulletOne: e.target.value })
                }
              />
              {hasAI && (
                <button className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Improve with AI
                </button>
              )}
            </div>

            {/* Bullet 2 */}
            <div>
              <label className="label">Bullet 2</label>
              <textarea
                className="input min-h-[80px]"
                placeholder="Accomplished [what] by doing [how], resulting in [impact]..."
                value={data.bulletTwo || ""}
                onChange={(e) =>
                  setData({ ...data, bulletTwo: e.target.value })
                }
              />
              {hasAI && (
                <button className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Improve with AI
                </button>
              )}
            </div>

            {/* Bullet 3 */}
            <div>
              <label className="label">Bullet 3</label>
              <textarea
                className="input min-h-[80px]"
                placeholder="Accomplished [what] by doing [how], resulting in [impact]..."
                value={data.bulletThree || ""}
                onChange={(e) =>
                  setData({ ...data, bulletThree: e.target.value })
                }
              />
              {hasAI && (
                <button className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Improve with AI
                </button>
              )}
            </div>

            {!hasAI && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    <strong>Pro/Premium feature:</strong> AI-powered bullet
                    rewriting is available on higher tiers.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => {
            if (currentSection === 0) {
              router.push("/dashboard/day/3");
            } else {
              handleSave(false);
              setCurrentSection(currentSection - 1);
            }
          }}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {currentSection < sections.length - 1 ? (
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? "Saving..." : "Save & Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving || !data.headline || !data.summaryStatement || !data.bulletOne}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                Complete Day 4
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
