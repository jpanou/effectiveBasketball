import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug, addRating } from "@/lib/db";
import { validateOrigin, safeErrorMessage } from "@/lib/validators";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!validateOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 1_000) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { score } = body as Record<string, unknown>;
  if (typeof score !== "number" || !Number.isInteger(score) || score < 1 || score > 5) {
    return NextResponse.json({ error: "invalid_score" }, { status: 400 });
  }

  const { slug } = await params;
  if (typeof slug !== "string" || slug.length > 300) {
    return NextResponse.json({ error: "invalid_slug" }, { status: 400 });
  }

  try {
    const post = await getPostBySlug(slug);
    if (!post) return NextResponse.json({ error: "not_found" }, { status: 404 });
    await addRating(post.id, score);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: safeErrorMessage(e) }, { status: 500 });
  }
}
