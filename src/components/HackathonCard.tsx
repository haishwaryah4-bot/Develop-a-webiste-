"use client";

import React from "react";
import Link from "next/link";
import { Users, Trophy, MapPin, Calendar, ArrowRight, Sparkles, Flame } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { getStatusBadgeStyle, formatDateShort } from "@/lib/dates";

interface HackathonCardProps {
  hackathon: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    banner?: string | null;
    logo?: string | null;
    theme: string;
    mode: string;
    location?: string | null;
    status: string;
    computedStatus?: string;
    startDate: string | Date;
    endDate: string | Date;
    submissionDeadline: string | Date;
    registrationEnd: string | Date;
    isFeatured?: boolean;
    registrationCount?: number;
    teamCount?: number;
    projectCount?: number;
    prizes?: Array<{ value: string }>;
    organization?: { name: string; logo?: string | null };
  };
}

export default function HackathonCard({ hackathon }: HackathonCardProps) {
  const currentStatus = hackathon.computedStatus || hackathon.status;
  const badgeStyle = getStatusBadgeStyle(currentStatus);

  // Calculate prize pool summary
  const totalPrizeText = hackathon.prizes && hackathon.prizes.length > 0
    ? hackathon.prizes[0].value
    : "$25,000+";

  const targetCountdownDate =
    currentStatus === "REGISTRATION_OPEN"
      ? hackathon.registrationEnd
      : currentStatus === "ACTIVE"
      ? hackathon.submissionDeadline
      : hackathon.endDate;

  return (
    <div className="group relative bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between">
      {/* Banner / Image Header */}
      <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
        {hackathon.banner ? (
          <img
            src={hackathon.banner}
            alt={hackathon.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-indigo-950 via-slate-900 to-purple-950 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-indigo-500/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border backdrop-blur-md ${badgeStyle.bg}`}>
            {badgeStyle.label}
          </span>
          {hackathon.isFeatured && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Featured
            </span>
          )}
        </div>

        {/* Mode & Theme Badges */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-900/80 text-slate-300 border border-slate-700/60 backdrop-blur-md">
            {hackathon.theme}
          </span>
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 backdrop-blur-md">
            {hackathon.mode}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>By {hackathon.organization?.name || "Global Host"}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" /> {hackathon.location || "Online"}
            </span>
          </div>

          <Link href={`/hackathons/${hackathon.slug}`} className="block group-hover:text-indigo-400 transition">
            <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1 mb-2">
              {hackathon.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {hackathon.shortDescription}
          </p>
        </div>

        <div>
          {/* Prize pool and participants strip */}
          <div className="grid grid-cols-2 gap-2 py-3 px-3 bg-slate-800/50 rounded-xl border border-slate-800/80 mb-4">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Top Prize</span>
              <span className="text-sm font-extrabold text-emerald-400 truncate block">
                {totalPrizeText}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Participants</span>
              <span className="text-sm font-bold text-white flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                {hackathon.registrationCount ?? 120}+ registered
              </span>
            </div>
          </div>

          {/* Countdown & Footer Button */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <CountdownTimer targetDate={targetCountdownDate} label="Deadline" />

            <Link
              href={`/hackathons/${hackathon.slug}`}
              className="inline-flex items-center gap-1 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-bold transition duration-200"
            >
              View <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
