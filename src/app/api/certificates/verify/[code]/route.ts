import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";
import { formatCertificateTitle } from "@/lib/certificates";

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code.trim().toUpperCase();

    const cert = await prisma.certificate.findUnique({
      where: { verificationCode: code },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        hackathon: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                website: true,
              },
            },
          },
        },
      },
    });

    if (!cert) {
      return apiError("Certificate verification code not found or invalid", "NOT_FOUND", 404);
    }

    return apiSuccess({
      isValid: true,
      verificationCode: cert.verificationCode,
      certificateTitle: formatCertificateTitle(cert.type),
      type: cert.type,
      recipient: cert.user,
      hackathon: {
        id: cert.hackathon.id,
        title: cert.hackathon.title,
        slug: cert.hackathon.slug,
        theme: cert.hackathon.theme,
        startDate: cert.hackathon.startDate,
        endDate: cert.hackathon.endDate,
        organization: cert.hackathon.organization,
      },
      issuedAt: cert.issuedAt,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to verify certificate", "INTERNAL_ERROR", 500);
  }
}
