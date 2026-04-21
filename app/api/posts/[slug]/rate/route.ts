import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug, addRating } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { score } = await req.json();
  if (!score || score < 1 || score > 5) {
    return NextResponse.json({ error: "invalid_score" }, { status: 400 });
  }
  const post = getPostBySlug(slug);
  if (!post) return NextResponse.json({ error: "not_found" }, { status: 404 });
  addRating(post.id, score);
  return NextResponse.json({ success: true });
}
