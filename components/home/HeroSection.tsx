"use client";

import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background video — hidden on mobile to avoid download on small screens */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover hidden sm:block"
        src="/assets/Stratakos_hero.mp4"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0A0A0A]" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-[#F97316] text-sm md:text-base tracking-[0.3em] uppercase font-medium mb-4">
            Coach Ιωάννης Γ. Στρατάκος
          </p>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-6 max-w-4xl mx-auto"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
          >
            WHERE REAL HOOPERS
            <br />
            <span className="text-[#F97316]">COME TO TALK BALL</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Δεν υπάρχει παλιό μπάσκετ, δεν υπάρχει σύγχρονο μπάσκετ, υπάρχει αποτελεσματικό μπάσκετ ! ! ! !
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-400 text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-[#F97316] to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
