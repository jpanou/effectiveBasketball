import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { safeErrorMessage } from "@/lib/validators";

const BUCKET = "uploads";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const name = new URL(req.url).searchParams.get("name") ?? "file";
  if (name.length > 255) {
    return NextResponse.json({ error: "filename_too_long" }, { status: 400 });
  }

  const safeName = `${Date.now()}_${name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  try {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(safeName);
    if (error) {
      console.error("[upload-url] supabase error:", error);
      return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
    }
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(safeName);
    return NextResponse.json({ signedUrl: data.signedUrl, path: data.path, publicUrl });
  } catch (e) {
    return NextResponse.json({ error: safeErrorMessage(e) }, { status: 500 });
  }
}
