"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { navLinks, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";

export function MobileMenu({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    // Move focus into the dialog once it has rendered.
    const frame = requestAnimationFrame(() => focusables()[0]?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
          className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-navy text-white lg:hidden"
        >
          <div aria-hidden className="grid-lines-dark pointer-events-none absolute inset-0" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full bg-glow/20 blur-3xl"
          />

          <div className="relative flex h-16 items-center justify-between px-6 pt-3 sm:mt-5 sm:px-8">
            <Link href="/" onClick={onClose} className="rounded-full">
              <Logo />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex size-12 items-center justify-center rounded-full border border-white/15 hover:bg-white/10"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <nav aria-label="Mobile" className="relative flex flex-1 flex-col justify-center px-6 py-10 sm:px-8">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <motion.li
                    key={link.href}
                    initial={reduce ? false : { opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * index + 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-baseline gap-4 rounded-2xl py-2 font-display text-[clamp(2.25rem,10vw,3.5rem)] font-semibold tracking-tight",
                        active ? "text-glow" : "text-white hover:text-fresh",
                      )}
                    >
                      <span className="font-mono text-xs tracking-widest text-white/40">
                        0{index + 1}
                      </span>
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <div className="relative flex flex-col gap-4 border-t border-white/10 px-6 py-8 sm:px-8">
            <Link
              href="/contact"
              onClick={onClose}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-glow px-6 font-medium text-navy"
            >
              Start a Project <ArrowRight aria-hidden className="size-4" />
            </Link>
            <p className="text-center text-sm text-white/50">{siteConfig.footerTagline}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
