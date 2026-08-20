"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import {
  ShieldAlert,
  Users,
  Trophy,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  XCircle,
  Search,
  Lock,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { formatDateTime } from "@/lib/dates";

export default function AdminModerationPage() {
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "reports" | "audit">("overview");

  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, reportsRes] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch(`/api/admin/users?search=${encodeURIComponent(userSearch)}&role=${selectedRole}`).then((r) => r.json()),
        fetch("/api/reports").then((r) => r.json()),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsersList(usersRes.data);
      if (reportsRes.success) setReportsList(reportsRes.data);
    } catch (e) {
      console.error("Admin data fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user, userSearch, selectedRole]);

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto py-32 px-4 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Restricted Access</h2>
        <p className="text-xs text-slate-400 mb-6">
          This panel is restricted to platform administrators. Please use the Quick Role Switcher to switch to the Admin demo account.
        </p>
        <button
          onClick={() => openAuthModal("login")}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
          <ShieldAlert className="w-3.5 h-3.5" /> Platform Governance
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Admin Moderation Panel
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage system-wide permissions, review user reports, audit administrative actions, and maintain integrity.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 transition border-b-2 ${
            activeTab === "overview"
              ? "border-indigo-500 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Platform Overview
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-4 transition border-b-2 ${
            activeTab === "users"
              ? "border-indigo-500 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          User Moderation ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`pb-3 px-4 transition border-b-2 ${
            activeTab === "reports"
              ? "border-indigo-500 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Reports Inbox ({reportsList.length})
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-3 px-4 transition border-b-2 ${
            activeTab === "audit"
              ? "border-indigo-500 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Audit Logs
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Total Users</span>
              <div className="text-2xl font-extrabold text-white">{stats.counts?.users}</div>
            </div>
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Hackathons</span>
              <div className="text-2xl font-extrabold text-indigo-400">{stats.counts?.hackathons}</div>
            </div>
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Teams</span>
              <div className="text-2xl font-extrabold text-purple-400">{stats.counts?.teams}</div>
            </div>
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Submissions</span>
              <div className="text-2xl font-extrabold text-emerald-400">{stats.counts?.submissions}</div>
            </div>
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Pending Reports</span>
              <div className="text-2xl font-extrabold text-rose-400">{stats.counts?.pendingReports}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Moderation */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name, username, or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="ORGANIZER">ORGANIZER</option>
              <option value="JUDGE">JUDGE</option>
              <option value="MENTOR">MENTOR</option>
              <option value="PARTICIPANT">PARTICIPANT</option>
            </select>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-6 flex items-center gap-3">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`}
                        alt={u.name}
                        className="w-8 h-8 rounded-lg object-cover bg-slate-800"
                      />
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[11px] text-slate-400">@{u.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 font-mono text-slate-300">{u.email}</td>
                    <td className="py-3 px-6">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-bold text-indigo-300"
                      >
                        <option value="PARTICIPANT">PARTICIPANT</option>
                        <option value="ORGANIZER">ORGANIZER</option>
                        <option value="JUDGE">JUDGE</option>
                        <option value="MENTOR">MENTOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <Link
                        href={`/profile/${u.username}`}
                        className="text-indigo-400 hover:underline font-semibold"
                      >
                        View Profile &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Reports Inbox */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          {reportsList.length === 0 ? (
            <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-2xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-white">Inbox Clean</h3>
              <p className="text-xs text-slate-400">No content or user reports currently pending triage.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reportsList.map((r) => (
                <div key={r.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {r.category}
                      </span>
                      <span className="text-xs text-slate-400">Target: {r.targetType} ({r.targetId})</span>
                    </div>
                    <select
                      value={r.status}
                      onChange={(e) => handleUpdateReportStatus(r.id, e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-bold"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REVIEWING">REVIEWING</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    {r.description}
                  </p>
                  <div className="text-[11px] text-slate-500">
                    Reported by {r.reporter?.name} (@{r.reporter?.username}) on {formatDateTime(r.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === "audit" && stats?.auditLogs && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 text-xs font-bold text-white uppercase tracking-wider">
            Platform Audit Stream
          </div>
          <div className="divide-y divide-slate-800">
            {stats.auditLogs.map((log: any) => (
              <div key={log.id} className="p-4 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-mono font-bold text-indigo-400">{log.action}</span>
                  <p className="text-slate-400">
                    Entity: <strong>{log.entity}</strong> {log.entityId ? `(${log.entityId})` : ""} &bull; Executed by{" "}
                    <strong>{log.user?.name || "System"}</strong>
                  </p>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {formatDateTime(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
