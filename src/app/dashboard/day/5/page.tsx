"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DAYS } from "@/lib/constants";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

interface ResumeData {
  headline: string | null;
  summaryStatement: string | null;
  bulletOne: string | null;
  bulletTwo: string | null;
  bulletThree: string | null;
  linkedinUrl: string | null;
}

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  copyText?: string;
  checked: boolean;
}

export default function Day5Page() {
  const router = useRouter();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  const dayInfo = DAYS[4]; // Day 5

  // Load resume data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/resume-profile");
        if (res.ok) {
          const data = await res.json();
          setResumeData(data);

          // Initialize checklist
          setChecklist([
            {
              id: "headline",
              label: "Update LinkedIn Headline",
              description: "Copy your resume headline to LinkedIn",
              copyText: data?.headline || "",
              checked: false,
            },
            {
              id: "about",
              label: "Update About Section",
              description:
                "Copy your summary statement (can expand slightly for LinkedIn)",
              copyText: data?.summaryStatement || "",
              checked: false,
            },
            {
              id: "bullet1",
              label: "Update Current Role - Bullet 1",
              description: "Add your first experience bullet",
              copyText: data?.bulletOne || "",
              checked: false,
            },
            {
              id: "bullet2",
              label: "Update Current Role - Bullet 2",
              description: "Add your second experience bullet",
              copyText: data?.bulletTwo || "",
              checked: false,
            },
            {
              id: "bullet3",
              label: "Update Current Role - Bullet 3",
              description: "Add your third experience bullet",
              copyText: data?.bulletThree || "",
              checked: false,
            },
            {
              id: "titles",
              label: "Verify Job Titles Match",
              description:
                "Make sure your job titles on LinkedIn match your resume exactly",
              checked: false,
            },
            {
              id: "dates",
              label: "Verify Dates Match",
              description:
                "Make sure your employment dates on LinkedIn match your resume",
              checked: false,
            },
            {
              id: "skills",
              label: "Add Top Skills",
              description:
                "Add your key skills to LinkedIn's Skills section and reorder to prioritize top 3",
              checked: false,
            },
            {
              id: "url",
              label: "Customize LinkedIn URL",
              description:
                "Change your URL to linkedin.com/in/firstname-lastname",
              checked: false,
            },
            {
              id: "photo",
              label: "Check Profile Photo",
              description:
                "Make sure you have a professional, friendly headshot",
              checked: false,
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Copy to clipboard
  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Toggle checkbox
  const toggleCheck = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Calculate progress
  const completedCount = checklist.filter((item) => item.checked).length;
  const totalCount = checklist.length;
  const isComplete = completedCount === totalCount;

  // Complete day
  const handleComplete = async () => {
    if (!isComplete) return;

    setSaving(true);
    try {
      await fetch("/api/day-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayNumber: 5, status: "COMPLETED" }),
      });
      router.push("/dashboard/day/6");
    } catch (err) {
      console.error("Failed to complete day:", err);
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
            5
          </span>
          <h1 className="text-2xl font-bold">{dayInfo.title}</h1>
        </div>
        <p className="text-gray-600">{dayInfo.description}</p>
        <p className="text-sm text-gray-500 mt-2">⏱️ {dayInfo.estimatedTime}</p>
      </div>

      {/* Progress */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold">Checklist Progress</h2>
            <p className="text-sm text-gray-500">
              Complete each task to align your LinkedIn with your resume
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-primary-600">
              {completedCount}
            </span>
            <span className="text-gray-400">/{totalCount}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              isComplete ? "bg-green-500" : "bg-primary-500"
            }`}
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>

        {isComplete && (
          <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            All tasks complete!
          </p>
        )}
      </div>

      {/* Open LinkedIn Button */}
      <a
        href="https://www.linkedin.com/in/me/"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full flex items-center justify-center gap-2 mb-6"
      >
        <ExternalLink className="w-4 h-4" />
        Open LinkedIn Profile
      </a>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Why alignment matters:</p>
            <p className="mt-1">
              Recruiters check LinkedIn after seeing your resume. Any
              discrepancies (different job titles, mismatched dates, conflicting
              information) can raise red flags. Keep them consistent!
            </p>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3 mb-8">
        {checklist.map((item) => (
          <div
            key={item.id}
            className={`border rounded-lg p-4 transition-colors ${
              item.checked ? "bg-green-50 border-green-200" : "bg-white"
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleCheck(item.id)}
                className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  item.checked
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 hover:border-primary-500"
                }`}
              >
                {item.checked && <Check className="w-3 h-3" />}
              </button>

              <div className="flex-1">
                <p
                  className={`font-medium ${
                    item.checked ? "text-green-700" : "text-gray-900"
                  }`}
                >
                  {item.label}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {item.description}
                </p>

                {item.copyText && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-gray-700 flex-1">
                        {item.copyText}
                      </p>
                      <button
                        onClick={() => handleCopy(item.id, item.copyText!)}
                        className="flex-shrink-0 text-gray-400 hover:text-primary-600"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link
          href="/dashboard/day/4"
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Day
        </Link>

        <button
          onClick={handleComplete}
          disabled={saving || !isComplete}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            "Saving..."
          ) : !isComplete ? (
            `Complete ${totalCount - completedCount} more tasks`
          ) : (
            <>
              Complete Day 5
              <CheckCircle className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
