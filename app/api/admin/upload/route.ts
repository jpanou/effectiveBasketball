import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const BUCKET = "uploads";

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[upload] missing supabase env vars");
      return NextResponse.json({ error: "Server misconfigured: missing Supabase credentials" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "no_file" }, { status: 400 });
    if (file.type.startsWith("video/")) return NextResponse.json({ error: "Τα βίντεο δεν υποστηρίζονται. Χρησιμοποίησε YouTube." }, { status: 400 });

    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const bytes = await file.arrayBuffer();
    const contentType = file.type || "application/octet-stream";

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(safeName, bytes, { contentType, upsert: false });

    if (error) {
      console.error("[upload] supabase error:", error);
      const errAny = error as unknown as Record<string, unknown>;
      const msg =
        (typeof errAny.message === "string" && errAny.message && errAny.message !== "error"
          ? errAny.message
          : null) ||
        (typeof errAny.error === "string" && errAny.error ? errAny.error : null) ||
        (() => {
          try { return JSON.stringify(error); } catch { return "Supabase upload failed"; }
        })();
      return NextResponse.json(
        {
          error: msg,
          supabase: {
            name: errAny.name,
            message: errAny.message,
            statusCode: errAny.statusCode,
            status: errAny.status,
            bucket: BUCKET,
            url_present: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            service_key_present: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          },
        },
        { status: 500 },
      );
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(safeName);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e: unknown) {
    console.error("[upload] unexpected error:", e);
    const msg = e instanceof Error ? e.message : "Unexpected upload error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
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
