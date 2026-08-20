import { NextRequest } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";

const teamCreateSchema = z.object({
  hackathonId: z.string().min(1, "Hackathon ID is required"),
  name: z.string().min(2, "Team name must be at least 2 characters"),
  description: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hackathonId = searchParams.get("hackathonId");
    const userId = searchParams.get("userId");

    const where: any = {};
    if (hackathonId) where.hackathonId = hackathonId;
    if (userId) {
      where.members = {
        some: { userId },
      };
    }

    const teams = await prisma.team.findMany({
      where,
      include: {
        hackathon: { select: { id: true, title: true, slug: true, maxTeamSize: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, username: true, avatar: true, skills: true } },
          },
        },
        projects: {
          select: { id: true, title: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(teams);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch teams", "INTERNAL_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = requireAuth(req);
    const body = await req.json();
    const result = teamCreateSchema.safeParse(body);

    if (!result.success) {
      return apiError("Invalid team data", "VALIDATION_ERROR", 400);
    }

    const { hackathonId, name, description } = result.data;

    // Check hackathon exists
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });
    if (!hackathon) {
      return apiError("Hackathon not found", "NOT_FOUND", 404);
    }

    // Ensure user is registered for the hackathon
    let reg = await prisma.hackathonRegistration.findUnique({
      where: {
        userId_hackathonId: {
          userId: session.userId,
          hackathonId,
        },
      },
    });
    if (!reg) {
      reg = await prisma.hackathonRegistration.create({
        data: {
          userId: session.userId,
          hackathonId,
          status: "REGISTERED",
        },
      });
    }

    // Check if user is already in a team for this hackathon
    const existingMembership = await prisma.teamMember.findFirst({
      where: {
        userId: session.userId,
        team: { hackathonId },
      },
    });
    if (existingMembership) {
      return apiError("You are already a member of a team in this hackathon", "ALREADY_IN_TEAM", 409);
    }

    // Generate slug and unique join code
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const uniqueSuffix = crypto.randomBytes(3).toString("hex");
    const slug = `${baseSlug}-${uniqueSuffix}`;
    const joinCode = `TEAM-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // Create Team and assign owner in a transaction
    const team = await prisma.team.create({
      data: {
        hackathonId,
        name,
        slug,
        description: description || "",
        ownerId: session.userId,
        joinCode,
        members: {
          create: {
            userId: session.userId,
            role: "OWNER",
          },
        },
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, username: true, avatar: true } },
          },
        },
        hackathon: {
          select: { id: true, title: true, slug: true, maxTeamSize: true },
        },
      },
    });

    return apiSuccess(team, "Team created successfully", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to create team", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
