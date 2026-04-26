"use client";

import { useState, useRef, useEffect } from "react";

const EMOJIS = [
  // Basketball / sports / power
  "🏀", "🏆", "🥇", "🥈", "🥉", "🎯", "💪", "🔥", "⚡", "💯",
  // Reactions
  "😀", "😄", "😎", "🤩", "🥳", "😂", "🤔", "👀", "😱", "🙌",
  // Hands / approval
  "👍", "👎", "👏", "✊", "🤝", "🙏", "💥", "✨", "⭐", "🌟",
  // Hearts / status
  "❤️", "💙", "💚", "🧡", "💜", "🖤", "✅", "❌", "❓", "❗",
  // Misc useful
  "⏰", "📅", "📌", "📍", "🎉", "🎊", "🚀", "💡", "📈", "📊",
];

interface Props {
  onPick: (emoji: string) => void;
  align?: "left" | "right";
}

export default function EmojiPicker({ onPick, align = "right" }: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
        title="Εισαγωγή emoji"
        className="p-1.5 text-base leading-none rounded-lg text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-colors cursor-pointer"
      >
        <span aria-hidden>😀</span>
      </button>
      {open && (
        <div
          className={`absolute z-50 ${align === "right" ? "right-0" : "left-0"} top-full mt-1 bg-[#161616] border border-[#333] rounded-xl shadow-xl p-2 grid grid-cols-10 gap-0.5 w-[280px]`}
        >
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onMouseDown={(ev) => ev.preventDefault()}
              onClick={() => {
                onPick(e);
                setOpen(false);
              }}
              className="text-lg p-1 rounded hover:bg-[#2A2A2A] transition-colors cursor-pointer"
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
