"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import {
  FolderGit2,
  Github,
  ExternalLink,
  Video,
  FileText,
  Users,
  Award,
  Trophy,
  Sparkles,
  ArrowLeft,
  Calendar,
  Gavel,
  ShieldAlert,
} from "lucide-react";

export default function ProjectDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const id = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();
        if (data.success) {
          setProject(data.data);
        }
      } catch (err) {
        console.error("Project fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-24 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
        <Link href="/hackathons" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          Back to Hackathons
        </Link>
      </div>
    );
  }

  const isOrganizer = user?.role === "ORGANIZER" || user?.role === "ADMIN";
  const isJudge = user?.role === "JUDGE";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href={`/hackathons/${project.hackathon?.slug}`}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to {project.hackathon?.title}
        </Link>
      </div>

      {/* Hero Card */}
      <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {project.status}
              </span>
              <Link
                href={`/teams/${project.team?.slug}`}
                className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1"
              >
                <Users className="w-3 h-3 text-indigo-400" /> Team {project.team?.name}
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>

            <p className="text-base text-slate-300 leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap gap-2 md:flex-col md:w-52">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Github className="w-4 h-4" /> Repository
              </a>
            )}
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Video className="w-4 h-4 text-rose-400" /> Watch Video
              </a>
            )}
            {project.presentationUrl && (
              <a
                href={project.presentationUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-purple-400" /> Pitch Deck
              </a>
            )}
          </div>
        </div>

        {/* Prizes Won Banner */}
        {project.prizesWon?.length > 0 && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                Prize Winner
              </span>
              <span className="text-xs font-bold text-white">
                {project.prizesWon.map((p: any) => `${p.title} (${p.value})`).join(", ")}
              </span>
            </div>
          </div>
        )}

        {/* Tech Stack Strip */}
        {project.technologies?.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2">
            {project.technologies.map((t: string) => (
              <span
                key={t}
                className="px-2.5 py-1 bg-slate-800 text-slate-200 border border-slate-700/60 rounded-lg text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Description, Problem/Solution, Team Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Problem & Solution */}
          {(project.problem || project.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.problem && (
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <h3 className="text-sm font-bold text-slate-200">The Problem</h3>
                  <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
                    {project.problem}
                  </p>
                </div>
              )}
              {project.solution && (
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <h3 className="text-sm font-bold text-slate-200">The Solution</h3>
                  <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
                    {project.solution}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Full Writeup */}
          <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Project Details & Architecture</h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
              {project.description}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Built by {project.team?.name}
            </h3>
            <div className="space-y-3">
              {project.team?.members?.map((m: any) => (
                <Link
                  key={m.id}
                  href={`/profile/${m.user.username}`}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/60 transition group"
                >
                  <img
                    src={m.user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.user.username}`}
                    alt={m.user.name}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-700 bg-slate-800"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition">
                      {m.user.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">@{m.user.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Judge / Score Breakdown (if accessible) */}
          {(isOrganizer || isJudge) && project.scores?.length > 0 && (
            <div className="p-6 bg-slate-900 border border-indigo-500/30 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <Gavel className="w-4 h-4" /> Judging Evaluations ({project.scores.length})
              </h3>
              <div className="space-y-3 divide-y divide-slate-800">
                {project.scores.map((sc: any) => (
                  <div key={sc.id} className="pt-2 text-xs">
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span>{sc.criteria?.name}</span>
                      <span className="text-indigo-400 font-mono font-bold">{sc.score} / 10</span>
                    </div>
                    {sc.feedback && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">&ldquo;{sc.feedback}&rdquo;</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
