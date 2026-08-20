import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";

const projectCreateSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
  hackathonId: z.string().min(1, "Hackathon ID is required"),
  title: z.string().min(2, "Project title must be at least 2 characters"),
  tagline: z.string().min(5, "Tagline must be at least 5 characters"),
  description: z.string().min(10, "Description is required"),
  problem: z.string().optional(),
  solution: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  repositoryUrl: z.string().url("Invalid GitHub/Repository URL").optional().or(z.literal("")),
  demoUrl: z.string().url("Invalid Demo URL").optional().or(z.literal("")),
  videoUrl: z.string().url("Invalid Video URL").optional().or(z.literal("")),
  presentationUrl: z.string().url("Invalid Presentation URL").optional().or(z.literal("")),
  screenshots: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "SUBMITTED"]).default("DRAFT"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hackathonId = searchParams.get("hackathonId");
    const status = searchParams.get("status");
    const teamId = searchParams.get("teamId");

    const where: any = {};
    if (hackathonId) where.hackathonId = hackathonId;
    if (status) where.status = status;
    if (teamId) where.teamId = teamId;

    const projects = await prisma.project.findMany({
      where,
      include: {
        team: {
          include: {
            members: {
              include: { user: { select: { id: true, name: true, username: true, avatar: true } } },
            },
          },
        },
        hackathon: { select: { id: true, title: true, slug: true, isLeaderboardLive: true } },
        scores: {
          include: {
            criteria: true,
            judge: { select: { id: true, name: true, avatar: true } },
          },
        },
        prizesWon: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const parsed = projects.map((p) => ({
      ...p,
      technologies: p.technologies ? JSON.parse(p.technologies) : [],
      screenshots: p.screenshots ? JSON.parse(p.screenshots) : [],
    }));

    return apiSuccess(parsed);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch projects", "INTERNAL_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = requireAuth(req);
    const body = await req.json();
    const result = projectCreateSchema.safeParse(body);

    if (!result.success) {
      const fields: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fields[err.path[0].toString()] = err.message;
      });
      return apiError("Validation failed", "VALIDATION_ERROR", 400, fields);
    }

    const data = result.data;

    // Verify user is in the team
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: data.teamId,
          userId: session.userId,
        },
      },
    });

    if (!membership) {
      return apiError("You must be a member of this team to create a project", "FORBIDDEN", 403);
    }

    // Check if team already has a project
    const existingProject = await prisma.project.findFirst({
      where: { teamId: data.teamId },
    });

    if (existingProject) {
      return apiError("Your team already has a project. Please update the existing project.", "PROJECT_EXISTS", 409);
    }

    const project = await prisma.project.create({
      data: {
        teamId: data.teamId,
        hackathonId: data.hackathonId,
        title: data.title,
        tagline: data.tagline,
        description: data.description,
        problem: data.problem || "",
        solution: data.solution || "",
        technologies: data.technologies ? JSON.stringify(data.technologies) : "[]",
        repositoryUrl: data.repositoryUrl || null,
        demoUrl: data.demoUrl || null,
        videoUrl: data.videoUrl || null,
        presentationUrl: data.presentationUrl || null,
        screenshots: data.screenshots ? JSON.stringify(data.screenshots) : "[]",
        status: data.status,
        submittedAt: data.status === "SUBMITTED" ? new Date() : null,
      },
      include: {
        team: true,
      },
    });

    return apiSuccess(project, "Project created successfully", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to create project", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
