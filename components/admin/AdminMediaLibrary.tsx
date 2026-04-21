"use client";

import { useState, useRef } from "react";

const isVideo = (url: string) => /\.(mp4|webm|mov|avi)$/i.test(url);

export default function AdminMediaLibrary({ initialFiles }: { initialFiles: string[] }) {
  const [files, setFiles] = useState<string[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setFiles((prev) => [data.url, ...prev]);
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
          <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
        </label>
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
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={url} className="w-full h-full object-cover" />
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  onClick={() => copyUrl(url)}
                  className="bg-[#F97316] text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer font-medium"
                >
                  {copied === url ? "Αντιγράφηκε!" : "Αντιγραφή URL"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
