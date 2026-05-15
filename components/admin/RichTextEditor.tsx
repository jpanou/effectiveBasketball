"use client";

import { useRef, useEffect, useState } from "react";
import EmojiPicker from "@/components/admin/EmojiPicker";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const PRESET_BG_COLORS = [
  "#FEF08A", "#FDE68A", "#FED7AA", "#FCA5A5",
  "#F9A8D4", "#D8B4FE", "#A5B4FC", "#93C5FD",
  "#67E8F9", "#6EE7B7", "#86EFAC", "#FFFFFF",
];

const PRESET_TEXT_COLORS = [
  "#FFFFFF", "#E5E7EB", "#9CA3AF", "#6B7280",
  "#F97316", "#EF4444", "#F59E0B", "#84CC16",
  "#22C55E", "#06B6D4", "#3B82F6", "#A855F7",
];

function ToolbarBtn({ onClick, title, children, className = "" }: { onClick: () => void; title: string; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`px-2.5 py-1.5 text-sm rounded text-gray-300 hover:text-white hover:bg-[#2A2A2A] transition-colors cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [lastBgColor, setLastBgColor] = useState<string | null>(null);
  const bgPickerRef = useRef<HTMLDivElement>(null);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [lastTextColor, setLastTextColor] = useState<string | null>(null);
  const textColorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || "";
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showBgPicker) return;
    function handleOutside(e: MouseEvent) {
      if (bgPickerRef.current && !bgPickerRef.current.contains(e.target as Node)) {
        setShowBgPicker(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showBgPicker]);

  useEffect(() => {
    if (!showTextColorPicker) return;
    function handleOutside(e: MouseEvent) {
      if (textColorPickerRef.current && !textColorPickerRef.current.contains(e.target as Node)) {
        setShowTextColorPicker(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showTextColorPicker]);

  function exec(cmd: string, arg?: string) {
    document.execCommand(cmd, false, arg);
    editorRef.current?.focus();
    sync();
  }

  function sync() {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function applyTextColor(color: string | null) {
    editorRef.current?.focus();
    if (color === null) {
      document.execCommand("foreColor", false, "inherit");
    } else {
      document.execCommand("foreColor", false, color);
      setLastTextColor(color);
    }
    setShowTextColorPicker(false);
    sync();
  }

  function applyBgColor(color: string | null) {
    editorRef.current?.focus();
    if (color === null) {
      document.execCommand("hiliteColor", false, "transparent");
    } else {
      document.execCommand("hiliteColor", false, color);
      setLastBgColor(color);
    }
    setShowBgPicker(false);
    sync();
  }

  return (
    <div className="border border-[#333] rounded-xl focus-within:border-[#F97316] transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-[#161616] border-b border-[#2A2A2A] rounded-t-xl">
        <ToolbarBtn onClick={() => exec("bold")} title="Bold" className="font-bold">B</ToolbarBtn>
        <ToolbarBtn onClick={() => exec("italic")} title="Italic" className="italic">I</ToolbarBtn>
        <ToolbarBtn onClick={() => exec("underline")} title="Underline" className="underline">U</ToolbarBtn>

        <span className="w-px h-5 bg-[#333] mx-1" />

        <ToolbarBtn
          onClick={() => {
            const url = window.prompt("Εισάγετε URL:");
            if (url) exec("createLink", url);
          }}
          title="Εισαγωγή συνδέσμου"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
          </svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("unlink")} title="Αφαίρεση συνδέσμου">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.181 8.68a4.503 4.503 0 0 1 1.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 0 0 6.364 6.365l3-3a4.5 4.5 0 0 0-6.364-6.365Zm9.256-8.43-.165.165a4.5 4.5 0 0 1 .386 6.175M16.5 7.5l-3.646 3.646M3.75 3.75l16.5 16.5" />
          </svg>
        </ToolbarBtn>

        <span className="w-px h-5 bg-[#333] mx-1" />

        <ToolbarBtn onClick={() => exec("formatBlock", "h2")} title="Heading 2">
          <span className="text-xs font-bold">H2</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("formatBlock", "h3")} title="Heading 3">
          <span className="text-xs font-bold">H3</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("formatBlock", "p")} title="Paragraph">
          <span className="text-xs">¶</span>
        </ToolbarBtn>

        <span className="w-px h-5 bg-[#333] mx-1" />

        <ToolbarBtn onClick={() => exec("insertUnorderedList")} title="Bullet list">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("insertOrderedList")} title="Numbered list">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm0 5.25h.007v.008H3.75V12Zm0 5.25h.007v.008H3.75v-.008Z" />
          </svg>
        </ToolbarBtn>

        <span className="w-px h-5 bg-[#333] mx-1" />

        {/* Text color picker */}
        <div ref={textColorPickerRef} className="relative">
          <button
            type="button"
            title="Χρώμα κειμένου"
            onMouseDown={(e) => { e.preventDefault(); setShowTextColorPicker((v) => !v); }}
            className="px-2.5 py-1.5 rounded text-gray-300 hover:text-white hover:bg-[#2A2A2A] transition-colors cursor-pointer flex flex-col items-center gap-0.5"
          >
            <span className="text-sm font-bold leading-none" style={{ color: lastTextColor ?? "#FFFFFF" }}>A</span>
            <div
              className="w-4 h-1 rounded-sm border border-black/20"
              style={{ backgroundColor: lastTextColor ?? "#FFFFFF" }}
            />
          </button>

          {showTextColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-[#1A1A1A] border border-[#333] rounded-xl p-3 shadow-2xl z-50 w-48">
              {/* Default color */}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); applyTextColor(null); }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-colors cursor-pointer mb-2"
              >
                <div className="w-5 h-5 rounded border border-[#444] flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </div>
                Προεπιλογή
              </button>

              {/* Preset swatches */}
              <div className="grid grid-cols-6 gap-1.5 mb-2">
                {PRESET_TEXT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    title={color}
                    onMouseDown={(e) => { e.preventDefault(); applyTextColor(color); }}
                    className="w-6 h-6 rounded cursor-pointer hover:scale-110 transition-transform border border-black/20 shrink-0"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Custom color */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#2A2A2A]">
                <span className="text-xs text-gray-500 shrink-0">Άλλο:</span>
                <input
                  type="color"
                  defaultValue={lastTextColor ?? "#FFFFFF"}
                  className="w-7 h-7 rounded cursor-pointer border border-[#333] bg-transparent p-0.5"
                  onInput={(e) => applyTextColor((e.target as HTMLInputElement).value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Background color picker */}
        <div ref={bgPickerRef} className="relative">
          <button
            type="button"
            title="Χρώμα φόντου κειμένου"
            onMouseDown={(e) => { e.preventDefault(); setShowBgPicker((v) => !v); }}
            className="px-2.5 py-1.5 rounded text-gray-300 hover:text-white hover:bg-[#2A2A2A] transition-colors cursor-pointer flex flex-col items-center gap-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
            </svg>
            <div
              className="w-4 h-1 rounded-sm border border-black/20"
              style={{ backgroundColor: lastBgColor ?? "#FEF08A" }}
            />
          </button>

          {showBgPicker && (
            <div className="absolute top-full left-0 mt-1 bg-[#1A1A1A] border border-[#333] rounded-xl p-3 shadow-2xl z-50 w-48">
              {/* No background */}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); applyBgColor(null); }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-colors cursor-pointer mb-2"
              >
                <div className="w-5 h-5 rounded border border-[#444] flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </div>
                Χωρίς φόντο
              </button>

              {/* Preset swatches */}
              <div className="grid grid-cols-6 gap-1.5 mb-2">
                {PRESET_BG_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    title={color}
                    onMouseDown={(e) => { e.preventDefault(); applyBgColor(color); }}
                    className="w-6 h-6 rounded cursor-pointer hover:scale-110 transition-transform border border-black/20 shrink-0"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Custom color */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#2A2A2A]">
                <span className="text-xs text-gray-500 shrink-0">Άλλο:</span>
                <input
                  type="color"
                  defaultValue={lastBgColor ?? "#FEF08A"}
                  className="w-7 h-7 rounded cursor-pointer border border-[#333] bg-transparent p-0.5"
                  onInput={(e) => applyBgColor((e.target as HTMLInputElement).value)}
                />
              </div>
            </div>
          )}
        </div>

        <span className="w-px h-5 bg-[#333] mx-1" />

        <ToolbarBtn onClick={() => exec("removeFormat")} title="Clear formatting">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 17.94 6M10.5 10.5 12 9l4.5 4.5-1.5 1.5m-4.5-4.5L6 18" />
          </svg>
        </ToolbarBtn>

        <span className="w-px h-5 bg-[#333] mx-1" />

        <ToolbarBtn onClick={() => exec("undo")} title="Undo">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("redo")} title="Redo">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
          </svg>
        </ToolbarBtn>

        <span className="w-px h-5 bg-[#333] mx-1" />

        <EmojiPicker
          onPick={(emoji) => {
            editorRef.current?.focus();
            document.execCommand("insertText", false, emoji);
            sync();
          }}
          align="right"
        />
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        className="min-h-64 max-h-[500px] overflow-y-auto p-4 text-sm text-gray-200 bg-[#1A1A1A] leading-relaxed outline-none rounded-b-xl
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-2 [&_h2]:mt-4
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mb-1 [&_h3]:mt-3
          [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2
          [&_li]:mb-0.5 [&_strong]:text-white [&_em]:italic [&_u]:underline
          [&_a]:text-[#F97316] [&_a]:underline [&_a]:cursor-pointer"
        data-placeholder="Γράψε το περιεχόμενο εδώ..."
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #4B5563;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
