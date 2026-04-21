import bcrypt from "bcryptjs";
import { supabase } from "./supabase";

export type PostType = "article" | "tutorial" | "scouting";
export type SortBy = "newest" | "highest_rated" | "most_viewed";

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
  video_url: string;
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
  publishedOnly = true
): Promise<Post[]> {
  let query = supabase
    .from("posts")
    .select("*, ratings(score)");

  if (type) query = query.eq("type", type);
  if (publishedOnly) query = query.eq("published", 1);

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
    .order("created_at", { ascending: false });
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

export async function getAnalytics() {
  const { count: totalPosts, error: e1 } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("published", 1);
  if (e1) throw e1;

  const { data: allPosts, error: e2 } = await supabase
    .from("posts")
    .select("views");
  if (e2) throw e2;
  const totalViews = (allPosts ?? []).reduce((sum, p) => sum + (p.views ?? 0), 0);

  const subscribers = await getNewsletterCount();

  const { data: topPosts, error: e3 } = await supabase
    .from("posts")
    .select("id, title, type, views, slug")
    .order("views", { ascending: false })
    .limit(10);
  if (e3) throw e3;

  return { totalPosts: totalPosts ?? 0, totalViews, subscribers, topPosts: topPosts ?? [] };
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
