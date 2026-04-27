import imageCompression from "browser-image-compression";

interface Options {
  // Max output size in MB (library iterates quality/size to hit this).
  maxSizeMB?: number;
  // Max width or height in pixels. Omit to keep original dimensions.
  maxWidthOrHeight?: number;
  // Output format. Defaults to JPEG for broad compatibility.
  fileType?: "image/jpeg" | "image/webp" | "image/png";
}

const SKIP_TYPES = new Set(["image/svg+xml", "image/gif"]);

export async function compressImage(file: File, opts: Options = {}): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (SKIP_TYPES.has(file.type)) return file;

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: opts.maxSizeMB ?? 1,
      maxWidthOrHeight: opts.maxWidthOrHeight,
      useWebWorker: true,
      fileType: opts.fileType ?? "image/jpeg",
      initialQuality: 0.85,
    });
    return compressed.size < file.size ? compressed : file;
  } catch {
    return file;
  }
}
