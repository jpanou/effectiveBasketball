import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getTeamSettings, updateTeamSettings } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { validateTextField, validateOrigin, safeErrorMessage } from "@/lib/validators";
import { stripHtml } from "@/lib/sanitize";

async function auth() {
  return !!(await getAdminSession());
}

export async function GET() {
  if (!await auth()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await getTeamSettings());
}

export async function PUT(req: NextRequest) {
  if (!await auth()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!validateOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 50_000) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { team_name, division, photos } = body as { team_name?: unknown; division?: unknown; photos?: unknown };

  const nameCheck = validateTextField(team_name, "team_name", { max: 100 });
  if (!nameCheck.valid) return NextResponse.json({ error: nameCheck.error }, { status: 400 });

  const divisionCheck = validateTextField(division, "division", { max: 100 });
  if (!divisionCheck.valid) return NextResponse.json({ error: divisionCheck.error }, { status: 400 });

  try {
    await updateTeamSettings({
      team_name: stripHtml(String(team_name).trim()),
      division: stripHtml(String(division).trim()),
      photos: Array.isArray(photos)
        ? photos.filter((p): p is string => typeof p === "string").slice(0, 100)
        : [],
    });
    revalidatePath("/myteam");
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: safeErrorMessage(e) }, { status: 500 });
  }
}
