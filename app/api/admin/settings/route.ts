import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { updateAdminCredentials, getAdminUsername } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const username = await getAdminUsername();
  return NextResponse.json({ username });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { newUsername, newPassword } = await req.json();
  if (!newUsername?.trim() || !newPassword?.trim()) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  await updateAdminCredentials(newUsername.trim(), newPassword.trim());
  return NextResponse.json({ success: true });
}
