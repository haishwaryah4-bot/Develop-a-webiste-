import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";

const scoreSubmissionSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  feedback: z.string().optional(),
  scores: z.array(
    z.object({
      criteriaId: z.string().min(1),
      score: z.number().min(0).max(10),
    })
  ).min(1, "At least one score is required"),
});

export async function GET(req: NextRequest) {
  try {
    const session = requireAuth(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return apiError("Project ID is required", "BAD_REQUEST", 400);
    }

    const scores = await prisma.score.findMany({
      where: {
        projectId,
        ...(session.role !== "ADMIN" && session.role !== "ORGANIZER" ? { judgeId: session.userId } : {}),
      },
      include: {
        criteria: true,
        judge: { select: { id: true, name: true, username: true, avatar: true } },
      },
    });

    return apiSuccess(scores);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch scores", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = requireAuth(req);
    const body = await req.json();
    const result = scoreSubmissionSchema.safeParse(body);

    if (!result.success) {
      return apiError("Invalid scoring data", "VALIDATION_ERROR", 400);
    }

    const { projectId, feedback, scores } = result.data;

    // Fetch project with hackathon and team
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        hackathon: {
          include: { organization: true },
        },
        team: {
          include: { members: true },
        },
      },
    });

    if (!project) {
      return apiError("Project not found", "NOT_FOUND", 404);
    }

    // Check if judge is scoring their own team
    if (project.team.members.some((m) => m.userId === session.userId)) {
      return apiError("Conflict of interest: Judges cannot score their own team's project", "CONFLICT_OF_INTEREST", 403);
    }

    // Check if leaderboard/judging is frozen
    if (project.hackathon.isLeaderboardFrozen && session.role !== "ADMIN") {
      return apiError("Judging has concluded and scores are locked by the organizer.", "JUDGING_LOCKED", 403);
    }

    // Verify judge assignment (or organizer/admin)
    const isOrg = project.hackathon.organization.ownerId === session.userId;
    const isAssignedJudge = await prisma.judge.findUnique({
      where: {
        userId_hackathonId: {
          userId: session.userId,
          hackathonId: project.hackathonId,
        },
      },
    });

    if (!isOrg && !isAssignedJudge && session.role !== "ADMIN") {
      return apiError("You are not authorized to judge projects for this hackathon", "FORBIDDEN", 403);
    }

    // Upsert scores in a transaction
    const operations = scores.map((s) =>
      prisma.score.upsert({
        where: {
          projectId_judgeId_criteriaId: {
            projectId,
            judgeId: session.userId,
            criteriaId: s.criteriaId,
          },
        },
        create: {
          projectId,
          judgeId: session.userId,
          criteriaId: s.criteriaId,
          score: s.score,
          feedback: feedback || null,
        },
        update: {
          score: s.score,
          feedback: feedback !== undefined ? feedback : undefined,
        },
      })
    );

    const savedScores = await prisma.$transaction(operations);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "PROJECT_SCORED",
        entity: "Project",
        entityId: projectId,
        detailsJson: JSON.stringify({ scoresCount: scores.length, feedback }),
      },
    });

    return apiSuccess(savedScores, "Scores submitted successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to submit scores", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
