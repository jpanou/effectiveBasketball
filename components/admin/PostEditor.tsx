"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/db";
import RichTextEditor from "@/components/admin/RichTextEditor";
import Toggle from "@/components/admin/Toggle";
import EmojiPicker from "@/components/admin/EmojiPicker";
import { compressImage } from "@/lib/compressImage";
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from "@/components/ui/image-crop";

interface Props {
  post?: Post;
}

const REQUIRED_THUMBNAIL_WIDTH = 1600;
const REQUIRED_THUMBNAIL_HEIGHT = 800;

const typeLabel: Record<string, string> = {
  article: "Άρθρο",
  tutorial: "Tutorial",
  scouting: "Scouting",
  document: "Έγγραφο",
};

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function isPdfUrl(url: string) {
  return /\.pdf(\?|$)/i.test(url);
}

function detectDocFileType(post?: Post): "pdf" | "image" | "video" {
  if (!post || post.type !== "document") return "pdf";
  if (getYouTubeId(post.video_url || "")) return "video";
  if (isPdfUrl(post.video_url || "") || isPdfUrl(post.thumbnail_url || "")) return "pdf";
  if (post.thumbnail_url) return "image";
  return "pdf";
}

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("read_failed"));
    };
    img.src = url;
  });
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function VideoEmbed({ url, title }: { url: string; title: string }) {
  const ytId = getYouTubeId(url);
  const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : null;
  return embedUrl ? (
    <iframe
      src={embedUrl}
      className="w-full aspect-video rounded-2xl"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={title}
    />
  ) : (
    <video controls className="w-full rounded-2xl" src={url}>Ο browser σας δεν υποστηρίζει video.</video>
  );
}

function PreviewOverlay({
  title, excerpt, content, type, videoFormat, thumbnailUrl, thumbnailPosition, videoUrl,
  onClose,
}: {
  title: string; excerpt: string; content: string;
  type: "article" | "tutorial" | "scouting" | "document";
  videoFormat: "regular" | "shorts";
  thumbnailUrl: string; thumbnailPosition: string; videoUrl: string;
  onClose: () => void;
}) {
  const dateStr = new Date().toLocaleDateString("el-GR", { year: "numeric", month: "long", day: "numeric" });
  const ytId = getYouTubeId(videoUrl);
  const isShorts = videoFormat === "shorts";
  const effectiveThumbnail = type === "tutorial" && !isShorts
    ? (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : "")
    : thumbnailUrl;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A]/95 overflow-y-auto">
      {/* Header bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-[#0A0A0A] border-b border-[#222]">
        <span className="text-xs text-gray-500 uppercase tracking-widest">Προεπισκόπηση</span>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          Κλείσιμο
        </button>
      </div>

      {/* Post content — mirrors public PostDetailPage layout */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        {/* Badge */}
        <span className="bg-[#F97316] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
          {typeLabel[type] || type}
        </span>

        {/* Title */}
        <h1
          className="text-4xl md:text-6xl text-white mt-4 mb-3 leading-tight"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          {title || <span className="text-gray-600">Χωρίς τίτλο</span>}
        </h1>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-gray-400 text-base leading-relaxed mb-4">{excerpt}</p>
        )}

        {/* Date / views / rating */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
          <span>{dateStr}</span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            0 προβολές
          </span>
        </div>

        {/* Hero thumbnail — shown for everything EXCEPT regular tutorials */}
        {effectiveThumbnail && !(type === "tutorial" && !isShorts) && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={effectiveThumbnail}
              alt={title}
              className="w-full h-64 md:h-96 object-cover"
              style={{ objectPosition: thumbnailPosition || "center center" }}
            />
          </div>
        )}

        {/* Video before content — regular tutorials only (16:9, full width) */}
        {videoUrl && type === "tutorial" && !isShorts && (
          <div className="mb-8 rounded-2xl overflow-hidden bg-black">
            <VideoEmbed url={videoUrl} title={title} />
          </div>
        )}

        {/* Content */}
        {content ? (
          <div
            className="prose-eb"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-gray-600 italic">Χωρίς περιεχόμενο ακόμα...</p>
        )}

        {/* Video after content — articles/scouting (any format) AND tutorial+shorts; shorts in 9:16 */}
        {videoUrl && !(type === "tutorial" && !isShorts) && (
          <div className={isShorts ? "mt-8 mx-auto w-full max-w-[360px] rounded-2xl overflow-hidden bg-black" : "mt-8 rounded-2xl overflow-hidden bg-black"}>
            {(() => {
              const yt = getYouTubeId(videoUrl);
              return yt ? (
                <iframe
                  src={`https://www.youtube.com/embed/${yt}`}
                  className={isShorts ? "w-full aspect-[9/16]" : "w-full aspect-video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={title}
                />
              ) : (
                <video controls className={isShorts ? "w-full aspect-[9/16]" : "w-full"} src={videoUrl}>Ο browser σας δεν υποστηρίζει video.</video>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PostEditor({ post }: Props) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [type, setType] = useState<"article" | "tutorial" | "scouting" | "document">(post?.type || "article");
  const [published, setPublished] = useState(post ? !!post.published : true);
  const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnail_url || "");
  const [thumbnailPosition, setThumbnailPosition] = useState(post?.thumbnail_position || "50% 50%");
  const [cropZoom, setCropZoom] = useState(1);
  const naturalSizeRef = useRef<{ w: number; h: number } | null>(null);
  const firstCropFireRef = useRef(true);
  const docFileInputRef = useRef<HTMLInputElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const excerptRef = useRef<HTMLTextAreaElement | null>(null);
  const [videoUrl, setVideoUrl] = useState(post?.video_url || "");
  const [videoFormat, setVideoFormat] = useState<"regular" | "shorts">(post?.video_format === "shorts" ? "shorts" : "regular");
  const [docFileType, setDocFileType] = useState<"pdf" | "image" | "video">(detectDocFileType(post));
  const [showPreview, setShowPreview] = useState(false);

  const isShorts = videoFormat === "shorts";
  const ytId = getYouTubeId(videoUrl);
  const previewUrl = type === "tutorial" && !isShorts
    ? (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null)
    : thumbnailUrl || null;

  useEffect(() => {
    if (!previewUrl) { naturalSizeRef.current = null; return; }
    const img = new window.Image();
    img.onload = () => { naturalSizeRef.current = { w: img.naturalWidth, h: img.naturalHeight }; };
    img.src = previewUrl;
  }, [previewUrl]);

  useEffect(() => {
    firstCropFireRef.current = true;
  }, [previewUrl]);

  // Lock body scroll when preview is open
  useEffect(() => {
    document.body.style.overflow = showPreview ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showPreview]);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEdit) setSlug(slugify(val));
  }

  function insertAtCursor(
    el: HTMLInputElement | HTMLTextAreaElement | null,
    current: string,
    text: string,
    setter: (v: string) => void,
    onAfter?: (newValue: string) => void
  ) {
    if (!el) {
      const next = current + text;
      setter(next);
      onAfter?.(next);
      return;
    }
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? current.length;
    const next = current.slice(0, start) + text + current.slice(end);
    setter(next);
    onAfter?.(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + text.length;
      el.setSelectionRange(pos, pos);
    });
  }

  function handleCropChange(area: { x: number; y: number; width: number; height: number } | null) {
    if (!area || !naturalSizeRef.current) return;
    if (firstCropFireRef.current) {
      firstCropFireRef.current = false;
      return;
    }
    const { w, h } = naturalSizeRef.current;
    const focalX = Math.round(((area.x + area.width / 2) / w) * 100);
    const focalY = Math.round(((area.y + area.height / 2) / h) * 100);
    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    setThumbnailPosition(`${clamp(focalX)}% ${clamp(focalY)}%`);
  }

  async function uploadToSupabase(file: File): Promise<string> {
    // Step 1: get a signed upload URL from the backend
    const urlRes = await fetch(`/api/admin/upload-url?name=${encodeURIComponent(file.name)}`);
    const urlData = await urlRes.json().catch(() => ({}));
    if (!urlRes.ok) throw new Error(urlData.error || `HTTP ${urlRes.status}`);
    const { signedUrl, path, publicUrl } = urlData as { signedUrl: string; path: string; publicUrl: string };

    // Step 2: PUT file bytes directly to Supabase (bypasses Vercel completely)
    const uploadRes = await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type || "application/octet-stream" },
    });
    if (!uploadRes.ok) {
      const body = await uploadRes.text().catch(() => "");
      let detail = body;
      try { detail = JSON.parse(body)?.message || JSON.parse(body)?.error || body; } catch { /* raw text */ }
      throw new Error(`Upload failed: ${detail || uploadRes.status}`);
    }

    // Step 3: ask backend to verify the file actually landed in storage
    const confirmRes = await fetch("/api/admin/confirm-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, publicUrl }),
    });
    const confirmData = await confirmRes.json().catch(() => ({}));
    if (!confirmRes.ok) throw new Error(confirmData.error || "Confirm failed");
    return confirmData.publicUrl || publicUrl;
  }

  async function uploadFile(file: File, field: "thumbnail" | "video") {
    if (file.size > 5 * 1024 * 1024) {
      setError(`Το αρχείο πρέπει να είναι μικρότερο από 5MB. (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      return;
    }
    setUploading(true);
    setError("");
    if (field === "thumbnail" && !isShorts) {
      try {
        const { width, height } = await readImageDimensions(file);
        if (width !== REQUIRED_THUMBNAIL_WIDTH || height !== REQUIRED_THUMBNAIL_HEIGHT) {
          setError(`Η εικόνα πρέπει να είναι ακριβώς ${REQUIRED_THUMBNAIL_WIDTH} × ${REQUIRED_THUMBNAIL_HEIGHT} pixels. Η εικόνα σας είναι ${width} × ${height} pixels.`);
          setUploading(false);
          return;
        }
      } catch {
        setError("Δεν ήταν δυνατή η ανάγνωση της εικόνας.");
        setUploading(false);
        return;
      }
    }
    try {
      // Compress: thumbnails keep dimensions (strict size); shorts thumbnails capped at 1600px
      const toUpload = field === "thumbnail"
        ? await compressImage(file, isShorts ? { maxSizeMB: 0.5, maxWidthOrHeight: 1600 } : { maxSizeMB: 0.5 })
        : file;
      const url = await uploadToSupabase(toUpload);
      if (field === "thumbnail") {
        setThumbnailUrl(url);
        setThumbnailPosition("50% 50%");
      } else {
        setVideoUrl(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Σφάλμα μεταφόρτωσης");
    } finally {
      setUploading(false);
    }
  }

  async function uploadDocumentFile(file: File) {
    const maxMb = docFileType === "pdf" ? 10 : 5;
    if (file.size > maxMb * 1024 * 1024) {
      setError(`Το αρχείο πρέπει να είναι μικρότερο από ${maxMb}MB. (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      return;
    }
    setUploading(true);
    setError("");
    try {
      const toUpload = docFileType === "image"
        ? await compressImage(file, { maxSizeMB: 0.6, maxWidthOrHeight: 1920 })
        : file;
      const url = await uploadToSupabase(toUpload);
      if (docFileType === "pdf") {
        setVideoUrl(url);
        setThumbnailUrl("/assets/pdf-thumbnail.svg");
      } else {
        setThumbnailUrl(url);
        setVideoUrl("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Σφάλμα μεταφόρτωσης");
    } finally {
      setUploading(false);
      if (docFileInputRef.current) docFileInputRef.current.value = "";
    }
  }

  async function handleSave() {
    if (!title || !slug || !type) { setError("Συμπληρώστε όλα τα υποχρεωτικά πεδία"); return; }
    if (type === "document") {
      if (docFileType === "pdf" && !videoUrl) {
        setError("Παρακαλώ μεταφορτώστε ένα PDF αρχείο");
        return;
      }
      if (docFileType === "image" && !thumbnailUrl) {
        setError("Παρακαλώ μεταφορτώστε μια εικόνα");
        return;
      }
      if (docFileType === "video" && !getYouTubeId(videoUrl)) {
        setError("Παρακαλώ εισάγετε έγκυρο σύνδεσμο YouTube");
        return;
      }
    }
    setSaving(true);
    setError("");
    // Auto-derive thumbnail from YouTube only for regular tutorials and document videos
    // (tutorial+shorts uses a manually uploaded thumbnail)
    const isAutoThumb =
      (type === "tutorial" && !isShorts) ||
      (type === "document" && docFileType === "video");
    const youtubeId = isAutoThumb ? getYouTubeId(videoUrl) : null;
    const effectiveThumbnail = youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
      : thumbnailUrl;
    const body = {
      title,
      slug,
      excerpt,
      content: type === "document" ? "" : content,
      type,
      published,
      featured: 0,
      thumbnail_url: effectiveThumbnail,
      thumbnail_position: type === "document" ? "50% 50%" : thumbnailPosition,
      video_url: videoUrl,
      video_format: type === "document" ? "regular" : videoFormat,
    };
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
    <>
      {showPreview && type !== "document" && (
        <PreviewOverlay
          title={title}
          excerpt={excerpt}
          content={content}
          type={type}
          videoFormat={videoFormat}
          thumbnailUrl={thumbnailUrl}
          thumbnailPosition={thumbnailPosition}
          videoUrl={videoUrl}
          onClose={() => setShowPreview(false)}
        />
      )}

      <div className="max-w-3xl space-y-6">
        {/* Title */}
        <div>
          <label className={labelCls}>Τίτλος *</label>
          <div className="relative">
            <input
              ref={titleRef}
              className={`${inputCls} pr-12`}
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Τίτλος ανάρτησης"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <EmojiPicker
                onPick={(emoji) => insertAtCursor(titleRef.current, title, emoji, (v) => {
                  setTitle(v);
                  if (!isEdit) setSlug(slugify(v));
                })}
              />
            </div>
          </div>
        </div>

        {/* Slug */}
        <div>
          <label className={labelCls}>Slug *</label>
          <input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-friendly-slug" />
          <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
            Το slug είναι το τμήμα της URL που αναγνωρίζει μοναδικά αυτή την ανάρτηση — π.χ. <span className="text-gray-500 font-mono">αμυντικη-πιεση</span> δημιουργεί τη διεύθυνση <span className="text-gray-500 font-mono">/articles/αμυντικη-πιεση</span>. Συμπληρώνεται αυτόματα από τον τίτλο.
          </p>
        </div>

        {/* Description — document type only */}
        {type === "document" && (
          <div>
            <label className={labelCls}>Σύντομη Περιγραφή</label>
            <div className="relative">
              <textarea
                ref={excerptRef}
                className={`${inputCls} resize-none h-20 pr-12`}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Σύντομη περιγραφή του εγγράφου..."
              />
              <div className="absolute top-2 right-2">
                <EmojiPicker
                  onPick={(emoji) => insertAtCursor(excerptRef.current, excerpt, emoji, setExcerpt)}
                />
              </div>
            </div>
          </div>
        )}

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
            <option value="document">Έγγραφο</option>
          </select>
        </div>

        {/* ── Document upload zone (document type only) ── */}
        {type === "document" && (
          <div className="space-y-4">
            {/* Sub-type selector */}
            <div>
              <label className={labelCls}>Τύπος Αρχείου *</label>
              <select
                className={inputCls}
                value={docFileType}
                onChange={(e) => {
                  const t = e.target.value as "pdf" | "image" | "video";
                  setDocFileType(t);
                  setVideoUrl("");
                  setThumbnailUrl("");
                }}
              >
                <option value="pdf">PDF</option>
                <option value="image">Εικόνα</option>
                <option value="video">Βίντεο (YouTube)</option>
              </select>
            </div>

            {/* PDF upload */}
            {docFileType === "pdf" && (
              <div>
                <label className={labelCls}>Αρχείο PDF *</label>
                {videoUrl ? (
                  <div className="border border-[#333] rounded-xl p-4 flex items-center gap-4 bg-[#1A1A1A]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/pdf-thumbnail.svg" alt="PDF" className="w-12 h-14 object-contain shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {decodeURIComponent(videoUrl.split("/").pop()?.replace(/^\d+_/, "") || "")}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">PDF</p>
                    </div>
                    <label className="shrink-0 cursor-pointer text-xs text-gray-400 hover:text-white border border-[#333] hover:border-[#F97316] px-3 py-1.5 rounded-lg transition-colors">
                      Αντικατάσταση
                      <input
                        ref={docFileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDocumentFile(f); }}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-[#333] hover:border-[#F97316]/50 rounded-xl p-10 text-center cursor-pointer transition-colors group">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#252525] group-hover:bg-[#2A2A2A] flex items-center justify-center transition-colors">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-[#F97316] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium">Κάνε κλικ για να επιλέξεις PDF</p>
                        <p className="text-gray-600 text-xs mt-1">PDF, μέχρι 10MB</p>
                      </div>
                    </div>
                    <input
                      ref={docFileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDocumentFile(f); }}
                    />
                  </label>
                )}
              </div>
            )}

            {/* Image upload */}
            {docFileType === "image" && (
              <div>
                <label className={labelCls}>Εικόνα *</label>
                {thumbnailUrl ? (
                  <div className="border border-[#333] rounded-xl p-4 flex items-center gap-4 bg-[#1A1A1A]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbnailUrl} alt="preview" className="w-16 h-16 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {decodeURIComponent(thumbnailUrl.split("/").pop()?.replace(/^\d+_/, "") || "")}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">Εικόνα</p>
                    </div>
                    <label className="shrink-0 cursor-pointer text-xs text-gray-400 hover:text-white border border-[#333] hover:border-[#F97316] px-3 py-1.5 rounded-lg transition-colors">
                      Αντικατάσταση
                      <input
                        ref={docFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDocumentFile(f); }}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-[#333] hover:border-[#F97316]/50 rounded-xl p-10 text-center cursor-pointer transition-colors group">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#252525] group-hover:bg-[#2A2A2A] flex items-center justify-center transition-colors">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-[#F97316] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium">Κάνε κλικ για να επιλέξεις εικόνα</p>
                        <p className="text-gray-600 text-xs mt-1">PNG, JPG, WEBP, μέχρι 5MB</p>
                      </div>
                    </div>
                    <input
                      ref={docFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDocumentFile(f); }}
                    />
                  </label>
                )}
              </div>
            )}

            {/* Video (YouTube) */}
            {docFileType === "video" && (
              <div>
                <label className={labelCls}>Σύνδεσμος YouTube *</label>
                <input
                  className={inputCls}
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {getYouTubeId(videoUrl) && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-[#222]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeId(videoUrl)}/maxresdefault.jpg`}
                      alt="YouTube thumbnail"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
                <p className="mt-1.5 text-xs text-gray-600">Επικόλλησε σύνδεσμο YouTube βίντεο</p>
              </div>
            )}

          </div>
        )}

        {/* ── Fields hidden for document type ── */}
        {type !== "document" && (
          <>
            {/* Excerpt */}
            <div>
              <label className={labelCls}>Σύντομη Περιγραφή</label>
              <div className="relative">
                <textarea
                  ref={excerptRef}
                  className={`${inputCls} resize-none h-20 pr-12`}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Σύντομη περιγραφή..."
                />
                <div className="absolute top-2 right-2">
                  <EmojiPicker
                    onPick={(emoji) => insertAtCursor(excerptRef.current, excerpt, emoji, setExcerpt)}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className={labelCls}>Περιεχόμενο</label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>

            {/* Thumbnail upload — shown for articles/scouting always, and for tutorial+shorts */}
            {(type !== "tutorial" || isShorts) && (
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
                <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                  {isShorts ? (
                    <>Η εικόνα εμφανίζεται στην κάρτα της ανάρτησης (αναλογία 2:1). Οποιαδήποτε διάσταση γίνεται δεκτή — θα την προσαρμόσεις παρακάτω με τον cropper.</>
                  ) : (
                    <>Η εικόνα πρέπει να είναι ακριβώς <span className="text-gray-500 font-mono">{REQUIRED_THUMBNAIL_WIDTH} × {REQUIRED_THUMBNAIL_HEIGHT}</span> pixels (αναλογία 2:1). Προσαρμόστε την εικόνα σε αυτές τις διαστάσεις πριν τη μεταφόρτωση — π.χ. με Canva, Photoshop ή κάποιο online resizer.</>
                  )}
                </p>
              </div>
            )}

            {/* Video format dropdown */}
            <div>
              <label className={labelCls}>Μορφή Video</label>
              <select
                className={inputCls}
                value={videoFormat}
                onChange={(e) => setVideoFormat(e.target.value as "regular" | "shorts")}
              >
                <option value="regular">Κανονικό Video</option>
                <option value="shorts">Shorts</option>
              </select>
              <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                {isShorts
                  ? "Επικόλλησε σύνδεσμο YouTube Shorts (π.χ. youtube.com/shorts/...). Το video θα εμφανίζεται κάθετα (9:16)."
                  : "Κανονικό βίντεο σε YouTube — εμφανίζεται οριζόντια (16:9)."}
              </p>
            </div>

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
                  minZoom={0.5}
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
                    min={0.5}
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
          </>
        )}

        {uploading && <p className="text-[#F97316] text-sm">Μεταφόρτωση αρχείου...</p>}

        {/* Toggles */}
        <div className="flex gap-8">
          <Toggle checked={published} onChange={() => setPublished(!published)} label="Δημοσιευμένο" />
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
          {type !== "document" && (
            <button
              onClick={() => setShowPreview(true)}
              disabled={saving || uploading}
              className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333] hover:border-[#F97316] text-gray-400 hover:text-white disabled:opacity-60 px-6 py-3 rounded-xl transition-colors cursor-pointer text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              Προεπισκόπηση
            </button>
          )}
          <button
            onClick={() => router.push("/admin/posts")}
            className="bg-[#1A1A1A] border border-[#333] text-gray-400 hover:text-white px-6 py-3 rounded-xl transition-colors cursor-pointer text-sm"
          >
            Ακύρωση
          </button>
        </div>
      </div>
    </>
  );
}
