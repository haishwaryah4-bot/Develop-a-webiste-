"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { X, Sparkles, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, refreshUser, switchDemoRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARTICIPANT");

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      if (authModalTab === "login") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailOrUsername: email, password }),
        });
        const data = await res.json();
        if (!data.success) {
          setErrorMessage(data.error?.message || "Failed to log in");
        } else {
          await refreshUser();
          closeAuthModal();
          window.location.reload();
        }
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, username, email, password, role }),
        });
        const data = await res.json();
        if (!data.success) {
          setErrorMessage(data.error?.message || "Registration failed");
          if (data.error?.fields) setFieldErrors(data.error.fields);
        } else {
          await refreshUser();
          closeAuthModal();
          window.location.reload();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (demoRole: string) => {
    setIsSubmitting(true);
    await switchDemoRole(demoRole);
    closeAuthModal();
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden text-slate-100">
        {/* Glow backdrop accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 mb-3 text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {authModalTab === "login" ? "Welcome Back" : "Join Hackathon Platform"}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {authModalTab === "login"
              ? "Sign in to manage hackathons, teams, and submissions"
              : "Create an account to build, collaborate, and innovate"}
          </p>
        </div>

        {/* Quick Demo Switcher Section */}
        <div className="mb-6 p-3 bg-slate-800/80 border border-indigo-500/30 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Instant Demo Sign-In
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("PARTICIPANT")}
              className="py-1.5 px-2 bg-slate-900/90 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 rounded-lg text-slate-200 font-medium transition text-center"
            >
              🧑‍💻 Hacker
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("ORGANIZER")}
              className="py-1.5 px-2 bg-slate-900/90 hover:bg-purple-600/30 border border-slate-700 hover:border-purple-500/50 rounded-lg text-slate-200 font-medium transition text-center"
            >
              🎪 Organizer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("JUDGE")}
              className="py-1.5 px-2 bg-slate-900/90 hover:bg-amber-600/30 border border-slate-700 hover:border-amber-500/50 rounded-lg text-slate-200 font-medium transition text-center"
            >
              ⚖️ Judge
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("ADMIN")}
              className="py-1.5 px-2 bg-slate-900/90 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-500/50 rounded-lg text-slate-200 font-medium transition text-center"
            >
              🛡️ Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("MENTOR")}
              className="py-1.5 px-2 bg-slate-900/90 hover:bg-blue-600/30 border border-slate-700 hover:border-blue-500/50 rounded-lg text-slate-200 font-medium transition text-center"
            >
              🧭 Mentor
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 mb-5">
          <button
            onClick={() => openAuthModal("login")}
            className={`flex-1 pb-2.5 text-sm font-semibold text-center transition border-b-2 ${
              authModalTab === "login"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => openAuthModal("register")}
            className={`flex-1 pb-2.5 text-sm font-semibold text-center transition border-b-2 ${
              authModalTab === "register"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalTab === "register" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                {fieldErrors.name && <p className="text-rose-400 text-[11px] mt-1">{fieldErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 text-sm">@</span>
                  <input
                    type="text"
                    required
                    placeholder="alexrivera"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                {fieldErrors.username && <p className="text-rose-400 text-[11px] mt-1">{fieldErrors.username}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">I want to join as</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="PARTICIPANT">Hacker / Participant</option>
                  <option value="ORGANIZER">Organizer (Host Hackathons)</option>
                  <option value="JUDGE">Judge</option>
                  <option value="MENTOR">Mentor</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {authModalTab === "login" ? "Email or Username" : "Email Address"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type={authModalTab === "login" ? "text" : "email"}
                required
                placeholder={authModalTab === "login" ? "hacker@hackathon.dev" : "alex@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {fieldErrors.email && <p className="text-rose-400 text-[11px] mt-1">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {fieldErrors.password && <p className="text-rose-400 text-[11px] mt-1">{fieldErrors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition text-sm"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {authModalTab === "login" ? "Sign In" : "Get Started"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
