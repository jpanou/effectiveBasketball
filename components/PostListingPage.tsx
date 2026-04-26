"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Post } from "@/lib/db";
import PostCard from "@/components/PostCard";

type SortOption = "newest" | "highest_rated" | "most_viewed";
type FormatOption = "all" | "regular" | "shorts";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Νεότερα" },
  { value: "highest_rated", label: "Υψηλότερη Βαθμολογία" },
  { value: "most_viewed", label: "Περισσότερες Προβολές" },
];

const formatOptions: { value: FormatOption; label: string }[] = [
  { value: "all", label: "Όλα" },
  { value: "regular", label: "Κανονικά" },
  { value: "shorts", label: "Shorts" },
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

interface Props {
  title: string;
  subtitle: string;
  initialPosts: Post[];
  initialTotal: number;
  type: string;
}

export default function PostListingPage({ title, subtitle, initialPosts, initialTotal, type }: Props) {
  const [sort, setSort] = useState<SortOption>("newest");
  const [format, setFormat] = useState<FormatOption>("all");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const totalPages = Math.ceil(total / LIMIT);

  async function fetchPage(newSort: SortOption, newFormat: FormatOption, newPage: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?type=${type}&sort=${newSort}&format=${newFormat}&page=${newPage}&limit=${LIMIT}`);
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
    await fetchPage(value, format, 1);
  }

  async function handleFormat(value: FormatOption) {
    if (value === format) return;
    setFormat(value);
    await fetchPage(sort, value, 1);
  }

  async function handlePage(newPage: number) {
    await fetchPage(sort, format, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
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
            {title}
          </h1>
          <div className="w-16 h-0.5 bg-[#F97316] mb-4" />
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </motion.div>

        {/* Filter bars */}
        <div className="mb-10 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-500 text-sm w-24">Ταξινόμηση:</span>
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
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-500 text-sm w-24">Μορφή:</span>
            {formatOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleFormat(opt.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  format === opt.value
                    ? "bg-[#F97316] text-white"
                    : "bg-[#111] border border-[#333] text-gray-400 hover:border-[#F97316]/50 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
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
            <p className="text-gray-500 text-sm">Δεν υπάρχουν αναρτήσεις ακόμα</p>
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
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPage={handlePage} />
      </div>
    </div>
  );
}
