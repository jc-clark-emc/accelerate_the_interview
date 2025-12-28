"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Trophy,
  Lock,
  Plus,
  Calendar,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

interface WeeklyWin {
  id: string;
  weekOf: string;
  wins: string[];
  challenges: string[];
  learnings: string[];
  nextWeekGoals: string[];
  createdAt: string;
}

export default function WeeklyWinsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [saving, setSaving] = useState(false);
  const [wins, setWins] = useState<WeeklyWin[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    weekOf: new Date().toISOString().split("T")[0],
    wins: [""],
    challenges: [""],
    learnings: [""],
    nextWeekGoals: [""],
  });

  // Check premium status and load wins
  useEffect(() => {
    async function loadData() {
      try {
        const [statusRes, winsRes] = await Promise.all([
          fetch("/api/subscription/status"),
          fetch("/api/weekly-wins"),
        ]);

        if (statusRes.ok) {
          const data = await statusRes.json();
          setIsPremium(data.tier === "PREMIUM");
        }

        if (winsRes.ok) {
          const data = await winsRes.json();
          setWins(data);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Add item to array field
  const addItem = (field: keyof typeof formData) => {
    if (Array.isArray(formData[field])) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] as string[]), ""],
      });
    }
  };

  // Update item in array field
  const updateItem = (field: keyof typeof formData, index: number, value: string) => {
    if (Array.isArray(formData[field])) {
      const arr = [...(formData[field] as string[])];
      arr[index] = value;
      setFormData({ ...formData, [field]: arr });
    }
  };

  // Remove item from array field
  const removeItem = (field: keyof typeof formData, index: number) => {
    if (Array.isArray(formData[field])) {
      const arr = [...(formData[field] as string[])];
      arr.splice(index, 1);
      setFormData({ ...formData, [field]: arr.length ? arr : [""] });
    }
  };

  // Save weekly win
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/weekly-wins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekOf: formData.weekOf,
          wins: formData.wins.filter(Boolean),
          challenges: formData.challenges.filter(Boolean),
          learnings: formData.learnings.filter(Boolean),
          nextWeekGoals: formData.nextWeekGoals.filter(Boolean),
        }),
      });

      if (res.ok) {
        const newWin = await res.json();
        setWins([newWin, ...wins]);
        setShowForm(false);
        setFormData({
          weekOf: new Date().toISOString().split("T")[0],
          wins: [""],
          challenges: [""],
          learnings: [""],
          nextWeekGoals: [""],
        });
      }
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete weekly win
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/weekly-wins?id=${id}`, { method: "DELETE" });
      setWins(wins.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Premium Feature</h1>
        <p className="text-gray-600 mb-6">
          Weekly Wins tracker is available on the Premium plan.
        </p>
        <Link href="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
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
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-bold">Weekly Wins</h1>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
            PREMIUM
          </span>
        </div>
        <p className="text-gray-600">
          Track your job search progress and celebrate your wins every week.
        </p>
      </div>

      {/* Add New Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary w-full flex items-center justify-center gap-2 mb-6"
        >
          <Plus className="w-4 h-4" />
          Log This Week's Wins
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="font-semibold mb-4">Weekly Reflection</h2>
          
          <div className="mb-4">
            <label className="label">Week Of</label>
            <input
              type="date"
              className="input w-48"
              value={formData.weekOf}
              onChange={(e) =>
                setFormData({ ...formData, weekOf: e.target.value })
              }
            />
          </div>

          {/* Wins */}
          <div className="mb-4">
            <label className="label text-green-700">🎉 Wins This Week</label>
            {formData.wins.map((win, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="What went well?"
                  value={win}
                  onChange={(e) => updateItem("wins", i, e.target.value)}
                />
                {formData.wins.length > 1 && (
                  <button
                    onClick={() => removeItem("wins", i)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addItem("wins")}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              + Add another win
            </button>
          </div>

          {/* Challenges */}
          <div className="mb-4">
            <label className="label text-orange-700">🚧 Challenges Faced</label>
            {formData.challenges.map((challenge, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="What was difficult?"
                  value={challenge}
                  onChange={(e) => updateItem("challenges", i, e.target.value)}
                />
                {formData.challenges.length > 1 && (
                  <button
                    onClick={() => removeItem("challenges", i)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addItem("challenges")}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              + Add another challenge
            </button>
          </div>

          {/* Learnings */}
          <div className="mb-4">
            <label className="label text-blue-700">💡 What I Learned</label>
            {formData.learnings.map((learning, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Insights or takeaways"
                  value={learning}
                  onChange={(e) => updateItem("learnings", i, e.target.value)}
                />
                {formData.learnings.length > 1 && (
                  <button
                    onClick={() => removeItem("learnings", i)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addItem("learnings")}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              + Add another learning
            </button>
          </div>

          {/* Next Week Goals */}
          <div className="mb-6">
            <label className="label text-purple-700">🎯 Next Week's Goals</label>
            {formData.nextWeekGoals.map((goal, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="What will you focus on?"
                  value={goal}
                  onChange={(e) => updateItem("nextWeekGoals", i, e.target.value)}
                />
                {formData.nextWeekGoals.length > 1 && (
                  <button
                    onClick={() => removeItem("nextWeekGoals", i)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addItem("nextWeekGoals")}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              + Add another goal
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !formData.wins.some(Boolean)}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Week"}
            </button>
          </div>
        </div>
      )}

      {/* Past Weeks */}
      <div className="space-y-3">
        {wins.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No weekly wins logged yet.</p>
            <p className="text-sm">Start tracking your progress!</p>
          </div>
        ) : (
          wins.map((win) => (
            <div key={win.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() =>
                  setExpandedId(expandedId === win.id ? null : win.id)
                }
                className="w-full p-4 bg-white hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <p className="font-medium">
                      Week of {new Date(win.weekOf).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {win.wins.length} wins • {win.challenges.length} challenges
                    </p>
                  </div>
                </div>
                {expandedId === win.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedId === win.id && (
                <div className="border-t bg-gray-50 p-4 space-y-4">
                  {win.wins.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">
                        🎉 Wins
                      </p>
                      <ul className="space-y-1">
                        {win.wins.map((w, i) => (
                          <li key={i} className="text-sm text-gray-700">
                            • {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {win.challenges.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-orange-700 mb-2">
                        🚧 Challenges
                      </p>
                      <ul className="space-y-1">
                        {win.challenges.map((c, i) => (
                          <li key={i} className="text-sm text-gray-700">
                            • {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {win.learnings.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-2">
                        💡 Learnings
                      </p>
                      <ul className="space-y-1">
                        {win.learnings.map((l, i) => (
                          <li key={i} className="text-sm text-gray-700">
                            • {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {win.nextWeekGoals.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-purple-700 mb-2">
                        🎯 Goals
                      </p>
                      <ul className="space-y-1">
                        {win.nextWeekGoals.map((g, i) => (
                          <li key={i} className="text-sm text-gray-700">
                            • {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <button
                      onClick={() => handleDelete(win.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Delete this week
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
