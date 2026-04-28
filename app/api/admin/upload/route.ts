import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { validateOrigin, safeErrorMessage } from "@/lib/validators";

const BUCKET = "uploads";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "no_file" }, { status: 400 });
    if (file.type.startsWith("video/")) {
      return NextResponse.json({ error: "Τα βίντεο δεν υποστηρίζονται. Χρησιμοποίησε YouTube." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 413 });
    }

    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const bytes = await file.arrayBuffer();
    const contentType = file.type || "application/octet-stream";

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(safeName, bytes, { contentType, upsert: false });

    if (error) {
      console.error("[upload] supabase error:", error);
      return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(safeName);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e) {
    return NextResponse.json({ error: safeErrorMessage(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { url } = body as Record<string, unknown>;
  if (!url || typeof url !== "string" || url.length > 2000) {
    return NextResponse.json({ error: "no_url" }, { status: 400 });
  }

  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  const path = decodeURIComponent(url.slice(idx + marker.length).split("?")[0]);

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    console.error("[upload delete] supabase error:", error);
    return NextResponse.json({ error: "Delete failed. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
