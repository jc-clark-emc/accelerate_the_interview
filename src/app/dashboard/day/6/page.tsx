"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DAYS } from "@/lib/constants";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Calendar,
  Lightbulb,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";

interface NetworkingSetupData {
  calendarAuditDone: boolean;
  availableSlots: string | null;
  schedulingLinkUrl: string | null;
  elevatorPitch: string | null;
}

const initialData: NetworkingSetupData = {
  calendarAuditDone: false,
  availableSlots: null,
  schedulingLinkUrl: null,
  elevatorPitch: null,
};

export default function Day6Page() {
  const router = useRouter();
  const [data, setData] = useState<NetworkingSetupData>(initialData);
  const [careerProfile, setCareerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [copied, setCopied] = useState(false);

  const dayInfo = DAYS[5]; // Day 6

  const sections = [
    {
      title: "Calendar Audit",
      description: "Find time slots for networking calls.",
    },
    {
      title: "Scheduling Link",
      description: "Set up a link so people can easily book time with you.",
    },
    {
      title: "Elevator Pitch",
      description: "Craft a 30-second intro for networking conversations.",
    },
  ];

  // Load existing data
  useEffect(() => {
    async function loadData() {
      try {
        const [setupRes, profileRes] = await Promise.all([
          fetch("/api/networking-setup"),
          fetch("/api/career-profile"),
        ]);

        if (setupRes.ok) {
          const setup = await setupRes.json();
          if (setup) {
            setData({ ...initialData, ...setup });
          }
        }

        if (profileRes.ok) {
          const profile = await profileRes.json();
          setCareerProfile(profile);
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
            body: JSON.stringify({ dayNumber: 6, status: "COMPLETED" }),
          });
          router.push("/dashboard/day/7");
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

  // Copy elevator pitch
  const handleCopy = async () => {
    if (data.elevatorPitch) {
      await navigator.clipboard.writeText(data.elevatorPitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Check if section is complete
  const isSectionComplete = (index: number) => {
    switch (index) {
      case 0:
        return data.calendarAuditDone && data.availableSlots;
      case 1:
        return !!data.schedulingLinkUrl;
      case 2:
        return !!data.elevatorPitch;
      default:
        return false;
    }
  };

  const isComplete = sections.every((_, i) => isSectionComplete(i));

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
            6
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
              isSectionComplete(index)
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

        {/* Section 0: Calendar Audit */}
        {currentSection === 0 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">
                    Find 15-minute slots for coffee chats
                  </p>
                  <p className="mt-1">
                    Look at your calendar for the next 2 weeks and identify times
                    when you could have a quick networking call. Early mornings,
                    lunch breaks, and after work hours tend to work well.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={data.calendarAuditDone}
                  onChange={(e) =>
                    setData({ ...data, calendarAuditDone: e.target.checked })
                  }
                  className="w-5 h-5 text-primary-600 rounded"
                />
                <span className="font-medium">
                  I've reviewed my calendar for the next 2 weeks
                </span>
              </label>
            </div>

            <div>
              <label className="label">Available Time Slots</label>
              <textarea
                className="input min-h-[120px]"
                placeholder="List your available times, e.g.:&#10;- Weekdays 7:30-8:00am&#10;- Tuesdays & Thursdays 12:00-12:30pm&#10;- Fridays after 4:00pm"
                value={data.availableSlots || ""}
                onChange={(e) =>
                  setData({ ...data, availableSlots: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {/* Section 1: Scheduling Link */}
        {currentSection === 1 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Why use a scheduling link?</p>
                  <p className="mt-1">
                    Instead of back-and-forth emails, give people a link where
                    they can see your availability and book directly. It makes
                    you look professional and organized.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <a
                href="https://calendly.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div>
                  <p className="font-medium">Calendly</p>
                  <p className="text-sm text-gray-500">
                    Most popular, free tier available
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </a>

              <a
                href="https://cal.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div>
                  <p className="font-medium">Cal.com</p>
                  <p className="text-sm text-gray-500">
                    Open source alternative, free tier
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </a>
            </div>

            <div>
              <label className="label">Your Scheduling Link</label>
              <input
                type="url"
                className="input"
                placeholder="https://calendly.com/yourname/15min"
                value={data.schedulingLinkUrl || ""}
                onChange={(e) =>
                  setData({ ...data, schedulingLinkUrl: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Create a 15-minute meeting type for networking calls
              </p>
            </div>
          </div>
        )}

        {/* Section 2: Elevator Pitch */}
        {currentSection === 2 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Elevator Pitch Formula:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>
                      <strong>Who you are:</strong> "Hi, I'm [Name], a [Title]"
                    </li>
                    <li>
                      <strong>What you do:</strong> "I specialize in [skill/area]"
                    </li>
                    <li>
                      <strong>What you're looking for:</strong> "I'm exploring
                      [target roles/companies]"
                    </li>
                    <li>
                      <strong>The ask:</strong> "I'd love to learn about [specific
                      thing]"
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div>
              <label className="label">Your Elevator Pitch (30 seconds)</label>
              <textarea
                className="input min-h-[150px]"
                placeholder="Hi, I'm [Name], a [Title] with [X years] experience in [industry]. I specialize in [key skill] and have helped [accomplishment]. I'm currently exploring [target role] opportunities at [type of company]. I'd love to learn more about [specific area] and hear about your experience at [their company]."
                value={data.elevatorPitch || ""}
                onChange={(e) =>
                  setData({ ...data, elevatorPitch: e.target.value })
                }
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  {(data.elevatorPitch || "").split(/\s+/).filter(Boolean).length}{" "}
                  words (aim for 50-75)
                </p>
                {data.elevatorPitch && (
                  <button
                    onClick={handleCopy}
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    {copied ? (
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
                )}
              </div>
            </div>

            {careerProfile && (
              <div className="bg-gray-50 border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  Use info from your Day 1 profile:
                </p>
                <div className="text-sm space-y-1">
                  {careerProfile.yearsOfExperience && (
                    <p>
                      • <strong>Experience:</strong>{" "}
                      {careerProfile.yearsOfExperience} years
                    </p>
                  )}
                  {careerProfile.industriesWorkedIn?.length > 0 && (
                    <p>
                      • <strong>Industries:</strong>{" "}
                      {careerProfile.industriesWorkedIn.join(", ")}
                    </p>
                  )}
                  {careerProfile.technicalSkills?.length > 0 && (
                    <p>
                      • <strong>Top Skills:</strong>{" "}
                      {careerProfile.technicalSkills.slice(0, 3).join(", ")}
                    </p>
                  )}
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
              router.push("/dashboard/day/5");
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
            disabled={saving || !isComplete}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                Complete Day 6
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
