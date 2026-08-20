import { NextRequest } from "next/server";
import { isAfter } from "date-fns";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";
import { sendEmail, getSubmissionEmailHtml } from "@/lib/email";
import { calculateProjectScore } from "@/lib/scoring";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                    bio: true,
                    skills: true,
                    github: true,
                    linkedin: true,
                  },
                },
              },
            },
          },
        },
        hackathon: {
          include: {
            criteria: true,
            organization: { select: { id: true, name: true, logo: true } },
          },
        },
        scores: {
          include: {
            criteria: true,
            judge: { select: { id: true, name: true, avatar: true } },
          },
        },
        prizesWon: true,
      },
    });

    if (!project) {
      return apiError("Project not found", "NOT_FOUND", 404);
    }

    const { totalScore, judgeCount, criteriaBreakdown } = calculateProjectScore(
      project.scores,
      project.hackathon.criteria
    );

    return apiSuccess({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
      screenshots: project.screenshots ? JSON.parse(project.screenshots) : [],
      attachments: project.attachments ? JSON.parse(project.attachments) : [],
      calculatedScore: totalScore,
      judgeCount,
      criteriaBreakdown,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch project", "INTERNAL_ERROR", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = requireAuth(req);
    const body = await req.json();

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        team: { include: { members: true } },
        hackathon: true,
      },
    });

    if (!project) {
      return apiError("Project not found", "NOT_FOUND", 404);
    }

    // Verify user is team member or admin
    const isMember = project.team.members.some((m) => m.userId === session.userId);
    if (!isMember && session.role !== "ADMIN") {
      return apiError("Only team members can edit this project", "FORBIDDEN", 403);
    }

    // Check submission deadline if status is being updated to SUBMITTED
    if (body.status === "SUBMITTED" && project.status !== "SUBMITTED") {
      const now = new Date();
      if (isAfter(now, new Date(project.hackathon.submissionDeadline)) && session.role !== "ADMIN") {
        return apiError("The submission deadline for this hackathon has passed.", "DEADLINE_PASSED", 400);
      }
    }

    const updated = await prisma.project.update({
      where: { id: project.id },
      data: {
        title: body.title !== undefined ? body.title : project.title,
        tagline: body.tagline !== undefined ? body.tagline : project.tagline,
        description: body.description !== undefined ? body.description : project.description,
        problem: body.problem !== undefined ? body.problem : project.problem,
        solution: body.solution !== undefined ? body.solution : project.solution,
        technologies: body.technologies ? JSON.stringify(body.technologies) : project.technologies,
        repositoryUrl: body.repositoryUrl !== undefined ? body.repositoryUrl : project.repositoryUrl,
        demoUrl: body.demoUrl !== undefined ? body.demoUrl : project.demoUrl,
        videoUrl: body.videoUrl !== undefined ? body.videoUrl : project.videoUrl,
        presentationUrl: body.presentationUrl !== undefined ? body.presentationUrl : project.presentationUrl,
        screenshots: body.screenshots ? JSON.stringify(body.screenshots) : project.screenshots,
        status: body.status || project.status,
        submittedAt: body.status === "SUBMITTED" ? (project.submittedAt || new Date()) : project.submittedAt,
      },
      include: {
        team: {
          include: {
            members: {
              include: { user: true },
            },
          },
        },
        hackathon: true,
      },
    });

    // If successfully submitted, notify all team members and send emails
    if (body.status === "SUBMITTED" && project.status !== "SUBMITTED") {
      for (const m of updated.team.members) {
        await prisma.notification.create({
          data: {
            userId: m.userId,
            type: "SUBMISSION",
            title: "Project Submitted! 🚀",
            message: `"${updated.title}" was submitted for ${updated.hackathon.title}. Best of luck!`,
            link: `/hackathons/${updated.hackathon.slug}`,
          },
        });

        sendEmail({
          to: m.user.email,
          subject: `Project Submitted: ${updated.title}`,
          html: getSubmissionEmailHtml(updated.team.name, updated.title, updated.hackathon.title),
        }).catch(console.error);
      }
    }

    return apiSuccess(updated, "Project updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update project", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = requireAuth(req);
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { team: true },
    });

    if (!project) {
      return apiError("Project not found", "NOT_FOUND", 404);
    }

    if (project.team.ownerId !== session.userId && session.role !== "ADMIN") {
      return apiError("Only the team owner can delete this project", "FORBIDDEN", 403);
    }

    await prisma.project.delete({
      where: { id: project.id },
    });

    return apiSuccess(null, "Project deleted successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to delete project", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
