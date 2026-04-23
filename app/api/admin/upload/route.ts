import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const BUCKET = "uploads";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "no_file" }, { status: 400 });
  if (file.type.startsWith("video/")) return NextResponse.json({ error: "Τα βίντεο δεν υποστηρίζονται. Χρησιμοποίησε YouTube." }, { status: 400 });

  const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(safeName, bytes, { contentType: file.type, upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(safeName);
  return NextResponse.json({ url: data.publicUrl });
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { url } = await req.json().catch(() => ({ url: null }));
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "no_url" }, { status: 400 });
  }

  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  const path = decodeURIComponent(url.slice(idx + marker.length).split("?")[0]);

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
