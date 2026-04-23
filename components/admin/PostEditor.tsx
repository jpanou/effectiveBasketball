"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/db";
import RichTextEditor from "@/components/admin/RichTextEditor";
import Toggle from "@/components/admin/Toggle";
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from "@/components/ui/image-crop";

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
  const [thumbnailPosition, setThumbnailPosition] = useState(post?.thumbnail_position || "50% 50%");
  const [cropZoom, setCropZoom] = useState(1);
  const naturalSizeRef = useRef<{ w: number; h: number } | null>(null);
  const [videoUrl, setVideoUrl] = useState(post?.video_url || "");

  const ytId = getYouTubeId(videoUrl);
  const previewUrl = type === "tutorial"
    ? (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null)
    : thumbnailUrl || null;

  useEffect(() => {
    if (!previewUrl) { naturalSizeRef.current = null; return; }
    const img = new window.Image();
    img.onload = () => { naturalSizeRef.current = { w: img.naturalWidth, h: img.naturalHeight }; };
    img.src = previewUrl;
  }, [previewUrl]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEdit) setSlug(slugify(val));
  }

  function handleCropChange(area: { x: number; y: number; width: number; height: number } | null) {
    if (!area || !naturalSizeRef.current) return;
    const { w, h } = naturalSizeRef.current;
    const focalX = Math.round(((area.x + area.width / 2) / w) * 100);
    const focalY = Math.round(((area.y + area.height / 2) / h) * 100);
    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    setThumbnailPosition(`${clamp(focalX)}% ${clamp(focalY)}%`);
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
    const body = { title, slug, excerpt, content, type, published, featured, thumbnail_url: effectiveThumbnail, thumbnail_position: thumbnailPosition, video_url: videoUrl };
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
            <input
              className={`${inputCls} flex-1`}
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="/uploads/..."
            />
            <label className="bg-[#1A1A1A] border border-[#333] hover:border-[#F97316] text-gray-400 hover:text-white px-4 py-3 rounded-xl text-sm cursor-pointer transition-colors whitespace-nowrap">
              Μεταφόρτωση
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadFile(file, "thumbnail"); }}
              />
            </label>
          </div>
        </div>
      )}

      {/* Cropper — shown when a thumbnail is available */}
      {previewUrl && (
          <div>
            <p className={labelCls}>
              Επεξεργασία Εικόνας
              <span className="normal-case text-gray-600 tracking-normal ml-1">— σύρε για να επιλέξεις την περιοχή</span>
            </p>
            <Cropper
              className="w-full rounded-xl bg-[#0A0A0A]"
              style={{ aspectRatio: "2 / 1" }}
              image={previewUrl}
              aspectRatio={2}
              cropPadding={0}
              minZoom={1}
              maxZoom={5}
              zoom={cropZoom}
              onCropChange={handleCropChange}
              onZoomChange={setCropZoom}
            >
              <CropperDescription>Σύρε για να επιλέξεις το ορατό τμήμα της εικόνας</CropperDescription>
              <CropperImage />
              <CropperCropArea />
            </Cropper>

            {/* Zoom slider */}
            <div className="mt-2 flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
              <input
                type="range"
                min={1}
                max={5}
                step={0.01}
                value={cropZoom}
                onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                className="flex-1 accent-[#F97316] cursor-pointer"
              />
              <span className="text-xs text-gray-500 w-8 text-right tabular-nums">{cropZoom.toFixed(1)}×</span>
            </div>
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
