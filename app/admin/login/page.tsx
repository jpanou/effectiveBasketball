"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EtherealShadow } from "@/components/ui/etheral-shadow";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Λανθασμένα στοιχεία σύνδεσης");
      }
    } catch {
      setError("Σφάλμα σύνδεσης");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0">
        <EtherealShadow
          color="rgba(249, 115, 22, 1)"
          animation={{ scale: 100, speed: 90 }}
          noise={{ opacity: 1, scale: 1.2 }}
          sizing="fill"
        />
      </div>
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <h1
            className="text-4xl text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            <span className="text-[#F97316]">EFFECTIVE</span> BASKETBALL
          </h1>
          <p className="text-gray-500 text-sm mt-2">Admin Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#111] border border-[#222] rounded-2xl p-8 space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm text-gray-400 mb-2">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F97316] transition-colors"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-gray-400 mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F97316] transition-colors"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F97316] hover:bg-[#EA6D0E] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors duration-200 cursor-pointer text-sm"
          >
            {loading ? "..." : "Σύνδεση"}
          </button>
        </form>
      </div>
    </div>
  );
}
