/**
 * RAG Engine — LangChain v0.3 + Google Gemini
 *
 * Singleton that:
 *  1. Loads static platform knowledge documents (FAQ, rules, guide)
 *  2. Fetches live hackathon / prize / schedule data from SQLite via Prisma
 *  3. Splits + embeds everything with GoogleGenerativeAIEmbeddings
 *  4. Stores vectors in a lightweight custom in-memory cosine store
 *  5. Exposes `askRag()` — a function that answers a question with RAG context
 */

import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import prisma from "@/lib/db";

// ── Minimal in-memory + cached cosine similarity vector store ──────────────

interface StoredDoc {
  doc: Document;
  embedding: number[];
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) + 1e-10);
}

function keywordScore(query: string, text: string): number {
  const queryTerms = query.toLowerCase().split(/\W+/).filter(t => t.length > 2);
  if (queryTerms.length === 0) return 0;
  const textLower = text.toLowerCase();
  let matches = 0;
  for (const term of queryTerms) {
    if (textLower.includes(term)) matches++;
  }
  return matches / queryTerms.length;
}

class SimpleMemoryVectorStore {
  private docs: StoredDoc[] = [];
  private cachePath = join(process.cwd(), ".rag_cache.json");

  async addDocuments(docs: Document[], embeddings: GoogleGenerativeAIEmbeddings) {
    let cache: Record<string, number[]> = {};
    if (existsSync(this.cachePath)) {
      try {
        cache = JSON.parse(readFileSync(this.cachePath, "utf-8"));
      } catch (e) {
        cache = {};
      }
    }

    const missingDocs: Document[] = [];
    const missingIndices: number[] = [];

    for (let i = 0; i < docs.length; i++) {
      const key = docs[i].pageContent.slice(0, 100) + "_" + docs[i].pageContent.length;
      if (cache[key]) {
        this.docs.push({ doc: docs[i], embedding: cache[key] });
      } else {
        missingDocs.push(docs[i]);
        missingIndices.push(i);
      }
    }

    if (missingDocs.length > 0) {
      console.log(`[RAG] Embedding ${missingDocs.length} new chunks...`);
      // Batch embedding
      const batchSize = 10;
      for (let i = 0; i < missingDocs.length; i += batchSize) {
        const batch = missingDocs.slice(i, i + batchSize);
        const vecs = await embeddings.embedDocuments(batch.map((d) => d.pageContent));
        for (let j = 0; j < batch.length; j++) {
          const doc = batch[j];
          const vec = vecs[j];
          this.docs.push({ doc, embedding: vec });
          const key = doc.pageContent.slice(0, 100) + "_" + doc.pageContent.length;
          cache[key] = vec;
        }
      }

      try {
        writeFileSync(this.cachePath, JSON.stringify(cache));
        console.log(`[RAG] Cached ${Object.keys(cache).length} vectors to disk ✓`);
      } catch (err: any) {
        console.warn("[RAG] Failed to write vector cache:", err.message);
      }
    } else {
      console.log(`[RAG] Loaded ${this.docs.length} vectors instantly from cache ⚡`);
    }
  }

  async similaritySearch(query: string, k: number, embeddings: GoogleGenerativeAIEmbeddings): Promise<Document[]> {
    const queryVec = await embeddings.embedQuery(query);
    return this.docs
      .map((stored) => {
        const cosSim = cosineSimilarity(queryVec, stored.embedding);
        const kwScore = keywordScore(query, stored.doc.pageContent);
        // Hybrid score: 80% vector similarity + 20% keyword match boost
        const hybridScore = cosSim * 0.8 + kwScore * 0.2;
        return { doc: stored.doc, score: hybridScore };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map((r) => r.doc);
  }
}

// ── Static Knowledge Documents ─────────────────────────────────────────────

const PLATFORM_DOCS: { content: string; source: string }[] = [
  {
    source: "platform-guide",
    content: `
HackForge Platform Guide
========================
HackForge is a full-stack hackathon hosting and discovery platform for developers, organizers, and enterprises.

Key Features:
- Discover and register for hackathons globally (online, offline, hybrid)
- Form teams or join existing teams using join codes
- Submit projects with GitHub links, demo URLs, video pitches
- Real-time leaderboards with live scoring
- Certificate generation for participants, winners, mentors, and judges
- Announcement feeds and event schedules per hackathon
- Sponsor profiles and prize listings

User Roles:
- PARTICIPANT: Can register for hackathons, form/join teams, submit projects
- ORGANIZER: Can create and manage hackathons, invite judges, set criteria
- JUDGE: Can score submitted projects based on judging criteria
- MENTOR: Can provide mentorship to teams during hackathons
- ADMIN: Full platform administration access

Dashboard: Users have a personal dashboard showing registered hackathons, team memberships, submitted projects, and certificates earned.
    `.trim(),
  },
  {
    source: "faq-registration",
    content: `
Registration & Teams FAQ
========================
Q: How do I register for a hackathon?
A: Browse hackathons on the Hackathons page. Click on a hackathon and hit "Register". Registration is free and instant.

Q: Can I register as an individual?
A: Yes. You can register individually and either create your own team or join one using a join code.

Q: What is the minimum/maximum team size?
A: Each hackathon defines its own min/max team size (common: 1–4 members). Check the hackathon details page.

Q: How do I join a team?
A: Navigate to Teams in your dashboard, click "Join Team", and enter the join code from the team owner.

Q: How do I create a team?
A: After registering for a hackathon, go to Teams and click "Create Team". You'll get a unique join code.

Q: Can I leave a team?
A: Yes. Go to your team page and use the "Leave Team" option. The team owner cannot leave but can transfer ownership.

Q: How do I invite someone?
A: As team owner, go to your team page and send an invitation via the member's username or email.
    `.trim(),
  },
  {
    source: "faq-submission",
    content: `
Project Submission FAQ
======================
Q: How do I submit a project?
A: Go to your team's project page, fill in title, tagline, description, problem, solution, tech stack, add links (GitHub, demo, video), and click "Submit".

Q: What is required for submission?
A: Required: Project title, tagline, and description. Recommended: GitHub repo, demo URL, video URL, and tech stack.

Q: Can I edit my project after submission?
A: Projects remain editable until the submission deadline. After the deadline, projects are locked for judging.

Q: Can multiple team members work on the project?
A: Any team member can edit the project, but it counts as a single submission for the whole team.
    `.trim(),
  },
  {
    source: "faq-judging",
    content: `
Judging & Scoring FAQ
=====================
Q: How are projects scored?
A: Judges score projects on criteria defined by the organizer (e.g., Innovation, Technical Complexity, Impact, Presentation). Each criterion has a max score and a weight.

Q: How is the final score calculated?
A: Final score = weighted average of all judges' scores across all criteria. The leaderboard is ranked by descending final score.

Q: Can I see my project's score?
A: Scores are visible after the judging phase ends and the leaderboard is unfrozen by the organizer.

Q: What is a frozen leaderboard?
A: Organizers can freeze the leaderboard during judging to prevent early reveals.
    `.trim(),
  },
  {
    source: "faq-prizes-certs",
    content: `
Certificates & Prizes FAQ
=========================
Q: Do I get a certificate for participating?
A: Yes! All registered participants who submit a project receive a digital participation certificate.

Q: What types of certificates are issued?
A: PARTICIPANT, WINNER, FINALIST, MENTOR, JUDGE — each with a unique public verification code.

Q: How do I download my certificate?
A: Go to your Profile > Certificates. Each certificate has a download and share button.

Q: How are prizes awarded?
A: Organizers define prizes per rank (1st, 2nd, 3rd) or by category (Best AI, Best Design). Winners are announced after judging.

Q: Are prizes given by HackForge?
A: No. Prizes are provided by hackathon organizers and their sponsors. HackForge facilitates the platform only.
    `.trim(),
  },
  {
    source: "organizer-guide",
    content: `
Organizer Guide
===============
Q: How do I create a hackathon?
A: You need ORGANIZER role. Go to Organizer Dashboard > Create Hackathon. Fill in title, dates, rules, and publish.

Q: What hackathon statuses exist?
A: DRAFT → PUBLISHED → REGISTRATION_OPEN → REGISTRATION_CLOSED → ACTIVE → JUDGING → COMPLETED → ARCHIVED

Q: How do I invite judges?
A: In Organizer Dashboard, open your hackathon > Judges > Invite Judge by email or username.

Q: How do I set judging criteria?
A: In Judging Criteria settings, add criteria with names, descriptions, max scores, and weights.

Q: How do I freeze/unfreeze the leaderboard?
A: Toggle "Freeze Leaderboard" in your hackathon settings.

Q: How do I award prizes?
A: After judging, go to Prizes and assign winning projects to each prize rank.
    `.trim(),
  },
  {
    source: "faq-account",
    content: `
Account & Profile FAQ
=====================
Q: How do I update my profile?
A: Go to Profile > Edit. You can update name, bio, location, skills, website, GitHub, and LinkedIn.

Q: What skills can I add?
A: Any technology or skill as free-form tags (e.g., React, Python, Machine Learning, UI/UX, Blockchain).

Q: How do notifications work?
A: You receive notifications for team invitations, judging results, announcements, and certificates. Check the bell icon in the navbar.

Q: How do I sign up?
A: Click "Get Started" or "Sign In" in the navbar. You can register with email and password.
    `.trim(),
  },
];

// ── Rulebook file loader ───────────────────────────────────────────────────

/**
 * Reads the rulex.txt rulebook from the AI-agent/data directory and converts
 * each logical section (separated by blank lines) into a Document chunk.
 */
function loadRulebookDocuments(): Document[] {
  const docs: Document[] = [];
  try {
    // Resolve relative to the project root (process.cwd() = c:\Users\haish\Hackathon)
    const filePath = join(process.cwd(), "AI-agent", "data", "rulex.txt");
    const raw = readFileSync(filePath, "utf-8");

    // Split on one or more blank lines to get logical paragraphs / sections
    const sections = raw
      .split(/\r?\n(?:\s*\r?\n)+/) // split on blank lines
      .map((s) => s.replace(/\r/g, "").trim())
      .filter((s) => s.length > 30); // skip very short fragments

    for (let i = 0; i < sections.length; i++) {
      docs.push(
        new Document({
          pageContent: sections[i],
          metadata: { source: "rulex.txt", section: i + 1 },
        })
      );
    }

    console.log(`[RAG] Loaded ${docs.length} sections from rulex.txt`);
  } catch (err: any) {
    console.error("[RAG] Could not load rulex.txt:", err.message);
    // Non-fatal — RAG continues without the rulebook
  }
  return docs;
}

// ── Live DB document loading ───────────────────────────────────────────────

async function loadLiveDbDocuments(): Promise<Document[]> {
  const docs: Document[] = [];
  try {
    const hackathons = await prisma.hackathon.findMany({
      where: {
        status: { in: ["PUBLISHED", "REGISTRATION_OPEN", "REGISTRATION_CLOSED", "ACTIVE", "JUDGING"] },
      },
      include: {
        prizes: { orderBy: { rank: "asc" } },
        scheduleEvents: { orderBy: { startTime: "asc" }, take: 10 },
        sponsors: true,
        _count: { select: { registrations: true, teams: true, projects: true } },
      },
      orderBy: { startDate: "asc" },
      take: 20,
    });

    for (const h of hackathons) {
      const prizeSummary = h.prizes.map((p) => `  • ${p.title}: ${p.value}`).join("\n");
      const scheduleSummary = h.scheduleEvents
        .slice(0, 5)
        .map(
          (e) =>
            `  • [${e.type}] ${e.title} — ${new Date(e.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
        )
        .join("\n");
      const sponsorSummary = h.sponsors.map((s) => `${s.name} (${s.tier})`).join(", ");

      docs.push(
        new Document({
          pageContent: `
Hackathon: ${h.title}
Status: ${h.status}
Theme: ${h.theme}
Mode: ${h.mode}${h.location ? ` — ${h.location}` : ""}
Description: ${h.shortDescription}
Start: ${new Date(h.startDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
End: ${new Date(h.endDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
Registration Deadline: ${new Date(h.registrationEnd).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
Submission Deadline: ${new Date(h.submissionDeadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
Team Size: ${h.minTeamSize}–${h.maxTeamSize} members
Registrations: ${h._count.registrations} | Teams: ${h._count.teams} | Projects: ${h._count.projects}
${h.eligibility ? `Eligibility: ${h.eligibility}` : ""}
${h.rules ? `Rules: ${h.rules.substring(0, 300)}` : ""}
${prizeSummary ? `Prizes:\n${prizeSummary}` : "No prizes defined yet"}
${sponsorSummary ? `Sponsors: ${sponsorSummary}` : ""}
${scheduleSummary ? `Upcoming Schedule:\n${scheduleSummary}` : ""}
          `.trim(),
          metadata: { source: `hackathon-${h.slug}`, status: h.status },
        })
      );
    }

    // Completed hackathons
    const completed = await prisma.hackathon.findMany({
      where: { status: { in: ["COMPLETED", "ARCHIVED"] } },
      select: { title: true, theme: true, endDate: true, _count: { select: { registrations: true, projects: true } } },
      orderBy: { endDate: "desc" },
      take: 5,
    });

    if (completed.length > 0) {
      docs.push(
        new Document({
          pageContent: `Past Hackathons on HackForge:\n${completed
            .map(
              (h) =>
                `  • ${h.title} (${h.theme}) — Ended ${new Date(h.endDate).toLocaleDateString()} — ${h._count.registrations} participants, ${h._count.projects} projects`
            )
            .join("\n")}`,
          metadata: { source: "past-hackathons" },
        })
      );
    }
  } catch (err) {
    console.error("[RAG] Failed to load live DB documents:", err);
  }
  return docs;
}

// ── Singleton state ────────────────────────────────────────────────────────

interface RagState {
  vectorStore: SimpleMemoryVectorStore;
  embeddings: GoogleGenerativeAIEmbeddings;
  llm: ChatGoogleGenerativeAI;
}

let ragState: RagState | null = null;
let initPromise: Promise<void> | null = null;

async function initRagEngine(): Promise<void> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set in .env");
  }

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey,
    model: "gemini-embedding-001",
  });

  const llm = new ChatGoogleGenerativeAI({
    apiKey,
    model: "gemini-3.6-flash",
    temperature: 0.4,
    maxOutputTokens: 1024,
  });

  // Build documents
  const staticDocs = PLATFORM_DOCS.map(
    (d) => new Document({ pageContent: d.content, metadata: { source: d.source } })
  );
  const rulebookDocs = loadRulebookDocuments();
  const liveDocs = await loadLiveDbDocuments();
  const allDocs = [...staticDocs, ...rulebookDocs, ...liveDocs];

  // Split large chunks
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1200, chunkOverlap: 150 });
  const splitDocs = await splitter.splitDocuments(allDocs);

  console.log(`[RAG] Indexing ${splitDocs.length} chunks (${rulebookDocs.length} rulebook + ${liveDocs.length} live DB docs)`);

  // Build vector store
  const vectorStore = new SimpleMemoryVectorStore();
  await vectorStore.addDocuments(splitDocs, embeddings);

  ragState = { vectorStore, embeddings, llm };
  console.log("[RAG] Engine ready ✓");
}

// ── Public ask function ────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function askRag(question: string, history: ChatMessage[] = []): Promise<string> {
  // Lazy init
  if (!initPromise) {
    initPromise = initRagEngine().catch((err) => {
      initPromise = null; // allow retry
      throw err;
    });
  }
  await initPromise;

  const { vectorStore, embeddings, llm } = ragState!;

  // Retrieve relevant documents (top 3 for maximum speed)
  const relevantDocs = await vectorStore.similaritySearch(question, 3, embeddings);
  const context = relevantDocs
    .map((d) => `[${d.metadata.source}]\n${d.pageContent}`)
    .join("\n\n---\n\n");

  // Format conversation history
  const historyText =
    history.length > 0
      ? history
          .slice(-6) // last 3 turns
          .map((m) => `${m.role === "user" ? "User" : "HackBot"}: ${m.content}`)
          .join("\n")
      : "No prior conversation.";

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are HackBot, a friendly and knowledgeable AI assistant for HackForge — a premier hackathon discovery and hosting platform.

Help users with: finding hackathons, registration, teams, project submission, judging, certificates, and prizes.
You also have access to the official Innovate AI Hackathon rulebook (rulex.txt) — use it to answer any rules, logistics, judging, or prize questions about that event specifically.

RULES:
- Use ONLY the context below to answer. If the answer isn't in the context, say so honestly.
- Keep responses concise, friendly, and action-oriented.
- Use bullet points for lists.
- Highlight important deadlines or details in **bold**.
- Never make up hackathon names, dates, or prizes.
- When citing a specific rule, mention the section number (e.g., "per Section 3.6") so users can verify.

Context from knowledge base:
{context}

Recent conversation:
{history}`,
    ],
    ["human", "{question}"],
  ]);

  const chain = RunnableSequence.from([prompt, llm, new StringOutputParser()]);

  const answer = await chain.invoke({ context, history: historyText, question });
  return answer;
}

/** Invalidates the RAG singleton so the next call re-seeds from DB. */
export function invalidateRagEngine() {
  ragState = null;
  initPromise = null;
}
