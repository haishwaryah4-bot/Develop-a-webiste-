export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ALLOWED_DOC_TYPES = ["application/pdf"];
export const MAX_FILE_SIZE_MB = 10; // 10 MB max

export interface UploadValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: { type: string; size: number; name: string }): UploadValidationResult {
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.` };
  }

  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Supported types: JPG, PNG, WebP, GIF, PDF." };
  }

  return { valid: true };
}
