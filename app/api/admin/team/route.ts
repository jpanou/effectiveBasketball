import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getTeamSettings, updateTeamSettings } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function auth() {
  const session = await getAdminSession();
  return !!session;
}

export async function GET() {
  if (!await auth()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await getTeamSettings());
}

export async function PUT(req: NextRequest) {
  if (!await auth()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { team_name, division, photos } = body as {
    team_name?: string;
    division?: string;
    photos?: string[];
  };
  if (!team_name || !division) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  await updateTeamSettings({
    team_name: team_name.trim(),
    division: division.trim(),
    photos: Array.isArray(photos) ? photos : [],
  });
  revalidatePath("/myteam");
  return NextResponse.json({ success: true });
}
