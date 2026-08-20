import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    requireRole(req, ["ADMIN"]);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role");

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { username: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (role && role !== "ALL") {
      where.role = role;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            registrations: true,
            teamMemberships: true,
            certificates: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(users);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch users", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = requireRole(req, ["ADMIN"]);
    const { userId, role, isVerified } = await req.json();

    if (!userId) {
      return apiError("User ID is required", "BAD_REQUEST", 400);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        role: role !== undefined ? role : undefined,
        isVerified: isVerified !== undefined ? isVerified : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "USER_MODERATED",
        entity: "User",
        entityId: userId,
        detailsJson: JSON.stringify({ role, isVerified }),
      },
    });

    return apiSuccess(updated, "User updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update user", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
