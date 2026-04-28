import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { validateOrigin, safeErrorMessage } from "@/lib/validators";

const BUCKET = "uploads";

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { path, publicUrl } = body as Record<string, unknown>;

  if (!path || typeof path !== "string" || path.length > 500) {
    return NextResponse.json({ error: "missing_path" }, { status: 400 });
  }

  try {
    const { error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60);
    if (error) {
      console.error("[confirm-upload] file not found in storage:", error);
      return NextResponse.json({ error: "File not found in storage after upload" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, publicUrl });
  } catch (e) {
    return NextResponse.json({ error: safeErrorMessage(e) }, { status: 500 });
  }
}
