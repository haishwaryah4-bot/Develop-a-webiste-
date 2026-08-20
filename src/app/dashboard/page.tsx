"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import CountdownTimer from "@/components/CountdownTimer";
import {
  Trophy,
  Users,
  FolderGit2,
  Award,
  Sparkles,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
} from "lucide-react";

export default function ParticipantDashboard() {
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<"hackathons" | "teams" | "projects" | "certificates">("hackathons");

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Team Modal state
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isJoinTeamOpen, setIsJoinTeamOpen] = useState(false);
  const [teamHackathonId, setTeamHackathonId] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [teamActionLoading, setTeamActionLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [userRes, teamsRes, certsRes] = await Promise.all([
        fetch(`/api/users/${user.username}`).then((r) => r.json()),
        fetch(`/api/teams?userId=${user.id}`).then((r) => r.json()),
        fetch(`/api/certificates`).then((r) => r.json()),
      ]);

      if (userRes.success && userRes.data) {
        setRegistrations(userRes.data.registrations || []);
      }
      if (teamsRes.success && teamsRes.data) {
        setTeams(teamsRes.data || []);
        // Collect projects from teams
        const allProjects: any[] = [];
        teamsRes.data.forEach((t: any) => {
          t.projects?.forEach((p: any) => allProjects.push({ ...p, team: t }));
        });
        setProjects(allProjects);
      }
      if (certsRes.success && certsRes.data) {
        setCertificates(certsRes.data || []);
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamHackathonId || !newTeamName) return;

    setTeamActionLoading(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hackathonId: teamHackathonId,
          name: newTeamName,
          description: newTeamDesc,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateTeamOpen(false);
        setNewTeamName("");
        setNewTeamDesc("");
        await fetchData();
      } else {
        alert(data.error?.message || "Failed to create team");
      }
    } finally {
      setTeamActionLoading(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput) return;

    setTeamActionLoading(true);
    try {
      const res = await fetch(`/api/teams/${encodeURIComponent(joinCodeInput)}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joinCode: joinCodeInput }),
      });
      const data = await res.json();
      if (data.success) {
        setIsJoinTeamOpen(false);
        setJoinCodeInput("");
        await fetchData();
      } else {
        alert(data.error?.message || "Failed to join team");
      }
    } finally {
      setTeamActionLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-32 px-4 text-center">
        <Trophy className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Participant Dashboard</h2>
        <p className="text-xs text-slate-400 mb-6">
          Sign in or create an account to view your registered hackathons, teams, and submissions.
        </p>
        <button
          onClick={() => openAuthModal("login")}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
        >
          Sign In / Demo Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Header & User welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
            alt={user.name}
            className="w-14 h-14 rounded-2xl border border-slate-700 object-cover bg-slate-800"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-slate-400">
              @{user.username} &bull; {user.role} &bull; Participant Command Center
            </p>
          </div>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsJoinTeamOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition"
          >
            Join with Code
          </button>
          <button
            onClick={() => setIsCreateTeamOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Create Team
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Registered Hackathons
          </span>
          <div className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-400" />
            {registrations.length}
          </div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            My Teams
          </span>
          <div className="text-2xl font-extrabold text-purple-400 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            {teams.length}
          </div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Submissions
          </span>
          <div className="text-2xl font-extrabold text-blue-400 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-blue-400" />
            {projects.length}
          </div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Verified Certificates
          </span>
          <div className="text-2xl font-extrabold text-amber-400 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            {certificates.length}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-800 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("hackathons")}
          className={`pb-3 px-4 transition border-b-2 ${
            activeTab === "hackathons"
              ? "border-indigo-500 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Registered Hackathons ({registrations.length})
        </button>
        <button
          onClick={() => setActiveTab("teams")}
          className={`pb-3 px-4 transition border-b-2 ${
            activeTab === "teams"
              ? "border-indigo-500 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          My Teams ({teams.length})
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`pb-3 px-4 transition border-b-2 ${
            activeTab === "projects"
              ? "border-indigo-500 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Submissions ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab("certificates")}
          className={`pb-3 px-4 transition border-b-2 ${
            activeTab === "certificates"
              ? "border-indigo-500 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Certificates ({certificates.length})
        </button>
      </div>

      {/* Tab 1: Registered Hackathons */}
      {activeTab === "hackathons" && (
        <div className="space-y-4">
          {registrations.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
              <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Registrations Yet</h3>
              <p className="text-xs text-slate-400 mb-4">
                Explore open hackathons and register to participate with your team.
              </p>
              <Link
                href="/hackathons"
                className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl inline-block"
              >
                Browse Hackathons
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {registrations.map((r: any) => {
                const h = r.hackathon;
                return (
                  <div
                    key={r.id}
                    className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Registered
                        </span>
                        <span className="text-xs text-slate-400">{h.theme}</span>
                      </div>
                      <Link href={`/hackathons/${h.slug}`} className="hover:text-indigo-400 transition">
                        <h3 className="text-lg font-bold text-white mb-1">{h.title}</h3>
                      </Link>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                      <Link
                        href={`/hackathons/${h.slug}`}
                        className="text-xs text-slate-300 hover:text-white font-semibold"
                      >
                        View Hub &rarr;
                      </Link>
                      <Link
                        href={`/hackathons/${h.slug}/submit`}
                        className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold rounded-xl transition"
                      >
                        Submit Project
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Teams */}
      {activeTab === "teams" && (
        <div className="space-y-4">
          {teams.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Active Teams</h3>
              <p className="text-xs text-slate-400 mb-4">
                Create a team to collaborate on projects or join an existing team with a join code.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsCreateTeamOpen(true)}
                  className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                >
                  Create Team
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map((t: any) => (
                <div key={t.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{t.name}</h3>
                      <p className="text-xs text-indigo-400">{t.hackathon?.title}</p>
                    </div>
                    {/* Shareable join code */}
                    <button
                      onClick={() => copyToClipboard(t.joinCode)}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-slate-300 rounded-lg transition"
                      title="Click to copy join code"
                    >
                      {copiedCode === t.joinCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" /> {t.joinCode}
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{t.description || "No description provided."}</p>

                  {/* Members list */}
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Roster ({t.members?.length} / {t.hackathon?.maxTeamSize || 4})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {t.members?.map((m: any) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-lg text-xs text-slate-200"
                        >
                          <img
                            src={m.user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.user.username}`}
                            alt={m.user.name}
                            className="w-4 h-4 rounded-full"
                          />
                          <span>{m.user.name}</span>
                          {m.role === "OWNER" && (
                            <span className="text-[10px] text-amber-400 font-bold ml-1">👑</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <Link
                      href={`/teams/${t.slug}`}
                      className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      Team Workspace <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Submissions */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
              <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Projects Submitted Yet</h3>
              <p className="text-xs text-slate-400 mb-4">
                When you or your team creates a project, it will appear here for review and editing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((p: any) => (
                <div key={p.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded ${
                        p.status === "SUBMITTED"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-700/50 text-slate-300"
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="text-xs text-slate-400">Team: {p.team?.name}</span>
                  </div>

                  <Link href={`/projects/${p.id}`} className="block hover:text-indigo-400 transition">
                    <h3 className="text-base font-bold text-white">{p.title}</h3>
                  </Link>

                  <p className="text-xs text-slate-400 line-clamp-2">{p.tagline}</p>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <Link href={`/projects/${p.id}`} className="text-xs text-slate-300 hover:text-white font-semibold">
                      View Project &rarr;
                    </Link>
                    <Link
                      href={`/projects/${p.id}/edit`}
                      className="text-xs text-indigo-400 hover:underline font-bold"
                    >
                      Edit Submission
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Verified Certificates */}
      {activeTab === "certificates" && (
        <div className="space-y-4">
          {certificates.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
              <Award className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Certificates Issued Yet</h3>
              <p className="text-xs text-slate-400">
                Certificates of participation and winner awards are issued by hackathon organizers after event conclusion.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert: any) => (
                <div
                  key={cert.id}
                  className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-amber-500/30 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      🏆
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {cert.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{cert.hackathon?.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Issued to {user.name}
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                    <span className="text-amber-400 font-bold">{cert.verificationCode}</span>
                    <Link
                      href={`/certificates/verify/${cert.verificationCode}`}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-sans font-semibold flex items-center gap-1"
                    >
                      Verify <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Team Modal */}
      {isCreateTeamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">Create a New Team</h3>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Hackathon</label>
                <select
                  required
                  value={teamHackathonId}
                  onChange={(e) => setTeamHackathonId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select registered hackathon...</option>
                  {registrations.map((r: any) => (
                    <option key={r.hackathon.id} value={r.hackathon.id}>
                      {r.hackathon.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="Neural Flow"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  placeholder="What is your team building or looking for?"
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateTeamOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={teamActionLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition"
                >
                  {teamActionLoading ? "Creating..." : "Create Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {isJoinTeamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">Join Team via Join Code</h3>
            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Enter Team Join Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TEAM-NFLOW"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-indigo-300 focus:outline-none focus:border-indigo-500 uppercase font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJoinTeamOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={teamActionLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition"
                >
                  {teamActionLoading ? "Joining..." : "Join Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
