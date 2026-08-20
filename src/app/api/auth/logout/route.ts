import { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { apiSuccess } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  const response = apiSuccess(null, "Logged out successfully");
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
