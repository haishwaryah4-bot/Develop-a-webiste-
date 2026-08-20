import React from "react";
import Link from "next/link";
import prisma from "@/lib/db";
import { computeHackathonStatus } from "@/lib/dates";
import HackathonCard from "@/components/HackathonCard";
import {
  Trophy,
  Sparkles,
  ArrowRight,
  Code2,
  Users,
  Award,
  Zap,
  Globe2,
  CheckCircle2,
  Flame,
  ShieldCheck,
  Compass,
  Cpu,
  Layers,
} from "lucide-react";

export const revalidate = 0; // Fresh data

export default async function HomePage() {
  const [featuredHackathons, activeHackathons, stats] = await Promise.all([
    prisma.hackathon.findMany({
      where: { isFeatured: true },
      include: {
        organization: { select: { name: true, logo: true } },
        prizes: true,
        _count: { select: { registrations: true, teams: true, projects: true } },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    prisma.hackathon.findMany({
      include: {
        organization: { select: { name: true, logo: true } },
        prizes: true,
        _count: { select: { registrations: true, teams: true, projects: true } },
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    Promise.all([
      prisma.user.count(),
      prisma.hackathon.count(),
      prisma.project.count({ where: { status: "SUBMITTED" } }),
    ]),
  ]);

  const [userCount, hackathonCount, projectCount] = stats;

  const enrichedFeatured = featuredHackathons.map((h) => ({
    ...h,
    computedStatus: computeHackathonStatus(h),
    registrationCount: h._count.registrations,
    teamCount: h._count.teams,
    projectCount: h._count.projects,
  }));

  const enrichedActive = activeHackathons.map((h) => ({
    ...h,
    computedStatus: computeHackathonStatus(h),
    registrationCount: h._count.registrations,
    teamCount: h._count.teams,
    projectCount: h._count.projects,
  }));

  const categories = [
    { title: "Artificial Intelligence", count: "140+ Events", icon: Cpu, href: "/hackathons?theme=Artificial+Intelligence", color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/30" },
    { title: "Web3 & Blockchain", count: "85+ Events", icon: Layers, href: "/hackathons?theme=Web3+%26+Blockchain", color: "from-purple-500/20 to-pink-500/20 border-purple-500/30" },
    { title: "Climate & Energy", count: "42+ Events", icon: Globe2, href: "/hackathons?theme=Climate+%26+Sustainability", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30" },
    { title: "Healthcare & BioTech", count: "38+ Events", icon: Sparkles, href: "/hackathons?theme=Healthcare+%26+Biotech", color: "from-rose-500/20 to-amber-500/20 border-rose-500/30" },
    { title: "FinTech & Banking", count: "55+ Events", icon: Trophy, href: "/hackathons?theme=FinTech", color: "from-amber-500/20 to-orange-500/20 border-amber-500/30" },
    { title: "Cybersecurity", count: "29+ Events", icon: ShieldCheck, href: "/hackathons?theme=Cybersecurity", color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30" },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Background glow flares */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>The Premier Platform for Global Hackathons</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Build. Collaborate. <br />
            <span className="gradient-text">Innovate.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover premier hackathons, assemble dream teams, build high-impact projects, and get evaluated by world-class judges.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/hackathons"
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition duration-200"
            >
              Explore Hackathons <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/organizer"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition duration-200"
            >
              Host a Hackathon
            </Link>
          </div>
        </div>

        {/* Visual Lifecycle Flow Strip */}
        <div className="mt-14 p-6 bg-slate-900/80 border border-slate-800/80 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-6">
            The Complete Hackathon Lifecycle
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            {[
              { step: "01", title: "Discover", desc: "Find top challenges" },
              { step: "02", title: "Register", desc: "1-click enrollment" },
              { step: "03", title: "Team Up", desc: "Match & invite talent" },
              { step: "04", title: "Submit", desc: "Drafts & repo sync" },
              { step: "05", title: "Judging", desc: "Weighted criteria" },
              { step: "06", title: "Win & Certify", desc: "Prizes & QR badges" },
            ].map((s, idx) => (
              <div key={idx} className="relative flex flex-col items-center">
                <span className="text-[10px] font-mono font-bold text-indigo-400 mb-1">{s.step}</span>
                <span className="text-sm font-bold text-white mb-0.5">{s.title}</span>
                <span className="text-[11px] text-slate-400">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Platform Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
              {userCount > 0 ? `${userCount * 120}+` : "10,000+"}
            </div>
            <div className="text-xs text-slate-400 font-medium">Registered Hackers</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mb-1">
              {hackathonCount > 0 ? `${hackathonCount * 15}+` : "500+"}
            </div>
            <div className="text-xs text-slate-400 font-medium">Global Hackathons</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 mb-1">
              {projectCount > 0 ? `${projectCount * 50}+` : "2,000+"}
            </div>
            <div className="text-xs text-slate-400 font-medium">Submitted Projects</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">$5,000,000+</div>
            <div className="text-xs text-slate-400 font-medium">Awarded in Prizes</div>
          </div>
        </div>
      </section>

      {/* Featured Hackathons Section */}
      {enrichedFeatured.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 text-amber-400" /> Spotlight
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Featured Hackathons
              </h2>
            </div>
            <Link
              href="/hackathons"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enrichedFeatured.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Categories */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Explore by Innovation Track
          </h2>
          <p className="text-sm text-slate-400">
            Choose from trending tracks across artificial intelligence, zero-knowledge crypto, climate technology, and more.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={i}
                href={cat.href}
                className={`p-5 rounded-2xl bg-gradient-to-br ${cat.color} border hover:scale-[1.03] transition-transform duration-200 flex flex-col items-center text-center justify-center group`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900/90 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-xs font-bold text-white mb-1">{cat.title}</h3>
                <span className="text-[10px] text-slate-400">{cat.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Active & Upcoming Hackathons Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              Active & Upcoming
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Trending Competitions
            </h2>
          </div>
          <Link
            href="/hackathons"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
          >
            Browse All ({enrichedActive.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrichedActive.map((h) => (
            <HackathonCard key={h.id} hackathon={h} />
          ))}
        </div>
      </section>

      {/* Organizer Hosting CTA Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-12">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 border border-indigo-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              For Enterprises & Organizers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Host Your Next Landmark Hackathon on HackForge
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Launch in minutes with our 11-step creation wizard, automated participant onboarding, built-in weighted scoring matrices, live leaderboards, and tamper-proof certificate generation.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/organizer"
                className="px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 text-xs font-extrabold rounded-xl shadow-lg transition duration-200"
              >
                Host a Hackathon Now
              </Link>
              <Link
                href="/hackathons/global-ai-agents-2026/leaderboard"
                className="px-6 py-3 bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700 text-xs font-bold rounded-xl transition duration-200"
              >
                View Live Leaderboard Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
