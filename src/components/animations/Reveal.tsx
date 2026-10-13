"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale" | "none";

// One shared observer for every Reveal on the page.
let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function observe(element: Element, onEnter: () => void) {
  if (typeof IntersectionObserver === "undefined") {
    onEnter();
    return () => {};
  }
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0 },
  );
  callbacks.set(element, onEnter);
  observer.observe(element);
  return () => {
    callbacks.delete(element);
    observer?.unobserve(element);
  };
}

/**
 * Reveals its content once as it scrolls into view, then keeps it visible.
 * Hiding is CSS-only and gated on `html.js`, so content renders without JS and
 * reduced-motion users get a plain opacity fade (see globals.css).
 */
export function Reveal({
  children,
  as = "div",
  dir = "up",
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  as?: "div" | "li" | "article" | "section" | "span";
  dir?: Direction;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    return observe(ref.current, () => setInView(true));
  }, []);

  const Tag = as as "div";
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className ? `reveal ${className}` : "reveal"}
      data-dir={dir}
      data-in={inView}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
