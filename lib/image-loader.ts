"use client";

export default function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  return `${src}?auto=format&fit=crop&w=${width}&q=${quality ?? 70}`;
}
