// Strip all HTML tags — use for plain text fields (titles, slugs, names)
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

// Allow a safe subset of HTML — use for rich text content fields
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}
