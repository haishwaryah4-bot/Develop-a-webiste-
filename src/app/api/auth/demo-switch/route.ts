import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();
    if (!role) {
      return apiError("Role is required", "BAD_REQUEST", 400);
    }

    // Find the first user in the database with this role
    let user = await prisma.user.findFirst({
      where: { role: role.toUpperCase() },
    });

    // If no user exists yet, pick any or first
    if (!user) {
      user = await prisma.user.findFirst();
    }

    if (!user) {
      return apiError("No users found in database. Please seed the database first.", "NOT_FOUND", 404);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      name: user.name,
      avatar: user.avatar,
    });

    const response = apiSuccess(
      {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      `Switched session to demo ${user.role} (${user.name})`
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return apiError(error.message || "Failed to switch demo account", "INTERNAL_ERROR", 500);
  }
}
