"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import type { EmojiClickData } from "emoji-picker-react";

const EmojiPickerReact = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="bg-[#161616] border border-[#333] rounded-xl px-4 py-6 text-gray-500 text-xs w-[320px]">
      Φόρτωση…
    </div>
  ),
});

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
          className={`absolute z-50 ${align === "right" ? "right-0" : "left-0"} top-full mt-1`}
          onMouseDown={(e) => e.preventDefault()}
        >
          <EmojiPickerReact
            onEmojiClick={(data: EmojiClickData) => {
              onPick(data.emoji);
              setOpen(false);
            }}
            theme={"dark" as never}
            emojiStyle={"native" as never}
            lazyLoadEmojis
            width={320}
            height={400}
            searchPlaceholder="Αναζήτηση"
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </div>
  );
}
