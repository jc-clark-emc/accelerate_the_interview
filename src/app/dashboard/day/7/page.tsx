"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DAYS, COFFEE_CHAT_QUESTIONS } from "@/lib/constants";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  Check,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

interface NetworkingSetupData {
  hiringTeamTemplate: string | null;
  coworkerTemplate: string | null;
  coffeeChatQuestions: string[];
}

const DEFAULT_HIRING_TEAM_TEMPLATE = `Hi [Name],

I came across [Company] while researching [industry/area] opportunities and I'm really impressed by [specific thing you noticed - recent news, product, mission].

I'm a [Your Title] with experience in [relevant skill], and I'm exploring [target role] opportunities. I noticed you're [their role] and I'd love to learn more about what it's like to work at [Company].

Would you be open to a quick 15-minute call? I'd really appreciate any insights you could share.

Thanks so much,
[Your Name]`;

const DEFAULT_COWORKER_TEMPLATE = `Hi [Name],

I'm a [Your Title] exploring opportunities in [industry/field], and I came across your profile while researching [Company]. Your work on [something specific from their profile] really caught my attention.

I'm curious to learn more about the team culture and what a typical day looks like in [their department/role]. Would you be open to a quick coffee chat (virtual or in-person)?

I know you're busy, so even 15 minutes would be incredibly helpful.

Thanks for considering,
[Your Name]`;

export default function Day7Page() {
  const router = useRouter();
  const [data, setData] = useState<NetworkingSetupData>({
    hiringTeamTemplate: DEFAULT_HIRING_TEAM_TEMPLATE,
    coworkerTemplate: DEFAULT_COWORKER_TEMPLATE,
    coffeeChatQuestions: COFFEE_CHAT_QUESTIONS,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(0);

  const dayInfo = DAYS[6]; // Day 7

  const sections = [
    {
      title: "Hiring Team Message",
      description: "Template for recruiters, hiring managers, and HR.",
    },
    {
      title: "Coworker Message",
      description: "Template for potential teammates and peers.",
    },
    {
      title: "Coffee Chat Questions",
      description: "What to ask during your networking calls.",
    },
  ];

  // Load existing data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/networking-setup");
        if (res.ok) {
          const setup = await res.json();
          if (setup) {
            setData({
              hiringTeamTemplate:
                setup.hiringTeamTemplate || DEFAULT_HIRING_TEAM_TEMPLATE,
              coworkerTemplate:
                setup.coworkerTemplate || DEFAULT_COWORKER_TEMPLATE,
              coffeeChatQuestions:
                setup.coffeeChatQuestions || COFFEE_CHAT_QUESTIONS,
            });
          }
        }
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
      const res = await fetch("/api/networking-setup", {
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
            body: JSON.stringify({ dayNumber: 7, status: "COMPLETED" }),
          });
          router.push("/dashboard/day/8");
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

  // Copy to clipboard
  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Check if complete
  const isComplete =
    !!data.hiringTeamTemplate &&
    !!data.coworkerTemplate &&
    data.coffeeChatQuestions.length >= 4;

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
            7
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

        {/* Section 0: Hiring Team Template */}
        {currentSection === 0 && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Who is "Hiring Team"?</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Recruiters (Talent Acquisition)</li>
                    <li>Hiring Managers (your potential boss)</li>
                    <li>HR Business Partners</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Message Template</label>
                <button
                  onClick={() =>
                    handleCopy("hiring", data.hiringTeamTemplate || "")
                  }
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  {copiedId === "hiring" ? (
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
              <textarea
                className="input min-h-[300px] font-mono text-sm"
                value={data.hiringTeamTemplate || ""}
                onChange={(e) =>
                  setData({ ...data, hiringTeamTemplate: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-2">
                Replace [bracketed text] with specifics for each person.
              </p>
            </div>

            <button
              onClick={() =>
                setData({
                  ...data,
                  hiringTeamTemplate: DEFAULT_HIRING_TEAM_TEMPLATE,
                })
              }
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reset to default template
            </button>
          </div>
        )}

        {/* Section 1: Coworker Template */}
        {currentSection === 1 && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Who are "Potential Coworkers"?</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>People in similar roles at the company</li>
                    <li>People on the team you'd be joining</li>
                    <li>Anyone doing work you find interesting</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Message Template</label>
                <button
                  onClick={() =>
                    handleCopy("coworker", data.coworkerTemplate || "")
                  }
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  {copiedId === "coworker" ? (
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
              <textarea
                className="input min-h-[300px] font-mono text-sm"
                value={data.coworkerTemplate || ""}
                onChange={(e) =>
                  setData({ ...data, coworkerTemplate: e.target.value })
                }
              />
            </div>

            <button
              onClick={() =>
                setData({
                  ...data,
                  coworkerTemplate: DEFAULT_COWORKER_TEMPLATE,
                })
              }
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reset to default template
            </button>
          </div>
        )}

        {/* Section 2: Coffee Chat Questions */}
        {currentSection === 2 && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">The 4 Essential Questions</p>
                  <p className="mt-1">
                    These questions work for any networking call. They show
                    you're thoughtful and help you gather valuable intel.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {data.coffeeChatQuestions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border"
                >
                  <span className="bg-primary-100 text-primary-600 font-bold w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{question}</p>
                    {index === 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Learn what success looks like in the role.
                      </p>
                    )}
                    {index === 1 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Understand potential challenges and how to avoid them.
                      </p>
                    )}
                    {index === 2 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Get actionable guidance you can use immediately.
                      </p>
                    )}
                    {index === 3 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Expand your search with their insider knowledge.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(`q${index}`, question)}
                    className="text-gray-400 hover:text-primary-600"
                  >
                    {copiedId === `q${index}` ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Pro tip:</strong> End every call by asking "Is there
                anyone else you think I should talk to?" This keeps your
                networking momentum going.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => {
            if (currentSection === 0) {
              router.push("/dashboard/day/6");
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
            <CheckCircle className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving || !isComplete}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                Complete Day 7
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
