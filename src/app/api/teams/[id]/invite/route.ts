import { NextRequest } from "next/server";
import { addDays } from "date-fns";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = requireAuth(req);
    const { usernameOrEmail } = await req.json();

    if (!usernameOrEmail) {
      return apiError("Please provide a username or email", "BAD_REQUEST", 400);
    }

    const team = await prisma.team.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
      include: { hackathon: true, members: true },
    });

    if (!team) {
      return apiError("Team not found", "NOT_FOUND", 404);
    }

    // Check inviter is member/owner
    if (!team.members.some((m) => m.userId === session.userId)) {
      return apiError("Only team members can invite new participants", "FORBIDDEN", 403);
    }

    // Check capacity
    if (team.members.length >= team.hackathon.maxTeamSize) {
      return apiError("Team is already at maximum capacity", "TEAM_FULL", 400);
    }

    // Find invitee user
    const invitee = await prisma.user.findFirst({
      where: {
        OR: [
          { email: usernameOrEmail.toLowerCase() },
          { username: usernameOrEmail.toLowerCase() },
        ],
      },
    });

    if (!invitee) {
      return apiError("User not found with this username or email", "USER_NOT_FOUND", 404);
    }

    if (team.members.some((m) => m.userId === invitee.id)) {
      return apiError("User is already in this team", "ALREADY_MEMBER", 400);
    }

    // Check existing pending invitation
    const existingInvite = await prisma.teamInvitation.findFirst({
      where: {
        teamId: team.id,
        inviteeId: invitee.id,
        status: "PENDING",
      },
    });

    if (existingInvite) {
      return apiError("An invitation is already pending for this user", "INVITE_EXISTS", 400);
    }

    const invitation = await prisma.teamInvitation.create({
      data: {
        teamId: team.id,
        inviterId: session.userId,
        inviteeId: invitee.id,
        status: "PENDING",
        expiresAt: addDays(new Date(), 7),
      },
      include: {
        team: { select: { id: true, name: true, slug: true } },
        invitee: { select: { id: true, name: true, username: true } },
      },
    });

    // Notify invitee
    await prisma.notification.create({
      data: {
        userId: invitee.id,
        type: "INVITATION",
        title: `Team Invitation: ${team.name}`,
        message: `${session.name} invited you to join "${team.name}" for ${team.hackathon.title}.`,
        link: `/teams/${team.slug}`,
      },
    });

    return apiSuccess(invitation, `Invitation sent to ${invitee.name} (@${invitee.username})`, 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to invite member", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = requireAuth(req);
    const { invitationId, action } = await req.json(); // action: "ACCEPT" or "REJECT"

    if (!invitationId || !["ACCEPT", "REJECT"].includes(action)) {
      return apiError("Invalid invitation response", "BAD_REQUEST", 400);
    }

    const invite = await prisma.teamInvitation.findUnique({
      where: { id: invitationId },
      include: {
        team: { include: { hackathon: true, members: true } },
      },
    });

    if (!invite || invite.inviteeId !== session.userId) {
      return apiError("Invitation not found", "NOT_FOUND", 404);
    }

    if (action === "REJECT") {
      await prisma.teamInvitation.update({
        where: { id: invite.id },
        data: { status: "REJECTED" },
      });
      return apiSuccess(null, "Invitation declined");
    }

    // Accepting:
    // Check hackathon capacity
    if (invite.team.members.length >= invite.team.hackathon.maxTeamSize) {
      return apiError("Team is already at maximum capacity", "TEAM_FULL", 400);
    }

    // Check if user is in another team for this hackathon
    const existingTeam = await prisma.teamMember.findFirst({
      where: {
        userId: session.userId,
        team: { hackathonId: invite.team.hackathonId },
      },
    });
    if (existingTeam) {
      return apiError("You are already a member of another team in this hackathon. Leave it first.", "ALREADY_IN_TEAM", 400);
    }

    // Add to team & mark invitation accepted
    await prisma.$transaction([
      prisma.teamMember.create({
        data: {
          teamId: invite.teamId,
          userId: session.userId,
          role: "MEMBER",
        },
      }),
      prisma.teamInvitation.update({
        where: { id: invite.id },
        data: { status: "ACCEPTED" },
      }),
      prisma.hackathonRegistration.upsert({
        where: {
          userId_hackathonId: {
            userId: session.userId,
            hackathonId: invite.team.hackathonId,
          },
        },
        create: {
          userId: session.userId,
          hackathonId: invite.team.hackathonId,
          status: "REGISTERED",
        },
        update: {},
      }),
    ]);

    // Notify team owner
    await prisma.notification.create({
      data: {
        userId: invite.team.ownerId,
        type: "INVITATION",
        title: "Invitation Accepted! 🎉",
        message: `${session.name} (@${session.username}) accepted your invitation to join ${invite.team.name}.`,
        link: `/teams/${invite.team.slug}`,
      },
    });

    return apiSuccess({ teamSlug: invite.team.slug }, "Joined team successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to respond to invitation", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
