import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

const DB_PATH = path.join(process.cwd(), "data.db");

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema();
  }
  return db;
}

function initSchema() {
  const d = db;
  d.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT DEFAULT '',
      content TEXT DEFAULT '',
      type TEXT NOT NULL CHECK(type IN ('article','tutorial','scouting')),
      featured INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      published INTEGER DEFAULT 0,
      thumbnail_url TEXT DEFAULT '',
      video_url TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      score REAL NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS newsletter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      subscribed_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );
  `);

  const adminUsername = process.env.ADMIN_USERNAME || "coachStratakos";
  const adminPassword = process.env.ADMIN_PASSWORD || "123456789";

  // Remove stale 'admin' default user if it exists alongside a real account
  d.prepare("DELETE FROM admin_users WHERE username = 'admin'").run();

  // Seed if no admin users exist
  const anyAdmin = d.prepare("SELECT id FROM admin_users LIMIT 1").get();
  if (!anyAdmin) {
    const hash = bcrypt.hashSync(adminPassword, 10);
    d.prepare("INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)").run(adminUsername, hash);
  }
}

// ─── Post queries ──────────────────────────────────────────────────────────────

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

export function getPosts(type?: PostType, sort: SortBy = "newest", publishedOnly = true): Post[] {
  const d = getDb();
  let query = `
    SELECT p.*, COALESCE(AVG(r.score), 0) as avg_rating
    FROM posts p
    LEFT JOIN ratings r ON r.post_id = p.id
    WHERE 1=1
  `;
  const params: unknown[] = [];

  if (type) { query += " AND p.type = ?"; params.push(type); }
  if (publishedOnly) { query += " AND p.published = 1"; }

  query += " GROUP BY p.id";

  if (sort === "newest") query += " ORDER BY p.created_at DESC";
  else if (sort === "highest_rated") query += " ORDER BY avg_rating DESC, p.created_at DESC";
  else if (sort === "most_viewed") query += " ORDER BY p.views DESC, p.created_at DESC";

  return d.prepare(query).all(...params) as Post[];
}

export function getPostBySlug(slug: string): Post | undefined {
  const d = getDb();
  return d.prepare(`
    SELECT p.*, COALESCE(AVG(r.score), 0) as avg_rating
    FROM posts p
    LEFT JOIN ratings r ON r.post_id = p.id
    WHERE p.slug = ?
    GROUP BY p.id
  `).get(slug) as Post | undefined;
}

export function incrementViews(id: number) {
  getDb().prepare("UPDATE posts SET views = views + 1 WHERE id = ?").run(id);
}

export function addRating(postId: number, score: number) {
  getDb().prepare("INSERT INTO ratings (post_id, score) VALUES (?, ?)").run(postId, score);
}

export function getFeaturedPosts(): Post[] {
  const d = getDb();
  return d.prepare(`
    SELECT p.*, COALESCE(AVG(r.score), 0) as avg_rating
    FROM posts p
    LEFT JOIN ratings r ON r.post_id = p.id
    WHERE p.featured = 1 AND p.published = 1
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `).all() as Post[];
}

export function createPost(data: Omit<Post, "id" | "views" | "created_at" | "avg_rating">) {
  const d = getDb();
  return d.prepare(`
    INSERT INTO posts (title, slug, excerpt, content, type, featured, published, thumbnail_url, video_url)
    VALUES (@title, @slug, @excerpt, @content, @type, @featured, @published, @thumbnail_url, @video_url)
  `).run(data);
}

export function updatePost(id: number, data: Partial<Omit<Post, "id" | "views" | "created_at" | "avg_rating">>) {
  const d = getDb();
  const fields = Object.keys(data).map(k => `${k} = @${k}`).join(", ");
  return d.prepare(`UPDATE posts SET ${fields} WHERE id = @id`).run({ ...data, id });
}

export function deletePost(id: number) {
  getDb().prepare("DELETE FROM posts WHERE id = ?").run(id);
}

export function getAllPostsAdmin(): Post[] {
  const d = getDb();
  return d.prepare(`
    SELECT p.*, COALESCE(AVG(r.score), 0) as avg_rating
    FROM posts p
    LEFT JOIN ratings r ON r.post_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `).all() as Post[];
}

// ─── Newsletter ────────────────────────────────────────────────────────────────

export function subscribeNewsletter(email: string) {
  try {
    getDb().prepare("INSERT INTO newsletter (email) VALUES (?)").run(email);
    return { success: true };
  } catch {
    return { success: false, error: "already_subscribed" };
  }
}

export function getNewsletterCount(): number {
  return (getDb().prepare("SELECT COUNT(*) as count FROM newsletter").get() as { count: number }).count;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export function getAnalytics() {
  const d = getDb();
  const totalPosts = (d.prepare("SELECT COUNT(*) as count FROM posts WHERE published=1").get() as { count: number }).count;
  const totalViews = (d.prepare("SELECT COALESCE(SUM(views),0) as total FROM posts").get() as { total: number }).total;
  const subscribers = getNewsletterCount();
  const topPosts = d.prepare(`
    SELECT id, title, type, views, slug FROM posts
    ORDER BY views DESC LIMIT 10
  `).all();
  return { totalPosts, totalViews, subscribers, topPosts };
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

export function verifyAdmin(username: string, password: string): boolean {
  const user = getDb().prepare("SELECT password_hash FROM admin_users WHERE username = ?").get(username) as { password_hash: string } | undefined;
  if (!user) return false;
  return bcrypt.compareSync(password, user.password_hash);
}

export function updateAdminCredentials(newUsername: string, newPassword: string) {
  const d = getDb();
  const hash = bcrypt.hashSync(newPassword, 10);
  d.prepare("UPDATE admin_users SET username = ?, password_hash = ?").run(newUsername, hash);
}

export function getAdminUsername(): string {
  const d = getDb();
  const row = d.prepare("SELECT username FROM admin_users LIMIT 1").get() as { username: string } | undefined;
  return row?.username ?? "";
}
