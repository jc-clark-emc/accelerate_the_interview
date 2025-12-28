"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DAYS } from "@/lib/constants";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Plus,
  ExternalLink,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

interface JobLead {
  id?: string;
  jobTitle: string;
  company: string;
  url: string;
  salaryMin: number | null;
  salaryMax: number | null;
  location: string | null;
  workType: string | null;
  jobDescription: string | null;
  matchScore: number | null;
  matchBreakdown: Record<string, boolean> | null;
}

const emptyJob: JobLead = {
  jobTitle: "",
  company: "",
  url: "",
  salaryMin: null,
  salaryMax: null,
  location: null,
  workType: null,
  jobDescription: null,
  matchScore: null,
  matchBreakdown: null,
};

function MatchScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null;

  let colorClass = "bg-gray-100 text-gray-600";
  if (score >= 80) colorClass = "bg-green-100 text-green-700";
  else if (score >= 60) colorClass = "bg-yellow-100 text-yellow-700";
  else colorClass = "bg-red-100 text-red-700";

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${colorClass}`}>
      {score}% Match
    </span>
  );
}

function JobCard({
  job,
  onDelete,
  isExpanded,
  onToggle,
}: {
  job: JobLead;
  onDelete: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className="p-4 bg-white cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-medium">{job.jobTitle}</h3>
              <MatchScoreBadge score={job.matchScore} />
            </div>
            <p className="text-sm text-gray-600">{job.company}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              {job.location && <span>{job.location}</span>}
              {job.workType && <span>• {job.workType}</span>}
              {job.salaryMin && (
                <span>
                  • ${job.salaryMin.toLocaleString()}
                  {job.salaryMax && ` - $${job.salaryMax.toLocaleString()}`}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-gray-400 hover:text-primary-600"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t bg-gray-50 p-4">
          {job.matchBreakdown && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Match Breakdown:
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(job.matchBreakdown).map(([key, matched]) => (
                  <span
                    key={key}
                    className={`text-xs px-2 py-1 rounded ${
                      matched
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {matched ? "✓" : "✗"} {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Remove Job
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Day3Page() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJob, setNewJob] = useState<JobLead>(emptyJob);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const dayInfo = DAYS[2]; // Day 3

  // Load existing jobs
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/job-leads");
        if (res.ok) {
          const data = await res.json();
          setJobs(data.filter((j: any) => j.status === "SAVED"));
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  // Add new job
  const handleAddJob = async () => {
    if (!newJob.jobTitle || !newJob.company || !newJob.url) return;

    setSaving(true);
    try {
      const res = await fetch("/api/job-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });

      if (res.ok) {
        const savedJob = await res.json();
        setJobs([savedJob, ...jobs]);
        setNewJob(emptyJob);
        setShowAddForm(false);
      }
    } catch (err) {
      console.error("Failed to save job:", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete job
  const handleDeleteJob = async (id: string) => {
    try {
      await fetch(`/api/job-leads?id=${id}`, { method: "DELETE" });
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (err) {
      console.error("Failed to delete job:", err);
    }
  };

  // Complete day
  const handleComplete = async () => {
    if (jobs.length < 10) return;

    setSaving(true);
    try {
      await fetch("/api/day-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayNumber: 3, status: "COMPLETED" }),
      });
      router.push("/dashboard/day/4");
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
            3
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
            <h2 className="font-semibold">Jobs Found</h2>
            <p className="text-sm text-gray-500">
              Find 10 jobs that match your criteria
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-primary-600">
              {jobs.length}
            </span>
            <span className="text-gray-400">/10</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              jobs.length >= 10 ? "bg-green-500" : "bg-primary-500"
            }`}
            style={{ width: `${Math.min(100, (jobs.length / 10) * 100)}%` }}
          />
        </div>

        {jobs.length >= 10 && (
          <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Great job! You've found 10 jobs.
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-blue-900 mb-2">Where to Search</h3>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://linkedin.com/jobs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-white px-3 py-1 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            LinkedIn Jobs ↗
          </a>
          <a
            href="https://indeed.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-white px-3 py-1 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            Indeed ↗
          </a>
          <a
            href="https://glassdoor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-white px-3 py-1 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            Glassdoor ↗
          </a>
          <a
            href="https://wellfound.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-white px-3 py-1 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            Wellfound ↗
          </a>
        </div>
        <p className="text-sm text-blue-700 mt-3">
          Search for your target job titles from Day 2. Save any jobs that look
          interesting - we'll calculate a match score based on your preferences.
        </p>
      </div>

      {/* Add Job Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary w-full flex items-center justify-center gap-2 mb-6"
        >
          <Plus className="w-4 h-4" />
          Add a Job
        </button>
      )}

      {/* Add Job Form */}
      {showAddForm && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">Add New Job</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Job Title *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Product Manager"
                  value={newJob.jobTitle}
                  onChange={(e) =>
                    setNewJob({ ...newJob, jobTitle: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">Company *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Acme Inc"
                  value={newJob.company}
                  onChange={(e) =>
                    setNewJob({ ...newJob, company: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="label">Job Posting URL *</label>
              <input
                type="url"
                className="input"
                placeholder="https://linkedin.com/jobs/..."
                value={newJob.url}
                onChange={(e) => setNewJob({ ...newJob, url: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Location</label>
                <input
                  type="text"
                  className="input"
                  placeholder="San Francisco, CA"
                  value={newJob.location || ""}
                  onChange={(e) =>
                    setNewJob({ ...newJob, location: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">Work Type</label>
                <select
                  className="input"
                  value={newJob.workType || ""}
                  onChange={(e) =>
                    setNewJob({ ...newJob, workType: e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
              <div>
                <label className="label">Salary (min)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="100000"
                  value={newJob.salaryMin || ""}
                  onChange={(e) =>
                    setNewJob({
                      ...newJob,
                      salaryMin: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="label">
                Job Description{" "}
                <span className="text-gray-400">(paste for better matching)</span>
              </label>
              <textarea
                className="input min-h-[150px]"
                placeholder="Paste the full job description here to get a more accurate match score..."
                value={newJob.jobDescription || ""}
                onChange={(e) =>
                  setNewJob({ ...newJob, jobDescription: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewJob(emptyJob);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddJob}
                disabled={
                  saving || !newJob.jobTitle || !newJob.company || !newJob.url
                }
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Job"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job List */}
      {jobs.length > 0 && (
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold">Your Saved Jobs</h3>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={() => job.id && handleDeleteJob(job.id)}
              isExpanded={expandedJobId === job.id}
              onToggle={() =>
                setExpandedJobId(expandedJobId === job.id ? null : job.id!)
              }
            />
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Link
          href="/dashboard/day/2"
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Day
        </Link>

        <button
          onClick={handleComplete}
          disabled={saving || jobs.length < 10}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            "Saving..."
          ) : jobs.length < 10 ? (
            `Find ${10 - jobs.length} more jobs`
          ) : (
            <>
              Complete Day 3
              <CheckCircle className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
