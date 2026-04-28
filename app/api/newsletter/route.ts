import { NextRequest, NextResponse } from "next/server";
import { subscribeNewsletter } from "@/lib/db";
import { validateEmail, validateOrigin } from "@/lib/validators";

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 5_000) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { email } = body as Record<string, unknown>;
  const emailCheck = validateEmail(email);
  if (!emailCheck.valid) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const result = await subscribeNewsletter(String(email).trim().toLowerCase());
  if (!result.success) {
    if (result.error === "already_subscribed") {
      return NextResponse.json({ error: "already_subscribed" }, { status: 409 });
    }
    return NextResponse.json({ error: "subscription_failed" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
