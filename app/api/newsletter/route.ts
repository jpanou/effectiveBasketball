import { NextRequest, NextResponse } from "next/server";

const MAILERLITE_API = "https://connect.mailerlite.com/api";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const res = await fetch(`${MAILERLITE_API}/subscribers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ email, status: "active" }),
  });

  // 200 = updated existing subscriber, 201 = new subscriber
  if (res.status === 200 || res.status === 201) {
    return NextResponse.json({ ok: true });
  }

  // MailerLite v3 returns 200 for existing subscribers, but handle 409 just in case
  if (res.status === 409) {
    return NextResponse.json({ error: "already_subscribed" }, { status: 409 });
  }

  const body = await res.json().catch(() => ({}));
  console.error("MailerLite error", res.status, body);
  return NextResponse.json({ error: "mailerlite_error" }, { status: 502 });
}
