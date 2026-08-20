import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { requireAuth, requireRole } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";
import { computeHackathonStatus } from "@/lib/dates";

const hackathonCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must be lower-case alphanumeric and hyphens only"),
  shortDescription: z.string().min(10, "Short description is required"),
  description: z.string().min(20, "Full description is required"),
  theme: z.string().default("General"),
  mode: z.enum(["ONLINE", "OFFLINE", "HYBRID"]).default("ONLINE"),
  location: z.string().optional(),
  logo: z.string().optional(),
  banner: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  registrationStart: z.string(),
  registrationEnd: z.string(),
  submissionDeadline: z.string(),
  judgingStart: z.string(),
  judgingEnd: z.string(),
  minTeamSize: z.number().min(1).default(1),
  maxTeamSize: z.number().min(1).default(4),
  eligibility: z.string().optional(),
  rules: z.string().optional(),
  requirements: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  prizes: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      value: z.string(),
      rank: z.number().default(1),
    })
  ).optional(),
  criteria: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      maxScore: z.number().default(10),
      weight: z.number().default(1.0),
    })
  ).optional(),
  sponsors: z.array(
    z.object({
      name: z.string(),
      logo: z.string().optional(),
      website: z.string().optional(),
      tier: z.string().default("GOLD"),
    })
  ).optional(),
  schedule: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      location: z.string().optional(),
      startTime: z.string(),
      endTime: z.string(),
      type: z.string().default("WORKSHOP"),
    })
  ).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const theme = searchParams.get("theme");
    const mode = searchParams.get("mode");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const orgId = searchParams.get("organizationId");
    const sort = searchParams.get("sort") || "featured";

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
        { theme: { contains: search } },
      ];
    }

    if (theme && theme !== "ALL") {
      where.theme = theme;
    }

    if (mode && mode !== "ALL") {
      where.mode = mode;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (orgId) {
      where.organizationId = orgId;
    }

    // Determine ordering
    let orderBy: any = { createdAt: "desc" };
    if (sort === "deadline_asc") {
      orderBy = { submissionDeadline: "asc" };
    } else if (sort === "start_asc") {
      orderBy = { startDate: "asc" };
    } else if (sort === "featured") {
      orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];
    }

    const hackathons = await prisma.hackathon.findMany({
      where,
      orderBy,
      include: {
        organization: {
          select: { id: true, name: true, slug: true, logo: true },
        },
        prizes: true,
        _count: {
          select: {
            registrations: true,
            teams: true,
            projects: true,
          },
        },
      },
    });

    // Compute live status dynamically
    const enriched = hackathons.map((h) => {
      const computedStatus = computeHackathonStatus(h);
      return {
        ...h,
        computedStatus,
        registrationCount: h._count.registrations,
        teamCount: h._count.teams,
        projectCount: h._count.projects,
      };
    });

    // Optional status filter after computation if needed
    const filtered = status && status !== "ALL"
      ? enriched.filter((h) => h.computedStatus === status || h.status === status)
      : enriched;

    return apiSuccess(filtered);
  } catch (error: any) {
    console.error("Fetch hackathons error:", error);
    return apiError(error.message || "Failed to fetch hackathons", "INTERNAL_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = requireRole(req, ["ORGANIZER", "ADMIN"]);
    const body = await req.json();
    const result = hackathonCreateSchema.safeParse(body);

    if (!result.success) {
      const fields: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fields[err.path[0].toString()] = err.message;
      });
      return apiError("Validation failed", "VALIDATION_ERROR", 400, fields);
    }

    const data = result.data;

    // Check slug uniqueness
    const existingSlug = await prisma.hackathon.findUnique({
      where: { slug: data.slug },
    });
    if (existingSlug) {
      return apiError("A hackathon with this slug already exists. Please choose a unique slug.", "SLUG_EXISTS", 409);
    }

    // Get or create user's organization
    let org = await prisma.organization.findFirst({
      where: { ownerId: session.userId },
    });

    if (!org) {
      org = await prisma.organization.create({
        data: {
          name: `${session.name}'s Organization`,
          slug: `${session.username}-org`,
          ownerId: session.userId,
        },
      });
    }

    // Create hackathon with nested relational models in one transaction
    const hackathon = await prisma.hackathon.create({
      data: {
        organizationId: org.id,
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        theme: data.theme,
        mode: data.mode,
        location: data.location || (data.mode === "ONLINE" ? "Global Virtual" : "In-Person"),
        logo: data.logo || `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200&auto=format&fit=crop&q=60`,
        banner: data.banner || `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80`,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        registrationStart: new Date(data.registrationStart),
        registrationEnd: new Date(data.registrationEnd),
        submissionDeadline: new Date(data.submissionDeadline),
        judgingStart: new Date(data.judgingStart),
        judgingEnd: new Date(data.judgingEnd),
        minTeamSize: data.minTeamSize,
        maxTeamSize: data.maxTeamSize,
        eligibility: data.eligibility || "Open to all developers, designers, and innovators worldwide.",
        rules: data.rules || "All code must be written during the event. Open source libraries are permitted.",
        requirements: data.requirements || "Submit a GitHub repository, live demo link, and a 2-minute video overview.",
        status: data.status,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        prizes: data.prizes?.length
          ? {
              create: data.prizes.map((p) => ({
                title: p.title,
                description: p.description || "",
                value: p.value,
                rank: p.rank,
              })),
            }
          : {
              create: [
                { title: "Grand Prize - 1st Place", value: "$10,000", rank: 1 },
                { title: "Runner Up - 2nd Place", value: "$5,000", rank: 2 },
                { title: "Best AI Innovation", value: "$2,500", rank: 3 },
              ],
            },
        criteria: data.criteria?.length
          ? {
              create: data.criteria.map((c) => ({
                name: c.name,
                description: c.description || "",
                maxScore: c.maxScore || 10,
                weight: c.weight || 1.0,
              })),
            }
          : {
              create: [
                { name: "Innovation & Originality", description: "How unique and creative is the solution?", maxScore: 10, weight: 1.2 },
                { name: "Technical Execution", description: "Quality of code, architecture, and technology depth.", maxScore: 10, weight: 1.0 },
                { name: "Impact & Feasibility", description: "Real-world applicability and market potential.", maxScore: 10, weight: 1.0 },
                { name: "UI/UX & Design", description: "Polish, aesthetics, and user experience.", maxScore: 10, weight: 0.8 },
              ],
            },
        sponsors: data.sponsors?.length
          ? {
              create: data.sponsors.map((s) => ({
                name: s.name,
                logo: s.logo,
                website: s.website,
                tier: s.tier,
              })),
            }
          : undefined,
        scheduleEvents: data.schedule?.length
          ? {
              create: data.schedule.map((sc) => ({
                title: sc.title,
                description: sc.description,
                location: sc.location,
                startTime: new Date(sc.startTime),
                endTime: new Date(sc.endTime),
                type: sc.type,
              })),
            }
          : undefined,
      },
      include: {
        prizes: true,
        criteria: true,
        sponsors: true,
        scheduleEvents: true,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "HACKATHON_CREATED",
        entity: "Hackathon",
        entityId: hackathon.id,
        detailsJson: JSON.stringify({ title: hackathon.title, slug: hackathon.slug }),
      },
    });

    return apiSuccess(hackathon, "Hackathon created successfully", 201);
  } catch (error: any) {
    console.error("Hackathon creation error:", error);
    return apiError(error.message || "Failed to create hackathon", "INTERNAL_ERROR", 500);
  }
}
