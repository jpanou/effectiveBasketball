"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";
import type { Post } from "@/lib/db";
import PostCard from "@/components/PostCard";

export default function LatestPostsSection({ posts }: { posts: Post[] }) {
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
    <section className="py-20 px-6 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 mb-12"
        >
          <div className="text-center">
            <h2
              className="text-4xl md:text-5xl text-white mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              ΝΕΟΤΕΡΕΣ ΑΝΑΡΤΗΣΕΙΣ
            </h2>
            <div className="w-16 h-0.5 bg-[#F97316] mx-auto" />
          </div>
        </motion.div>

        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border border-dashed border-[#333] rounded-2xl p-16 text-center"
          >
            <div className="text-[#F97316] mb-4 flex justify-center">
              <svg className="w-12 h-12 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p
              className="text-2xl text-white mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              ΣΥΝΤΟΜΑ ΑΝΑΡΤΗΣΕΙΣ
            </p>
            <p className="text-gray-500 text-sm">Σύντομα διαθέσιμο περιεχόμενο</p>
          </motion.div>
        ) : (
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
                {posts.map((post, i) => (
                  <div
                    key={post.id}
                    className="pl-6 min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                    >
                      <PostCard post={post} />
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
        )}
      </div>
    </section>
  );
}
