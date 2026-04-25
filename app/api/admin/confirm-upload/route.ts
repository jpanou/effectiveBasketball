import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const BUCKET = "uploads";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { path, publicUrl } = body as { path?: string; publicUrl?: string };

  if (!path || typeof path !== "string") {
    return NextResponse.json({ error: "missing path" }, { status: 400 });
  }

  // Verify the file actually landed in storage by requesting a short-lived signed URL.
  // createSignedUrl succeeds only if the object exists.
  const { error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60);
  if (error) {
    console.error("[confirm-upload] file not found in storage:", error);
    return NextResponse.json({ error: "File not found in storage after upload" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, publicUrl });
}
