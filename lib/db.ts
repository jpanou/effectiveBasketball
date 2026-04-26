import bcrypt from "bcryptjs";
import { supabase } from "./supabase";

export type PostType = "article" | "tutorial" | "scouting" | "document";
export type SortBy = "newest" | "highest_rated" | "most_viewed";
export type VideoFormat = "regular" | "shorts";
export type FormatFilter = "all" | "regular" | "shorts";

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  type: PostType;
  featured: number;
  views: number;
  published: number;
  thumbnail_url: string;
  thumbnail_position: string;
  video_url: string;
  video_format: VideoFormat;
  created_at: string;
  avg_rating?: number;
}

interface RatingRow {
  score: number;
}

type PostWithRatings = Post & { ratings?: RatingRow[] };

function attachAvgRating(row: PostWithRatings): Post {
  const ratings = row.ratings ?? [];
  const avg = ratings.length
    ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
    : 0;
  const { ratings: _ratings, ...rest } = row;
  void _ratings;
  return { ...rest, avg_rating: avg };
}

// ─── Post queries ──────────────────────────────────────────────────────────────

export async function getPosts(
  type?: PostType,
  sort: SortBy = "newest",
  publishedOnly = true,
  format: FormatFilter = "all"
): Promise<Post[]> {
  let query = supabase
    .from("posts")
    .select("*, ratings(score)");

  if (type) query = query.eq("type", type);
  if (publishedOnly) query = query.eq("published", 1);
  if (format !== "all") query = query.eq("video_format", format);

  const { data, error } = await query;
  if (error) throw error;

  const posts = (data as PostWithRatings[]).map(attachAvgRating);

  if (sort === "newest") {
    posts.sort((a, b) => b.created_at.localeCompare(a.created_at));
  } else if (sort === "highest_rated") {
    posts.sort(
      (a, b) =>
        (b.avg_rating ?? 0) - (a.avg_rating ?? 0) ||
        b.created_at.localeCompare(a.created_at)
    );
  } else if (sort === "most_viewed") {
    posts.sort(
      (a, b) => b.views - a.views || b.created_at.localeCompare(a.created_at)
    );
  }
  return posts;
}

export async function getPostsPaginated(
  type: PostType | undefined,
  sort: SortBy = "newest",
  page = 1,
  limit = 9,
  format: FormatFilter = "all"
): Promise<{ posts: Post[]; total: number }> {
  const all = await getPosts(type, sort, true, format);
  const total = all.length;
  const offset = (page - 1) * limit;
  return { posts: all.slice(offset, offset + limit), total };
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, ratings(score)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return undefined;
  return attachAvgRating(data as PostWithRatings);
}

export async function incrementViews(id: number): Promise<void> {
  const { data, error: selectError } = await supabase
    .from("posts")
    .select("views")
    .eq("id", id)
    .maybeSingle();
  if (selectError) throw selectError;
  if (!data) return;
  const { error } = await supabase
    .from("posts")
    .update({ views: (data.views ?? 0) + 1 })
    .eq("id", id);
  if (error) throw error;
}

export async function addRating(postId: number, score: number): Promise<void> {
  const { error } = await supabase
    .from("ratings")
    .insert({ post_id: postId, score });
  if (error) throw error;
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, ratings(score)")
    .eq("featured", 1)
    .eq("published", 1)
    .neq("type", "document")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as PostWithRatings[]).map(attachAvgRating);
}

export async function getLatestPosts(limit = 6): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, ratings(score)")
    .eq("published", 1)
    .neq("type", "document")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as PostWithRatings[]).map(attachAvgRating);
}

export async function createPost(
  data: Omit<Post, "id" | "views" | "created_at" | "avg_rating">
): Promise<void> {
  const { error } = await supabase.from("posts").insert(data);
  if (error) throw error;
}

export async function updatePost(
  id: number,
  data: Partial<Omit<Post, "id" | "views" | "created_at" | "avg_rating">>
): Promise<void> {
  const { error } = await supabase.from("posts").update(data).eq("id", id);
  if (error) throw error;
}

export async function deletePost(id: number): Promise<void> {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

export async function getAllPostsAdmin(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, ratings(score)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as PostWithRatings[]).map(attachAvgRating);
}

// ─── Team Settings ────────────────────────────────────────────────────────────

export interface TeamSettings {
  team_name: string;
  division: string;
  photos: string[];
}

export async function getTeamSettings(): Promise<TeamSettings> {
  const { data, error } = await supabase
    .from("team_settings")
    .select("team_name, division, photos")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return data ?? { team_name: "", division: "", photos: [] };
}

export async function updateTeamSettings(settings: TeamSettings): Promise<void> {
  const { error } = await supabase
    .from("team_settings")
    .upsert({ id: 1, ...settings });
  if (error) throw error;
}

// ─── Newsletter ────────────────────────────────────────────────────────────────

export async function subscribeNewsletter(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("newsletter").insert({ email });
  if (error) {
    if (error.code === "23505") return { success: false, error: "already_subscribed" };
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getNewsletterCount(): Promise<number> {
  const { count, error } = await supabase
    .from("newsletter")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface RecentReview {
  score: number;
  created_at: string;
  post_title: string;
  post_slug: string;
  post_type: PostType;
}

function buildDailySeries(
  rows: { created_at: string; value?: number }[],
  days: number
): TimeSeriesPoint[] {
  const series: TimeSeriesPoint[] = [];
  const map = new Map<string, number>();
  for (const r of rows) {
    const d = new Date(r.created_at);
    if (isNaN(d.getTime())) continue;
    const key = d.toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + (r.value ?? 1));
  }
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, value: map.get(key) ?? 0 });
  }
  return series;
}

async function selectWithFallback<T>(
  table: string,
  primary: string,
  fallback: string
): Promise<T[]> {
  const first = await supabase.from(table).select(primary);
  if (!first.error) return (first.data ?? []) as T[];
  if (first.error.code === "42703") {
    const second = await supabase.from(table).select(fallback);
    if (second.error) throw second.error;
    return (second.data ?? []) as T[];
  }
  throw first.error;
}

export async function getAnalytics() {
  const DAYS = 30;

  const { count: totalPosts, error: e1 } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("published", 1);
  if (e1) throw e1;

  const allPosts = await selectWithFallback<{
    id: number;
    title: string;
    slug: string;
    type: PostType;
    views: number | null;
    created_at: string | null;
  }>("posts", "id, title, slug, type, views, created_at", "id, title, slug, type, views");

  const totalViews = allPosts.reduce((sum, p) => sum + (p.views ?? 0), 0);

  const subscribers = await getNewsletterCount();

  const topPosts = [...allPosts]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 10);

  const viewsSeries = buildDailySeries(
    allPosts
      .filter((p) => p.created_at)
      .map((p) => ({ created_at: p.created_at as string, value: p.views ?? 0 })),
    DAYS
  );

  const subRows = await selectWithFallback<{ created_at: string | null }>(
    "newsletter",
    "created_at",
    "email"
  );
  const subscribersSeries = buildDailySeries(
    subRows
      .filter((r) => r.created_at)
      .map((r) => ({ created_at: r.created_at as string })),
    DAYS
  );

  const ratingRows = await selectWithFallback<{
    score: number;
    post_id: number;
    created_at: string | null;
  }>("ratings", "score, created_at, post_id", "score, post_id");

  const ratingsSeries = buildDailySeries(
    ratingRows
      .filter((r) => r.created_at)
      .map((r) => ({ created_at: r.created_at as string })),
    DAYS
  );

  const totalRatings = ratingRows.length;
  const avgRating =
    totalRatings === 0
      ? 0
      : ratingRows.reduce((sum, r) => sum + (r.score ?? 0), 0) / totalRatings;

  const postMap = new Map<number, { title: string; slug: string; type: PostType }>();
  for (const p of allPosts) {
    postMap.set(p.id, { title: p.title, slug: p.slug, type: p.type });
  }

  const sortedReviews = ratingRows
    .slice()
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));

  const recentReviews: RecentReview[] = sortedReviews.slice(0, 8).map((r) => {
    const p = postMap.get(r.post_id);
    return {
      score: r.score,
      created_at: r.created_at ?? "",
      post_title: p?.title ?? "—",
      post_slug: p?.slug ?? "",
      post_type: (p?.type ?? "article") as PostType,
    };
  });

  return {
    totalPosts: totalPosts ?? 0,
    totalViews,
    subscribers,
    totalRatings,
    avgRating,
    topPosts,
    viewsSeries,
    subscribersSeries,
    ratingsSeries,
    recentReviews,
  };
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

async function ensureAdminSeeded() {
  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (data) return;

  const username = process.env.ADMIN_USERNAME || "coachStratakos";
  const password = process.env.ADMIN_PASSWORD || "123456789";
  const hash = bcrypt.hashSync(password, 10);
  await supabase.from("admin_users").insert({ username, password_hash: hash });
}

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  await ensureAdminSeeded();
  const { data, error } = await supabase
    .from("admin_users")
    .select("password_hash")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  if (!data) return false;
  return bcrypt.compareSync(password, data.password_hash);
}

export async function updateAdminCredentials(
  newUsername: string,
  newPassword: string
): Promise<void> {
  const hash = bcrypt.hashSync(newPassword, 10);
  const { data: existing } = await supabase
    .from("admin_users")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("admin_users")
      .update({ username: newUsername, password_hash: hash })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("admin_users")
      .insert({ username: newUsername, password_hash: hash });
    if (error) throw error;
  }
}

export async function getAdminUsername(): Promise<string> {
  await ensureAdminSeeded();
  const { data, error } = await supabase
    .from("admin_users")
    .select("username")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.username ?? "";
}
