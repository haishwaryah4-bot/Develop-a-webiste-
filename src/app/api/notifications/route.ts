import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const session = requireAuth(req);

    const notifications = await prisma.notification.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.userId,
        readAt: null,
      },
    });

    return apiSuccess({
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch notifications", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = requireAuth(req);
    const body = await req.json().catch(() => ({}));
    const { notificationId, markAll } = body;

    if (markAll) {
      await prisma.notification.updateMany({
        where: {
          userId: session.userId,
          readAt: null,
        },
        data: {
          readAt: new Date(),
        },
      });
      return apiSuccess(null, "All notifications marked as read");
    }

    if (notificationId) {
      const updated = await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId: session.userId,
        },
        data: {
          readAt: new Date(),
        },
      });
      return apiSuccess(updated, "Notification marked as read");
    }

    return apiError("Missing notificationId or markAll flag", "BAD_REQUEST", 400);
  } catch (error: any) {
    return apiError(error.message || "Failed to update notification", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
