import { NextResponse } from "next/server";
import { getTeamSettings } from "@/lib/db";

export async function GET() {
  const settings = await getTeamSettings();
  return NextResponse.json(settings);
}
