"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DAYS, JOB_STATUSES } from "@/lib/constants";
import {
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  AlertCircle,
  Check,
} from "lucide-react";
import Link from "next/link";

interface JobLead {
  id: string;
  jobTitle: string;
  company: string;
  url: string;
  status: string;
  matchScore: number | null;
}

export default function Day8Page() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dayInfo = DAYS[7]; // Day 8

  // Load jobs
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/job-leads");
        if (res.ok) {
          const data = await res.json();
          // Get first 5 saved/applied jobs
          setJobs(data.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  // Mark job as applied
  const handleApply = async (jobId: string) => {
    try {
      const res = await fetch("/api/job-leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: jobId, status: "APPLIED" }),
      });

      if (res.ok) {
        setJobs(
          jobs.map((j) =>
            j.id === jobId ? { ...j, status: "APPLIED" } : j
          )
        );
      }
    } catch (err) {
      console.error("Failed to update job:", err);
    }
  };

  // Count applied
  const appliedCount = jobs.filter((j) => j.status !== "SAVED").length;
  const isComplete = appliedCount >= 5;

  // Complete day
  const handleComplete = async () => {
    if (!isComplete) return;

    setSaving(true);
    try {
      await fetch("/api/day-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayNumber: 8, status: "COMPLETED" }),
      });
      router.push("/dashboard/day/9");
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
            8
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
            <h2 className="font-semibold">Applications Submitted</h2>
            <p className="text-sm text-gray-500">
              Apply to 5 jobs today
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-primary-600">
              {appliedCount}
            </span>
            <span className="text-gray-400">/5</span>
          </div>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              isComplete ? "bg-green-500" : "bg-primary-500"
            }`}
            style={{ width: `${(appliedCount / 5) * 100}%` }}
          />
        </div>

        {isComplete && (
          <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            All 5 applications submitted!
          </p>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Before applying:</strong> Verify each job is still open.
          If any have closed, go to Day 3 and find replacements.
        </p>
      </div>

      {/* Job List */}
      {jobs.length === 0 ? (
        <div className="card text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            No jobs saved yet. Complete Day 3 first.
          </p>
          <Link href="/dashboard/day/3" className="btn-primary">
            Go to Day 3
          </Link>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className={`border rounded-lg p-4 ${
                job.status !== "SAVED"
                  ? "bg-green-50 border-green-200"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                      job.status !== "SAVED"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {job.status !== "SAVED" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div>
                    <h3 className="font-medium">{job.jobTitle}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {job.matchScore && (
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        job.matchScore >= 80
                          ? "bg-green-100 text-green-700"
                          : job.matchScore >= 60
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {job.matchScore}%
                    </span>
                  )}

                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {job.status === "SAVED" ? (
                    <button
                      onClick={() => handleApply(job.id)}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Mark Applied
                    </button>
                  ) : (
                    <span className="text-green-600 text-sm font-medium">
                      ✓ Applied
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Link
          href="/dashboard/day/7"
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
            `Apply to ${5 - appliedCount} more`
          ) : (
            <>
              Complete Day 8
              <CheckCircle className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
