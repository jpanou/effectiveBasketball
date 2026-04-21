import { NextRequest, NextResponse } from "next/server";
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
  updatePost(Number(id), body);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await auth()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  deletePost(Number(id));
  return NextResponse.json({ success: true });
}
