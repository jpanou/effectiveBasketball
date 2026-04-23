"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/db";
import RichTextEditor from "@/components/admin/RichTextEditor";
import Toggle from "@/components/admin/Toggle";

interface Props {
  post?: Post;
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function PostEditor({ post }: Props) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [type, setType] = useState<"article" | "tutorial" | "scouting">(post?.type || "article");
  const [published, setPublished] = useState(post ? !!post.published : true);
  const [featured, setFeatured] = useState(!!post?.featured);
  const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnail_url || "");
  const [videoUrl, setVideoUrl] = useState(post?.video_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEdit) setSlug(slugify(val));
  }

  async function uploadFile(file: File, field: "thumbnail" | "video") {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Η μεταφόρτωση απέτυχε");
        return;
      }
      if (data.url) {
        if (field === "thumbnail") setThumbnailUrl(data.url);
        else setVideoUrl(data.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Σφάλμα δικτύου");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!title || !slug || !type) { setError("Συμπληρώστε όλα τα υποχρεωτικά πεδία"); return; }
    setSaving(true);
    setError("");
    const youtubeId = type === "tutorial" ? getYouTubeId(videoUrl) : null;
    const effectiveThumbnail = youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
      : thumbnailUrl;
    const body = { title, slug, excerpt, content, type, published, featured, thumbnail_url: effectiveThumbnail, video_url: videoUrl };
    try {
      let res;
      if (isEdit) {
        res = await fetch(`/api/admin/posts/${post!.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        res = await fetch("/api/admin/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      if (res.ok) {
        router.push("/admin/posts");
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error || "Σφάλμα αποθήκευσης");
      }
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F97316] transition-colors";
  const labelCls = "block text-xs text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="max-w-3xl space-y-6">
      {/* Title */}
      <div>
        <label className={labelCls}>Τίτλος *</label>
        <input className={inputCls} value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Τίτλος ανάρτησης" />
      </div>

      {/* Slug */}
      <div>
        <label className={labelCls}>Slug *</label>
        <input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-friendly-slug" />
        <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
          Το slug είναι το τμήμα της URL που αναγνωρίζει μοναδικά αυτή την ανάρτηση — π.χ. <span className="text-gray-500 font-mono">αμυντικη-πιεση</span> δημιουργεί τη διεύθυνση <span className="text-gray-500 font-mono">/articles/αμυντικη-πιεση</span>. Συμπληρώνεται αυτόματα από τον τίτλο.
        </p>
      </div>

      {/* Type */}
      <div>
        <label className={labelCls}>Τύπος *</label>
        <select
          className={inputCls}
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
        >
          <option value="article">Άρθρο</option>
          <option value="tutorial">Tutorial</option>
          <option value="scouting">Scouting</option>
        </select>
      </div>

      {/* Excerpt */}
      <div>
        <label className={labelCls}>Σύντομη Περιγραφή</label>
        <textarea className={`${inputCls} resize-none h-20`} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Σύντομη περιγραφή..." />
      </div>

      {/* Content */}
      <div>
        <label className={labelCls}>Περιεχόμενο</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      {/* Thumbnail upload — hidden for tutorials (auto-derived from YouTube) */}
      {type !== "tutorial" && (
        <div>
          <label className={labelCls}>Εικόνα Κεφαλίδας</label>
          <div className="flex gap-3 items-center">
            <input className={`${inputCls} flex-1`} value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="/uploads/..." />
            <label className="bg-[#1A1A1A] border border-[#333] hover:border-[#F97316] text-gray-400 hover:text-white px-4 py-3 rounded-xl text-sm cursor-pointer transition-colors whitespace-nowrap">
              Μεταφόρτωση
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "thumbnail")} />
            </label>
          </div>
          {thumbnailUrl && (
            <div className="mt-2 rounded-xl overflow-hidden h-32 bg-[#1A1A1A]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbnailUrl} alt="thumbnail" className="h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {/* Video (YouTube) */}
      <div>
        <label className={labelCls}>Βίντεο (YouTube)</label>
        <input
          className={inputCls}
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
          Ανέβασε το βίντεο στο YouTube και επικόλλησε τον σύνδεσμό του εδώ. Η άμεση μεταφόρτωση βίντεο δεν υποστηρίζεται.
        </p>
        {type === "tutorial" && (() => {
          const ytId = getYouTubeId(videoUrl);
          return ytId ? (
            <div className="mt-2 rounded-xl overflow-hidden h-32 bg-[#1A1A1A] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                alt="YouTube thumbnail"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                Thumbnail από YouTube
              </span>
            </div>
          ) : null;
        })()}
      </div>

      {uploading && <p className="text-[#F97316] text-sm">Μεταφόρτωση αρχείου...</p>}

      {/* Toggles */}
      <div className="flex gap-8">
        <Toggle checked={published} onChange={() => setPublished(!published)} label="Δημοσιευμένο" />
        <Toggle checked={featured} onChange={() => setFeatured(!featured)} label="Επιλεγμένο" />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="bg-[#F97316] hover:bg-[#EA6D0E] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer text-sm"
        >
          {saving ? "Αποθήκευση..." : isEdit ? "Ενημέρωση" : "Δημιουργία"}
        </button>
        <button
          onClick={() => router.push("/admin/posts")}
          className="bg-[#1A1A1A] border border-[#333] text-gray-400 hover:text-white px-6 py-3 rounded-xl transition-colors cursor-pointer text-sm"
        >
          Ακύρωση
        </button>
      </div>
    </div>
  );
}
