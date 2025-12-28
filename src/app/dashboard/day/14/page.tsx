"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DAYS } from "@/lib/constants";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  Check,
  Calendar,
  PartyPopper,
  Rocket,
} from "lucide-react";
import Link from "next/link";

const JOB_FOLLOWUP_TEMPLATE = `Hi [Recruiter/Hiring Manager Name],

I hope this email finds you well. I wanted to follow up on my application for the [Job Title] position that I submitted on [Date].

I'm very excited about the opportunity to contribute to [Company] and believe my experience in [relevant skill] would be a great fit for the role.

If you need any additional information from me, please don't hesitate to reach out. I'd love the chance to discuss how I can add value to your team.

Thank you for your time and consideration.

Best regards,
[Your Name]`;

const NETWORKING_FOLLOWUP_TEMPLATE = `Hi [Name],

I wanted to follow up on my message from [X days ago]. I know you're busy, so I'll keep this brief.

I'm still very interested in learning about [topic/role/company] and would love to hear your perspective if you have a few minutes.

No worries if the timing doesn't work - I appreciate you considering it either way.

Best,
[Your Name]`;

const COFFEE_CHAT_THANKYOU = `Hi [Name],

Thank you so much for taking the time to chat with me today. I really appreciated your insights on [specific topic discussed].

Your advice about [specific advice] was especially helpful, and I plan to [how you'll apply it].

If there's ever anything I can do to return the favor, please don't hesitate to reach out.

Thanks again,
[Your Name]`;

export default function Day14Page() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checklist, setChecklist] = useState([
    { id: "timeline", label: "I understand the follow-up timelines", checked: false },
    { id: "job-template", label: "I've saved the job follow-up template", checked: false },
    { id: "network-template", label: "I've saved the networking follow-up template", checked: false },
    { id: "thankyou", label: "I've saved the thank you template", checked: false },
    { id: "calendar", label: "I've set calendar reminders for follow-ups", checked: false },
  ]);

  const dayInfo = DAYS[13]; // Day 14

  // Copy to clipboard
  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle checkbox
  const toggleCheck = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Check completion
  const isComplete = checklist.every((item) => item.checked);

  // Complete program
  const handleComplete = async () => {
    if (!isComplete) return;

    setSaving(true);
    try {
      await fetch("/api/day-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayNumber: 14, status: "COMPLETED" }),
      });
      router.push("/dashboard?completed=true");
    } catch (err) {
      console.error("Failed to complete:", err);
    } finally {
      setSaving(false);
    }
  };

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
            14
          </span>
          <h1 className="text-2xl font-bold">{dayInfo.title}</h1>
        </div>
        <p className="text-gray-600">{dayInfo.description}</p>
        <p className="text-sm text-gray-500 mt-2">⏱️ {dayInfo.estimatedTime}</p>
      </div>

      {/* Celebration */}
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <PartyPopper className="w-8 h-8" />
          <h2 className="text-xl font-bold">You Made It!</h2>
        </div>
        <p className="text-primary-100">
          14 days. 10 applications. 60 networking messages. 10 STAR stories prepared.
          You've built a complete job search engine. Now it's time to keep the momentum going.
        </p>
      </div>

      {/* Follow-Up Timelines */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold">Follow-Up Timelines</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Job Applications</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Day 7:</strong> First follow-up (if no response)</li>
              <li>• <strong>Day 14:</strong> Second follow-up (final attempt)</li>
              <li>• <strong>Day 21:</strong> Move on, but keep the door open</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Networking Messages</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Day 5:</strong> First follow-up (friendly bump)</li>
              <li>• <strong>Day 10:</strong> Final follow-up (no pressure)</li>
              <li>• After coffee chat: Send thank you within 24 hours</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Templates */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold">Follow-Up Templates</h2>

        {/* Job Follow-Up */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Job Application Follow-Up</h3>
            <button
              onClick={() => handleCopy("job", JOB_FOLLOWUP_TEMPLATE)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              {copiedId === "job" ? (
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
          <pre className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap font-mono text-gray-700 overflow-x-auto">
            {JOB_FOLLOWUP_TEMPLATE}
          </pre>
        </div>

        {/* Networking Follow-Up */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Networking Follow-Up</h3>
            <button
              onClick={() => handleCopy("network", NETWORKING_FOLLOWUP_TEMPLATE)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              {copiedId === "network" ? (
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
          <pre className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap font-mono text-gray-700 overflow-x-auto">
            {NETWORKING_FOLLOWUP_TEMPLATE}
          </pre>
        </div>

        {/* Thank You */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Coffee Chat Thank You</h3>
            <button
              onClick={() => handleCopy("thankyou", COFFEE_CHAT_THANKYOU)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              {copiedId === "thankyou" ? (
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
          <pre className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap font-mono text-gray-700 overflow-x-auto">
            {COFFEE_CHAT_THANKYOU}
          </pre>
        </div>
      </div>

      {/* Final Checklist */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold mb-4">Final Checklist</h2>
        <div className="space-y-3">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                item.checked
                  ? "bg-green-50 border-green-200"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  item.checked
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300"
                }`}
              >
                {item.checked && <Check className="w-3 h-3" />}
              </div>
              <span
                className={`text-sm ${
                  item.checked ? "text-green-700" : "text-gray-700"
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-2">
          <Rocket className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">What's Next?</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Keep tracking your jobs and networking in the dashboard</li>
              <li>Apply to new jobs as you find them</li>
              <li>Continue sending networking messages</li>
              <li>Follow up on applications and conversations</li>
              <li>Prepare for interviews as they come in</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link
          href="/dashboard/day/13"
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
            "Complete checklist above"
          ) : (
            <>
              Complete the Program!
              <PartyPopper className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
