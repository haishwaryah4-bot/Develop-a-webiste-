"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import CountdownTimer from "@/components/CountdownTimer";
import { getStatusBadgeStyle, formatDateTime, formatDateShort } from "@/lib/dates";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
  PlusCircle,
  FileCheck,
  Megaphone,
  CheckCircle2,
  HelpCircle,
  FolderGit2,
  Gavel,
  ChevronRight,
  Flame,
  ArrowRight,
} from "lucide-react";

export default function HackathonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const slug = params.slug as string;

  const [hackathon, setHackathon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "schedule" | "rules" | "prizes" | "sponsors" | "judges" | "announcements" | "faq"
  >("overview");
  const [registering, setRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchHackathon = async () => {
    try {
      const res = await fetch(`/api/hackathons/${slug}`);
      const data = await res.json();
      if (data.success) {
        setHackathon(data.data);
      } else {
        setErrorMessage(data.error?.message || "Hackathon not found");
      }
    } catch {
      setErrorMessage("Failed to load hackathon");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathon();
  }, [slug]);

  const handleRegister = async () => {
    if (!user) {
      openAuthModal("register");
      return;
    }

    setRegistering(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/hackathons/${hackathon.id}/register`, {
        method: "POST",
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMessage(data.error?.message || "Registration failed");
      } else {
        setSuccessMessage("You are successfully registered! 🎉");
        await fetchHackathon();
      }
    } catch {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading hackathon details...</p>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="py-24 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Hackathon Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">{errorMessage}</p>
        <Link href="/hackathons" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          Back to Hackathons
        </Link>
      </div>
    );
  }

  const currentStatus = hackathon.computedStatus || hackathon.status;
  const badgeStyle = getStatusBadgeStyle(currentStatus);
  const isRegistered = !!hackathon.userRegistration;
  const userTeam = hackathon.userTeam;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "schedule", label: `Schedule (${hackathon.scheduleEvents?.length || 0})` },
    { key: "prizes", label: `Prizes (${hackathon.prizes?.length || 0})` },
    { key: "rules", label: "Rules & Criteria" },
    { key: "sponsors", label: `Sponsors (${hackathon.sponsors?.length || 0})` },
    { key: "judges", label: `Judges & Mentors (${(hackathon.judges?.length || 0) + (hackathon.mentors?.length || 0)})` },
    { key: "announcements", label: `Announcements (${hackathon.announcements?.length || 0})` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 w-full space-y-8">
      {/* Banner & Hero Header */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Banner image */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-800 overflow-hidden">
          {hackathon.banner && (
            <img
              src={hackathon.banner}
              alt={hackathon.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        {/* Hero Details overlay */}
        <div className="relative p-6 sm:p-8 -mt-24 sm:-mt-28 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-lg border backdrop-blur-md ${badgeStyle.bg}`}>
                  {badgeStyle.label}
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700">
                  {hackathon.theme}
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-950/90 text-indigo-300 border border-indigo-700">
                  {hackathon.mode}
                </span>
                {hackathon.isFeatured && (
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {hackathon.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {hackathon.shortDescription}
              </p>

              {/* Meta stats strip */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>{formatDateShort(hackathon.startDate)} - {formatDateShort(hackathon.endDate)}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>{hackathon.location || "Online"}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>{hackathon.registrationCount} Registered</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Team Size: {hackathon.minTeamSize} - {hackathon.maxTeamSize}</span>
                </div>
              </div>
            </div>

            {/* Registration Card / CTA Box */}
            <div className="lg:w-80 p-5 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-xl flex flex-col gap-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Submission Cutoff
                </span>
                <CountdownTimer targetDate={hackathon.submissionDeadline} />
              </div>

              {successMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {successMessage}
                </div>
              )}

              {/* Action Button */}
              {!isRegistered ? (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
                >
                  {registering ? "Registering..." : "Register for Hackathon"}
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="py-2 px-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Registered
                  </div>

                  {userTeam ? (
                    <Link
                      href={`/teams/${userTeam.slug}`}
                      className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
                    >
                      <Users className="w-4 h-4 text-indigo-400" /> Manage Team ({userTeam.name})
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard?createTeam=${hackathon.id}`}
                      className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" /> Create or Join Team
                    </Link>
                  )}

                  <Link
                    href={`/hackathons/${hackathon.slug}/submit`}
                    className="w-full py-2.5 px-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <FolderGit2 className="w-4 h-4" /> Submit / Edit Project
                  </Link>
                </div>
              )}

              {/* Leaderboard Shortcut */}
              <Link
                href={`/hackathons/${hackathon.slug}/leaderboard`}
                className="text-center text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1 transition"
              >
                <Trophy className="w-3.5 h-3.5" /> View Live Leaderboard & Scores
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex border-b border-slate-800 overflow-x-auto gap-2 text-xs font-semibold no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 px-4 transition border-b-2 whitespace-nowrap ${
              activeTab === tab.key
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[400px]">
        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">About the Hackathon</h3>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
                  {hackathon.description}
                </div>
              </div>

              {/* Requirements block */}
              {hackathon.requirements && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-indigo-400" /> Submission Requirements
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {hackathon.requirements}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar Facts */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Important Dates
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Registration Deadline</span>
                    <span className="font-semibold text-white">{formatDateTime(hackathon.registrationEnd)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Hacking Starts</span>
                    <span className="font-semibold text-white">{formatDateTime(hackathon.startDate)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Project Submission Deadline</span>
                    <span className="font-bold text-indigo-400">{formatDateTime(hackathon.submissionDeadline)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Winners Announced</span>
                    <span className="font-semibold text-emerald-400">{formatDateTime(hackathon.judgingEnd)}</span>
                  </div>
                </div>
              </div>

              {/* Organizer card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Organized By
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400">
                    {hackathon.organization?.name?.charAt(0) || "O"}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{hackathon.organization?.name}</h5>
                    {hackathon.organization?.website && (
                      <a
                        href={hackathon.organization.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        Visit website <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Schedule */}
        {activeTab === "schedule" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Event Schedule & Milestones</h3>
                <p className="text-xs text-slate-400">All times shown in your local timezone.</p>
              </div>
            </div>

            {hackathon.scheduleEvents?.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No schedule events posted yet.</p>
            ) : (
              <div className="space-y-4">
                {hackathon.scheduleEvents.map((evt: any) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-xl bg-slate-800/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 uppercase">
                          {evt.type}
                        </span>
                        <h4 className="text-sm font-bold text-white">{evt.title}</h4>
                      </div>
                      {evt.description && <p className="text-xs text-slate-400">{evt.description}</p>}
                      {evt.location && (
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {evt.location}
                        </p>
                      )}
                    </div>
                    <div className="text-right whitespace-nowrap text-xs text-indigo-300 font-mono font-medium">
                      {formatDateTime(evt.startTime)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Prizes */}
        {activeTab === "prizes" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Prizes & Awards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathon.prizes?.map((p: any) => (
                <div key={p.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">{p.title}</h4>
                  <div className="text-xl font-extrabold text-emerald-400">{p.value}</div>
                  {p.description && <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>}
                  {p.winnerProject && (
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Awarded To</span>
                      <span className="text-xs font-bold text-amber-300">{p.winnerProject.title} ({p.winnerProject.team.name})</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Rules & Judging Criteria */}
        {activeTab === "rules" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" /> Rules & Eligibility
              </h3>
              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
                {hackathon.rules || "Standard hackathon rules apply. All code must be written during the event."}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Gavel className="w-5 h-5 text-purple-400" /> Judging Criteria
              </h3>
              <div className="space-y-3">
                {hackathon.criteria?.map((c: any) => (
                  <div key={c.id} className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      <span className="text-[11px] font-mono text-indigo-400">Weight: {c.weight}x</span>
                    </div>
                    {c.description && <p className="text-xs text-slate-400">{c.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Sponsors */}
        {activeTab === "sponsors" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Sponsors & Partners</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hackathon.sponsors?.map((s: any) => (
                <div key={s.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-center">
                  <div className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300">
                    {s.tier} Sponsor
                  </div>
                  <h4 className="text-base font-bold text-white">{s.name}</h4>
                  {s.description && <p className="text-xs text-slate-400">{s.description}</p>}
                  {s.website && (
                    <a
                      href={s.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-400 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      Visit Sponsor <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Judges & Mentors */}
        {activeTab === "judges" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Judges Panel</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hackathon.judges?.map((j: any) => (
                  <div key={j.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
                    <img
                      src={j.user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${j.user.username}`}
                      alt={j.user.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-800"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{j.user.name}</h4>
                      <p className="text-xs text-slate-400">{j.user.bio || "Industry Expert Judge"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {hackathon.mentors?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Mentors</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hackathon.mentors?.map((m: any) => (
                    <div key={m.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.user.username}`}
                          alt={m.user.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">{m.user.name}</h4>
                          <span className="text-[11px] text-indigo-400 font-semibold">{m.expertise}</span>
                        </div>
                      </div>
                      {m.availability && <p className="text-xs text-slate-400">{m.availability}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Announcements */}
        {activeTab === "announcements" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Organizer Announcements</h3>
            {hackathon.announcements?.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                No announcements broadcasted yet.
              </p>
            ) : (
              hackathon.announcements.map((a: any) => (
                <div key={a.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-indigo-400" /> {a.title}
                    </h4>
                    <span className="text-xs text-slate-500 font-mono">{formatDateTime(a.publishedAt)}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{a.content}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
