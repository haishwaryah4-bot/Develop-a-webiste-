import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
import { apiError, apiSuccess } from "@/lib/api-response";
import { validateFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    requireAuth(req);
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("No file provided", "BAD_REQUEST", 400);
    }

    const validation = validateFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      return apiError(validation.error || "Invalid file", "VALIDATION_ERROR", 400);
    }

    // Convert file to base64 Data URL or standard mock cloud asset URL
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    return apiSuccess(
      {
        url: base64,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      },
      "File uploaded successfully"
    );
  } catch (error: any) {
    return apiError(error.message || "Failed to upload file", error.code || "INTERNAL_ERROR", error.statusCode || 500);
  }
}
