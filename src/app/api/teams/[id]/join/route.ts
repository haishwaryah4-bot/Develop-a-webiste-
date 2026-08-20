import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = requireAuth(req);
    const body = await req.json().catch(() => ({}));
    const joinCode = body.joinCode || params.id;

    // Find team by ID or joinCode
    const team = await prisma.team.findFirst({
      where: {
        OR: [{ id: params.id }, { joinCode: joinCode }],
      },
      include: {
        hackathon: true,
        members: true,
      },
    });

    if (!team) {
      return apiError("Invalid join code or team not found", "NOT_FOUND", 404);
    }

    // Check if user is already in this team
    if (team.members.some((m) => m.userId === session.userId)) {
      return apiError("You are already a member of this team", "ALREADY_MEMBER", 400);
    }

    // Check if user is in another team for this hackathon
    const existingMembership = await prisma.teamMember.findFirst({
      where: {
        userId: session.userId,
        team: { hackathonId: team.hackathonId },
      },
    });

    if (existingMembership) {
      return apiError("You are already part of another team in this hackathon. You must leave your current team first.", "ALREADY_IN_HACKATHON_TEAM", 400);
    }

    // Check max team size
    if (team.members.length >= team.hackathon.maxTeamSize) {
      return apiError(`This team is full (maximum ${team.hackathon.maxTeamSize} members allowed)`, "TEAM_FULL", 400);
    }

    // Auto-register if not registered
    await prisma.hackathonRegistration.upsert({
      where: {
        userId_hackathonId: {
          userId: session.userId,
          hackathonId: team.hackathonId,
        },
      },
      create: {
        userId: session.userId,
        hackathonId: team.hackathonId,
        status: "REGISTERED",
      },
      update: {},
    });

    // Add member
    const newMember = await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: session.userId,
        role: "MEMBER",
      },
      include: {
        user: { select: { id: true, name: true, username: true, avatar: true } },
      },
    });

    // Notify team owner
    await prisma.notification.create({
      data: {
        userId: team.ownerId,
        type: "INVITATION",
        title: "New Team Member! 🚀",
        message: `${session.name} (@${session.username}) has joined your team "${team.name}".`,
        link: `/teams/${team.slug}`,
      },
    });

    return apiSuccess({ team, newMember }, "Successfully joined team", 200);
  } catch (error: any) {
    return apiError(error.message || "Failed to join team", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
