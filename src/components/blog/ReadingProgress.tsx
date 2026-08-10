"use client";

import { useEffect, useState } from "react";

/**
 * Thin progress bar fixed at the very top of the viewport.
 * Reflects how far through the page the reader has scrolled.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const current = max > 0 ? doc.scrollTop / max : 0;
      // Clamp to [0, 1] and round to avoid subpixel rerenders
      setProgress(Math.min(1, Math.max(0, current)));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-primary transition-[width] duration-100 ease-out motion-reduce:transition-none"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
