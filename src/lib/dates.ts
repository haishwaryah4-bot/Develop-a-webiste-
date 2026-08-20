import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";

export type HackathonComputedStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "ACTIVE"
  | "JUDGING"
  | "COMPLETED"
  | "ARCHIVED";

export interface DateRangeSchedule {
  status: string;
  startDate: Date | string;
  endDate: Date | string;
  registrationStart: Date | string;
  registrationEnd: Date | string;
  submissionDeadline: Date | string;
  judgingStart: Date | string;
  judgingEnd: Date | string;
}

export function computeHackathonStatus(h: DateRangeSchedule): HackathonComputedStatus {
  if (h.status === "DRAFT" || h.status === "ARCHIVED") {
    return h.status as HackathonComputedStatus;
  }

  const now = new Date();
  const regStart = new Date(h.registrationStart);
  const regEnd = new Date(h.registrationEnd);
  const start = new Date(h.startDate);
  const deadline = new Date(h.submissionDeadline);
  const judgeEnd = new Date(h.judgingEnd);
  const end = new Date(h.endDate);

  if (isBefore(now, regStart)) {
    return "PUBLISHED";
  }
  if (isAfter(now, regStart) && isBefore(now, regEnd)) {
    return "REGISTRATION_OPEN";
  }
  if (isAfter(now, regEnd) && isBefore(now, start)) {
    return "REGISTRATION_CLOSED";
  }
  if (isAfter(now, start) && isBefore(now, deadline)) {
    return "ACTIVE";
  }
  if (isAfter(now, deadline) && isBefore(now, judgeEnd)) {
    return "JUDGING";
  }
  if (isAfter(now, judgeEnd) || isAfter(now, end)) {
    return "COMPLETED";
  }

  return "ACTIVE";
}

export function getStatusBadgeStyle(status: string): { bg: string; text: string; label: string } {
  switch (status) {
    case "REGISTRATION_OPEN":
      return { bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", text: "text-emerald-400", label: "Registration Open" };
    case "ACTIVE":
      return { bg: "bg-blue-500/10 text-blue-400 border-blue-500/30", text: "text-blue-400", label: "Hacking in Progress" };
    case "JUDGING":
      return { bg: "bg-amber-500/10 text-amber-400 border-amber-500/30", text: "text-amber-400", label: "Under Review" };
    case "COMPLETED":
      return { bg: "bg-purple-500/10 text-purple-400 border-purple-500/30", text: "text-purple-400", label: "Winners Announced" };
    case "REGISTRATION_CLOSED":
      return { bg: "bg-orange-500/10 text-orange-400 border-orange-500/30", text: "text-orange-400", label: "Starting Soon" };
    case "DRAFT":
      return { bg: "bg-slate-500/10 text-slate-400 border-slate-500/30", text: "text-slate-400", label: "Draft" };
    default:
      return { bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30", text: "text-indigo-400", label: status };
  }
}

export function formatDateTime(date: Date | string): string {
  try {
    return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return String(date);
  }
}

export function formatDateShort(date: Date | string): string {
  try {
    return format(new Date(date), "MMM d, yyyy");
  } catch {
    return String(date);
  }
}
