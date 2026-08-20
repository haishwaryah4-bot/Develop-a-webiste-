import { describe, it, expect } from "vitest";
import { calculateProjectScore, rankProjects } from "../src/lib/scoring";
import { computeHackathonStatus } from "../src/lib/dates";
import { generateVerificationCode } from "../src/lib/certificates";
import { validateFile } from "../src/lib/storage";
import { hashPassword, verifyPassword, signToken, verifyToken } from "../src/lib/auth";
import { addDays, subDays } from "date-fns";

describe("Scoring Engine", () => {
  const criteria = [
    { id: "c1", name: "Technical Depth", maxScore: 10, weight: 1.5 },
    { id: "c2", name: "Innovation", maxScore: 10, weight: 1.0 },
    { id: "c3", name: "Design / UX", maxScore: 10, weight: 0.5 },
  ];

  it("calculates weighted scores correctly for a single judge", () => {
    const scores = [
      { projectId: "p1", judgeId: "j1", criteriaId: "c1", score: 10 }, // 100% * 1.5 = 150
      { projectId: "p1", judgeId: "j1", criteriaId: "c2", score: 8 },  // 80% * 1.0 = 80
      { projectId: "p1", judgeId: "j1", criteriaId: "c3", score: 6 },  // 60% * 0.5 = 30
      // Total weighted = 260 / 3.0 = 86.67
    ];

    const result = calculateProjectScore(scores, criteria);
    expect(result.totalScore).toBe(86.67);
    expect(result.judgeCount).toBe(1);
    expect(result.criteriaBreakdown["c1"]).toBe(10);
    expect(result.criteriaBreakdown["c2"]).toBe(8);
  });

  it("calculates multi-judge average score correctly", () => {
    const scores = [
      // Judge 1: (10*1.5 + 10*1.0 + 10*0.5)/3 = 100
      { projectId: "p1", judgeId: "j1", criteriaId: "c1", score: 10 },
      { projectId: "p1", judgeId: "j1", criteriaId: "c2", score: 10 },
      { projectId: "p1", judgeId: "j1", criteriaId: "c3", score: 10 },
      // Judge 2: (8*1.5 + 8*1.0 + 8*0.5)/3 = 80
      { projectId: "p1", judgeId: "j2", criteriaId: "c1", score: 8 },
      { projectId: "p1", judgeId: "j2", criteriaId: "c2", score: 8 },
      { projectId: "p1", judgeId: "j2", criteriaId: "c3", score: 8 },
    ];

    const result = calculateProjectScore(scores, criteria);
    expect(result.totalScore).toBe(90.0);
    expect(result.judgeCount).toBe(2);
  });

  it("ranks projects descending by score", () => {
    const projects = [
      {
        id: "p1",
        title: "Lower score project",
        scores: [
          { projectId: "p1", judgeId: "j1", criteriaId: "c1", score: 5 },
          { projectId: "p1", judgeId: "j1", criteriaId: "c2", score: 5 },
          { projectId: "p1", judgeId: "j1", criteriaId: "c3", score: 5 },
        ],
      },
      {
        id: "p2",
        title: "Winning project",
        scores: [
          { projectId: "p2", judgeId: "j1", criteriaId: "c1", score: 10 },
          { projectId: "p2", judgeId: "j1", criteriaId: "c2", score: 10 },
          { projectId: "p2", judgeId: "j1", criteriaId: "c3", score: 10 },
        ],
      },
    ];

    const ranked = rankProjects(projects, criteria);
    expect(ranked[0].id).toBe("p2");
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].id).toBe("p1");
    expect(ranked[1].rank).toBe(2);
  });
});

describe("Date & Hackathon Status Automation", () => {
  const now = new Date();

  it("identifies REGISTRATION_OPEN correctly", () => {
    const status = computeHackathonStatus({
      status: "PUBLISHED",
      registrationStart: subDays(now, 5),
      registrationEnd: addDays(now, 5),
      startDate: addDays(now, 6),
      submissionDeadline: addDays(now, 10),
      judgingStart: addDays(now, 10),
      judgingEnd: addDays(now, 12),
      endDate: addDays(now, 12),
    });
    expect(status).toBe("REGISTRATION_OPEN");
  });

  it("identifies ACTIVE hacking status correctly", () => {
    const status = computeHackathonStatus({
      status: "PUBLISHED",
      registrationStart: subDays(now, 10),
      registrationEnd: subDays(now, 2),
      startDate: subDays(now, 1),
      submissionDeadline: addDays(now, 3),
      judgingStart: addDays(now, 3),
      judgingEnd: addDays(now, 5),
      endDate: addDays(now, 5),
    });
    expect(status).toBe("ACTIVE");
  });

  it("identifies JUDGING status correctly", () => {
    const status = computeHackathonStatus({
      status: "PUBLISHED",
      registrationStart: subDays(now, 15),
      registrationEnd: subDays(now, 8),
      startDate: subDays(now, 7),
      submissionDeadline: subDays(now, 1),
      judgingStart: subDays(now, 1),
      judgingEnd: addDays(now, 2),
      endDate: addDays(now, 2),
    });
    expect(status).toBe("JUDGING");
  });
});

describe("Certificate Generator", () => {
  it("generates formatted verification code", () => {
    const code = generateVerificationCode("user-123", "hack-456", "WINNER");
    expect(code).toMatch(/^HK-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/);
  });
});

describe("File Upload Validator", () => {
  it("allows valid image types under size limit", () => {
    const result = validateFile({
      name: "banner.png",
      type: "image/png",
      size: 2 * 1024 * 1024,
    });
    expect(result.valid).toBe(true);
  });

  it("rejects oversized files", () => {
    const result = validateFile({
      name: "huge.png",
      type: "image/png",
      size: 15 * 1024 * 1024,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("File size exceeds");
  });

  it("rejects unsupported MIME types", () => {
    const result = validateFile({
      name: "virus.exe",
      type: "application/x-msdownload",
      size: 1024,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Invalid file type");
  });
});

describe("Authentication & Password Cryptography", () => {
  it("hashes and verifies passwords accurately", async () => {
    const password = "SuperSecretPassword123!";
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);

    const valid = await verifyPassword(password, hash);
    expect(valid).toBe(true);

    const invalid = await verifyPassword("WrongPassword", hash);
    expect(invalid).toBe(false);
  });

  it("signs and verifies JWT tokens", () => {
    const payload = {
      userId: "u123",
      email: "hacker@hackathon.dev",
      username: "hacker1",
      role: "PARTICIPANT",
      name: "Kai Tanaka",
    };

    const token = signToken(payload);
    expect(typeof token).toBe("string");

    const decoded = verifyToken(token);
    expect(decoded?.userId).toBe("u123");
    expect(decoded?.email).toBe("hacker@hackathon.dev");
    expect(decoded?.role).toBe("PARTICIPANT");
  });
});
