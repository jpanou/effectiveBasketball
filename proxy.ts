import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET environment variable is not set");
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = "eb_admin_token";

// ─── Rate limiting ────────────────────────────────────────────────────────────
// In-memory — resets on cold start. For persistence across Vercel instances use Upstash Redis.
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(key: string, limit: number, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  const hits = (rateLimitMap.get(key) ?? []).filter((t) => t > windowStart);
  if (hits.length >= limit) return true;
  rateLimitMap.set(key, [...hits, now]);
  return false;
}

// ─── Proxy ────────────────────────────────────────────────────────────────────
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  // Rate limit all API routes
  if (pathname.startsWith("/api/")) {
    const isAuthRoute = /\/(api\/admin\/login|api\/admin\/logout)/.test(pathname);
    const limit = isAuthRoute ? 5 : 100;
    const key = `${ip}:${isAuthRoute ? "auth" : "api"}`;

    if (isRateLimited(key, limit)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  // Guard /admin routes (skip /admin/login itself)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        await jwtVerify(token, SECRET);
        return NextResponse.next();
      } catch {
        // Token invalid or expired — fall through to redirect
      }
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/:path*"],
};
