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

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/i.test(url);
}
function isPdfUrl(url: string) {
  return /\.pdf(\?|$)/i.test(url);
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}

function DocumentCard({ post, onClick }: { post: Post; onClick: () => void }) {
  const isImg = post.thumbnail_url ? isImageUrl(post.thumbnail_url) : false;
  const isPdf = post.thumbnail_url ? isPdfUrl(post.thumbnail_url) : false;
  const d = new Date(post.created_at);
  const dateStr = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  return (
    <button
      onClick={onClick}
      className="group w-full bg-[#111] border border-[#222] rounded-2xl overflow-hidden hover:border-[#F97316]/40 hover:shadow-[0_0_24px_rgba(249,115,22,0.12)] transition-all duration-300 cursor-pointer text-left"
    >
      {/* Preview area */}
      <div className="relative h-48 bg-[#1A1A1A] overflow-hidden flex items-center justify-center">
        {isImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnail_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : isPdf ? (
          <div className="flex flex-col items-center gap-2">
            <PdfIcon className="w-16 h-16 text-[#F97316]" />
            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">PDF</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <PdfIcon className="w-16 h-16 text-[#333]" />
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#F97316] text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Έγγραφο
          </span>
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-[#F97316]/0 group-hover:bg-[#F97316]/5 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg border border-white/10">
            Προβολή
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col">
        <h3
          className="text-lg text-white mb-2 group-hover:text-[#F97316] transition-colors duration-200 line-clamp-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          {post.title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-gray-600 mt-auto">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            {post.views}
          </span>
          <span className="ml-auto">{dateStr}</span>
        </div>
      </div>
    </button>
  );
}

function DocumentModal({ post, onClose }: { post: Post; onClose: () => void }) {
  const isPdf = post.thumbnail_url ? isPdfUrl(post.thumbnail_url) : false;
  const isImg = post.thumbnail_url ? isImageUrl(post.thumbnail_url) : false;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A]/95 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-[#0A0A0A] border-b border-[#222]">
        <span
          className="text-white text-sm font-semibold truncate max-w-xs md:max-w-lg"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          {post.title}
        </span>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors cursor-pointer ml-4 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          Κλείσιμο
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className="bg-[#F97316] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            Έγγραφο
          </span>
          <h1
            className="text-4xl md:text-6xl text-white mt-4 mb-6 leading-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
          >
            {post.title}
          </h1>

          {isPdf ? (
            <iframe
              src={post.thumbnail_url}
              className="w-full rounded-2xl border border-[#222]"
              style={{ height: "80vh" }}
              title={post.title}
            />
          ) : isImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full rounded-2xl"
            />
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
        </motion.div>
      </div>
    </div>
  );
}

export default function EggrafahPage({ initialPosts }: { initialPosts: Post[] }) {
  const [sort, setSort] = useState<SortOption>("newest");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  async function handleSort(value: SortOption) {
    if (value === sort) return;
    setSort(value);
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?type=document&sort=${value}`);
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
            ΕΓΓΡΑΦΑ
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
      </div>
    </div>
  );
}
