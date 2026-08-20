"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { ShieldCheck, ChevronDown, Check, UserCheck } from "lucide-react";

export default function DemoSwitcher() {
  const { user, switchDemoRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const roles = [
    { key: "PARTICIPANT", label: "Hacker / Participant", icon: "🧑‍💻", color: "text-indigo-400" },
    { key: "ORGANIZER", label: "Hackathon Organizer", icon: "🎪", color: "text-purple-400" },
    { key: "JUDGE", label: "Reviewer / Judge", icon: "⚖️", color: "text-amber-400" },
    { key: "MENTOR", label: "Technical Mentor", icon: "🧭", color: "text-blue-400" },
    { key: "ADMIN", label: "Platform Administrator", icon: "🛡️", color: "text-emerald-400" },
  ];

  const handleSelect = async (roleKey: string) => {
    setSwitching(true);
    await switchDemoRole(roleKey);
    setSwitching(false);
    setIsOpen(false);
  };

  const currentRole = roles.find((r) => r.key === user?.role) || roles[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={switching}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold rounded-xl text-slate-200 shadow-sm transition"
        title="Switch Role"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="hidden sm:inline text-slate-400">Role:</span>
        <span className="font-bold text-white flex items-center gap-1">
          {currentRole.icon} {currentRole.label.split(" ")[0]}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden animate-fadeIn">
            <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Switch Demo Account
            </div>
            <div className="py-1 space-y-1">
              {roles.map((r) => {
                const isCurrent = user?.role === r.key;
                return (
                  <button
                    key={r.key}
                    onClick={() => handleSelect(r.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isCurrent
                        ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{r.icon}</span>
                      <span>{r.label}</span>
                    </div>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
