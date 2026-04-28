"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { TeamSettings } from "@/lib/db";

export default function MyTeamPage({ settings }: { settings: TeamSettings }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[55] bg-black/90 flex flex-col items-center justify-center pt-20 pb-6 px-6"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt=""
            decoding="async"
            className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className="fixed top-24 right-4 bg-[#F97316] hover:bg-[#EA6D0E] text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Κλείσιμο
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 1, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1
            className="text-5xl md:text-7xl text-white mb-3"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            MY TEAM
          </h1>
          <div className="w-16 h-0.5 bg-[#F97316] mb-4" />
          <p className="text-gray-400 text-sm">Η τρέχουσα ομάδα του coach Στρατάκου</p>
        </motion.div>

        {/* Team Info */}
        {(settings.team_name || settings.division) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center gap-4 mb-12"
          >
            {settings.team_name && (
              <div className="bg-[#111] border border-[#222] rounded-2xl px-6 py-4 flex items-center gap-3 hover:border-[#F97316]/40 hover:shadow-[0_0_24px_rgba(249,115,22,0.12)] hover:scale-[1.03] transition-all duration-200">
                <svg className="w-5 h-5 text-[#F97316] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Ομάδα</p>
                  <p
                    className="text-white text-2xl leading-tight"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                  >
                    {settings.team_name}
                  </p>
                </div>
              </div>
            )}
            {settings.division && (
              <div className="bg-[#111] border border-[#222] rounded-2xl px-6 py-4 flex items-center gap-3 hover:border-[#F97316]/40 hover:shadow-[0_0_24px_rgba(249,115,22,0.12)] hover:scale-[1.03] transition-all duration-200">
                <svg className="w-5 h-5 text-[#F97316] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                </svg>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Κατηγορία</p>
                  <p
                    className="text-white text-2xl leading-tight"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                  >
                    {settings.division}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Photo Gallery */}
        {settings.photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.photos.map((url, i) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-[#222] hover:border-[#F97316]/40 hover:shadow-[0_0_24px_rgba(249,115,22,0.12)] transition-all duration-300 cursor-pointer aspect-video bg-[#1A1A1A]"
                onClick={() => setLightbox(url)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`${settings.team_name} - φωτογραφία ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-dashed border-[#333] rounded-2xl p-16 text-center"
          >
            <p
              className="text-2xl text-white mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              ΣΥΝΤΟΜΑ ΦΩΤΟΓΡΑΦΙΕΣ
            </p>
            <p className="text-gray-500 text-sm">Δεν υπάρχουν φωτογραφίες ακόμα</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
