"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import {
  Trophy,
  PlusCircle,
  Users,
  FolderGit2,
  Calendar,
  Sparkles,
  ArrowRight,
  BarChart3,
  Settings,
  Flame,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function OrganizerDashboard() {
  const { user, openAuthModal } = useAuth();
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizerData = async () => {
    try {
      const res = await fetch("/api/hackathons");
      const data = await res.json();
      if (data.success) {
        setHackathons(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerData();
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-32 px-4 text-center">
        <Trophy className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Organizer Console</h2>
        <p className="text-xs text-slate-400 mb-6">
          Sign in to create, configure, and manage world-class hackathons and competitions.
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

  // Aggregate stats across hackathons
  const totalRegistrations = hackathons.reduce((sum, h) => sum + (h.registrationCount || 0), 0);
  const totalTeams = hackathons.reduce((sum, h) => sum + (h.teamCount || 0), 0);
  const totalProjects = hackathons.reduce((sum, h) => sum + (h.projectCount || 0), 0);

  // Sample analytics data for Recharts
  const chartData = hackathons.slice(0, 5).map((h) => ({
    name: h.title.length > 15 ? `${h.title.substring(0, 14)}...` : h.title,
    registrations: h.registrationCount || 0,
    submissions: h.projectCount || 0,
  }));

  const pieData = [
    { name: "Online", value: 65, color: "#6366f1" },
    { name: "Hybrid", value: 25, color: "#a855f7" },
    { name: "In-Person", value: 10, color: "#ec4899" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Host Command Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Organizer Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your hackathons, review registrations, track submissions, and oversee live judging.
          </p>
        </div>

        <Link
          href="/organizer/new"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Create New Hackathon
        </Link>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Hackathons
          </span>
          <div className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-400" />
            {hackathons.length}
          </div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Participants
          </span>
          <div className="text-2xl font-extrabold text-emerald-400 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            {totalRegistrations}
          </div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Teams Formed
          </span>
          <div className="text-2xl font-extrabold text-purple-400 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            {totalTeams}
          </div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Projects Submitted
          </span>
          <div className="text-2xl font-extrabold text-blue-400 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-blue-400" />
            {totalProjects}
          </div>
        </div>
      </div>

      {/* Analytics Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart: Registrations vs Submissions */}
        <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" /> Participation & Submission Velocity
            </h3>
            <span className="text-xs text-slate-400">Top Events</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                />
                <Bar dataKey="registrations" name="Registrations" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="submissions" name="Submissions" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Format breakdown pie */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white">Event Formats</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs">
            {pieData.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name} ({d.value}%)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Managed Hackathons List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Managed Hackathons</h2>
          <Link
            href="/organizer/new"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            + Create Another Hackathon
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((h) => (
            <div key={h.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {h.computedStatus || h.status}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{h.theme}</span>
                </div>

                <Link href={`/hackathons/${h.slug}`} className="hover:text-indigo-400 transition">
                  <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{h.title}</h3>
                </Link>
                <p className="text-xs text-slate-400 line-clamp-2">{h.shortDescription}</p>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Signups</span>
                  <span className="font-bold text-white">{h.registrationCount || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Teams</span>
                  <span className="font-bold text-purple-400">{h.teamCount || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Projects</span>
                  <span className="font-bold text-emerald-400">{h.projectCount || 0}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <Link
                  href={`/hackathons/${h.slug}/leaderboard`}
                  className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> Leaderboard
                </Link>
                <Link
                  href={`/hackathons/${h.slug}`}
                  className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
                >
                  Manage Hub &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
