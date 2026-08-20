"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import HackathonCard from "@/components/HackathonCard";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Trophy,
  Globe2,
  Calendar,
  Sparkles,
  LayoutGrid,
  List,
  RotateCcw,
} from "lucide-react";

function HackathonsDiscoveryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [theme, setTheme] = useState(searchParams.get("theme") || "ALL");
  const [mode, setMode] = useState(searchParams.get("mode") || "ALL");
  const [status, setStatus] = useState(searchParams.get("status") || "ALL");
  const [sort, setSort] = useState(searchParams.get("sort") || "featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (theme !== "ALL") params.set("theme", theme);
      if (mode !== "ALL") params.set("mode", mode);
      if (status !== "ALL") params.set("status", status);
      if (sort) params.set("sort", sort);

      const res = await fetch(`/api/hackathons?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setHackathons(data.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch hackathons:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, [theme, mode, status, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHackathons();
  };

  const handleResetFilters = () => {
    setSearch("");
    setTheme("ALL");
    setMode("ALL");
    setStatus("ALL");
    setSort("featured");
  };

  const themesList = [
    "ALL",
    "Artificial Intelligence",
    "Web3 & Blockchain",
    "Climate & Sustainability",
    "Healthcare & Biotech",
    "FinTech",
    "Robotics & Hardware",
    "Cybersecurity",
    "Quantum",
    "AR / VR & Gaming",
    "Developer Tools",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
      {/* Page Title & Search Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5" /> Discovery Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Hackathons
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Browse verified competitions worldwide, filter by theme and format, and start building with your team.
        </p>

        {/* Omnibox Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, hackathon title, or topic..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl mb-8 flex flex-wrap items-center justify-between gap-4">
        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Theme */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Theme:</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
            >
              {themesList.map((t) => (
                <option key={t} value={t}>{t === "ALL" ? "All Themes" : t}</option>
              ))}
            </select>
          </div>

          {/* Mode */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Mode:</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Formats</option>
              <option value="ONLINE">Virtual / Online</option>
              <option value="OFFLINE">In-Person</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="REGISTRATION_OPEN">Registration Open</option>
              <option value="ACTIVE">Hacking Active</option>
              <option value="JUDGING">Under Review / Judging</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="featured">Featured & Newest</option>
              <option value="deadline_asc">Nearest Deadline</option>
              <option value="start_asc">Starting Soon</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(theme !== "ALL" || mode !== "ALL" || status !== "ALL" || search) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition px-2 py-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {/* View Mode & Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold">
            {hackathons.length} {hackathons.length === 1 ? "hackathon" : "hackathons"} found
          </span>
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading hackathons...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && hackathons.length === 0 && (
        <div className="py-20 text-center bg-slate-900/50 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Hackathons Found</h3>
          <p className="text-xs text-slate-400 mb-6">
            We couldn&apos;t find any hackathons matching your current filters. Try loosening your criteria or resetting filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Results Grid / List */}
      {!loading && hackathons.length > 0 && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {hackathons.map((h) => (
            <HackathonCard key={h.id} hackathon={h} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HackathonsDiscoveryPage() {
  return (
    <Suspense
      fallback={
        <div className="py-32 text-center">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading hackathons...</p>
        </div>
      }
    >
      <HackathonsDiscoveryContent />
    </Suspense>
  );
}
