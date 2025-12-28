"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DAYS, STAR_QUESTIONS } from "@/lib/constants";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

interface StarStory {
  questionNumber: number;
  question: string;
  situation: string;
  task: string;
  action: string;
  result: string;
}

export default function Day12Page() {
  const router = useRouter();
  const [stories, setStories] = useState<StarStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [hasAI, setHasAI] = useState(false);

  const dayInfo = DAYS[11]; // Day 12

  // Initialize stories
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/star-stories");
        if (res.ok) {
          const data = await res.json();
          
          // Merge with default questions
          const mergedStories = STAR_QUESTIONS.map((q) => {
            const existing = data.find((s: StarStory) => s.questionNumber === q.number);
            return existing || {
              questionNumber: q.number,
              question: q.question,
              situation: "",
              task: "",
              action: "",
              result: "",
            };
          });
          
          setStories(mergedStories);
        } else {
          // Initialize with empty stories
          setStories(
            STAR_QUESTIONS.map((q) => ({
              questionNumber: q.number,
              question: q.question,
              situation: "",
              task: "",
              action: "",
              result: "",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load stories:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Save current story
  const handleSave = async () => {
    setSaving(true);
    try {
      const story = stories[currentQuestion];
      await fetch("/api/star-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(story),
      });
    } catch (err) {
      console.error("Failed to save story:", err);
    } finally {
      setSaving(false);
    }
  };

  // Update current story
  const updateStory = (field: keyof StarStory, value: string) => {
    setStories(
      stories.map((s, i) =>
        i === currentQuestion ? { ...s, [field]: value } : s
      )
    );
  };

  // Check if story is complete
  const isStoryComplete = (story: StarStory) => {
    return story.situation && story.task && story.action && story.result;
  };

  // Count completed
  const completedCount = stories.filter(isStoryComplete).length;
  const isComplete = completedCount >= 10;

  // Complete day
  const handleComplete = async () => {
    if (!isComplete) return;

    setSaving(true);
    try {
      // Save current story first
      await handleSave();
      
      await fetch("/api/day-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayNumber: 12, status: "COMPLETED" }),
      });
      router.push("/dashboard/day/13");
    } catch (err) {
      console.error("Failed to complete day:", err);
    } finally {
      setSaving(false);
    }
  };

  const currentStory = stories[currentQuestion];
  const questionInfo = STAR_QUESTIONS[currentQuestion];

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
            12
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
            <h2 className="font-semibold">STAR Stories Completed</h2>
            <p className="text-sm text-gray-500">
              Answer all 10 behavioral questions
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-primary-600">
              {completedCount}
            </span>
            <span className="text-gray-400">/10</span>
          </div>
        </div>

        {/* Question selector */}
        <div className="flex gap-1 flex-wrap">
          {stories.map((story, index) => (
            <button
              key={index}
              onClick={() => {
                handleSave();
                setCurrentQuestion(index);
              }}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                index === currentQuestion
                  ? "bg-primary-600 text-white"
                  : isStoryComplete(story)
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* STAR Framework */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">STAR Framework:</p>
            <ul className="mt-1 space-y-1">
              <li>
                <strong>S</strong>ituation: Set the scene (where, when, context)
              </li>
              <li>
                <strong>T</strong>ask: What was your responsibility?
              </li>
              <li>
                <strong>A</strong>ction: What did YOU do specifically?
              </li>
              <li>
                <strong>R</strong>esult: What was the outcome? Use numbers!
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Current Question */}
      {currentStory && (
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Question {currentQuestion + 1} of 10
              </p>
              <h2 className="text-lg font-semibold">{currentStory.question}</h2>
              {questionInfo && (
                <p className="text-sm text-gray-500 mt-1">
                  What they're really asking: {questionInfo.whatTheyreAsking}
                </p>
              )}
            </div>
            {isStoryComplete(currentStory) && (
              <CheckCircle className="w-6 h-6 text-green-500" />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="label flex items-center gap-2">
                <span className="bg-primary-100 text-primary-600 font-bold w-6 h-6 rounded-full flex items-center justify-center text-sm">
                  S
                </span>
                Situation
              </label>
              <textarea
                className="input min-h-[80px]"
                placeholder="Set the scene. Where were you? When was this? What was the context?"
                value={currentStory.situation}
                onChange={(e) => updateStory("situation", e.target.value)}
              />
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <span className="bg-primary-100 text-primary-600 font-bold w-6 h-6 rounded-full flex items-center justify-center text-sm">
                  T
                </span>
                Task
              </label>
              <textarea
                className="input min-h-[80px]"
                placeholder="What was your specific responsibility or goal?"
                value={currentStory.task}
                onChange={(e) => updateStory("task", e.target.value)}
              />
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <span className="bg-primary-100 text-primary-600 font-bold w-6 h-6 rounded-full flex items-center justify-center text-sm">
                  A
                </span>
                Action
              </label>
              <textarea
                className="input min-h-[100px]"
                placeholder="What did YOU do? Be specific about YOUR actions, not the team's."
                value={currentStory.action}
                onChange={(e) => updateStory("action", e.target.value)}
              />
              {hasAI && (
                <button className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Improve with AI
                </button>
              )}
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <span className="bg-primary-100 text-primary-600 font-bold w-6 h-6 rounded-full flex items-center justify-center text-sm">
                  R
                </span>
                Result
              </label>
              <textarea
                className="input min-h-[80px]"
                placeholder="What was the outcome? Use numbers and metrics when possible."
                value={currentStory.result}
                onChange={(e) => updateStory("result", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => {
            if (currentQuestion === 0) {
              router.push("/dashboard/day/11");
            } else {
              handleSave();
              setCurrentQuestion(currentQuestion - 1);
            }
          }}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentQuestion === 0 ? "Previous Day" : "Previous Question"}
        </button>

        {currentQuestion < 9 ? (
          <button
            type="button"
            onClick={() => {
              handleSave();
              setCurrentQuestion(currentQuestion + 1);
            }}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? "Saving..." : "Save & Next"}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleComplete}
            disabled={saving || !isComplete}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              "Saving..."
            ) : !isComplete ? (
              `Complete ${10 - completedCount} more`
            ) : (
              <>
                Complete Day 12
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
