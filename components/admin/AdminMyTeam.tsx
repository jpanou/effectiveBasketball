"use client";

import { useState, useEffect, useRef } from "react";

const inputCls =
  "w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#F97316] transition-colors";
const labelCls = "block text-sm text-gray-400 mb-1.5";

export default function AdminMyTeam() {
  const [teamName, setTeamName] = useState("");
  const [division, setDivision] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/team")
      .then((r) => r.json())
      .then((data) => {
        setTeamName(data.team_name ?? "");
        setDivision(data.division ?? "");
        setPhotos(data.photos ?? []);
      })
      .catch(() => {});
  }, []);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.size > 5 * 1024 * 1024) {
      setError(`Το αρχείο πρέπει να είναι μικρότερο από 5MB. (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setUploading(true);
    try {
      const urlRes = await fetch(`/api/admin/upload-url?name=${encodeURIComponent(file.name)}`);
      const urlData = await urlRes.json().catch(() => ({}));
      if (!urlRes.ok) throw new Error(urlData.error || `HTTP ${urlRes.status}`);
      const { signedUrl, publicUrl } = urlData as { signedUrl: string; publicUrl: string };

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });
      if (!uploadRes.ok) {
        const body = await uploadRes.text().catch(() => "");
        let detail = body;
        try { detail = JSON.parse(body)?.message || JSON.parse(body)?.error || body; } catch { /* raw */ }
        throw new Error(`Supabase: ${detail || uploadRes.status}`);
      }
      setPhotos((prev) => [...prev, publicUrl]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Σφάλμα μεταφόρτωσης");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removePhoto(url: string) {
    setPhotos((prev) => prev.filter((p) => p !== url));
  }

  async function handleSave() {
    if (!teamName.trim() || !division.trim()) {
      setError("Συμπλήρωσε όνομα ομάδας και κατηγορία.");
      return;
    }
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_name: teamName, division, photos }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setSuccess("Οι αλλαγές αποθηκεύτηκαν επιτυχώς.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Σφάλμα αποθήκευσης");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Team info */}
      <div className="bg-[#111] border border-[#222] rounded-2xl p-6 space-y-5">
        <h2
          className="text-lg text-white"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          ΠΛΗΡΟΦΟΡΙΕΣ ΟΜΑΔΑΣ
        </h2>

        <div>
          <label className={labelCls}>Όνομα Ομάδας</label>
          <input
            type="text"
            className={inputCls}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="π.χ. ΚΑΠ"
          />
        </div>

        <div>
          <label className={labelCls}>Κατηγορία</label>
          <input
            type="text"
            className={inputCls}
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            placeholder="π.χ. National League 2"
          />
        </div>
      </div>

      {/* Photos */}
      <div className="bg-[#111] border border-[#222] rounded-2xl p-6 space-y-5">
        <h2
          className="text-lg text-white"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          ΦΩΤΟΓΡΑΦΙΕΣ
        </h2>

        {photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((url, i) => (
              <div key={url} className="relative group aspect-video rounded-xl overflow-hidden border border-[#222]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Φωτογραφία ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(url)}
                  className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Αφαίρεση"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] hover:border-[#F97316]/50 text-gray-400 hover:text-white text-sm px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Μεταφόρτωση...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Προσθήκη Φωτογραφίας
            </>
          )}
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div className="text-sm px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm px-4 py-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20">
          {success}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#F97316] hover:bg-[#EA6D0E] disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer text-sm"
      >
        {saving ? "Αποθήκευση..." : "Αποθήκευση Αλλαγών"}
      </button>
    </div>
  );
}
