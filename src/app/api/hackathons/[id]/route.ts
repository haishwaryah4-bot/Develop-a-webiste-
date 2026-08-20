import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { requireHackathonOrganizer, requireRole } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";
import { computeHackathonStatus } from "@/lib/dates";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req);
    const identifier = params.id;

    const hackathon = await prisma.hackathon.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        organization: {
          select: { id: true, name: true, slug: true, logo: true, description: true, website: true, ownerId: true },
        },
        prizes: {
          orderBy: { rank: "asc" },
          include: {
            winnerProject: {
              select: { id: true, title: true, tagline: true, team: { select: { id: true, name: true } } },
            },
          },
        },
        criteria: true,
        sponsors: {
          orderBy: { tier: "asc" },
        },
        scheduleEvents: {
          orderBy: { startTime: "asc" },
        },
        announcements: {
          orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
          include: {
            author: { select: { id: true, name: true, avatar: true } },
          },
        },
        judges: {
          include: {
            user: { select: { id: true, name: true, username: true, avatar: true, bio: true } },
          },
        },
        mentors: {
          include: {
            user: { select: { id: true, name: true, username: true, avatar: true, bio: true } },
          },
        },
        _count: {
          select: {
            registrations: true,
            teams: true,
            projects: true,
          },
        },
      },
    });

    if (!hackathon) {
      return apiError("Hackathon not found", "NOT_FOUND", 404);
    }

    let userRegistration = null;
    let userTeam = null;

    if (session) {
      userRegistration = await prisma.hackathonRegistration.findUnique({
        where: {
          userId_hackathonId: {
            userId: session.userId,
            hackathonId: hackathon.id,
          },
        },
      });

      const member = await prisma.teamMember.findFirst({
        where: {
          userId: session.userId,
          team: { hackathonId: hackathon.id },
        },
        include: {
          team: {
            include: {
              members: {
                include: { user: { select: { id: true, name: true, username: true, avatar: true, role: true } } },
              },
              projects: true,
            },
          },
        },
      });

      if (member) {
        userTeam = member.team;
      }
    }

    const computedStatus = computeHackathonStatus(hackathon);

    return apiSuccess({
      ...hackathon,
      computedStatus,
      registrationCount: hackathon._count.registrations,
      teamCount: hackathon._count.teams,
      projectCount: hackathon._count.projects,
      userRegistration,
      userTeam,
      isOrganizer: session ? session.userId === hackathon.organization.ownerId || session.role === "ADMIN" : false,
    });
  } catch (error: any) {
    console.error("Error fetching hackathon:", error);
    return apiError(error.message || "Failed to fetch hackathon", "INTERNAL_ERROR", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hackathon = await prisma.hackathon.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
    });

    if (!hackathon) {
      return apiError("Hackathon not found", "NOT_FOUND", 404);
    }

    const session = await requireHackathonOrganizer(req, hackathon.id);
    const body = await req.json();

    const updated = await prisma.hackathon.update({
      where: { id: hackathon.id },
      data: {
        title: body.title,
        shortDescription: body.shortDescription,
        description: body.description,
        theme: body.theme,
        mode: body.mode,
        location: body.location,
        logo: body.logo,
        banner: body.banner,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        registrationStart: body.registrationStart ? new Date(body.registrationStart) : undefined,
        registrationEnd: body.registrationEnd ? new Date(body.registrationEnd) : undefined,
        submissionDeadline: body.submissionDeadline ? new Date(body.submissionDeadline) : undefined,
        judgingStart: body.judgingStart ? new Date(body.judgingStart) : undefined,
        judgingEnd: body.judgingEnd ? new Date(body.judgingEnd) : undefined,
        minTeamSize: body.minTeamSize,
        maxTeamSize: body.maxTeamSize,
        eligibility: body.eligibility,
        rules: body.rules,
        requirements: body.requirements,
        status: body.status,
        isFeatured: body.isFeatured,
        isLeaderboardLive: body.isLeaderboardLive,
        isLeaderboardFrozen: body.isLeaderboardFrozen,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "HACKATHON_UPDATED",
        entity: "Hackathon",
        entityId: hackathon.id,
        detailsJson: JSON.stringify(body),
      },
    });

    return apiSuccess(updated, "Hackathon updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update hackathon", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hackathon = await prisma.hackathon.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
    });

    if (!hackathon) {
      return apiError("Hackathon not found", "NOT_FOUND", 404);
    }

    const session = await requireHackathonOrganizer(req, hackathon.id);

    await prisma.hackathon.delete({
      where: { id: hackathon.id },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "HACKATHON_DELETED",
        entity: "Hackathon",
        entityId: hackathon.id,
      },
    });

    return apiSuccess(null, "Hackathon deleted successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to delete hackathon", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
