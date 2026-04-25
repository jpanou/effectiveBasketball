"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

const types = [
  {
    href: "/articles",
    label: "Άρθρα",
    desc: "Αναλύσεις, απόψεις και βαθιά κατανόηση του παιχνιδιού",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    href: "/tutorials",
    label: "Tutorials",
    desc: "Βίντεο και οδηγοί για τεχνικές και τακτικές",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    href: "/scouting",
    label: "Scouting",
    desc: "Ανάλυση παικτών, ομάδων και αγωνιστικής στρατηγικής",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    href: "/eggrafa",
    label: "Έγγραφα",
    desc: "Φωτογραφίες, έγγραφα και αρχεία προς μελέτη",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
];

export default function ContentTypesSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <h2
          className="text-4xl md:text-5xl text-white mb-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          ΕΞΕΡΕΥΝΗΣΕ ΤΟ ΠΕΡΙΕΧΟΜΕΝΟ
        </h2>
        <div className="w-16 h-0.5 bg-[#F97316] mx-auto" />
      </motion.div>

      <div className="relative group/carousel">
        {/* Prev button */}
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Προηγούμενο"
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-5 z-10 w-10 h-10 rounded-full bg-[#111]/80 backdrop-blur-sm border border-[#333] items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0 transition-all duration-300 hover:border-[#F97316] hover:text-[#F97316] cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Embla viewport */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="-ml-6 flex">
            {types.map((item, i) => (
              <div
                key={item.href}
                className="pl-6 min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 h-full"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="h-full"
                >
                  <Link
                    href={item.href}
                    className="group flex flex-col h-full bg-[#111] border border-[#222] rounded-2xl p-8 hover:border-[#F97316]/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] transition-all duration-300 cursor-pointer"
                  >
                    <div className="text-[#F97316] mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">
                      {item.icon}
                    </div>
                    <h3
                      className="text-2xl md:text-3xl text-white mb-3 group-hover:text-[#F97316] transition-colors duration-200"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                    >
                      {item.label}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    <div className="mt-6 flex items-center gap-2 text-[#F97316] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="underline-offset-2 hover:underline cursor-pointer">Δες περισσότερα</span>
                    </div>
                  </Link>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Επόμενο"
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-5 z-10 w-10 h-10 rounded-full bg-[#111]/80 backdrop-blur-sm border border-[#333] items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0 transition-all duration-300 hover:border-[#F97316] hover:text-[#F97316] cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </section>
  );
}
