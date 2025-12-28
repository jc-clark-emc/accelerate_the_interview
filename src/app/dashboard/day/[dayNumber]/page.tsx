"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DAYS } from "@/lib/constants";
import { ArrowLeft, ArrowRight, Save, CheckCircle, Plus, X } from "lucide-react";
import Link from "next/link";

interface CareerProfileData {
  technicalSkills: string[];
  softSkills: string[];
  toolsAndSoftware: string[];
  languages: string[];
  jobTitlesHeld: string[];
  industriesWorkedIn: string[];
  yearsOfExperience: number | null;
  typesOfWork: string[];
  degrees: { degree: string; field: string; school: string; year: string }[];
  certifications: string[];
  relevantTraining: string[];
  accomplishments: { description: string; metrics: string; impact: string }[];
  projectsProudOf: string[];
  awardsRecognition: string[];
}

const initialData: CareerProfileData = {
  technicalSkills: [],
  softSkills: [],
  toolsAndSoftware: [],
  languages: [],
  jobTitlesHeld: [],
  industriesWorkedIn: [],
  yearsOfExperience: null,
  typesOfWork: [],
  degrees: [],
  certifications: [],
  relevantTraining: [],
  accomplishments: [],
  projectsProudOf: [],
  awardsRecognition: [],
};

// Tag input component for array fields
function TagInput({
  label,
  placeholder,
  example,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  example: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="label">{label}</label>
      <p className="text-xs text-gray-500 -mt-1">Example: {example}</p>
      <div className="flex gap-2">
        <input
          type="text"
          className="input flex-1"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <button
          type="button"
          onClick={addTag}
          className="btn-secondary px-3"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-primary-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Day1Page() {
  const router = useRouter();
  const [data, setData] = useState<CareerProfileData>(initialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const dayInfo = DAYS[0];

  const sections = [
    {
      title: "Skills & Abilities",
      description: "What can you do? List your technical skills, soft skills, and tools you use.",
    },
    {
      title: "Experience",
      description: "Where have you worked and what have you done?",
    },
    {
      title: "Education & Credentials",
      description: "Your formal education and professional certifications.",
    },
    {
      title: "Accomplishments",
      description: "What wins are you proud of? Try to include numbers when possible.",
    },
  ];

  // Load existing data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/career-profile");
        if (res.ok) {
          const profile = await res.json();
          if (profile) {
            setData({ ...initialData, ...profile });
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Save data
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/career-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save");

      // If on last section, mark day complete and move to next
      if (currentSection === sections.length - 1) {
        await fetch("/api/day-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dayNumber: 1, status: "COMPLETED" }),
        });
        router.push("/dashboard/day/2");
      }
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  // Add accomplishment
  const addAccomplishment = () => {
    setData({
      ...data,
      accomplishments: [
        ...data.accomplishments,
        { description: "", metrics: "", impact: "" },
      ],
    });
  };

  // Update accomplishment
  const updateAccomplishment = (
    index: number,
    field: keyof CareerProfileData["accomplishments"][0],
    value: string
  ) => {
    const updated = [...data.accomplishments];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, accomplishments: updated });
  };

  // Remove accomplishment
  const removeAccomplishment = (index: number) => {
    setData({
      ...data,
      accomplishments: data.accomplishments.filter((_, i) => i !== index),
    });
  };

  // Add degree
  const addDegree = () => {
    setData({
      ...data,
      degrees: [
        ...data.degrees,
        { degree: "", field: "", school: "", year: "" },
      ],
    });
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
            1
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
            onClick={() => setCurrentSection(index)}
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

        {/* Section 0: Skills */}
        {currentSection === 0 && (
          <div className="space-y-6">
            <TagInput
              label="Technical/Hard Skills"
              placeholder="Add a skill and press Enter"
              example="Python, SQL, Data Analysis, Project Management"
              value={data.technicalSkills}
              onChange={(value) => setData({ ...data, technicalSkills: value })}
            />

            <TagInput
              label="Soft Skills"
              placeholder="Add a skill and press Enter"
              example="Communication, Leadership, Problem Solving"
              value={data.softSkills}
              onChange={(value) => setData({ ...data, softSkills: value })}
            />

            <TagInput
              label="Tools & Software"
              placeholder="Add a tool and press Enter"
              example="Excel, Figma, Salesforce, Jira, Slack"
              value={data.toolsAndSoftware}
              onChange={(value) => setData({ ...data, toolsAndSoftware: value })}
            />

            <TagInput
              label="Languages"
              placeholder="Add a language and press Enter"
              example="English (Native), Spanish (Fluent), Mandarin (Conversational)"
              value={data.languages}
              onChange={(value) => setData({ ...data, languages: value })}
            />
          </div>
        )}

        {/* Section 1: Experience */}
        {currentSection === 1 && (
          <div className="space-y-6">
            <TagInput
              label="Job Titles You've Held"
              placeholder="Add a job title and press Enter"
              example="Product Manager, Software Engineer, Marketing Director"
              value={data.jobTitlesHeld}
              onChange={(value) => setData({ ...data, jobTitlesHeld: value })}
            />

            <TagInput
              label="Industries You've Worked In"
              placeholder="Add an industry and press Enter"
              example="Technology, Healthcare, Finance, E-commerce"
              value={data.industriesWorkedIn}
              onChange={(value) => setData({ ...data, industriesWorkedIn: value })}
            />

            <div>
              <label className="label">Years of Experience</label>
              <input
                type="number"
                className="input w-32"
                placeholder="e.g., 5"
                value={data.yearsOfExperience || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    yearsOfExperience: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
              />
            </div>

            <TagInput
              label="Types of Work You've Done"
              placeholder="Add a type and press Enter"
              example="Managed teams, Built products, Analyzed data, Sold to clients"
              value={data.typesOfWork}
              onChange={(value) => setData({ ...data, typesOfWork: value })}
            />
          </div>
        )}

        {/* Section 2: Education */}
        {currentSection === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="label mb-0">Degrees</label>
                <button
                  type="button"
                  onClick={addDegree}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Degree
                </button>
              </div>

              {data.degrees.length === 0 && (
                <p className="text-sm text-gray-400 italic">
                  No degrees added. Click "Add Degree" or mark N/A if not applicable.
                </p>
              )}

              {data.degrees.map((degree, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg mb-3"
                >
                  <input
                    type="text"
                    className="input"
                    placeholder="Degree (e.g., Bachelor's)"
                    value={degree.degree}
                    onChange={(e) => {
                      const updated = [...data.degrees];
                      updated[index].degree = e.target.value;
                      setData({ ...data, degrees: updated });
                    }}
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="Field (e.g., Computer Science)"
                    value={degree.field}
                    onChange={(e) => {
                      const updated = [...data.degrees];
                      updated[index].field = e.target.value;
                      setData({ ...data, degrees: updated });
                    }}
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="School"
                    value={degree.school}
                    onChange={(e) => {
                      const updated = [...data.degrees];
                      updated[index].school = e.target.value;
                      setData({ ...data, degrees: updated });
                    }}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder="Year"
                      value={degree.year}
                      onChange={(e) => {
                        const updated = [...data.degrees];
                        updated[index].year = e.target.value;
                        setData({ ...data, degrees: updated });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setData({
                          ...data,
                          degrees: data.degrees.filter((_, i) => i !== index),
                        })
                      }
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <TagInput
              label="Certifications"
              placeholder="Add a certification and press Enter"
              example="PMP, AWS Solutions Architect, Google Analytics"
              value={data.certifications}
              onChange={(value) => setData({ ...data, certifications: value })}
            />

            <TagInput
              label="Relevant Training"
              placeholder="Add training and press Enter"
              example="Leadership Development Program, Sales Methodology Training"
              value={data.relevantTraining}
              onChange={(value) => setData({ ...data, relevantTraining: value })}
            />
          </div>
        )}

        {/* Section 3: Accomplishments */}
        {currentSection === 3 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="label mb-0">Key Accomplishments</label>
                  <p className="text-xs text-gray-500">
                    What wins are you proud of? Include metrics when possible.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addAccomplishment}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {data.accomplishments.length === 0 && (
                <p className="text-sm text-gray-400 italic">
                  No accomplishments added yet. Click "Add" to get started.
                </p>
              )}

              {data.accomplishments.map((acc, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg mb-3 space-y-3"
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Accomplishment {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAccomplishment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="input"
                    placeholder="What did you accomplish? (e.g., Launched new product feature)"
                    value={acc.description}
                    onChange={(e) =>
                      updateAccomplishment(index, "description", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="Any metrics? (e.g., Increased revenue by 25%)"
                    value={acc.metrics}
                    onChange={(e) =>
                      updateAccomplishment(index, "metrics", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="What was the impact? (e.g., Helped company reach profitability)"
                    value={acc.impact}
                    onChange={(e) =>
                      updateAccomplishment(index, "impact", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <TagInput
              label="Projects You're Proud Of"
              placeholder="Add a project and press Enter"
              example="Website Redesign, Mobile App Launch, Process Automation"
              value={data.projectsProudOf}
              onChange={(value) => setData({ ...data, projectsProudOf: value })}
            />

            <TagInput
              label="Awards & Recognition"
              placeholder="Add an award and press Enter"
              example="Employee of the Quarter, Sales Award, Patent Holder"
              value={data.awardsRecognition}
              onChange={(value) => setData({ ...data, awardsRecognition: value })}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className="btn-secondary flex items-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {currentSection < sections.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              handleSave();
              setCurrentSection(currentSection + 1);
            }}
            className="btn-primary flex items-center gap-2"
          >
            Save & Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                Complete Day 1
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
