"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import confetti from "canvas-confetti";
import {
  Trophy,
  Medal,
  Award,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  Users,
  FolderGit2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function LeaderboardPage() {
  const params = useParams();
  const { user } = useAuth();
  const slug = params.slug as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrize, setSelectedPrize] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [assigningPrize, setAssigningPrize] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`/api/leaderboard/${slug}`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (e) {
      console.error("Failed to load leaderboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [slug]);

  useEffect(() => {
    if (data?.leaderboard?.length > 0 && !data.isHidden) {
      // Trigger subtle celebration confetti once
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [data]);

  const handleToggleHide = async () => {
    if (!data?.hackathon?.id) return;
    await fetch(`/api/hackathons/${data.hackathon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLeaderboardLive: !data.hackathon.isLeaderboardLive }),
    });
    await fetchLeaderboard();
  };

  const handleToggleFreeze = async () => {
    if (!data?.hackathon?.id) return;
    await fetch(`/api/hackathons/${data.hackathon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLeaderboardFrozen: !data.hackathon.isLeaderboardFrozen }),
    });
    await fetchLeaderboard();
  };

  const handleAssignPrize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrize || !selectedProject || !data?.hackathon?.id) return;

    setAssigningPrize(true);
    setActionMessage("");

    try {
      const res = await fetch(`/api/leaderboard/${data.hackathon.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prizeId: selectedPrize, winnerProjectId: selectedProject }),
      });
      const result = await res.json();
      if (result.success) {
        setActionMessage("Prize awarded successfully! 🎉");
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        await fetchLeaderboard();
      }
    } catch {
      setActionMessage("Failed to assign prize.");
    } finally {
      setAssigningPrize(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Computing leaderboard rankings...</p>
      </div>
    );
  }

  const isOrganizer = user?.role === "ORGANIZER" || user?.role === "ADMIN";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href={`/hackathons/${data?.hackathon?.slug || slug}`}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Hackathon Details
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <span>Leaderboard & Results</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {data?.hackathon?.title} &bull; Ranked by weighted judge scoring matrices.
          </p>
        </div>

        {/* Organizer Management Controls */}
        {isOrganizer && (
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
            <button
              onClick={handleToggleHide}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                data?.hackathon?.isLeaderboardLive
                  ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}
            >
              {data?.hackathon?.isLeaderboardLive ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" /> Hide from Public
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" /> Publish to Public
                </>
              )}
            </button>

            <button
              onClick={handleToggleFreeze}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                data?.hackathon?.isLeaderboardFrozen
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              {data?.hackathon?.isLeaderboardFrozen ? "Judging Frozen" : "Freeze Scores"}
            </button>
          </div>
        )}
      </div>

      {/* Hidden notice for public */}
      {data?.isHidden && (
        <div className="p-8 bg-slate-900/90 border border-amber-500/30 rounded-2xl text-center space-y-3 max-w-lg mx-auto">
          <Lock className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Leaderboard Under Review</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The live scores and leaderboard rankings are currently private while our panel of judges completes the evaluation. Please check back soon!
          </p>
        </div>
      )}

      {/* Organizer Prize Assignment Tool */}
      {isOrganizer && data?.hackathon?.prizes?.length > 0 && (
        <div className="p-6 bg-slate-900 border border-indigo-500/30 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4" /> Award Prizes to Projects
          </h3>
          <form onSubmit={handleAssignPrize} className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedPrize}
              onChange={(e) => setSelectedPrize(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Prize...</option>
              {data.hackathon.prizes.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.value}) {p.winnerProject ? `(Won by: ${p.winnerProject.title})` : ""}
                </option>
              ))}
            </select>

            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Winning Project...</option>
              {data.leaderboard?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  #{p.rank} - {p.title} (Team: {p.team?.name})
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={assigningPrize || !selectedPrize || !selectedProject}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition whitespace-nowrap"
            >
              {assigningPrize ? "Assigning..." : "Assign Winner"}
            </button>
          </form>
          {actionMessage && (
            <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {actionMessage}
            </p>
          )}
        </div>
      )}

      {/* Leaderboard Table */}
      {!data?.isHidden && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Rank</th>
                  <th className="py-4 px-6">Project & Submission</th>
                  <th className="py-4 px-6">Team</th>
                  <th className="py-4 px-6 text-center">Judges</th>
                  <th className="py-4 px-6 text-right">Weighted Score</th>
                  <th className="py-4 px-6">Prizes & Awards</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {data.leaderboard?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No submitted projects to display on the leaderboard yet.
                    </td>
                  </tr>
                ) : (
                  data.leaderboard.map((item: any) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/40 transition ${
                        item.rank === 1
                          ? "bg-amber-500/5"
                          : item.rank === 2
                          ? "bg-slate-300/5"
                          : item.rank === 3
                          ? "bg-amber-700/5"
                          : ""
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {item.rank === 1 && (
                            <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold border border-amber-500/40">
                              🥇
                            </span>
                          )}
                          {item.rank === 2 && (
                            <span className="w-7 h-7 rounded-full bg-slate-300/20 text-slate-200 flex items-center justify-center font-extrabold border border-slate-300/40">
                              🥈
                            </span>
                          )}
                          {item.rank === 3 && (
                            <span className="w-7 h-7 rounded-full bg-amber-700/20 text-amber-500 flex items-center justify-center font-extrabold border border-amber-700/40">
                              🥉
                            </span>
                          )}
                          {item.rank > 3 && (
                            <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold font-mono">
                              #{item.rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Project Details */}
                      <td className="py-4 px-6 max-w-sm">
                        <Link href={`/projects/${item.id}`} className="block group">
                          <h4 className="font-bold text-white group-hover:text-indigo-400 transition text-sm">
                            {item.title}
                          </h4>
                          <p className="text-slate-400 text-xs line-clamp-1 mt-0.5">{item.tagline}</p>
                        </Link>
                      </td>

                      {/* Team */}
                      <td className="py-4 px-6">
                        <Link
                          href={`/teams/${item.team?.slug}`}
                          className="font-semibold text-slate-200 hover:text-indigo-400 transition flex items-center gap-1.5"
                        >
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.team?.name}</span>
                        </Link>
                        <span className="text-[11px] text-slate-500">
                          {item.team?.members?.length} members
                        </span>
                      </td>

                      {/* Judges Count */}
                      <td className="py-4 px-6 text-center font-mono text-slate-400">
                        {item.judgeCount} {item.judgeCount === 1 ? "review" : "reviews"}
                      </td>

                      {/* Score */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-block">
                          <span className="text-base font-extrabold font-mono text-indigo-400">
                            {item.finalScore.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono"> / 100</span>
                        </div>
                      </td>

                      {/* Prizes won */}
                      <td className="py-4 px-6">
                        {item.prizesWon?.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {item.prizesWon.map((pz: any) => (
                              <span
                                key={pz.id}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1"
                              >
                                <Award className="w-3 h-3 text-amber-400" />
                                {pz.title}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs italic">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
