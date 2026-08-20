"use client";

import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

interface CountdownProps {
  targetDate: string | Date;
  label?: string;
  className?: string;
}

export default function CountdownTimer({ targetDate, label, className = "" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isEnded: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
  });

  useEffect(() => {
    function calculate() {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = differenceInSeconds(target, now);

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true });
        return;
      }

      const days = Math.floor(diff / (3600 * 24));
      const hours = Math.floor((diff % (3600 * 24)) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setTimeLeft({ days, hours, minutes, seconds, isEnded: false });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isEnded) {
    return (
      <div className={`inline-flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 ${className}`}>
        <span>Ended</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <span className="text-xs text-slate-400 font-medium">{label}</span>}
      <div className="flex items-center gap-1.5 font-mono text-xs">
        <div className="bg-slate-900/90 border border-slate-700/80 px-2 py-1 rounded text-indigo-300 font-bold text-center min-w-[2.2rem]">
          {String(timeLeft.days).padStart(2, "0")}
          <span className="block text-[9px] font-sans text-slate-400 font-normal uppercase">d</span>
        </div>
        <span className="text-slate-500 font-bold">:</span>
        <div className="bg-slate-900/90 border border-slate-700/80 px-2 py-1 rounded text-indigo-300 font-bold text-center min-w-[2.2rem]">
          {String(timeLeft.hours).padStart(2, "0")}
          <span className="block text-[9px] font-sans text-slate-400 font-normal uppercase">h</span>
        </div>
        <span className="text-slate-500 font-bold">:</span>
        <div className="bg-slate-900/90 border border-slate-700/80 px-2 py-1 rounded text-indigo-300 font-bold text-center min-w-[2.2rem]">
          {String(timeLeft.minutes).padStart(2, "0")}
          <span className="block text-[9px] font-sans text-slate-400 font-normal uppercase">m</span>
        </div>
        <span className="text-slate-500 font-bold">:</span>
        <div className="bg-slate-900/90 border border-slate-700/80 px-2 py-1 rounded text-indigo-300 font-bold text-center min-w-[2.2rem]">
          {String(timeLeft.seconds).padStart(2, "0")}
          <span className="block text-[9px] font-sans text-slate-400 font-normal uppercase">s</span>
        </div>
      </div>
    </div>
  );
}
