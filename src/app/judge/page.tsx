"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import {
  Gavel,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  FolderGit2,
  Trophy,
  ShieldCheck,
} from "lucide-react";

export default function JudgeDashboardPage() {
  const { user, openAuthModal } = useAuth();
  const [assignedHackathons, setAssignedHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const res = await fetch("/api/judging/assigned");
        const data = await res.json();
        if (data.success) {
          setAssignedHackathons(data.data || []);
        }
      } catch (err) {
        console.error("Failed to load judge queue:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAssigned();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-32 px-4 text-center">
        <Gavel className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Judging Portal</h2>
        <p className="text-xs text-slate-400 mb-6">
          Sign in to evaluate assigned projects and record multi-criteria scores.
        </p>
        <button
          onClick={() => openAuthModal("login")}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
        >
          Sign In as Judge
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
          <Gavel className="w-3.5 h-3.5" /> Official Review Panel
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Judging Portal
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review assigned hackathon submissions, test live demos, and score projects against weighted criteria.
        </p>
      </div>

      {loading && (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-slate-400">Loading judging assignments...</p>
        </div>
      )}

      {!loading && assignedHackathons.length === 0 && (
        <div className="py-20 text-center bg-slate-900/50 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
          <Gavel className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Active Judging Assignments</h3>
          <p className="text-xs text-slate-400">
            You do not currently have any assigned hackathons awaiting judging. Organizers will assign you when the submission window closes.
          </p>
        </div>
      )}

      {/* Assigned Hackathons Queue */}
      {!loading && assignedHackathons.length > 0 && (
        <div className="space-y-8">
          {assignedHackathons.map((h) => (
            <div key={h.id} className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                    {h.status}
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-1.5">{h.title}</h2>
                  <p className="text-xs text-slate-400">
                    Criteria: {h.criteria?.map((c: any) => c.name).join(" • ")}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="sm:w-64 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Review Progress</span>
                    <span className="text-amber-400">{h.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${h.progressPercent}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 text-right">
                    {h.scoredProjects} / {h.totalProjects} projects scored
                  </div>
                </div>
              </div>

              {/* Projects to Judge Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                <div className="divide-y divide-slate-800/80">
                  {h.projects?.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      No projects submitted for review in this hackathon yet.
                    </div>
                  ) : (
                    h.projects.map((p: any) => (
                      <div
                        key={p.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{p.title}</h4>
                            {p.hasScored ? (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3" /> Scored
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                                <Clock className="w-3 h-3" /> Pending Review
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">{p.tagline}</p>
                          <span className="text-[11px] text-slate-500 font-medium">Team {p.teamName}</span>
                        </div>

                        <div>
                          <Link
                            href={`/judge/projects/${p.id}`}
                            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                              p.hasScored
                                ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                                : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                            }`}
                          >
                            <Gavel className="w-3.5 h-3.5" />
                            {p.hasScored ? "Edit Score" : "Score Project"}
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
