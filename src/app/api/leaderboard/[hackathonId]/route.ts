import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { requireHackathonOrganizer } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";
import { rankProjects } from "@/lib/scoring";

export async function GET(
  req: NextRequest,
  { params }: { params: { hackathonId: string } }
) {
  try {
    const session = getSessionFromRequest(req);
    const identifier = params.hackathonId;

    const hackathon = await prisma.hackathon.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        criteria: true,
        prizes: {
          include: {
            winnerProject: {
              select: { id: true, title: true, team: { select: { id: true, name: true } } },
            },
          },
        },
        organization: true,
      },
    });

    if (!hackathon) {
      return apiError("Hackathon not found", "NOT_FOUND", 404);
    }

    const isOrganizer = session ? session.userId === hackathon.organization.ownerId || session.role === "ADMIN" : false;

    // If leaderboard is hidden and user is not organizer, return hidden status
    if (!hackathon.isLeaderboardLive && !isOrganizer) {
      return apiSuccess({
        isHidden: true,
        hackathon: {
          id: hackathon.id,
          title: hackathon.title,
          slug: hackathon.slug,
        },
        message: "The live leaderboard is currently private while judging is underway.",
      });
    }

    // Fetch submitted projects with scores
    const projects = await prisma.project.findMany({
      where: {
        hackathonId: hackathon.id,
        status: "SUBMITTED",
      },
      include: {
        team: {
          include: {
            members: {
              include: { user: { select: { id: true, name: true, username: true, avatar: true } } },
            },
          },
        },
        scores: {
          include: {
            judge: { select: { id: true, name: true, avatar: true } },
            criteria: true,
          },
        },
        prizesWon: true,
      },
    });

    const ranked = rankProjects(projects, hackathon.criteria);

    const parsed = ranked.map((p) => ({
      id: p.id,
      rank: p.rank,
      title: p.title,
      tagline: p.tagline,
      finalScore: p.finalScore,
      judgeCount: p.judgeCount,
      team: p.team,
      technologies: p.technologies ? JSON.parse(p.technologies) : [],
      prizesWon: p.prizesWon,
      screenshots: p.screenshots ? JSON.parse(p.screenshots) : [],
    }));

    return apiSuccess({
      isHidden: false,
      hackathon: {
        id: hackathon.id,
        title: hackathon.title,
        slug: hackathon.slug,
        isLeaderboardLive: hackathon.isLeaderboardLive,
        isLeaderboardFrozen: hackathon.isLeaderboardFrozen,
        prizes: hackathon.prizes,
      },
      leaderboard: parsed,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch leaderboard", "INTERNAL_ERROR", 500);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { hackathonId: string } }
) {
  try {
    const hackathon = await prisma.hackathon.findFirst({
      where: { OR: [{ id: params.hackathonId }, { slug: params.hackathonId }] },
    });

    if (!hackathon) {
      return apiError("Hackathon not found", "NOT_FOUND", 404);
    }

    const session = await requireHackathonOrganizer(req, hackathon.id);
    const { prizeId, winnerProjectId } = await req.json();

    const updatedPrize = await prisma.prize.update({
      where: { id: prizeId },
      data: { winnerProjectId: winnerProjectId || null },
      include: { winnerProject: { include: { team: { include: { members: true } } } } },
    });

    // If winning project assigned, notify team
    if (winnerProjectId && updatedPrize.winnerProject) {
      for (const m of updatedPrize.winnerProject.team.members) {
        await prisma.notification.create({
          data: {
            userId: m.userId,
            type: "CERTIFICATE",
            title: `🏆 Winner Announcement: ${updatedPrize.title}!`,
            message: `Congratulations! Your project "${updatedPrize.winnerProject.title}" has been awarded "${updatedPrize.title}" (${updatedPrize.value}) in ${hackathon.title}!`,
            link: `/hackathons/${hackathon.slug}/leaderboard`,
          },
        });
      }
    }

    return apiSuccess(updatedPrize, "Prize awarded successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to assign prize", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
