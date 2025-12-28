"use client";

import { useState, useEffect } from "react";
import { JOB_STATUSES, NETWORKING_STATUSES } from "@/lib/constants";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Plus,
  Users,
  Edit2,
  X,
  Check,
} from "lucide-react";

interface NetworkingContact {
  id: string;
  name: string;
  role: string | null;
  company: string;
  linkedinUrl: string | null;
  contactType: "HIRING_TEAM" | "COWORKER" | "GENERAL";
  messageSent: boolean;
  messageSentDate: string | null;
  status: string;
  notes: string | null;
}

interface JobLead {
  id: string;
  jobTitle: string;
  company: string;
  url: string;
  salaryMin: number | null;
  salaryMax: number | null;
  location: string | null;
  workType: string | null;
  status: string;
  appliedDate: string | null;
  matchScore: number | null;
  notes: string | null;
  contacts: NetworkingContact[];
}

function StatusBadge({ status, type }: { status: string; type: "job" | "networking" }) {
  const statuses = type === "job" ? JOB_STATUSES : NETWORKING_STATUSES;
  const statusInfo = statuses.find((s) => s.value === status);
  
  if (!statusInfo) return null;

  const colorClasses: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
    indigo: "bg-indigo-100 text-indigo-700",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colorClasses[statusInfo.color] || colorClasses.gray
      }`}
    >
      {statusInfo.label}
    </span>
  );
}

function MatchScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null;

  let colorClass = "bg-gray-100 text-gray-600";
  if (score >= 80) colorClass = "bg-green-100 text-green-700";
  else if (score >= 60) colorClass = "bg-yellow-100 text-yellow-700";
  else colorClass = "bg-red-100 text-red-700";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {score}%
    </span>
  );
}

function JobRow({
  job,
  isExpanded,
  onToggle,
  onUpdate,
}: {
  job: JobLead;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<JobLead>) => void;
}) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(job.notes || "");

  const hiringTeamContacts = job.contacts.filter(
    (c) => c.contactType === "HIRING_TEAM"
  );
  const coworkerContacts = job.contacts.filter(
    (c) => c.contactType === "COWORKER"
  );

  const handleStatusChange = (newStatus: string) => {
    onUpdate({ status: newStatus });
  };

  const handleSaveNotes = () => {
    onUpdate({ notes });
    setEditingNotes(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Main Row */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          {/* Expand/Collapse */}
          <button className="text-gray-400">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{job.jobTitle}</h3>
              <MatchScoreBadge score={job.matchScore} />
            </div>
            <p className="text-sm text-gray-600 truncate">{job.company}</p>
          </div>

          {/* Applied Date */}
          <div className="hidden md:block text-sm text-gray-500 w-24">
            {job.appliedDate
              ? new Date(job.appliedDate).toLocaleDateString()
              : "-"}
          </div>

          {/* Status Dropdown */}
          <div onClick={(e) => e.stopPropagation()}>
            <select
              value={job.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-sm border rounded-lg px-2 py-1 bg-white"
            >
              {JOB_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Contacts Count */}
          <div className="hidden md:flex items-center gap-1 text-sm text-gray-500 w-20">
            <Users className="w-4 h-4" />
            {job.contacts.length}
          </div>

          {/* External Link */}
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-400 hover:text-primary-600"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t bg-gray-50 p-4">
          {/* Job Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
            <div>
              <span className="text-gray-500">Location:</span>
              <p>{job.location || "-"}</p>
            </div>
            <div>
              <span className="text-gray-500">Type:</span>
              <p>{job.workType || "-"}</p>
            </div>
            <div>
              <span className="text-gray-500">Salary:</span>
              <p>
                {job.salaryMin
                  ? `$${job.salaryMin.toLocaleString()}${
                      job.salaryMax ? ` - $${job.salaryMax.toLocaleString()}` : ""
                    }`
                  : "-"}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Applied:</span>
              <p>
                {job.appliedDate
                  ? new Date(job.appliedDate).toLocaleDateString()
                  : "Not yet"}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Notes:</span>
              {!editingNotes ? (
                <button
                  onClick={() => setEditingNotes(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setNotes(job.notes || "");
                      setEditingNotes(false);
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            {editingNotes ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input w-full min-h-[80px]"
                placeholder="Add notes about this application..."
              />
            ) : (
              <p className="text-sm text-gray-700">
                {job.notes || "No notes yet."}
              </p>
            )}
          </div>

          {/* Networking Contacts */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Networking Contacts ({job.contacts.length})
            </h4>

            {job.contacts.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No contacts added yet. Add contacts on Days 10-11.
              </p>
            ) : (
              <div className="space-y-4">
                {/* Hiring Team */}
                {hiringTeamContacts.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      Hiring Team
                    </p>
                    <div className="grid gap-2">
                      {hiringTeamContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between bg-white rounded-lg p-3 border"
                        >
                          <div>
                            <p className="font-medium text-sm">{contact.name}</p>
                            <p className="text-xs text-gray-500">
                              {contact.role}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge
                              status={contact.status}
                              type="networking"
                            />
                            {contact.linkedinUrl && (
                              <a
                                href={contact.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-primary-600"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Potential Coworkers */}
                {coworkerContacts.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      Potential Coworkers
                    </p>
                    <div className="grid gap-2">
                      {coworkerContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between bg-white rounded-lg p-3 border"
                        >
                          <div>
                            <p className="font-medium text-sm">{contact.name}</p>
                            <p className="text-xs text-gray-500">
                              {contact.role}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge
                              status={contact.status}
                              type="networking"
                            />
                            {contact.linkedinUrl && (
                              <a
                                href={contact.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-primary-600"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobsDashboardPage() {
  const [jobs, setJobs] = useState<JobLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // Load jobs
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/job-leads");
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  // Update job
  const handleUpdateJob = async (jobId: string, updates: Partial<JobLead>) => {
    try {
      const res = await fetch("/api/job-leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: jobId, ...updates }),
      });

      if (res.ok) {
        const updatedJob = await res.json();
        setJobs(jobs.map((j) => (j.id === jobId ? { ...j, ...updatedJob } : j)));
      }
    } catch (err) {
      console.error("Failed to update job:", err);
    }
  };

  // Filter jobs
  const filteredJobs =
    filter === "all"
      ? jobs
      : jobs.filter((j) => j.status === filter);

  // Stats
  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status !== "SAVED").length,
    interviewing: jobs.filter((j) =>
      ["SCREENING", "INTERVIEW", "FINAL_ROUND"].includes(j.status)
    ).length,
    offers: jobs.filter((j) => j.status === "OFFER").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Job Tracker</h1>
        <p className="text-gray-600">
          Track your applications and networking progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-gray-500">Total Jobs</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Applied</p>
          <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Interviewing</p>
          <p className="text-2xl font-bold text-purple-600">
            {stats.interviewing}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Offers</p>
          <p className="text-2xl font-bold text-green-600">{stats.offers}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
            filter === "all"
              ? "bg-primary-100 text-primary-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All ({jobs.length})
        </button>
        {JOB_STATUSES.map((status) => {
          const count = jobs.filter((j) => j.status === status.value).length;
          if (count === 0) return null;
          return (
            <button
              key={status.value}
              onClick={() => setFilter(status.value)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                filter === status.value
                  ? "bg-primary-100 text-primary-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Table Header (Desktop) */}
      <div className="hidden md:grid grid-cols-[auto_1fr_100px_140px_80px_40px] gap-4 px-4 py-2 text-sm text-gray-500 border-b">
        <div className="w-5"></div>
        <div>Job</div>
        <div>Applied</div>
        <div>Status</div>
        <div>Contacts</div>
        <div></div>
      </div>

      {/* Job List */}
      <div className="space-y-2 mt-2">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {filter === "all" ? (
              <p>No jobs saved yet. Start on Day 3 to add jobs.</p>
            ) : (
              <p>No jobs with this status.</p>
            )}
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobRow
              key={job.id}
              job={job}
              isExpanded={expandedJobId === job.id}
              onToggle={() =>
                setExpandedJobId(expandedJobId === job.id ? null : job.id)
              }
              onUpdate={(updates) => handleUpdateJob(job.id, updates)}
            />
          ))
        )}
      </div>
    </div>
  );
}
