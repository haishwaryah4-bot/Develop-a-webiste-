import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username.toLowerCase();

    const user = await prisma.user.findFirst({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        location: true,
        website: true,
        github: true,
        linkedin: true,
        skills: true,
        role: true,
        createdAt: true,
        registrations: {
          include: {
            hackathon: {
              select: { id: true, title: true, slug: true, banner: true, theme: true, status: true, startDate: true, endDate: true },
            },
          },
        },
        teamMemberships: {
          include: {
            team: {
              include: {
                hackathon: { select: { id: true, title: true, slug: true } },
                projects: {
                  include: {
                    prizesWon: true,
                  },
                },
              },
            },
          },
        },
        certificates: {
          include: {
            hackathon: { select: { id: true, title: true, slug: true } },
          },
        },
      },
    });

    if (!user) {
      return apiError("User profile not found", "NOT_FOUND", 404);
    }

    return apiSuccess({
      ...user,
      skills: user.skills ? JSON.parse(user.skills) : [],
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch user profile", "INTERNAL_ERROR", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = requireAuth(req);
    const body = await req.json();

    const user = await prisma.user.findFirst({
      where: { username: params.username.toLowerCase() },
    });

    if (!user) {
      return apiError("User not found", "NOT_FOUND", 404);
    }

    if (user.id !== session.userId && session.role !== "ADMIN") {
      return apiError("You can only edit your own profile", "FORBIDDEN", 403);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name !== undefined ? body.name : user.name,
        bio: body.bio !== undefined ? body.bio : user.bio,
        location: body.location !== undefined ? body.location : user.location,
        website: body.website !== undefined ? body.website : user.website,
        github: body.github !== undefined ? body.github : user.github,
        linkedin: body.linkedin !== undefined ? body.linkedin : user.linkedin,
        avatar: body.avatar !== undefined ? body.avatar : user.avatar,
        skills: body.skills ? JSON.stringify(body.skills) : user.skills,
      },
    });

    return apiSuccess({
      ...updated,
      skills: updated.skills ? JSON.parse(updated.skills) : [],
    }, "Profile updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update profile", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
