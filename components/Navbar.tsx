"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { href: "/", label: "Αρχική" },
  { href: "/articles", label: "Άρθρα" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/scouting", label: "Scouting" },
  { href: "/xrisima", label: "Χρήσιμα" },
  { href: "/myteam", label: "My Team" },
  { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0A0A0A]/95 backdrop-blur-md shadow-lg shadow-black/50" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <Image
            src="/assets/basketball-coach-logo-transparent.png"
            alt="Basketball Coach"
            width={56}
            height={56}
            priority
            className="h-12 w-auto object-contain"
          />
          <span
            className="hidden sm:inline-flex items-baseline gap-2 whitespace-nowrap"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
          >
            <span className="text-[#F97316] text-2xl">EFFECTIVE</span>
            <span className="text-white text-2xl">BASKETBALL</span>
          </span>
        </Link>

        {/* Desktop: links + admin icon grouped on the right */}
        <div className="hidden md:flex items-center gap-8 ml-auto">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-sm font-medium tracking-wide uppercase transition-colors duration-200 cursor-pointer ${
                    pathname === link.href ? "text-[#F97316]" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#F97316]"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu — opacity+y only, no height animation (avoids forced layout reflow) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="md:hidden bg-[#0A0A0A]/98 border-t border-[#222] overflow-hidden"
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block text-base font-medium uppercase tracking-wide cursor-pointer ${
                      pathname === link.href ? "text-[#F97316]" : "text-gray-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
