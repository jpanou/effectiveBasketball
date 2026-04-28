import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/db";
import { signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 10_000) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { username, password } = body as Record<string, unknown>;
  if (
    typeof username !== "string" || !username.trim() ||
    typeof password !== "string" || !password.trim()
  ) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const valid = await verifyAdmin(username.trim(), password);
  if (!valid) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const token = await signToken({ username: username.trim() });
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
