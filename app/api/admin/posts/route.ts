import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getAllPostsAdmin, createPost } from "@/lib/db";

async function auth() {
  const session = await getAdminSession();
  return !!session;
}

export async function GET() {
  if (!await auth()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(getAllPostsAdmin());
}

export async function POST(req: NextRequest) {
  if (!await auth()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, slug, excerpt, content, type, featured, published, thumbnail_url, video_url } = body;
  if (!title || !slug || !type) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  try {
    createPost({ title, slug, excerpt: excerpt || "", content: content || "", type, featured: featured ? 1 : 0, published: published ? 1 : 0, thumbnail_url: thumbnail_url || "", video_url: video_url || "" });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
