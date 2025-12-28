"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DAYS, DEFAULT_WEIGHTS } from "@/lib/constants";
import { ArrowLeft, ArrowRight, CheckCircle, Plus, X, Sliders } from "lucide-react";
import Link from "next/link";

interface CareerPreferencesData {
  targetJobTitles: string[];
  targetIndustries: string[];
  companySizePreference: string | null;
  salaryMin: number | null;
  salaryIdeal: number | null;
  benefitsPriorities: string[];
  workLocationPreference: string | null;
  geographicPreferences: string[];
  willingToRelocate: boolean;
  maxCommute: number | null;
  workHoursPreference: string | null;
  travelPreference: string | null;
  responsibilitiesWant: string[];
  responsibilitiesAvoid: string[];
  workLifeBalanceNotes: string | null;
  companyValuesImportant: string[];
  managementStylePrefer: string | null;
  teamDynamicsPrefer: string | null;
  nonNegotiables: string[];
  weights: Record<string, number>;
}

const initialData: CareerPreferencesData = {
  targetJobTitles: [],
  targetIndustries: [],
  companySizePreference: null,
  salaryMin: null,
  salaryIdeal: null,
  benefitsPriorities: [],
  workLocationPreference: null,
  geographicPreferences: [],
  willingToRelocate: false,
  maxCommute: null,
  workHoursPreference: null,
  travelPreference: null,
  responsibilitiesWant: [],
  responsibilitiesAvoid: [],
  workLifeBalanceNotes: null,
  companyValuesImportant: [],
  managementStylePrefer: null,
  teamDynamicsPrefer: null,
  nonNegotiables: [],
  weights: DEFAULT_WEIGHTS,
};

// Tag input component
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
        <button type="button" onClick={addTag} className="btn-secondary px-3">
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

// Radio group component
function RadioGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="label">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
              value === option.value
                ? "bg-primary-100 border-primary-500 text-primary-700"
                : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Day2Page() {
  const router = useRouter();
  const [data, setData] = useState<CareerPreferencesData>(initialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const dayInfo = DAYS[1]; // Day 2

  const sections = [
    {
      title: "Target Roles & Industries",
      description: "What jobs are you looking for and where?",
    },
    {
      title: "Compensation",
      description: "What do you need to earn?",
    },
    {
      title: "Work Environment",
      description: "Where and how do you want to work?",
    },
    {
      title: "Responsibilities",
      description: "What do you want to do (and avoid)?",
    },
    {
      title: "Non-Negotiables & Weights",
      description: "Your dealbreakers and what matters most.",
    },
  ];

  // Load existing data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/career-preferences");
        if (res.ok) {
          const prefs = await res.json();
          if (prefs) {
            setData({ ...initialData, ...prefs });
          }
        }
      } catch (err) {
        console.error("Failed to load preferences:", err);
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
      const res = await fetch("/api/career-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save");

      if (moveNext) {
        if (currentSection === sections.length - 1) {
          // Complete day and move to next
          await fetch("/api/day-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dayNumber: 2, status: "COMPLETED" }),
          });
          router.push("/dashboard/day/3");
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

  // Update weight
  const updateWeight = (key: string, value: number) => {
    setData({
      ...data,
      weights: {
        ...data.weights,
        [key]: value,
      },
    });
  };

  // Calculate total weight
  const totalWeight = Object.values(data.weights).reduce((a, b) => a + b, 0);

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
            2
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

        {/* Section 0: Target Roles */}
        {currentSection === 0 && (
          <div className="space-y-6">
            <TagInput
              label="Target Job Titles"
              placeholder="Add a job title and press Enter"
              example="Product Manager, Senior PM, Director of Product"
              value={data.targetJobTitles}
              onChange={(value) => setData({ ...data, targetJobTitles: value })}
            />

            <TagInput
              label="Target Industries"
              placeholder="Add an industry and press Enter"
              example="Technology, Healthcare, Finance, E-commerce"
              value={data.targetIndustries}
              onChange={(value) => setData({ ...data, targetIndustries: value })}
            />

            <RadioGroup
              label="Company Size Preference"
              options={[
                { value: "startup", label: "Startup (1-50)" },
                { value: "small", label: "Small (51-200)" },
                { value: "medium", label: "Medium (201-1000)" },
                { value: "large", label: "Large (1000+)" },
                { value: "no_preference", label: "No Preference" },
              ]}
              value={data.companySizePreference}
              onChange={(value) =>
                setData({ ...data, companySizePreference: value })
              }
            />
          </div>
        )}

        {/* Section 1: Compensation */}
        {currentSection === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Minimum Acceptable Salary</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    className="input pl-7"
                    placeholder="80,000"
                    value={data.salaryMin || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        salaryMin: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  The lowest you'd accept
                </p>
              </div>
              <div>
                <label className="label">Ideal Salary</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    className="input pl-7"
                    placeholder="120,000"
                    value={data.salaryIdeal || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        salaryIdeal: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">What you're aiming for</p>
              </div>
            </div>

            <TagInput
              label="Benefits That Matter Most"
              placeholder="Add a benefit and press Enter"
              example="Health insurance, 401k match, Remote work, Unlimited PTO"
              value={data.benefitsPriorities}
              onChange={(value) =>
                setData({ ...data, benefitsPriorities: value })
              }
            />
          </div>
        )}

        {/* Section 2: Work Environment */}
        {currentSection === 2 && (
          <div className="space-y-6">
            <RadioGroup
              label="Work Location Preference"
              options={[
                { value: "remote", label: "Remote Only" },
                { value: "hybrid", label: "Hybrid" },
                { value: "onsite", label: "On-site" },
                { value: "flexible", label: "Flexible / No Preference" },
              ]}
              value={data.workLocationPreference}
              onChange={(value) =>
                setData({ ...data, workLocationPreference: value })
              }
            />

            <TagInput
              label="Geographic Preferences"
              placeholder="Add a city or region and press Enter"
              example="San Francisco, New York, Austin, Anywhere in US"
              value={data.geographicPreferences}
              onChange={(value) =>
                setData({ ...data, geographicPreferences: value })
              }
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="relocate"
                checked={data.willingToRelocate}
                onChange={(e) =>
                  setData({ ...data, willingToRelocate: e.target.checked })
                }
                className="w-4 h-4 text-primary-600 rounded"
              />
              <label htmlFor="relocate" className="text-sm text-gray-700">
                I'm willing to relocate for the right opportunity
              </label>
            </div>

            {data.workLocationPreference !== "remote" && (
              <div>
                <label className="label">Maximum Commute (minutes)</label>
                <input
                  type="number"
                  className="input w-32"
                  placeholder="30"
                  value={data.maxCommute || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      maxCommute: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                />
              </div>
            )}

            <RadioGroup
              label="Work Hours Preference"
              options={[
                { value: "standard", label: "Standard 9-5" },
                { value: "flexible", label: "Flexible Hours" },
                { value: "shifts", label: "Shift Work OK" },
                { value: "no_preference", label: "No Preference" },
              ]}
              value={data.workHoursPreference}
              onChange={(value) =>
                setData({ ...data, workHoursPreference: value })
              }
            />

            <RadioGroup
              label="Travel Requirements"
              options={[
                { value: "none", label: "No Travel" },
                { value: "minimal", label: "Minimal (<10%)" },
                { value: "some", label: "Some (10-25%)" },
                { value: "frequent", label: "Frequent (25%+)" },
                { value: "no_preference", label: "No Preference" },
              ]}
              value={data.travelPreference}
              onChange={(value) =>
                setData({ ...data, travelPreference: value })
              }
            />
          </div>
        )}

        {/* Section 3: Responsibilities */}
        {currentSection === 3 && (
          <div className="space-y-6">
            <TagInput
              label="Responsibilities You WANT"
              placeholder="Add something you want to do and press Enter"
              example="Lead a team, Work with data, Build products, Talk to customers"
              value={data.responsibilitiesWant}
              onChange={(value) =>
                setData({ ...data, responsibilitiesWant: value })
              }
            />

            <TagInput
              label="Responsibilities You Want to AVOID"
              placeholder="Add something you don't want to do and press Enter"
              example="Cold calling, Managing large teams, On-call rotations"
              value={data.responsibilitiesAvoid}
              onChange={(value) =>
                setData({ ...data, responsibilitiesAvoid: value })
              }
            />

            <div>
              <label className="label">Work-Life Balance Notes</label>
              <textarea
                className="input min-h-[100px]"
                placeholder="What does work-life balance mean to you? Any specific needs?"
                value={data.workLifeBalanceNotes || ""}
                onChange={(e) =>
                  setData({ ...data, workLifeBalanceNotes: e.target.value })
                }
              />
            </div>

            <TagInput
              label="Company Values That Matter"
              placeholder="Add a value and press Enter"
              example="Diversity, Sustainability, Innovation, Work-life balance"
              value={data.companyValuesImportant}
              onChange={(value) =>
                setData({ ...data, companyValuesImportant: value })
              }
            />
          </div>
        )}

        {/* Section 4: Non-Negotiables & Weights */}
        {currentSection === 4 && (
          <div className="space-y-6">
            <TagInput
              label="Non-Negotiables (Dealbreakers)"
              placeholder="Add a dealbreaker and press Enter"
              example="No on-call, Must be remote, No toxic culture, Minimum salary"
              value={data.nonNegotiables}
              onChange={(value) => setData({ ...data, nonNegotiables: value })}
            />

            <div className="border-t pt-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold">Priority Weights</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                How important is each factor when evaluating jobs? Adjust the
                sliders so they total 100%.
              </p>

              <div className="space-y-4">
                {[
                  { key: "salary", label: "Salary Match" },
                  { key: "workLocation", label: "Work Location" },
                  { key: "commute", label: "Commute" },
                  { key: "mustHaveSkills", label: "Uses My Skills" },
                  { key: "niceToHaveSkills", label: "Nice-to-Have Skills" },
                  { key: "nonNegotiables", label: "Avoids Dealbreakers" },
                  { key: "responsibilities", label: "Responsibilities Match" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-4">
                    <label className="w-40 text-sm text-gray-700">
                      {item.label}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={data.weights[item.key] || 0}
                      onChange={(e) =>
                        updateWeight(item.key, parseInt(e.target.value))
                      }
                      className="flex-1"
                    />
                    <span className="w-12 text-right text-sm font-medium">
                      {data.weights[item.key] || 0}%
                    </span>
                  </div>
                ))}
              </div>

              <div
                className={`mt-4 p-3 rounded-lg ${
                  totalWeight === 100
                    ? "bg-green-50 text-green-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                <p className="text-sm font-medium">
                  Total: {totalWeight}%{" "}
                  {totalWeight === 100
                    ? "✓ Perfect!"
                    : totalWeight < 100
                    ? `(Add ${100 - totalWeight}% more)`
                    : `(Remove ${totalWeight - 100}%)`}
                </p>
              </div>
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
              router.push("/dashboard/day/1");
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
            disabled={saving || totalWeight !== 100}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                Complete Day 2
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
