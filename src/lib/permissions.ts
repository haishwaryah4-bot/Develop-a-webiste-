import { NextRequest } from "next/server";
import { getSessionFromRequest, JwtPayload } from "./auth";
import prisma from "./db";

export class AuthError extends Error {
  statusCode: number;
  code: string;
  constructor(message: string, statusCode = 401, code = "UNAUTHORIZED") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function requireAuth(req: NextRequest): JwtPayload {
  const session = getSessionFromRequest(req);
  if (!session) {
    throw new AuthError("Authentication required to access this resource", 401, "UNAUTHORIZED");
  }
  return session;
}

export function requireRole(req: NextRequest, allowedRoles: string[]): JwtPayload {
  const session = requireAuth(req);
  if (!allowedRoles.includes(session.role) && session.role !== "ADMIN") {
    throw new AuthError("You do not have the required permissions for this action", 403, "FORBIDDEN");
  }
  return session;
}

export async function requireHackathonOrganizer(req: NextRequest, hackathonId: string): Promise<JwtPayload> {
  const session = requireAuth(req);
  if (session.role === "ADMIN") return session;

  const hackathon = await prisma.hackathon.findUnique({
    where: { id: hackathonId },
    include: { organization: true },
  });

  if (!hackathon) {
    throw new AuthError("Hackathon not found", 404, "NOT_FOUND");
  }

  if (hackathon.organization.ownerId !== session.userId) {
    throw new AuthError("Only the organizer of this hackathon can perform this action", 403, "FORBIDDEN");
  }

  return session;
}

export async function requireJudgeAssignment(req: NextRequest, hackathonId: string): Promise<JwtPayload> {
  const session = requireAuth(req);
  if (session.role === "ADMIN") return session;

  const judge = await prisma.judge.findUnique({
    where: {
      userId_hackathonId: {
        userId: session.userId,
        hackathonId,
      },
    },
  });

  if (!judge) {
    // Also allow organizer to judge
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      include: { organization: true },
    });
    if (hackathon && hackathon.organization.ownerId === session.userId) {
      return session;
    }
    throw new AuthError("You are not assigned as a judge for this hackathon", 403, "FORBIDDEN");
  }

  return session;
}
