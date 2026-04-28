import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getAllPostsAdmin, createPost } from "@/lib/db";
import { validateTextField, validateOrigin, safeErrorMessage } from "@/lib/validators";
import { stripHtml, sanitizeHtml } from "@/lib/sanitize";

async function auth() {
  return !!(await getAdminSession());
}

export async function GET() {
  if (!await auth()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await getAllPostsAdmin());
}

export async function POST(req: NextRequest) {
  if (!await auth()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!validateOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 2_000_000) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { title, slug, excerpt, content, type, featured, published, thumbnail_url, thumbnail_position, video_url, video_format } = body;

  const titleCheck = validateTextField(title, "title", { max: 300 });
  if (!titleCheck.valid) return NextResponse.json({ error: titleCheck.error }, { status: 400 });

  const slugCheck = validateTextField(slug, "slug", { max: 300 });
  if (!slugCheck.valid) return NextResponse.json({ error: slugCheck.error }, { status: 400 });

  const validTypes = ["article", "tutorial", "scouting", "document"];
  if (typeof type !== "string" || !validTypes.includes(type)) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }

  try {
    await createPost({
      title: stripHtml(String(title)),
      slug: stripHtml(String(slug)),
      excerpt: excerpt ? stripHtml(String(excerpt)).slice(0, 500) : "",
      content: content ? sanitizeHtml(String(content)) : "",
      type: type as "article" | "tutorial" | "scouting" | "document",
      featured: featured ? 1 : 0,
      published: published ? 1 : 0,
      thumbnail_url: thumbnail_url ? stripHtml(String(thumbnail_url)).slice(0, 1000) : "",
      thumbnail_position: thumbnail_position ? stripHtml(String(thumbnail_position)).slice(0, 50) : "50% 50%",
      video_url: video_url ? stripHtml(String(video_url)).slice(0, 1000) : "",
      video_format: video_format === "shorts" ? "shorts" : "regular",
    });
    revalidatePath("/articles");
    revalidatePath("/tutorials");
    revalidatePath("/scouting");
    revalidatePath("/eggrafa");
    revalidatePath("/admin/posts");
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: safeErrorMessage(e) }, { status: 500 });
  }
}
