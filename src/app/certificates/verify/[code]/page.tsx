"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Share2,
  ExternalLink,
  Calendar,
  Sparkles,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import { formatDateTime, formatDateShort } from "@/lib/dates";

export default function CertificateVerifyPage() {
  const params = useParams();
  const rawCode = params.code as string;

  const [certData, setCertData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await fetch(`/api/certificates/verify/${rawCode}`);
        const data = await res.json();
        if (data.success) {
          setCertData(data.data);
        }
      } catch (err) {
        console.error("Certificate verification error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [rawCode]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Verifying cryptographic certificate...</p>
      </div>
    );
  }

  if (!certData) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Invalid Certificate Code</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The certificate verification code &ldquo;{rawCode}&rdquo; could not be verified in the platform registry.
        </p>
        <Link href="/hackathons" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold inline-block">
          Explore Hackathons
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8 print:p-0 print:max-w-none">
      {/* Top Header & Actions (hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4" /> Verified Authenticity
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Official Credential Verification
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? "Link Copied!" : "Share Link"}
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Certificate Canvas / Card */}
      <div className="relative p-8 sm:p-14 rounded-3xl bg-slate-900 border-4 border-amber-500/40 text-center space-y-8 shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Decorative corner flourishes */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

        {/* Certificate Header */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-amber-500/30">
            🏆
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-extrabold tracking-widest text-amber-300 uppercase print:text-amber-700">
            {certData.certificateTitle}
          </h2>
          <p className="text-xs uppercase tracking-widest text-slate-400 print:text-slate-600">
            Presented to
          </p>
        </div>

        {/* Recipient Name */}
        <div className="space-y-2 py-2">
          <h3 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide border-b-2 border-slate-700/60 pb-4 max-w-xl mx-auto print:text-black print:border-black">
            {certData.recipient?.name}
          </h3>
          <p className="text-xs font-mono text-slate-400 print:text-slate-600">
            @{certData.recipient?.username}
          </p>
        </div>

        {/* Hackathon Details */}
        <div className="max-w-2xl mx-auto space-y-3 text-sm text-slate-300 leading-relaxed print:text-slate-800">
          <p>
            In recognition of outstanding dedication, creativity, and technical execution in{" "}
            <strong className="text-white font-bold print:text-black">{certData.hackathon?.title}</strong>,
            organized by{" "}
            <strong className="text-indigo-400 print:text-indigo-800">
              {certData.hackathon?.organization?.name}
            </strong>.
          </p>
        </div>

        {/* Footer & Signature Section */}
        <div className="pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-xs print:border-slate-300">
          <div className="text-left space-y-1">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Issue Date</span>
            <span className="font-semibold text-white print:text-black">
              {formatDateShort(certData.issuedAt)}
            </span>
          </div>

          <div className="space-y-1">
            <div className="w-24 h-0.5 bg-amber-400/60 mx-auto mb-1" />
            <span className="font-serif italic text-sm text-amber-200 print:text-black">Elena Rostova</span>
            <span className="text-[10px] text-slate-500 block">Lead Hackathon Director</span>
          </div>

          <div className="text-right space-y-1">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Verification ID</span>
            <span className="font-mono font-bold text-amber-400 print:text-amber-800">
              {certData.verificationCode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
