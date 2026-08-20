import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { hashPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { sendEmail, getWelcomeEmailHtml } from "@/lib/email";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain alphanumeric characters, underscores, and hyphens"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["PARTICIPANT", "ORGANIZER", "JUDGE", "MENTOR"]).optional(),
  skills: z.array(z.string()).optional(),
  bio: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const fields: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fields[err.path[0].toString()] = err.message;
      });
      return apiError("Validation failed", "VALIDATION_ERROR", 400, fields);
    }

    const { name, username, email, password, role, skills, bio } = result.data;

    // Check if email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
      },
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        return apiError("An account with this email already exists", "EMAIL_EXISTS", 409);
      }
      return apiError("This username is already taken", "USERNAME_EXISTS", 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        passwordHash,
        role: role || "PARTICIPANT",
        skills: skills ? JSON.stringify(skills) : JSON.stringify(["JavaScript", "React"]),
        bio: bio || "Hackathon enthusiast and builder.",
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      },
    });

    // Create a default organization if role is ORGANIZER
    if (user.role === "ORGANIZER") {
      await prisma.organization.create({
        data: {
          name: `${user.name}'s Org`,
          slug: `${user.username}-org`,
          description: "Innovation and Hackathon Organizer",
          ownerId: user.id,
        },
      });
    }

    // Send welcome email asynchronously
    sendEmail({
      to: user.email,
      subject: "Welcome to Hackathon Platform!",
      html: getWelcomeEmailHtml(user.name),
    }).catch(console.error);

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
      "Registration successful",
      201
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return apiError(error.message || "Failed to register user", "INTERNAL_ERROR", 500);
  }
}
