"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DAYS, STAR_QUESTIONS } from "@/lib/constants";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Video,
  Lightbulb,
  Check,
} from "lucide-react";
import Link from "next/link";

interface PracticeEval {
  questionNumber: number;
  pacing: number;
  eyeContact: number;
  fillerWords: number;
  confidence: number;
  length: number;
  notes: string;
  completed: boolean;
}

const CRITERIA = [
  { key: "pacing", label: "Pacing", description: "Not too fast, not too slow" },
  { key: "eyeContact", label: "Eye Contact", description: "Looking at camera" },
  { key: "fillerWords", label: "Filler Words", description: "Minimal um, uh, like" },
  { key: "confidence", label: "Confidence", description: "Strong delivery" },
  { key: "length", label: "Length", description: "1-2 minutes ideal" },
];

export default function Day13Page() {
  const router = useRouter();
  const [evals, setEvals] = useState<PracticeEval[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const dayInfo = DAYS[12]; // Day 13

  // Initialize evaluations
  useEffect(() => {
    // For now, initialize empty evaluations
    setEvals(
      STAR_QUESTIONS.map((q) => ({
        questionNumber: q.number,
        pacing: 3,
        eyeContact: 3,
        fillerWords: 3,
        confidence: 3,
        length: 3,
        notes: "",
        completed: false,
      }))
    );
    setLoading(false);
  }, []);

  // Update evaluation
  const updateEval = (field: keyof PracticeEval, value: any) => {
    setEvals(
      evals.map((e, i) =>
        i === currentQuestion ? { ...e, [field]: value } : e
      )
    );
  };

  // Mark as practiced
  const markPracticed = () => {
    setEvals(
      evals.map((e, i) =>
        i === currentQuestion ? { ...e, completed: true } : e
      )
    );
  };

  // Count completed
  const completedCount = evals.filter((e) => e.completed).length;
  const isComplete = completedCount >= 10;

  // Complete day
  const handleComplete = async () => {
    if (!isComplete) return;

    setSaving(true);
    try {
      await fetch("/api/day-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayNumber: 13, status: "COMPLETED" }),
      });
      router.push("/dashboard/day/14");
    } catch (err) {
      console.error("Failed to complete day:", err);
    } finally {
      setSaving(false);
    }
  };

  const currentEval = evals[currentQuestion];
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
            13
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
            <h2 className="font-semibold">Questions Practiced</h2>
            <p className="text-sm text-gray-500">
              Record and evaluate all 10 answers
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
          {evals.map((evalItem, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                index === currentQuestion
                  ? "bg-primary-600 text-white"
                  : evalItem.completed
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <Video className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">How to practice:</p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Open your phone camera or laptop webcam</li>
              <li>Record yourself answering the question (1-2 minutes)</li>
              <li>Watch it back and evaluate your delivery</li>
              <li>Note what to improve, then try again if needed</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Current Question */}
      {currentEval && questionInfo && (
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Question {currentQuestion + 1} of 10
              </p>
              <h2 className="text-lg font-semibold">{questionInfo.question}</h2>
            </div>
            {currentEval.completed && (
              <CheckCircle className="w-6 h-6 text-green-500" />
            )}
          </div>

          {/* Self-Evaluation */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600 font-medium">
              Rate your delivery (1 = needs work, 5 = nailed it):
            </p>

            {CRITERIA.map((criterion) => (
              <div key={criterion.key} className="flex items-center gap-4">
                <div className="w-32">
                  <p className="text-sm font-medium">{criterion.label}</p>
                  <p className="text-xs text-gray-500">{criterion.description}</p>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() =>
                        updateEval(criterion.key as keyof PracticeEval, score)
                      }
                      className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                        currentEval[criterion.key as keyof PracticeEval] === score
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-white text-gray-600 hover:border-primary-300"
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <label className="label">Notes to Self</label>
              <textarea
                className="input min-h-[80px]"
                placeholder="What specifically do you want to improve? Any phrases that felt awkward? What went well?"
                value={currentEval.notes}
                onChange={(e) => updateEval("notes", e.target.value)}
              />
            </div>

            {!currentEval.completed && (
              <button
                onClick={markPracticed}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mark as Practiced
              </button>
            )}

            {currentEval.completed && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-green-700 font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Practiced!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Pro tips:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Practice in a quiet room with good lighting</li>
              <li>Speak to the camera as if it's a person</li>
              <li>It's normal to cringe watching yourself - push through!</li>
              <li>Focus on 1-2 things to improve, not everything</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => {
            if (currentQuestion === 0) {
              router.push("/dashboard/day/12");
            } else {
              setCurrentQuestion(currentQuestion - 1);
            }
          }}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentQuestion === 0 ? "Previous Day" : "Previous"}
        </button>

        {currentQuestion < 9 ? (
          <button
            type="button"
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            className="btn-primary flex items-center gap-2"
          >
            Next Question
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
              `Practice ${10 - completedCount} more`
            ) : (
              <>
                Complete Day 13
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
