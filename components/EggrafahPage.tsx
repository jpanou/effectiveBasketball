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
  const isPdfIcon = post.thumbnail_url === "/assets/pdf-thumbnail.svg";
  const hasThumb = post.thumbnail_url && !isPdfIcon;

  return (
    <button
      onClick={onClick}
      className="group w-full aspect-video bg-[#1A1A1A] rounded-2xl overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-[#F97316]/40 hover:shadow-[0_0_24px_rgba(249,115,22,0.12)] transition-all duration-300"
    >
      {isPdfIcon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/assets/pdf-thumbnail.svg"
          alt="PDF"
          className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
        />
      ) : hasThumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.thumbnail_url}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <PdfIcon className="w-16 h-16 text-[#333]" />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 text-white text-sm px-4 py-2 rounded-lg border border-white/10">
          Προβολή
        </span>
      </div>
    </button>
  );
}

function DocumentModal({ post, onClose }: { post: Post; onClose: () => void }) {
  const ytId = getYouTubeId(post.video_url || "");
  const isVideoPdf = !ytId && post.video_url ? isPdfUrl(post.video_url) : false;
  const isThumbnailPdf = !post.video_url && post.thumbnail_url ? isPdfUrl(post.thumbnail_url) : false;
  const isThumbnailImg = !post.video_url && post.thumbnail_url ? isImageUrl(post.thumbnail_url) : false;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A]/95 overflow-y-auto">
      {/* Fixed close button — always visible regardless of scroll */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[60] flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] hover:border-[#F97316]/50 text-gray-400 hover:text-white text-sm px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
        Κλείσιμο
      </button>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">
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

          {ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              className="w-full aspect-video rounded-2xl border border-[#222]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={post.title}
            />
          ) : isVideoPdf ? (
            <iframe
              src={post.video_url}
              className="w-full rounded-2xl border border-[#222]"
              style={{ height: "80vh" }}
              title={post.title}
            />
          ) : isThumbnailPdf ? (
            <iframe
              src={post.thumbnail_url}
              className="w-full rounded-2xl border border-[#222]"
              style={{ height: "80vh" }}
              title={post.title}
            />
          ) : isThumbnailImg ? (
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
              <div key={i} className="bg-[#111] border border-[#222] rounded-2xl aspect-video animate-pulse" />
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
