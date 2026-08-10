"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/lib/blog";

const HEADER_OFFSET = 96; // sticky header (h-16) + breathing room

interface Props {
  label: string;
  variant: "mobile" | "sidebar";
  /** Server-rendered headings so the TOC is present in the initial HTML (no-JS, SEO). */
  headings: TocHeading[];
}

/**
 * Table of contents for a blog post.
 * - variant="mobile": collapsible <details> accordion, shown on small screens.
 * - variant="sidebar": sticky sidebar for desktop.
 * Headings come from the server (SSR); scrollspy is client-side via IntersectionObserver.
 */
export default function BlogToc({ label, variant, headings }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (headings.length === 0) return;
    setActiveId(headings[0].id);

    const lastId = headings[headings.length - 1].id;

    const activateBottomSection = () => {
      const doc = document.documentElement;
      const nearBottom = window.innerHeight + doc.scrollTop >= doc.scrollHeight - HEADER_OFFSET;
      if (nearBottom) setActiveId(lastId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId((entry.target as HTMLElement).id);
        }
      },
      {
        rootMargin: `-${HEADER_OFFSET}px 0px -60% 0px`,
        threshold: 0
      }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", activateBottomSection, { passive: true });
    window.addEventListener("resize", activateBottomSection);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", activateBottomSection);
      window.removeEventListener("resize", activateBottomSection);
    };
  }, [headings]);

  const scrollTo = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // Close the mobile accordion after choosing a section
    if (detailsRef.current) detailsRef.current.open = false;
    const el = document.getElementById(id);
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  if (headings.length === 0) return null;

  const list = (
    <nav aria-label={label} className="flex flex-col gap-0.5">
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={scrollTo(h.id)}
          aria-current={activeId === h.id ? "location" : undefined}
          className={cn(
            "rounded-md border-l-2 py-1 pr-2 text-sm leading-snug transition-colors",
            h.level === 3 && "pl-5",
            h.level === 2 && "pl-2 font-medium",
            activeId === h.id
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );

  if (variant === "sidebar") {
    return (
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {list}
      </div>
    );
  }

  return (
    <details ref={detailsRef} className="mb-6 rounded-xl border border-border bg-card px-4 py-3">
      <summary className="cursor-pointer list-none text-sm font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
        {label}
        <span className="ml-2 text-xs font-normal text-muted-foreground">{headings.length}</span>
      </summary>
      <div className="mt-3">{list}</div>
    </details>
  );
}
