"use client";

import { useState, useRef } from "react";
import { compressImage } from "@/lib/compressImage";

const isVideo = (url: string) => /\.(mp4|webm|mov|avi)$/i.test(url);
const isPdf = (url: string) => /\.pdf(\?|$)/i.test(url);

export default function AdminMediaLibrary({ initialFiles }: { initialFiles: string[] }) {
  const [files, setFiles] = useState<string[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleDelete(url: string) {
    if (!confirm("Να διαγραφεί οριστικά αυτό το αρχείο;")) return;
    setDeleting(url);
    setError(null);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Η διαγραφή απέτυχε");
        return;
      }
      setFiles((prev) => prev.filter((f) => f !== url));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Σφάλμα δικτύου");
    } finally {
      setDeleting(null);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith("video/")) {
      setError("Τα βίντεο δεν υποστηρίζονται. Χρησιμοποίησε YouTube.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(`Το αρχείο πρέπει να είναι μικρότερο από 5MB. (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const toUpload = file.type.startsWith("image/")
        ? await compressImage(file, { maxSizeMB: 0.6, maxWidthOrHeight: 1920 })
        : file;
      const urlRes = await fetch(`/api/admin/upload-url?name=${encodeURIComponent(file.name)}`);
      const urlData = await urlRes.json().catch(() => ({}));
      if (!urlRes.ok) throw new Error(urlData.error || `HTTP ${urlRes.status}`);
      const { signedUrl, publicUrl } = urlData as { signedUrl: string; publicUrl: string };

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: toUpload,
        headers: { "Content-Type": toUpload.type || "application/octet-stream" },
      });
      if (!uploadRes.ok) {
        const body = await uploadRes.text().catch(() => "");
        let detail = body;
        try { detail = JSON.parse(body)?.message || JSON.parse(body)?.error || body; } catch { /* raw */ }
        throw new Error(`Supabase: ${detail || uploadRes.status}`);
      }
      setFiles((prev) => [publicUrl, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Σφάλμα μεταφόρτωσης");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      {/* Upload */}
      <div className="mb-8">
        <label className={`inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA6D0E] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer text-sm ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          {uploading ? "Μεταφόρτωση..." : "Μεταφόρτωση Αρχείου"}
          <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleUpload} />
        </label>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </div>

      {files.length === 0 ? (
        <div className="border border-dashed border-[#333] rounded-2xl p-16 text-center">
          <p className="text-gray-600 text-sm">Δεν υπάρχουν αρχεία ακόμα</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((url) => (
            <div key={url} className="group relative bg-[#111] border border-[#222] rounded-xl overflow-hidden aspect-square">
              {isVideo(url) ? (
                <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A]">
                  <svg className="w-8 h-8 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
              ) : isPdf(url) ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#1A1A1A] gap-1">
                  <svg className="w-8 h-8 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">PDF</span>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={url} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(url)}
                  className="bg-[#F97316] text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer font-medium"
                >
                  {copied === url ? "Αντιγράφηκε!" : "Αντιγραφή URL"}
                </button>
                <button
                  onClick={() => handleDelete(url)}
                  disabled={deleting === url}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer font-medium"
                >
                  {deleting === url ? "Διαγραφή..." : "Διαγραφή"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
