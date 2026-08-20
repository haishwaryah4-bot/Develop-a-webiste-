import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireHackathonOrganizer } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";

const announcementSchema = z.object({
  hackathonId: z.string().min(1, "Hackathon ID is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(5, "Content is required"),
  isPinned: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hackathonId = searchParams.get("hackathonId");

    const where: any = {};
    if (hackathonId) where.hackathonId = hackathonId;

    const announcements = await prisma.announcement.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        hackathon: { select: { id: true, title: true, slug: true } },
      },
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
    });

    return apiSuccess(announcements);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch announcements", "INTERNAL_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = announcementSchema.safeParse(body);

    if (!result.success) {
      return apiError("Invalid announcement data", "VALIDATION_ERROR", 400);
    }

    const { hackathonId, title, content, isPinned } = result.data;
    const session = await requireHackathonOrganizer(req, hackathonId);

    const announcement = await prisma.announcement.create({
      data: {
        hackathonId,
        authorId: session.userId,
        title,
        content,
        isPinned,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        hackathon: { select: { id: true, title: true, slug: true } },
      },
    });

    // Notify all registered participants in background
    const registrations = await prisma.hackathonRegistration.findMany({
      where: { hackathonId },
      select: { userId: true },
    });

    if (registrations.length > 0) {
      await prisma.notification.createMany({
        data: registrations.map((r) => ({
          userId: r.userId,
          type: "ANNOUNCEMENT",
          title: `📢 Announcement: ${title}`,
          message: content.length > 120 ? `${content.substring(0, 117)}...` : content,
          link: `/hackathons/${announcement.hackathon.slug}`,
        })),
      });
    }

    return apiSuccess(announcement, "Announcement broadcasted successfully", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to post announcement", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
