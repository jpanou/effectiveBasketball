"use client";

import { useState, useEffect } from "react";

export default function AdminSettings() {
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setCurrentUsername(data.username || "");
        setNewUsername(data.username || "");
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Οι κωδικοί δεν ταιριάζουν." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUsername, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Σφάλμα κατά την αποθήκευση." });
      } else {
        setCurrentUsername(newUsername);
        setNewPassword("");
        setConfirmPassword("");
        setStatus({ type: "success", message: "Τα στοιχεία ενημερώθηκαν επιτυχώς." });
      }
    } catch {
      setStatus({ type: "error", message: "Σφάλμα σύνδεσης." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
        <div className="mb-6">
          <p className="text-gray-500 text-sm">
            Τρέχον username:{" "}
            <span className="text-[#F97316] font-medium">{currentUsername}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Νέο Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
              className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#F97316] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Νέος Κωδικός</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Τουλάχιστον 6 χαρακτήρες"
              className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#F97316] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Επιβεβαίωση Κωδικού</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#F97316] transition-colors"
            />
          </div>

          {status && (
            <div
              className={`text-sm px-4 py-3 rounded-xl ${
                status.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F97316] hover:bg-[#ea6a0a] disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-colors duration-200 cursor-pointer text-sm"
          >
            {loading ? "Αποθήκευση..." : "Αποθήκευση Αλλαγών"}
          </button>
        </form>
      </div>
    </div>
  );
}
