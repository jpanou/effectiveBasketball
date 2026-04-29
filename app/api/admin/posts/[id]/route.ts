import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { updatePost, deletePost } from "@/lib/db";
import { validateTextField, validateOrigin, safeErrorMessage } from "@/lib/validators";
import { stripHtml, sanitizeHtml } from "@/lib/sanitize";

async function auth() {
  return !!(await getAdminSession());
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await auth()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!validateOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 2_000_000) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { title, slug, excerpt, content, type, featured, published, thumbnail_url, thumbnail_position, video_url, video_format } = body;

  if (title !== undefined) {
    const check = validateTextField(title, "title", { max: 300 });
    if (!check.valid) return NextResponse.json({ error: check.error }, { status: 400 });
  }
  if (slug !== undefined) {
    const check = validateTextField(slug, "slug", { max: 300 });
    if (!check.valid) return NextResponse.json({ error: check.error }, { status: 400 });
  }

  try {
    await updatePost(numericId, {
      ...(title !== undefined && { title: stripHtml(String(title)) }),
      ...(slug !== undefined && { slug: stripHtml(String(slug)) }),
      ...(excerpt !== undefined && { excerpt: stripHtml(String(excerpt)).slice(0, 500) }),
      ...(content !== undefined && { content: sanitizeHtml(String(content)) }),
      ...(type !== undefined && { type: type as "article" | "tutorial" | "scouting" | "document" }),
      ...(featured !== undefined && { featured: featured ? 1 : 0 }),
      ...(published !== undefined && { published: published ? 1 : 0 }),
      ...(thumbnail_url !== undefined && { thumbnail_url: stripHtml(String(thumbnail_url)).slice(0, 1000) }),
      ...(thumbnail_position !== undefined && { thumbnail_position: stripHtml(String(thumbnail_position)).slice(0, 50) }),
      ...(video_url !== undefined && { video_url: stripHtml(String(video_url)).slice(0, 1000) }),
      ...(video_format !== undefined && { video_format: video_format === "shorts" ? "shorts" : "regular" }),
    });
  } catch (e) {
    return NextResponse.json({ error: safeErrorMessage(e) }, { status: 500 });
  }

  if (slug) {
    revalidatePath(`/articles/${slug}`);
    revalidatePath(`/tutorials/${slug}`);
    revalidatePath(`/scouting/${slug}`);
  }
  revalidatePath("/articles");
  revalidatePath("/tutorials");
  revalidatePath("/scouting");
  revalidatePath("/xrisima");
  revalidatePath("/admin/posts");
  revalidatePath("/");
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await auth()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!validateOrigin(_req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  try {
    await deletePost(numericId);
  } catch (e) {
    return NextResponse.json({ error: safeErrorMessage(e) }, { status: 500 });
  }

  revalidatePath("/articles");
  revalidatePath("/tutorials");
  revalidatePath("/scouting");
  revalidatePath("/xrisima");
  revalidatePath("/admin/posts");
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
