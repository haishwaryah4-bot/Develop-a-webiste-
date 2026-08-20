import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = requireAuth(req);
    const { memberUserId } = await req.json();

    const team = await prisma.team.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
      include: { members: true },
    });

    if (!team) {
      return apiError("Team not found", "NOT_FOUND", 404);
    }

    const isOwner = team.ownerId === session.userId || session.role === "ADMIN";
    const targetUserId = memberUserId || session.userId; // If not provided, user is leaving themselves

    // If removing another member, must be owner
    if (targetUserId !== session.userId && !isOwner) {
      return apiError("Only the team owner can remove other team members", "FORBIDDEN", 403);
    }

    // Remove the member
    await prisma.teamMember.deleteMany({
      where: {
        teamId: team.id,
        userId: targetUserId,
      },
    });

    const remainingMembers = await prisma.teamMember.findMany({
      where: { teamId: team.id },
      orderBy: { joinedAt: "asc" },
    });

    // If owner leaves and other members exist, transfer ownership to the oldest member
    if (targetUserId === team.ownerId && remainingMembers.length > 0) {
      const nextOwner = remainingMembers[0];
      await prisma.$transaction([
        prisma.team.update({
          where: { id: team.id },
          data: { ownerId: nextOwner.userId },
        }),
        prisma.teamMember.update({
          where: { id: nextOwner.id },
          data: { role: "OWNER" },
        }),
      ]);
    } else if (remainingMembers.length === 0) {
      // Last member left, clean up team
      await prisma.team.delete({
        where: { id: team.id },
      });
    }

    return apiSuccess(null, targetUserId === session.userId ? "Left team successfully" : "Member removed successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to remove member", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
