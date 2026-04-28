import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { updateAdminCredentials, getAdminUsername } from "@/lib/db";
import { validatePassword, validateTextField, validateOrigin, safeErrorMessage } from "@/lib/validators";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const username = await getAdminUsername();
  return NextResponse.json({ username });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!validateOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 5_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { newUsername, newPassword } = body as Record<string, unknown>;

  const usernameCheck = validateTextField(newUsername, "Username", { min: 3, max: 50 });
  if (!usernameCheck.valid) {
    return NextResponse.json({ error: usernameCheck.error }, { status: 400 });
  }

  if (typeof newPassword !== "string" || !newPassword.trim()) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const passwordCheck = validatePassword(newPassword);
  if (!passwordCheck.valid) {
    return NextResponse.json({ error: passwordCheck.errors.join(". ") }, { status: 400 });
  }

  try {
    await updateAdminCredentials(String(newUsername).trim(), newPassword);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: safeErrorMessage(e) }, { status: 500 });
  }
}
