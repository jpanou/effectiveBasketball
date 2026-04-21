import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/db";
import { signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!(await verifyAdmin(username, password))) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }
  const token = await signToken({ username });
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
