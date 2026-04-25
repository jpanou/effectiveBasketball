import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const BUCKET = "uploads";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const name = new URL(req.url).searchParams.get("name") ?? "file";
  const safeName = `${Date.now()}_${name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(safeName);

  if (error) {
    console.error("[upload-url] supabase error:", JSON.stringify(error));
    return NextResponse.json(
      { error: error.message || "Supabase error", detail: JSON.stringify(error) },
      { status: 500 },
    );
  }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(safeName);
  return NextResponse.json({ signedUrl: data.signedUrl, path: data.path, publicUrl });
}
