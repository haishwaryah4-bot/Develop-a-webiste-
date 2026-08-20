import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const session = requireAuth(req);

    // If ADMIN or ORGANIZER or JUDGE, find assignments
    let hackathons: any[] = [];

    if (session.role === "ADMIN") {
      hackathons = await prisma.hackathon.findMany({
        include: {
          criteria: true,
          projects: {
            where: { status: "SUBMITTED" },
            include: {
              team: true,
              scores: { where: { judgeId: session.userId } },
            },
          },
        },
      });
    } else {
      // Find hackathons where user is assigned judge or owner of org
      const judgeAssignments = await prisma.judge.findMany({
        where: { userId: session.userId },
        include: {
          hackathon: {
            include: {
              criteria: true,
              projects: {
                where: { status: "SUBMITTED" },
                include: {
                  team: true,
                  scores: { where: { judgeId: session.userId } },
                },
              },
            },
          },
        },
      });

      // Also get hackathons where user is organizer
      const organizedHackathons = await prisma.hackathon.findMany({
        where: { organization: { ownerId: session.userId } },
        include: {
          criteria: true,
          projects: {
            where: { status: "SUBMITTED" },
            include: {
              team: true,
              scores: { where: { judgeId: session.userId } },
            },
          },
        },
      });

      const map = new Map<string, any>();
      judgeAssignments.forEach((j) => map.set(j.hackathon.id, j.hackathon));
      organizedHackathons.forEach((h) => map.set(h.id, h));
      hackathons = Array.from(map.values());
    }

    const results = hackathons.map((h) => {
      const totalProjects = h.projects.length;
      const scoredCount = h.projects.filter((p: any) => p.scores.length > 0).length;
      return {
        id: h.id,
        title: h.title,
        slug: h.slug,
        status: h.status,
        submissionDeadline: h.submissionDeadline,
        judgingEnd: h.judgingEnd,
        criteria: h.criteria,
        totalProjects,
        scoredProjects: scoredCount,
        pendingProjects: totalProjects - scoredCount,
        progressPercent: totalProjects > 0 ? Math.round((scoredCount / totalProjects) * 100) : 0,
        projects: h.projects.map((p: any) => ({
          id: p.id,
          title: p.title,
          tagline: p.tagline,
          teamName: p.team.name,
          hasScored: p.scores.length > 0,
          scoreCount: p.scores.length,
        })),
      };
    });

    return apiSuccess(results);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch assigned judging", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
