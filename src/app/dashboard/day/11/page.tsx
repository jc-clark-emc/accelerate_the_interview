"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DAYS } from "@/lib/constants";
import {
  ArrowLeft,
  CheckCircle,
  Plus,
  Send,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Users,
  PartyPopper,
} from "lucide-react";
import Link from "next/link";

interface NetworkingContact {
  id: string;
  name: string;
  role: string | null;
  linkedinUrl: string | null;
  contactType: "HIRING_TEAM" | "COWORKER";
  status: string;
}

interface JobWithContacts {
  id: string;
  jobTitle: string;
  company: string;
  contacts: NetworkingContact[];
}

export default function Day11Page() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobWithContacts[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({
    name: "",
    role: "",
    linkedinUrl: "",
    contactType: "HIRING_TEAM" as const,
  });

  const dayInfo = DAYS[10]; // Day 11

  // Load jobs 6-10 with contacts
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/job-leads");
        if (res.ok) {
          const data = await res.json();
          // Get jobs 6-10 that have been applied to
          const appliedJobs = data
            .filter((j: any) => j.status !== "SAVED")
            .slice(5, 10)
            .map((j: any) => ({
              id: j.id,
              jobTitle: j.jobTitle,
              company: j.company,
              contacts: j.contacts || [],
            }));
          setJobs(appliedJobs);
          if (appliedJobs.length > 0) {
            setExpandedJobId(appliedJobs[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Add contact
  const handleAddContact = async (jobId: string) => {
    if (!newContact.name) return;

    try {
      const res = await fetch("/api/networking-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobLeadId: jobId,
          ...newContact,
        }),
      });

      if (res.ok) {
        const contact = await res.json();
        setJobs(
          jobs.map((j) =>
            j.id === jobId
              ? { ...j, contacts: [...j.contacts, contact] }
              : j
          )
        );
        setNewContact({
          name: "",
          role: "",
          linkedinUrl: "",
          contactType: "HIRING_TEAM",
        });
        setShowAddForm(null);
      }
    } catch (err) {
      console.error("Failed to add contact:", err);
    }
  };

  // Mark message sent
  const handleMarkSent = async (contactId: string, jobId: string) => {
    try {
      const res = await fetch("/api/networking-contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contactId, status: "SENT" }),
      });

      if (res.ok) {
        setJobs(
          jobs.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  contacts: j.contacts.map((c) =>
                    c.id === contactId ? { ...c, status: "SENT" } : c
                  ),
                }
              : j
          )
        );
      }
    } catch (err) {
      console.error("Failed to update contact:", err);
    }
  };

  // Calculate progress
  const sentCount = jobs.reduce(
    (sum, j) => sum + j.contacts.filter((c) => c.status !== "NOT_CONTACTED").length,
    0
  );
  const isComplete = sentCount >= 30;

  // Complete day
  const handleComplete = async () => {
    if (!isComplete) return;

    setSaving(true);
    try {
      await fetch("/api/day-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayNumber: 11, status: "COMPLETED" }),
      });
      router.push("/dashboard/day/12");
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
            11
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
            <h2 className="font-semibold">Messages Sent Today</h2>
            <p className="text-sm text-gray-500">
              6 people per company × 5 companies = 30 messages
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-primary-600">
              {sentCount}
            </span>
            <span className="text-gray-400">/30</span>
          </div>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              isComplete ? "bg-green-500" : "bg-primary-500"
            }`}
            style={{ width: `${Math.min(100, (sentCount / 30) * 100)}%` }}
          />
        </div>

        {isComplete && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-700">
              <PartyPopper className="w-5 h-5" />
              <div>
                <p className="font-medium">
                  60 networking messages sent in total!
                </p>
                <p className="text-sm">
                  You're building real momentum. Responses will start coming in!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Company List */}
      <div className="space-y-4 mb-8">
        {jobs.map((job) => {
          const jobSentCount = job.contacts.filter(
            (c) => c.status !== "NOT_CONTACTED"
          ).length;
          const hiringTeam = job.contacts.filter(
            (c) => c.contactType === "HIRING_TEAM"
          );
          const coworkers = job.contacts.filter(
            (c) => c.contactType === "COWORKER"
          );

          return (
            <div key={job.id} className="border rounded-lg overflow-hidden">
              {/* Company Header */}
              <button
                onClick={() =>
                  setExpandedJobId(expandedJobId === job.id ? null : job.id)
                }
                className="w-full p-4 bg-white hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <h3 className="font-medium">{job.company}</h3>
                    <p className="text-sm text-gray-500">{job.jobTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      jobSentCount >= 6
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {jobSentCount}/6 sent
                  </span>
                  {expandedJobId === job.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedJobId === job.id && (
                <div className="border-t bg-gray-50 p-4">
                  {/* Hiring Team */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Hiring Team ({hiringTeam.length}/3)
                      </p>
                      <button
                        onClick={() => {
                          setNewContact({ ...newContact, contactType: "HIRING_TEAM" });
                          setShowAddForm(job.id + "-hiring");
                        }}
                        className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>

                    {showAddForm === job.id + "-hiring" && (
                      <div className="bg-white rounded-lg border p-3 mb-3">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input
                            type="text"
                            className="input text-sm"
                            placeholder="Name"
                            value={newContact.name}
                            onChange={(e) =>
                              setNewContact({ ...newContact, name: e.target.value })
                            }
                          />
                          <input
                            type="text"
                            className="input text-sm"
                            placeholder="Role"
                            value={newContact.role}
                            onChange={(e) =>
                              setNewContact({ ...newContact, role: e.target.value })
                            }
                          />
                        </div>
                        <input
                          type="url"
                          className="input text-sm w-full mb-2"
                          placeholder="LinkedIn URL (optional)"
                          value={newContact.linkedinUrl}
                          onChange={(e) =>
                            setNewContact({ ...newContact, linkedinUrl: e.target.value })
                          }
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowAddForm(null)}
                            className="btn-secondary text-sm flex-1"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAddContact(job.id)}
                            className="btn-primary text-sm flex-1"
                          >
                            Add Contact
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {hiringTeam.map((contact) => (
                        <ContactRow
                          key={contact.id}
                          contact={contact}
                          onMarkSent={() => handleMarkSent(contact.id, job.id)}
                        />
                      ))}
                      {hiringTeam.length === 0 && (
                        <p className="text-sm text-gray-400 italic">
                          No hiring team contacts yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Coworkers */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Potential Coworkers ({coworkers.length}/3)
                      </p>
                      <button
                        onClick={() => {
                          setNewContact({ ...newContact, contactType: "COWORKER" });
                          setShowAddForm(job.id + "-coworker");
                        }}
                        className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>

                    {showAddForm === job.id + "-coworker" && (
                      <div className="bg-white rounded-lg border p-3 mb-3">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input
                            type="text"
                            className="input text-sm"
                            placeholder="Name"
                            value={newContact.name}
                            onChange={(e) =>
                              setNewContact({ ...newContact, name: e.target.value })
                            }
                          />
                          <input
                            type="text"
                            className="input text-sm"
                            placeholder="Role"
                            value={newContact.role}
                            onChange={(e) =>
                              setNewContact({ ...newContact, role: e.target.value })
                            }
                          />
                        </div>
                        <input
                          type="url"
                          className="input text-sm w-full mb-2"
                          placeholder="LinkedIn URL (optional)"
                          value={newContact.linkedinUrl}
                          onChange={(e) =>
                            setNewContact({ ...newContact, linkedinUrl: e.target.value })
                          }
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowAddForm(null)}
                            className="btn-secondary text-sm flex-1"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAddContact(job.id)}
                            className="btn-primary text-sm flex-1"
                          >
                            Add Contact
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {coworkers.map((contact) => (
                        <ContactRow
                          key={contact.id}
                          contact={contact}
                          onMarkSent={() => handleMarkSent(contact.id, job.id)}
                        />
                      ))}
                      {coworkers.length === 0 && (
                        <p className="text-sm text-gray-400 italic">
                          No coworker contacts yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link
          href="/dashboard/day/10"
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
            `Send ${30 - sentCount} more`
          ) : (
            <>
              Complete Day 11
              <CheckCircle className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Contact Row Component
function ContactRow({
  contact,
  onMarkSent,
}: {
  contact: NetworkingContact;
  onMarkSent: () => void;
}) {
  const isSent = contact.status !== "NOT_CONTACTED";

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border ${
        isSent ? "bg-green-50 border-green-200" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div>
          <p className="font-medium text-sm">{contact.name}</p>
          <p className="text-xs text-gray-500">{contact.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
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
        {isSent ? (
          <span className="text-green-600 text-sm flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Sent
          </span>
        ) : (
          <button
            onClick={onMarkSent}
            className="btn-primary text-sm px-3 py-1 flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            Mark Sent
          </button>
        )}
      </div>
    </div>
  );
}
