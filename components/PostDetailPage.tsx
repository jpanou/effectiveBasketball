"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Post } from "@/lib/db";
import Link from "next/link";

const backLabel: Record<string, string> = {
  article: "Άρθρα",
  tutorial: "Tutorials",
  scouting: "Scouting",
};
const backHref: Record<string, string> = {
  article: "/articles",
  tutorial: "/tutorials",
  scouting: "/scouting",
};

export default function PostDetailPage({ post }: { post: Post }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [rated, setRated] = useState(false);

  async function submitRating(score: number) {
    if (rated) return;
    setRating(score);
    setRated(true);
    await fetch(`/api/posts/${post.slug}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score }),
    });
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <Link
            href={backHref[post.type] || "/"}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#F97316] text-sm mb-8 transition-colors duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            {backLabel[post.type] || "Πίσω"}
          </Link>
        </motion.div>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-[#F97316] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            {post.type}
          </span>

          <h1
            className="text-4xl md:text-6xl text-white mt-4 mb-4 leading-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
          >
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
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
        </motion.div>

        {/* Thumbnail */}
        {post.thumbnail_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 rounded-2xl overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.thumbnail_url} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
          </motion.div>
        )}

        {/* Video */}
        {post.video_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 rounded-2xl overflow-hidden bg-black"
          >
            <video controls className="w-full" src={post.video_url}>
              Ο browser σας δεν υποστηρίζει video.
            </video>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="prose-eb"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Rating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-[#222]"
        >
          <p className="text-gray-400 text-sm mb-4">Αξιολόγησε αυτό το άρθρο:</p>
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
        </motion.div>
      </div>
    </div>
  );
}
