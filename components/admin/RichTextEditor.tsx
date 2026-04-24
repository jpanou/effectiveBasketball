"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || "";
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(cmd: string, arg?: string) {
    document.execCommand(cmd, false, arg);
    editorRef.current?.focus();
    sync();
  }

  function sync() {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  async function handleImageFile(file: File) {
    setUploadError("");
    if (!file.type.startsWith("image/")) {
      setUploadError("Μόνο αρχεία εικόνας επιτρέπονται.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError(`Η εικόνα πρέπει να είναι μικρότερη από 5MB. (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Η μεταφόρτωση απέτυχε");
        return;
      }
      if (data.url) {
        editorRef.current?.focus();
        document.execCommand(
          "insertHTML",
          false,
          `<img src="${data.url}" style="max-width:100%;border-radius:8px;margin:12px 0;display:block;" />`
        );
        sync();
      }
    } catch {
      setUploadError("Σφάλμα δικτύου κατά τη μεταφόρτωση.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="border border-[#333] rounded-xl overflow-hidden focus-within:border-[#F97316] transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-[#161616] border-b border-[#2A2A2A]">
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

        {/* Image upload */}
        <ToolbarBtn
          onClick={() => fileInputRef.current?.click()}
          title="Εισαγωγή εικόνας (max 5MB)"
          className={uploading ? "opacity-50 pointer-events-none" : ""}
        >
          {uploading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M18 1.5H6A4.5 4.5 0 0 0 1.5 6v12A4.5 4.5 0 0 0 6 22.5h12a4.5 4.5 0 0 0 4.5-4.5V6A4.5 4.5 0 0 0 18 1.5Zm-3.75 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
          )}
        </ToolbarBtn>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
        />

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
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        className="min-h-64 max-h-[500px] overflow-y-auto p-4 text-sm text-gray-200 bg-[#1A1A1A] leading-relaxed outline-none
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-2 [&_h2]:mt-4
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mb-1 [&_h3]:mt-3
          [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2
          [&_li]:mb-0.5 [&_strong]:text-white [&_em]:italic [&_u]:underline
          [&_a]:text-[#F97316] [&_a]:underline [&_a]:cursor-pointer
          [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2"
        data-placeholder="Γράψε το περιεχόμενο εδώ..."
      />

      {uploadError && (
        <p className="px-4 py-2 text-xs text-red-400 bg-[#1A1A1A] border-t border-[#2A2A2A]">{uploadError}</p>
      )}

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
