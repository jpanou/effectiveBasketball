import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { updatePost, deletePost } from "@/lib/db";

async function auth() {
  const session = await getAdminSession();
  return !!session;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await auth()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { title, slug, excerpt, content, type, featured, published, thumbnail_url, thumbnail_position, video_url, video_format } = body;

  try {
    await updatePost(Number(id), {
      title,
      slug,
      excerpt: excerpt ?? "",
      content: content ?? "",
      type,
      featured: featured ? 1 : 0,
      published: published ? 1 : 0,
      thumbnail_url: thumbnail_url ?? "",
      thumbnail_position: thumbnail_position ?? "50% 50%",
      video_url: video_url ?? "",
      video_format: video_format === "shorts" ? "shorts" : "regular",
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  if (slug) {
    revalidatePath(`/articles/${slug}`);
    revalidatePath(`/tutorials/${slug}`);
    revalidatePath(`/scouting/${slug}`);
  }
  revalidatePath("/articles");
  revalidatePath("/tutorials");
  revalidatePath("/scouting");
  revalidatePath("/eggrafa");
  revalidatePath("/admin/posts");
  revalidatePath("/");

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await auth()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  await deletePost(Number(id));
  return NextResponse.json({ success: true });
}
