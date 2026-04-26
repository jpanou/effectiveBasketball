import { NextRequest, NextResponse } from "next/server";
import { getPostsPaginated, type PostType, type SortBy, type FormatFilter } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as PostType | null;
  const sort = (searchParams.get("sort") || "newest") as SortBy;
  const format = (searchParams.get("format") || "all") as FormatFilter;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "9", 10));
  const { posts, total } = await getPostsPaginated(type || undefined, sort, page, limit, format);
  return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
}
