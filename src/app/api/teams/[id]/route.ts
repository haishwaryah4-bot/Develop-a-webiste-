import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { requireAuth } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req);
    const identifier = params.id;

    const team = await prisma.team.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }, { joinCode: identifier }],
      },
      include: {
        hackathon: {
          select: {
            id: true,
            title: true,
            slug: true,
            maxTeamSize: true,
            minTeamSize: true,
            submissionDeadline: true,
            status: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                bio: true,
                skills: true,
                github: true,
                linkedin: true,
              },
            },
          },
          orderBy: { joinedAt: "asc" },
        },
        projects: {
          include: {
            scores: {
              include: {
                judge: { select: { id: true, name: true, avatar: true } },
                criteria: true,
              },
            },
            prizesWon: true,
          },
        },
        invitations: {
          where: { status: "PENDING" },
          include: {
            invitee: { select: { id: true, name: true, username: true, avatar: true } },
            inviter: { select: { id: true, name: true, username: true } },
          },
        },
      },
    });

    if (!team) {
      return apiError("Team not found", "NOT_FOUND", 404);
    }

    const isMember = session ? team.members.some((m) => m.userId === session.userId) : false;
    const isOwner = session ? team.ownerId === session.userId : false;

    return apiSuccess({
      ...team,
      isMember,
      isOwner,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch team", "INTERNAL_ERROR", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = requireAuth(req);
    const team = await prisma.team.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
    });

    if (!team) {
      return apiError("Team not found", "NOT_FOUND", 404);
    }

    if (team.ownerId !== session.userId && session.role !== "ADMIN") {
      return apiError("Only the team owner can edit team details", "FORBIDDEN", 403);
    }

    const { name, description } = await req.json();

    const updated = await prisma.team.update({
      where: { id: team.id },
      data: {
        name: name || team.name,
        description: description !== undefined ? description : team.description,
      },
    });

    return apiSuccess(updated, "Team updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update team", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
