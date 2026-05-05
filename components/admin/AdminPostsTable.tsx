"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import type { Post } from "@/lib/db";
import Toggle from "@/components/admin/Toggle";

const typeLabel: Record<string, string> = { article: "Άρθρο", tutorial: "Tutorial", scouting: "Scouting", document: "Έγγραφο" };

export default function AdminPostsTable({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  async function toggleField(id: number, field: "published" | "featured", current: number) {
    const newVal = current ? 0 : 1;
    await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: newVal }),
    });
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: newVal } : p)));
  }

  async function deletePost(id: number) {
    if (!confirm("Διαγραφή ανάρτησης;")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  async function changeThumbnail(id: number, file: File) {
    setUploadingId(id);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        await fetch(`/api/admin/posts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ thumbnail_url: data.url }),
        });
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, thumbnail_url: data.url } : p)));
      }
    } finally {
      setUploadingId(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="bg-[#111] border border-[#222] rounded-2xl px-6 py-16 text-center text-gray-600 text-sm">
        Δεν υπάρχουν αναρτήσεις ακόμα
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden flex flex-col hover:border-[#333] transition-colors"
        >
          {/* Thumbnail */}
          <div className="relative h-40 bg-[#1A1A1A] group">
            {post.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.thumbnail_url} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-10 h-10 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 1.5H6A4.5 4.5 0 001.5 6v12A4.5 4.5 0 006 22.5h12a4.5 4.5 0 004.5-4.5V6A4.5 4.5 0 0018 1.5z" />
                </svg>
              </div>
            )}

            {/* Change thumbnail overlay */}
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              {uploadingId === post.id ? (
                <span className="text-xs text-white bg-[#F97316] px-3 py-1.5 rounded-lg">Μεταφόρτωση...</span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-white bg-black/70 px-3 py-1.5 rounded-lg border border-white/20">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                  Αλλαγή εικόνας
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={(el) => { fileRefs.current[post.id] = el; }}
                onChange={(e) => e.target.files?.[0] && changeThumbnail(post.id, e.target.files[0])}
              />
            </label>

            {/* Type badge */}
            <div className="absolute top-2 left-2">
              <span className="bg-[#F97316] text-white text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
                {typeLabel[post.type] || post.type}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col flex-1 gap-3">
            <div>
              <h3
                className="text-white text-base font-medium line-clamp-2 mb-1"
                style={{ fontFamily: "var(--font-oswald), 'Oswald', sans-serif", letterSpacing: "0.03em" }}
              >
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-gray-600 text-xs line-clamp-2">{post.excerpt}</p>
              )}
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-5">
              <Toggle
                checked={!!post.published}
                onChange={() => toggleField(post.id, "published", post.published)}
                label="Δημοσιευμένο"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1A1A1A]">
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                {post.views}
              </span>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-[#1A1A1A] hover:bg-[#252525] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                  </svg>
                  Επεξεργασία
                </Link>
                <button
                  onClick={() => deletePost(post.id)}
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 bg-[#1A1A1A] hover:bg-[#252525] px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                  aria-label="Delete"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
