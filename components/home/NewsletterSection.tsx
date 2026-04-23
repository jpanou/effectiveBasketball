"use client";

import { useState } from "react";
import { motion } from "motion/react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMsg("Εγγραφήκατε επιτυχώς!");
        setEmail("");
      } else {
        setStatus("error");
        setMsg(data.error === "already_subscribed" ? "Το email είναι ήδη εγγεγραμμένο." : "Κάτι πήγε στραβά.");
      }
    } catch {
      setStatus("error");
      setMsg("Σφάλμα σύνδεσης.");
    }
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-4xl md:text-5xl text-white mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            STAY TUNED
          </h2>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            Εγγράψου στο newsletter και λάβε τα νέα άρθρα και tutorials απευθείας στο inbox σου
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#F97316]/10 border border-[#F97316]/30 rounded-xl p-6"
            >
              <p className="text-[#F97316] font-medium">{msg}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="newsletter-email" className="sr-only">Email</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Το email σου..."
                required
                className="flex-1 bg-[#111] border border-[#333] rounded-xl px-5 py-3.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#F97316] transition-colors duration-200"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[#F97316] hover:bg-[#EA6D0E] disabled:opacity-60 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer text-sm whitespace-nowrap"
              >
                {status === "loading" ? "..." : "Εγγραφή"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-red-400 text-sm">{msg}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
