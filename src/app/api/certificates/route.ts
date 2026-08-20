import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAuth, requireHackathonOrganizer } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";
import { generateVerificationCode } from "@/lib/certificates";

const issueCertificatesSchema = z.object({
  hackathonId: z.string().min(1, "Hackathon ID is required"),
  type: z.enum(["PARTICIPANT", "WINNER", "FINALIST", "MENTOR", "JUDGE"]).default("PARTICIPANT"),
  userIds: z.array(z.string()).optional(), // If empty, issues to all eligible
});

export async function GET(req: NextRequest) {
  try {
    const session = requireAuth(req);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || session.userId;

    const certificates = await prisma.certificate.findMany({
      where: { userId },
      include: {
        hackathon: {
          include: {
            organization: { select: { id: true, name: true, logo: true } },
          },
        },
        user: { select: { id: true, name: true, username: true, avatar: true } },
      },
      orderBy: { issuedAt: "desc" },
    });

    return apiSuccess(certificates);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch certificates", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = issueCertificatesSchema.safeParse(body);

    if (!result.success) {
      return apiError("Invalid certificate issue request", "VALIDATION_ERROR", 400);
    }

    const { hackathonId, type, userIds } = result.data;
    const session = await requireHackathonOrganizer(req, hackathonId);

    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });

    if (!hackathon) {
      return apiError("Hackathon not found", "NOT_FOUND", 404);
    }

    let targetUserIds: string[] = userIds || [];

    if (!targetUserIds.length) {
      if (type === "PARTICIPANT") {
        const registrations = await prisma.hackathonRegistration.findMany({
          where: { hackathonId },
          select: { userId: true },
        });
        targetUserIds = registrations.map((r) => r.userId);
      } else if (type === "WINNER") {
        const prizes = await prisma.prize.findMany({
          where: { hackathonId, winnerProjectId: { not: null } },
          include: { winnerProject: { include: { team: { include: { members: true } } } } },
        });
        const winUsers = new Set<string>();
        prizes.forEach((p) => {
          p.winnerProject?.team.members.forEach((m) => winUsers.add(m.userId));
        });
        targetUserIds = Array.from(winUsers);
      } else if (type === "JUDGE") {
        const judges = await prisma.judge.findMany({
          where: { hackathonId },
          select: { userId: true },
        });
        targetUserIds = judges.map((j) => j.userId);
      } else if (type === "MENTOR") {
        const mentors = await prisma.mentor.findMany({
          where: { hackathonId },
          select: { userId: true },
        });
        targetUserIds = mentors.map((m) => m.userId);
      }
    }

    if (!targetUserIds.length) {
      return apiError("No eligible recipients found to issue certificates", "NO_RECIPIENTS", 400);
    }

    const createdCertificates = [];

    for (const uId of targetUserIds) {
      // Check existing certificate of same type
      const existing = await prisma.certificate.findFirst({
        where: { userId: uId, hackathonId, type },
      });

      if (!existing) {
        const verificationCode = generateVerificationCode(uId, hackathonId, type);
        const cert = await prisma.certificate.create({
          data: {
            userId: uId,
            hackathonId,
            type,
            verificationCode,
          },
          include: {
            user: { select: { id: true, name: true } },
          },
        });

        createdCertificates.push(cert);

        // Notify user
        await prisma.notification.create({
          data: {
            userId: uId,
            type: "CERTIFICATE",
            title: `📜 Certificate Issued!`,
            message: `Your ${type.toLowerCase()} certificate for ${hackathon.title} is now available in your dashboard.`,
            link: `/certificates/verify/${verificationCode}`,
          },
        });
      }
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "CERTIFICATES_ISSUED",
        entity: "Certificate",
        entityId: hackathonId,
        detailsJson: JSON.stringify({ type, count: createdCertificates.length }),
      },
    });

    return apiSuccess(
      { issuedCount: createdCertificates.length, certificates: createdCertificates },
      `Successfully issued ${createdCertificates.length} certificates`,
      201
    );
  } catch (error: any) {
    return apiError(error.message || "Failed to issue certificates", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
