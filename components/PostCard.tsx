import Link from "next/link";
import type { Post } from "@/lib/db";

const typeLabel: Record<string, string> = {
  article: "Άρθρο",
  tutorial: "Tutorial",
  scouting: "Scouting",
};

const typeHref: Record<string, string> = {
  article: "articles",
  tutorial: "tutorials",
  scouting: "scouting",
};

export default function PostCard({ post }: { post: Post }) {
  const href = `/${typeHref[post.type]}/${post.slug}`;

  return (
    <Link
      href={href}
      className="group block bg-[#111] border border-[#222] rounded-2xl overflow-hidden hover:border-[#F97316]/40 hover:shadow-[0_0_24px_rgba(249,115,22,0.12)] transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-[#1A1A1A] overflow-hidden">
        {post.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnail_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            style={{ objectPosition: post.thumbnail_position || "center center" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 1.5H6A4.5 4.5 0 001.5 6v12A4.5 4.5 0 006 22.5h12a4.5 4.5 0 004.5-4.5V6A4.5 4.5 0 0018 1.5z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-[#F97316] text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {typeLabel[post.type] || post.type}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3
          className="text-lg text-white mb-2 group-hover:text-[#F97316] transition-colors duration-200 line-clamp-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            {post.views}
          </span>
          {post.avg_rating !== undefined && post.avg_rating > 0 && (
            <span className="flex items-center gap-1 text-[#F97316]">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {(post.avg_rating as number).toFixed(1)}
            </span>
          )}
          <span className="ml-auto">{(() => { const d = new Date(post.created_at); return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`; })()}</span>
        </div>
      </div>
    </Link>
  );
}
