"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Trophy, Users, FolderGit2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    hackathons: any[];
    projects: any[];
  }>({
    hackathons: [],
    projects: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ hackathons: [], projects: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [hackathonsRes, projectsRes] = await Promise.all([
          fetch(`/api/hackathons?search=${encodeURIComponent(query)}`).then((r) => r.json()),
          fetch(`/api/projects?search=${encodeURIComponent(query)}`).then((r) => r.json()),
        ]);

        setResults({
          hackathons: hackathonsRes.data?.slice(0, 4) || [],
          projects: projectsRes.data?.slice(0, 4) || [],
        });
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hackathons, themes, projects, tech stacks..."
            className="w-full bg-transparent py-4 text-white text-base focus:outline-none placeholder:text-slate-500 font-medium"
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1 text-slate-400 hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg hover:text-white">
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {loading && (
            <div className="py-8 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              Searching platform...
            </div>
          )}

          {!loading && !query && (
            <div className="py-8 text-center text-slate-500 text-sm">
              Type keywords to search hackathons, projects, and technologies.
            </div>
          )}

          {!loading && query && results.hackathons.length === 0 && results.projects.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {/* Hackathons results */}
          {results.hackathons.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-2 px-2">
                Hackathons
              </span>
              <div className="space-y-1">
                {results.hackathons.map((h) => (
                  <Link
                    key={h.id}
                    href={`/hackathons/${h.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition">
                          {h.title}
                        </h4>
                        <p className="text-xs text-slate-400">{h.theme} • {h.mode}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects results */}
          {results.projects.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-2 px-2">
                Submitted Projects
              </span>
              <div className="space-y-1">
                {results.projects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <FolderGit2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition">
                          {p.title}
                        </h4>
                        <p className="text-xs text-slate-400">Team {p.team?.name}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
