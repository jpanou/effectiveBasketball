"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Post } from "@/lib/db";
import PostCard from "@/components/PostCard";

type SortOption = "newest" | "highest_rated" | "most_viewed";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Νεότερα" },
  { value: "highest_rated", label: "Υψηλότερη Βαθμολογία" },
  { value: "most_viewed", label: "Περισσότερες Προβολές" },
];

interface Props {
  title: string;
  subtitle: string;
  initialPosts: Post[];
  type: string;
}

export default function PostListingPage({ title, subtitle, initialPosts, type }: Props) {
  const [sort, setSort] = useState<SortOption>("newest");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);

  async function handleSort(value: SortOption) {
    if (value === sort) return;
    setSort(value);
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?type=${type}&sort=${value}`);
      const data = await res.json();
      setPosts(data);
    } catch {
      // keep existing
    } finally {
      setLoading(false);
    }
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

        {/* Filter bar */}
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
            {[...Array(6)].map((_, i) => (
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
      </div>
    </div>
  );
}
