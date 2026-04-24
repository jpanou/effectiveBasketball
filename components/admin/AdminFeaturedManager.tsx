"use client";

import { useState } from "react";
import type { Post } from "@/lib/db";
import Toggle from "@/components/admin/Toggle";

const typeLabel: Record<string, string> = { article: "Άρθρο", tutorial: "Tutorial", scouting: "Scouting", document: "Έγγραφο" };

export default function AdminFeaturedManager({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [saving, setSaving] = useState<number | null>(null);

  async function toggleFeatured(post: Post) {
    setSaving(post.id);
    const newVal = post.featured ? 0 : 1;
    await fetch(`/api/admin/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: newVal }),
    });
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, featured: newVal } : p)));
    setSaving(null);
  }

  const eligiblePosts = posts.filter((p) => p.type !== "document");
  const featured = eligiblePosts.filter((p) => p.featured);
  const rest = eligiblePosts.filter((p) => !p.featured);

  return (
    <div className="space-y-8">
      {/* Currently featured */}
      <div>
        <h2 className="text-sm text-[#F97316] uppercase tracking-widest mb-4">
          Επιλεγμένα ({featured.length})
        </h2>
        <div className="space-y-2">
          {featured.length === 0 && (
            <p className="text-gray-600 text-sm py-4">Κανένα επιλεγμένο άρθρο</p>
          )}
          {featured.map((post) => (
            <PostRow key={post.id} post={post} saving={saving === post.id} onToggle={() => toggleFeatured(post)} />
          ))}
        </div>
      </div>

      {/* Not featured */}
      <div>
        <h2 className="text-sm text-gray-500 uppercase tracking-widest mb-4">
          Λοιπές Αναρτήσεις ({rest.length})
        </h2>
        <div className="space-y-2">
          {rest.length === 0 && (
            <p className="text-gray-600 text-sm py-4">Δεν υπάρχουν άλλες αναρτήσεις</p>
          )}
          {rest.map((post) => (
            <PostRow key={post.id} post={post} saving={saving === post.id} onToggle={() => toggleFeatured(post)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PostRow({ post, saving, onToggle }: { post: Post; saving: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-4 bg-[#111] border border-[#222] rounded-xl px-5 py-3">
      <Toggle checked={!!post.featured} onChange={onToggle} disabled={saving} />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{post.title}</p>
      </div>
      <span className="bg-[#F97316]/10 text-[#F97316] text-xs px-2 py-0.5 rounded-full flex-shrink-0">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(typeLabel as any)[post.type] || post.type}
      </span>
    </div>
  );
}
