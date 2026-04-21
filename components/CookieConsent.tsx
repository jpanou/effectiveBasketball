"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const STORAGE_KEY = "eb-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable — don't show banner
    }
  }, []);

  function decide(value: "accepted" | "declined") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 z-[60]"
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
        >
          <div className="max-w-5xl mx-auto bg-[#111] border border-[#222] rounded-2xl shadow-2xl shadow-black/60 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 text-sm text-gray-300 leading-relaxed">
              <p className="text-white mb-1 font-bold uppercase tracking-wider text-sm">
                COOKIES & ΑΠΟΡΡΗΤΟ
              </p>
              <p className="text-gray-400">
                Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σου στον ιστότοπο. Μπορείς να
                αποδεχτείς ή να απορρίψεις τη χρήση τους. Η επιλογή σου αποθηκεύεται τοπικά στον
                browser σου.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => decide("declined")}
                className="px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333] text-gray-300 hover:text-white hover:border-[#555] text-sm font-medium transition-colors cursor-pointer"
              >
                Απόρριψη
              </button>
              <button
                onClick={() => decide("accepted")}
                className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA6D0E] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Αποδοχή
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
