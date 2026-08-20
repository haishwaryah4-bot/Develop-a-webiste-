import React from "react";
import Link from "next/link";
import { Trophy, Github, Twitter, Linkedin, Heart, Shield, Code, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Hack<span className="text-indigo-400">Forge</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The premier full-stack platform empowering organizers to host world-class hackathons and builders to turn ideas into groundbreaking software.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-900 border border-slate-800 hover:text-white rounded-lg transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-900 border border-slate-800 hover:text-white rounded-lg transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-900 border border-slate-800 hover:text-white rounded-lg transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Hackathons */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Discover</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/hackathons?theme=AI" className="hover:text-indigo-400 transition">AI & Machine Learning</Link></li>
              <li><Link href="/hackathons?theme=Web3" className="hover:text-indigo-400 transition">Web3 & Blockchain</Link></li>
              <li><Link href="/hackathons?theme=Climate" className="hover:text-indigo-400 transition">ClimateTech</Link></li>
              <li><Link href="/hackathons?mode=ONLINE" className="hover:text-indigo-400 transition">Virtual Hackathons</Link></li>
              <li><Link href="/hackathons?mode=OFFLINE" className="hover:text-indigo-400 transition">In-Person Summits</Link></li>
            </ul>
          </div>

          {/* Organizers & Judges */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/organizer" className="hover:text-indigo-400 transition">Host a Hackathon</Link></li>
              <li><Link href="/judge" className="hover:text-indigo-400 transition">Judging Portal</Link></li>
              <li><Link href="/dashboard" className="hover:text-indigo-400 transition">Participant Hub</Link></li>
              <li><Link href="/certificates/verify/HK-7F9A-4E2C-99B1" className="hover:text-indigo-400 transition">Verify Certificate</Link></li>
            </ul>
          </div>

          {/* About & Trust */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Trust & Security</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-500">GDPR & SOC2 Compliant</span></li>
              <li><span className="text-slate-500">Strict Anti-Plagiarism</span></li>
              <li><span className="text-slate-500">Cryptographic Certificates</span></li>
              <li><span className="text-slate-500">Fair Scoring Engine</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} HackForge Inc. All rights reserved. &bull; Build. Collaborate. Innovate.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              Engineered with <Code className="w-3.5 h-3.5 text-indigo-400" /> Next.js & Prisma
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
