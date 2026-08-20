import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    requireRole(req, ["ADMIN"]);

    const [userCount, hackathonCount, teamCount, projectCount, pendingReportsCount, auditLogs] = await Promise.all([
      prisma.user.count(),
      prisma.hackathon.count(),
      prisma.team.count(),
      prisma.project.count({ where: { status: "SUBMITTED" } }),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.auditLog.findMany({
        take: 30,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, username: true, role: true } },
        },
      }),
    ]);

    // Role breakdown
    const roles = await prisma.user.groupBy({
      by: ["role"],
      _count: { id: true },
    });

    return apiSuccess({
      counts: {
        users: userCount,
        hackathons: hackathonCount,
        teams: teamCount,
        submissions: projectCount,
        pendingReports: pendingReportsCount,
      },
      roles: roles.map((r) => ({ role: r.role, count: r._count.id })),
      auditLogs,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch platform stats", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
