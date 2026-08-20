"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { addDays, format } from "date-fns";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Trophy,
  Gavel,
  Users,
  Plus,
  Trash2,
  HelpCircle,
  Eye,
  Rocket,
} from "lucide-react";

export default function CreateHackathonWizard() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const defaultStartDate = format(addDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm");
  const defaultEndDate = format(addDays(new Date(), 14), "yyyy-MM-dd'T'HH:mm");
  const defaultRegStart = format(new Date(), "yyyy-MM-dd'T'HH:mm");
  const defaultRegEnd = format(addDays(new Date(), 6), "yyyy-MM-dd'T'HH:mm");
  const defaultSubDeadline = format(addDays(new Date(), 12), "yyyy-MM-dd'T'HH:mm");
  const defaultJudgeEnd = format(addDays(new Date(), 14), "yyyy-MM-dd'T'HH:mm");

  // Step 1: Basic Info
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [theme, setTheme] = useState("Artificial Intelligence");
  const [mode, setMode] = useState("ONLINE");
  const [location, setLocation] = useState("Global Virtual");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: Dates
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [registrationStart, setRegistrationStart] = useState(defaultRegStart);
  const [registrationEnd, setRegistrationEnd] = useState(defaultRegEnd);
  const [submissionDeadline, setSubmissionDeadline] = useState(defaultSubDeadline);
  const [judgingStart, setJudgingStart] = useState(defaultSubDeadline);
  const [judgingEnd, setJudgingEnd] = useState(defaultJudgeEnd);

  // Step 3: Rules & Eligibility
  const [eligibility, setEligibility] = useState("Open to all builders, developers, and designers worldwide.");
  const [rules, setRules] = useState("1. All code must be authored during the hackathon period.\n2. Open source libraries are allowed.\n3. Strictly no plagiarism.");
  const [requirements, setRequirements] = useState("Public GitHub repository, live demo link, and a 2-minute video pitch.");

  // Step 4: Team Settings
  const [minTeamSize, setMinTeamSize] = useState(1);
  const [maxTeamSize, setMaxTeamSize] = useState(4);

  // Step 5: Prizes
  const [prizes, setPrizes] = useState([
    { title: "Grand Champion", value: "$15,000 Cash + Cloud Credits", rank: 1, description: "Top overall innovative solution." },
    { title: "Runner Up", value: "$7,500 Cash", rank: 2, description: "Second place overall excellence." },
    { title: "Best Technical Architecture", value: "$5,000 Cash", rank: 3, description: "Most robust and scalable implementation." },
  ]);

  // Step 6: Judging Criteria
  const [criteria, setCriteria] = useState([
    { name: "Technical Complexity", description: "Architecture, scalability, and code quality.", maxScore: 10, weight: 1.2 },
    { name: "Innovation & Originality", description: "Uniqueness of solution.", maxScore: 10, weight: 1.2 },
    { name: "Impact & Feasibility", description: "Real-world utility and adoption.", maxScore: 10, weight: 1.0 },
    { name: "UI/UX & Design Polish", description: "Aesthetics and user experience.", maxScore: 10, weight: 0.8 },
  ]);

  // Step 7: Sponsors
  const [sponsors, setSponsors] = useState([
    { name: "Global Cloud Labs", tier: "TITLE", website: "https://cloudlabs.dev" },
  ]);

  // Step 8: Schedule Events
  const [schedule, setSchedule] = useState([
    { title: "Opening Ceremony", startTime: defaultStartDate, endTime: defaultStartDate, type: "CEREMONY", location: "Main Stage Zoom" },
    { title: "Project Submission Cutoff", startTime: defaultSubDeadline, endTime: defaultSubDeadline, type: "DEADLINE", location: "Submission Portal" },
    { title: "Winner Announcement", startTime: defaultEndDate, endTime: defaultEndDate, type: "WINNER_ANNOUNCEMENT", location: "Live Stream" },
  ]);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generated = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated);
  };

  const addPrize = () => {
    setPrizes([...prizes, { title: "Category Award", value: "$2,500", rank: prizes.length + 1, description: "" }]);
  };

  const removePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  const addCriterion = () => {
    setCriteria([...criteria, { name: "Custom Criterion", description: "", maxScore: 10, weight: 1.0 }]);
  };

  const removeCriterion = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
    if (!user) {
      openAuthModal("login");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        title,
        slug,
        shortDescription,
        description,
        theme,
        mode,
        location,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        registrationStart: new Date(registrationStart).toISOString(),
        registrationEnd: new Date(registrationEnd).toISOString(),
        submissionDeadline: new Date(submissionDeadline).toISOString(),
        judgingStart: new Date(judgingStart).toISOString(),
        judgingEnd: new Date(judgingEnd).toISOString(),
        minTeamSize: Number(minTeamSize),
        maxTeamSize: Number(maxTeamSize),
        eligibility,
        rules,
        requirements,
        status,
        prizes,
        criteria,
        sponsors,
        schedule,
      };

      const res = await fetch("/api/hackathons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error?.message || "Failed to create hackathon");
      } else {
        router.push(`/hackathons/${data.data.slug}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const totalSteps = 10;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Top Header */}
      <div>
        <Link
          href="/organizer"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Organizer Console
        </Link>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-indigo-400" />
          <span>Hackathon Creation Wizard</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure rules, tracks, prize allocations, judging criteria, and schedule in a guided flow.
        </p>
      </div>

      {/* Progress Bar Checklist */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-indigo-400">Step {currentStep} of {totalSteps}</span>
          <span className="text-slate-400">{progressPercent}% Completed</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      {/* Wizard Step Forms */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl min-h-[420px]">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Step 1: Basic Information</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hackathon Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Global Agentic AI Hackathon 2026"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">URL Slug *</label>
              <input
                type="text"
                required
                placeholder="global-agentic-ai-2026"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Innovation Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Web3 & Blockchain">Web3 & Blockchain</option>
                  <option value="Climate & Sustainability">Climate & Sustainability</option>
                  <option value="Healthcare & Biotech">Healthcare & Biotech</option>
                  <option value="FinTech">FinTech</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Developer Tools">Developer Tools</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Format</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="ONLINE">Virtual / Online</option>
                  <option value="OFFLINE">In-Person</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA or Online"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description (1-2 sentences) *</label>
              <input
                type="text"
                required
                placeholder="Build next-generation autonomous AI agents and cognitive workflows."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Detailed Description</label>
              <textarea
                rows={4}
                placeholder="Provide complete background, mission, and overview..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Dates & Deadlines */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Step 2: Dates & Deadlines</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Opens</label>
                <input
                  type="datetime-local"
                  value={registrationStart}
                  onChange={(e) => setRegistrationStart(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Closes</label>
                <input
                  type="datetime-local"
                  value={registrationEnd}
                  onChange={(e) => setRegistrationEnd(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hacking Starts</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Submission Deadline</label>
                <input
                  type="datetime-local"
                  value={submissionDeadline}
                  onChange={(e) => setSubmissionDeadline(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold text-indigo-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Judging Concludes & Winners Announced</label>
                <input
                  type="datetime-local"
                  value={judgingEnd}
                  onChange={(e) => setJudgingEnd(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold text-emerald-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Rules & Eligibility */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Step 3: Rules & Submission Requirements</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Eligibility Criteria</label>
              <textarea
                rows={2}
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hackathon Rules</label>
              <textarea
                rows={3}
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Submission Deliverables</label>
              <textarea
                rows={2}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Step 4: Team Settings */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Step 4: Team Size Configuration</h3>
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Min Team Size</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={minTeamSize}
                  onChange={(e) => setMinTeamSize(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Max Team Size</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={maxTeamSize}
                  onChange={(e) => setMaxTeamSize(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Prizes */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Step 5: Prizes & Awards</h3>
              <button
                type="button"
                onClick={addPrize}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-bold rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Prize
              </button>
            </div>

            <div className="space-y-3">
              {prizes.map((p, idx) => (
                <div key={idx} className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Prize Title (e.g. 1st Place)"
                      value={p.title}
                      onChange={(e) => {
                        const updated = [...prizes];
                        updated[idx].title = e.target.value;
                        setPrizes(updated);
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. $10,000 Cash)"
                      value={p.value}
                      onChange={(e) => {
                        const updated = [...prizes];
                        updated[idx].value = e.target.value;
                        setPrizes(updated);
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-bold"
                    />
                  </div>
                  {prizes.length > 1 && (
                    <button type="button" onClick={() => removePrize(idx)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Judging Criteria */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Step 6: Judging Criteria & Weights</h3>
              <button
                type="button"
                onClick={addCriterion}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-bold rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Criterion
              </button>
            </div>

            <div className="space-y-3">
              {criteria.map((c, idx) => (
                <div key={idx} className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Criterion Name"
                      value={c.name}
                      onChange={(e) => {
                        const updated = [...criteria];
                        updated[idx].name = e.target.value;
                        setCriteria(updated);
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white sm:col-span-2"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Weight:</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="3.0"
                        value={c.weight}
                        onChange={(e) => {
                          const updated = [...criteria];
                          updated[idx].weight = Number(e.target.value);
                          setCriteria(updated);
                        }}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-indigo-300 font-bold w-16"
                      />
                    </div>
                  </div>
                  {criteria.length > 1 && (
                    <button type="button" onClick={() => removeCriterion(idx)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Sponsors */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Step 7: Sponsors & Partners</h3>
            <p className="text-xs text-slate-400">Add event sponsors to showcase on your hackathon hub.</p>
            {sponsors.map((s, idx) => (
              <div key={idx} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Sponsor Name"
                  value={s.name}
                  onChange={(e) => {
                    const u = [...sponsors];
                    u[idx].name = e.target.value;
                    setSponsors(u);
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Website URL"
                  value={s.website}
                  onChange={(e) => {
                    const u = [...sponsors];
                    u[idx].website = e.target.value;
                    setSponsors(u);
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <select
                  value={s.tier}
                  onChange={(e) => {
                    const u = [...sponsors];
                    u[idx].tier = e.target.value;
                    setSponsors(u);
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                >
                  <option value="TITLE">Title Tier</option>
                  <option value="PLATINUM">Platinum Tier</option>
                  <option value="GOLD">Gold Tier</option>
                  <option value="SILVER">Silver Tier</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {/* Step 8: Schedule */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Step 8: Event Schedule</h3>
            {schedule.map((sc, idx) => (
              <div key={idx} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
                <input
                  type="text"
                  placeholder="Event Title"
                  value={sc.title}
                  onChange={(e) => {
                    const u = [...schedule];
                    u[idx].title = e.target.value;
                    setSchedule(u);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 9: Mentors & Judges */}
        {currentStep === 9 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Step 9: Mentors & Judges</h3>
            <p className="text-xs text-slate-400">
              Assigned judges will automatically see this hackathon in their judging portal.
            </p>
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-xs text-slate-300">
              ✓ Platform judges (including Dr. Marcus Vance) will be automatically invited to your judging panel.
            </div>
          </div>
        )}

        {/* Step 10: Preview & Publish */}
        {currentStep === 10 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Rocket className="w-5 h-5 text-indigo-400" /> Step 10: Final Review & Publish
            </h3>

            <div className="p-6 bg-slate-800/60 rounded-2xl border border-slate-700 space-y-3">
              <h4 className="text-xl font-extrabold text-white">{title || "Untitled Hackathon"}</h4>
              <p className="text-xs text-slate-300">{shortDescription || "No short description provided."}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-400 pt-2">
                <span>Theme: <strong>{theme}</strong></span> &bull;
                <span>Format: <strong>{mode}</strong></span> &bull;
                <span>Prizes: <strong>{prizes.length} configured</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit("DRAFT")}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition"
              >
                Save as Draft
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit("PUBLISHED")}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
              >
                {submitting ? "Publishing..." : "Launch & Publish Hackathon 🚀"}
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation Bar */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((c) => Math.max(1, c - 1))}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Previous Step
          </button>

          {currentStep < totalSteps && (
            <button
              type="button"
              onClick={() => setCurrentStep((c) => Math.min(totalSteps, c + 1))}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
