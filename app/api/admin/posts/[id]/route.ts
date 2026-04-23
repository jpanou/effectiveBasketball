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
  await updatePost(Number(id), body);

  const { slug } = body;
  if (slug) {
    revalidatePath(`/articles/${slug}`);
    revalidatePath(`/tutorials/${slug}`);
    revalidatePath(`/scouting/${slug}`);
  }
  revalidatePath("/articles");
  revalidatePath("/tutorials");
  revalidatePath("/scouting");
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
