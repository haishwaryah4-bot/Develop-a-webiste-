"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import {
  User as UserIcon,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Trophy,
  FolderGit2,
  Award,
  Sparkles,
  Edit3,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function UserProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const rawUsername = params.username as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/users/${rawUsername}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(data.data);
        setName(data.data.name || "");
        setBio(data.data.bio || "");
        setLocation(data.data.location || "");
        setWebsite(data.data.website || "");
        setGithub(data.data.github || "");
        setLinkedin(data.data.linkedin || "");
        setSkillsText((data.data.skills || []).join(", "));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [rawUsername]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const parsedSkills = skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch(`/api/users/${rawUsername}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          location,
          website,
          github,
          linkedin,
          skills: parsedSkills,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        await fetchProfile();
      } else {
        alert(data.error?.message || "Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading user profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-24 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
        <Link href="/hackathons" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          Back to Discover
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id || currentUser?.role === "ADMIN";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <img
              src={profile.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`}
              alt={profile.name}
              className="w-24 h-24 rounded-3xl object-cover border-2 border-slate-700 bg-slate-800 shadow-xl"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{profile.name}</h1>
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                  {profile.role}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">@{profile.username}</p>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">{profile.bio || "Builder & Hackathon Creator."}</p>

              {/* Meta links */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> Website
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white flex items-center gap-1">
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Edit Profile Trigger */}
          {isOwnProfile && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5 self-center sm:self-start"
            >
              <Edit3 className="w-3.5 h-3.5" /> {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
          )}
        </div>

        {/* Skills Chips */}
        {profile.skills?.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2">
            {profile.skills.map((skill: string) => (
              <span
                key={skill}
                className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Inline Edit Form */}
      {isEditing && (
        <div className="p-6 bg-slate-900 border border-indigo-500/40 rounded-3xl space-y-4 animate-fadeIn">
          <h3 className="text-base font-bold text-white">Edit Profile Details</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Website URL</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bio</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Skills (comma-separated)</label>
              <input
                type="text"
                placeholder="React, Next.js, Python, TypeScript"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition"
            >
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </form>
        </div>
      )}

      {/* Participated Hackathons & Verified Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hackathons */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-indigo-400" /> Hackathons Participated ({profile.registrations?.length || 0})
          </h3>
          <div className="space-y-2">
            {profile.registrations?.map((r: any) => (
              <Link
                key={r.id}
                href={`/hackathons/${r.hackathon?.slug}`}
                className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 hover:border-slate-700 block transition"
              >
                <h4 className="text-xs font-bold text-white">{r.hackathon?.title}</h4>
                <p className="text-[11px] text-slate-400">{r.hackathon?.theme}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Verified Credentials ({profile.certificates?.length || 0})
          </h3>
          <div className="space-y-2">
            {profile.certificates?.map((c: any) => (
              <Link
                key={c.id}
                href={`/certificates/verify/${c.verificationCode}`}
                className="p-3 bg-slate-800/60 rounded-xl border border-amber-500/20 hover:border-amber-500/40 flex items-center justify-between transition"
              >
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase">{c.type}</span>
                  <h4 className="text-xs font-bold text-white">{c.hackathon?.title}</h4>
                </div>
                <span className="font-mono text-[11px] text-slate-400">{c.verificationCode}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
