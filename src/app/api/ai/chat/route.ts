import { NextRequest } from "next/server";
import { askRag, ChatMessage } from "@/lib/rag-engine";
import { apiError } from "@/lib/api-response";

export const runtime = "nodejs"; // required for LangChain (uses Node.js APIs)
export const maxDuration = 30;   // 30s timeout — enough for LLM round-trip

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body as {
      message: string;
      history?: ChatMessage[];
    };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return apiError("Message is required", "BAD_REQUEST", 400);
    }

    if (message.trim().length > 1000) {
      return apiError("Message is too long (max 1000 characters)", "BAD_REQUEST", 400);
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return apiError(
        "AI assistant is not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY in your .env file.",
        "NOT_CONFIGURED",
        503
      );
    }

    const answer = await askRag(message.trim(), history ?? []);

    return Response.json({ success: true, answer });
  } catch (error: any) {
    console.error("[AI Chat API] Error:", error);

    // Surface friendly error messages
    const isApiKeyError =
      error?.message?.includes("API_KEY") ||
      error?.message?.includes("GOOGLE_GENERATIVE_AI_API_KEY") ||
      error?.message?.includes("Not Found") ||
      error?.status === 401 ||
      error?.status === 403 ||
      error?.status === 404;

    if (isApiKeyError) {
      return apiError(
        "Invalid or unauthenticated Gemini API key. Please set a valid GOOGLE_GENERATIVE_AI_API_KEY in your .env file.",
        "INVALID_API_KEY",
        503
      );
    }

    return apiError(
      error?.message || "Failed to process AI request",
      "AI_ERROR",
      500
    );
  }
}
