"use client";

import { useEffect, useRef, useState } from "react";
import { serviceDetails } from "@/lib/services";
import { cn } from "@/lib/cn";

/** Sticky category bar with scroll-spy. Selecting a category scrolls to it. */
export function ServiceNav() {
  const [active, setActive] = useState<string>(serviceDetails[0].id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = serviceDetails
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        // The first section (in page order) inside the focus band wins.
        const current = serviceDetails.find((s) => visible.has(s.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Keep the active chip visible inside the horizontally scrolling bar.
  useEffect(() => {
    const chip = listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    const list = listRef.current;
    if (!chip || !list) return;
    const target = chip.offsetLeft - list.clientWidth / 2 + chip.clientWidth / 2;
    list.scrollTo({ left: target, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="Service categories"
      className="sticky top-[5.25rem] z-40 px-3 sm:top-[6.25rem] sm:px-5"
    >
      <div className="mx-auto max-w-5xl rounded-full border border-line bg-white/85 p-1.5 shadow-[0_20px_40px_-28px_rgb(17_19_38/0.4)] backdrop-blur-xl">
        <ul ref={listRef} className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {serviceDetails.map((service) => {
            const isActive = active === service.id;
            return (
              <li key={service.id} data-id={service.id} className="shrink-0">
                <a
                  href={`#${service.id}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    const target = document.getElementById(service.id);
                    if (!target) return;
                    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
                    history.replaceState(null, "", `#${service.id}`);
                    setActive(service.id);
                    target.focus({ preventScroll: true });
                  }}
                  className={cn(
                    "flex min-h-10 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-300",
                    isActive ? "bg-ink text-white" : "text-ink/65 hover:bg-lilac hover:text-ink",
                  )}
                >
                  {service.navLabel}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
