import crypto from "crypto";

export function generateVerificationCode(userId: string, hackathonId: string, type: string): string {
  const seed = `${userId}-${hackathonId}-${type}-${Date.now()}`;
  const hash = crypto.createHash("sha256").update(seed).digest("hex").toUpperCase();
  // Format as HACK-XXXX-XXXX-XXXX
  return `HK-${hash.substring(0, 4)}-${hash.substring(4, 8)}-${hash.substring(8, 12)}`;
}

export function formatCertificateTitle(type: string): string {
  switch (type) {
    case "WINNER":
      return "Certificate of Excellence - Champion";
    case "FINALIST":
      return "Certificate of Merit - Finalist";
    case "MENTOR":
      return "Certificate of Mentorship";
    case "JUDGE":
      return "Certificate of Appreciation - Judge";
    default:
      return "Certificate of Participation";
  }
}
