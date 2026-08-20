"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import CountdownTimer from "@/components/CountdownTimer";
import confetti from "canvas-confetti";
import {
  FolderGit2,
  Sparkles,
  Link2,
  Github,
  Video,
  FileText,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  X,
  Plus,
} from "lucide-react";

export default function ProjectSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const slug = params.slug as string;

  const [hackathon, setHackathon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingProjectId, setExistingProjectId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [description, setDescription] = useState("");
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [presentationUrl, setPresentationUrl] = useState("");
  const [screenshotInput, setScreenshotInput] = useState("");
  const [screenshots, setScreenshots] = useState<string[]>([]);

  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const res = await fetch(`/api/hackathons/${slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          const h = data.data;
          setHackathon(h);

          // Check if team has an existing project
          if (h.userTeam?.projects?.length > 0) {
            const p = h.userTeam.projects[0];
            setExistingProjectId(p.id);
            setTitle(p.title || "");
            setTagline(p.tagline || "");
            setProblem(p.problem || "");
            setSolution(p.solution || "");
            setDescription(p.description || "");
            setRepositoryUrl(p.repositoryUrl || "");
            setDemoUrl(p.demoUrl || "");
            setVideoUrl(p.videoUrl || "");
            setPresentationUrl(p.presentationUrl || "");
            if (p.technologies) {
              setTechnologies(typeof p.technologies === "string" ? JSON.parse(p.technologies) : p.technologies);
            }
            if (p.screenshots) {
              setScreenshots(typeof p.screenshots === "string" ? JSON.parse(p.screenshots) : p.screenshots);
            }
          }
        }
      } catch (err) {
        console.error("Submission page fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContext();
  }, [slug]);

  const addTechTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput("");
    }
  };

  const removeTechTag = (tag: string) => {
    setTechnologies(technologies.filter((t) => t !== tag));
  };

  const addScreenshot = () => {
    if (screenshotInput.trim()) {
      setScreenshots([...screenshots, screenshotInput.trim()]);
      setScreenshotInput("");
    }
  };

  const handleSave = async (submitStatus: "DRAFT" | "SUBMITTED") => {
    if (!user) {
      openAuthModal("login");
      return;
    }

    if (!hackathon?.userTeam) {
      alert("You must create or join a team for this hackathon before submitting a project.");
      return;
    }

    setSaving(true);
    setStatusMessage("");

    try {
      const payload = {
        teamId: hackathon.userTeam.id,
        hackathonId: hackathon.id,
        title,
        tagline,
        problem,
        solution,
        description: description || tagline,
        technologies,
        repositoryUrl,
        demoUrl,
        videoUrl,
        presentationUrl,
        screenshots,
        status: submitStatus,
      };

      let res;
      if (existingProjectId) {
        res = await fetch(`/api/projects/${existingProjectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!data.success) {
        alert(data.error?.message || "Failed to save project");
      } else {
        if (!existingProjectId) setExistingProjectId(data.data.id);
        setStatusMessage(submitStatus === "SUBMITTED" ? "Project submitted successfully! 🚀" : "Draft saved!");
        if (submitStatus === "SUBMITTED") {
          setIsSubmittedSuccess(true);
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
      }
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading submission portal...</p>
      </div>
    );
  }

  if (isSubmittedSuccess) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl">
          🚀
        </div>
        <h1 className="text-3xl font-extrabold text-white">Project Submitted!</h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Your project <strong>&ldquo;{title}&rdquo;</strong> has been successfully submitted for{" "}
          <strong>{hackathon.title}</strong>. Our panel of judges will review it once the submission window closes.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href={`/projects/${existingProjectId}`}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
          >
            View Project Page
          </Link>
          <Link
            href={`/hackathons/${hackathon.slug}`}
            className="px-6 py-3 bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition"
          >
            Back to Hackathon
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link
            href={`/hackathons/${slug}`}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Hackathon
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-7 h-7 text-indigo-400" />
            <span>Project Submission</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Submitting for: <strong className="text-slate-200">{hackathon?.title}</strong> &bull; Team:{" "}
            <strong className="text-slate-200">{hackathon?.userTeam?.name || "No Team Assigned"}</strong>
          </p>
        </div>

        {/* Deadline countdown */}
        {hackathon?.submissionDeadline && (
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Submission Cutoff
            </span>
            <CountdownTimer targetDate={hackathon.submissionDeadline} />
          </div>
        )}
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {statusMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSave("SUBMITTED"); }} className="space-y-8">
        {/* Section 1: Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Project Overview
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. AutoRefactor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline (One-line summary) *</label>
            <input
              type="text"
              required
              placeholder="e.g. Autonomous multi-agent code migration engine"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">The Problem It Solves</label>
              <textarea
                placeholder="What challenge does your solution address?"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">The Solution & Impact</label>
              <textarea
                placeholder="How does your architecture solve this problem?"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Writeup / Technical Architecture</label>
            <textarea
              placeholder="Provide a comprehensive breakdown of your codebase, architecture decisions, and workflow..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Section 2: Tech Stack & Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Link2 className="w-4 h-4 text-purple-400" /> Technologies & Links
          </h3>

          {/* Tech Stack Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Technologies Used</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Next.js, Python, Anthropic API (Press Enter)"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={addTechTag}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={addTechTag}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  {t}
                  <button type="button" onClick={() => removeTechTag(t)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-400" /> GitHub / Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-slate-400" /> Live Hosted Demo URL
              </label>
              <input
                type="url"
                placeholder="https://my-demo-app.vercel.app"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-slate-400" /> Video Demo URL (YouTube / Loom)
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Presentation / Slide Deck URL
              </label>
              <input
                type="url"
                placeholder="https://pitch.com/deck/..."
                value={presentationUrl}
                onChange={(e) => setPresentationUrl(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("DRAFT")}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save as Draft
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow-xl shadow-indigo-600/30 transition flex items-center gap-2"
          >
            {saving ? "Processing..." : "Submit Project 🚀"}
          </button>
        </div>
      </form>
    </div>
  );
}
