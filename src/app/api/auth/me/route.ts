import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return apiSuccess({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
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
        organizations: {
          select: { id: true, name: true, slug: true, logo: true },
        },
      },
    });

    if (!user) {
      return apiSuccess({ user: null });
    }

    return apiSuccess({
      user: {
        ...user,
        skills: user.skills ? JSON.parse(user.skills) : [],
      },
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch user session", "INTERNAL_ERROR", 500);
  }
}
