"use client";

export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // Photos uploaded from the admin are served by /uploads as-is.
  if (src.startsWith("/")) return `${src}?w=${width}`;
  // Unsplash resizes on its CDN.
  return `${src}?auto=format&fit=crop&w=${width}&q=${quality ?? 70}`;
}
