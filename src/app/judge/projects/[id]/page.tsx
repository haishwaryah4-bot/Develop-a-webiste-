"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import confetti from "canvas-confetti";
import {
  Gavel,
  ArrowLeft,
  ExternalLink,
  Github,
  Video,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  Send,
} from "lucide-react";

export default function ProjectJudgingStudioPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProjectAndScores = async () => {
      try {
        const [projRes, scoreRes] = await Promise.all([
          fetch(`/api/projects/${id}`).then((r) => r.json()),
          fetch(`/api/judging/scores?projectId=${id}`).then((r) => r.json()),
        ]);

        if (projRes.success && projRes.data) {
          const p = projRes.data;
          setProject(p);

          // Prepopulate existing scores
          const initialScores: Record<string, number> = {};
          p.hackathon?.criteria?.forEach((c: any) => {
            initialScores[c.id] = 8.0; // Default sensible initial
          });

          if (scoreRes.success && scoreRes.data?.length > 0) {
            scoreRes.data.forEach((s: any) => {
              initialScores[s.criteriaId] = s.score;
              if (s.feedback) setFeedback(s.feedback);
            });
          }

          setScores(initialScores);
        }
      } catch (err) {
        console.error("Fetch judging error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndScores();
  }, [id]);

  const handleScoreChange = (criteriaId: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [criteriaId]: value,
    }));
  };

  const calculateLiveTotal = () => {
    if (!project?.hackathon?.criteria?.length) return 0;
    const criteriaList = project.hackathon.criteria;
    const totalWeight = criteriaList.reduce((sum: number, c: any) => sum + (c.weight || 1), 0);

    let weightedSum = 0;
    criteriaList.forEach((c: any) => {
      const val = scores[c.id] || 0;
      weightedSum += (val / (c.maxScore || 10)) * 100 * (c.weight || 1);
    });

    return totalWeight > 0 ? Number((weightedSum / totalWeight).toFixed(1)) : 0;
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const formattedScores = Object.entries(scores).map(([criteriaId, score]) => ({
        criteriaId,
        score,
      }));

      const res = await fetch("/api/judging/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          scores: formattedScores,
          feedback,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMessage(data.error?.message || "Failed to submit scores");
      } else {
        setStatusMessage("Scores recorded successfully! ⭐");
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading evaluation studio...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-24 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
        <Link href="/judge" className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
          Back to Judging Portal
        </Link>
      </div>
    );
  }

  const liveTotalScore = calculateLiveTotal();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/judge"
          className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Review Queue
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400">
              Evaluating for {project.hackathon?.title}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>
            <p className="text-xs text-slate-400">Team: {project.team?.name}</p>
          </div>

          <div className="flex items-center gap-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Test Demo
              </a>
            )}
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
              >
                <Github className="w-3.5 h-3.5" /> Inspect Code
              </a>
            )}
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {statusMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {errorMessage}
        </div>
      )}

      {/* Split View: Left Project Details vs Right Score Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Project Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tagline & Problem</h3>
            <p className="text-sm text-slate-200 font-medium">{project.tagline}</p>

            {project.problem && (
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300">
                <strong className="text-white block mb-1">The Problem:</strong>
                {project.problem}
              </div>
            )}

            {project.solution && (
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300">
                <strong className="text-white block mb-1">The Solution:</strong>
                {project.solution}
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Detailed Description</h3>
            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono">
              {project.description}
            </div>
          </div>
        </div>

        {/* Right: Scoring Matrix Studio (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 p-6 bg-slate-900 border border-amber-500/40 rounded-3xl space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-400" /> Evaluation Matrix
              </h3>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Computed Total</span>
                <span className="text-xl font-extrabold font-mono text-amber-400">
                  {liveTotalScore} <span className="text-xs text-slate-500">/ 100</span>
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmitScore} className="space-y-5">
              {/* Sliders for each criterion */}
              <div className="space-y-4">
                {project.hackathon?.criteria?.map((c: any) => {
                  const currentVal = scores[c.id] ?? 8.0;
                  return (
                    <div key={c.id} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white">{c.name}</h4>
                          <span className="text-[10px] text-indigo-400 font-mono font-semibold">
                            Weight: {c.weight}x
                          </span>
                        </div>
                        <span className="text-sm font-extrabold font-mono text-amber-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-700">
                          {currentVal.toFixed(1)} / {c.maxScore || 10}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="1"
                        max={c.maxScore || 10}
                        step="0.5"
                        value={currentVal}
                        onChange={(e) => handleScoreChange(c.id, Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Written Judge Feedback */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Written Feedback & Recommendation
                </label>
                <textarea
                  rows={3}
                  placeholder="Share constructive feedback for the team..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {saving ? "Recording Score..." : "Submit Evaluation & Score"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
