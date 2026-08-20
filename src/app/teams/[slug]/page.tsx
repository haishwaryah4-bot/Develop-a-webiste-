"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import {
  Users,
  Copy,
  Check,
  UserPlus,
  Trash2,
  LogOut,
  FolderGit2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function TeamWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  // Invite state
  const [inviteInput, setInviteInput] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteMsg, setInviteMsg] = useState("");
  const [inviteError, setInviteError] = useState("");

  const fetchTeam = async () => {
    try {
      const res = await fetch(`/api/teams/${slug}`);
      const data = await res.json();
      if (data.success) {
        setTeam(data.data);
      }
    } catch (e) {
      console.error("Failed to load team:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [slug]);

  const copyCode = () => {
    if (!team?.joinCode) return;
    navigator.clipboard.writeText(team.joinCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteInput || !team?.id) return;

    setSendingInvite(true);
    setInviteMsg("");
    setInviteError("");

    try {
      const res = await fetch(`/api/teams/${team.id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail: inviteInput }),
      });
      const data = await res.json();
      if (data.success) {
        setInviteMsg(`Invitation sent!`);
        setInviteInput("");
        await fetchTeam();
      } else {
        setInviteError(data.error?.message || "Failed to send invitation");
      }
    } catch {
      setInviteError("Network error occurred");
    } finally {
      setSendingInvite(false);
    }
  };

  const handleRemoveMember = async (memberUserId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const res = await fetch(`/api/teams/${team.id}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberUserId }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchTeam();
      } else {
        alert(data.error?.message || "Failed to remove member");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLeaveTeam = async () => {
    if (!confirm("Are you sure you want to leave this team?")) return;

    try {
      const res = await fetch(`/api/teams/${team.id}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberUserId: user?.id }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard");
      } else {
        alert(data.error?.message || "Failed to leave team");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading team workspace...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="py-24 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Team Not Found</h2>
        <Link href="/dashboard" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isOwner = team.ownerId === user?.id || user?.role === "ADMIN";
  const isMember = team.isMember;
  const project = team.projects && team.projects.length > 0 ? team.projects[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Team Workspace
              </span>
              <Link
                href={`/hackathons/${team.hackathon?.slug}`}
                className="text-xs text-slate-400 hover:text-indigo-400 font-semibold"
              >
                {team.hackathon?.title} &rarr;
              </Link>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {team.name}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              {team.description || "Collaborate with your teammates, manage member invitations, and submit your project."}
            </p>
          </div>

          {/* Join Code Box */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2 min-w-[220px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Shareable Join Code
            </span>
            <div className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-700">
              <span className="font-mono text-sm font-bold text-indigo-300">{team.joinCode}</span>
              <button
                onClick={copyCode}
                className="p-1 text-slate-400 hover:text-white rounded transition"
                title="Copy Join Code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Member Capacity Progress */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Roster: <strong className="text-white">{team.members?.length}</strong> / {team.hackathon?.maxTeamSize || 4} members
          </span>
          {isMember && !isOwner && (
            <button
              onClick={handleLeaveTeam}
              className="text-rose-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" /> Leave Team
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Members & Invitations */}
        <div className="lg:col-span-2 space-y-8">
          {/* Members Roster */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Team Members ({team.members?.length})
            </h3>

            <div className="divide-y divide-slate-800">
              {team.members?.map((m: any) => (
                <div key={m.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.user.username}`}
                      alt={m.user.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/profile/${m.user.username}`}
                          className="text-sm font-bold text-white hover:text-indigo-400 transition"
                        >
                          {m.user.name}
                        </Link>
                        {m.role === "OWNER" && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                            Leader 👑
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">@{m.user.username}</p>
                    </div>
                  </div>

                  {/* Owner remove member button */}
                  {isOwner && m.userId !== team.ownerId && (
                    <button
                      onClick={() => handleRemoveMember(m.userId)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Invite New Teammate */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-400" /> Invite Teammates
            </h3>
            <p className="text-xs text-slate-400">
              Send an invite by entering a participant&apos;s username or email address.
            </p>

            <form onSubmit={handleSendInvite} className="flex gap-3">
              <input
                type="text"
                required
                placeholder="Username or email address..."
                value={inviteInput}
                onChange={(e) => setInviteInput(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={sendingInvite || team.members?.length >= (team.hackathon?.maxTeamSize || 4)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition whitespace-nowrap"
              >
                {sendingInvite ? "Sending..." : "Send Invite"}
              </button>
            </form>

            {inviteMsg && <p className="text-xs font-semibold text-emerald-400">{inviteMsg}</p>}
            {inviteError && <p className="text-xs font-semibold text-rose-400">{inviteError}</p>}

            {/* Pending Invitations list */}
            {team.invitations?.length > 0 && (
              <div className="pt-3 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Pending Invitations ({team.invitations.length})
                </span>
                <div className="space-y-2">
                  {team.invitations.map((inv: any) => (
                    <div
                      key={inv.id}
                      className="p-3 bg-slate-800/60 rounded-xl flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-300 font-medium">{inv.invitee?.name} (@{inv.invitee?.username})</span>
                      <span className="text-amber-400 text-[10px] font-bold">Pending</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Project Workspace Box */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-indigo-400" /> Team Project
            </h3>

            {project ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded ${
                      project.status === "SUBMITTED"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-700/50 text-slate-300"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white">{project.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-3">{project.tagline}</p>

                <div className="pt-3 space-y-2">
                  <Link
                    href={`/projects/${project.id}`}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    View Project Page
                  </Link>
                  <Link
                    href={`/hackathons/${team.hackathon?.slug}/submit`}
                    className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    Edit / Finalize Submission
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-center py-4">
                <p className="text-xs text-slate-400">
                  Your team has not created a project draft yet. Get started before the deadline!
                </p>
                <Link
                  href={`/hackathons/${team.hackathon?.slug}/submit`}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition inline-flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Start Project Submission
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
