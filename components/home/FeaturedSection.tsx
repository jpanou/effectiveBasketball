"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { Post } from "@/lib/db";
import PostCard from "@/components/PostCard";

export default function FeaturedSection({ posts }: { posts: Post[] }) {
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
              ΕΠΙΛΕΓΜΕΝΟ ΠΕΡΙΕΧΟΜΕΝΟ
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
            <p className="text-gray-500 text-sm">
              Επιλεγμένο περιεχόμενο από τον coach Στρατάκο — σύντομα διαθέσιμο
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
