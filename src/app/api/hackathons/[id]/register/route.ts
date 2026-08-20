import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";
import { sendEmail, getRegistrationEmailHtml } from "@/lib/email";
import { computeHackathonStatus } from "@/lib/dates";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = requireAuth(req);
    const hackathon = await prisma.hackathon.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
    });

    if (!hackathon) {
      return apiError("Hackathon not found", "NOT_FOUND", 404);
    }

    // Check duplicate
    const existing = await prisma.hackathonRegistration.findUnique({
      where: {
        userId_hackathonId: {
          userId: session.userId,
          hackathonId: hackathon.id,
        },
      },
    });

    if (existing) {
      return apiError("You are already registered for this hackathon", "ALREADY_REGISTERED", 409);
    }

    // Check status
    const status = computeHackathonStatus(hackathon);
    if (status !== "REGISTRATION_OPEN" && status !== "ACTIVE" && session.role !== "ADMIN") {
      return apiError(`Registration is currently ${status.toLowerCase().replace("_", " ")}`, "REGISTRATION_CLOSED", 400);
    }

    const registration = await prisma.hackathonRegistration.create({
      data: {
        userId: session.userId,
        hackathonId: hackathon.id,
        status: "REGISTERED",
      },
    });

    // Create In-App Notification
    await prisma.notification.create({
      data: {
        userId: session.userId,
        type: "SYSTEM",
        title: "Registration Confirmed! 🎉",
        message: `You're officially registered for ${hackathon.title}. Join or create a team to get started.`,
        link: `/hackathons/${hackathon.slug}`,
      },
    });

    // Send confirmation email
    sendEmail({
      to: session.email,
      subject: `Registration Confirmed: ${hackathon.title}`,
      html: getRegistrationEmailHtml(session.name, hackathon.title),
    }).catch(console.error);

    return apiSuccess(registration, "Registered successfully for hackathon", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to register", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = requireAuth(req);
    const hackathon = await prisma.hackathon.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
    });

    if (!hackathon) {
      return apiError("Hackathon not found", "NOT_FOUND", 404);
    }

    await prisma.hackathonRegistration.deleteMany({
      where: {
        userId: session.userId,
        hackathonId: hackathon.id,
      },
    });

    return apiSuccess(null, "Registration cancelled successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to cancel registration", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
