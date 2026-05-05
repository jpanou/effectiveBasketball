"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { Post } from "@/lib/db";

type SortOption = "newest" | "highest_rated" | "most_viewed";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Νεότερα" },
  { value: "highest_rated", label: "Υψηλότερη Βαθμολογία" },
  { value: "most_viewed", label: "Περισσότερες Προβολές" },
];

const LIMIT = 9;

function Pagination({ page, totalPages, onPage }: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-xl text-sm border border-[#333] bg-[#111] text-gray-400 hover:border-[#F97316]/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
      >
        ←
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="text-gray-600 px-1 select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p as number)}
            className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              p === page
                ? "bg-[#F97316] text-white border border-[#F97316]"
                : "bg-[#111] border border-[#333] text-gray-400 hover:border-[#F97316]/50 hover:text-white"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-2 rounded-xl text-sm border border-[#333] bg-[#111] text-gray-400 hover:border-[#F97316]/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
      >
        →
      </button>
    </div>
  );
}

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/i.test(url);
}
function isPdfUrl(url: string) {
  return /\.pdf(\?|$)/i.test(url);
}
function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}

function DocumentCard({ post, onClick }: { post: Post; onClick: () => void }) {
  const isPdfThumb = post.thumbnail_url === "/assets/pdf-thumbnail.svg";
  const hasRealImage = !!post.thumbnail_url && !isPdfThumb && isImageUrl(post.thumbnail_url);
  const ytId = (!post.thumbnail_url || isPdfThumb) && post.video_url ? getYouTubeId(post.video_url) : null;

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-[#111] border border-[#222] rounded-2xl overflow-hidden hover:border-[#F97316]/40 hover:shadow-[0_0_24px_rgba(249,115,22,0.12)] transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-[#1A1A1A] overflow-hidden">
        {isPdfThumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/assets/pdf-thumbnail.svg"
            alt="PDF"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          />
        ) : hasRealImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnail_url}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            style={{ objectPosition: post.thumbnail_position || "center center" }}
          />
        ) : ytId ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PdfIcon className="w-12 h-12 text-[#333]" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-[#F97316] text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Έγγραφο
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col">
        <h3
          className="text-lg text-white mb-2 group-hover:text-[#F97316] transition-colors duration-200 line-clamp-2"
          style={{ fontFamily: "var(--font-oswald), 'Oswald', sans-serif", letterSpacing: "0.03em" }}
        >
          {post.title}
        </h3>
        <div className="mb-4 min-h-[2.5rem]">
          {post.excerpt && (
            <>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-1">{post.excerpt}</p>
              <span className="text-[#F97316] text-xs font-medium mt-0.5 inline-block">Δες περισσότερα</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-600 mt-auto">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            {post.views}
          </span>
          {post.avg_rating !== undefined && (post.avg_rating as number) > 0 && (
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
    </button>
  );
}

const LS_KEY = "eb_rated_posts";
function getSavedRating(slug: string): number {
  try { const s = JSON.parse(localStorage.getItem(LS_KEY) || "{}"); return s[slug] ?? 0; } catch { return 0; }
}
function saveRating(slug: string, score: number) {
  try { const s = JSON.parse(localStorage.getItem(LS_KEY) || "{}"); s[slug] = score; localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

function DocumentModal({ post, onClose }: { post: Post; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [rated, setRated] = useState(false);

  const ytId = getYouTubeId(post.video_url || "");
  const isVideoPdf = !ytId && post.video_url ? isPdfUrl(post.video_url) : false;
  const isThumbnailPdf = !post.video_url && post.thumbnail_url ? isPdfUrl(post.thumbnail_url) : false;
  const isThumbnailImg = !post.video_url && post.thumbnail_url ? isImageUrl(post.thumbnail_url) : false;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const saved = getSavedRating(post.slug);
    if (saved > 0) { setRating(saved); setRated(true); }
    return () => { document.body.style.overflow = ""; };
  }, [post.slug]);

  async function submitRating(score: number) {
    if (rated) return;
    setRating(score);
    setRated(true);
    saveRating(post.slug, score);
    await fetch(`/api/posts/${post.slug}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score }),
    });
  }

  async function handleDownload() {
    try {
      const res = await fetch(post.thumbnail_url!);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = post.thumbnail_url!.split(".").pop()?.split("?")[0] || "jpg";
      a.download = `${post.title}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* ignore */ }
  }

  return (
    <div className="fixed inset-0 z-[55] bg-[#0A0A0A]/95 overflow-y-auto" onClick={onClose}>
      {/* Close button — fixed below the site navbar with a comfortable gap */}
      <button
        onClick={onClose}
        className="fixed top-24 right-4 z-[60] flex items-center gap-2 bg-[#F97316] hover:bg-[#EA6D0E] border border-[#F97316] text-white text-sm px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
        Κλείσιμο
      </button>

      {/* Content — stop propagation so clicks inside don't close the modal */}
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20" onClick={(e) => e.stopPropagation()}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className="bg-[#F97316] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            Έγγραφο
          </span>
          <h1
            className="text-4xl md:text-6xl text-white mt-4 mb-3 leading-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-gray-400 text-base leading-relaxed mb-4">{post.excerpt}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>{new Date(post.created_at).toLocaleDateString("el-GR", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              {post.views} προβολές
            </span>
            {(post.avg_rating ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-[#F97316]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {(post.avg_rating as number).toFixed(1)}
              </span>
            )}
          </div>

          {ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              className="w-full aspect-video rounded-2xl border border-[#222]"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={post.title}
            />
          ) : isVideoPdf ? (
            <iframe
              src={post.video_url}
              className="w-full rounded-2xl border border-[#222]"
              loading="lazy"
              style={{ height: "80vh" }}
              title={post.title}
            />
          ) : isThumbnailPdf ? (
            <iframe
              src={post.thumbnail_url}
              className="w-full rounded-2xl border border-[#222]"
              loading="lazy"
              style={{ height: "80vh" }}
              title={post.title}
            />
          ) : isThumbnailImg ? (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.thumbnail_url}
                alt={post.title}
                decoding="async"
                className="w-full rounded-2xl"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] hover:border-[#F97316]/50 text-gray-400 hover:text-white text-sm px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Λήψη Εικόνας
                </button>
              </div>
            </div>
          ) : post.thumbnail_url ? (
            <div className="flex flex-col items-center gap-6 py-20 border border-dashed border-[#333] rounded-2xl">
              <PdfIcon className="w-20 h-20 text-[#F97316]" />
              <a
                href={post.thumbnail_url}
                target="_blank"
                rel="noreferrer"
                className="bg-[#F97316] hover:bg-[#EA6D0E] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Άνοιγμα Αρχείου
              </a>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-20">Δεν υπάρχει αρχείο</p>
          )}

          {/* Rating */}
          <div className="mt-12 pt-8 border-t border-[#222]">
            <p className="text-gray-400 text-sm mb-4">Αξιολόγησε αυτό το έγγραφο:</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => submitRating(star)}
                  onMouseEnter={() => !rated && setHover(star)}
                  onMouseLeave={() => !rated && setHover(0)}
                  disabled={rated}
                  className="cursor-pointer transition-transform duration-150 hover:scale-110 disabled:cursor-default"
                  aria-label={`Βαθμολογία ${star}`}
                >
                  <svg
                    className={`w-8 h-8 transition-colors duration-150 ${
                      star <= (hover || rating) ? "text-[#F97316]" : "text-[#333]"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
            {rated && <p className="mt-3 text-[#F97316] text-sm">Ευχαριστούμε για την αξιολόγησή σου!</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function EggrafahPage({ initialPosts, initialTotal }: { initialPosts: Post[]; initialTotal: number }) {
  const [sort, setSort] = useState<SortOption>("newest");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const totalPages = Math.ceil(total / LIMIT);

  async function fetchPage(newSort: SortOption, newPage: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?type=document&sort=${newSort}&page=${newPage}&limit=${LIMIT}`);
      const data = await res.json();
      setPosts(data.posts);
      setTotal(data.total);
      setPage(newPage);
    } catch {
      // keep existing
    } finally {
      setLoading(false);
    }
  }

  async function handleSort(value: SortOption) {
    if (value === sort) return;
    setSort(value);
    await fetchPage(value, 1);
  }

  async function handlePage(newPage: number) {
    await fetchPage(sort, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      {selectedPost && (
        <DocumentModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1
            className="text-5xl md:text-7xl text-white mb-3"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            ΧΡΗΣΙΜΑ
          </h1>
          <div className="w-16 h-0.5 bg-[#F97316] mb-4" />
          <p className="text-gray-400 text-sm">Φωτογραφίες, έγγραφα και αρχεία</p>
        </motion.div>

        {/* Sort bar */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          <span className="text-gray-500 text-sm">Ταξινόμηση:</span>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSort(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                sort === opt.value
                  ? "bg-[#F97316] text-white"
                  : "bg-[#111] border border-[#333] text-gray-400 hover:border-[#F97316]/50 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-[#111] border border-[#222] rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-dashed border-[#333] rounded-2xl p-16 text-center"
          >
            <p
              className="text-2xl text-white mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              ΣΥΝΤΟΜΑ ΠΕΡΙΕΧΟΜΕΝΟ
            </p>
            <p className="text-gray-500 text-sm">Δεν υπάρχουν έγγραφα ακόμα</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <DocumentCard post={post} onClick={() => setSelectedPost(post)} />
              </motion.div>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPage={handlePage} />
      </div>
    </div>
  );
}
