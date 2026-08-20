import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";

const createReportSchema = z.object({
  targetType: z.enum(["USER", "TEAM", "PROJECT", "HACKATHON", "COMMENT"]),
  targetId: z.string().min(1, "Target ID is required"),
  category: z.enum(["SPAM", "HARASSMENT", "PLAGIARISM", "INAPPROPRIATE_CONTENT", "FRAUD", "OTHER"]),
  description: z.string().min(10, "Please provide a detailed reason for your report"),
});

export async function GET(req: NextRequest) {
  try {
    requireRole(req, ["ADMIN"]);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status) where.status = status;

    const reports = await prisma.report.findMany({
      where,
      include: {
        reporter: { select: { id: true, name: true, username: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(reports);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch reports", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = requireAuth(req);
    const body = await req.json();
    const result = createReportSchema.safeParse(body);

    if (!result.success) {
      return apiError("Invalid report data", "VALIDATION_ERROR", 400);
    }

    const { targetType, targetId, category, description } = result.data;

    const report = await prisma.report.create({
      data: {
        reporterId: session.userId,
        targetType,
        targetId,
        category,
        description,
        status: "PENDING",
      },
    });

    return apiSuccess(report, "Report submitted successfully for admin review", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to submit report", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = requireRole(req, ["ADMIN"]);
    const { reportId, status, adminNotes } = await req.json();

    if (!reportId || !status) {
      return apiError("Missing reportId or status", "BAD_REQUEST", 400);
    }

    const report = await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "REPORT_STATUS_UPDATED",
        entity: "Report",
        entityId: reportId,
        detailsJson: JSON.stringify({ status, adminNotes }),
      },
    });

    return apiSuccess(report, "Report updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update report", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
