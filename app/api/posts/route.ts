import { NextRequest, NextResponse } from "next/server";
import { getPosts, type PostType, type SortBy } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as PostType | null;
  const sort = (searchParams.get("sort") || "newest") as SortBy;
  const posts = getPosts(type || undefined, sort, true);
  return NextResponse.json(posts);
}
